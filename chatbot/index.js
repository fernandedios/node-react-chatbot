const dialogflow = require('dialogflow');
const config = require('../config/keys');

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);

module.exports = {
  textQuery: async function(text, parameters) {
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: config.dialogFlowSessionLanguageCode
        }
      },
      queryParams: {
        payload: {
          data: parameters
        }
      }
    };

    try {
      let responses = await sessionClient.detectIntent(request);
      return responses;
    }
    catch(err) {
      console.log('ERROR', err);
    }
  }
};
