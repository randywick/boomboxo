const express = require('express');
const corser = require('corser');
const routes = require('./Router/Router');

const app = express();

app.use(corser.create());

app.use(routes);

//app.use((req, res, next, err) => {
    //console.log('Error handler hit', err);
    //res.statusCode = 500;
    //res.json(err);
//});

app.listen(3100, () => {
    console.log('Listening on port 3100');
})
