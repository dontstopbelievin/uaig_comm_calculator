import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../../languages/header.json';
import Loader from 'react-loader-spinner';

let e = new LocalizedStrings({ru,kk});

export default class AddUsers extends React.Component{

  constructor(props) {
    super(props);
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      tokenExists: false,
      userData: [],
      iin: '',
      bin: '',
      full_name: '',
      last_name: '',
      first_name: '',
      middle_name: '',
      company_name: '',
      email: '',
      password: '',
      hide_bin: false,
      hide_iin: false,
      loaderHidden: true
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onInputChange2 = this.onInputChange2.bind(this);
  }

  onInputChange(e){
    this.setState({ [e.target.name] : e.target.value});
    //console.log(e.target.name +": "+e.target.value);
  }

  onInputChange2(e){
    if(e.target.name === 'iin'){
      if(e.target.value === ''){
        this.setState({ hide_bin : false});
      }else{
        this.setState({ hide_bin : true});
      }
    }else{
      if(e.target.value === ''){
        this.setState({ hide_iin : false});
      }else{
        this.setState({ hide_iin : true});
      }
    }
    this.setState({ [e.target.name] : e.target.value});
  }

  onRequestSubmission(){

    if(this.state.bin === '' && this.state.iin === '' ){
      alert('Заполните поле ИИН или БИН')
      return false;
    }
    var requiredFields = {
      full_name: 'полное имя',
      last_name: 'фамилия',
      first_name: 'имя',
      middle_name: 'отчество',
      email: 'электронный адрес',
      password: 'пароль'
    };

    var errors = 0;
    var err_msgs = "";
    Object.keys(requiredFields).forEach(function(key){
      if (!this.state[key]) {
        err_msgs += 'Заполните поле ' + requiredFields[key] + '\n';
        errors++;
        return false;
      }
    }.bind(this));
    if (errors > 0) {
      alert(err_msgs);
      return false;
    }
    this.setState({loaderHidden: false});

    var data = new Object();
    data.bin = this.state.bin;
    data.iin = this.state.iin;
    data.company_name = this.state.company_name;
    data.full_name = this.state.full_name;
    data.last_name = this.state.last_name;
    data.first_name = this.state.first_name;
    data.middle_name = this.state.middle_name;
    data.email = this.state.email;
    data.password = this.state.password;

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + 'api/apz/admin/createuser', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      switch (xhr.status) {
        case 200:
          alert(JSON.parse(xhr.responseText).message);
          break;
        case 403:
          alert(JSON.parse(xhr.responseText).message);
          break;
        default:
      }
      this.setState({loaderHidden: true});
    }.bind(this);
    xhr.send(JSON.stringify(data));
  }

  componentDidMount(){
    this.props.breadCrumbs();
  }

  generatePassword(){
    var string = "abcdefghijklmnopqrstuvwxyz"; //to upper
    var numeric = '0123456789';
    var punctuation = '!@#$%^&*()_+`}{[]?><-=';
    var password = "";
    for(var i = 0; i<2; i++) {
      var arr_indexes = [0,1,2];
      var index1 = arr_indexes[Math.floor(Math.random() * Math.random() * 3)];
      var index = arr_indexes.indexOf(index1);
      arr_indexes.splice(index, 1);
      var index2 = arr_indexes[Math.floor(Math.random() * Math.random() * 2)];
      index = arr_indexes.indexOf(index2);
      arr_indexes.splice(index, 1);
      var index3 = arr_indexes[0];

      var letter = (i===0)?(string.charAt(Math.ceil(string.length * Math.random() * Math.random())).toUpperCase()):(string.charAt(Math.ceil(string.length * Math.random() * Math.random())));
      var digit = numeric.charAt(Math.ceil(numeric.length * Math.random()*Math.random()));
      var spec_char = punctuation.charAt(Math.ceil(punctuation.length * Math.random()*Math.random()));
      var arr_chars = [letter, digit, spec_char];

      password += arr_chars[index1];
      password += arr_chars[index2];
      password += arr_chars[index3];
      //console.log(index1 +" "+index2+" "+index3);
      //console.log(arr_chars[index1] + " " + arr_chars[index2] + " "+ arr_chars[index3]);
    }
    //console.log(password);
    this.setState({password: password});
  }

  render() {
    return (
      <div className="container body-content">
          <div className="content container">
              <div>
                  <div className="card-header">
                      <h4 className="mb-0 mt-2">Добавить нового пользователя</h4>
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
                                                      {!this.state.hide_iin && <div className="form-group">
                                                          <label className="control-label">ИИН:</label>
                                                          <input type="text" className="form-control" id="userName" name="iin" value={this.state.iin } onChange={this.onInputChange2} required />
                                                      </div>}
                                                      {!this.state.hide_bin && <div className="form-group">
                                                          <label className="control-label">БИН:</label>
                                                          <input type="text" className="form-control" id="userName" name="bin" value={this.state.bin } onChange={this.onInputChange2} required />
                                                      </div>}
                                                      <div className="form-group">
                                                          <label className="control-label">Название компании:</label>
                                                          <input type="text" className="form-control" name="company_name" value={this.state.company_name} onChange={this.onInputChange} required />
                                                      </div>
                                                      <div className="form-group">
                                                          <label className="control-label">Электронный адрес:</label>
                                                          <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.onInputChange} required />
                                                      </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label">Полное имя:</label>
                                                        <input type="text" className="form-control" name="full_name" value={this.state.full_name} onChange={this.onInputChange} required />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label">Фамилия:</label>
                                                        <input type="text" className="form-control" name="last_name" value={this.state.last_name} onChange={this.onInputChange} required />
                                                    </div>
                                                      <div className="form-group">
                                                          <label className="control-label">Имя:</label>
                                                          <input type="text" className="form-control" name="first_name" value={this.state.first_name} onChange={this.onInputChange} required />
                                                      </div>
                                                      <div className="form-group">
                                                          <label className="control-label">Отчество:</label>
                                                          <input type="text" className="form-control" name="middle_name" value={this.state.middle_name} onChange={this.onInputChange} required />
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="row">
                                                <div className="col-md-12">
                                                  <label className="control-label">Ваш пароль: {this.state.password}</label>
                                                </div>
                                                <div className="col-md-12">
                                                  <button type="button" className="btn btn-raised btn-primary" onClick={this.generatePassword.bind(this)}>Сгенерировать пароль</button>
                                                </div>
                                                {this.state.loaderHidden ?
                                                  <div className="col-md-12">
                                                    <button type="button" className="btn btn-raised btn-success" onClick={this.onRequestSubmission.bind(this)}>Создать пользователя</button>
                                                  </div>
                                                :
                                                  <div className="col-md-12">
                                                    <div style={{width: '100px'}}>
                                                      <Loader type="Oval" color="#46B3F2" height="100" width="100" />
                                                    </div>
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
          </div>
      </div>
    )
  }
}
