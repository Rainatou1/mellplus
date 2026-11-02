'use client'

import { useEffect, useState } from 'react'

export default function AntiSpamFields() {
  const [startedAt, setStartedAt] = useState('')
  useEffect(() => { setStartedAt(String(Date.now())) }, [])

  return (
    <>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
      />
      <input type="hidden" name="formStartedAt" value={startedAt} />
    </>
  )
}
