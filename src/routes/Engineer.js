import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
import $ from 'jquery';
import 'jquery-serializejson';
//import { NavLink } from 'react-router-dom';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';

export default class Engineer extends React.Component {
  render() {
    return (
      <div className="content container urban-apz-page">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/engineer/status/:status" component={AllApzs} />
              <Route path="/engineer/:id" component={ShowApz} />
              <Redirect from="/engineer" to="/engineer/status/active" />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

class AllApzs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apzs: [],
      loaderHidden: false
    };
  }

  componentDidMount() {
    this.getApzs();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.status !== nextProps.match.params.status) {
       this.getApzs(nextProps.match.params.status);
   }
  }

  getApzs(status = null) {
    if (!status) {
      status = this.props.match.params.status;
    }

    this.setState({ loaderHidden: false });

    var token = sessionStorage.getItem('tokenInfo');
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Token is expired, please login again!");
        this.props.history.replace("/login");
        return false;
    }

    //var providerName = roles[1];
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/engineer", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        switch (status) {
          case 'active':
            var apzs = data.in_process;
            break;

          case 'accepted':
            apzs = data.accepted;
            break;

          case 'declined':
            apzs = data.declined;
            break;

          default:
            apzs = data;
            break;
        }
        
        this.setState({apzs: apzs});
      }

      this.setState({ loaderHidden: true });
    }.bind(this);
    xhr.send();
  }

  toDate(date) {
    if(date === null) {
      return date;
    }

    var jDate = new Date(date);
    var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
    var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var curr_hour = jDate.getHours() < 10 ? "0" + jDate.getHours() : jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
    
    return formated_date;
  }

  render() {
    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <ul className="nav nav-tabs mb-2 pull-right">
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/engineer/status/active" replace>Активные</NavLink></li>
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/engineer/status/accepted" replace>Принятые</NavLink></li>
              <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/engineer/status/declined" replace>Отказанные</NavLink></li>
            </ul>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '23%'}}>Название</th>
                  <th style={{width: '23%'}}>Заявитель</th>
                  <th style={{width: '20%'}}>Адрес</th>
                  <th style={{width: '20%'}}>Дата заявления</th>
                  <th style={{width: '14%'}}>Срок</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.apzs.map(function(apz, index) {
                  return(
                    <tr key={index}>
                      <td>
                        {apz.project_name} 

                        {apz.object_type &&
                          <span className="ml-1">({apz.object_type})</span>
                        }
                      </td>
                      <td>{apz.applicant}</td>
                      <td>{apz.project_address}</td>
                      <td>{this.toDate(apz.created_at)}</td>
                      <td>{apz.object_term}</td>
                      <td>
                        <Link className="btn btn-outline-info" to={'/engineer/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                      </td>
                    </tr>
                    );
                  }.bind(this))
                }
              </tbody>
            </table>
          </div>
        }

        {!this.state.loaderHidden &&
          <div style={{textAlign: 'center'}}>
            <Loader type="Oval" color="#46B3F2" height="200" width="200" />
          </div>
        }
      </div>
    )
  }
}

