require('dotenv').config({silent: true});

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');

const moment = require('moment-timezone');
const serialize = require('serialize-javascript');

moment.tz.setDefault('UTC');

app.use('/public', express.static(path.join(__dirname, 'public')));

let renderer;

if (process.env.NODE_ENV === 'production'){
  let bundle = fs.readFileSync('./dist/node/bundle.js', 'utf8');
  renderer = require('vue-server-renderer').createBundleRenderer(bundle);

  app.use('/', express.static(path.join(__dirname, 'dist')));
}

let events = [
  {description: 'rand event 1', date: moment()},
  {description: 'rand event 2', date: moment()},
  {description: 'rand event 3 ', date: moment()}
]
app.get('/', (req, res) => {
  let template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
  let contentMarker = '<!--APP-->'

  if (renderer) {
    renderer.renderToString({events}, (err, html) => {
      if (err) {
        console.log(err)
      }
      res.send(template.replace(contentMarker, `<script> var __INITIAL_STATE__ = ${ serialize(events)}</script>\n${html}`));
    });

  } else {
    res.send('<p>loading.</p><script src="/reload/reload.js"></script>');
  }


});

app.use(require('body-parser').json())

app.post('/add-event', (req, res) => {
    events.push({
      description: req.body.description,
      date: moment(req.body.date)
    });
    res.sendStatus(200);
  }
);

const server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
  const reload = require('reload');
  const reloadServer = reload(app);
  require('./webpack-dev-middleware').init(app);
  require('./webpack-server-compiler').init(function (bundle) {
    let needsReload = (renderer === undefined);
    renderer = require('vue-server-renderer').createBundleRenderer(bundle);
    if(needsReload){
      reloadServer.reload();
    }
  });
}

server.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
  if (process.env.NODE_ENV === 'development') {
    require("opn")(`http://localhost:${process.env.PORT}`);
  }
});
