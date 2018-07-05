const getStat = require('./getStat.js');

module.exports = async function testIfFileExists (filename) {
    const stat = await getStat(filename);

    return stat && stat.isFile() ? stat : false;
}
