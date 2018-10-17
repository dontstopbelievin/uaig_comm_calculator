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
      <div className="content container body-content">
        <div>
          <div>
            <Switch>
              <Route path="/panel/engineer/apz/status/:status/:page" exact render={(props) =>(
                <AllApzs {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/engineer/apz/show/:id" exact render={(props) =>(
                <ShowApz {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Redirect from="/panel/engineer/apz" to="/panel/engineer/apz/status/active/1" />
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
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Token is expired, please login again!");
        this.props.history.replace("/login");
        return false;
    }

    //var providerName = roles[1];
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/engineer/all/" + status + '?page=' + page, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var pageNumbers = [];
        var start = (response.current_page - 4) > 0 ? (response.current_page - 4) : 1;
        var end = (response.current_page + 4) < response.last_page ? (response.current_page + 4) : response.last_page;

        for (start; start <= end; start++) {
          pageNumbers.push(start);
        }

        this.setState({pageNumbers: pageNumbers});
        this.setState({response: response});
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

  toApz(id, e) {
    this.props.history.push('/panel/engineer/apz/show/' + id);
  }

  render() {
    var status = this.props.match.params.status;
    var page = this.props.match.params.page;
    var apzs = this.state.response ? this.state.response.data : [];

    return (
      <div>
        <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание</h4>
        </div>
        {this.state.loaderHidden &&
          <div>
            <ul className="nav nav-tabs mb-2 pull-right">
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/engineer/apz/status/active/1" replace>Активные</NavLink></li>
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'awaiting'} to="/panel/engineer/apz/status/awaiting/1" replace>В ожидании</NavLink></li>
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/engineer/apz/status/accepted/1" replace>Принятые</NavLink></li>
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/engineer/apz/status/declined/1" replace>Отказанные</NavLink></li>
            </ul>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '5%'}}>ИД</th>
                  <th style={{width: '16%'}}>Дата</th>
                  <th style={{width: '5%'}}>Тип</th>
                  <th style={{width: '16%'}}>Заявитель</th>
                  <th style={{width: '16%'}}>Адрес</th>
                  <th style={{width: '16%'}}>Район</th>
                  {/*<th></th>*/}
                </tr>
              </thead>

              <tbody className="tbody">
                {apzs.map(function(apz, index) {
                  return(
                    <tr style={{background: !apz.commission ? '#e1e7ef' : ''}} key={index} className="cursor" onClick={this.toApz.bind(this, apz.id)}>
                      <td>
                        {apz.id}
                      </td>
                      <td>
                        {this.toDate(apz.created_at)}
                      </td>
                      <td>
                        {apz.object_type &&
                          <span className="ml-1">({apz.object_type})</span>
                        }
                      </td>
                      <td>
                        {apz.applicant}
                      </td>
                      <td>
                        {apz.project_address}
                      </td>
                      <td>
                        {apz.region}
                      </td>
                      {/*<td>*/}
                        {/*<Link className="btn btn-outline-info" to={'/panel/engineer/apz/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>*/}
                      {/*</td>*/}
                    </tr>
                  );
                  }.bind(this))
                }
              </tbody>
            </table>

            {this.state.response && this.state.response.last_page > 1 &&
              <nav className="pagination_block">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/engineer/apz/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/engineer/apz/status/' + status + '/' + num}>{num}</Link>
                      </li>
                      );
                    }.bind(this))
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/engineer/apz/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
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
      showButtons: false,
      showCommission: false,
      file: false,
      docNumber: "",
      description: '',
      categoryFiles: [],
      responseFile: null,
      pack2IdFile: null,
      waterResponseFile: null,
      phoneResponseFile: null,
      electroResponseFile: null,
      heatResponseFile: null,
      gasResponseFile: null,
      waterCustomTcFile: null,
      phoneCustomTcFile: null,
      electroCustomTcFile: null,
      heatCustomTcFile: null,
      gasCustomTcFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
      claimedCapacityJustification: false,
      showMapText: 'Показать карту',
      response: null,
      comment: null
    };

    this.onDocNumberChange = this.onDocNumberChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  //
    this.selectFromList = this.selectFromList.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.selectFile = this.selectFile.bind(this);
  }
  componentDidMount() {
    this.props.breadCrumbs();
  }

  onDocNumberChange(e) {
    this.setState({ docNumber: e.target.value });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  onCommentChange(e) {
    this.setState({ comment: e.target.value });
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  componentWillMount() {
    if(!sessionStorage.getItem('tokenInfo')){
      let fullLoc = window.location.href.split('/');
      return this.props.history.replace({pathname: "/panel/common/login", state:{url_apz_id: fullLoc[fullLoc.length-1]}});
    }else {
      this.getApzInfo();
    }
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
        //console.log("______________________________");console.log(data);
        this.setState({apz: data});
        this.setState({showButtons: false});
        this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});
        var pack2IdFile = data.files.filter(function(obj) { return obj.category_id === 25 }) ?
          data.files.filter(function(obj) { return obj.category_id === 25 }) : [];
        if ( pack2IdFile.length > 0 ) {
          this.setState({pack2IdFile: pack2IdFile[0]});
        }

        this.setState({claimedCapacityJustification: data.files.filter(function(obj) { return obj.category_id === 24 })[0]});

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

        if ((data.status_id === 4 || data.status_id === 5) && hasReponse.length == 0) {
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

  createCommission(id) {
    var data = $('.commission_users_table input').serializeJSON();
    
    if (Object.keys(data).length == 0) {
      alert('Не выбраны провайдеры');
      return false;
    }

    data["comment"]= this.state.comment;

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/engineer/create_commission/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert('Заявка успешно отправлена');
        this.getApzInfo();
      } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
        alert(JSON.parse(xhr.responseText).message);
      } else {
        alert('Не удалось отправить заявку');
      }
    }.bind(this)
    xhr.send(JSON.stringify(data));
  }

  acceptDeclineApzForm(apzId, status, comment, direct) {
    var token = sessionStorage.getItem('tokenInfo');
    var file = this.state.file;

    var formData = new FormData();
    formData.append('response', status);
    formData.append('message', comment);
    if ( this.state.pack2IdFile != null ) {
      formData.append('file_id', this.state.pack2IdFile.id);
    }else{
      formData.append('file_id', '');
    }
    formData.append('direct', direct.length > 0 ? direct : 'region');

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/engineer/status/" + apzId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        //var data = JSON.parse(xhr.responseText);

        if (status === true) {
          alert("Заявление принято!");
          this.setState({ showButtons: false });
        } else {
          alert("Заявление отклонено!");
          this.setState({ showButtons: false });
        }

        this.setState({ showCommission: false });
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
        alert(JSON.parse(xhr.responseText).message);
      }else{
        console.log(JSON.parse(xhr.responseText));
      }
    }.bind(this);
    xhr.send(formData);
  }

  uploadFile(category, e) {
    var file = e.target.files[0];
    var name = file.name.replace(/\.[^/.]+$/, "");
    var progressbar = $('.progress[data-category=' + category + ']');

    if (!file || !category) {
      alert('Не удалось загрузить файл');

      return false;
    }

    var formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('category', category);
    progressbar.css('display', 'flex');
    $.ajax({
      type: 'POST',
      url: window.url + 'api/file/upload',
      contentType: false,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      processData: false,
      data: formData,
      xhr: function() {
        var xhr = new window.XMLHttpRequest();

        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            $('div', progressbar).css('width', percentComplete + '%');
          }
        }, false);

        return xhr;
      },
      success: function (response) {
        var data = {id: response.id, name: response.name};

        setTimeout(function() {
          progressbar.css('display', 'none');

          switch (category) {
            case 3:
              this.setState({personalIdFile: data});
              break;

            case 9:
              this.setState({confirmedTaskFile: data});
              break;

            case 10:
              this.setState({titleDocumentFile: data});
              break;

            case 20:
              this.setState({paymentPhotoFile: data});
              break;

            case 22:
              this.setState({survey: data});
              break;

            case 24:
              this.setState({claimedCapacityJustification: data});

            case 25:
              this.setState({pack2IdFile: data});
              break;
          }

          alert("Файл успешно загружен");
        }.bind(this), '1000')
      }.bind(this),
      error: function (response) {
        progressbar.css('display', 'none');
        alert("Не удалось загрузить файл");
      }
    });
  }

  selectFromList(category, e) {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/file/category/" + category, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        this.setState({categoryFiles: data});

        $('#selectFileModal').modal('show');
      }
    }.bind(this)
    xhr.send();
  }

  selectFile(e) {
    var fileName = e.target.dataset.name;
    var id = e.target.dataset.id;
    var category = e.target.dataset.category;
    var data = {id: id, name: fileName};

    switch (category) {
      case '3':
        this.setState({personalIdFile: data});
        break;

      case '9':
        this.setState({confirmedTaskFile: data});
        break;

      case '10':
        this.setState({titleDocumentFile: data});
        break;

      case '20':
        this.setState({paymentPhotoFile: data});
        break;

      case '22':
        this.setState({survey: data});
        break;

      case '24':
        this.setState({claimedCapacityJustification: data});
        break;

      case '24':
        this.setState({pack2IdFile: data});
        break;
    }

    $('#selectFileModal').modal('hide');
  }

  render() {
    var apz = this.state.apz;
    console.log(apz);
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
              <td style={{width: '100%'}}><b>Тип заявки</b></td>
            </tr>
            <tr>
              <td>{apz.type === 1 ? 'Пакет 1': (apz.type === 2 ? 'Пакет 2': 'Не определенный тип')}</td>
            </tr>
            </tbody>
          </table>

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

          <h5 className="block-title-2 mb-3">Службы</h5>

          <table className="table table-bordered table-striped">
            <tbody>
              {apz.apz_water &&
                <tr>
                  <td><b>Водоснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#water_modal">Открыть</a></td>
                </tr>
              }

              {apz.apz_heat &&
                <tr>
                  <td><b>Теплоснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#heat_modal">Открыть</a></td>
                </tr>
              }

              {apz.apz_electricity &&
                <tr>
                  <td><b>Электроснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#electro_modal">Открыть</a></td>
                </tr>
              }

              {apz.apz_gas &&
                <tr>
                  <td><b>Газоснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#gas_modal">Открыть</a></td>
                </tr>
              }

              {apz.apz_phone &&
                <tr>
                  <td><b>Телефонизация</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#phone_modal">Открыть</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className="col-sm-12">
          {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}

          <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>
        </div>

        <div className="col-sm-12">
          {this.state.showCommission &&
            <div>
              <h5 className="block-title-2 mt-3 mb-3">Решение</h5>

              <div className="alert alert-info" role="alert">
                Отправляя данную заявку коммунальным службам, вы подтверждаете достоверность данных, заполненные заявителем
              </div>

              <table className="table table-bordered commission_users_table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Название провайдера</th>
                    <th>Оставшееся время</th>
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
                          <td>
                            {item.days > 1 ?
                              item.days === 3 ? '2 д. (начиная со следующего дня)' : item.days - 1 + ' д.'
                              :
                              item.days === 1 ? 'Последний день (до 16:00)' : 'Просрочено'
                            }
                          </td>
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
                        <input className="form-control" type="checkbox" name="commission_users[]" value="Heat" />
                      </td>
                      <td>Теплоснабжение</td>
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
                  <div style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                    <textarea style={{marginBottom: '10px'}} placeholder="Комментарий" rows="7" cols="50" className="form-control" defaultValue={this.state.comment} onChange={this.onCommentChange}></textarea>
                  </div>
                </div>
              }
            </div>
          }
          {apz.commission != null && apz.commission.status_id === 2 && apz.type === 2 &&
            <div className={'row'}>
              <div className={'col-md-6'}>

                <div className="form-group">
                  <label>Вложения по Пакету 2</label>
                  <div className="file_container">
                    <div className="progress mb-2" data-category="25" style={{height: '20px', display: 'none'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>

                    {this.state.pack2IdFile &&
                    <div className="file_block mb-2">
                      <div>
                        {this.state.pack2IdFile.name}
                        <a className="pointer" onClick={(e) => this.setState({pack2IdFile: false}) }>×</a>
                      </div>
                    </div>
                    }

                    <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                      <label htmlFor="pack2IdFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                      <input type="file" id="pack2IdFile" name="pack2IdFile" className="form-control" onChange={this.uploadFile.bind(this, 25)} style={{display: 'none'}} />
                      <label onClick={this.selectFromList.bind(this, 25)} className="btn btn-info btn-sm">Выбрать из списка</label>
                    </div>
                    <span className="help-block text-muted">
                      (архитектурно-планировочное задание, вертикальные планировочные
                      отметки, выкопировку из проекта детальной планировки, типовые поперечные
                      профили дорог и улиц, технические условия, схемы трасс наружных инженерных
                      сетей)
                    </span>
                  </div>
                  <div className="modal fade" id="selectFileModal" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Выбрать файл</h5>
                          <button type="button" id="selectFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <table className="table">
                            <thead>
                            <tr>
                              <th style={{width: '80%'}}>Название</th>
                              <th style={{width: '10%'}}>Формат</th>
                              <th style={{width: '10%'}}></th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.categoryFiles.map(function(file, index){
                                return(
                                  <tr key={index}>
                                    <td>{file.name}</td>
                                    <td>{file.extension}</td>
                                    <td><button onClick={this.selectFile} data-category={file.category_id} data-id={file.id} data-name={file.name} className="btn btn-success">Выбрать</button></td>
                                  </tr>
                                );
                              }.bind(this)
                            )}
                            </tbody>
                          </table>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          }

          <div className={this.state.showButtons ? '' : 'invisible'}>
            <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', marginBottom: '10px', display: 'table'}}>
              {!apz.commission &&
                <button className="btn btn-raised btn-info" onClick={this.createCommission.bind(this, apz.id)} style={{marginRight: '5px'}}>
                  Создать комиссию
                </button>
              }

              <button className="btn btn-raised btn-success" style={{marginRight: '5px'}}
                      onClick={this.acceptDeclineApzForm.bind(this, apz.id, true, "your form was accepted", 'apz')}>
                В отдел АПЗ
              </button>

              <button className="btn btn-raised btn-success" style={{marginRight: '5px'}}
                      onClick={this.acceptDeclineApzForm.bind(this, apz.id, true, "your form was accepted")}>
                Отправить архитектору
              </button>

              <button className="btn btn-raised btn-danger" onClick={this.acceptDeclineApzForm.bind(this, apz.id, false, this.state.description)}>
                Вернуть архитектору
              </button>
            </div>
          </div>

          <h5 className="block-title-2 mb-3">Логи</h5>
          <div className="border px-3 py-2">
            {apz.state_history.map(function(state, index) {
              return(
                <div key={index}>
                  <p className="mb-0">{state.created_at}&emsp;{state.state.name}</p>
                </div>
              );
            }.bind(this))}
          </div>

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


          {apz.apz_water &&
            <div className="modal fade" id="water_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Водоснабжение</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                      <tbody>
                        <tr>
                          <td style={{width: '70%'}}>Общая потребность (м<sup>3</sup>/сутки)</td>
                          <td>{apz.apz_water.requirement}</td>
                        </tr>
                        <tr>
                          <td>Общая потребность питьевой воды (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_water.requirement_hour}</td>
                        </tr>
                        <tr>
                          <td>Общая потребность (л/сек макс)</td>
                          <td>{apz.apz_water.requirement_sec}</td>
                        </tr>
                        <tr>
                          <td>Хозпитьевые нужды (м<sup>3</sup>/сутки)</td>
                          <td>{apz.apz_water.drinking}</td>
                        </tr>
                        <tr>
                          <td>Хозпитьевые нужды (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_water.drinking_hour}</td>
                        </tr>
                        <tr>
                          <td>Хозпитьевые нужды (л/сек макс)</td>
                          <td>{apz.apz_water.drinking_sec}</td>
                        </tr>
                        <tr>
                          <td>Производственные нужды (м<sup>3</sup>/сутки)</td>
                          <td>{apz.apz_water.production}</td>
                        </tr>
                        <tr>
                          <td>Производственные нужды (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_water.production_hour}</td>
                        </tr>
                        <tr>
                          <td>Производственные нужды (л/сек макс)</td>
                          <td>{apz.apz_water.production_sec}</td>
                        </tr>
                        <tr>
                          <td>Расходы пожаротушения (л/сек наружное)</td>
                          <td>{apz.apz_water.fire_fighting}</td>
                        </tr>
                        <tr>
                          <td>Расходы пожаротушения (л/сек внутреннее)</td>
                          <td>{apz.apz_water.fire_fighting}</td>
                        </tr>
                      </tbody>
                    </table>

                    {apz.apz_sewage &&
                      <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                        <tbody>
                          <tr>
                            <td style={{width: '70%'}}>Общее количество сточных вод (м<sup>3</sup>/сутки)</td>
                            <td>{apz.apz_sewage.amount}</td>
                          </tr>
                          <tr>
                            <td>Общее количество сточных вод (м<sup>3</sup>/час макс)</td>
                            <td>{apz.apz_sewage.amount_hour}</td>
                          </tr>
                          <tr>
                            <td>Фекальных (м<sup>3</sup>/сутки)</td>
                            <td>{apz.apz_sewage.feksal}</td>
                          </tr>
                          <tr>
                            <td>Фекальных (м<sup>3</sup>/час макс)</td>
                            <td>{apz.apz_sewage.feksal_hour}</td>
                          </tr>
                          <tr>
                            <td>Производственно-загрязненных (м<sup>3</sup>/сутки)</td>
                            <td>{apz.apz_sewage.production}</td>
                          </tr>
                          <tr>
                            <td>Производственно-загрязненных (м<sup>3</sup>/час макс)</td>
                            <td>{apz.apz_sewage.production_hour}</td>
                          </tr>
                          <tr>
                            <td>Условно-чистых сбрасываемых на городскую сеть (м<sup>3</sup>/сутки)</td>
                            <td>{apz.apz_sewage.to_city}</td>
                          </tr>
                          <tr>
                            <td>Условно-чистых сбрасываемых на городскую сеть (м<sup>3</sup>/час макс)</td>
                            <td>{apz.apz_sewage.to_city_hour}</td>
                          </tr>
                        </tbody>
                      </table>
                    }
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {apz.apz_heat &&
            <div className="modal fade" id="heat_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Теплоснабжение</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <td style={{width: '70%'}}>Общая нагрузка (Гкал/ч)</td>
                          <td>{apz.apz_heat.general}</td>
                        </tr>
                        <tr>
                          <td>Энергосб. мероприятие</td>
                          <td>{apz.apz_heat.saving}</td>
                        </tr>
                        <tr>
                          <td>Технолог. нужды(пар) (Т/ч)</td>
                          <td>{apz.apz_heat.tech}</td>
                        </tr>
                        <tr>
                          <td>Разделить нагрузку</td>
                          <td>{apz.apz_heat.distribution}</td>
                        </tr>

                        {apz.apz_heat.contract_num &&
                          <tr>
                            <td>Номер договора</td>
                            <td>{apz.apz_heat.contract_num}</td>
                          </tr>
                        }

                        {apz.apz_heat.main_in_contract &&
                          <tr>
                            <td>Отопление по договору (Гкал/ч)</td>
                            <td>{apz.apz_heat.main_in_contract}</td>
                          </tr>
                        }

                        {apz.apz_heat.water_in_contract &&
                          <tr>
                            <td>Горячее водоснабжение по договору (ср/ч)</td>
                            <td>{apz.apz_heat.water_in_contract}</td>
                          </tr>
                        }

                        {apz.apz_heat.ven_in_contract &&
                          <tr>
                            <td>Вентиляция по договору (Гкал/ч)</td>
                            <td>{apz.apz_heat.ven_in_contract}</td>
                          </tr>
                        }

                        {apz.apz_heat.water_in_contract_max &&
                          <tr>
                            <td>Горячее водоснабжение по договору (макс/ч)</td>
                            <td>{apz.apz_heat.water_in_contract_max}</td>
                          </tr>
                        }
                      </tbody>
                    </table>

                    {apz.apz_heat.blocks &&
                      <div>
                        {apz.apz_heat.blocks.map(function(item, index) {
                          return(
                            <div key={index}>
                              {apz.apz_heat.blocks.length > 1 &&
                                <h5 className="block-title-2 mt-4 mb-3">Здание №{index + 1}</h5>
                              }

                              <table className="table table-bordered table-striped">
                                <tbody>
                                  <tr>
                                    <td style={{width: '70%'}}>Отопление (Гкал/ч)</td>
                                    <td>{item.main}</td>
                                  </tr>
                                  <tr>
                                    <td>Вентиляция (Гкал/ч)</td>
                                    <td>{item.ventilation}</td>
                                  </tr>
                                  <tr>
                                    <td>Горячее водоснаб. (ср/ч)</td>
                                    <td>{item.water}</td>
                                  </tr>
                                  <tr>
                                    <td>Горячее водоснаб. (макс/ч)</td>
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

          {apz.apz_electricity &&
            <div className="modal fade" id="electro_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Электроснабжение</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <td style={{width: '60%'}}>Требуемая мощность (кВт)</td>
                          <td>{apz.apz_electricity.required_power}</td>
                        </tr>
                        <tr>
                          <td>Характер нагрузки (фаза)</td>
                          <td>{apz.apz_electricity.phase}</td>
                        </tr>
                        <tr>
                          <td>Категория (кВт)</td>
                          <td>{apz.apz_electricity.safety_category}</td>
                        </tr>
                        <tr>
                          <td>Из указ. макс. нагрузки относ. к э-приемникам (кВА)</td>
                          <td>{apz.apz_electricity.max_load_device}</td>
                        </tr>
                        <tr>
                          <td>Сущ. макс. нагрузка (кВА)</td>
                          <td>{apz.apz_electricity.max_load}</td>
                        </tr>
                        <tr>
                          <td>Мощность трансформаторов (кВА)</td>
                          <td>{apz.apz_electricity.allowed_power}</td>
                        </tr>

                        {this.state.claimedCapacityJustification &&
                          <tr>
                            <td>Расчет-обоснование заявленной мощности</td>
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.claimedCapacityJustification.id)}>Скачать</a></td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {apz.apz_gas &&
            <div className="modal fade" id="gas_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Газоснабжение</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <td style={{width: '60%'}}>Общ. потребность (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.general}</td>
                        </tr>
                        <tr>
                          <td>На приготов. пищи (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.cooking}</td>
                        </tr>
                        <tr>
                          <td>Отопление (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.heat}</td>
                        </tr>
                        <tr>
                          <td>Вентиляция (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.ventilation}</td>
                        </tr>
                        <tr>
                          <td>Кондиционирование (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.conditionaer}</td>
                        </tr>
                        <tr>
                          <td>Горячее водоснаб. (м<sup>3</sup>/час)</td>
                          <td>{apz.apz_gas.water}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          }

          {apz.apz_phone &&
            <div className="modal fade" id="phone_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Телефонизация</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <td style={{width: '60%'}}>Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</td>
                          <td>{apz.apz_phone.service_num}</td>
                        </tr>
                        <tr>
                          <td>Телефонная емкость</td>
                          <td>{apz.apz_phone.capacity}</td>
                        </tr>
                        <tr>
                          <td>Планируемая телефонная канализация</td>
                          <td>{apz.apz_phone.sewage}</td>
                        </tr>
                        <tr>
                          <td>Пожелания заказчика (тип оборудования, тип кабеля и др.)</td>
                          <td>{apz.apz_phone.client_wishes}</td>
                        </tr>
                      </tbody>
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
            <Link className="btn btn-outline-secondary pull-right" to={'/panel/engineer/apz/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
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
