'use client'
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
export default function SubmissionProtection({ action, onToken, reset }) {
 const container=useRef(null)
 const widget=useRef(null)
 const callback=useRef(onToken); callback.current=onToken
 const [ready,setReady]=useState(false)
 const [failed,setFailed]=useState(false)
 const sitekey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
 useEffect(()=>{
  if(!ready || !sitekey || !window.turnstile || !container.current) return
  widget.current=window.turnstile.render(container.current,{sitekey,action,size:'flexible',callback:token=>{setFailed(false);callback.current(token)},'expired-callback':()=>callback.current(''),'error-callback':()=>{callback.current('');setFailed(true)}})
  return ()=>{if(widget.current!==null) window.turnstile?.remove(widget.current);widget.current=null}
 },[ready,sitekey,action])
 useEffect(()=>{callback.current(''); if(widget.current!==null) window.turnstile?.reset(widget.current)},[reset])
 return <>
  <div hidden aria-hidden="true"><label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>
  <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={()=>setReady(true)} onError={()=>setFailed(true)} />
  <div ref={container} className="w-full min-w-0" />
  {(!sitekey || failed) && <p role="alert">La verification anti-robot est indisponible. Veuillez reessayer plus tard ou nous contacter par telephone.</p>}
 </>
}
