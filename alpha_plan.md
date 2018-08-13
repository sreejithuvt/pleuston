# Plankton frontend implementation plan for Alpha release

First, list of all related git-project issues related to the frontend:
* Publisher register new asset: https://github.com/oceanprotocol/ocean/issues/51
* Publisher set/update metadata: https://github.com/oceanprotocol/ocean/issues/54
* Publisher flow: https://github.com/oceanprotocol/ocean/issues/57
* Consumer flow: https://github.com/oceanprotocol/ocean/issues/56
* GUI design: https://github.com/oceanprotocol/ocean/issues/58
* Implement OEP-10 (auth): https://github.com/oceanprotocol/ocean/issues/60

**Note**: Some of the above tasks have some overlap and outdated specs.

The frontend functionality is split into 3 parts: Publisher, Consumer, and UI

## Features description

### Publisher 
Estimate: (2 days)

#### Asset registration and metadata updates
* Register new asset: #57
  * Register on-chain
  * Register on provider backend with metadata
* Update asset metadata on provider backend #54
* Set resource URL on the metadata

#### Relevant Keeper events and actions to take
* Subscribe to `newAssetRegistered` event from keeper Market contract #57 event:
  * Verify that a resource the publisher just registered gets broadcast in this event
* Subscribe to `resourcePurchaseFinalized` event from keeper-contracts OEP-10 #60 and #57 event:
  * Retrieve `consumerAddress` and `resourceId` update local storage with this info 


### Consumer 
Estimate: (4 days)

#### Relevant Keeper events and actions to take
* OceanACL.`AccessRequestCommitted` event handler
  * prompts the user to do one of these (after looking at the terms of access agreement):
      a. Submit payment for resource to complete purchase and unlock access to the resource: OceanMarket.`submitPayment` (this must happen automatically if the resource is free)
      b. Cancel request and close this transaction: OceanMarket.`cancelAccessRequest`
* OceanACL.`AccessRequestRejected`  event handler
  * Notify the user by updating the access request status/progress indicator
* OceanACL.`EncryptedTokenPublished` event handler
  * This is all under the hood, no action is required by the user in this step, but the UI should have indicator of progress and current status of the transaction
  * Fetch the published access token
  * Decrypt access token and sign it with consumer's account private key (or the temp private key)
  * Submit a `consumeResource` request to the Provider using `PROVIDER_URL` in the access token. This request includes the following:
    * `resourceId, signedAccessToken`
* Subscribe to `newAssetRegistered` event from keeper Market contract #57 event:
  * Retrieve resource metadata and update resources list view

#### Resources query functions
* Get list of all the new assetId’s: 
    PROVIDER.`getPublishedResources()` -> mapping of resourceId to metadata
* Get resource metadata: 
    PROVIDER.`getResourceMetadata(resourceId)`
* List consumer purchased assets (listen to keeper events) #43
  * To support this, the frontend can keep a list of `challengeIds` in local storage. The PROVIDER should also 
  provide such a list. But still there is an issue, if the local storage is lost, and the PROVIDER lost the data or 
  acting bad, the history of purchases/access should be retrievable from the keeper (the blockchain)
    

#### Accessing Resources (OEP-10 #60)
* Generate temp keys for resource access
* Express intent to access/purchase resource by calling OceanACL.`initiateAccessRequest`, include the following with this request (this is triggerd by clicking the [ Purchase ] button):
  * `resourceId, providerId, timeout, tempPublicKey`
* Submit payment for resource to complete purchase and unlock access to the resource: OceanMarket.`submitPayment`  (this must happen automatically if the resource is free)
* Cancel resource access request and close this transaction: OceanACL.`cancelAccessRequest`
* Get published access token: OceanACL.`getAccessToken`
* Decrypt access token
* Sign access token
* Consume resource using the provider_url from the access token and sending the signed access token in the consume request



### UI 
Estimate: (5 days)
* Home page
* Accounts list
* Active account with current balance
* List of own published resources (publisher view)
* List of resources available for purchase (consumer view)
* Resource detailed view (for either own resource or resource for sale)
  * If user's own resource, display number of purchases
* Purchase button
* Resource access agreement view
* Payment confirmation prompt
* Transaction history, list of purchased/accessed resources with dates and prices paid
* Resource purchase status/progress indicator:
  * Status: REQUEST PENDING, PROVIDER COMMITTED, PRICE PAID, ACCESS TOKEN PUBLISHED, DOWNLOADING
* Resource detailed view with access to resource data etc.
