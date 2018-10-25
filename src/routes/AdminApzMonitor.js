import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import '../assets/css/citizen.css';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import ReactHintFactory from 'react-hint'
import '../assets/css/reacthint.css';
const ReactHint = ReactHintFactory(React)

let e = new LocalizedStrings({ru,kk});

export default class AdminApzMonitor extends React.Component {
  componentDidMount() {
    this.props.breadCrumbs();
  }
  render() {
    return (
      <div className="content container body-content citizen-apz-list-page">
        <div>
          <div>
            <Switch>
              <Route path="/panel/admin/apz/status/:status/:page" exact render={(props) =>(
                <AllApzs {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/admin/apz/show/:id" exact render={(props) =>(
                <ShowApz {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Redirect from="/panel/admin/apz" to="/panel/admin/apz/status/active/1" />
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
      loaderHidden: false,
      response: null,
      pageNumbers: []
    };
  }

  componentDidMount() {
    this.props.breadCrumbs();
    this.getApzs();
  }

  componentWillReceiveProps(nextProps) {
    this.getApzs(nextProps.match.params.status, nextProps.match.params.page);
  }

  getApzs(status = null, page = null) {
    if (!status) {
      status = this.props.match.params.status;
    }

    if (!page) {
      page = this.props.match.params.page;
    }

    this.setState({ loaderHidden: false });

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/admin/all/" + status + '?page=' + page, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        //console.log(response);
        var pageNumbers = [];
        var start = (response.current_page - 4) > 0 ? (response.current_page - 4) : 1;
        var end = (response.current_page + 4) < response.last_page ? (response.current_page + 4) : response.last_page;

        for (start; start <= end; start++) {
          pageNumbers.push(start);
        }

        this.setState({pageNumbers: pageNumbers});
        this.setState({response: response});
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }

      this.setState({ loaderHidden: true });
    }.bind(this)
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
    var status = this.props.match.params.status;
    var page = this.props.match.params.page;
    var apzs = this.state.response ? this.state.response.data : [];

    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <h4 className="mb-0 mt-2">Архитектурно-планировочные задания</h4>
            <div className="row">
              <div className="col-sm-5 statusActive">
                <ul className="nav nav-tabs mb-2 pull-right">
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'active'} activeStyle={{color:"black"}} to="/panel/admin/apz/status/active/1" replace>Активные</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'draft'} activeStyle={{color:"black"}} to="/panel/admin/apz/status/draft/1" replace>Черновики</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'accepted'} activeStyle={{color:"black"}} to="/panel/admin/apz/status/accepted/1" replace>Принятые</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'declined'} activeStyle={{color:"black"}} to="/panel/admin/apz/status/declined/1" replace>Отказанные</NavLink></li>
                </ul>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '23%'}}>Название</th>
                  <th style={{width: '23%'}}>Заявитель</th>
                  <th style={{width: '20%'}}>Адрес</th>
                  <th style={{width: '20%'}}>Дата заявления</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {apzs.map(function(apz, index) {
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
                      <td>
                        <Link className="btn btn-outline-info" to={'/panel/admin/apz/show/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                      </td>
                    </tr>
                    );
                  }.bind(this))
                }

                {apzs.length === 0 &&
                  <tr>
                    <td colSpan="5">Пусто</td>
                  </tr>
                }
              </tbody>
            </table>

            {this.state.response && this.state.response.last_page > 1 &&
              <nav className="pagination_block">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/admin/apz/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/admin/apz/status/' + status + '/' + num}>{num}</Link>
                      </li>
                      );
                    }.bind(this))
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/admin/apz/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
                  </li>
                </ul>
              </nav>
            }
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
      showMapText: 'Показать карту',
      headResponseFile: null,
      waterResponseFile: null,
      phoneResponseFile: null,
      electroResponseFile: null,
      heatResponseFile: null,
      gasResponseFile: null,
      waterCustomTcFile: null,
      phoneCustomTcFile: null,
      electroCustomTcFile: null,
      heatCustomTcFile: null,
      pack2IdFile: null,
      gasCustomTcFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
      additionalFile: false,
      paymentPhotoFile: false,
      loaderHidden: false
    };
  }

  componentDidMount() {
    this.props.breadCrumbs();
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');

    this.setState({ loaderHidden: false });

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/admin/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var apz = JSON.parse(xhr.responseText);
        var commission = apz.commission;
        //console.log(apz.files);
        this.setState({apz: apz});
        this.setState({personalIdFile: apz.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: apz.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: apz.files.filter(function(obj) { return obj.category_id === 10 })[0]});
        this.setState({additionalFile: apz.files.filter(function(obj) { return obj.category_id === 27 })[0]});
        this.setState({paymentPhotoFile: apz.files.filter(function(obj) { return obj.category_id === 20 })[0]});
        var pack2IdFile = apz.files.filter(function(obj) { return obj.category_id === 25 }) ?
          apz.files.filter(function(obj) { return obj.category_id === 25 }) : [];
        if ( pack2IdFile.length > 0 ) {
          this.setState({pack2IdFile: pack2IdFile[0]});
        }

        if (apz.status_id === 1 || apz.status_id === 2) {

          if (commission) {
            if (commission.apz_water_response && commission.apz_water_response.files) {
              this.setState({waterResponseFile: commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
              this.setState({waterCustomTcFile: commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
            }

            if (commission.apz_electricity_response && commission.apz_electricity_response.files) {
              this.setState({electroResponseFile: commission.apz_electricity_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
              this.setState({electroCustomTcFile: commission.apz_electricity_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
            }

            if (commission.apz_phone_response && commission.apz_phone_response.files) {
              this.setState({phoneResponseFile: commission.apz_phone_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
              this.setState({phoneCustomTcFile: commission.apz_phone_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
            }

            if (commission.apz_heat_response && commission.apz_heat_response.files) {
              this.setState({heatResponseFile: commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
              this.setState({heatCustomTcFile: commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
            }

            if (commission.apz_gas_response && commission.apz_gas_response.files) {
              this.setState({gasResponseFile: commission.apz_gas_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
              this.setState({gasCustomTcFile: commission.apz_gas_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
            }
          }

          if (apz.apz_head_response && apz.apz_head_response.files) {
            this.setState({headResponseFile: apz.apz_head_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
          }
        }

        this.setState({loaderHidden: true});
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this)
    xhr.send();
  }

  downloadFile(id) {
    var token = sessionStorage.getItem('tokenInfo');
    var url = window.url + 'api/file/download/' + id;

    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
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
              setTimeout(function() {window.URL.revokeObjectURL(url);},0);
            };

          }());

          saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
        } else {
          alert('Не удалось скачать файл');
        }
      }
    xhr.send();
  }

  printApz(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/apz/" + apzId, true);
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
                setTimeout(function() {window.URL.revokeObjectURL(url);},0);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], "апз-" + project + formated_date + ".pdf");
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

  printRegionAnswer(apzId) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/region/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "МО.pdf");
          } else {
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
                setTimeout(function() {window.URL.revokeObjectURL(url);},0);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], "МО.pdf");
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
                setTimeout(function() {window.URL.revokeObjectURL(url);},0);
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
                setTimeout(function() {window.URL.revokeObjectURL(url);},0);
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
                setTimeout(function() {window.URL.revokeObjectURL(url);},0);
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
                setTimeout(function() {window.URL.revokeObjectURL(url);},0);
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
                setTimeout(function() {window.URL.revokeObjectURL(url);},0);
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

  render() {
    var apz = this.state.apz;

    if (apz.length === 0) {
      return (
        <div>
          {!this.state.loaderHidden &&
            <div style={{textAlign: 'center'}}>
              <Loader type="Oval" color="#46B3F2" height="200" width="200" />
            </div>
          }
        </div>
      );
    }

    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td style={{width: '22%'}}><b>ИД заявки</b></td>
                  <td>{apz.id}</td>
                </tr>
                <tr>
                  <td><b>Заявитель</b></td>
                  <td>{apz.applicant}</td>
                </tr>
                <tr>
                  <td><b>Телефон</b></td>
                  <td>{apz.phone}</td>
                </tr>
                <tr>
                  <td><b>Заказчик</b></td>
                  <td>{apz.customer}</td>
                </tr>
                <tr>
                  <td><b>Разработчик</b></td>
                  <td>{apz.designer}</td>
                </tr>
                <tr>
                  <td><b>Название проекта</b></td>
                  <td>{apz.project_name}</td>
                </tr>
                <tr>
                  <td><b>Адрес проектируемого объекта</b></td>
                  <td>
                    {apz.project_address}

                    {apz.project_address_coordinates &&
                      <a className="ml-2 pointer text-info" onClick={this.toggleMap.bind(this, true)}>Показать на карте</a>
                    }
                  </td>
                </tr>
                <tr>
                  <td><b>Дата заявления</b></td>
                  <td>{apz.created_at && this.toDate(apz.created_at)}</td>
                </tr>

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

                {this.state.additionalFile &&
                  <tr>
                    <td><b>Дополнительно</b></td>
                    <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.additionalFile.id)}>Скачать</a></td>
                  </tr>
                }

                {this.state.paymentPhotoFile &&
                  <tr>
                    <td><b>Сканированный файл оплаты</b></td>
                    <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.paymentPhotoFile.id)}>Скачать</a></td>
                  </tr>
                }

                {this.state.pack2IdFile &&
                  <tr>
                    <td>
                      <b>Пакет 2</b>
                      <br />
                      <span className={'help-block text-muted'}>архитектурно-планировочное задание, вертикальные планировочные
                      отметки, выкопировку из проекта детальной планировки, типовые поперечные
                      профили дорог и улиц, технические условия, схемы трасс наружных инженерных
                      сетей</span>
                    </td>
                    <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.pack2IdFile.id)}>Скачать</a></td>
                  </tr>
                }
              </tbody>
            </table>

            {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}

            <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
              {this.state.showMapText}
            </button>

            {(apz.status_id === 1 || apz.status_id === 2) &&
              <div>
                <h5 className="block-title-2 mt-5 mb-3">Результат</h5>

                {apz.status_id === 2 &&
                  <table className="table table-bordered table-striped">
                    <tbody>
                      {this.state.headResponseFile &&
                        <tr>
                          <td style={{width: '22%'}}><b>Загруженный АПЗ</b></td>
                          <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.headResponseFile.id)}>Скачать</a></td>
                        </tr>
                      }

                      <tr>
                        <td style={{width: '22%'}}><b>Сформированный АПЗ</b></td>
                        <td><a className="text-info pointer" onClick={this.printApz.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                      </tr>
                    </tbody>
                  </table>
                }

                {apz.status_id === 1 &&
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                          {this.state.headResponseFile ?
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.headResponseFile.id)}>Скачать</a></td>
                          :
                            <td><a className="text-info pointer" onClick={this.printRegionAnswer.bind(this, apz.id)}>Скачать</a></td>
                          }
                      </tr>
                    </tbody>
                  </table>
                }

                {apz.commission &&
                  <div>
                    <table className="table table-bordered table-striped">
                      <tbody>
                        {apz.commission.apz_water_response &&
                          <tr>
                            <td style={{width: '22%'}}>
                              <b>Водоснабжение</b>
                            </td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#water_provider_modal">Просмотр</a></td>
                          </tr>
                        }

                        {apz.commission.apz_heat_response &&
                          <tr>
                            <td>
                              <b>Теплоснабжение</b>
                            </td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#heat_provider_modal">Просмотр</a></td>
                          </tr>
                        }

                        {apz.commission.apz_electricity_response &&
                          <tr>
                            <td>
                              <b>Электроснабжение</b>
                            </td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#electricity_provider_modal">Просмотр</a></td>
                          </tr>
                        }

                        {apz.commission.apz_gas_response &&
                          <tr>
                            <td>
                              <b>Газоснабжение</b>
                            </td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#gas_provider_modal">Просмотр</a></td>
                          </tr>
                        }

                        {apz.commission.apz_phone_response &&
                          <tr>
                            <td>
                              <b>Телефонизация</b>
                            </td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#phone_provider_modal">Просмотр</a></td>
                          </tr>
                        }
                      </tbody>
                    </table>

                    {apz.commission &&  apz.commission.apz_water_response &&
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
                                {this.state.waterCustomTcFile && apz.commission.apz_water_response.response &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.waterCustomTcFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!this.state.waterCustomTcFile && apz.commission.apz_water_response.response &&
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

                                    {this.state.waterResponseFile &&
                                      <tr>
                                        <td><b>Загруженный ТУ</b></td>
                                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id)}>Скачать</a></td>
                                      </tr>
                                    }

                                    <tr>
                                      <td><b>Сформированный ТУ</b></td>
                                      <td><a className="text-info pointer" onClick={this.printWaterTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!apz.commission.apz_water_response.response && this.state.waterResponseFile &&
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

                    {apz.commission && apz.commission.apz_heat_response &&
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
                                {this.state.heatCustomTcFile && apz.commission.apz_heat_response.response &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.heatCustomTcFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!this.state.heatCustomTcFile && apz.commission.apz_heat_response.response &&
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
                                      <td><b>Отопление по договору</b></td>
                                      <td>{apz.commission.apz_heat_response.main_in_contract}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Вентиляция по договору</b></td>
                                      <td>{apz.commission.apz_heat_response.ven_in_contract}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Горячее водоснабжение по договору (ср/ч)</b></td>
                                      <td>{apz.commission.apz_heat_response.water_in_contract}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Горячее водоснабжение по договору (макс/ч)</b></td>
                                      <td>{apz.commission.apz_heat_response.water_in_contract_max}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Дополнительное</b></td>
                                      <td>{apz.commission.apz_heat_response.addition}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Номер документа</b></td>
                                      <td>{apz.commission.apz_heat_response.doc_number}</td>
                                    </tr>

                                    {this.state.heatResponseFile &&
                                      <tr>
                                        <td><b>Загруженный ТУ</b>:</td>
                                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id)}>Скачать</a></td>
                                      </tr>
                                    }

                                    <tr>
                                      <td><b>Сформированный ТУ</b></td>
                                      <td><a className="text-info pointer" onClick={this.printHeatTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!apz.commission.apz_heat_response.response && this.state.heatResponseFile &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>МО Тепло</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }
                              </table>

                              {!this.state.heatCustomTcFile && apz.commission.apz_heat_response.response && apz.commission.apz_heat_response.blocks &&
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

                    {apz.commission && apz.commission.apz_electricity_response &&
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
                                {this.state.electroCustomTcFile && apz.commission.apz_electricity_response.response &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.electroCustomTcFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!this.state.electroCustomTcFile && apz.commission.apz_electricity_response.response &&
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

                                    {this.state.electroResponseFile &&
                                      <tr>
                                        <td><b>Загруженный ТУ</b>:</td>
                                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id)}>Скачать</a></td>
                                      </tr>
                                    }

                                    <tr>
                                      <td><b>Сформированный ТУ</b></td>
                                      <td><a className="text-info pointer" onClick={this.printElectroTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!apz.commission.apz_electricity_response.response && this.state.electroResponseFile &&
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

                    {apz.commission && apz.commission.apz_gas_response &&
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
                                {this.state.gasCustomTcFile && apz.commission.apz_gas_response.response &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.gasCustomTcFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!this.state.gasCustomTcFile && apz.commission.apz_gas_response.response &&
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

                                    {this.state.gasResponseFile &&
                                      <tr>
                                        <td><b>Загруженный ТУ</b></td>
                                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id)}>Скачать</a></td>
                                      </tr>
                                    }

                                    <tr>
                                      <td><b>Сформированный ТУ</b></td>
                                      <td><a className="text-info pointer" onClick={this.printGasTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!apz.commission.apz_gas_response.response && this.state.gasResponseFile &&
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

                    {apz.commission && apz.commission.apz_phone_response &&
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
                                {this.state.phoneCustomTcFile && apz.commission.apz_phone_response.response &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.phoneCustomTcFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!this.state.phoneCustomTcFile && apz.commission.apz_phone_response.response &&
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

                                    {this.state.phoneResponseFile &&
                                      <tr>
                                        <td><b>Загруженный ТУ</b></td>
                                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id)}>Скачать</a></td>
                                      </tr>
                                    }

                                    <tr>
                                      <td><b>Сформированный ТУ</b></td>
                                      <td><a className="text-info pointer" onClick={this.printPhoneTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!apz.commission.apz_phone_response.response && this.state.phoneResponseFile &&
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
                  </div>
                }
              </div>
            }

            {apz.state_history.length > 0 &&
              <div>
                <h5 className="block-title-2 mb-3 mt-3">Логи</h5>
                <div className="border px-3 py-2">
                  {apz.state_history.map(function(state, index) {
                    return(
                      <div key={index}>
                        <p className="mb-0">{state.created_at}&emsp;{state.state.name}</p>
                      </div>
                    );
                  }.bind(this))}
                </div>
              </div>
            }

            {/*<h5 className="block-title-2 mt-5 mb-3">Статус</h5>
            <ShowStatusBar apz={this.state.apz} />*/}

            <div className="col-sm-12">
              <hr />
              <Link className="btn btn-outline-secondary pull-right" to={'/panel/admin/apz/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
            </div>
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

class ShowMap extends React.Component {
  constructor(props) {
    super(props);

    this.toggleMap = this.toggleMap.bind(this);
  }

  toggleMap(value) {
    this.props.mapFunction(value);
  }

  changeState(name, value) {
    var data = {
      target: {name: name, value: value}
    };

    this.props.changeFunction(data);
  }

  saveCoordinates() {
    this.changeState('projectAddressCoordinates', $('#coordinates').html());

    this.props.hasCoordinates(true);

    if (window.confirm('Местоположение отмечено. Закрыть карту?')) {
      this.toggleMap(false);
    }
  }

  render() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    var oldPoint = [];
    var withPoint = this.props.point;
    var coordinates = this.props.coordinates;

    return (
      <div>
        {withPoint ?
          <div className="row">
            <div className="col-sm-6">
              <h5 className="block-title-2 mt-0 mb-3">Карта</h5>
            </div>
            <div className="col-sm-6">
              <div className="pull-right">
                <button type="button" className="btn btn-outline-success mr-1" onClick={() => this.saveCoordinates()}>Сохранить</button>
                <button type="button" className="btn btn-outline-secondary" onClick={this.toggleMap.bind(this, false)}>Закрыть карту</button>
              </div>
            </div>
          </div>
          :
          <h5 className="block-title-2 mt-5 mb-3">Карта</h5>
        }
        <div id="coordinates" style={{display: 'none'}}></div>
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
                basemap: "streets",
                portalItem: {
                  id: "caa580cafc1449dd9aa4fd8eafd3a14d"
                }
              });

              /*var flRedLines = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8/FeatureServer",
                outFields: ["*"],
                title: "Красные линии"
              });
              map.add(flRedLines);

              var flFunZones = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%A4%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5_%D0%B7%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B52/FeatureServer",
                outFields: ["*"],
                title: "Функциональное зонирование"
              });
              map.add(flFunZones);

              var flGosAkts = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                outFields: ["*"],
                title: "Гос акты"
              });
              map.add(flGosAkts);*/

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

              if (withPoint) {
                view.on("click", showCoordinates);

                function showCoordinates(evt) {
                  var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
                  dom.byId("coordinates").innerHTML = mp.x.toFixed(5) + ", " + mp.y.toFixed(5);

                  var point = {
                    type: "point",
                    longitude: mp.x.toFixed(5),
                    latitude: mp.y.toFixed(5)
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

                  view.graphics.remove(oldPoint);
                  view.graphics.add(pointGraphic);

                  oldPoint = pointGraphic;
                }
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

class AddHeatBlock extends React.Component {
  deleteBlock(num) {
    this.props.deleteBlock(num)
  }

  componentWillMount() {
    $('.block_delete').css('display', 'none');
  }

  onBlockChange(e) {
    this.props.onBlockChange(e, this.props.num);
  }

  render() {
    return (
      <div className="col-md-12">
        <p style={{textTransform: 'uppercase', margin: '10px 0 5px'}}>
          Здание №<span className="block_num">{this.props.num}</span>

          {this.props.num != 1 &&
            <span style={{cursor: 'pointer', userSelect: 'none'}} className="block_delete pull-right text-secondary" onClick={this.deleteBlock.bind(this, this.props.num)}>Удалить</span>
          }
        </p>

        <div className="row" style={{background: '#efefef', margin: '0 0 20px', padding: '20px 0 10px'}}>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatMain">Отопление<br />(Гкал/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatMain} onChange={this.onBlockChange.bind(this)} name="heatMain" placeholder="" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatVentilation">Вентиляция<br />(Гкал/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatVentilation} onChange={this.onBlockChange.bind(this)} name="heatVentilation" placeholder="" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatWater">Горячее водоснабжение<br />(ср/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatWater} onChange={this.onBlockChange.bind(this)} name="heatWater" placeholder="" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatWaterMax">Горячее водоснабжение<br />(макс/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatWaterMax} onChange={this.onBlockChange.bind(this)} name="heatWaterMax" placeholder="" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ShowStatusBar extends React.Component {
  constructor(props) {
    super(props);

    this.getStatusForArch = this.getStatusForArch.bind(this);
    this.getStatusForHeadArch = this.getStatusForHeadArch.bind(this);
    this.getStatusForProvider = this.getStatusForProvider.bind(this);
  }

  // change status for Architect in ProgressBar
  getStatusForArch(status, rd, rr) {
    if((status === 0 || status === 1 || status === 3 || status === 4) && (rd !== null && rr === null))
      return 'circle done';
    else if(status === 0 && (rd !== null && rr !== null))
      return 'circle fail';
    else if(status === 2)
      return 'circle active';
    else
      return 'circle';
  }

  // change status for Providers(water, heat, gas, electricity) in ProgressBar
  getStatusForProvider(pStatus, status) {
    if(status === 1)
      return 'circle done';
    else if(status === 0)
      return 'circle fail';
    else if(pStatus === 3 && status === 2)
      return 'circle active';
    else
      return 'circle';
  }

  // change status for HeadArchitect in ProgressBar
  getStatusForHeadArch(status, hd, hr) {
    if(status === 2 || ((status === 0 || status === 1 || status === 2 || status === 3) && (hd === null && hr === null)))
      return 'circle';
    else if(status === 4)
      return 'circle active';
    else if(status === 0)
      return 'circle fail';
    else
      return 'circle done';
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

  render() {
    return (
      <div className="row">
        <div className="row statusBar">
          {/*<div id="infoDiv">Нажмите на участок или объект, чтобы получить информацию</div>*/}
          {/*<div id="viewDiv"></div>*/}
          <div className="progressBar container">
            <ul className="timeline">
              <li>
                <div className="timestamp">
                  <span>
                    <p>Районный архитектор</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Инженер</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Коммунальные службы</p>
                    <div className="status">
                      <div className="komStatus">
                                <ul>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">Алматы Су</span>
                                        </div>
                                    </li>
                                    <li className=" li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">Алматы Телеком</span>
                                        </div>
                                    </li>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/error.png" alt="error"/>
                                          <span className="author">Алатау Жарык Компаниясы</span>
                                        </div>
                                    </li>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">КазТрансГаз</span>
                                        </div>
                                    </li>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">Тепловые сети Алматы</span>
                                        </div>
                                    </li>
                                </ul>
                      </div>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Инженер</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Отдел АПЗ</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Главный архитектор</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <br />
          <div className="row actionDate">
            <div className="col-2" style={{padding: '0'}}></div>
            <div className="col-8" style={{padding: '0', fontSize: '0.9em'}}>
              <div className="row">
                <div className="col-2">{this.props.apz.RegionDate && this.toDate(this.props.apz.RegionDate)}</div>
                <div className="col-1point5">{this.props.apz.ProviderWaterDate && this.toDate(this.props.apz.ProviderWaterDate)}</div>
                <div className="col-1point5">{this.props.apz.ProviderGasDate && this.toDate(this.props.apz.ProviderGasDate)}</div>
                <div className="col-1point5">{this.props.apz.ProviderHeatDate && this.toDate(this.props.apz.ProviderHeatDate)}</div>
                <div className="col-2">{this.props.apz.ProviderElectricityDate && this.toDate(this.props.apz.ProviderElectricityDate)}</div>
                <div className="col-2">{this.props.apz.ProviderPhoneDate && this.toDate(this.props.apz.ProviderPhoneDate)}</div>
                <div className="col-2">{this.props.apz.HeadDate && this.toDate(this.props.apz.HeadDate)}</div>
              </div>
            </div>
            <div className="col-2" style={{padding: '0'}}></div>
          </div>
        </div>
      </div>
    )
  }
}
