import React from 'react';
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';

var columnStyle = {
  textAlign: 'center'
}

export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      data: [],
      loaderHidden: false,
      roles: [],
      roleUser: [],
      isLoggedIn: true,
      pageNumbers: [],
      username: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    this.getUsers(nextProps.match.params.page);
  }

  // получить список пользователей
  getUsers(page = null) {
    if (!page) {
      page = this.props.match.params.page;
    }

    this.setState({loaderHidden: false});
    //console.log("entered getUsers function");
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/userTable/getUsers?page=" + page, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText).users;
        //console.log(data);

        var pageNumbers = [];
        var start = (data.current_page - 4) > 0 ? (data.current_page - 4) : 1;
        var end = (data.current_page + 4) < data.last_page ? (data.current_page + 4) : data.last_page;
        for (start; start <= end; start++) {
          pageNumbers.push(start);
        }
        this.setState({pageNumbers: pageNumbers});

        this.setState({loaderHidden: true});
        this.setState({ users: data.data });
        this.setState({ data: data });
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
    this.setState({loaderHidden: false});
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
        this.setState({loaderHidden: true});
      }
    }.bind(this);
    xhr.send();
  }

  // получить список ролей пользователей
  getRoleUser() {
    this.setState({loaderHidden: false});
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
        this.setState({loaderHidden: true});
      }
    }.bind(this);
    xhr.send();
  }

  // добавить роль к пользователю
  addRoleToUser(userId, roleId, roleLevel) {
    var token = sessionStorage.getItem('tokenInfo');
    var my_data = {userid: userId, roleid: roleId};
    var dd = JSON.stringify(my_data);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/userTable/addRoleToUser", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      var data = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        console.log(data);
        alert('Роли успешно добавлены');
        this.setState({ roleUser: data.roleUser });
        //console.log(usersArray);
        // this.setState({users: usersArray});
        console.log('role(s) was(were) added')
      }else {
        console.log(data);
        alert('Ошибка во время добавления роли!');
      }
    }.bind(this);
    xhr.send(dd);
  }

  componentWillMount() {
    //console.log("AdminComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
    }else {
      this.props.history.replace('/');
    }
  }

  componentDidMount() {
    this.props.breadCrumbs();
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
        <div className="col-sm-12">
          <Link className="btn btn-outline-primary mb-3" to="/panel/admin/users/add">Добавить пользователя</Link>
        </div>
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
              {!this.state.loaderHidden &&
                <div style={{textAlign: 'center'}}>
                  <br/>
                  <br/>
                  <Loader type="Oval" color="#46B3F2" height="200" width="200" />
                </div>
              }
              {this.state.loaderHidden &&
                this.state.users.map(function(user, index){

                  if(user.first_name === 'admin'){return false;}

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
                          {index + 1 + 20*(this.state.data.current_page-1)}
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
                            })
                          }
                        </div>
                        <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>
                          <a title="Удалить роли" style={{cursor: 'pointer'}}>
                            <i className="glyphicon glyphicon-remove text-danger" onClick={this.removeUser.bind(this, user.id)}>Удалить роль</i>
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                }.bind(this))
              }
            </div>
            <hr/>
            {this.state.data && this.state.data.last_page > 1 &&
              <nav className="pagination_block">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/admin/user-roles/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (this.state.data.current_page === num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/admin/user-roles/' + num}>{num}</Link>
                      </li>
                      );
                    }.bind(this))
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/admin/user-roles/' + this.state.data.last_page}>В конец</Link>
                  </li>
                </ul>
              </nav>
            }
          </div>
        </div>
      </div>
    )
  }
}
