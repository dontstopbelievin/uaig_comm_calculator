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
      <div className="container">
        Галерея
      </div>
    )
  }
}