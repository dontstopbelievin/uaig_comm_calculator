import React from 'react';

export default class Provider extends React.Component {

  componentWillMount() {
    //console.log("ProviderComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];
      this.props.history.replace('/' + userRole);
    }else {
      this.props.history.replace('/');
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