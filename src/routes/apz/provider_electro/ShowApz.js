import React from 'react';
import $ from 'jquery';
import Loader from 'react-loader-spinner';
import saveAs from 'file-saver';
import ShowMap from "./ShowMap";

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

    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    this.state = {
      apz: [],
      showMap: false,
      showButtons: false,
      showSignButtons: false,
      showTechCon: false,
      file: null,
      elecReqPower: "",
      elecPhase: "Однофазная",
      elecSafeCategory: "",
      connectionPoint: "",
      recomendation: "",
      docNumber: "",
      description: '',
      responseId: 0,
      response: false,
      responseFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
      additionalFile: false,
      claimedCapacityJustification: false,
      showMapText: 'Показать карту',
      accept: 'answer',
      callSaveFromSend: false,
      elecStatus: 2,
      storageAlias: "PKCS12",
      xmlFile: false,
      isSigned: false,
      isPerformer: (roles.indexOf('PerformerElectricity') !== -1),
      isHead: (roles.indexOf('HeadElectricity') !== -1),
      isDirector: (roles.indexOf('DirectorElectricity') !== -1),
      heads_responses: [],
      head_accepted: true,
      headComment: "",
      ty_director_id: "",
      electricity_directors_id: [],
      customTcFile: null,
      loaderHidden:true
    };

    this.onElecReqPowerChange = this.onElecReqPowerChange.bind(this);
    this.onElecPhaseChange = this.onElecPhaseChange.bind(this);
    this.onElecSafeCategoryChange = this.onElecSafeCategoryChange.bind(this);
    this.onConnectionPointChange = this.onConnectionPointChange.bind(this);
    this.onRecomendationChange = this.onRecomendationChange.bind(this);
    this.onDocNumberChange = this.onDocNumberChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.saveResponseForm = this.saveResponseForm.bind(this);
    this.sendElectroResponse = this.sendElectroResponse.bind(this);
    this.onHeadCommentChange = this.onHeadCommentChange.bind(this);
    this.onCustomTcFileChange = this.onCustomTcFileChange.bind(this);
    this.printQuestionnaire = this.printQuestionnaire.bind(this);
  }
  componentDidMount() {
    this.props.breadCrumbs();
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    if(roles[2] === 'PerformerElectricity'){
      this.getDirectors();
    }
  }

  onElecReqPowerChange(e) {
    this.setState({ elecReqPower: e.target.value });
  }

  onElecPhaseChange(e) {
    this.setState({ elecPhase: e.target.value });
  }

  onElecSafeCategoryChange(e) {
    this.setState({ elecSafeCategory: e.target.value });
  }

  onConnectionPointChange(e) {
    this.setState({ connectionPoint: e.target.value });
  }

  onRecomendationChange(e) {
    this.setState({ recomendation: e.target.value });
  }

  onDocNumberChange(e) {
    this.setState({ docNumber: e.target.value });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  onHeadCommentChange(e) {
    this.setState({ headComment: e.target.value });
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  onCustomTcFileChange(e) {
    this.setState({ customTcFile: e.target.files[0] });
  }

  // this function to show one of the forms Accept/Decline
  toggleAcceptDecline(value) {
    this.setState({accept: value});
  }

  componentWillMount() {
    this.getApzInfo();
    this.webSocketFunction();
  }

  getDirectors(){
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/getelectricitydirectors", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        var select_directors = [];
        for (var i = 0; i < data.length; i++) {
          select_directors.push(<option key={i}   value={data[i].user_id}> {data[i].last_name +' ' + data[i].first_name+' '+data[i].middle_name} </option>);
        }
        this.setState({electricity_directors_id: select_directors});
        if(this.state.ty_director_id === "" || this.state.ty_director_id === " "){
            this.setState({ty_director_id: data[0].user_id});
        }
      }
    }.bind(this);
    xhr.send();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    var userId = JSON.parse(sessionStorage.getItem('userId'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
        return false;
    }

    var providerName = roles[1];
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/provider/" + providerName + "/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        this.setState({apz: data});
        this.setState({showButtons: false});
        this.setState({showTechCon: false});
        this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});
        this.setState({additionalFile: data.files.filter(function(obj) { return obj.category_id === 27 })[0]});
        this.setState({claimedCapacityJustification: data.files.filter(function(obj) { return obj.category_id === 24 })[0]});

        if (data.commission.apz_electricity_response) {
          data.commission.apz_electricity_response.response_text ? this.setState({description: data.commission.apz_electricity_response.response_text}) : this.setState({description: ""});
          data.commission.apz_electricity_response.connection_point ? this.setState({connectionPoint: data.commission.apz_electricity_response.connection_point}) : this.setState({connectionPoint: ""});
          data.commission.apz_electricity_response.req_power ? this.setState({elecReqPower: data.commission.apz_electricity_response.req_power}) : this.setState({elecReqPower: ""});
          data.commission.apz_electricity_response.phase ? this.setState({elecPhase: data.commission.apz_electricity_response.phase}) : this.setState({elecPhase: ""});
          data.commission.apz_electricity_response.safe_category ? this.setState({elecSafeCategory: data.commission.apz_electricity_response.safe_category}) : this.setState({elecSafeCategory: ""});
          data.commission.apz_electricity_response.recommendation ? this.setState({recomendation: data.commission.apz_electricity_response.recommendation}) : this.setState({recomendation: ""});
          data.commission.apz_electricity_response.doc_number ? this.setState({docNumber: data.commission.apz_electricity_response.doc_number}) : this.setState({docNumber: ""});
          data.commission.apz_electricity_response.id ? this.setState({responseId: data.commission.apz_electricity_response.id}) : this.setState({responseId: ""});
          data.commission.apz_electricity_response.response ? this.setState({response: data.commission.apz_electricity_response.response}) : this.setState({response: ""});
          data.commission.apz_electricity_response.electricity_director_id ? this.setState({ty_director_id: data.commission.apz_electricity_response.electricity_director_id}) : this.setState({ty_director_id: "" });
          data.commission.apz_electricity_response.files ? this.setState({customTcFile: data.commission.apz_electricity_response.files.filter(function(obj) { return obj.category_id === 23})[0]}) : this.setState({customTcFile: ""});;
          console.log(data.commission);
          if(data.commission.apz_electricity_response.id !== -1){
            this.setState({accept: data.commission.apz_electricity_response.response ? 'answer' : 'decline'});
          }

          this.setState({responseFile: data.commission.apz_electricity_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12})[0]});
          this.setState({xmlFile: data.commission.apz_electricity_response.files.filter(function(obj) { return obj.category_id === 15})[0]});
        }
        console.log(data.apz_electricity);
        console.log("ASDFASDFASD");
        this.setState({elecStatus: data.apz_electricity.status});

        if(data.apz_electricity.status === 1){
          this.setState({showTechCon: true});
        }

        if (data.status_id === 5 && data.apz_electricity.status === 2) {
          this.setState({showButtons: true});
        }

        if (this.state.xmlFile) {
          this.setState({isSigned: true});
        }

        this.setState({heads_responses: data.apz_provider_head_response.filter(function(obj) { return obj.role_id === 39 })});

        if (this.state.isHead && data.apz_provider_head_response.filter(function(obj) { return obj.role_id === 39 && obj.user_id === userId }).length === 0) {
          this.setState({head_accepted: false});
        }
      }
    }.bind(this)
    xhr.send();
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
              var binaryString = window.atob(base64);
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
  downloadAllFile(id) {
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/file/downloadAll/' + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      var progressbar = $('.progress[data-category=1]');
      var vision = $('.text-info[data-category=1]');
      progressbar.css('display', 'flex');
      vision.css('display', 'none');
      xhr.onprogress = function(event) {
        $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100, 10) + '%');
      }
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          //console.log(data.my_files[0]);return;
          var base64ToArrayBuffer = (function () {

            return function (base64) {
              var binaryString = window.atob(base64);
              var binaryLen = binaryString.length;
              var bytes = new Uint8Array(binaryLen);

              for (var i = 0; i < binaryLen; i++) {
                var ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
              }

              return bytes;
            }

          }());

          var JSZip = require("jszip");
          var zip = new JSZip();
          for(var i=0; i<data.my_files.length;i++){
            zip.file(i+'_'+data.my_files[i].file_name, base64ToArrayBuffer(data.my_files[i].file), {binary:true});
          }
          zip.generateAsync({type:"blob"})
          .then(function (content) {
              // see FileSaver.js
              saveAs(content, data.zip_name);
          });
          setTimeout(function() {
            progressbar.css('display', 'none');
            vision.css('display', 'inline');
            alert("Файлы успешно загружены");
            $('div', progressbar).css('width', 0);
          }, '1000');
        } else {
          progressbar.css('display', 'none');
          vision.css('display', 'inline');
          alert("Файлы успешно загружены");
          $('div', progressbar).css('width', 0);
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
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
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
    this.setState({ loaderHidden: false });
    let password = document.getElementById("inpPassword").value;
    let path = document.getElementById("storagePath").value;
    let keyType = "SIGN";
    if (path !== null && path !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
      if (password !== null && password !== "") {
        this.getKeys(this.state.storageAlias, path, password, keyType, "loadKeysBack");
      } else {
        alert("Введите пароль к хранилищу");
        this.setState({ loaderHidden: true });
      }
    } else {
      alert("Не выбран хранилище!");
      this.setState({ loaderHidden: true });
    }
  }

  loadKeysBack(result) {
    if (result.errorCode === "WRONG_PASSWORD") {
      alert("Неверный пароль!");
      this.setState({ loaderHidden: true });
      return false;
    }

    let alias = "";
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
      this.setState({ loaderHidden: true });
    }
  }

  getTokenXml(alias) {
    let password = document.getElementById("inpPassword").value;
    let storagePath = document.getElementById("storagePath").value;
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/apz/provider/get_xml/electricity/' + this.state.apz.id, true);
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

      //console.log("SIGNED XML ------> \n", signedXml);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + 'api/apz/provider/save_xml/electricity/' + this.state.apz.id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          this.setState({ isSigned: true });
          alert("Успешно подписан.");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        } else {//console.log(JSON.parse(xhr.responseText));
          alert("Не удалось подписать файл");
          this.setState({ loaderHidden: true });
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
      //console.log(event);
      this.setMissedHeartbeatsLimitToMin();
    }.bind(this);
  }

  openDialog() {
    alert("Ошибка при подключении к прослойке NCALayer. Убедитесь, что программа запущена и перезагрузите страницу");
  }

  // this function is to save the respones form when any change is made
  saveResponseForm(apzId, status, comment){
    var token = sessionStorage.getItem('tokenInfo');
    var file = this.state.file;
    var customTcFile = this.state.customTcFile;

    var formData = new FormData();
    formData.append('file', file);
    formData.append('customTcFile', customTcFile);
    formData.append('Response', status);
    formData.append('Message', comment);
    if(status === false){
      formData.append('ElecReqPower', "");
      formData.append('ElecPhase', "");
      formData.append('ElecSafeCategory', "");
      formData.append('ConnectionPoint', "");
      formData.append('Recomendation', "");
    }
    else{
      formData.append('ElecReqPower', this.state.elecReqPower);
      formData.append('ElecPhase', this.state.elecPhase);
      formData.append('ElecSafeCategory', this.state.elecSafeCategory);
      formData.append('ConnectionPoint', this.state.connectionPoint);
      formData.append('Recomendation', this.state.recomendation);
    }
    formData.append('DocNumber', this.state.docNumber);
    formData.append('ty_director_id', this.state.ty_director_id);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/provider/electro/" + apzId + '/save', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        this.setState({responseId: data.id});
        data.files ? this.setState({customTcFile: data.files.filter(function(obj) { return obj.category_id === 23})[0]}) : this.setState({customTcFile: null});;
        data.response ? this.setState({response: data.response}) : this.setState({response: ""});
        data.response ? this.setState({accept: data.response ? 'answer' : 'decline'}) : this.setState({accept: "answer"});
        data.files ? this.setState({responseFile: data.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]}) : this.setState({responseFile: null});
        data.response_text ? this.setState({description: data.response_text}) : this.setState({description: ""});
        data.connection_point ? this.setState({connectionPoint: data.connection_point}) : this.setState({connectionPoint: ""});
        data.req_power ? this.setState({elecReqPower: data.req_power}) : this.setState({elecReqPower: ""});
        data.phase ? this.setState({elecPhase: data.phase}) : this.setState({elecPhase: ""});
        data.safe_category ? this.setState({elecSafeCategory: data.safe_category}) : this.setState({elecSafeCategory: ""});
        data.recommendation ? this.setState({recomendation: data.recommendation}) : this.setState({recomendation: ""});

        if (this.state.callSaveFromSend) {
          this.setState({callSaveFromSend: false});
          this.sendElectroResponse(apzId, status, comment);
        } else {
          alert("Ответ сохранен!");

          this.setState({showSignButtons: true})
        }
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData);
  }

  // this function is to send the final response
  sendElectroResponse(apzId, status, comment) {
    if((this.state.responseId <= 0 || this.state.responseId > 0) && this.state.response !== status){
      this.setState({callSaveFromSend: true});
      this.saveResponseForm(apzId, status, comment);
    }
    else {
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/provider/electro/" + apzId + '/update', true);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);

          if(data.response === 1) {
            alert("Заявление принято!");
            this.setState({ showButtons: false });
            this.setState({ elecStatus: 1 });
            this.setState({showTechCon: true});
          }
          else if(data.response === 0) {
            alert("Заявление отклонено!");
            this.setState({ showButtons: false });
            this.setState({ elecStatus: 0 });
          }
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        }
      }.bind(this);
      xhr.send(JSON.stringify({docNumber: this.state.docNumber}));
    }
  }

  sendHeadResponse(apzId, status, comment) {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();

    var formData = new FormData();
    formData.append('status', status);
    formData.append('comment', comment);

    if (!comment) {
      alert('Заполните поле "Комментарий"');
      return false;
    }

    xhr.open("post", window.url + "api/apz/provider/headelectricity/" + apzId + '/response', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        alert('Ответ успешно отправлен');
        this.setState({head_accepted: true});
        this.setState({heads_responses: data.head_responses});
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
        alert(JSON.parse(xhr.responseText).message);
      }
    }.bind(this);
    xhr.send(formData);
  }

  // print technical condition
  printTechCon(apzId, project) {
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

  printQuestionnaire() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/print/questionnaire/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var newWin = window.open("");
        newWin.document.write(xhr.responseText);
        newWin.print();
        newWin.close();
      }
    }
    xhr.send();
  }

