module.exports = {

    // -----
    // Setup with local services
    // -----
    keeperScheme: 'http',
    keeperHost: 'localhost',
    keeperPort: 8545,

    dbScheme: 'http',
    dbHost: 'localhost',
    dbHeaders: {},
    dbPort: 9984,
    ocnScheme: 'http',
    ocnHost: 'localhost',
    ocnPort: 5000,

    // -----
    // Setup using remote services
    // -----
    // private ocean test net @40.115.16.244
    // keeperScheme: 'https',
    // keeperHost: '40.115.16.244',
    // keeperPort: 8545,
    // dbPort: '',
    // dbScheme: 'https',
    // dbHost: 'test.bigchaindb.com',
    // dbHeaders: {
    //     // Get new credentials from testnet.bigchaindb.com
    //     app_id: '54ed26dd',
    //     app_key: 'd068996d8d5b1a66cfc61dc3a83fa7ee'
    // },
    dbNamespace: 'ocean:plankton:v0.0.0:asset:metadata'
    // ocnScheme: 'https',
    // ocnHost: '',
    // ocnPort: 3000,

}
