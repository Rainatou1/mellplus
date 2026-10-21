import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm'
import * as crypto from 'node:crypto'
import * as net from 'node:net'
import { z } from 'zod'
const base={name:'Koubriya',email:'visitor@example.test',phone:'12345678',subject:'Question',message:'Bonjour',type:'mixed',items:[{type:'custom',name:'Ordinateur',quantity:1,unitPrice:1,totalPrice:1}],turnstileToken:'fake-token',website:''}
async function setup(route='contact',options={}) {
 const calls={writes:0,emails:0,fetches:0}; let counters=new Map()
 const env={TURNSTILE_SECRET_KEY:'fake-secret',TURNSTILE_HOSTNAMES:'shop.example.test',ANTISPAM_HASH_SECRET:'fake-hash-secret',ANTISPAM_IP_HEADER:'x-real-ip',...options.env}
 const context=createContext({process:{env},console:{log(){},error(){},warn(){}},Buffer,URLSearchParams,AbortSignal,fetch:async()=>{calls.fetches++;if(options.outage) throw Error('offline'); return {ok:true,json:async()=>({success:!options.invalid && !(options.replay && calls.fetches>1),hostname:options.hostname||'shop.example.test',action:options.action||route})}}})
 const query=async (strings,key)=>{const count=(counters.get(key)||0)+1;counters.set(key,count);return [{count:options.limited?121:count}]}
 const create=async ({data})=>{if(options.dbFailure) throw Error('db offline');calls.writes++;return {...data,id:'fake-id'}}
 const prisma={contact:{create},quoteRequest:{create},$queryRaw:query,$transaction:async fn=>{const before=new Map(counters);try{return await fn(prisma)}catch(e){counters=before;throw e}}}
 const modules={}
 const synthetic=values=>new SyntheticModule(Object.keys(values),function(){for(const [key,value] of Object.entries(values)) this.setExport(key,value)},{context})
 const load=async path=>{if(modules[path])return modules[path];const m=new SourceTextModule(await readFile(new URL('../'+path,import.meta.url),'utf8'),{context});modules[path]=m;await m.link(async spec=>{
 if(spec==='node:crypto')return synthetic(crypto)
 if(spec==='node:net')return synthetic(net)
 if(spec==='zod')return synthetic({z})
 if(spec==='@/lib/antispam')return load('src/lib/antispam.js')
 if(spec==='@/lib/submissionSchemas')return load('src/lib/submissionSchemas.js')
 if(spec==='@/lib/prisma')return synthetic({prisma})
 if(spec==='next/server')return synthetic({NextResponse:{json:(body,opts)=>({body,...opts})}})
 if(spec==='next-auth')return synthetic({getServerSession:async()=>null})
 if(spec.includes('nextauth'))return synthetic({authOptions:{}})
 if(spec==='@/lib/email')return synthetic({isEmailConfigured:()=>true,...Object.fromEntries(['sendContactNotification','sendContactConfirmation','sendQuoteNotification','sendQuoteConfirmation'].map(key=>[key,async()=>{calls.emails++;return {success:true}}]))})
 throw Error(spec)
 });return m}
 const m=await load('src/app/api/'+route+'/route.js');await m.evaluate()
 return {calls,post:body=>m.namespace.POST({json:async()=>body,headers:{get:key=>key==='x-real-ip'?'192.0.2.1':null}}),load}
}
for(const route of ['contact','quotes']) {
 for(const name of ['Koubriya','Leïla','Abdou Rahmane','Oumarou-Seyni',"N’Djaména",'李']) test(`${route}: accepts Unicode name ${name} and preserves storage and notifications`,async()=>{const {post,calls}=await setup(route);assert.equal((await post({...base,name})).status,201);assert.equal(calls.writes,1);assert.equal(calls.emails,2)})
 for(const [label,patch,status] of [['email',{email:'bad'},400],['empty message',{message:'   '},400],['missing token',{turnstileToken:undefined},400],['honeypot',{website:'spam'},400],['long name',{name:'a'.repeat(151)},400],['repetition',{message:'a'.repeat(40)},400],['many links',{message:'https://example.test '.repeat(11)},400]]) test(`${route}: rejects ${label} on direct API call`,async()=>{const {post,calls}=await setup(route);assert.equal((await post({...base,...patch})).status,status);assert.equal(calls.writes,0);assert.equal(calls.emails,0)})
 for(const [label,options,status] of [['invalid token',{invalid:true},400],['wrong hostname',{hostname:'evil.test'},400],['wrong action',{action:'wrong'},400],['outage',{outage:true},503],['missing config',{env:{TURNSTILE_SECRET_KEY:''}},503],['rate limit',{limited:true},429],['db failure',{dbFailure:true},500]])test(`${route}: ${label} sends no emails`,async()=>{const {post,calls}=await setup(route,options);assert.equal((await post(base)).status,status);assert.equal(calls.emails,0)})
 test(`${route}: normalized duplicate produces one record and two emails`,async()=>{const {post,calls}=await setup(route);assert.equal((await post(base)).status,201);assert.equal((await post({...base,message:'  BONJOUR  '})).status,429);assert.equal(calls.writes,1);assert.equal(calls.emails,2)})
 test(`${route}: seventh distinct submission from same email is limited`,async()=>{const {post,calls}=await setup(route);for(let i=0;i<7;i++)assert.equal((await post({...base,message:'Bonjour '+i})).status,i<6?201:429);assert.equal(calls.writes,6)})
}
test('body parser rejects malformed or oversized JSON',async()=>{const {load}=await setup();const m=await load('src/lib/antispam.js');for(const body of ['{','x'.repeat(65537)])await assert.rejects(()=>m.namespace.readSubmission(new Request('https://example.test',{method:'POST',body})),e=>[400,413].includes(e.status))})
test('forms render responsive widget, hidden nonfocusable honeypot, and disable pending submit',async()=>{
 const component=await readFile(new URL('../src/components/SubmissionProtection.js',import.meta.url),'utf8');assert.match(component,/hidden aria-hidden="true"/);assert.match(component,/tabIndex=\{-1\}/);assert.match(component,/size:'flexible'/)
 for(const route of ['contact','devis']){const source=await readFile(new URL('../src/app/'+route+'/page.js',import.meta.url),'utf8');assert.match(source,/disabled=\{isSubmitting \|\| !turnstileToken\}/);assert.match(source,/SubmissionProtection action=/)}
})

for (const route of ['contact','quotes']) {
 test(route+': reused Turnstile token rejected before new storage or email', async()=>{
  const {post,calls}=await setup(route,{replay:true});assert.equal((await post(base)).status,201)
  assert.equal((await post({...base,message:'Autre demande'})).status,400)
  assert.equal(calls.writes,1);assert.equal(calls.emails,2)
 })
 test(route+': expired token refused according to Siteverify response',async()=>{
  const {post,calls}=await setup(route,{invalid:true});assert.equal((await post(base)).status,400);assert.equal(calls.emails,0)
 })
 test(route+': invalid IP proxy configuration fails closed',async()=>{
  const {post,calls}=await setup(route,{env:{ANTISPAM_IP_HEADER:'untrusted-missing'}});assert.equal((await post(base)).status,503);assert.equal(calls.writes,0);assert.equal(calls.emails,0)
 })
}
