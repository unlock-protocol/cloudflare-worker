import { paywallConfig } from './config'

export const redirectToPurchase = (digest, request) => {
  const redirectBack = new URL(request.url)
  redirectBack.searchParams.append('digest', digest)
  const redirectUrl = new URL('https://app.unlock-protocol.com/checkout')
  paywallConfig.messageToSign = digest
  redirectUrl.searchParams.append(
    'paywallConfig',
    JSON.stringify(paywallConfig),
  )
  redirectUrl.searchParams.append('redirectUri', redirectBack.toString())
  return Response.redirect(redirectUrl.toString(), 302)
}
