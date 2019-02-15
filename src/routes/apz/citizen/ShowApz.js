import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import {ru, kk} from '../../../languages/header.json';

export default class ShowApz extends React.Component {
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
        fileDescription: "",
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
      xhr.open("get", window.url + "api/apz/citizen/detail/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var apz = JSON.parse(xhr.responseText);
          var commission = apz.commission;
  console.log(apz.files);
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
                this.setState({fileDescription: commission.apz_heat_response.fileDescription});
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

    downloadFile(id, progbarId = null) {
      var token = sessionStorage.getItem('tokenInfo');
      var url = window.url + 'api/file/download/' + id;

      var xhr = new XMLHttpRequest();
      xhr.open("get", url, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        var vision = $('.text-info[data-category='+progbarId+']');
        var progressbar = $('.progress[data-category='+progbarId+']');
        vision.css('display', 'none');
        progressbar.css('display', 'flex');
        xhr.onprogress = function(event) {
          $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100) + '%');
        }
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
                setTimeout(function() {
                  window.URL.revokeObjectURL(url);
                  $('div', progressbar).css('width', 0);
                  progressbar.css('display', 'none');
                  vision.css('display','inline');
                  alert("Файлы успешно загружены");
                },1000);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
          } else {
            $('div', progressbar).css('width', 0);
            progressbar.css('display', 'none');
            vision.css('display','inline');
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
      var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
      var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
      var curr_year = jDate.getFullYear();
      var curr_hour = jDate.getHours() < 10 ? "0" + jDate.getHours() : jDate.getHours();
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
                    <td><b>Адрес жительства</b></td>
                    <td>{apz.address}</td>
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
                      <td><a className="text-info pointer" data-category="1" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id, 1)}>Скачать</a>
                        <div className="progress mb-2" data-category="1" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.state.confirmedTaskFile &&
                    <tr>
                      <td><b>Утвержденное задание</b></td>
                      <td><a className="text-info pointer" data-category="2" onClick={this.downloadFile.bind(this, this.state.confirmedTaskFile.id, 2)}>Скачать</a>
                        <div className="progress mb-2" data-category="2" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.state.titleDocumentFile &&
                    <tr>
                      <td><b>Правоустанавл. документ</b></td>
                      <td><a className="text-info pointer" data-category="3" onClick={this.downloadFile.bind(this, this.state.titleDocumentFile.id, 3)}>Скачать</a>
                        <div className="progress mb-2" data-category="3" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.state.additionalFile &&
                    <tr>
                      <td><b>Дополнительно</b></td>
                      <td><a className="text-info pointer" data-category="4" onClick={this.downloadFile.bind(this, this.state.additionalFile.id, 4)}>Скачать</a>
                        <div className="progress mb-2" data-category="4" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.state.paymentPhotoFile &&
                    <tr>
                      <td><b>Сканированный файл оплаты</b></td>
                      <td><a className="text-info pointer" data-category="5" onClick={this.downloadFile.bind(this, this.state.paymentPhotoFile.id, 5)}>Скачать</a>
                        <div className="progress mb-2" data-category="5" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
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
                      <td><a className="text-info pointer" data-category="6" onClick={this.downloadFile.bind(this, this.state.pack2IdFile.id, 6)}>Скачать</a>
                        <div className="progress mb-2" data-category="6" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>

              {this.state.showMap && < this.ShowMap coordinates={apz.project_address_coordinates} />}

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
                            <td><a className="text-info pointer" data-category="7" onClick={this.downloadFile.bind(this, this.state.headResponseFile.id, 7)}>Скачать</a>
                              <div className="progress mb-2" data-category="7" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </td>
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
                              <td><a className="text-info pointer" data-category="8" onClick={this.downloadFile.bind(this, this.state.headResponseFile.id, 8)}>Скачать</a>
                                <div className="progress mb-2" data-category="8" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                              </td>
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
                                        <td><a className="text-info pointer" data-category="9" onClick={this.downloadFile.bind(this, this.state.waterCustomTcFile.id, 9)}>Скачать</a>
                                          <div className="progress mb-2" data-category="9" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                          </div>
                                        </td>
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
                                          <td><a className="text-info pointer" data-category="10" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id, 10)}>Скачать</a>
                                            <div className="progress mb-2" data-category="10" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                          </td>
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
                                        <td><a className="text-info pointer" data-category="11" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id, 11)}>Скачать</a>
                                          <div className="progress mb-2" data-category="11" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                          </div>
                                        </td>
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
                                        <td><a className="text-info pointer" data-category="12" onClick={this.downloadFile.bind(this, this.state.heatCustomTcFile.id, 12)}>Скачать</a>
                                          <div className="progress mb-2" data-category="12" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr><td>Описание технического условия</td><td>{this.state.fileDescription}</td></tr>
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
                                          <td><a className="text-info pointer" data-category="13" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id, 13)}>Скачать</a>
                                            <div className="progress mb-2" data-category="13" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                          </td>
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
                                        <td><a className="text-info pointer" data-category="14" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id, 14)}>Скачать</a>
                                          <div className="progress mb-2" data-category="14" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                          </div>
                                        </td>
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
                                        <td><b>Номер документа</b></td>
                                        <td>{apz.commission.apz_electricity_response.doc_number}</td>
                                      </tr>
                                      <tr>
                                        <td><b>Рекомендация</b></td>
                                        <td>{apz.commission.apz_electricity_response.recommendation}</td>
                                      </tr>
                                      <tr>
                                        <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                        <td><a className="text-info pointer" data-category="15" onClick={this.downloadFile.bind(this, this.state.electroCustomTcFile.id, 15)}>Скачать</a>
                                          <div className="progress mb-2" data-category="15" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                          </div>
                                        </td>
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
                                          <td><a className="text-info pointer" data-category="16" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id, 16)}>Скачать</a>
                                            <div className="progress mb-2" data-category="16" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                          </td>
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
                                        <td><a className="text-info pointer" data-category="17" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id, 17)}>Скачать</a>
                                          <div className="progress mb-2" data-category="17" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                          </div>
                                        </td>
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
                                        <td><b>Номер документа</b></td>
                                        <td>{apz.commission.apz_gas_response.doc_number}</td>
                                      </tr>
                                      <tr>
                                        <td><b>Предусмотрение</b></td>
                                        <td>{apz.commission.apz_gas_response.reconsideration}</td>
                                      </tr>
                                      <tr>
                                        <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                        <td><a className="text-info pointer" data-category="18" onClick={this.downloadFile.bind(this, this.state.gasCustomTcFile.id, 18)}>Скачать</a>
                                          <div className="progress mb-2" data-category="18" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                          </div>
                                        </td>
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
                                          <td><a className="text-info pointer" data-category="19" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id, 19)}>Скачать</a>
                                            <div className="progress mb-2" data-category="19" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                          </td>
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
                                        <td><a className="text-info pointer" data-category="20" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id, 20)}>Скачать</a>
                                          <div className="progress mb-2" data-category="20" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                          </div>
                                        </td>
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
                                        <td><b>Номер документа</b></td>
                                        <td>{apz.commission.apz_phone_response.doc_number}</td>
                                      </tr>
                                      <tr>
                                        <td><b>Пожелания заказчика (тип оборудования, тип кабеля и др.)</b></td>
                                        <td>{apz.commission.apz_phone_response.client_wishes}</td>
                                      </tr>
                                      <tr>
                                        <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                        <td><a className="text-info pointer" data-category="21" onClick={this.downloadFile.bind(this, this.state.phoneCustomTcFile.id, 21)}>Скачать</a>
                                          <div className="progress mb-2" data-category="21" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                          </div>
                                        </td>
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
                                          <td><a className="text-info pointer" data-category="22" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id, 22)}>Скачать</a>
                                            <div className="progress mb-2" data-category="22" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                          </td>
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
                                        <td><a className="text-info pointer" data-category="23" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id, 23)}>Скачать</a>
                                          <div className="progress mb-2" data-category="23" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                          </div>
                                        </td>
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
                          <p className="mb-0">{state.created_at}&emsp;{state.state.name} {state.receiver && '('+state.receiver+')'}</p>
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
                <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
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
