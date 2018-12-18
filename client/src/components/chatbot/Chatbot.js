import React, { Component } from 'react';
import axios from 'axios/index';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import Message from './Message';
import Card from './Card';

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

  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} /> );
  }

  renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
    }
    else if (message.msg && message.msg.payload && message.msg.payload.fields && message.msg.payload.fields.cards){
      const { cards } = message.msg.payload.fields;
      return (
        <div key={{i}}>
          <div className="card-panel grey lighten-5 z-depth-1">
            <div style={{ overflow: 'hidden' }}>
            <div className="col s2">
              <button className="btn-floating btn-large waves-effect waves-light red">
                {message.speaks}
              </button>

              <div style={{ overflow: 'auto', overflowY: 'scroll' }}>
                <div style={{ height: '300px', width: cards.listValue.values.length * 270 }}>
                  {this.renderCards(cards.listValue.values)}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      );
    }
  }

  renderMessages(stateMessages) {
    // render messages from bot and user
    if (stateMessages) {
      return stateMessages.map((message, i) => {
        return this.renderOneMessage(message, i);
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
      <div style={{ height: 500, width: 400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgrey' }}>
        <nav>
          <div className="nav-wrapper">
            <button className="brand-logo">ChatBot</button>
          </div>
        </nav>
        <div id="chatbot" style={{ height: '388px', width: '100%', overflow: 'auto' }}>
          {this.renderMessages(this.state.messages)}
          <div ref={(el) => { this.messagesEnd = el }}
            style={{ float: "left", clear: "both" }}>
          </div>
        </div>
        <div className="col s12">
          <input
            style={{ margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%' }}
            ref={(el) => { this.textInput = el }}
            type="text"
            onKeyPress={this.handleInputKeyPress}
            placeholder="Type a message"
            />
        </div>
      </div>
    );
  }
}


export default Chatbot;