class ShowApz extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apz: [],
      showMap: false,
      showButtons: false,
      showCommission: false,
      file: false,
      docNumber: "",
      description: '',
      responseFile: null,
      waterResponseFile: null,
      phoneResponseFile: null,
      electroResponseFile: null,
      heatResponseFile: null,
      gasResponseFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
      showMapText: 'Показать карту',
      response: null,
    };

    this.onDocNumberChange = this.onDocNumberChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.checkTerm = this.checkTerm.bind(this);
  }

  onDocNumberChange(e) {
    this.setState({ docNumber: e.target.value });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/engineer/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var commission = data.commission;
        var hasReponse = data.state_history.filter(function(obj) { return obj.state_id === 5 || obj.state_id === 6 });

        this.setState({apz: data});
        this.setState({showButtons: false});
        this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});

        if (commission) {
          if (commission.apz_water_response && commission.apz_water_response.files) {
            this.setState({waterResponseFile: commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
          }
          
          if (commission.apz_electricity_response && commission.apz_electricity_response.files) {
            this.setState({electroResponseFile: commission.apz_electricity_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
          }

          if (commission.apz_phone_response && commission.apz_phone_response.files) {
            this.setState({phoneResponseFile: commission.apz_phone_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
          }

          if (commission.apz_heat_response && commission.apz_heat_response.files) {
            this.setState({heatResponseFile: commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
          }

          if (commission.apz_gas_response && commission.apz_gas_response.files) {
            this.setState({gasResponseFile: commission.apz_gas_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
          }
        }

        if (data.status_id === 4 && hasReponse.length == 0) {
          this.setState({showButtons: true});
        }

        if (hasReponse.length == 0) {
          this.setState({showCommission: true});
        }
      }
    }.bind(this)
    xhr.send();
  }

  downloadFile(id) {
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/file/download/' + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          var base64ToArrayBuffer = (function () {
        
            return function (base64) {
              var binaryString =  window.atob(base64);
              var binaryLen = binaryString.length;
              var bytes = new Uint8Array(binaryLen);
              
              for (var i = 0; i < binaryLen; i++) {
                var ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
              }
              
              return bytes; 
            }
            
          }());

          var saveByteArray = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            
            return function (data, name) {
              var blob = new Blob(data, {type: "octet/stream"}),
                  url = window.URL.createObjectURL(blob);
              a.href = url;
              a.download = name;
              a.click();
              window.URL.revokeObjectURL(url);
            };

          }());

          saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
        } else {
          alert('Не удалось скачать файл');
        }
      }
    xhr.send();
  }

  // print technical condition of waterProvider
  printWaterTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/water/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } else {
            var data = JSON.parse(xhr.responseText);
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";

            var base64ToArrayBuffer = (function () {
        
              return function (base64) {
                var binaryString =  window.atob(base64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);
                
                for (var i = 0; i < binaryLen; i++) {
                  var ascii = binaryString.charCodeAt(i);
                  bytes[i] = ascii;
                }
                
                return bytes; 
              }
              
            }());

            var saveByteArray = (function () {
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              
              return function (data, name) {
                var blob = new Blob(data, {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                a.click();
                window.URL.revokeObjectURL(url);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Вода-" + project + formated_date + ".pdf");
          }
        } else {
          alert('Не удалось скачать файл');
        }
      }
      xhr.send();
    } else {
      console.log('Время сессии истекло.');
    }
  }

  // print technical condition of gasProvider
  printGasTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/gas/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } else {
            var data = JSON.parse(xhr.responseText);
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";

            var base64ToArrayBuffer = (function () {
        
              return function (base64) {
                var binaryString =  window.atob(base64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);
                
                for (var i = 0; i < binaryLen; i++) {
                  var ascii = binaryString.charCodeAt(i);
                  bytes[i] = ascii;
                }
                
                return bytes; 
              }
              
            }());

            var saveByteArray = (function () {
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              
              return function (data, name) {
                var blob = new Blob(data, {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                a.click();
                window.URL.revokeObjectURL(url);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Газ-" + project + formated_date + ".pdf");
          }
        } else {
          alert('Не удалось скачать файл');
        }
      }
      xhr.send();
    } else {
      console.log('Время сессии истекло.');
    }
  }

  // print technical condition of electroProvider
  printElectroTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/electro/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } else {
            var data = JSON.parse(xhr.responseText);
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";

            var base64ToArrayBuffer = (function () {
        
              return function (base64) {
                var binaryString =  window.atob(base64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);
                
                for (var i = 0; i < binaryLen; i++) {
                  var ascii = binaryString.charCodeAt(i);
                  bytes[i] = ascii;
                }
                
                return bytes; 
              }
              
            }());

            var saveByteArray = (function () {
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              
              return function (data, name) {
                var blob = new Blob(data, {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                a.click();
                window.URL.revokeObjectURL(url);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Электр-" + project + formated_date + ".pdf");
          }
        } else {
          alert('Не удалось скачать файл');
        }
      }
      xhr.send();
    } else {
      console.log('Время сессии истекло.');
    }
  }

  // print technical condition of heatProvider
  printHeatTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/heat/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } else {
            var data = JSON.parse(xhr.responseText);
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";

            var base64ToArrayBuffer = (function () {
        
              return function (base64) {
                var binaryString =  window.atob(base64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);
                
                for (var i = 0; i < binaryLen; i++) {
                  var ascii = binaryString.charCodeAt(i);
                  bytes[i] = ascii;
                }
                
                return bytes; 
              }
              
            }());

            var saveByteArray = (function () {
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              
              return function (data, name) {
                var blob = new Blob(data, {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                a.click();
                window.URL.revokeObjectURL(url);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Тепло-" + project + formated_date + ".pdf");
          }
        } else {
          alert('Не удалось скачать файл');
        }
      }
      xhr.send();
    } else {
      console.log('Время сессии истекло.');
    }
  }

  // print technical condition of phoneProvider
  printPhoneTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/phone/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } else {
            var data = JSON.parse(xhr.responseText);
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";

            var base64ToArrayBuffer = (function () {
        
              return function (base64) {
                var binaryString =  window.atob(base64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);
                
                for (var i = 0; i < binaryLen; i++) {
                  var ascii = binaryString.charCodeAt(i);
                  bytes[i] = ascii;
                }
                
                return bytes; 
              }
              
            }());

            var saveByteArray = (function () {
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              
              return function (data, name) {
                var blob = new Blob(data, {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                a.click();
                window.URL.revokeObjectURL(url);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Телефон-" + project + formated_date + ".pdf");
          }
        } else {
          alert('Не удалось скачать файл');
        }
      }
      xhr.send();
    } else {
      console.log('session expired');
    }
  }

  toggleMap(value) {
    this.setState({
      showMap: value
    })

    if (value) {
      this.setState({
        showMapText: 'Скрыть карту'
      })
    } else {
      this.setState({
        showMapText: 'Показать карту'
      })
    }
  }

  toDate(date) {
    if(date === null) {
      return date;
    }
    
    var jDate = new Date(date);
    var curr_date = jDate.getDate();
    var curr_month = jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var curr_hour = jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
    
    return formated_date;
  }

  checkTerm(dateTime) {
    var nowDate = new Date();
    var currentDay = nowDate.getDate();
    var currentMonth = nowDate.getMonth()+1;
    var currentYear = nowDate.getFullYear();
    var oldDate = [];
    oldDate[0] = dateTime.slice(0,4);
    oldDate[1] = dateTime.slice(5,7);
    oldDate[2] = dateTime.slice(8,10);
    var oldTime = [];
    oldTime[0] = dateTime.slice(11,13);
    oldTime[1] = dateTime.slice(14,16);
    oldTime[2] = dateTime.slice(17,19);

    oldDate[0] = parseInt(oldDate[0], 10);
    oldDate[1] = parseInt(oldDate[1], 10);
    oldDate[2] = parseInt(oldDate[2], 10);

    if (oldDate[0] == currentYear && oldDate[1] == currentMonth){
      var term = currentDay - oldDate[2];
      switch(term){
        case 0:
          term = "5 дней";
          break;
        case 1:
          term = "4 дня";
          break;
        case 2:
          term = "3 дня";
          break;
        case 3:
          term = "2 дня";
          break;
        case 4:
          term = "1 день";
          break;
        case 5:
          term = "Срок до 16:00";
          break;
        default:
          term = "Просрочено";
      }

      return term;
    }else if(oldDate[0] != currentYear){
      var term = "Просрочено уже больше года";
      return term;
    }else if(oldDate[1] != currentMonth){
      var term = "Просрочено уже как месяц";
      return term;
    }



  }

  createCommission(id) {
    var data = $('.commission_users_table input').serializeJSON();

    if (Object.keys(data).length == 0) {
      alert('Не выбраны провайдеры');
      return false;
    }

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/engineer/create_commission/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert('Заявка успешно отправлена');
        this.getApzInfo();
      } else {
        alert('Не удалось отправить заявку');
      }
    }.bind(this)
    xhr.send(JSON.stringify(data));
  }

  acceptDeclineApzForm(apzId, status, comment) {
    var token = sessionStorage.getItem('tokenInfo');
    var file = this.state.file;

    var formData = new FormData();
    formData.append('response', status);
    formData.append('message', comment);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/engineer/status/" + apzId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        //var data = JSON.parse(xhr.responseText);

        if(status === true) {
          alert("Заявление принято!");
          this.setState({ showButtons: false });
        } else {
          alert("Заявление отклонено!");
          this.setState({ showButtons: false });
        }

        this.setState({ showCommission: false });
      }
      else if(xhr.status === 401){
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData);
  }
  
  render() {
    var apz = this.state.apz;

    if (apz.length === 0) {
      return false;
    }

    return (
      <div className="row">
        <div className="col-sm-6">
          <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>
          
          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <td style={{width: '50%'}}><b>ИД заявки</b></td>
                <td><b>Заявитель</b></td>
              </tr>
              <tr>
                <td>{apz.id}</td>
                <td>{apz.applicant}</td>
              </tr>
            </tbody>
          </table>

          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <td style={{width: '50%'}}><b>Разработчик</b></td>
                <td><b>Название проекта</b></td>
              </tr>
              <tr>
                <td>{apz.designer}</td>
                <td>{apz.project_name}</td>
              </tr>
            </tbody>
          </table>

          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <td style={{width: '50%'}}><b>Телефон</b></td>
                <td><b>Адрес проектируемого объекта</b></td>
              </tr>
              <tr>
                <td>{apz.phone}</td>
                <td>
                  {apz.project_address}

                  {apz.project_address_coordinates &&
                    <a className="ml-2 pointer text-info" onClick={this.toggleMap.bind(this, true)}>Показать на карте</a>
                  }
                </td>
              </tr>
            </tbody>
          </table>

          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <td style={{width: '50%'}}><b>Заказчик</b></td>
                <td><b>Дата заявления</b></td>
              </tr>
              <tr>
                <td>{apz.customer}</td>
                <td>{apz.created_at && this.toDate(apz.created_at)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-sm-6">
          <h5 className="block-title-2 mt-3 mb-3">Файлы</h5>
              
          <table className="table table-bordered table-striped">
            <tbody>
              {this.state.personalIdFile &&
                <tr>
                  <td><b>Уд. лич./ Реквизиты</b></td>
                  <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id)}>Скачать</a></td>
                </tr>
              }

              {this.state.confirmedTaskFile &&
                <tr>
                  <td><b>Утвержденное задание</b></td>
                  <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.confirmedTaskFile.id)}>Скачать</a></td>
                </tr>
              }

              {this.state.titleDocumentFile &&
                <tr>
                  <td><b>Правоустанавл. документ</b></td>
                  <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.titleDocumentFile.id)}>Скачать</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className="col-sm-12">
          {this.state.showCommission &&
            <div>
              <h5 className="block-title-2 mt-3 mb-3">Решение</h5>

              <table className="table table-bordered commission_users_table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Название провайдера</th>
                    <th>Кол. дней осталось</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                
                {apz.commission && Object.keys(apz.commission).length > 0 ?
                  <tbody>
                    {apz.commission.users.map(function(item, index) {
                      return(
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <a className="text-info pointer" data-toggle="modal" data-target={'#' + item.role.name.toLowerCase() + '_provider_modal'}>{item.role.description}</a>
                          </td>
                          <td>{this.checkTerm(item.created_at) }</td>
                          <td>{item.status.name}</td>
                        </tr>
                        );
                      }.bind(this))
                    }
                  </tbody>
                  :
                  <tbody>
                    <tr>
                      <td>
                        <input className="form-control" type="checkbox" name="commission_users[]" value="Water" />
                      </td>
                      <td>Водоснабжение</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <input className="form-control" type="checkbox" name="commission_users[]" value="Heat" />
                      </td>
                      <td>Теплоснабжение</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <input className="form-control" type="checkbox" name="commission_users[]" value="Electricity" />
                      </td>
                      <td>Электроснабжение</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <input className="form-control" type="checkbox" name="commission_users[]" value="Gas" />
                      </td>
                      <td>Газоснабжение</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <input className="form-control" type="checkbox" name="commission_users[]" value="Phone" />
                      </td>
                      <td>Телефонизация</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                }
              </table>

              {!apz.commission &&
                <div className="col-sm-12">
                  <button className="btn btn-raised btn-info" onClick={this.createCommission.bind(this, apz.id)} style={{margin: '20px auto 10px'}}>
                    Создать комиссию
                  </button>
                </div>
              }
            </div>
          }

          <div className={this.state.showButtons ? '' : 'invisible'}>
            <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', marginBottom: '10px', display: 'table'}}>
              <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} 
                      onClick={this.acceptDeclineApzForm.bind(this, apz.id, true, "your form was accepted")}>
                Одобрить
              </button>
                
              <button className="btn btn-raised btn-danger" onClick={this.acceptDeclineApzForm.bind(this, apz.id, false, this.state.description)}>
                Вернуть архитектору
              </button>
            </div>
          </div>

          <div className="col-sm-12">
            {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}

            <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
              {this.state.showMapText}
            </button>
          </div>

          {this.state.waterResponseFile &&
            <div className="modal fade" id="water_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Решение водоснабжения</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      {apz.commission.apz_water_response.response ?
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>Общая потребность (м<sup>3</sup>/сутки)</b></td>
                            <td>{apz.commission.apz_water_response.gen_water_req}</td>
                          </tr>
                          <tr>
                            <td><b>Хозпитьевые нужды (м<sup>3</sup>/сутки)</b></td>
                            <td>{apz.commission.apz_water_response.drinking_water}</td>
                          </tr>
                          <tr>
                            <td><b>Производственные нужды (м<sup>3</sup>/сутки)</b></td>
                            <td>{apz.commission.apz_water_response.prod_water}</td>
                          </tr>
                          <tr>
                            <td><b>Расходы пожаротушения внутренные (л/сек)</b></td>
                            <td>{apz.commission.apz_water_response.fire_fighting_water_in}</td>
                          </tr>
                          <tr>
                            <td><b>Расходы пожаротушения внешные (л/сек)</b></td>
                            <td>{apz.commission.apz_water_response.fire_fighting_water_out}</td>
                          </tr>
                          <tr>
                            <td><b>Точка подключения</b></td>
                            <td>{apz.commission.apz_water_response.connection_point}</td>
                          </tr>
                          <tr>
                            <td><b>Рекомендация</b></td>
                            <td>{apz.commission.apz_water_response.recommendation}</td>
                          </tr>
                          <tr>
                            <td><b>Номер документа</b></td>
                            <td>{apz.commission.apz_water_response.doc_number}</td>
                          </tr>
                          <tr>
                            <td><b>Загруженный ТУ</b></td>  
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id)}>Скачать</a></td>
                          </tr>
                          <tr>
                            <td><b>Сформированный ТУ</b></td>  
                            <td><a className="text-info pointer" onClick={this.printWaterTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                          </tr>
                        </tbody>
                        :
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>МО Вода</b></td>  
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id)}>Скачать</a></td>
                          </tr>
                        </tbody>
                      }
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {this.state.heatResponseFile &&
            <div className="modal fade" id="heat_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Решение теплоснабжения</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      {apz.commission.apz_heat_response.response ?
                        <tbody>
                          <tr> 
                            <td style={{width: '50%'}}><b>Источник теплоснабжения</b></td>
                            <td>{apz.commission.apz_heat_response.resource}</td>
                          </tr>
                          <tr>
                            <td><b>Точка подключения</b></td>
                            <td>{apz.commission.apz_heat_response.connection_point}</td>
                          </tr>
                          <tr>
                            <td><b>Тепловые нагрузки по договору</b></td>
                            <td>{apz.commission.apz_heat_response.load_contract_num}</td>
                          </tr>
                          <tr>
                            <td><b>Дополнительное</b></td>
                            <td>{apz.commission.apz_heat_response.addition}</td>
                          </tr>
                          <tr>
                            <td><b>Номер документа</b></td>
                            <td>{apz.commission.apz_heat_response.doc_number}</td> 
                          </tr>
                          <tr>
                            <td><b>Загруженный ТУ</b>:</td> 
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id)}>Скачать</a></td>
                          </tr>
                          <tr>
                            <td><b>Сформированный ТУ</b></td>  
                            <td><a className="text-info pointer" onClick={this.printHeatTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                          </tr>
                        </tbody>
                        :
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>МО Тепло</b></td>  
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id)}>Скачать</a></td>
                          </tr>
                        </tbody>
                      }
                    </table>

                    {apz.commission.apz_heat_response.response && apz.commission.apz_heat_response.blocks &&
                      <div>
                        {apz.commission.apz_heat_response.blocks.map(function(item, index) {
                          return(
                            <div key={index}>
                              {apz.commission.apz_heat_response.blocks.length > 1 &&
                                <h5>Здание №{index + 1}</h5>
                              }
                              
                              <table className="table table-bordered table-striped">
                                <tbody>
                                  <tr>
                                    <td style={{width: '50%'}}><b>Отопление (Гкал/ч)</b></td>
                                    <td>{item.main}</td>
                                  </tr>
                                  <tr>
                                    <td><b>Вентиляция (Гкал/ч)</b></td>
                                    <td>{item.ven}</td>
                                  </tr>
                                  <tr>
                                    <td><b>Горячее водоснабжение (ср/ч)</b></td>
                                    <td>{item.water}</td>
                                  </tr>
                                  <tr>
                                    <td><b>Горячее водоснабжение (макс/ч)</b></td>
                                    <td>{item.water_max}</td>
                                  </tr>
                                  <tr>
                                    <td><b>Отопление по договору (Гкал/ч)</b></td>
                                    <td>{item.main_in_contract}</td>
                                  </tr>
                                  <tr>
                                    <td><b>Вентиляция по договору (Гкал/ч)</b></td>
                                    <td>{item.ven_in_contract}</td>
                                  </tr>
                                  <tr>
                                    <td><b>Горячее водоснабжение по договору (ср/ч)</b></td>
                                    <td>{item.water_in_contract}</td>
                                  </tr>
                                  <tr>
                                    <td><b>Горячее водоснабжение по договору (макс/ч)</b></td>
                                    <td>{item.water_in_contract_max}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          );
                        }.bind(this))}
                      </div>
                    }
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {this.state.electroResponseFile &&
            <div className="modal fade" id="electricity_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Решение электроснабжения</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      {apz.commission.apz_electricity_response.response ?
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>Требуемая мощность (кВт)</b></td>
                            <td>{apz.commission.apz_electricity_response.req_power}</td>
                          </tr>
                          <tr> 
                            <td><b>Характер нагрузки (фаза)</b></td>
                            <td>{apz.commission.apz_electricity_response.phase}</td>
                          </tr>
                          <tr>
                            <td><b>Категория по надежности (кВт)</b></td>
                            <td>{apz.commission.apz_electricity_response.safe_category}</td>
                          </tr>
                          <tr>
                            <td><b>Точка подключения</b></td>
                            <td>{apz.commission.apz_electricity_response.connection_point}</td>
                          </tr>
                          <tr>
                            <td><b>Рекомендация</b></td>
                            <td>{apz.commission.apz_electricity_response.recommendation}</td>
                          </tr>
                          <tr>
                            <td><b>Номер документа</b></td>
                            <td>{apz.commission.apz_electricity_response.doc_number}</td> 
                          </tr>
                          <tr>
                            <td><b>Загруженный ТУ</b>:</td> 
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id)}>Скачать</a></td>
                          </tr>
                          <tr>
                            <td><b>Сформированный ТУ</b></td>  
                            <td><a className="text-info pointer" onClick={this.printElectroTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                          </tr>
                        </tbody>
                        :
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>МО Электро</b></td>  
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id)}>Скачать</a></td>
                          </tr>
                        </tbody>
                      }
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {this.state.gasResponseFile &&
            <div className="modal fade" id="gas_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Решение газоснабжения</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      {apz.commission.apz_gas_response.response ?
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>Точка подключения</b></td>
                            <td>{apz.commission.apz_gas_response.connection_point}</td>
                          </tr>
                          <tr>
                            <td><b>Диаметр газопровода (мм)</b></td>
                            <td>{apz.commission.apz_gas_response.gas_pipe_diameter}</td>
                          </tr>
                          <tr>
                            <td><b>Предполагаемый объем (м<sup>3</sup>/час)</b></td>
                            <td>{apz.commission.apz_gas_response.assumed_capacity}</td>
                          </tr>
                          <tr>
                            <td><b>Предусмотрение</b></td>
                            <td>{apz.commission.apz_gas_response.GasReconsideration}</td>
                          </tr>
                          <tr>
                            <td><b>Номер документа</b></td>
                            <td>{apz.commission.apz_gas_response.doc_number}</td>
                          </tr>
                          <tr>
                            <td><b>Загруженный ТУ</b></td> 
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id)}>Скачать</a></td>
                          </tr>
                          <tr>
                            <td><b>Сформированный ТУ</b></td>  
                            <td><a className="text-info pointer" onClick={this.printGasTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                          </tr>
                        </tbody>
                        :
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>МО Газ</b></td>  
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id)}>Скачать</a></td>
                          </tr>
                        </tbody>
                      }
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {this.state.phoneResponseFile &&
            <div className="modal fade" id="phone_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Решение телефонизации</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      {apz.commission.apz_phone_response.response ?
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</b></td>
                            <td>{apz.commission.apz_phone_response.service_num}</td>
                          </tr>
                          <tr>
                            <td><b>Телефонная емкость</b></td>
                            <td>{apz.commission.apz_phone_response.capacity}</td>
                          </tr>
                          <tr>
                            <td><b>Планируемая телефонная канализация</b></td>
                            <td>{apz.commission.apz_phone_response.sewage}</td>
                          </tr>
                          <tr>
                            <td><b>Пожелания заказчика (тип оборудования, тип кабеля и др.)</b></td>
                            <td>{apz.commission.apz_phone_response.client_wishes}</td>
                          </tr>
                          <tr>
                            <td><b>Номер документа</b></td>
                            <td>{apz.commission.apz_phone_response.doc_number}</td>
                          </tr>
                          <tr>
                            <td><b>Загруженный ТУ</b></td>
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id)}>Скачать</a></td>
                          </tr>
                          <tr>
                            <td><b>Сформированный ТУ</b></td>
                            <td><a className="text-info pointer" onClick={this.printPhoneTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                          </tr>
                        </tbody>
                        :
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>МО Газ</b></td>
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id)}>Скачать</a></td>
                          </tr>
                        </tbody>
                      }
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          <div className="col-sm-12">
            <hr />
            <Link className="btn btn-outline-secondary pull-right" to={'/engineer/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
          </div>
        </div>
      </div>
    )
  }
}

