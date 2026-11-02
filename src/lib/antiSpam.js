export function isSpamSubmission(body, now = Date.now()) {
  if (!body || typeof body !== 'object') return true
  if (body.website !== undefined && body.website !== '') return true
  const startedAt = Number(body.formStartedAt)
  return !Number.isFinite(startedAt) || startedAt <= 0 || now - startedAt < 3000
}
