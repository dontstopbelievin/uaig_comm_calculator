import React from 'react';

export default class KeepSession extends React.Component {
  constructor(props){
    super(props)
    window.addEventListener('storage', (event) => {
      const credentials = sessionStorage.getItem('tokenInfo');
      if(event.key === 'REQUESTING_SHARED_CREDENTIALS' && credentials) {
        localStorage.setItem('CREDENTIALS_SHARING',
        JSON.stringify({
          token: sessionStorage.getItem('tokenInfo'),
          id: sessionStorage.getItem('userId'),
          name: sessionStorage.getItem('userName'),
          iin: sessionStorage.getItem('userIin'),
          bin: sessionStorage.getItem('userBin'),
          roles: sessionStorage.getItem('userRoles')
        }));
        localStorage.removeItem('CREDENTIALS_SHARING');
      }

      if(event.key === 'CREDENTIALS_SHARING' && !credentials){
        sessionStorage.setItem("tokenInfo", JSON.parse(event.newValue).token);
        sessionStorage.setItem("userId", JSON.parse(event.newValue).id);
        sessionStorage.setItem("userName", JSON.parse(event.newValue).name);
        sessionStorage.setItem("userIin", JSON.parse(event.newValue).iin ? JSON.parse(event.newValue).iin : '');
        sessionStorage.setItem("userBin", JSON.parse(event.newValue).bin ? JSON.parse(event.newValue).bin : '');
        sessionStorage.setItem("userRoles", JSON.parse(event.newValue).roles);
        sessionStorage.setItem("logStatus", true);
        //console.log(this.props.history);
        //this.props.history.replace(this.props.history.location.pathname);
        this.props.forceUpdatePage();
      }

      if(event.key === 'CREDENTIALS_FLUSH' && credentials){
        sessionStorage.removeItem('tokenInfo');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userIin');
        sessionStorage.removeItem('userBin');
        sessionStorage.removeItem('userRoles');
        sessionStorage.removeItem('logStatus');
      }
    })
  }

  componentDidMount() {
    localStorage.setItem('REQUESTING_SHARED_CREDENTIALS', Date.now().toString());
    localStorage.removeItem('REQUESTING_SHARED_CREDENTIALS');
  }

  render(){
    return(
      <React.Fragment></React.Fragment>
    )
  }
}
