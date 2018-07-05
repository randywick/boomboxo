const fs = require('fs');
const path = require('path');
const testIfFileExists = require('../util/testIfFileExists');
const { EventEmitter } = require('events');
const { outputDirectory } = require('../../../config.json');

class BaseClass extends EventEmitter {

    constructor () {
        super();

        this.format = 'mp3';
        // this.checkForDownload();
    }

    get baseName () {
        return path.join(outputDirectory, String(this.digest));
    }

    get filename() {
        return `${this.baseName}.${this.format}`;
    }

    get isDownloaded () {
        return !!this.stat;
    }

    createFileReadStream () {
        return fs.createReadStream(this.filename);
    }

    async checkForDownload () {

        this.stat = await testIfFileExists(this.filename);

        if (this.stat) {
            this.emit('download-complete');
        }

        return this.stat;

    }

}

module.exports = BaseClass;

