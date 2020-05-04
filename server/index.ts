const express = require('express');
const cors = require('cors');
const request = require('request');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
}));

app.use(express.static(__dirname + "/../dist/"));

const uriBase = 'https://emojifier.cognitiveservices.azure.com/face/v1.0/detect/';
const subscriptionKey = '65a8aa82cdd440eb8b1bb2789d7ba393';

const port = 3000;

app.post('/', (req, res) => {
  const { imageUrl } = req.body;

  const params = {
    'returnFaceAttributes': 'emotion'
  };

  const options = {
    url: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  };

  db.getFace(imageUrl, saved => {
    if (saved && saved.faceAttributes) {
      res.send(JSON.parse(saved.faceAttributes));
    } else {
      // TODO: Send Request to Face API
      request.post(options, (error, response, body) => {
        res.setHeader('Content-Type', 'application/json');

        // TODO: Save Face API response to database
        if (response.statusCode == "200") {
          db.saveFace(imageUrl, JSON.stringify(body));
        }

        // TODO: Send Face API response to front-end
        res.send(body);
      });
    }
  });
});

app.listen(port, () => console.log(`Emojifier back-end listening on port ${port}!`));
