var {Storage} = require('@google-cloud/storage');
var gcs = new Storage({
	keyFilename: './google-service.json'
})

var bucket = gcs.bucket('creative-event-organizer')


async function uploadFile(pathFile, base64File) {
	var file = bucket.file(pathFile)

	try {
		await file.save(base64File.data, {
			metada: {contentType:base64File.type},
			public:true,
			validation: 'md5'
		})
		return true
	} catch(err) {
		console.log(err)
		return false
	}
}

module.exports = {uploadFile};