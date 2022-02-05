// Configure UI on checkout modal
// https://docs.unlock-protocol.com/unlock/developers/paywall/configuring-checkout
export const paywallConfig = {
  locks: {
    '0x889559AD98a3438bA6D471491A8Cd9c7C4c640b6': {
      network: 4,
    },
  },
  pessimistic: true,
}

// Enter RPC providers
export const providers = {
  1: '',
  4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  100: '',
  10: '',
  // ...
}

// (in seconds) Forces re-authentication after maxSignatureTime
export const maxSignatureTime = 60 * 60 * 24 // 1 day
