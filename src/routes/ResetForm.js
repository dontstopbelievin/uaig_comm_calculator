import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import $ from 'jquery';
import Loader from 'react-loader-spinner';


let e = new LocalizedStrings({ru,kk});

export default class resetForm extends React.Component{
  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      tokenExists: false,
      linkToken: '',
      email: '',
      newPassword: '',
      confirm_password: '',
      check_email: false,
      loaderHidden: true
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onNewPasswordChange = this.onNewPasswordChange.bind(this);
    this.onPasswordConfirmChange = this.onPasswordConfirmChange.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.onRequestSubmission = this.onRequestSubmission.bind(this);
  }
    onEmailChange (e) {
        this.setState({email: e.target.value});

    }
    checkEmail(){
      $.ajax({
        type: 'GET',
        url:  window.url + 'api/get_email/' + this.state.email + '/' + this.props.match.params.token,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
          if( data.email ){
              // alert('Email верный!');
              $('.help-block1').html('<span style="color: blue">Электронный адрес верный!</span>');
              this.setState({linkToken: this.props.match.params.token});
              this.setState({check_email: true});
          }
        }.bind(this),
        error: function () {
          $('.help-block1').html('Электронный адрес не верный!');
              this.setState({check_email: false});
        }.bind(this),
        fail: function (jqXHR) {
          alert("Ошибка " + jqXHR.status + ': ' + jqXHR.statusText);
        },
        complete: function (jqXHR) {
        }
      });
    }
    onNewPasswordChange (e) {
      this.setState({newPassword: e.target.value});
    }
    onPasswordConfirmChange (e) {
      this.setState({password_confirmation: e.target.value});
    }
    onRequestSubmission () {
      var newPass = this.state.newPassword;
      var confirm_password = this.state.password_confirmation;

      if (newPass != confirm_password){
        if (newPass != ''){
            $('.help-block3').html('');
        }
        $('.help-block2').html('Пароль не совпадает, введите еще раз!');
        return false;
      }else {
        $('.help-block2').html('');
        if (!this.state.check_email) {
          alert('Введите электронный адрес!');
          $('.help-block1').html('Электронный адрес не был введен!');
          return false;
        } else {
          if (this.state.newPassword == ''){
            $('.help-block3').html('Введите новый пароль!');
            return false;
          }
          console.log("testing");
          var formData = {
            password: this.state.newPassword,
            password_confirmation: this.state.password_confirmation,
            email: this.state.email,
            token: this.state.linkToken
          };
          var xhr = new XMLHttpRequest();
          xhr.open("post", window.url + 'api/password/reset', true);
          xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
          xhr.onload = function() {
              var data = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
              alert('Успешно!');
              console.log(data);
              this.props.history.replace('/login');
            } else {
              alert("Ошибка!");
              console.log(data);
            }
          }.bind(this);
          xhr.send(JSON.stringify(formData));
        }
      }

    }

    render () {
      return (
        <div className="container">
          <div className="content container">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0 mt-2">{e.forgotPassword}</h4>
                <div className="container navigational_price">
                  <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.forgotPassword}
                </div>
              </div>
                <div className="card-body">
                  <div className="dialog" role="document">
                    <div className="content">
                      <div className="row">
                        <div className="col-md-9">
                          <div id="menu1" className="tab-pane fade active show">
                            <p>&nbsp;</p>
                            <form id="editPassword">
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <div className="row">
                                    <div className="col-md-9">
                                      <label className="control-label">Email:</label>
                                      <input type="email" className="form-control"
                                             id="userName" value={this.state.email}
                                             name="oldPassword" onChange={this.onEmailChange}
                                             required/>
                                      <p className="help-block help-block1"
                                         style={{color: 'red'}}>&nbsp;</p>
                                    </div>
                                    <div className="col-md-3">
                                      <br/>
                                      <button type="button"
                                              className="btn btn-outline-secondary"
                                          onClick={this.checkEmail}>Проверить Email</button>
                                    </div>
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <label className="control-label">Новый пароль:</label>
                                    <input type="password"
                                           className="form-control newPassword"
                                           name="newPassword"
                                           onChange={this.onNewPasswordChange} required/>
                                    <p className="help-block help-block3"
                                       style={{color: 'red'}}>&nbsp;</p>
                                  </div>
                                  <div className="form-group">
                                    <label className="control-label">Подтверждение:</label>
                                    <input type="password"
                                           className="form-control confirm_password"
                                           name="confirmPassword"
                                           onChange={this.onPasswordConfirmChange}
                                           required/>
                                    <p className="help-block help-block2"
                                       style={{color: 'red'}}>&nbsp;</p>
                                  </div>

                                  {this.state.loaderHidden &&
                                  <div>
                                    <button type="button"
                                            className="btn btn-outline-primary"
                                            onClick={this.onRequestSubmission}>Сохранить
                                    </button>
                                  </div>
                                  }
                                </div>
                              </div>
                            </form>

                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                  {!this.state.loaderHidden &&
                  <div style={{margin: '0 auto', width: '100px'}}>
                      <Loader type="Oval" color="#46B3F2" height="100" width="100"/>
                  </div>
                  }

                </div>
            </div>
          </div>
        </div>
      )
    }//here finish render

}//finish main class