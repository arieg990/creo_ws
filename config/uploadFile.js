var {Storage} = require('@google-cloud/storage');
var gcs = new Storage({
  projectId: 'creative-event-organizer',
  keyFilename: 'google-service.json'
})

var bucket = gcs.bucket('creo')


function uploadFile(pathFile, base64File) {
	var file = bucket.file(pathFile)

	file.save(base64File.data, {
		metada: {contentType:base64File.type},
		public:true,
		validation: 'md5'
	}, function(error) {
		if (error) {
			console.log(error)
			return false
		} else {
			return true
		}
	})
}

module.exports = {uploadFile};