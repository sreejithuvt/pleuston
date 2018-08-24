/* global fetch */
/* eslint-disable no-console */

export default class OceanAgent {
    constructor(connectionUrl) {
        this.assetsUrl = connectionUrl + '/assets'
    }

    getAssetsMetadata() {
        return fetch(this.assetsUrl + '/metadata', { method: 'GET' })
            .then(res => res.json())
            .then(data => JSON.parse(data))
    }

    publishDataAsset(asset) {
        return fetch(this.assetsUrl + '/metadata',
            {
                method: 'POST',
                body: JSON.stringify(asset),
                headers: { 'Content-type': 'application/json' }
            })
            .then(response => {
                console.log('Success:', response)
                if (response.ok) {
                    console.log('Success:', response)
                    return true
                }
                console.log('Failed: ', response.status, response.statusText)
                return false
                // throw new Error(response.statusText ? response.statusText : `publish asset failed with status ${response.status}`)
            })
            .catch(error => {
                console.log(`Publish asset to ocean database could not be completed: ${error.message()}`)
                return false
            })
    }
}
