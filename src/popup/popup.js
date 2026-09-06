document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const res = await fetch(
    'https://YOUR-PROJECT.supabase.co/auth/v1/token?grant_type=password',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: 'YOUR-SUPABASE-ANON-KEY' },
      body: JSON.stringify({ email, password }),
    }
  )
  const data = await res.json()

  if (data.access_token) {
    await chrome.storage.local.set({ session: data })
    showLoggedIn(data)
  }
})

function showLoggedIn(session) {
  document.getElementById('logged-out').style.display = 'none'
  document.getElementById('logged-in').style.display = 'block'
  document.getElementById('user-email').textContent = session.user?.email ?? ''
}

chrome.storage.local.get('session').then(({ session }) => {
  if (session) showLoggedIn(session)
})