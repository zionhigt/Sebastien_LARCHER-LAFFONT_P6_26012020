const fileStreamRotator = require('file-stream-rotator');
const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, 'save-log');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const logStream = fileStreamRotator.getStream({
	date_format: 'DDMMYY',
	filename: path.join(logDirectory, 'access-%DATE%.log'),
	frequence: 'daily',
	verbose: false
});

module.exports = logStream;