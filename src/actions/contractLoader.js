export default class ContractLoader {

    static contracts = [];

    static _doLoad(what, where) {
        //console.log("Loading", what, "from", where)
        return ContractLoader.contracts[what] = require(`@oceanprotocol/keeper-contracts/artifacts/${what}.${where}`)
    }

    static load(what, where) {
        return ContractLoader.contracts[what] || ContractLoader._doLoad(what, where)
    }
}
