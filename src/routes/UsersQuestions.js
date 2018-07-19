import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import Autocomplete from 'react-autocomplete';
import {ru, kk} from '../languages/header.json';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
let e = new LocalizedStrings({ru,kk});


export default class UsersQuestions extends React.Component {
  constructor(props) {
    super(props);
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
        questions: []
    };

    this.getMessages = this.getMessages.bind(this);
  }

  componentDidMount ()
  {
    this.props.breadCrumbs();
    this.getMessages();
  }
   getMessages ()
  {
    var token = sessionStorage.getItem('tokenInfo');
    if(sessionStorage.getItem('tokenInfo')) {
        var link = 'api/questions/admin/getQuestions';
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + link, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data.questions.length !== 0) {
                    this.setState({questions: data.questions});
                } else {
                    alert('Нет сообщении пользователю!');
                }
            } else {
                alert("Нет сообщении");
            }
        }.bind(this);
        xhr.send();
    }
  }
  answer (index)
  {
      var token = sessionStorage.getItem('tokenInfo');
      var currentObject = this.state.questions[index];
      var textarea = document.getElementById('textarea-'+index);
      var question = new Object();
      question.answer = textarea.value;
      question.id = currentObject.id;

      if (token)
      {
          var link = 'api/questions/admin/answer';
          var xhr = new XMLHttpRequest();
          xhr.open("post", window.url + link, true);
          xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
          xhr.setRequestHeader("Authorization", "Bearer " + token);
          xhr.onload = function () {
              if (xhr.status === 200) {
                  var data = JSON.parse(xhr.responseText);
                  var modal = $('#modalMessage'+index);
                  modal.modal('hide');
                  var array = this.state.questions;
                  array[index].status = 2;
                  this.setState({questions: array});
              } else if (xhr.status === 401) {
                  sessionStorage.clear();
                  alert("Время сессии истекло. Пожалуйста войдите заново!");
                  this.props.history.replace("/login");
              } else {
                  alert("Отправка сообщении не получилось!");
              }
          }.bind(this);
          xhr.send(JSON.stringify(question));
      }
  }
  render() {

    return (
        <div className="container body-content">



          <div className="content container citizen-apz-list-page">
              <div className="col-md-12 col-xs-12 black-main text-center">
                  <h4>Вопросы администратору</h4>
                  <span><img src="./images/line.png" /></span>
              </div>

              {this.state.questions.map(function (message,index) {
                  if (message.status === 1)
                  {
                      return (
                          <div className="card-deck comment">
                            <div className="card mt-4 mb-4">

                             <div className="card-body">
                                 <div className="card-text" key={index}>
                                     <h6 className="dearUser text-muted">Ваш вопрос # {message.id}</h6>
                                     <p>{message.question}</p>
                                     <div className="dropdown-divider">&nbsp;</div>
                                     <h6 className="dearUser text-muted">Ответ администратора</h6>
                                     <input type="button"
                                            className='btn btn-outline-success'
                                            data-toggle="modal" data-target={'#modalMessage'+index}
                                            value="Ответить" />
                                 </div>
                             </div>

                            <div className="modal fade" id={'modalMessage'+index} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                 <div className="modal-dialog" role="document">
                                   <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Вопрос пользователя</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                          {message.question}
                                          <hr />
                                            <h5 className="modal-title" id="exampleModalLabel">Ваш ответ</h5>
                                            <textarea className={'form-control'} id={'textarea-'+index}></textarea>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                            <button type="button" className="btn btn-primary" onClick={this.answer.bind(this, index)}>Отправить ответ</button>
                                        </div>
                                    </div>
                                 </div>
                            </div>

                            </div>
                          </div>
                      )
                  }
              }.bind(this))}

              <br />

          </div>

        </div>
    )
  }
}