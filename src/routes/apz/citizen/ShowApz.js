import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import Loader from 'react-loader-spinner';
import ShowMap from "../components/ShowMap";
import AllInfo from "../components/AllInfo";
import CommissionAnswersList from '../components/CommissionAnswersList';
import Logs from "../components/Logs";
import Answers from "../components/Answers";

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
          this.setState({otkazFile: apz.files.filter(function(obj) { return obj.category_id === 30 })[0]});
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
          $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100, 10) + '%');
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

              <AllInfo toggleMap={this.toggleMap.bind(this, true)} apz={this.state.apz} personalIdFile={this.state.personalIdFile} confirmedTaskFile={this.state.confirmedTaskFile} titleDocumentFile={this.state.titleDocumentFile}
                   historygoBack={this.props.history.goBack} additionalFile={this.state.additionalFile} claimedCapacityJustification={this.state.claimedCapacityJustification}/>

              {apz.commission && (Object.keys(apz.commission).length > 0) &&
                <div>
                  <h5 className="block-title-2 mb-3">Ответы от служб</h5>
                  <CommissionAnswersList apz={apz} />
                </div>
              }

              {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} mapId={"b5a3c97bd18442c1949ba5aefc4c1835"}/>}

              <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                {this.state.showMapText}
              </button>

              <Answers engineerReturnedState={this.state.engineerReturnedState} apzReturnedState={this.state.apzReturnedState}
                       backFromHead={this.state.backFromHead} apz_department_response={this.state.apz.apz_department_response} apz_id={this.state.apz.id} p_name={this.state.apz.project_name}
                       apz_status={this.state.apz.status_id} schemeComment={this.state.schemeComment}
                       calculationComment={this.state.calculationComment} reglamentComment={this.state.reglamentComment} schemeFile={this.state.schemeFile}
                       calculationFile={this.state.calculationFile} reglamentFile={this.state.reglamentFile}/>

              <Logs state_history={this.state.apz.state_history} />

              <div className="col-sm-12">
                <button className="btn btn-outline-secondary pull-right btn-sm" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
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
