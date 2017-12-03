import React from 'react';

export default class Temporary extends React.Component {

  componentWillMount() {
    //console.log("CitizenComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];
      this.props.history.replace('/' + userRole);
    }else {
      this.props.history.replace('/');
    }
  }

  componentDidMount() {
    //console.log("CitizenComponent did mount");
  }

  componentWillUnmount() {
    //console.log("CitizenComponent will unmount");
  }

  render() {
    //console.log("rendering the CitizenComponent");
    return (
      <div className="content container">
        <h2>Вам еще не задана роль</h2>
      </div>
    )
  }
}