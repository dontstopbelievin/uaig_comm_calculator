import React from 'react';
import LocalizedStrings from 'react-localization';
import { ru, kk } from '../../languages/header.json';
import $ from 'jquery';
import Loader from 'react-loader-spinner';
let e = new LocalizedStrings({ ru, kk });

class EditPersonalData extends React.Component {

  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      tokenExists: false,
      userData: [],
      iin: '',
      bin: '',
      last_name: '',
      first_name: '',
      middle_name: '',
      company_name: '',
      email: '',
      loaderHidden: false
    };

    this.onBinChange = this.onBinChange.bind(this);
    this.onIinChange = this.onIinChange.bind(this);
    this.onCompanyNameChange = this.onCompanyNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onMiddleNameChange = this.onMiddleNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);

  }
  onBinChange(e) {
    this.setState({ bin: e.target.value });
  }
  onIinChange(e) {
    this.setState({ iin: e.target.value });
  }
  onCompanyNameChange(e) {
    this.setState({ company_name: e.target.value });
  }
  onLastNameChange(e) {
    this.setState({ last_name: e.target.value });
  }
  onFirstNameChange(e) {
    this.setState({ first_name: e.target.value });
  }
  onMiddleNameChange(e) {
    this.setState({ middle_name: e.target.value });
  }
  onEmailChange(e) {
    this.setState({ email: e.target.value });
  }
  onRequestSubmission() {
    console.log(JSON.stringify(this.state.userData));
    var data = new Object();
    if (this.state.bin !== '') {
      data.bin = this.state.bin;
    } else {
      data.iin = this.state.iin;
    }

    data.company_name = this.state.company_name;
    data.last_name = this.state.last_name;
    data.first_name = this.state.first_name;
    data.middle_name = this.state.middle_name;
    data.email = this.state.email;


    if (sessionStorage.getItem('tokenInfo')) {
      $.ajax({
        type: 'POST',
        url: window.url + 'api/personalData/update/' + sessionStorage.getItem('userId'),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
        },
        data: JSON.stringify(data),
        success: function (data) {
          console.log(data);
          console.log('___________________________');
          alert(data.message);
          console.log('_____________end______________');
          this.props.history.push('/panel/base-page');
        },
        fail: function (jqXHR) {
          alert("Ошибка " + jqXHR.status + ': ' + jqXHR.statusText);
        },
        error: function (jqXHR, exception) {
          var msg = '';
          switch (jqXHR.status) {
            case 0:
              msg = 'Not connect.\n Verify Network.';
              break;
            case 404:
              msg = 'Requested page not found. [404]';
              break;
            case 500:
              msg = 'Возможно данный ИИН/БИН или e-mail уже существует';
              break;
            default:
              msg = 'Uncaught Error.\n' + jqXHR.responseText;
              break;
          }

          // if (jqXHR.status === 0) {
          //     msg = 'Not connect.\n Verify Network.';
          // } else if (jqXHR.status == 404) {
          //     msg = 'Requested page not found. [404]';
          // } else if (jqXHR.status == 500) {
          //     msg = 'Internal Server Error [500].'+jqXHR.text;
          // } else if (exception === 'parsererror') {
          //     msg = 'Requested JSON parse failed.';
          // } else if (exception === 'timeout') {
          //     msg = 'Time out error.';
          // } else if (exception === 'abort') {
          //     msg = 'Ajax request aborted.';
          // } else {
          //     msg = 'Uncaught Error.\n' + jqXHR.responseText;
          // }
          alert("Ошибка " + msg);
        },
        complete: function (jqXHR) {
        }
      });
    } else { console.log('session expired'); }
  }
  componentDidMount() {
    console.log(sessionStorage.getItem('userId'));
    var userId = sessionStorage.getItem('userId');
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/personalData/edit/" + userId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        data = data.userData;
        console.log(data);
        this.setState({ company_name: data.company_name });
        this.setState({ email: data.email });
        this.setState({ first_name: data.first_name });
        this.setState({ last_name: data.last_name });
        this.setState({ middle_name: data.middle_name });

        if (data.bin !== null) {
          this.setState({ bin: data.bin });
        } else {
          this.setState({ bin: false });
          this.setState({ iin: data.iin });
        }
        this.setState({ loaderHidden: true });
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      } else if (xhr.status === 500) {
        alert('Пользователь не найден в базе данных. Попробуйте еще раз!')
      }
    }.bind(this);
    xhr.send();
    this.props.breadCrumbs();
  }
  render() {
    return (
      <div className="container body-content">
        <div className="content container">
          <div>
            <div className="card-header">
              <h4 className="mb-0 mt-2">Изменение персональных данных</h4>
            </div>

            <div>
              <div className="dialog" role="document">
                <div className="content">
                  <div className="row">
                    <div className="col-md-9">
                      <div id="menu1" className="tab-pane fade active show">
                        <p>&nbsp;</p>
                        <form id="editData">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label className="control-label">ИИН/БИН:</label>
                                {this.state.bin &&
                                  <input type="text" className="form-control" id="userName" name="bin" value={this.state.bin} onChange={this.onBinChange} required />
                                }
                                {!this.state.bin &&
                                  <input type="text" className="form-control" id="userName" name="iin" value={this.state.iin} onChange={this.onIinChange} required />
                                }

                              </div>
                              <div className="form-group">
                                <label className="control-label">Название компании:</label>
                                <input type="text" className="form-control" name="company_name" value={this.state.company_name} onChange={this.onCompanyNameChange} required />
                              </div>
                              <div className="form-group">
                                <label className="control-label">Фамилия:</label>
                                <input type="text" className="form-control" name="last_name" value={this.state.last_name} onChange={this.onLastNameChange} required />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label className="control-label">Имя:</label>
                                <input type="text" className="form-control" name="first_name" value={this.state.first_name} onChange={this.onFirstNameChange} required />
                              </div>
                              <div className="form-group">
                                <label className="control-label">Отчество:</label>
                                <input type="text" className="form-control" name="middle_name" value={this.state.middle_name} onChange={this.onMiddleNameChange} required />
                              </div>
                              <div className="form-group">
                                <label className="control-label">Электронный адрес:</label>
                                <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.onEmailChange} required />
                              </div>
                              <div className="row">
                                {this.state.loaderHidden &&
                                  <div>
                                    <button type="button" className="btn btn-outline-primary" onClick={this.onRequestSubmission.bind(this)}>Сохранить</button>
                                    <input type="reset" className="btn btn-outline-secondary" />
                                  </div>
                                }
                              </div>
                            </div>
                          </div>
                        </form>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
              {!this.state.loaderHidden &&
                <div style={{ margin: '0 auto', width: '100px' }}>
                  <Loader type="Oval" color="#46B3F2" height="100" width="100" />
                </div>
              }

            </div>

          </div>
        </div>

      </div>
    )
  }
};

export { EditPersonalData }
