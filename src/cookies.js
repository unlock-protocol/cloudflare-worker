const prefix = 'UnlockWorker_'

export const extract = request => {
  const cookiesHeader = request.headers.get('Cookie') || ''
  if (!cookiesHeader) {
    return {}
  }

  const cookies = Object.fromEntries(
    cookiesHeader.split('; ').map(x => x.split('=')),
  )

  const requestUrl = new URL(request.url)

  let signature = cookies[`${prefix}signature`]
    ? decodeURIComponent(cookies[`${prefix}signature`])
    : ''
  let digest = cookies[`${prefix}message`]
    ? decodeURIComponent(cookies[`${prefix}message`])
    : ''

  return {
    signature,
    digest,
  }
}

/**
 * Adds cookies to the response!
 * @param {*} response
 * @param {*} signature
 * @param {*} digest
 * @returns
 */
export const setSignatureAndMessage = (response, signature, digest) => {
  const workerResponse = new Response(response.body, response)

  workerResponse.headers.append(
    'Set-Cookie',
    `${prefix}signature=${encodeURIComponent(signature)};path=/`,
  )

  workerResponse.headers.append(
    'Set-Cookie',
    `${prefix}message=${encodeURIComponent(digest)};path=/`,
  )
  return workerResponse
}
