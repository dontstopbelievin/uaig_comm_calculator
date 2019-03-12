import React from 'react';
import $ from 'jquery';
import 'jquery-serializejson';
import Loader from 'react-loader-spinner';
import ShowMap from './ShowMap';

export default class ShowSketch extends React.Component {
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
            sketch: [],
            showMap: false,
            showButtons: false,
            showCommission: false,
            file: false,
            docNumber: "",
            categoryFiles: [],
            responseFile: null,

            personalIdFile: false,
            apzFile: false,
            sketchFile: false,

            claimedCapacityJustification: false,
            showMapText: 'Показать карту',
            response: null,
            storageAlias: "PKCS12",
            needSign: false,
            engineerReturnedState: false,
            comment: null,
            xmlFile:false
        };

        this.onDocNumberChange = this.onDocNumberChange.bind(this);
        this.onCommentChange = this.onCommentChange.bind(this);
    }
    componentDidMount() {
        this.props.breadCrumbs();
    }

    onDocNumberChange(e) {
        this.setState({ docNumber: e.target.value });
    }

    onCommentChange(e) {
        this.setState({ comment: e.target.value });
    }

    componentWillMount() {
        if(!sessionStorage.getItem('tokenInfo')){
            let fullLoc = window.location.href.split('/');
            return this.props.history.replace({pathname: "/panel/common/login", state:{url_apz_id: fullLoc[fullLoc.length-1]}});
        }else {
            this.getSketchInfo();
        }
    }

    getSketchInfo() {
        var id = this.props.match.params.id;
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/sketch/engineer/detail/" + id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                var hasReponse = data.state_history.filter(function(obj) { return obj.state_id === 5 || obj.state_id === 6 });

                // console.log("______________________________");console.log(data);
                this.setState({sketch: data});
                this.setState({showButtons: false});
                this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
                this.setState({apzFile: data.files.filter(function(obj) { return obj.category_id === 2 })[0]});
                this.setState({sketchFile: data.files.filter(function(obj) { return obj.category_id === 1 })[0]});


                if (data.status_id === 4 && hasReponse.length == 0) {
                    this.setState({showButtons: true});
                }

                //
                // if (hasReponse.length == 0 || commission) {
                //     this.setState({showCommission: true});
                // }

                // this.setState({engineerReturnedState: data.state_history.filter(function(obj) { return obj.state_id === 1 && obj.comment != null && obj.sender == 'engineer'})[0]});
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
        xhr.open("get", window.url + 'api/sketch/engineer/get_xml/' + this.state.sketch.id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
            var tokenXml = xhr.responseText;
            console.log(tokenXml);

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
            xhr.open("post", window.url + 'api/sketch/engineer/save_xml/' + this.state.sketch.id, true);
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
            if (this.heartbeat_interval == "") {
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
        if (window.confirm("Ошибка при подключений к прослойке. Убедитесь что программа запущена и нажмите ОК") === true) {
            window.location.reload();
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

    acceptDeclineSketchForm(sketchId, status, comment) {
        var token = sessionStorage.getItem('tokenInfo');

        var formData = new FormData();
        formData.append('response', status);
        formData.append('message', comment);

        var xhr = new XMLHttpRequest();
        xhr.open("post", window.url + "api/sketch/engineer/status/" + sketchId, true);
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
                $('#ReturnSketchForm').modal('hide');
            }
        }.bind(this);
        xhr.send(formData);
    }

    render() {
        var sketch = this.state.sketch;
        if (sketch.length === 0) {
            return false;
        }

        return (
            <div className="row">
                <div className="col-sm-6">
                    <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

                    {/*<table className="table table-bordered table-striped">*/}
                        {/*<tbody>*/}
                        {/*<tr>*/}
                            {/*<td style={{width: '100%'}}><b>Тип заявки</b></td>*/}
                        {/*</tr>*/}
                        {/*<tr>*/}
                            {/*<td>{sketch.type === 1 ? 'Пакет 1': (sketch.type === 2 ? 'Пакет 2': 'Не определенный тип')}</td>*/}
                        {/*</tr>*/}
                        {/*</tbody>*/}
                    {/*</table>*/}

                    <table className="table table-bordered table-striped">
                        <tbody>
                        <tr>
                            <td style={{width: '50%'}}><b>ИД заявки</b></td>
                            <td><b>Заявитель</b></td>
                        </tr>
                        <tr>
                            <td>{sketch.id}</td>
                            <td>{sketch.applicant}</td>
                        </tr>
                        </tbody>
                    </table>

                    <table className="table table-bordered table-striped">
                        <tbody>
                        <tr>
                            {/*<td style={{width: '50%'}}><b>Разработчик</b></td>*/}
                            <td><b>Название проекта</b></td>
                        </tr>
                        <tr>
                            {/*<td>{sketch.designer}</td>*/}
                            <td>{sketch.project_name}</td>
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
                            <td>{sketch.phone}</td>
                            <td>
                                {sketch.project_address}

                                {sketch.project_address_coordinates &&
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
                            <td>{sketch.customer}</td>
                            <td>{sketch.created_at && this.toDate(sketch.created_at)}</td>
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
                            <td style={{width: '70%'}}><b>Уд. лич./ Реквизиты</b></td>
                            <td><a className="text-info pointer" data-category="1" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id, 1)}>Скачать</a>
                                <div className="progress mb-2" data-category="1" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </td>
                        </tr>
                        }

                        {this.state.apzFile &&
                        <tr>
                            <td style={{width: '70%'}}><b>Архитектурно-планировочное задание</b></td>
                            <td><a className="text-info pointer" data-category="2" onClick={this.downloadFile.bind(this, this.state.apzFile.id, 2)}>Скачать</a>
                                <div className="progress mb-2" data-category="2" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </td>
                        </tr>
                        }

                        {this.state.sketchFile &&
                        <tr>
                            <td style={{width: '70%'}}><b>Эскиз</b></td>
                            <td><a className="text-info pointer" data-category="3" onClick={this.downloadFile.bind(this, this.state.sketchFile.id, 3)}>Скачать</a>
                                <div className="progress mb-2" data-category="3" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </td>
                        </tr>
                        }


                        </tbody>
                    </table>

                    <h5 className="block-title-2 mt-3 mb-3">Показатели</h5>
                    <table className="table table-bordered table-striped">
                        <tbody>

                        {sketch &&
                        <tr>
                            <td style={{width: '70%'}}><b>Показатели по ген плану</b></td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#gen_modal">Просмотр</a></td>
                        </tr>
                        }

                        {sketch &&
                        <tr>
                            <td style={{width: '70%'}}><b>Показатели по проекту</b></td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#project_modal">Просмотр</a></td>
                        </tr>
                        }

                        {sketch &&
                        <tr>
                            <td style={{width: '70%'}}><b>Архитектурные решения по отделки фасада здания и сооружения</b></td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#architect_modal">Просмотр</a></td>
                        </tr>
                        }

                        </tbody>
                    </table>

                    {sketch &&
                    <div className="modal fade" id="gen_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                        <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Показатели по ген плану</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                                        <tbody>
                                        <tr>
                                            <td style={{width: '70%'}}>Площадь земельного участка (га)</td>
                                            <td>{sketch.land_area}</td>
                                        </tr>
                                        <tr>
                                            <td>Площадь покрытия (м<sup>2</sup>)</td>
                                            <td>{sketch.cover_area}</td>
                                        </tr>
                                        <tr>
                                            <td>Площадь озеленения (м<sup>2</sup>)</td>
                                            <td>{sketch.green_area}</td>
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

                    {sketch &&
                    <div className="modal fade" id="project_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                        <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Показатели по проекту</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                                        <tbody>
                                        <tr>
                                            <td style={{width: '70%'}}>Этажность</td>
                                            <td>{sketch.object_level}</td>
                                        </tr>
                                        <tr>
                                            <td>Общая площадь(м<sup>2</sup>)</td>
                                            <td>{sketch.common_area}</td>
                                        </tr>
                                        <tr>
                                            <td>Площадь застройки(м<sup>2</sup>)</td>
                                            <td>{sketch.build_area}</td>
                                        </tr>
                                        <tr>
                                            <td>Тип проекта</td>
                                            <td>{sketch.object_type}</td>
                                        </tr>
                                        <tr>
                                            <td>Сроки строительства</td>
                                            <td>{sketch.object_term}</td>
                                        </tr>
                                        <tr>
                                            <td>Акт на право частной собственности</td>
                                            <td>{sketch.akt_number}</td>
                                        </tr>
                                        {(sketch.object_type == 'МЖК Общественное задание' || sketch.object_type == 'МЖК Производственное задание') &&
                                          <React.Fragment>
                                          <tr>
                                            <td>Количество пятен</td>
                                            <td>{sketch.object_pyaten}</td>
                                            </tr>
                                          <tr>
                                            <td>Количество парковочных мест</td>
                                            <td>{sketch.object_carpark}</td>
                                          </tr>
                                          <tr>
                                            <td>Количество мест в детское дошкольное учреждение и детский сад</td>
                                            <td>{sketch.object_dou}</td>
                                          </tr>
                                          </React.Fragment>
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
                    {sketch &&
                    <div className="modal fade" id="architect_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                        <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Архитектурные решения по отделки фасада здания и сооружения</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                                        <tbody>
                                        <tr>
                                            <td style={{width: '70%'}}>Цоколь здания(фасад)</td>
                                            <td>{sketch.basement_facade}</td>
                                        </tr>
                                        <tr>
                                            <td>Цоколь здания(цвет)</td>
                                            <td>{sketch.basement_color}</td>
                                        </tr>
                                        <tr>
                                            <td>Стены здания(фасад)</td>
                                            <td>{sketch.walls_facade}</td>
                                        </tr>
                                        <tr>
                                            <td>Стены здания(цвет)</td>
                                            <td>{sketch.walls_color}</td>
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

                </div>


                <div className="col-sm-12">
                    {this.state.showMap && <ShowMap coordinates={sketch.project_address_coordinates} />}

                    <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                        {this.state.showMapText}
                    </button>
                </div>

                <div className="col-sm-12">

                    <div className={this.state.showButtons ? '' : 'invisible'}>
                        <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', marginBottom: '10px', display: 'table'}}>
                            {!this.state.needSign ?
                                <div>
                                    <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.sendToApz.bind(this)}>Одобрить</button>
                                    <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnSketchForm">
                                        Отклонить
                                    </button>
                                    <div className="modal fade" id="ReturnSketchForm" tabIndex="-1" role="dialog" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Отклонить</h5>
                                                    <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="form-group">
                                                        <label htmlFor="docNumber">Причина отклонения:</label>
                                                        <div style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                                                            <textarea style={{marginBottom: '10px'}} placeholder="Комментарий" rows="7" cols="50" className="form-control" defaultValue={this.state.comment} onChange={this.onCommentChange}></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineSketchForm.bind(this, sketch.id, false, this.state.comment)}>Отправить</button>
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
                                                    onClick={this.acceptDeclineSketchForm.bind(this, sketch.id, true, "your form was accepted")}>
                                                Главному архитектору
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
                        {sketch.state_history.map(function(state, index) {
                            return(
                                <div key={index}>
                                    <p className="mb-0">{state.created_at}&emsp;{state.state.name}  {state.receiver && '('+state.receiver+')'}</p>
                                </div>
                            );
                        }.bind(this))}
                    </div>

                    <div className="col-sm-12">
                        <hr />
                        <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
                    </div>
                </div>
            </div>
        )
    }
}
