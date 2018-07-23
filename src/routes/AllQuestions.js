import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import '../assets/css/NewsArticle.css';
import WOW from 'wowjs';
import $ from 'jquery';
import Loader from 'react-loader-spinner';

let e = new LocalizedStrings({ru,kk});

export default class AllQuestions extends React.Component{

  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      questions: [],
      questionTextArea: ''
    };
    this.getMessages = this.getMessages.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.id !== nextProps.match.params.id) {
        this.getPage(nextProps.match.params.id);
    }
  }
  componentDidMount() {
    this.getMessages();
  }
  getMessages ()
  {
    var link = 'api/allQuestionsWithAnswer';
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + link, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        if (data.questions.length !== 0) {
            this.setState({questions: data.questions});
            console.log(data.questions);
        }
      } else {
        alert("Ошибка во время загрузкий ответов от администратора!");
      }
    }.bind(this);
    xhr.send();
  }
  delete(id, index)
  {
    let token = sessionStorage.getItem('tokenInfo');
    let link = 'api/questions/admin/delete/' + id;

    if (token)
    {
      let xhr = new XMLHttpRequest();
      xhr.open("get", window.url + link, true);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200)
        {
            alert('Вопрос успешно удален!');
            let array = this.state.questions;
            array.splice(index,1);
            this.setState({questions: array});
        }else if (xhr.status === 500)
        {
            alert('Проблема во время удаление!');
        }
      }.bind(this);
      xhr.send();
    }
  }
  onQuestionTextAreaChange (e)
  {
    this.setState({questionTextArea: e.target.value });
  }
  sendQuestion ()
  {
    let link = 'api/insertWithoutUser';
    var question = new Object();
    question.question = this.state.questionTextArea;
    console.log(question);
    let xhr = new XMLHttpRequest();
    xhr.open("post", window.url + link, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200)
      {
          alert('Вопрос успешно отправлен!');
          this.setState({questionTextArea: ''});
      }else if (xhr.status === 500)
      {
          alert('Проблема во время добавления!');
      }
    }.bind(this);
    xhr.send(JSON.stringify(question));
  }

  render() {
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    var auth;
    if (roles){
      if ( roles[0] === "Admin" && sessionStorage.getItem('tokenInfo') )
      {
          auth = true;
      }else if ( roles[0] !== "Admin" && sessionStorage.getItem('tokenInfo') ) {
          auth = false;
      }
    } else {
      auth = false;
    }
    return(
      <div className="container body-content newsArticle wow fadeInUp" data-wow-duration="1s">
        <div className="row col-md-12">
          <div className="container home-page col-md-12 wow fadeInUp" data-wow-duration="1.5s">
            <div className="row">
              <div className="col-md-12 col-xs-12 black-main text-center">
                <h4>Вопрос - Ответ</h4>
                <span><img src="./images/line.png" /></span>
                {/*   place for sending questions  */}
                {roles &&
                  <div className="card-deck comment">
                    <div className="card mt-4 mb-4">
                      <div className="card-body">
                        <div className="card-text">
                          <h6 className="dearUser text-muted">Форма для вопросов администратору</h6>
                          <div className={'row'}>
                            <form className={'col-md-12'} id={'question_form'}>
                              <div className="form-group col-md-12">
                                <label htmlFor="exampleInputEmail1">Ваш вопрос</label>
                                <textarea className="form-control"
                                          name={'question'}
                                          id={'question_text'}
                                          value={this.state.questionTextArea}
                                          onChange={this.onQuestionTextAreaChange.bind(this)}>&nbsp;</textarea>
                                <small id="emailHelp" className="form-text text-muted">
                                  В вопрос будет отправлена сразу администратору.
                                </small>
                              </div>
                            </form>
                          </div>
                          <div className="dropdown-divider"></div>
                          <button type="submit" className="btn btn-primary" onClick={this.sendQuestion.bind(this)}>Отправить вопрос</button>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                {!roles &&
                <div className="card-deck comment">
                  <div className="card mt-4 mb-4">
                    <div className="card-body">
                      <div className="card-text">
                        <h6 className="dearUser text-muted">Обратите внимание!</h6>
                        <p>Для того, чтобы задать свой вопрос, необходимо <NavLink to={'/panel/common/login'}>войти</NavLink> в систему или <NavLink to={'/panel/common/register'}>зарегистрироваться</NavLink>.</p>
                      </div>
                    </div>
                  </div>
                </div>
                }
                {/*   place for sending questions  */}
                {/*   show questions which has answered  */}
                {this.state.questions.map(function (message,index) {
                  if (message.status === 2)
                  {
                    return (
                      <div className="card-deck comment text-left">
                        <div className="card mt-4 mb-4">
                          <div className="card-body">
                            {auth &&
                            <button type="button" className="close" data-dismiss="alert" onClick={this.delete.bind(this, message.id, index)} aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                            }
                            <div className="card-text" key={index}>
                              <h6 className="dearUser text-muted">Вопрос # {index + 1}</h6>
                              <p>{message.question}</p>
                              <div className="dropdown-divider"></div>
                              <h6 className="dearUser text-muted">Ответ администратора</h6>
                              <p>{message.answer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }.bind(this))
                }
                {/*   show questions which has answered  */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
