const dialogflow = require('dialogflow');

const {
  googleClientEmail,
  googleProjectID,
  googlePrivateKey,
  dialogFlowSessionID,
  dialogFlowSessionLanguageCode
} = require('../config/keys');

const structjson = require('./structjson');

const projectID = googleProjectID;
const credentials = {
  client_email: googleClientEmail,
  private_key: googlePrivateKey
};

const sessionClient = new dialogflow.SessionsClient({ projectID, credentials });
const sessionPath = sessionClient.sessionPath(googleProjectID, dialogFlowSessionID);

module.exports = {
  textQuery: async function(text, parameters = {}) {
    let self = module.exports;

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: dialogFlowSessionLanguageCode
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
          languageCode: dialogFlowSessionLanguageCode
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
