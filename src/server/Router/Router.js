const Audio = require('../Audio/Audio.js');
const Video = require('../Video/Video.js');

const router = require('express').Router();

router.get('/audio/:hash', async (req, res, next) => {
    const audio = Audio.findByKey(req.params.hash);

    if (await audio.checkForDownload()) {
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Length', audio.stat.size);
        res.statusCode = 200;

        const rs = audio.createFileReadStream();
        rs.on('end', () => res.end());
        rs.on('error', (err) => res.end());
        rs.pipe(res);

    } else {
        next(new Error('Not found'));
    }
});

module.exports = router;

