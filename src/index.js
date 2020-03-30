const paywall = require('@unlock-protocol/paywall')

// Can we use the Cloudflare endpoint here?
const readOnlyProvider = 'https://eth-mainnet.alchemyapi.io/jsonrpc/6idtzGwDtRbzil3s6QbYHr2Q_WBfn100'

// This is used for "optimistic" unlocking: a service which ensures that "pending" transactions
// are still taken into account to unlock a page.
const locksmithUri = 'https://locksmith.unlock-protocol.com/'

// This is the config for Unlock's.
// You can change it to ask members to submit their email addresses or support credit cards
// payments
// See https://docs.unlock-protocol.com/#configure-the-paywall
const unlockConfig = {
  icon: 'https://app.unlock-protocol.com/static/images/svg/default.svg',
  persistentCheckout: true,
  locks: {
    "0xB0114bbDCe17e0AF91b2Be32916a1e236cf6034F": { }
  },
  callToAction: {
    default: 'This content is locked. You need to purchase a membership in order to access it.',
    expired: 'Your previous membership has expired. Please, purchase a new one to access this content.',
    noWallet: 'This is content is locked. You need to use a crypto wallet in order to unlock it.',
  }
}

// The handler which acts as an entry point for Cloudflare's worker.
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  // Extract the cookies
  const cookiesHeader = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(cookiesHeader.split('; ').map(x => x.split('=')))

  // If a cookie includes an Unlock account
  // (note: a more "secure" version should ask the user to sign a message... and we could
  // extract the signer rather than 'trust' the cookie.
  if (cookies.unlockAccount) {
    // Let's check that this user has a valid key
    // Convenience library which checks membership on chain.
    // Note: this could be cached (for a few hours?) thru Cloudflare workers' key/value stores
    const unlocked = await paywall.isUnlocked(
      cookies.unlockAccount,
      unlockConfig,
      {
        readOnlyProvider,
        locksmithUri,
      }
    )
    // If the page is unlocked, we just 'resume' loading of the content
    // Improvment: use a counter to provide a metered approach!
    if (unlocked) {
      return fetch(request)
    }
  }

  // If the user cannot be identified through cookies, or if they do not have a valid key
  // We just show them a page indicating that they need to checkout.
  // In a future version, we could also use a "splas" screen from the proxied website to make sure the UI
  // stays consistent.
  const doc = `
<html>
  <head>
    <title>Locked page!</title>

    <script> (function(d, s) {
      var js = d.createElement(s),
      sc = d.getElementsByTagName(s)[0];
      js.src="https://paywall.unlock-protocol.com/static/unlock.latest.min.js";
      sc.parentNode.insertBefore(js, sc); }(document, "script"));
    </script>

    <script>
      var unlockProtocolConfig = ${JSON.stringify(unlockConfig)}
    </script>
  </head>

  <body>
    <script>
      window.addEventListener('unlockProtocol', function(e) {
        var state = e.detail
        if (state === 'locked') {
          // We load the Unlock checkout modal
          window.unlockProtocol.loadCheckoutModal();
        } else if (state === 'unlocked') {
          // Let's set a cookie based on the user's address
          document.cookie = 'unlockAccount=' + unlockProtocol.getUserAccountAddress();
          // We should then reload the page...
          window.location.reload();
        }
      })
    </script>
  </body>
</html>
`
  // Render the template and use HTTP status 402 (payment required!)
  return new Response(doc, { status: 402, headers: { 'Content-type': 'text/html' } })

}