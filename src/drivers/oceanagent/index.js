
export default class OceanAgent {

    constructor(connectionUrl) {
        this.assetsUrl = connectionUrl + '/assets'

    }

    async getAssetsMetadata() {
        const assets = await fetch(this.assetsUrl + '/metadata',
                { method: 'GET' })
                .then( data => { return data.json() })
        return JSON.parse(assets)
    }

    async publishDataAsset(asset) {
        fetch(this.assetsUrl + '/metadata',
            {
                method: 'POST',
                body: JSON.stringify(asset),
                headers: { 'Content-type': 'application/json' }
            })
            // .then(res => res.json())
            .then(response => console.log('Success:', response))

        }
}
