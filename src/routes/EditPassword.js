import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import $ from 'jquery';
import Loader from 'react-loader-spinner';


let e = new LocalizedStrings({ru,kk});



export default class editPassword extends React.Component{

    constructor() {
        super();
        (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

        this.state = {
            tokenExists: false,
            oldPassword: '',
            newPassword: '',
            confirm_password: '',
            answer:{
                oldPassword: '',
                confirm: ''
            },
            checkOldPass: false,
            loaderHidden: true
        }

        this.onOldPasswordChange = this.onOldPasswordChange.bind(this);
        this.onNewPasswordChange = this.onNewPasswordChange.bind(this);
        this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);

    }

    onOldPasswordChange(e){
        var data = new Object();
        data.password = e.target.value;
        if (sessionStorage.getItem('tokenInfo')) {
            $.ajax({
                type: 'POST',
                url: window.url + 'api/personalData/editPassword/'+sessionStorage.getItem('userId'),
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
                },
                data: JSON.stringify(data),
                success: function (data) {
                    console.log(data);
                    if (data.message == 'Пароль верный!'){
                        this.setState({answer:{oldPassword: '<span style="color: blue">' + data.message + '</span>'}});
                        this.setState({checkOldPass: true});
                    }else{
                        this.setState({answer:{oldPassword: data.message}});
                    }

                    $('.help-block1').html(this.state.answer.oldPassword);
                }.bind(this),
                fail: function (jqXHR) {
                    alert("Ошибка " + jqXHR.status + ': ' + jqXHR.statusText);
                },
                complete: function (jqXHR) {
                }
            });
        } else { console.log('session expired'); }
    }

    onNewPasswordChange(e){
        this.setState({newPassword: e.target.value});
    }

    onConfirmPasswordChange(e){
        this.setState({confirm_password: e.target.value});
    }




    onRequestSubmission(){
        var newPass = this.state.newPassword;
        var confirm_password = this.state.confirm_password;

        if (newPass != confirm_password){
            if (this.state.newPassword != ''){
                $('.help-block3').html('');
            }
            $('.help-block2').html('Пароль не совпадает, введите еще раз!');
            return false;
        }else {
            if (!this.state.checkOldPass) {
                alert('Введите старый пароль!');
                $('.help-block1').html('Старый пароль не был введен, введите!');
                return false;
            } else {
                if (this.state.newPassword == ''){
                    $('.help-block3').html('Введите новый пароль!');
                    return false;
                }

                var data = new Object();
                data.password = this.state.newPassword;
                if (sessionStorage.getItem('tokenInfo')) {
                    $.ajax({
                        type: 'POST',
                        url: window.url + 'api/personalData/updatePassword/' + sessionStorage.getItem('userId'),
                        contentType: 'application/json; charset=utf-8',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
                        },
                        data: JSON.stringify(data),
                        success: function (data) {
                            console.log(data);
                            if (data.message == 'Пароль был сохранен!') {
                                alert(data.message);
                                this.props.history.replace('/');
                            } else {
                                alert(data.message);
                                return false;
                            }

                        }.bind(this),
                        fail: function (jqXHR) {
                            alert("Ошибка " + jqXHR.status + ': ' + jqXHR.statusText);
                        },
                        complete: function (jqXHR) {
                        }
                    });
                } else {
                    console.log('session expired');
                }
            }
        }
    }






    componentWillMount(){
        console.log('page was uploaded')

    }

    render() {
        return (
            <div className="container">



                <div className="content container">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0 mt-2">{e.editPassword}</h4>
                            <div className="container navigational_price">
                                <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.editPassword}
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
                                                                <label className="control-label">Старый пароль:</label>
                                                                <input type="password" className="form-control" id="userName" name="oldPassword" onChange={this.onOldPasswordChange} required />
                                                                <p className="help-block help-block1" style={{color: 'red'}}>{this.state.answer.oldPassword}</p>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="control-label">Новый пароль:</label>
                                                                <input type="password" className="form-control newPassword" name="newPassword" onChange={this.onNewPasswordChange} required />
                                                                <p className="help-block help-block3" style={{color: 'red'}}></p>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="control-label">Подтверждение:</label>
                                                                <input type="password" className="form-control confirm_password" name="confirmPassword" onChange={this.onConfirmPasswordChange} required />
                                                                <p className="help-block help-block2" style={{color: 'red'}}>{this.state.answer.confirm}</p>
                                                            </div>

                                                            {this.state.loaderHidden &&
                                                            <div>
                                                                <button type="button" className="btn btn-outline-primary" onClick={this.onRequestSubmission.bind(this)}>Сохранить</button>
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
                                <Loader type="Oval" color="#46B3F2" height="100" width="100" />
                            </div>
                            }

                        </div>

                    </div>
                </div>

            </div>
        )
    }
}