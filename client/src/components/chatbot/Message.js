import React from 'react';

const Message = (props) => {
  return (
    <div className="col s12 offset-m8 offset-l3">
      <div className="card-panel gray lighten-5 z-depth-1">
        <div className="row valiign-wrapper">

          {props.speaks === 'bot' &&
          <div className="col s2">
            <button className="btn-floating btn-large waves-effect waves-light red">
              {props.speaks}
            </button>
          </div>
          }

          <div className="col s10">
            <span className="black-text">
              {props.text}
            </span>
          </div>

          {props.speaks === 'me' &&
          <div className="col s2">
            <button className="btn-floating btn-large waves-effect waves-light red">
              {props.speaks}
            </button>
          </div>
          }

        </div>
      </div>
    </div>
  );
}

export default Message;
