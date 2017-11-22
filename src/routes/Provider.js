import React from 'react';

export default class Provider extends React.Component {

  componentWillMount() {
    //console.log("ProviderComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = sessionStorage.getItem('userRole');
      this.props.history.replace('/' + userRole);
    }
  }

  componentDidMount() {
    //console.log("ProviderComponent did mount");
  }

  componentWillUnmount() {
    //console.log("ProviderComponent will unmount");
  }

  render() {
    //console.log("rendering the ProviderComponent");
    return (
      <div className="container">
        <h2>Hello, Provider!</h2>
      </div>
    )
  }
}