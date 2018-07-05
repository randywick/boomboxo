const fs = require('fs');
const path = require('path');
const BaseClass = require('../BaseClass/BaseClass');

class Audio extends BaseClass {

    constructor ({ digest }) {
        super();

        this.digest = digest;
        this.checkForDownload();
    }

    static findByKey (key) {
        return new Audio({ digest: key });
    }

}

module.exports = Audio;

