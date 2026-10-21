import { createHmac } from 'node:crypto'
import { isIP } from 'node:net'
export class SubmissionError extends Error {
 constructor(status, message, reason) { super(message); this.status=status; this.reason=reason }
}
const unavailable=()=>new SubmissionError(503, 'Verification indisponible. Veuillez reessayer plus tard.', 'unavailable')
export function rejection(error) {
 if (!(error instanceof SubmissionError)) return null
 console.warn('submission_rejected', error.reason)
 return {status:error.status, body:{error:error.message}, headers:error.status===429?{'Retry-After':'600'}:{}}
}
export function sourceIP(request) {
 const value=process.env.ANTISPAM_IP_HEADER ? request.headers.get(process.env.ANTISPAM_IP_HEADER) : null
 return value && isIP(value.trim()) ? value.trim() : null
}
export async function readSubmission(request) {
 const reader=request.body?.getReader()
 if (!reader) return request.json()
 const chunks=[]; let size=0
 try {
  while(true) {const {done,value}=await reader.read(); if(done) break; size+=value.byteLength;
   if(size>65536) {await reader.cancel(); throw new SubmissionError(413,'Formulaire trop volumineux.','body_size')}
   chunks.push(Buffer.from(value))
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
 } catch(error) {if(error instanceof SubmissionError) throw error; throw new SubmissionError(400,'Formulaire invalide.','json')}
}
export async function verifySubmission(body, action, fetcher=fetch) {
 if (!body || typeof body!=='object' || Array.isArray(body)) throw new SubmissionError(400,'Formulaire invalide.','body')
 if(body.website!==undefined && (typeof body.website!=='string' || body.website.trim())) throw new SubmissionError(400,'Demande refusee. Veuillez verifier le formulaire.','honeypot')
 const secret=process.env.TURNSTILE_SECRET_KEY
 const hosts=process.env.TURNSTILE_HOSTNAMES?.split(',').map(h=>h.trim()).filter(Boolean)
 if(!secret || !hosts?.length || !process.env.ANTISPAM_HASH_SECRET || !process.env.ANTISPAM_IP_HEADER) throw unavailable()
 if(typeof body.turnstileToken!=='string' || !body.turnstileToken || body.turnstileToken.length>2048) throw new SubmissionError(400,'Veuillez renouveler la verification anti-robot.','token_missing')
 let result
 try {
  const response=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret,response:body.turnstileToken}),signal:AbortSignal.timeout(8000)})
  if(!response.ok) throw unavailable()
  result=await response.json()
 } catch {throw unavailable()}
 if(result?.success!==true || result.action!==action || !hosts.includes(result.hostname)) throw new SubmissionError(400,'Veuillez renouveler la verification anti-robot.','token_invalid')
}
const normalize=value=>value.normalize('NFKC').toLowerCase().replace(/\s+/gu,' ').trim()
export async function storeSubmission(prisma,request,data,action,create) {
 const ip=sourceIP(request)
 if(!ip || !process.env.ANTISPAM_HASH_SECRET) throw unavailable()
 const hash=value=>createHmac('sha256',process.env.ANTISPAM_HASH_SECRET).update(value).digest('hex')
 const fingerprint=hash(JSON.stringify([normalize(data.email),normalize(data.message||''),normalize(data.subject||''),data.items?.map(i=>[i.id,normalize(i.name),i.quantity])]))
 const keys=[{key:hash('ip:'+ip),limit:60},{key:hash('email:'+normalize(data.email)),limit:6},{key:hash('duplicate:'+action+':'+fingerprint),limit:1}].sort((a,b)=>a.key.localeCompare(b.key))
 return prisma.$transaction(async tx=>{
  for(const {key,limit} of keys) {
   const rows=await tx.$queryRaw`INSERT INTO "SubmissionGuard" ("key","count","expiresAt") VALUES (${key},1,NOW()+INTERVAL '10 minutes')
    ON CONFLICT ("key") DO UPDATE SET "count"=CASE WHEN "SubmissionGuard"."expiresAt"<=NOW() THEN 1 ELSE "SubmissionGuard"."count"+1 END,
    "expiresAt"=CASE WHEN "SubmissionGuard"."expiresAt"<=NOW() THEN NOW()+INTERVAL '10 minutes' ELSE "SubmissionGuard"."expiresAt" END RETURNING "count"`
   if(rows[0].count>limit) throw new SubmissionError(429,'Demande deja recue ou trop de tentatives. Veuillez patienter dix minutes.','rate_or_duplicate')
  }
  return create(tx)
 })
}

export async function limitAttempts(prisma, request) {
 const ip=sourceIP(request)
 if(!ip || !process.env.ANTISPAM_HASH_SECRET) throw unavailable()
 const key=createHmac('sha256',process.env.ANTISPAM_HASH_SECRET).update('attempt:'+ip).digest('hex')
 const rows=await prisma.$queryRaw`INSERT INTO "SubmissionGuard" ("key","count","expiresAt") VALUES (${key},1,NOW()+INTERVAL '10 minutes') ON CONFLICT ("key") DO UPDATE SET "count"=CASE WHEN "SubmissionGuard"."expiresAt"<=NOW() THEN 1 ELSE LEAST("SubmissionGuard"."count"+1,121) END, "expiresAt"=CASE WHEN "SubmissionGuard"."expiresAt"<=NOW() THEN NOW()+INTERVAL '10 minutes' ELSE "SubmissionGuard"."expiresAt" END RETURNING "count"`
 if(rows[0].count>120) throw new SubmissionError(429,'Trop de tentatives. Veuillez patienter dix minutes.','attempt_limit')
}
