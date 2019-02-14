import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../../languages/header.json';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';


let e = new LocalizedStrings({ru,kk});



export default class forgotPassword extends React.Component{

  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      tokenExists: false,
      email: '',
      loaderHidden: true
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    // this.getLink = this.getLink.bind(this);
  }
  onEmailChange (e) {
    this.setState({email: e.target.value});
  }
  getLink () {
    console.log('getLink() is working');
    var data = new Object();
    data.email = this.state.email;

    var formData = new FormData();
    formData.append('email', this.state.email);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + 'api/password/email', true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert('Успешно!');
        console.log(data);
        this.props.history.replace('/');
      } else {
        alert("Ошибка!");
        console.log(data);
      }
    }.bind(this);
    xhr.send(JSON.stringify({email: this.state.email}));
  }

  render() {
    return (
      <div className="container">

              <div>
      <div id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <Link to="/">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </Link>
              <h4 className="modal-title" id="myModalLabel">{e.forgotPassword}</h4>
            </div>
            <div className="modal-body">

              <div id="menu1" className="tab-pane fade active show">
                <p>&nbsp;</p>
                <form id="loginForm">
                    <h5>Получить ссылку для сброса пароля</h5>
                    <br />
                  <div className="form-group">
                    <label className="control-label" htmlFor="email">Email:</label>
                    <input type="text" className="form-control" id="email" pleaceholder="Введите вашу электронную почту" value={this.state.email} onChange={this.onEmailChange} required />
                  </div>

                  <div className="modal-footer">
                    {!this.state.loaderHidden &&
                      <div style={{margin: '0 auto'}}>
                        <Loader type="Ball-Triangle" color="#46B3F2" height="70" width="70" />
                      </div>
                    }
                    {this.state.loaderHidden &&
                      <div>
                        <button type="button" className="btn btn-primary" onClick={this.getLink.bind(this)}>Получить ссылку</button>
                        <Link to="/" style={{marginRight:'5px'}}>
                          <button type="button" className="btn btn-default" data-dismiss="modal">Закрыть</button>
                        </Link>

                      </div>

                    }
                  </div>

                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    )
  }
}
