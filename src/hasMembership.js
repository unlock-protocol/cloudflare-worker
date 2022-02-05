import { paywallConfig } from './config'
import { getHasValidKey } from './lock'

/**
 * Return true if the user has at least one membership!
 * @param {*} paywallConfig
 */
const hasMembership = async address => {
  const promises = Object.keys(paywallConfig.locks).map(lockAddress =>
    getHasValidKey(
      paywallConfig.locks[lockAddress].network,
      lockAddress,
      address,
    ),
  )
  const results = await Promise.all(promises)
  return !![results].find(x => x)
}

export default hasMembership
