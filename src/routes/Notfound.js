import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Notfound extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    //console.log("Notfound will mount");
  }

  componentDidMount() {
    //console.log("Notfound did mount");
  }

  componentWillUnmount() {
    //console.log("Notfound will unmount");
  }

  render() {
    //console.log("rendering the Notfound");
    //console.log(this.props.router);
    return (
      <div className="container">
        Страницы не существует
      </div>
    )
  }
}