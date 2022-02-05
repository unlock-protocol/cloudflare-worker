import { ethers } from 'ethers'
import { paywallConfig } from './config'
import hasMembership from '../src/hasMembership'
import { extract, setSignatureAndMessage } from './cookies'
import { redirectToPurchase } from './redirects'
import { signatureTooOld } from './utils'

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
  let { signature, digest } = extract(request)
  const requestUrl = new URL(request.url)

  if (
    requestUrl.searchParams.get('signature') &&
    requestUrl.searchParams.get('digest')
  ) {
    signature = requestUrl.searchParams.get('signature')
    digest = requestUrl.searchParams.get('digest')
  }

  const messageToSign = `Signing into ${
    requestUrl.hostname
  }\nTime: ${new Date().toISOString()}`

  if (!signature) {
    // we need a new message to sign
    // TODO:
    // - add nonce to make signature more robust and prevent re-use in case cookies
    // got leaked.
    // - sign message to be signed so we know it's coming from us
    return redirectToPurchase(messageToSign, request)
  }

  if (signatureTooOld(digest)) {
    return redirectToPurchase(messageToSign, request)
  }

  const address = ethers.utils.verifyMessage(digest, signature)
  // Check if user should have access
  const hasAccess = await hasMembership(address)

  if (!hasAccess) {
    return redirectToPurchase(messageToSign, request)
  }

  const response = await fetch(request)
  return setSignatureAndMessage(response, signature, messageToSign)
}
