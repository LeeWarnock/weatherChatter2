const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

/* For Facebook Validation */
//Replace the'/' below with proper relative link or absolute link if serving fron the internet
app.get('/', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tinykittycats') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.status(403).end();
  }
});

/* Handling all messenges */
//Replace the'/' below with proper relative link or absolute link if serving fron the internet
app.post('/', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

//POST reply with an echo of whatever was entered into chat field
function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: EAAJnVnDoQkMBAALk7VHjrMB2q2eqSGudWv82vAzV4VuV7Omv5MyWyjWgJfC0v7z7NLnGqttQKZCBb4QpNMML9AaqSXw2lDZBZALXOXSSuGKWSDMYRFh9pQLUtCSuD9WaOWTTxo94g6SmXT0ZCXbpvmvDNWZAREUcZD},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}