import React from 'react';
import '../assets/css/adminDropDown.css';

var columnStyle = {
  textAlign: 'center'
}


export default class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      roles: [],
      roleUser: [],
      isLoggedIn: true,
      username: ""
    };


  }
  // получить список пользователей
  getUsers() { 
    //console.log("entered getUsers function");
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/userTable/getUsers", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

          var users = data.users.filter(function( obj ) {
          return obj.first_name !== 'admin';
        });
          console.log(users);
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
    // var userPos = usersArray.map(function(x) {return x.UserId; }).indexOf(userId);
    //console.log(userPos);

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/userTable/deleteUser/" + userId, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        alert('Пользователь удален!');
        this.setState({ roleUser: data.roleUser });
        //console.log(usersArray);
        // this.setState({users: usersArray});
        console.log('role(s) was(were) added')
      }else {
        alert('Ошибка во время удалении!');
      }
    }.bind(this);
    xhr.send(); 
  }

  // получить список ролей
  getRoles() { 
    //console.log("entered getRoles function");
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/userTable/getRoles", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var roles = data.roles.filter(function( obj ) {
          return obj.name !== 'Admin';
        });

        this.setState({ roles: roles });
          console.log(this.state.roles);
      }
    }.bind(this);
    xhr.send();
  }


  // получить список ролей пользователей
  getRoleUser() {
    //console.log("entered getRoles function");
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/userTable/getUserRoles", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        this.setState({ roleUser: data.roleUser });
          console.log(this.state.roleUser);
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
    xhr.open("post", window.url + "api/userTable/addRoleToUser", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        alert('Роли успешно добавлены');
        this.setState({ roleUser: data.roleUser });
        //console.log(usersArray);
        // this.setState({users: usersArray});
        console.log('role(s) was(were) added')
      }else {
        alert('Ошибка во время добавления роли!');
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
    this.getRoleUser();
  }



  render() {
    //console.log("rendering the AdminComponent");
    var roles = this.state.roles;
    var roleUser = this.state.roleUser;
    return (
      <div className="body-content container">
        <h3 style={{fontSize: '40px', color: 'dodgerblue'}}>Пользователи</h3>
        <div>
          <div className="container">
            <div className="panel panel-info">
              <div className="panel-heading container-fluid">
                <div className="row">
                  <div className="col-xs-1 col-sm-1 col-md-1" style={columnStyle}>№</div>
                  <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>Логин</div>
                  <div className="col-xs-2 col-sm-2 col-md-2"style={columnStyle}>Почта</div>
                  <div className="col-xs-5 col-sm-5 col-md-5" style={columnStyle}>Pоль</div>
                  <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>Управление</div>
                </div>
              </div>
              {
                this.state.users.map(function(user, index){

                  var rolesOfUser = [];

                  roleUser.map(function (UserRole) {
                    if(UserRole.user_id === user.id){
                      rolesOfUser.push(UserRole.role_id);
                    }
                  });

                  return(
                    <div key={index} className="panel-body container-fluid">
                      <div className="row" style={{padding: '5px 0'}}>
                        <div className="col-xs-1 col-sm-1 col-md-1" style={columnStyle}>
                          {index + 1}
                        </div>
                        <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>
                          {user.first_name}
                        </div>
                        <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>
                          {user.email}
                        </div>
                        <div className="col-xs-5 col-sm-5 col-md-5" style={columnStyle}>
                          <div className="btn-group" style={{margin: '0 5px 5px 0'}}>
                            <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              Изменить 
                            </button>
                              <ul className="dropdown-menu">
                              {
                                roles.map(function(role, i){
                                    if(role.level === 1 ){
                                        return(
                                        <li key={i} className="dropdown-submenu">
                                            <a onClick={this.addRoleToUser.bind(this, user.id, role.id, 1)}>{role.name} <span className="expand">»</span></a>
                                          <ul className="dropdown-menu1">
                                          {
                                            roles.map(function(secondLevRole, i){
                                                if(secondLevRole.level === 2 && secondLevRole.parent_id === role.id){
                                                  return(
                                                    <li key={i} className="dropdown-submenu rd-level">
                                                        <a onClick={this.addRoleToUser.bind(this, user.id, secondLevRole.id, 2)}>{secondLevRole.name}</a>
                                                        <ul className="dropdown-menu2">
                                                        {
                                                            roles.map(function(thirdLevRole, i){
                                                                if(thirdLevRole.level === 3 && thirdLevRole.parent_id === secondLevRole.id){
                                                                    return(
                                                                        <li key={i} className="dropdown-submenu">
                                                                            <a onClick={this.addRoleToUser.bind(this, user.id, thirdLevRole.id, 3)}>{thirdLevRole.name}</a>
                                                                        </li>
                                                                    )
                                                                }
                                                            }.bind(this))
                                                        }
                                                        </ul>
                                                    </li>
                                                  )
                                                }
                                            }.bind(this))
                                          }
                                          </ul>
                                        </li>
                                    )
                                    }
                                  // if(role.name === 'Urban') {
                                  //   return(
                                  //     <li key={i}>
                                  //       <div className="btn-group">
                                  //       <button className="btn btn-raised btn-info  dropdown-toggle">{role.name} <span className="expand">»</span></button>
                                  //       <div className="dropdown-menu">
                                  //         <ul className="submenu">
                                  //         {
                                  //           roles.filter(function(obj) { return (obj.level === '2' && obj.parent_id === role.id); }).map(function(secondLevRole, i){
                                  //             if(secondLevRole.name === 'Region') {
                                  //               return(
                                  //                 <li key={i}><button className="btn btn-raised btn-urban">{secondLevRole.name} <span className="expand">»</span></button>
                                  //                   <ul className="submenu">
                                  //                   {
                                  //                     roles.filter(function(obj) { return (obj.level === '3' && obj.parent_id === secondLevRole.id); }).map(function(thirdLevRole, i){
                                  //                       return(
                                  //                         <li key={i}><button className="btn btn-raised btn-region" onClick={this.addRoleToUser.bind(this, user.id, thirdLevRole.id, 3)}>{thirdLevRole.name}</button></li>
                                  //                       )
                                  //                     }.bind(this))
                                  //                   }
                                  //                   </ul>
                                  //                 </li>
                                  //               )
                                  //             }
                                  //             else{
                                  //               return(
                                  //                 <li key={i}><button className="btn btn-raised btn-urban" onClick={this.addRoleToUser.bind(this, user.id, secondLevRole.id, 2)}>{secondLevRole.name}</button></li>
                                  //               )
                                  //             }
                                  //           }.bind(this))
                                  //         }
                                  //       </ul>
                                  //       </div>
                                  //       </div>
                                  //     </li>
                                  //   )
                                  // }
                                  // else if(role.name === 'Citizen') {
                                  //   return(
                                  //       <li key={i}><button className="btn btn-raised btn-primary">{role.name} <span className="expand">»</span></button>
                                  //         <ul className="submenu">
                                  //         {
                                  //           roles.map(function(secondLevRole, i){
                                  //               if(secondLevRole.level === 2 && secondLevRole.parent_id === role.id){
                                  //                 return(
                                  //                       <li key={i}><button className="btn btn-raised btn-citizen" onClick={this.addRoleToUser.bind(this, user.id, secondLevRole.id, 2)}>{secondLevRole.name}</button></li>
                                  //                 )
                                  //               }
                                  //           }.bind(this))
                                  //         }
                                  //         </ul>
                                  //       </li>
                                  //   )
                                  // }
                                  // else if(role.name === 'Provider') {
                                  //   return(
                                  //       <li key={i}><button className="btn btn-raised btn-danger">{role.name} <span className="expand">»</span></button>
                                  //         <ul className="submenu">
                                  //         {
                                  //           roles.filter(function(obj) { return (obj.level === '2' && obj.parent_id === role.id); }).map(function(secondLevRole, i){
                                  //             return(
                                  //               <li key={i}><button className="btn btn-raised btn-provider" onClick={this.addRoleToUser.bind(this, user.id, secondLevRole.id, 2)}>{secondLevRole.name}</button></li>
                                  //             )
                                  //           }.bind(this))
                                  //         }
                                  //         </ul>
                                  //       </li>
                                  //   )
                                  // }
                                  // else if(role.name === 'Temporary')  {
                                  //   return(
                                  //       <li key={i}>
                                  //         <button className="btn btn-raised btn-secondary" onClick={this.addRoleToUser.bind(this, user.id, role.id, 1)}>
                                  //           {role.name}
                                  //         </button>
                                  //       </li>
                                  //   )
                                  // }
                                  // else if(role.name === 'PhotoReporter')  {
                                  //   return(
                                  //       <li key={i}>
                                  //         <button className="btn btn-raised btn-secondary" onClick={this.addRoleToUser.bind(this, user.id, role.id, 1)}>
                                  //           {role.name}
                                  //         </button>
                                  //       </li>
                                  //   )
                                  // }
                                  // else if(role.name === 'ApzDepartment')  {
                                  //   return(
                                  //       <li key={i}>
                                  //         <button className="btn btn-raised btn-secondary" onClick={this.addRoleToUser.bind(this, user.id, role.id, 1)}>
                                  //           {role.name}
                                  //         </button>
                                  //       </li>
                                  //   )
                                  // }
                                }.bind(this))
                              }
                              </ul>
                          </div>
                          {
                            roles.map(function(r, li){
                              var step = rolesOfUser.length;
                              for(var i=0;i<=step;i++){
                                  if (rolesOfUser[i] === r.id) {
                                      // console.log('user: ' + user.first_name + '| role: ' + r.name);
                                      if(r.level === 1){
                                          return (
                                          <div key={li} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                              <button type="button" className="btn btn-sm btn-raised btn-success" style={{cursor: 'auto'}} >
                                                  {r.name}
                                              </button>
                                          </div>
                                      )
                                      }else if(r.level === 2){
                                          return (
                                          <div key={li} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                              <button type="button" className="btn btn-sm btn-raised btn-info" style={{cursor: 'auto'}} >
                                                  {r.name}
                                              </button>
                                          </div>
                                      )
                                      }else if(r.level === 3){
                                          return (
                                          <div key={li} className="btn-group" style={{margin: '0 5px 0 0'}}>
                                              <button type="button" className="btn btn-sm btn-raised btn-warning" style={{cursor: 'auto'}} >
                                                  {r.name}
                                              </button>
                                          </div>
                                      )
                                      }
                                  }
                              }

                            }.bind(this))

                          }
                        </div>
                        <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>
                          <a title="Удалить" style={{cursor: 'pointer'}}>
                            <i className="glyphicon glyphicon-remove text-danger" onClick={this.removeUser.bind(this, user.id)}></i>
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