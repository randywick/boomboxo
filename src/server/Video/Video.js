const adler32 = require('adler-32');
const BaseClass = require('../BaseClass/BaseClass');
const { spawn } = require('child_process');
const { saltKey, outputDirectory, downloadBinary } = require('../../../config.json');

class Video extends BaseClass {

    constructor (url) {
        super();

        this.url = url;
        this.digest = adler32.str(this.url, saltKey);

        this.checkForDownload();
    }

    async download () {
        if (!this.isDownloaded) {

            return new Promise((resolve, reject) => {
                const args = [
                    '-x',
                    this.url,
                    '--audio-format',
                    'mp3',
                    '-o',
                    this.filename,
                ];

                const child = spawn(downloadBinary, args);

                this.emit('download-start');

                child.stdout.on('data', chunk => {
                    const chunkString = chunk.toString();
                    if (/\r\[download\]\s*\d/.test(chunkString)) {
                        const pattern = /(^\r\[download\]\s*|\s+of\s+|\s+at\s+|\s+ETA\s+)/g;
                        const progressData = chunkString
                            .replace(pattern, ' ')
                            .split(' ')
                            .map(item => item.trim())
                            .filter(item => item.length);

                        const [percentComplete, totalSize, rate, remaining] = progressData;

                        if (rate !== 'in') {
                            this.emit('download-progress', {
                                percentComplete,
                                totalSize,
                                rate,
                                remaining,
                            });
                        }
                    }
                });
                child.stderr.on('data', chunk => console.error(chunk.toString()));

                child.on('exit', () => {
                    this.emit('download-end');
                    resolve();
                });

                child.on('error', () => {
                    this.emit('download-failed');
                    reject();
                });

            });

        // The file has already been downloaded
        } else {
            return Promise.resolve(false);
        }
    }

}

module.exports = Video;

