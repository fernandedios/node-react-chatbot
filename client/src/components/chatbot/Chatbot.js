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

    // if cookies is not set yet, generate a new cookie
    if (cookies.get('userID') === undefined) {
        cookies.set('userID', uuid(), { path: '/' });
    }

    console.log(cookies.get('userID'));
  }

  componentDidMount() {
    // welcome message from bot
    this.df_event_query('welcome');
  }

  componentDidUpdate() {
    // scroll to last message and return focus to input
    this.messagesEnd.scrollIntoView({ behaviour: "smooth" });
    this.textInput.focus();
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
      console.log(JSON.stringify(msg));

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
    // render messages from bot and user
    if (stateMessages) {
      return stateMessages.map((message, i) => {
        if (message.msg && message.msg.text && message.msg.text.text) {
          return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
        }
        else {
          return <h2>Cards</h2>
        }
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
