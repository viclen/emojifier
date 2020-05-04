const { MongoClient } = require('mongodb');

const mongoURL = 'mongodb://localhost:27017/emojifier';

module.exports = {
  saveFace(imageUrl, data) {
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, db) => {
      if (err) throw err;
      const dbo = db.db();
      // TODO: insert the object into the database
      dbo.createCollection("faces");

      const myobjFace = { imageUrl, faceAttributes: data };
      dbo.collection("faces").insertOne(myobjFace, function (err, res) {
        if (err) throw err;
        console.log("1 register inserted");
        db.close();
      });
    });
  },

  getFace(imageUrl, callback) {
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, db) => {
      if (err) throw err;
      const dbo = db.db();

      dbo.createCollection("faces");

      let cursor = dbo.collection("faces").find({ imageUrl });

      cursor.next().then((result) => {
        callback(result)
      });
    });
  }
}
