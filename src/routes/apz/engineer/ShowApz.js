import React from 'react';
import {NavLink} from 'react-router-dom';
import $ from 'jquery';
import 'jquery-serializejson';
import Loader from 'react-loader-spinner';
import EngineerShowMap from "./ShowMap";

export default class ShowApz extends React.Component {
  constructor(props) {
    super(props);
    this.webSocket = new WebSocket('wss://127.0.0.1:13579/');
    this.heartbeat_msg = '--heartbeat--';
    this.heartbeat_interval = null;
    this.missed_heartbeats = 0;
    this.missed_heartbeats_limit_min = 3;
    this.missed_heartbeats_limit_max = 50;
    this.missed_heartbeats_limit = this.missed_heartbeats_limit_min;
    this.callback = null;

    this.state = {
      apz: [],
      showMap: false,
      showButtons: false,
      showCommission: false,
      file: false,
      docNumber: "",
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
      fileDescription: "",
      gasCustomTcFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
      additionalFile: false,
      claimedCapacityJustification: false,
      showMapText: 'Показать карту',
      response: null,
      storageAlias: "PKCS12",
      needSign: false,
      engineerReturnedState: false,
      deadline: '',
      comment: ''
    };

    this.onDocNumberChange = this.onDocNumberChange.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  //
    this.selectFromList = this.selectFromList.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.selectFile = this.selectFile.bind(this);
  }
  componentDidMount() {
    this.props.breadCrumbs();
  }

  onInputChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name] : value });
  }
  onDocNumberChange(e) {
    this.setState({ docNumber: e.target.value });
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
      this.webSocketFunction();
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
        // console.log(data.apz);
        var commission = data.commission;
        var hasReponse = data.state_history.filter(function(obj) { return obj.state_id === 5 || obj.state_id === 6 });
        //console.log("______________________________");console.log(data);
        this.setState({apz: data});
        this.setState({showButtons: false});
        this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});
        this.setState({additionalFile: data.files.filter(function(obj) { return obj.category_id === 27 })[0]});

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
            this.setState({fileDescription: commission.apz_heat_response.fileDescription});
          }

          if (commission.apz_gas_response && commission.apz_gas_response.files) {
            this.setState({gasResponseFile: commission.apz_gas_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
            this.setState({gasCustomTcFile: commission.apz_gas_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
          }
        }

        if ((data.status_id === 4 || data.status_id === 5) && hasReponse.length === 0) {
          this.setState({showButtons: true});
        }

        if (hasReponse.length === 0 || commission) {
          this.setState({showCommission: true});
        }

        this.setState({engineerReturnedState: data.state_history.filter(function(obj) { return obj.state_id === 1 && obj.comment !== null && obj.sender === 'engineer'})[0]});
        this.setState({xmlFile: data.files.filter(function(obj) { return obj.category_id === 28})[0]});
        this.setState({needSign: data.files.filter(function(obj) { return obj.category_id === 28})[0]});
      }
    }.bind(this)
    xhr.send();
  }

  sendToApz() {
      this.setState({loaderHidden: true});
      this.setState({needSign: true });
  }
  hideSignBtns(){
      this.setState({loaderHidden: false});
      this.setState({ needSign: false });
  }

  downloadFile(id, progbarId = null) {
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/file/download/' + id, true);
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

  setMissedHeartbeatsLimitToMax() {
    this.missed_heartbeats_limit = this.missed_heartbeats_limit_max;
  }

  setMissedHeartbeatsLimitToMin() {
    this.missed_heartbeats_limit = this.missed_heartbeats_limit_min;
  }
  browseKeyStore(storageName, fileExtension, currentDirectory, callBack) {
    var browseKeyStore = {
      "method": "browseKeyStore",
      "args": [storageName, fileExtension, currentDirectory]
    };
    //console.log(browseKeyStore);
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    //console.log(browseKeyStore);
    this.webSocket.send(JSON.stringify(browseKeyStore));
  }

  getKeys(storageName, storagePath, password, type, callBack) {
    var getKeys = {
      "method": "getKeys",
      "args": [storageName, storagePath, password, type]
    };
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(getKeys));
  }

  chooseFile() {
    var browseKeyStore = {
      "method": "browseKeyStore",
      "args": [this.state.storageAlias, "P12", '']
    };
    this.callback = "chooseStoragePathBack";
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(browseKeyStore));
  }
  signMessage() {
    this.setState({loaderHidden: false});
    let password = document.getElementById("inpPassword").value;
    let path = document.getElementById("storagePath").value;
    let keyType = "SIGN";
    //console.log(path);
    if (path !== null && path !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
      if (password !== null && password !== "") {
          this.getKeys(this.state.storageAlias, path, password, keyType, "loadKeysBack");
      } else {
        alert("Введите пароль к хранилищу");
        this.setState({loaderHidden: true});
      }
    } else {
      alert("Не выбран хранилище!");
      this.setState({loaderHidden: true});
    }
  }

  loadKeysBack(result) {
    if (result.errorCode === "WRONG_PASSWORD") {
      alert("Неверный пароль!");
        this.setState({loaderHidden: true});
        return false;
    }

    let alias = "";
    console.log(result);
    if (result && result.result) {
      let keys = result.result.split('/n');
      if (keys && keys.length > 0) {
        let arr = keys[0].split('|');
        alias = arr[3];
        this.getTokenXml(alias);
      }
    }
    if (!alias) {
      alert('Нет ключа подписания');
      this.setState({loaderHidden: true});
    }
  }
  getTokenXml(alias) {
    let password = document.getElementById("inpPassword").value;
    let storagePath = document.getElementById("storagePath").value;
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/apz/engineer/get_xml/' + this.state.apz.id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      var tokenXml = xhr.responseText;

      if (storagePath !== null && storagePath !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
        if (password !== null && password !== "") {
          if (alias !== null && alias !== "") {
            if (tokenXml !== null && tokenXml !== "") {
                this.signXml(this.state.storageAlias, storagePath, alias, password, tokenXml, "signXmlBack");
            }
            else {
                alert("Нет данных для подписания!");
            }
          } else {
              alert("Вы не выбрали ключ!");
          }
        } else {
            alert("Введите пароль к хранилищу");
        }
      } else {
          alert("Не выбран хранилище!");
      }
    }.bind(this);
    xhr.send();
  }
  signXml(storageName, storagePath, alias, password, xmlToSign, callBack) {
    var signXml = {
      "method": "signXml",
      "args": [storageName, storagePath, alias, password, xmlToSign]
    };
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(signXml));
  }
  signXmlBack(result) {
    if (result['errorCode'] === "NONE") {
      let signedXml = result.result;
      var token = sessionStorage.getItem('tokenInfo');
      var data = {xml: signedXml}

      console.log("SIGNED XML ------> \n", signedXml);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + 'api/apz/engineer/save_xml/' + this.state.apz.id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          this.setState({ xmlFile: true });
          alert("Успешно подписан!");
            this.setState({loaderHidden: true});

        } else {
          alert("Не удалось подписать файл");
          this.setState({loaderHidden: true});

        }
      }.bind(this);
      xhr.send(JSON.stringify(data));
    }
    else {
      if (result['errorCode'] === "WRONG_PASSWORD" && result['result'] > -1) {
        alert("Неправильный пароль! Количество оставшихся попыток: " + result['result']);
      } else if (result['errorCode'] === "WRONG_PASSWORD") {
        alert("Неправильный пароль!");
      } else {
        alert(result['errorCode']);
      }
    }
  }
  chooseStorage(storage) {
    this.browseKeyStore(storage, "P12", '', "chooseStoragePathBack");
  }
  chooseStoragePathBack(rw) {
    if (rw.getErrorCode() === "NONE") {
      var storagePath = rw.getResult();
      if (storagePath !== null && storagePath !== "") {
        document.getElementById("storagePath").value = storagePath;
      }
      else {
        document.getElementById("storagePath").value = "";
      }
    } else {
      console.log(rw.getErrorCode());
      document.getElementById("storagePath").value = "";
    }
  }
  webSocketFunction() {
    this.webSocket.onopen = function (event) {
      if (this.heartbeat_interval === "") {
        this.missed_heartbeats = 0;
        this.heartbeat_interval = setInterval(this.pingLayer, 2000);
      }
      console.log("Connection opened");
    }.bind(this);

    this.webSocket.onclose = function (event) {
      if (event.wasClean) {
        console.log('connection has been closed');
      }
      else {
        console.log('Connection error');
        this.openDialog();
      }
      console.log('Code: ' + event.code + ' Reason: ' + event.reason);
    }.bind(this);

    this.webSocket.onmessage = function (event) {
      console.log(event);
      if (event.data === this.heartbeat_msg) {
        this.missed_heartbeats = 0;
        return;
      }

      var result = JSON.parse(event.data);

      if (result != null) {
        var rw = {
          result: result['result'],
          secondResult: result['secondResult'],
          errorCode: result['errorCode'],
          getResult: function () {
            return this.result;
          },
          getSecondResult: function () {
            return this.secondResult;
          },
          getErrorCode: function () {
            return this.errorCode;
          }
        };

        switch (this.callback) {
          case 'chooseStoragePathBack':
            this.chooseStoragePathBack(rw);
            break;

          case 'loadKeysBack':
            this.loadKeysBack(rw);
            break;

          case 'signXmlBack':
            this.signXmlBack(rw);
            break;
          default:
            break;
        }
      }
      this.setMissedHeartbeatsLimitToMin();
    }.bind(this);
  }
  pingLayer() {
    //console.log("pinging...");
    try {
      this.missed_heartbeats++;
      if (this.missed_heartbeats >= this.missed_heartbeats_limit)
          throw new Error("Too many missed heartbeats.");
      this.webSocket.send(this.heartbeat_msg);
    } catch (e) {
      clearInterval(this.heartbeat_interval);
      this.heartbeat_interval = null;
      console.warn("Closing connection. Reason: " + e.message);
      this.webSocket.close();
    }
  }
  openDialog() {
    alert("Ошибка при подключений к прослойке NCALayer. Убедитесь что программа запущена и перезарузите страницу");
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
  var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
  var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
  var curr_year = jDate.getFullYear();
  var curr_hour = jDate.getHours() < 10 ? "0" + jDate.getHours() : jDate.getHours();
  var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
  var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;

  return formated_date;
}

  createCommission(id) {
    if(this.state.deadline === ''){
      alert('Укажите сроки обработки заявки для служб');
      return false;
    }
    var data = $('.commission_users_table input').serializeJSON();

    if (Object.keys(data).length === 0) {
      alert('Не выбраны провайдеры');
      return false;
    }

    data["comment"]= this.state.comment;
    data["deadline"]= this.state.deadline;

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

  acceptDeclineApzForm(apzId, status, comment) {
    if(!status && comment.trim() == ''){
      alert('Для отказа напишите комментарий.');
      return false;
    }
    var token = sessionStorage.getItem('tokenInfo');
    var formData = new FormData();
    formData.append('response', status);
    formData.append('message', comment);
    if ( this.state.pack2IdFile != null ) {
      formData.append('file_id', this.state.pack2IdFile.id);
    }else{
      formData.append('file_id', '');
    }

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
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
        alert(JSON.parse(xhr.responseText).message);
      }else{
        console.log(JSON.parse(xhr.responseText));
      }

      if (!status) {
        $('#ReturnApzForm').modal('hide');
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
            percentComplete = parseInt(percentComplete * 100, 10);
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

            case 27:
              this.setState({additionalFile: data});
              break;

            case 20:
              this.setState({paymentPhotoFile: data});
              break;

            case 22:
              this.setState({survey: data});
              break;

            case 24:
              this.setState({claimedCapacityJustification: data});
              break;

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

      case '27':
        this.setState({additionalFile: data});
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

      case '25':
        this.setState({pack2IdFile: data});
        break;
    }

    $('#selectFileModal').modal('hide');
  }

  render() {
    var apz = this.state.apz;
    if (apz.length === 0) {
      return false;
    }

    return (
      <div className="row">
        <div className="col-sm-12">
          <button className="btn btn-outline-secondary btn-sm" onClick={this.props.history.goBack}>Назад</button>
        </div>
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
                <td>
                  {apz.applicant}
                  <NavLink style={{marginLeft:'5px'}} exact className="btn btn-raised btn-primary btn-sm" to={"/panel/apz/all_history/"+apz.user_id+"/1"}>История заявлений</NavLink>
                </td>
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
            </tbody>
          </table>

          <h5 className="block-title-2 mb-3">Службы</h5>

          <table className="table table-bordered table-striped">
            <tbody>
              {!!apz.need_water_provider && apz.apz_water &&
                <tr>
                  <td><b>Водоснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#water_modal">Открыть</a></td>
                </tr>
              }

              {!!apz.need_heat_provider && apz.apz_heat &&
                <tr>
                  <td><b>Теплоснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#heat_modal">Открыть</a></td>
                </tr>
              }

              {!!apz.need_electro_provider && apz.apz_electricity &&
                <tr>
                  <td><b>Электроснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#electro_modal">Открыть</a></td>
                </tr>
              }

              {!!apz.need_gas_provider && apz.apz_gas &&
                <tr>
                  <td><b>Газоснабжение</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#gas_modal">Открыть</a></td>
                </tr>
              }

              {!!apz.need_phone_provider && apz.apz_phone &&
                <tr>
                  <td><b>Телефонизация</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#phone_modal">Открыть</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className="col-sm-12">
          {this.state.showMap && <EngineerShowMap coordinates={apz.project_address_coordinates} />}

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
                          {apz.provider_deadline ?
                            this.toDate(apz.provider_deadline)
                            :
                            item.days > 1 ?
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
                    {!!apz.need_water_provider && <tr>
                      <td>
                        <input className="form-control" type="checkbox" name="commission_users[]" value="Water" />
                      </td>
                      <td>Водоснабжение</td>
                      <td></td>
                      <td></td>
                    </tr>}
                    {!!apz.need_electro_provider && <tr>
                      <td>
                        <input className="form-control" type="checkbox" name="commission_users[]" value="Electricity" />
                      </td>
                      <td>Электроснабжение</td>
                      <td></td>
                      <td></td>
                    </tr>}
                    {!!apz.need_gas_provider && <tr>
                      <td>
                        <input className="form-control" type="checkbox" name="commission_users[]" value="Gas" />
                      </td>
                      <td>Газоснабжение</td>
                      <td></td>
                      <td></td>
                    </tr>}
                    {!!apz.need_heat_provider && <tr>
                      <td>
                        <input className="form-control" type="checkbox" name="commission_users[]" value="Heat" />
                      </td>
                      <td>Теплоснабжение</td>
                      <td></td>
                      <td></td>
                    </tr>}
                    {!!apz.need_phone_provider && <tr>
                      <td>
                        <input className="form-control" type="checkbox" name="commission_users[]" value="Phone" />
                      </td>
                      <td>Телефонизация</td>
                      <td></td>
                      <td></td>
                    </tr>}
                    {!apz.need_phone_provider && !apz.need_electro_provider && !apz.need_water_provider && !apz.need_gas_provider
                    && !apz.need_heat_provider &&
                      <tr>Заявитель не выбрал подачу заявления на службы</tr>
                    }
                  </tbody>
                }
              </table>
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
                <div>
                  <div className="form-inline">
                    <label htmlFor="deadline" required style={{paddingRight:'20px'}}>Сроки до : </label>
                    <input type="datetime-local" className="form-control" id="deadline" name="deadline" onChange={this.onInputChange} value={this.state.deadline} />
                  </div>
                  <button className="btn btn-raised btn-info" onClick={this.createCommission.bind(this, apz.id)} style={{marginRight: '5px'}}>
                    Создать комиссию
                  </button>
                </div>
              }
              {!this.state.needSign ?
                <div>
                  <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.sendToApz.bind(this)}>Одобрить</button>
                  <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm">
                    Отклонить
                  </button>
                  <div className="modal fade" id="ReturnApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Причина отказа</h5>
                          <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group">
                            <label>Комментарий</label>
                            <div>
                              <textarea rows="4" style={{width:'100%', resize:'vertical'}} value={this.state.comment} onChange={this.onCommentChange}></textarea>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineApzForm.bind(this, apz.id, false, this.state.comment)}>Отправить Юристу</button>
                          <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                :
                  <div>
                  { !this.state.xmlFile ?
                    <div>
                      <div id="MySignForm" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                        <div>Выберите хранилище</div>

                        <div className="btn-group mb-2" role="group" style={{margin: 'auto', display: 'table'}}>
                          <button className="btn btn-raised" style={{marginRight: '5px'}} onClick={this.chooseFile.bind(this)}>файловое хранилище</button>
                          <button className="btn btn-raised" onClick={this.chooseStorage.bind(this, 'AKKaztokenStore')}>Kaztoken</button>
                        </div>

                        <div className="form-group">
                          <input className="form-control" placeholder="Путь к ключу" type="hidden" id="storagePath" />
                          <input className="form-control" placeholder="Пароль" id="inpPassword" type="password" />
                        </div>
                          {!this.state.loaderHidden &&
                          <div style={{margin: '0 auto'}}>
                              <Loader type="Ball-Triangle" color="#46B3F2" height="70" width="70" />
                          </div>
                          }

                          {this.state.loaderHidden &&
                          <div className="form-group">

                              <button className="btn btn-raised btn-success" type="button" onClick={this.signMessage.bind(this)}>Подписать</button>
                              <button className="btn btn-primary" type="button" style={{marginLeft: '5px'}}
                                      onClick={this.hideSignBtns.bind(this)}>Назад
                              </button>
                          </div>
                          }
                      </div>
                    </div>
                    :
                    <div>
                      <button className="btn btn-raised btn-success" style={{marginRight: '5px'}}
                              onClick={this.acceptDeclineApzForm.bind(this, apz.id, true, "your form was accepted")}>
                        Отправить отделу гос услуг
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          {this.state.engineerReturnedState &&
            <div className="alert alert-danger">
              Комментарий инженера: {this.state.engineerReturnedState.comment}
            </div>
          }

          <h5 className="block-title-2 mb-3">Логи</h5>
          <div className="border px-3 py-2">
            {apz.state_history.map(function(state, index) {
              return(
                <div key={index}>
                  <p className="mb-0">{state.created_at}&emsp;{state.state.name}  {state.receiver && '('+state.receiver+')'}</p>
                </div>
              );
            })}
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
                            <td><a className="text-info pointer" data-category="5" onClick={this.downloadFile.bind(this, this.state.waterCustomTcFile.id, 5)}>Скачать</a>
                              <div className="progress mb-2" data-category="5" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      }

                      {Boolean(!this.state.waterCustomTcFile) && Boolean(apz.commission.apz_water_response.response) &&
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
                              <td><a className="text-info pointer" data-category="6" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id, 6)}>Скачать</a>
                                <div className="progress mb-2" data-category="6" style={{height: '20px', display: 'none', marginTop:'5px'}}>
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
                      {!apz.commission.apz_water_response.response && !this.state.waterResponseFile &&
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>Причина отказа</b></td>
                            <td>{apz.commission.apz_water_response.response_text}</td>
                          </tr>
                        </tbody>
                      }
                      {!apz.commission.apz_water_response.response && this.state.waterResponseFile &&
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>МО Вода</b></td>
                            <td><a className="text-info pointer" data-category="7" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id, 7)}>Скачать</a>
                              <div className="progress mb-2" data-category="7" style={{height: '20px', display: 'none', marginTop:'5px'}}>
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
                      {Boolean(this.state.heatCustomTcFile) && Boolean(apz.commission.apz_heat_response.response) &&
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>Техническое условие</b></td>
                            <td><a className="text-info pointer" data-category="8" onClick={this.downloadFile.bind(this, this.state.heatCustomTcFile.id, 8)}>Скачать</a>
                              <div className="progress mb-2" data-category="8" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </td>
                          </tr>
                          <tr> <td>Описание технического условия</td> <td>{this.state.fileDescription}</td> </tr>
                        </tbody>
                      }

                      {Boolean(!this.state.heatCustomTcFile) && Boolean(apz.commission.apz_heat_response.response) &&
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
                              <td><a className="text-info pointer" data-category="9" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id, 9)}>Скачать</a>
                                <div className="progress mb-2" data-category="9" style={{height: '20px', display: 'none', marginTop:'5px'}}>
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
                      {!apz.commission.apz_heat_response.response && !this.state.heatResponseFile &&
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>Причина отказа</b></td>
                            <td>{apz.commission.apz_heat_response.response_text}</td>
                          </tr>
                        </tbody>
                      }
                      {!apz.commission.apz_heat_response.response && this.state.heatResponseFile &&
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>МО Тепло</b></td>
                            <td><a className="text-info pointer" data-category="10" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id, 10)}>Скачать</a>
                              <div className="progress mb-2" data-category="10" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      }
                    </table>

                    {Boolean(!this.state.heatCustomTcFile) && Boolean(apz.commission.apz_heat_response.response) && Boolean(apz.commission.apz_heat_response.blocks) &&
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
                            <td><b>Номер документа</b></td>
                            <td>{apz.commission.apz_electricity_response.doc_number}</td>
                          </tr>
                          <tr>
                            <td><b>Рекомендация</b></td>
                            <td>{apz.commission.apz_electricity_response.recommendation}</td>
                          </tr>
                          <tr>
                            <td style={{width: '50%'}}><b>Техническое условие</b></td>
                            <td><a className="text-info pointer" data-category="11" onClick={this.downloadFile.bind(this, this.state.electroCustomTcFile.id, 11)}>Скачать</a>
                              <div className="progress mb-2" data-category="11" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      }
                      {Boolean(!this.state.electroCustomTcFile) && Boolean(apz.commission.apz_electricity_response.response) &&
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
                              <td><a className="text-info pointer" data-category="12" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id, 12)}>Скачать</a>
                                <div className="progress mb-2" data-category="12" style={{height: '20px', display: 'none', marginTop:'5px'}}>
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
                      {!apz.commission.apz_electricity_response.response && !this.state.electroResponseFile &&
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>Причина отказа</b></td>
                            <td>{apz.commission.apz_electricity_response.response_text}</td>
                          </tr>
                        </tbody>
                      }
                      {!apz.commission.apz_electricity_response.response && this.state.electroResponseFile &&
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>МО Электро</b></td>
                            <td><a className="text-info pointer" data-category="13" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id, 13)}>Скачать</a>
                              <div className="progress mb-2" data-category="13" style={{height: '20px', display: 'none', marginTop:'5px'}}>
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
                            <td><a className="text-info pointer" data-category="14" onClick={this.downloadFile.bind(this, this.state.gasCustomTcFile.id, 14)}>Скачать</a>
                              <div className="progress mb-2" data-category="14" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      }

                      {Boolean(!this.state.gasCustomTcFile) && Boolean(apz.commission.apz_gas_response.response) &&
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
                              <td><a className="text-info pointer" data-category="15" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id, 15)}>Скачать</a>
                                <div className="progress mb-2" data-category="15" style={{height: '20px', display: 'none', marginTop:'5px'}}>
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
                      {!apz.commission.apz_gas_response.response && !this.state.gasResponseFile &&
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>Причина отказа</b></td>
                            <td>{apz.commission.apz_gas_response.response_text}</td>
                          </tr>
                        </tbody>
                      }
                      {!apz.commission.apz_gas_response.response && this.state.gasResponseFile &&
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>МО Газ</b></td>
                            <td><a className="text-info pointer" data-category="16" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id, 16)}>Скачать</a>
                              <div className="progress mb-2" data-category="16" style={{height: '20px', display: 'none', marginTop:'5px'}}>
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
                            <td><a className="text-info pointer" data-category="17" onClick={this.downloadFile.bind(this, this.state.phoneCustomTcFile.id, 17)}>Скачать</a>
                              <div className="progress mb-2" data-category="17" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      }

                      {Boolean(!this.state.phoneCustomTcFile) && Boolean(apz.commission.apz_phone_response.response) &&
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
                              <td><a className="text-info pointer" data-category="18" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id, 18)}>Скачать</a>
                                <div className="progress mb-2" data-category="18" style={{height: '20px', display: 'none', marginTop:'5px'}}>
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
                      {!apz.commission.apz_phone_response.response && !this.state.phoneResponseFile &&
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>Причина отказа</b></td>
                            <td>{apz.commission.apz_phone_response.response_text}</td>
                          </tr>
                        </tbody>
                      }
                      {!apz.commission.apz_phone_response.response && this.state.phoneResponseFile &&
                        <tbody>
                          <tr>
                            <td style={{width: '50%'}}><b>МО Газ</b></td>
                            <td><a className="text-info pointer" data-category="19" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id, 19)}>Скачать</a>
                              <div className="progress mb-2" data-category="19" style={{height: '20px', display: 'none', marginTop:'5px'}}>
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
                          <td>Отопление (Гкал/ч)</td>
                          <td>{apz.apz_heat.main_heat}</td>
                        </tr>
                        <tr>
                          <td>Вентиляция (Гкал/ч)</td>
                          <td>{apz.apz_heat.main_ven}</td>
                        </tr>
                        <tr>
                          <td>Горячее водоснабжение, ср (Гкал/ч)</td>
                          <td>{apz.apz_heat.main_water}</td>
                        </tr>
                        <tr>
                          <td>Горячее водоснабжение, макс (Гкал/ч)</td>
                          <td>{apz.apz_heat.main_water_max}</td>
                        </tr>
                        <tr>
                          <td>Энергосб. мероприятие</td>
                          <td>{apz.apz_heat.saving}</td>
                        </tr>
                        <tr>
                          <td>Технолог. нужды(пар) (Т/ч)</td>
                          <td>{apz.apz_heat.tech}</td>
                        </tr>

                        {apz.apz_heat.contract_num &&
                          <tr>
                            <td>Номер договора</td>
                            <td>{apz.apz_heat.contract_num}</td>
                          </tr>
                        }

                        {apz.apz_heat.general_in_contract &&
                          <tr>
                            <td>Общая тепловая нагрузка по договору (Гкал/ч)</td>
                            <td>{apz.apz_heat.general_in_contract}</td>
                          </tr>
                        }

                        {apz.apz_heat.tech_in_contract &&
                          <tr>
                            <td>Технологическая нагрузка(пар) по договору (Гкал/ч)</td>
                            <td>{apz.apz_heat.tech_in_contract}</td>
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

                    {apz.apz_heat.heatDistribution && apz.apz_heat.blocks &&
                      <div>
                        <div>Разделение нагрузки</div>
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
                            <td><a className="text-info pointer" data-category="20" onClick={this.downloadFile.bind(this, this.state.claimedCapacityJustification.id, 20)}>Скачать</a>
                              <div className="progress mb-2" data-category="20" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </td>
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
            <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
          </div>
        </div>
      </div>
    )
  }
}
