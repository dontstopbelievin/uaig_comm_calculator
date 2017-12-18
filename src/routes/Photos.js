import React from 'react';

export default class Photos extends React.Component {

  componentWillMount() {
    //console.log("GuestComponent will mount");
  }

  componentDidMount() {
    //console.log("GuestComponent did mount");
  }

  componentWillUnmount() {
    //console.log("GuestComponent will unmount");
  }

  render() {
    //console.log("rendering the GuestComponent");
    return (
      <div className="content container photos-page">
        <div className="card">
          <div className="card-header"><h4 className="mb-0">Галерея</h4></div>
          <div className="card-body"></div>
        </div>
      </div>
    )
  }
}