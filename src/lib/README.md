# Heads Up!

This folder is a workaround so `create-react-app` can handle the transpilation of the BigchainDB drivers. Folder holds manually copied over files for:

- [js-driver-bigchaindb](https://github.com/bigchaindb/js-bigchaindb-driver)
- [js-driver-orm](https://github.com/bigchaindb/js-driver-orm)
- [decamelize](https://github.com/sindresorhus/decamelize)
- [eth-crypto](https://github.com/pubkey/eth-crypto)
- [eth-ecies](https://github.com/libertylocked/eth-ecies)
- [eth-lib](https://github.com/maiavictor/eth-lib)

Where all problematic `require` calls in those files are replaced by the local versions in this folder.
