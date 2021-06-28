var express = require("express");
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient

var app = express();
var port = 3000;
var connectionString = "mongodb+srv://quizDbUser:9951122864@cluster0.p8gnz.mongodb.net/quiz-db?retryWrites=true&w=majority"

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    app.use(bodyParser());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
    const db = client.db('quiz-db')
    const userAnswersCollection = db.collection('userAnswers')
    
    app.get('/health',(req,res) => {
        res.status(200).send('UP')
    })

    app.post('/submit', (req, res) => {
        userAnswersCollection.insertOne(req.body)
          .then(result => {
            console.log(result)
            res.send(result.ops)
          })
          .catch(error => res.send("error occured while submitting"))
      })
    app.listen(port, () => {
        console.log("Server listening on port " + port);
       });
  })
  .catch(error => console.error(error))



