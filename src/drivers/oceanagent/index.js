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
        // .then(res => res.json())
        // TODO: check if response.status == 2XX
            .then(response => console.log('Success:', response))
    }
}
