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
      regions: [
        {RegionId: "1", RegionName: "Наурызбай"},
        {RegionId: "2", RegionName: "Алатау"},
        {RegionId: "3", RegionName: "Алмалы"},
        {RegionId: "4", RegionName: "Ауезов"},
        {RegionId: "5", RegionName: "Бостандық"},
        {RegionId: "6", RegionName: "Жетісу"},
        {RegionId: "7", RegionName: "Медеу"},
        {RegionId: "8", RegionName: "Турксиб"}
      ],
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
  addRoleToUser(userId, roleId) {
    var token = sessionStorage.getItem('tokenInfo');
    //console.log(userId);
    //console.log(roleId);
    var data = {userid: userId, roleid: roleId};
    var dd = JSON.stringify(data);
    var usersArray = this.state.users;
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
        usersArray[userPos].RoleNames.push(data);
        //console.log(usersArray);
        this.setState({users: usersArray});
        console.log('role was added')
      }
    }.bind(this);
    xhr.send(dd);
  }

  // удалить роль у пользователя
  removeRoleFromUser(userId, roleId) {
    //console.log(userId);
    //console.log(roleId);
    var token = sessionStorage.getItem('tokenInfo');
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
        var rolePos = usersArray[userPos].RoleNames.map(function(x) {return x.RoleId;}).indexOf(roleId);
        //console.log(rolePos);
        usersArray[userPos].RoleNames.splice(rolePos,1);
        this.setState({users: usersArray});
        console.log('role was removed')
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
      var userRole = sessionStorage.getItem('userRole');
      this.props.history.replace('/' + userRole);
      var userName = sessionStorage.getItem('userName');
      this.setState({username: userName});
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

  render() {
    //console.log("rendering the AdminComponent");
    var roles = this.state.roles;
    var regions = this.state.regions;
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
                    <div className="button-group" style={{display: 'inline', marginRight: '3px'}}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={this.toggleCreateNewRole}>
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
                    <div className="button-group" style={{display: 'inline', marginLeft: '3px',marginRight: '3px'}}>
                      <button type="button" className="btn btn-danger btn-sm dropdown-toggle" data-toggle="dropdown">
                        Удалить <span className="caret"></span>
                      </button>
                      <ul className="dropdown-menu" style={{position: 'absolute', minWidth: 'auto'}} >
                      {
                        roles.map(function(role, i){
                        return(
                          <li key={i}>
                            <input type="button" className="btn btn-outline-secondary" style={{margin: '5px'}}
                                value={role.RoleName} 
                                onClick={this.removeRole.bind(this, role.RoleId)} />
                          </li>
                        )
                        }.bind(this))
                      }
                      </ul>
                    </div> роль
                  </div>
                  <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>Управление</div>
                </div>
              </div>
              {
                this.state.users.map(function(user, index){
                  return(
                    <div key={index} className="panel-body container-fluid">
                      <div className="row">
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
                          <div className="dropdown" style={{display: 'inline', marginRight: '3px'}}>
                            <button type="button" className="btn btn-warning btn-sm dropdown-toggle" data-toggle="dropdown">
                              <span className="glyphicon glyphicon-plus"></span> 
                              <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu" style={{minWidth: 'auto'}} >
                              {
                                roles.map(function(role, i){
                                  if(role.RoleName === 'Urban') {
                                    return(
                                      <ul key={i} id="menu" style={{display: 'inline', marginRight: '3px'}}>
                                        <li className="parent" style={{margin: '5px'}}><button href="#">{role.RoleName} <span className="expand">»</span></button>
                                          <ul className="child">
                                            <li><button href="#">Head</button></li>
                                            <li className="parent"><button href="#">Region <span className="expand">»</span></button>
                                              <ul className="child">
                                                {
                                                  regions.map(function(region, i){
                                                    return(
                                                      <li key={i}><button href="#">{region.RegionName}</button></li>
                                                    )
                                                  })
                                                }
                                              </ul>
                                            </li>
                                          </ul>
                                        </li>
                                      </ul>
                                    )
                                  }
                                  else if(role.RoleName === 'Citizen') {
                                    return(
                                      <ul key={i} id="menu" style={{display: 'inline', marginRight: '3px'}}>
                                        <li className="parent" style={{margin: '5px'}}><button href="#">{role.RoleName} <span className="expand">»</span></button>
                                          <ul className="child">
                                            <li><button href="#">Физ. лицо</button></li>
                                            <li><button href="#">Юр. лицо</button></li>
                                          </ul>
                                        </li>
                                      </ul>
                                    )
                                  }
                                  else if(role.RoleName === 'Provider') {
                                    return(
                                      <ul key={i} id="menu" style={{display: 'inline', marginRight: '3px'}}>
                                        <li className="parent" style={{margin: '5px'}}><button href="#">{role.RoleName} <span className="expand">»</span></button>
                                          <ul className="child">
                                            <li><button href="#">Water</button></li>
                                            <li><button href="#">Gas</button></li>
                                            <li><button href="#">Electricity</button></li>
                                            <li><button href="#">Heat</button></li>
                                          </ul>
                                        </li>
                                      </ul>
                                    )
                                  }
                                  else {
                                    return(
                                      <ul key={i} id="menu" style={{display: 'inline', marginRight: '3px'}}>
                                        <li className="parent" style={{margin: '5px'}}>
                                          <a style={{color: '#000'}} onClick={this.addRoleToUser.bind(this, user.UserId, role.RoleId)}>
                                            {role.RoleName}
                                          </a>
                                        </li>
                                      </ul>
                                    )
                                  }
                                }.bind(this))
                              }
                            </ul> 
                          </div>
                          {
                            user.RoleNames.map(function(r, i){
                              return(
                                <div key={i} className="btn-group" style={{margin: '0'}}>
                                  <button type="button" className="btn btn-sm btn-default" style={{cursor: 'auto'}}>
                                    {r.RoleName}
                                  </button>
                                  <button type="button" className="btn btn-sm btn-default" onClick={this.removeRoleFromUser.bind(this, user.UserId, r.RoleId)}>
                                    <span className="glyphicon glyphicon-remove text-danger"></span>
                                  </button>
                                </div>
                              )
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
                  );
                }.bind(this))
              }
            </div>
          </div>
            </div>
      </div>
    )
  }
}