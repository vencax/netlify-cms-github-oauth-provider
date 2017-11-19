function ready (fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

function openAuthPopup (e) {
  e.preventDefault()
  e.stopPropagation()

  const authPopup = window.open(
    '/auth',
    'auth-dialog',
    'width=700,height=530,left=300,top=300,toolbar=no,location=no,resizable'
  )

  function receiveAuth (e) {
    console.log(e.data)
    window.removeEventListener('message', receiveAuth)
    authPopup.close()
  }

  function handshakeAuth (e) {
    authPopup.postMessage('authorizing', e.origin)
    window.addEventListener('message', receiveAuth)
    window.removeEventListener('message', handshakeAuth)
  }

  window.addEventListener('message', handshakeAuth, false)

  authPopup.focus()
}

function main () {
  const authButton = document.querySelector('.open-auth-dialog')
  authButton.addEventListener('click', openAuthPopup)
}

ready(main)
