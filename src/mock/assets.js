const mockAssets = [
    {
        'assetId': '0x1298371984723941',
        'publisherId': '0x0234242345',
        'base': {
            'name': 'UK Weather information 2011',
            'description': 'Weather information of UK including temperature and humidity',
            'size': '3.1gb',
            'dateCreated': '2012-02-01T10:55:11+00:00',
            'author': 'Met Office',
            'license': 'CC-BY',
            'copyrightHolder': 'Met Office',
            'encoding': 'UTF-8',
            'compression': 'zip',
            'contentType': 'text/csv',
            'workExample': `stationId,latitude,longitude,datetime,temperature,humidity\n
                423432fsd,51.509865,-0.118092,2011-01-01T10:55:11+00:00,7.2,68`,
            'contentUrls': ['https://testocnfiles.blob.core.windows.net/testfiles/testzkp.zip'],
            'links': [
                { 'sample1': 'http://data.ceda.ac.uk/badc/ukcp09/data/gridded-land-obs/gridded-land-obs-daily/' },
                { 'sample2': 'http://data.ceda.ac.uk/badc/ukcp09/data/gridded-land-obs/gridded-land-obs-averages-25km/' },
                { 'fieldsDescription': 'http://data.ceda.ac.uk/badc/ukcp09/' }
            ],
            'inLanguage': 'en',
            'tags': 'weather, uk, 2011, temperature, humidity',
            'price': 10
        },
        'curation': {
            'rating': 0.93,
            'numVotes': 123,
            'schema': 'Binary Voting'
        },
        'additionalInformation': {
            'updateFrequency': 'yearly',
            'structuredMarkup': [
                { 'uri': 'http://skos.um.es/unescothes/C01194/jsonld', 'mediaType': 'application/ld+json' },
                { 'uri': 'http://skos.um.es/unescothes/C01194/turtle', 'mediaType': 'text/turtle' }
            ]
        }
    }
]

export default mockAssets
