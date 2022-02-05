import { ethers } from 'ethers'
import { providers } from './config'

/**
 * Wrapper around getHasValidKey
 * @param {*} provider
 * @param {*} lock
 * @param {*} userAddress
 * @returns
 */
export const getHasValidKey = async (network, lockAddress, userAddress) => {
  const ABI = [
    {
      constant: true,
      inputs: [{ internalType: 'address', name: '_keyOwner', type: 'address' }],
      name: 'getHasValidKey',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ]
  const provider = new ethers.providers.JsonRpcProvider(
    providers[network],
    network,
  )
  const contract = new ethers.Contract(lockAddress, ABI, provider)

  return await contract.getHasValidKey(userAddress)
}
