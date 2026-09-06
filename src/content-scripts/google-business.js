// business.google.com is a single-page app — navigating to the Reviews
// tab doesn't reload the page, it just swaps DOM content in via JS.
// A content script that only runs once on load would miss reviews
// that render in afterward, so we watch for changes instead.

function findReviewElements() {
  // data-review-id reliably marks each review, but sits on a small inner
  // wrapper — the actual row (name, text, reply button) is its parent.
  return Array.from(document.querySelectorAll('[data-review-id]'))
    .map(el => el.parentElement)
    .filter(Boolean)
}

function injectDraftButton(reviewEl) {
  if (reviewEl.querySelector('.reviewpilot-draft-btn')) return

  const btn = document.createElement('button')
  btn.textContent = 'Draft reply with AI'
  btn.className = 'reviewpilot-draft-btn'
  btn.onclick = () => requestDraft(reviewEl)

  // Place it right next to Google's own Reply button, not buried in the kebab menu.
  const replyContainer = reviewEl.querySelector('button[jsname="rhPddf"]')?.closest('div')
  ;(replyContainer ?? reviewEl).appendChild(btn)
}

function requestDraft(reviewEl) {
  const reviewText = reviewEl.querySelector('.oiQd1c[jsname="QUIPvd"]')?.innerText ?? ''
  const reviewId = reviewEl.querySelector('[data-review-id]')?.getAttribute('data-review-id') ?? ''

  chrome.runtime.sendMessage({ type: 'GENERATE_DRAFT', reviewText, reviewId }, (response) => {
    if (response?.draftText) {
      // Reply textarea selector still TBD — see below.
    }
  })
}