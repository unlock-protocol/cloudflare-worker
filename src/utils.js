import { maxSignatureTime } from './config'

export const signatureTooOld = message => {
  if (!message) {
    return true
  }
  const match = message.match(/Time: (.*)/)
  if (!match) {
    return true
  }
  const signatureTime = new Date(match[1])
  if (
    new Date().getTime() - signatureTime.getTime() >
    maxSignatureTime * 1000
  ) {
    return true
  }
  return false
}
