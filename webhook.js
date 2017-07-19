const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'correcthorsebatterystaple69!') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
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

// Send Message
function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: EAAJnVnDoQkMBAP0RmtpRZA0sNeKVzmIGPlqTfu3jYiTvx1WuEZChdBKjKkGZCdk0uIApv1pJC4Mv7fOLqkRuTUtkf94Fa289V2P1hRpso3KrUzZAcLfjhorqSZBzrVAcQg0hljmmGhjypSL6O7B4dV2sIfB58X0qLNuFHs7hvgAZDZD},
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