class ShowMap extends React.Component {
  render() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    var coordinates = this.props.coordinates;

    return (
      <div>
        <h5 className="block-title-2 mt-5 mb-3">Карта</h5>
        <div className="col-md-12 viewDiv"> 
          <EsriLoaderReact options={options} 
            modulesToLoad={[
              'esri/views/MapView',
              
              'esri/widgets/LayerList',

              'esri/WebScene',
              'esri/layers/FeatureLayer',
              'esri/layers/TileLayer',
              'esri/widgets/Search',
              'esri/WebMap',
              'esri/geometry/support/webMercatorUtils',
              'dojo/dom',
              'esri/Graphic',
              'dojo/domReady!'
            ]}    
            
            onReady={({loadedModules: [MapView, LayerList, WebScene, FeatureLayer, TileLayer, Search, WebMap, webMercatorUtils, dom, Graphic], containerNode}) => {
              var map = new WebMap({
                portalItem: {
                  id: "caa580cafc1449dd9aa4fd8eafd3a14d"
                }
              });
            
              if (coordinates) {
                var coordinatesArray = coordinates.split(", ");

                var view = new MapView({
                  container: containerNode,
                  map: map,
                  center: [parseFloat(coordinatesArray[0]), parseFloat(coordinatesArray[1])], 
                  scale: 10000
                });

                var point = {
                  type: "point",
                  longitude: parseFloat(coordinatesArray[0]),
                  latitude: parseFloat(coordinatesArray[1])
                };

                var markerSymbol = {
                  type: "simple-marker",
                  color: [226, 119, 40],
                  outline: {
                    color: [255, 255, 255],
                    width: 2
                  }
                };

                var pointGraphic = new Graphic({
                  geometry: point,
                  symbol: markerSymbol
                });

                view.graphics.add(pointGraphic);
              } else {
                  view = new MapView({
                  container: containerNode,
                  map: map,
                  center: [76.886, 43.250], 
                  scale: 10000
                });
              }
              
              var searchWidget = new Search({
                view: view,
                sources: [{
                  featureLayer: new FeatureLayer({
                    url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                    popupTemplate: { // autocasts as new PopupTemplate()
                      title: "Кадастровый номер: {cadastral_number} </br> Назначение: {function} <br/> Вид собственности: {ownership}"
                    }
                  }),
                  searchFields: ["cadastral_number"],
                  displayField: "cadastral_number",
                  exactMatch: false,
                  outFields: ["cadastral_number", "function", "ownership"],
                  name: "Зарегистрированные государственные акты",
                  placeholder: "Кадастровый поиск"
                }]
              });
    
              view.when( function(callback){
                var layerList = new LayerList({
                  view: view
                });

                // Add the search widget to the top right corner of the view
                view.ui.add(searchWidget, {
                  position: "top-right"
                });

                // Add widget to the bottom right corner of the view
                view.ui.add(layerList, "bottom-right");

              }, function(error) {
                console.log('MapView promise rejected! Message: ', error);
              });
            }}
          /> 
        </div>
      </div>
    )
  }
}