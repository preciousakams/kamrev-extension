// MV3 service workers are event-driven and go idle between messages —
// don't rely on any variable persisting between calls; use chrome.storage instead.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GENERATE_DRAFT') {
    generateDraft(message.reviewText).then(sendResponse)
    return true // keeps the async response channel open
  }
})

async function generateDraft(reviewText) {
  const { session } = await chrome.storage.local.get('session')
  if (!session) return { error: 'Not logged in' }

  const res = await fetch('https://YOUR-APP-DOMAIN/api/extension/draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ reviewText }),
  })

  return res.json()
}