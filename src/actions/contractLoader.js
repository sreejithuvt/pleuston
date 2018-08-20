const contracts = []

export default class ContractLoader {
    static _doLoad(what, where) {
        // console.log("Loading", what, "from", where)
        contracts[what] = require(`@oceanprotocol/keeper-contracts/artifacts/${what}.${where}`)
        return contracts[what]
    }

    static load(what, where) {
        return contracts[what] || ContractLoader._doLoad(what, where)
    }
}
