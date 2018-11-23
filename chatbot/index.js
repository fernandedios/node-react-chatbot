const dialogflow = require('dialogflow');

const config = require('../config/keys');
const structjson = require('./structjson');

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);

module.exports = {
  textQuery: async function(text, parameters = {}) {
    let self = module.exports;

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
      responses = self.handleAction(responses);
      return responses;
    }
    catch(err) {
      console.log('ERROR', err);
    }
  },

  eventQuery: async function(event, parameters = {}) {
    let self = module.exports;

    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: event,
          parameters: structjson.jsonToStructProto(parameters),
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
      responses = self.handleAction(responses);
      return responses;
    }
    catch(err) {
      console.log('ERROR', err);
    }
  },

  handleAction: function(responses) {
    return responses;
  }
};
