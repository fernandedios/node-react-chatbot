import React from 'react';

const Card = (props) => {
  const { header, image, description, link, price } = props.payload.fields;
  return (
    <div style={{ float: 'left', paddingRight: '30px', width: '270px' }}>
      <div className="card">
        <div className="card-image">
          <img style={{ width: '240px'}} src={image.stringValue} alt="Card Img" />
          <span className="card-title">{header.stringValue}</span>
          <p>{price.stringValue}</p>
        </div>
        <div className="card-content">{description.stringValue}</div>
        <div className="card-action">
          <a target="_blank" href={link.stringValue}>GET NOW</a>
        </div>
      </div>
    </div>
  );
}

export default Card;
