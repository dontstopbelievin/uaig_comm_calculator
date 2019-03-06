import React from 'react';
import Loader from 'react-loader-spinner';

export default class EcpSign extends React.Component {
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
        storageAlias: "PKCS12",
        loaderHiddenSign:true
      };
    }

    componentWillMount() {
      this.webSocketFunction();
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
      this.props.beforeSign();
      this.setState({loaderHiddenSign: false});
      let password = document.getElementById("inpPassword").value;
      let path = document.getElementById("storagePath").value;
      let keyType = "SIGN";
      if (path !== null && path !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
        if (password !== null && password !== "") {
            this.getKeys(this.state.storageAlias, path, password, keyType, "loadKeysBack");
        } else {
          alert("Введите пароль к хранилищу");
          this.setState({loaderHiddenSign: true});
        }
      } else {
        alert("Не выбран хранилище!");
        this.setState({loaderHiddenSign: true});
      }
    }

    loadKeysBack(result) {
      if (result.errorCode === "WRONG_PASSWORD") {
        alert("Неверный пароль!");
        this.setState({loaderHiddenSign: true});
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
      }
    }

    getTokenXml(alias) {
      let password = document.getElementById("inpPassword").value;
      let storagePath = document.getElementById("storagePath").value;
      var token = sessionStorage.getItem('tokenInfo');

      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + 'api/apz/' + this.props.rolename + '/get_xml/' + this.props.apz_id, true);
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
        xhr.open("post", window.url + 'api/apz/'+ this.props.rolename +'/save_xml/' + this.props.apz_id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
          if (xhr.status === 200) {
              this.props.ecpSignSuccess();
            alert("Успешно подписан!");
          } else {
            alert("Не удалось подписать файл");
            this.setState({loaderHiddenSign: true})
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

    openDialog() {
      alert("Ошибка при подключении к прослойке NCALayer. Убедитесь, что программа запущена и перезагрузите страницу");
    }

    render() {
      return (
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
                {!this.state.loaderHiddenSign &&
                <div style={{margin: '0 auto'}}>
                    <Loader type="Ball-Triangle" color="#46B3F2" height="70" width="70" />
                </div>
                }
                {this.state.loaderHiddenSign &&
                <div className="form-group">
                    <button className="btn btn-raised btn-success" type="button"
                            onClick={this.signMessage.bind(this)}>Подписать
                    </button>
                    <button className="btn btn-primary" type="button" style={{marginLeft: '5px'}}
                            onClick={this.props.hideSignBtns}>Назад
                    </button>
                </div>
                }
              </div>
            )
    }
  }