printData()
{
   var divToPrint=document.getElementById("printTable");
   var divToPrints=document.getElementById("detail_table");
   var newWin= window.open("");


   newWin.document.write(divToPrint.outerHTML + divToPrints.outerHTML);
    var elements = newWin.document.getElementsByClassName('shukichi');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
   newWin.print();
   newWin.close();
}
handleDirectorIDChange(event){
  this.setState({ty_director_id: event.target.value});
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
    var apz = this.state.apz;

    if (apz.length === 0) {
      return false;
    }

    return (
      <div className="row">
        <div className="col-sm-6">
          <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

          <table className="table table-bordered table-striped" id="printTable">
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
                <td><b>Дата поступления</b></td>
                <td>{this.toDate(apz.commission.created_at)}</td>
              </tr>

              {this.state.personalIdFile &&
                <tr className="shukichi">
                  <td><b>Уд. лич./ Реквизиты</b></td>
                  <td><a className="text-info pointer" data-category="2" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id, 2)}>Скачать</a>
                    <div className="progress mb-2" data-category="2" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>
              }

              {this.state.confirmedTaskFile &&
                <tr className="shukichi">
                  <td><b>Утвержденное задание</b></td>
                  <td><a className="text-info pointer" data-category="3" onClick={this.downloadFile.bind(this, this.state.confirmedTaskFile.id, 3)}>Скачать</a>
                    <div className="progress mb-2" data-category="3" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>
              }

              {this.state.titleDocumentFile &&
                <tr className="shukichi">
                  <td><b>Правоустанавл. документ</b></td>
                  <td><a className="text-info pointer" data-category="4" onClick={this.downloadFile.bind(this, this.state.titleDocumentFile.id, 4)}>Скачать</a>
                    <div className="progress mb-2" data-category="4" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>
              }

              {this.state.additionalFile &&
                <tr className="shukichi">
                  <td><b>Дополнительно</b></td>
                  <td><a className="text-info pointer" data-category="5" onClick={this.downloadFile.bind(this, this.state.additionalFile.id, 5)}>Скачать</a>
                    <div className="progress mb-2" data-category="5" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>
              }
              {(this.state.personalIdFile || this.state.confirmedTaskFile || this.state.titleDocumentFile || this.state.additionalFile) &&
                <tr className="shukichi">
                  <td colSpan="2"><a className="text-info pointer" data-category="1" onClick={this.downloadAllFile.bind(this, this.state.apz.id)}><img style={{height:'16px'}} src="/images/download.png" alt="download"/>Скачать одним архивом</a>
                    <div className="progress mb-2" data-category="1" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className="col-sm-6">
          <h5 className="block-title-2 mt-3 mb-3">Детали</h5>

          <table className="table table-bordered table-striped"  id="detail_table">
            <tbody>
              <tr>
                <td style={{width: '40%'}}>Требуемая мощность (кВт)</td>
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
                  <td><a className="text-info pointer" data-category="6" onClick={this.downloadFile.bind(this, this.state.claimedCapacityJustification.id, 6)}>Скачать</a>
                    <div className="progress mb-2" data-category="6" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          <button className="btn btn-raised btn-success" onClick={this.printData}>Печать</button>
          <button className="btn btn-raised btn-success ml-2" onClick={this.printQuestionnaire}>Печать опросного листа</button>
        </div>

        <div className="col-sm-12">
          <div className="row provider_answer_top" style={{margin: '16px 0 0'}}>
            {(this.state.isPerformer === true || this.state.responseId !== 0) &&
              <div className="col-sm-6">
                <h5 className="block-title-2 mt-3 mb-3" style={{display: 'inline'}}>Ответ</h5>
              </div>
            }
            <div className="col-sm-6 pr-0">
              {this.state.showButtons && !this.state.isSigned && this.state.isPerformer &&
                <div className="btn-group" style={{float: 'right', margin: '0'}}>
                  <button className={'btn btn-raised ' + (this.state.accept === 'answer' ? 'btn-success' : 'btn-secondary')} style={{marginRight: '5px'}} onClick={this.toggleAcceptDecline.bind(this, 'answer')}>
                    Одобрить
                  </button>
                  <button className={'btn btn-raised ' + (this.state.accept === 'decline' ? 'btn-danger' : 'btn-secondary')} onClick={this.toggleAcceptDecline.bind(this, 'decline')}>
                    Отклонить
                  </button>
                </div>
              }
            </div>
          </div>
{console.log(this.state.elecStatus)}{console.log(this.state.accept)}
          {this.state.accept === 'accept' && this.state.elecStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <form className="provider_answer_body" style={{border: 'solid 1px #46A149', padding: '20px'}}>
              <div className="row pt-0">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Требуемая мощность (кВт)</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.elecReqPower} onChange={this.onElecReqPowerChange} />
                  </div>
                  <div className="form-group">
                    <label>Характер нагрузки (фаза)</label>
                    <select className="form-control" value={this.state.value} onChange={this.onElecPhaseChange}>
                      <option>Однофазная</option>
                      <option>Трехфазная</option>
                      <option>Постоянная</option>
                      <option>Временная</option>
                      <option>Сезонная</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Категория по надежности (кВт)</label>
                    <input type="number" step="any" className="form-control" required placeholder="" value={this.state.elecSafeCategory} onChange={this.onElecSafeCategoryChange} />
                  </div>
                  <div className="form-group">
                    <label>Точка подключения</label>
                    <input type="text" className="form-control" placeholder="" value={this.state.connectionPoint} onChange={this.onConnectionPointChange} />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Рекомендация</label>
                    <textarea rows="5" className="form-control" value={this.state.recomendation} onChange={this.onRecomendationChange} placeholder="Описание"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Номер документа</label>
                    <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                  </div>
                  {(this.state.response === true && this.state.responseFile) &&
                    <div className="form-group">
                      <label style={{display: 'block'}}>Прикрепленный файл</label>
                      <a className="pointer text-info" title="Скачать" data-category="7" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 7)}>
                        Скачать
                      </a>
                      <div className="progress mb-2" data-category="7" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  }
                  <div className="form-group">
                    <label htmlFor="upload_file">Прикрепить файл</label>
                    <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
                  </div>
                </div>
                <div className="col-sm-12">
                  {!this.state.xmlFile &&
                    <div className="form-group">
                      <div style={{paddingLeft:'5px', fontSize: '18px', margin: '10px 0px'}}>
                        <b>Выберите директора:</b>
                        <select id="electricity_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.ty_director_id} onChange={this.handleDirectorIDChange.bind(this)}>
                          {this.state.electricity_directors_id}
                        </select>
                      </div>
                      <button type="button" style={{ marginRight: '5px' }} className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, "accept", "")}>
                        Сохранить
                      </button>

                       {/*<button type="button" style={{ marginRight: '5px' }} className="btn btn-secondary" onClick={this.sendElectroResponse.bind(this, apz.id, true, "")}>
                         Отправить без ЭЦП
                       </button>*/}

                      {this.state.response &&
                        <button type="button" className="btn btn-secondary" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>
                          Предварительный просмотр
                        </button>
                      }
                      <p style={{color:'#777777'}}>Сохранение перезаписывает предыдущий вариант.</p>
                    </div>
                  }
                </div>
              </div>
            </form>
          }

          {this.state.accept === 'accept' && this.state.responseId !== 0 && (this.state.elecStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>Требуемая мощность (кВт)</td>
                    <td>{this.state.elecReqPower}</td>
                  </tr>
                  <tr>
                    <td>Характер нагрузки (фаза)</td>
                    <td>{this.state.elecPhase}</td>
                  </tr>
                  <tr>
                    <td>Категория по надежности (кВт)</td>
                    <td>{this.state.elecSafeCategory}</td>
                  </tr>
                  <tr>
                    <td>Точка подключения</td>
                    <td>{this.state.connectionPoint}</td>
                  </tr>
                  <tr>
                    <td>Рекомендация</td>
                    <td>{this.state.recomendation}</td>
                  </tr>
                  <tr>
                    <td>Номер документа</td>
                    <td>{this.state.docNumber}</td>
                  </tr>
                  {this.state.responseFile &&
                    <tr>
                      <td>Прикрепленный файл</td>
                      <td>
                        <a className="pointer text-info" title="Скачать" data-category="8" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 8)}>
                          Скачать
                        </a>
                        <div className="progress mb-2" data-category="8" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.state.showTechCon === false && (this.state.isDirector || this.state.isHead) &&
                    <tr>
                      <td>Ответ в PDF</td>
                      <td>
                        <a className="pointer text-info" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>
                          Скачать
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          {this.state.accept === 'answer' && this.state.elecStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <div className="provider_answer_body" style={{border: 'solid 1px #46A149', padding: '20px'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
                <label>Рекомендация</label>
                <textarea rows="5" className="form-control" value={this.state.recomendation} onChange={this.onRecomendationChange} placeholder="Описание"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="custom_tc_file">
                  Прикрепить файл

                  {this.state.customTcFile &&
                    <span style={{paddingLeft: '5px'}}>
                      (текущий файл: <a className="pointer text-info" data-category="9" title="Скачать" onClick={this.downloadFile.bind(this, this.state.customTcFile.id, 9)}>{this.state.customTcFile.name}</a>)
                      <div className="progress mb-2" data-category="9" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </span>

                  }

                </label>
                <input type="file" id="custom_tc_file" className="form-control" onChange={this.onCustomTcFileChange} />
              </div>

              <div style={{paddingLeft:'5px', fontSize: '18px', margin: '10px 0px'}}>
                <b>Выберите директора:</b>
                <select id="electricity_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.ty_director_id} onChange={this.handleDirectorIDChange.bind(this)}>
                  {this.state.electricity_directors_id}
                </select>
              </div>
              <div className="form-group" style={{marginBottom:'5px'}}>
                {!this.state.xmlFile &&
                    <button type="button" className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, true, "")}>
                      Сохранить
                    </button>
                }
                <button type="button" style={{ marginLeft: '5px' }} className="btn btn-secondary" onClick={this.sendElectroResponse.bind(this, apz.id, true, "")}>
                  Отправить без ЭЦП
                </button>
              </div>
              <p style={{color:'#777777', marginBottom:'0px'}}>Если есть сканированное техническое условие. Сканированный ТУ заменяет ТУ созданный сайтом.</p>
              <p style={{color:'#777777'}}>Сохранение перезаписывает предыдущий файл.</p>
            </div>
          }

          {this.state.accept === 'answer' && this.state.responseId !== 0 && (this.state.elecStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td>Номер документа</td>
                  <td>{this.state.docNumber}</td>
                </tr>
                <tr>
                  <td>Рекомендация</td>
                  <td>{this.state.recomendation}</td>
                </tr>
              {this.state.customTcFile &&
                <tr>
                  <td>Технические условия</td>
                  <td><a className="pointer text-info" title="Скачать" data-category="10" onClick={this.downloadFile.bind(this, this.state.customTcFile.id, 10)}>Скачать</a>
                    <div className="progress mb-2" data-category="10" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>}
              </tbody>
            </table>
          }

          {this.state.isDirector && this.state.elecStatus === 2 &&
            <div>
              {!this.state.xmlFile && !this.state.isSigned && apz.status_id === 5 &&
                <div style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                  <div>Выберите хранилище</div>

                  <div className="btn-group mb-2" role="group" style={{margin: 'auto', display: 'table'}}>
                    <button className="btn btn-raised" style={{marginRight: '5px'}} onClick={this.chooseFile.bind(this)}>файловое хранилище</button>
                    <button className="btn btn-raised" onClick={this.chooseStorage.bind(this, 'AKKaztokenStore')}>eToken</button>
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
                  </div>
                  }
                </div>

              }
            </div>
          }

          {this.state.elecStatus === 2 && this.state.isSigned && this.state.isPerformer &&
            <div style={{margin: 'auto', marginTop: '20px', display: 'table', width: '30%'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={this.sendElectroResponse.bind(this, apz.id, true, "")}>
                  Отправить инженеру
                </button>
              </div>
            </div>
          }

          {this.state.accept === 'decline' && this.state.elecStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <div className="provider_answer_body" style={{border: 'solid 1px #f44336', padding: '20px'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
               <label>Причина отклонения</label>
                <textarea rows="5" className="form-control" value={this.state.description} onChange={this.onDescriptionChange} placeholder="Описание"></textarea>
              </div>
              {(this.state.response === false && this.state.responseFile) &&
                <div className="form-group">
                  <label style={{display: 'block'}}>Прикрепленный файл</label>
                  <a className="pointer text-info" title="Скачать" data-category="11" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 11)}>
                    Скачать
                  </a>
                  <div className="progress mb-2" data-category="11" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              }
              <div className="form-group">
                <label htmlFor="upload_file">Прикрепить файл</label>
                <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
              </div>
              <div className="form-group">
                <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm">Отклонить</button>
              </div>
            </div>
          }
          <div className="modal fade" id="ReturnApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Вы уверены что хотите отколнить заявление?</h5>
                  <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-footer" style={{margin:'auto'}}>
                  <button type="button" className="btn btn-secondary" onClick={this.sendElectroResponse.bind(this, apz.id, false, this.state.description)}>
                    Да
                  </button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal" style={{marginLeft:'5px'}}>Нет</button>
                </div>
              </div>
            </div>
          </div>

          {this.state.accept === 'decline' && this.state.responseId !== 0 && (this.state.elecStatus === 0 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>Причина отклонения</td>
                    <td>{this.state.description}</td>
                  </tr>
                  <tr>
                    <td>Номер документа</td>
                    <td>{this.state.docNumber}</td>
                  </tr>
                  {this.state.responseFile &&
                    <tr>
                      <td>Прикрепленный файл</td>
                      <td>
                        <a className="pointer text-info" title="Скачать" data-category="12" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 12)}>
                          Скачать
                        </a>
                        <div className="progress mb-2" data-category="12" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          {!this.state.customTcFile &&
            <div className={this.state.showTechCon ? '' : 'invisible'}>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}><b>Сформированный ТУ</b></td>
                    <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                  </tr>
                </tbody>
              </table>
            </div>}
        </div>

        <div className="col-sm-12">
          {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}

          <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>
        </div>

        <div className="col-sm-12">
          {apz.commission && apz.commission.comment &&
            <div className="alert alert-info mt-3">
              {apz.commission.comment}
            </div>
          }

          {this.state.heads_responses.length > 0 &&
            <div>
              <h5 className="block-title-2 mt-4 mb-3">Комментарии:</h5>

              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <th>ФИО</th>
                    <th>Комментарий</th>
                    <th>Дата</th>
                  </tr>
                  {this.state.heads_responses.map(function(item, index) {
                    return(
                      <tr key={index}>
                        <td width="40%">
                          {item.user.name}
                        </td>
                        <td width="40%">{item.comments}</td>
                        <td>{this.toDate(item.created_at)}</td>
                      </tr>
                      );
                    }.bind(this))
                  }
                </tbody>
              </table>
            </div>
          }

          {this.state.isHead &&
            <div className={this.state.showButtons ? '' : 'invisible'}>
              <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                <textarea style={{marginBottom: '10px'}} placeholder="Комментарий" rows="7" cols="50" className="form-control" value={this.state.headComment} onChange={this.onHeadCommentChange}></textarea>
                <button className="btn btn-raised btn-success" onClick={this.sendHeadResponse.bind(this, apz.id, true, this.state.headComment)}>
                  Отправить
                </button>
              </div>
            </div>
          }
        </div>

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
    )
  }
}
