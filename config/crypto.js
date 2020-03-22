const crypto = require('crypto');
const { base64encode, base64decode } = require('nodejs-base64');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];


const hmacHash = (value) => {
	const hmac = crypto.createHmac('sha256', config.secret);
	return hmac.update(value).digest('hex');
}

const validationHmac = (ip, auth) => {
	var encrypt = hmacHash(ip);

	if (encrypt != auth) {
		return false;
	} else {
		return true;
	}
}

const base64Encode= (val) => {
	return base64encode(val);
}

function decodeBase64Image(dataString) 
{
	console.log('masuk')
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	var response = {};
	var imageTypeRegularExpression      = /\/(.*?)$/;

	if (matches.length !== 3) 
	{
		return new Error('Invalid input string');
	}

	response.type = matches[1].match(imageTypeRegularExpression)[1];
	response.data = Buffer.from(matches[2], 'base64');

	return response;
}

module.exports = {hmacHash, validationHmac, base64Encode, decodeBase64Image};