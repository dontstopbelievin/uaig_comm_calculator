import React from 'react';

var columnStyle = {
  textAlign: 'center'
}

var createRoleDropdownStyle = {
  position: 'absolute',
  background: 'lavender',
  zIndex: '10',
  padding: '10px'
}

export default class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      roles: [],
      isLoggedIn: true,
      username: "",
      createNewRoleHidden: true,
      newRoleName: ""
    };

    this.onRoleNameChange = this.onRoleNameChange.bind(this);
    this.toggleCreateNewRole = this.toggleCreateNewRole.bind(this);
    this.submitNewRole = this.submitNewRole.bind(this);
  }

  onRoleNameChange(e) {
    this.setState({newRoleName: e.target.value});
  }

  // получить список пользователей
  getUsers() { 
    //console.log("entered getUsers function");
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/admin/userRoles", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var users = data.filter(function( obj ) {
          return obj.UserName !== 'Admin';
        });
        //console.log(users);
        this.setState({ users: users });
      }
    }.bind(this);
    xhr.send();
    //console.log("finished getUsers function");
    //console.log(this.state.data);
  }

  // удалить пользователя
  removeUser(userId) {
    //console.log(userId);
    var token = sessionStorage.getItem('tokenInfo');
    var usersArray = this.state.users;
    var userPos = usersArray.map(function(x) {return x.UserId; }).indexOf(userId);
    //console.log(userPos);

    var xhr = new XMLHttpRequest();
    xhr.open("delete", window.url + "api/admin/user/remove/" + userId, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        usersArray.splice(userPos,1);
        this.setState({users: usersArray})
        console.log("user was deleted");
      }
    }.bind(this);
    xhr.send(); 
  }

  // получить список ролей
  getRoles() { 
    //console.log("entered getRoles function");
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/admin/roles", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var roles = data.filter(function( obj ) {
          return obj.RoleName !== 'Admin';
        });
        //console.log(roles);
        this.setState({ roles: roles });
      }
    }.bind(this);
    xhr.send();
  }

  // создать и добавить новую роль к списку ролей
  createNewRole(roleName) {
    var token = sessionStorage.getItem('tokenInfo');
    //var data = {rolename: roleName};
    var rolesArray = this.state.roles;

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/admin/role/create/" + roleName, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        rolesArray.push(data);
        this.setState({roles: rolesArray});
        console.log('role was created and added')
      }
    }.bind(this);
    xhr.send();
  }

  submitNewRole(e) {
    e.preventDefault();
    var roleName = this.state.newRoleName.trim();

    if (!roleName) {
      return;
    }

    this.createNewRole(roleName);
    this.setState({newRoleName: "", createNewRoleHidden: !this.state.createNewRoleHidden});
  }

  // удалить роль со списка
  removeRole(roleId) {
    var token = sessionStorage.getItem('tokenInfo');
    var usersArray = this.state.users;
    var tempRoles = this.state.roles;
    //console.log(tempRoles);

    for (var i = 0; i < tempRoles.length; i++) {
      if (tempRoles[i].RoleId && tempRoles[i].RoleId === roleId) { 
        tempRoles.splice(i, 1);
        break;
      }
    }
    //console.log(tempRoles);

    //console.log(roleId);
    var xhr = new XMLHttpRequest();
    xhr.open("delete", window.url + "api/admin/role/remove/" + roleId, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        //console.log(this);
        this.setState({ roles: tempRoles });
        for (var i = 0; i < usersArray.length; i++) {
          var rolePos = usersArray[i].RoleNames.map(function(x) {return x.RoleId;}).indexOf(roleId);
          //console.log(rolePos);
          if(rolePos >= 0){
            usersArray[i].RoleNames.splice(rolePos, 1);
          }
        }
        this.setState({users: usersArray});
        console.log("role was deleted");
      }
    }.bind(this);
    xhr.send();  
  }

  // добавить роль к пользователю
  addRoleToUser(userId, roleId, roleLevel) {
    var token = sessionStorage.getItem('tokenInfo');
    //console.log(userId);
    //console.log(roleId);
    var data = {userid: userId, roleid: roleId};
    var dd = JSON.stringify(data);

    var usersArray = this.state.users;
    // get the position of the user which role is gonna be added
    var userPos = usersArray.map(function(x) {return x.UserId; }).indexOf(userId);
    //console.log(userPos);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/admin/role/add", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        if(roleLevel > 1){
          for(var i = 0; i < roleLevel; i++){
            usersArray[userPos].RoleNames.push(data[i]);
          }
        }
        else{
          usersArray[userPos].RoleNames.push(data);
        }
        //console.log(usersArray);
        this.setState({users: usersArray});
        console.log('role(s) was(were) added')
      }
    }.bind(this);
    xhr.send(dd);
  }

  // удалить роль у пользователя
  removeRoleFromUser(userId, roleId, roleLevel) {
    var token = sessionStorage.getItem('tokenInfo');
    //console.log(userId);
    //console.log(roleId);
    var data = {userid: userId, roleid: roleId};
    var dd = JSON.stringify(data);

    var usersArray = this.state.users;
    var userPos = usersArray.map(function(x) {return x.UserId; }).indexOf(userId);

    var xhr = new XMLHttpRequest();
    xhr.open("delete", window.url + "api/admin/role/remove", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        if(roleLevel > 1){
          usersArray[userPos].RoleNames.length = 0;
        }
        else{
          var rolePos = usersArray[userPos].RoleNames.map(function(x) {return x.RoleId;}).indexOf(roleId);
          //console.log(rolePos);
          usersArray[userPos].RoleNames.splice(rolePos,1);
        }
        this.setState({users: usersArray});
        console.log('role(s) was(were) removed')
      }
    }.bind(this);
    xhr.send(dd);
  }

  toggleCreateNewRole(e){
    this.setState({createNewRoleHidden: !this.state.createNewRoleHidden});
  }

  componentWillMount() {
    //console.log("AdminComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];
      this.props.history.replace('/' + userRole);
    }else {
      this.props.history.replace('/');
    }
  }

  componentDidMount() {
    //console.log("AdminComponent did mount");
    this.getUsers();
    this.getRoles();
  }

  componentWillUnmount() {
    //console.log("AdminComponent will unmount");
  }

  /*  every time state or 
      props of the Component gets updated 
      componentDidUpdate is called
  */
  componentDidUpdate() {
    //console.log("AdminComponent did update");
  }

  render() {
    //console.log("rendering the AdminComponent");
    var roles = this.state.roles;
    return (
      <div className="container">
        <h3 style={{fontSize: '40px', color: 'dodgerblue'}}>Пользователи</h3>
        <div>
          <div className="container">
            <div className="panel panel-info">
              <div className="panel-heading container-fluid">
                <div className="row">
                  <div className="col-xs-1 col-sm-1 col-md-1" style={columnStyle}>№</div>
                  <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>Логин</div>
                  <div className="col-xs-2 col-sm-2 col-md-2"style={columnStyle}>Почта</div>
                  <div className="col-xs-5 col-sm-5 col-md-5" style={columnStyle}>
                    <div className="button-group" style={{display: 'inline'}}>
                      <button style={{margin: '0'}} type="button" className="btn btn-primary btn-sm" onClick={this.toggleCreateNewRole}>
                        Добавить
                      </button>
                      {!this.state.createNewRoleHidden && <ul style={createRoleDropdownStyle} >
                        <form onSubmit={this.submitNewRole}>
                          <input type="text" className="form-control" placeholder=""
                                            value={this.state.newRoleName} onChange={this.onRoleNameChange} />
                          <button type="submit" className="btn btn-primary btn-sm">Добавить</button>
                        </form>
                      </ul>}
                    </div> / 
                    <div className="btn-group" style={{display: 'inline'}}>
                      <button type="button" className="btn btn-danger btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Удалить <span className="caret"></span>
                      </button>
                      <div className="dropdown-menu" style={{minWidth: 'fit-content'}}>
                      {
                        roles.filter(function( obj ) { return obj.RoleLevel === '1';}).map(function(role, i){
                        return(
                          <li key={i}>
                            <input type="button" className="btn btn-outline-secondary" style={{margin: '5px'}}
                                value={role.RoleName} 
                                onClick={this.removeRole.bind(this, role.RoleId)} />
                          </li>
                        )
                        }.bind(this))
                      }
                      </div>
                    </div> роль
                  </div>
                  <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>Управление</div>
                </div>
              </div>
              {
                this.state.users.map(function(user, index){
                  return(
                    <div key={index} className="panel-body container-fluid">
                      <div className="row" style={{padding: '5px 0'}}>
                        <div className="col-xs-1 col-sm-1 col-md-1" style={columnStyle}>
                          {index + 1}
                        </div>
                        <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>
                          {user.UserName}
                        </div>
                        <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>
                          {user.UserEmail}
                        </div>
                        <div className="col-xs-5 col-sm-5 col-md-5" style={columnStyle}>
                          <div className="btn-group" style={{margin: '0 5px 5px 0'}}>
                            <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              Изменить 
                            </button>
                            <div className="dropdown-menu" style={{minWidth: 'fit-content', margin: '0', padding: '0'}}>
                              <ul className="main-dd-menu">
                              {
                                roles.filter(function(obj) { return obj.RoleLevel === '1'; }).map(function(role, i){
                                  if(role.RoleName === 'Urban') {
                                    return(
                                      <li key={i}><button className="btn btn-raised btn-info">{role.RoleName} <span className="expand">»</span></button>
                                        <ul className="submenu">
                                          {
                                            roles.filter(function(obj) { return (obj.RoleLevel === '2' && obj.ParentRoleId === role.RoleId); }).map(function(secondLevRole, i){
                                              if(secondLevRole.RoleName === 'Region') {
                                                return(
                                                  <li key={i}><button className="btn btn-raised btn-urban">{secondLevRole.RoleName} <span className="expand">»</span></button>
                                                    <ul className="submenu">
                                                    {
                                                      roles.filter(function(obj) { return (obj.RoleLevel === '3' && obj.ParentRoleId === secondLevRole.RoleId); }).map(function(thirdLevRole, i){
                                                        return(
                                                          <li key={i}><button className="btn btn-raised btn-region" onClick={this.addRoleToUser.bind(this, user.UserId, thirdLevRole.RoleId, 3)}>{thirdLevRole.RoleName}</button></li>  
                                                        )
                                                      }.bind(this))
                                                    }
                                                    </ul>
                                                  </li>
                                                )  
                                              }
                                              else{
                                                return(
                                                  <li key={i}><button className="btn btn-raised btn-urban" onClick={this.addRoleToUser.bind(this, user.UserId, secondLevRole.RoleId, 2)}>{secondLevRole.RoleName}</button></li>
                                                )
                                              }
                                            }.bind(this))
                                          }
                                        </ul>
                                      </li>
                                    )
                                  }
                                  else if(role.RoleName === 'Citizen') {
                                    return(
                                        <li key={i}><button className="btn btn-raised btn-primary">{role.RoleName} <span className="expand">»</span></button>
                                          <ul className="submenu">
                                          {
                                            roles.filter(function(obj) { return (obj.RoleLevel === '2' && obj.ParentRoleId === role.RoleId); }).map(function(secondLevRole, i){
                                              return(
                                                <li key={i}><button className="btn btn-raised btn-citizen" onClick={this.addRoleToUser.bind(this, user.UserId, secondLevRole.RoleId, 2)}>{secondLevRole.RoleName}</button></li>
                                              )
                                            }.bind(this))
                                          }
                                          </ul>
                                        </li>
                                    )
                                  }
                                  else if(role.RoleName === 'Provider') {
                                    return(
                                        <li key={i}><button className="btn btn-raised btn-danger">{role.RoleName} <span className="expand">»</span></button>
                                          <ul className="submenu">
                                          {
                                            roles.filter(function(obj) { return (obj.RoleLevel === '2' && obj.ParentRoleId === role.RoleId); }).map(function(secondLevRole, i){
                                              return(
                                                <li key={i}><button className="btn btn-raised btn-provider" onClick={this.addRoleToUser.bind(this, user.UserId, secondLevRole.RoleId, 2)}>{secondLevRole.RoleName}</button></li>
                                              )
                                            }.bind(this))
                                          }
                                          </ul>
                                        </li>
                                    )
                                  }
                                  else {
                                    return(
                                        <li key={i}>
                                          <button className="btn btn-raised btn-secondary" onClick={this.addRoleToUser.bind(this, user.UserId, role.RoleId, 1)}>
                                            {role.RoleName}
                                          </button>
                                        </li>
                                    )
                                  }
                                }.bind(this))
                              }
                              </ul>
                            </div>
                          </div>
                          {
                            user.RoleNames.sort(function(a,b){return a.RoleLevel-b.RoleLevel}).map(function(r, i){
                              if(r.RoleName === 'Urban') {
                                return(
                                  <div key={i} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                    <button type="button" className="btn btn-sm btn-raised btn-info" style={{cursor: 'auto'}}>
                                      {r.RoleName}
                                    </button>
                                  </div>
                                )
                              }
                              else if(r.RoleName === 'Citizen') {
                                return(
                                  <div key={i} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                    <button type="button" className="btn btn-sm btn-raised btn-primary" style={{cursor: 'auto'}}>
                                      {r.RoleName}
                                    </button>
                                  </div>
                                )
                              }
                              else if(r.RoleName === 'Provider') {
                                return(
                                  <div key={i} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                    <button type="button" className="btn btn-sm btn-raised btn-danger" style={{cursor: 'auto'}}>
                                      {r.RoleName}
                                    </button>
                                  </div>
                                )
                              }
                              else if(r.RoleName === 'Temporary') {
                                return(
                                  <div key={i} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                    <button type="button" className="btn btn-sm btn-raised btn-secondary" style={{cursor: 'auto'}}>
                                      {r.RoleName}
                                    </button>
                                    <button type="button" className="btn btn-raised btn-secondary" style={{padding: '0 5px'}}
                                            onClick={this.removeRoleFromUser.bind(this, user.UserId, r.RoleId, r.RoleLevel)}>
                                      <span className="glyphicon glyphicon-remove"></span>
                                    </button>
                                  </div>
                                )
                              }
                              else if(r.RoleName === 'Head') {
                                return(
                                  <div key={i} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                    <button type="button" className="btn btn-sm btn-raised btn-urban" style={{cursor: 'auto'}}>
                                      {r.RoleName}
                                    </button>
                                    <button type="button" className="btn btn-raised btn-urban" style={{padding: '0 5px'}}
                                            onClick={this.removeRoleFromUser.bind(this, user.UserId, r.RoleId, r.RoleLevel)}>
                                      <span className="glyphicon glyphicon-remove"></span>
                                    </button>
                                  </div>
                                )
                              }
                              else if(r.RoleName === 'Region') {
                                return(
                                  <div key={i} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                    <button type="button" className="btn btn-sm btn-raised btn-urban" style={{cursor: 'auto'}}>
                                      {r.RoleName}
                                    </button>
                                  </div>
                                )
                              }
                              else if(r.RoleName === 'Individual' || r.RoleName === 'Business') {
                                return(
                                  <div key={i} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                    <button type="button" className="btn btn-sm btn-raised btn-citizen" style={{cursor: 'auto'}}>
                                      {r.RoleName}
                                    </button>
                                    <button type="button" className="btn btn-raised btn-citizen" style={{padding: '0 5px'}}
                                            onClick={this.removeRoleFromUser.bind(this, user.UserId, r.RoleId, r.RoleLevel)}>
                                      <span className="glyphicon glyphicon-remove"></span>
                                    </button>
                                  </div>
                                )
                              }
                              else if(r.RoleName === 'Gas' || r.RoleName === 'Electricity' || r.RoleName === 'Water' || r.RoleName === 'Heat' || r.RoleName === 'Phone') {
                                return(
                                  <div key={i} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                    <button type="button" className="btn btn-sm btn-raised btn-provider" style={{cursor: 'auto'}}>
                                      {r.RoleName}
                                    </button>
                                    <button type="button" className="btn btn-raised btn-provider" style={{padding: '0 5px'}}
                                            onClick={this.removeRoleFromUser.bind(this, user.UserId, r.RoleId, r.RoleLevel)}>
                                      <span className="glyphicon glyphicon-remove"></span>
                                    </button>
                                  </div>
                                )
                              }
                              else {
                                return(
                                  <div key={i} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                    <button type="button" className="btn btn-sm btn-raised btn-region" style={{cursor: 'auto'}}>
                                      {r.RoleName}
                                    </button>
                                    <button type="button" className="btn btn-raised btn-region" style={{padding: '0 5px'}}
                                            onClick={this.removeRoleFromUser.bind(this, user.UserId, r.RoleId, r.RoleLevel)}>
                                      <span className="glyphicon glyphicon-remove"></span>
                                    </button>
                                  </div>
                                )
                              }
                            }.bind(this))
                          }
                        </div>
                        <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>
                          <a title="Удалить" style={{cursor: 'pointer'}}>
                            <i className="glyphicon glyphicon-remove text-danger" onClick={this.removeUser.bind(this, user.UserId)}></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                }.bind(this))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}