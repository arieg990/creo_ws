var randomize = require('randomatic');

const generateAlphanumeric = (val) => {
	if (typeof val == "undefined") {
		val = 12
	}
	return randomize('Aa0', val);
}

const generateAlphaNumericSymbol = (val) => {
	if (typeof val == "undefined") {
		val = 12
	}
	return randomize('Aa0!', val);
}

const generateString = (val) => {
	if (typeof val == "undefined") {
		val = 12
	}
	return randomize('Aa', val);
}

const generateNumeric = (val) => {
	if (typeof val == "undefined") {
		val = 12
	}

	return randomize('0', val);
}

module.exports = {generateAlphanumeric, generateAlphaNumericSymbol, generateString, generateNumeric};