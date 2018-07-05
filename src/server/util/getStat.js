const fs = require('fs');

module.exports = function getStat (pathname) {
    return new Promise((resolve, reject) => {
        fs.stat(pathname, (err, stat) => {
            if (err && err.code !== 'ENOENT') {
                reject(err);
            } else {
                resolve(stat);
            }
        });
    });
}
