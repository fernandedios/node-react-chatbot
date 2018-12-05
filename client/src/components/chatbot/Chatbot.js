import React, { Component } from 'react';
import axios from 'axios/index';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import Message from './Message';

const cookies = new Cookies();

class Chatbot extends Component {
  messagesEnd;
  textInput;

  constructor(props) {
      super(props);

      this.state = { messages: [] };
      this.handleInputKeyPress = this.handleInputKeyPress.bind(this);

      if (cookies.get('userID') === undefined) {
          cookies.set('userID', uuid(), { path: '/' });
      }

      console.log(cookies.get('userID'));
  }

  componentDidMount() {
    this.df_event_query('welcome');
    this.textInput.focus();
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behaviour: "smooth" });
  }

  async df_text_query(text) {
    let says = {
      speaks: 'me',
      msg: {
        text: { text }
      }
    };

    this.setState({ messages: [ ...this.state.messages, says ] });
    const userID = cookies.get('userID');
    const res = await axios.post('/api/df_text_query', { text, userID });

    for (let msg of res.data.fulfillmentMessages) {
        says = {
          speaks: 'bot',
          msg
        }

        this.setState({ messages: [ ...this.state.messages, says ] });
    }
  }

  async df_event_query(event) {
    const userID = cookies.get('userID');
    const res = await axios.post('/api/df_event_query', { event, userID });

    for (let msg of res.data.fulfillmentMessages) {
      let says = {
        speaks: 'bot',
        msg
      }

      this.setState({ messages: [ ...this.state.messages, says ]});
    }
  }

  renderMessages(stateMessages) {
    if (stateMessages) {
      return stateMessages.map((message, i) => {
        return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
      });
    }
    else {
      return null;
    }
  }

  handleInputKeyPress(e) {
    if (e.key === 'Enter') {
      this.df_text_query(e.target.value);
      e.target.value = '';
    }
  }

  render() {
    return (
      <div style={{ height: 400, width: 400, float: 'right'}}>
        <div id="chatbot" style={{ height: '100%', width: '100%', overflow: 'auto' }}>
          <h2>Chatbot</h2>
          {this.renderMessages(this.state.messages)}
          <div ref={(el) => { this.messagesEnd = el }}
            style={{ float: "left", clear: "both" }}>
          </div>
          <input ref={(el) => { this.textInput = el }} type="text" onKeyPress={this.handleInputKeyPress} />
        </div>
      </div>
    );
  }
}


export default Chatbot;
