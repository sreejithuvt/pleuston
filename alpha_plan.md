# Plankton frontend implementation plan for Alpha release

First, list of all related git-project issues related to the frontend:
* Publisher register new asset: https://github.com/oceanprotocol/ocean/issues/51
* Publisher set/update metadata: https://github.com/oceanprotocol/ocean/issues/54
* Publisher flow: https://github.com/oceanprotocol/ocean/issues/57
* Consumer flow: https://github.com/oceanprotocol/ocean/issues/56
* GUI design: https://github.com/oceanprotocol/ocean/issues/58
* Implement OEP-10 (auth): https://github.com/oceanprotocol/ocean/issues/60

**Note**: Some of the above tasks have some overlap and outdated specs.

The frontend functionality is spread between 3 parts: Publisher, Consumer, and UI
## Features description

### Publisher 
Estimate: (2 days)
* Register new asset: #57
  * Register on-chain
  * Register on provider backend with metadata
* Update asset metadata on provider backend #54
* Subscribe to `newAssetRegistered` event from keeper-contracts #57
* Subscribe to `resourcePurchasePaid` event from keeper-contracts OEP-10 #60 and #57


### Consumer 
Estimate: (4 days)
* Subscribe to all the new assets registered (AssetRegistered event), getting the list of all the new assetId’s
* Fetch the Metadata of a list of Assets from the provider backend
* List consumer purchased assets (listen to keeper events) #43
* Resource purchase/access OEP-10 #60:
    * Subscribe to `resourcePurchaseAgreementPublished` event from OAC
    * Subscribe to `resourcePurchasePaid` event from OMKT to get the purchase receipt
    * Subscribe to `resourceAccessTokenReady`event from OAC to get the encrypted resource access token
    * Express intent to purchase resource by calling `purchaseResource` on OAC
    * Pay price for resource to gain access to the resource: `payResourcePurchasePrice` on OMKT
    * Publish purchase public key to be used for encrypting the resource access token: `publishPurchaseKey` on OAC
    * Fetch the resource access token with `getResourceAccessToken` on OAC
    * Decrypt the resource access token
    * Consume purchased resource using the resource access token (signed by consumer key): `consumeResource` on PROV


### UI 
Estimate: (5 days)
* Accounts list
* Active account with current balance
* List of own published resources
* List of resources available for purchase
* Resource detailed view (for either own resource or resource for sale)
* Purchase button
* Resource purchase agreement view
* Payment confirmation prompt
* Transaction history, list of purchased/accessed resources with dates and prices paid
* Resource download progress
* Resource detailed view with access to resource data etc.
