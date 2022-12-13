const axios = require("axios");

const koiosUrl = 'https://api.koios.rest/api/v0'
const getAssetPolicyInfo = async (policyId) => {
  const url = `${koiosUrl}/asset_policy_info?_asset_policy=${policyId}`
  return axios.get(url)
}
const getAssetAddressList = async (policyId, assetName) => {
  const url = `${koiosUrl}/asset_address_list?_asset_policy=${policyId}&_asset_name=${assetName}`
  return axios.get(url)
}
const getAssetInfo = async (addresses) => {
  const url = `${koiosUrl}/address_info`
  return axios.post(
    url,
    {
      "_addresses": addresses
    }
  )
}

async function tvl() {
  const uniqNftPolicyId = "5f1dd3192cbdaa2c1a91560a6147466efb18d33a5d6516b266ce6b6f"
  const uniqNftAssetNames = (await getAssetPolicyInfo(uniqNftPolicyId))
    .data
    .map(o => o.asset_name)

  let uniqNftAddresses = new Set()
  for (let assetName of uniqNftAssetNames) {
    const addresses = (await getAssetAddressList(uniqNftPolicyId, assetName))
      .data
      .map(o => o.payment_address)
    for (let address of addresses) {
      uniqNftAddresses.add(address)
    }
  }

  const uniqNftAda = (await getAssetInfo(Array.from(uniqNftAddresses)))
    .data
    .map(o => o.balance / 1e6)
    .reduce((a, b) => a + b, 0)

  const openedPoolAddresses = [
    // 5k
    'addr1zy3fanq6phrjje84el2n0224d2v7956w0gvx4m6n999mlal8ucsr8rpyzewcf9jyf7gmjj052dednasdeznehw7aqc7q6tyyjy',
    // 10k
    'addr1zxj27jru7e96av4kcwv2gyf048e0fjzxdfst7aeythyjhc08ucsr8rpyzewcf9jyf7gmjj052dednasdeznehw7aqc7q8rgkm5',
    // 15k
    'addr1z9g45gtvs7zxju9weww4vpgpf3f6u2n733w9aaghav0kpm88ucsr8rpyzewcf9jyf7gmjj052dednasdeznehw7aqc7qf4zrg6'
  ]

  const openedPoolAda = (await getAssetInfo(openedPoolAddresses))
    .data
    .map(o => o.balance / 1e6)
    .reduce((a, b) => a + b, 0)

  return {
    cardano: uniqNftAda + openedPoolAda,
  };
}

module.exports = {
  timetravel: false,
  cardano: {
    tvl,
  },
};
