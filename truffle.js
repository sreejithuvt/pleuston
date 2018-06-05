import config from './src/config'

module.exports = {
    networks: {
    // config for solidity-coverage
        development: {
            host: config.keeperHost,
            port: config.keeperPort,
            network_id: '*', // Match any network id
            from: '0x00bd138abd70e2f00903268f3db08f2d25677c9e',
            gas: 2100000,
            //      gasPrice: 250,
        },
    },
}
