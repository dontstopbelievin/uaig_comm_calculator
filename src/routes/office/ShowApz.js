import React from 'react';
import Loader from 'react-loader-spinner';
import ShowMap from "./ShowMap";

export default class ShowApz extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apz: [],
      showMap: false,
      responseFile: null,
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
      headResponseFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
      showMapText: 'Показать карту',
      headResponse: null,
      response: false,
      loaderHidden: false,
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
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/office/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var commission = data.commission;
        var hasDeclined = data.state_history.filter(function(obj) {
          return obj.state_id === 9 || obj.state_id === 11 || obj.state_id === 13 || obj.state_id === 15 || obj.state_id === 17
        });

        this.setState({apz: data});
        this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});
        var pack2IdFile = data.files.filter(function(obj) { return obj.category_id === 25 }) ?
          data.files.filter(function(obj) { return obj.category_id === 25 }) : [];
        if ( pack2IdFile.length > 0 ) {
          this.setState({pack2IdFile: pack2IdFile[0]});
        }

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

        if (data.apz_head_response && data.apz_head_response.files) {
          this.setState({headResponseFile: data.apz_head_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
        }

        if (data.apz_head_response && data.apz_head_response.files) {
          this.setState({xmlFile: data.apz_head_response.files.filter(function(obj) { return obj.category_id === 19})[0]});
          this.setState({headResponse: data.apz_head_response.response});
        }

        this.setState({loaderHidden: true});

        if (hasDeclined.length === 0) {
          this.setState({response: true});
        }
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

  render() {
    var apz = this.state.apz;

    if (apz.length === 0) {
      return false;
    }

    return (
      <div>
        {this.state.loaderHidden &&
          <div className="row">
            <div className={(apz.commission && (Object.keys(apz.commission).length > 0)) ? 'col-sm-6' : 'col-sm-12'}>
              <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}><b>ИД заявки</b></td>
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

                  {this.state.pack2IdFile &&
                    <tr>
                      <td><b>Пакет файлов для типа АПЗ: Пакет 2</b></td>
                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.pack2IdFile.id)}>Скачать</a></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            {apz.commission && (Object.keys(apz.commission).length > 0) &&
              <div className="col-sm-6">
                <h5 className="block-title-2 mt-3 mb-3">Решение</h5>

                {apz.apz_department_response &&
                  <div>
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <td style={{width: '40%'}}><b>Отдел АПЗ</b></td>
                          <td><a className="text-info pointer" onClick={this.printApz.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                }

                <table className="table table-bordered table-striped">
                  <tbody>
                    {apz.commission.apz_water_response &&
                      <tr>
                        <td style={{width: '40%'}}>
                          <b>Водоснабжение</b>
                        </td>
                        <td><a className="text-info pointer" data-toggle="modal" data-target="#water_provider_modal">Просмотр</a></td>
                      </tr>
                    }

                    {apz.commission.apz_heat_response &&
                      <tr>
                        <td style={{width: '40%'}}>
                          <b>Теплоснабжение</b>
                        </td>
                        <td><a className="text-info pointer" data-toggle="modal" data-target="#heat_provider_modal">Просмотр</a></td>
                      </tr>
                    }

                    {apz.commission.apz_electricity_response &&
                      <tr>
                        <td style={{width: '40%'}}>
                          <b>Электроснабжение</b>
                        </td>
                        <td><a className="text-info pointer" data-toggle="modal" data-target="#electricity_provider_modal">Просмотр</a></td>
                      </tr>
                    }

                    {apz.commission.apz_gas_response &&
                       <tr>
                        <td style={{width: '40%'}}>
                          <b>Газоснабжение</b>
                        </td>
                        <td><a className="text-info pointer" data-toggle="modal" data-target="#gas_provider_modal">Просмотр</a></td>
                      </tr>
                    }

                    {apz.commission.apz_phone_response &&
                      <tr>
                        <td style={{width: '40%'}}>
                          <b>Телефонизация</b>
                        </td>
                        <td><a className="text-info pointer" data-toggle="modal" data-target="#phone_provider_modal">Просмотр</a></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }

            {(apz.status_id === 1 || apz.status_id === 2) &&
              <div className="col-sm-12">
                <h5 className="block-title-2 mt-5 mb-3">Результат</h5>

                {apz.status_id === 2 &&
                  <table className="table table-bordered table-striped w-100">
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
                  <table className="table table-bordered w-100">
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
              </div>
            }

            <div className="col-sm-12">
              {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}

              <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                {this.state.showMapText}
              </button>
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
                          })}
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

            {apz.state_history.length > 0 &&
              <div className="col-sm-12">
                <h5 className="block-title-2 mb-3 mt-3">Логи</h5>
                <div className="border px-3 py-2">
                  {apz.state_history.map(function(state, index) {
                    return(
                      <div key={index}>
                        <p className="mb-0">{state.created_at}&emsp;{state.state.name} {state.receiver && '('+state.receiver+')'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            }

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
