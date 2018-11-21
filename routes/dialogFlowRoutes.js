const dialogflow = require('dialogflow');
const config = require('../config/keys');

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);


module.exports = app => {
  app.get('/', (req, res) => {
    res.send({ 'hello': 'world' });
  });

  app.post('/api/df_text_query', async (req, res) => {
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req.body.text,
          languageCode: config.dialogFlowSessionLanguageCode
        }
      }
    }

    try {
      let responses = await sessionClient.detectIntent(request);
      res.send(responses[0].queryResult);
    }
    catch(err) {
      console.log('ERROR', err);
    }
  });

  app.post('/api/df_event_query', (req, res) => {
    res.send({ 'do': 'event_query' })
  });
};
