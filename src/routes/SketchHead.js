import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import saveAs from 'file-saver';

export default class Head extends React.Component {
    render() {
        return (
            <div className="content container body-content">
                <div>
                    <div>
                        <Switch>
                            <Route path="/panel/head/sketch/status/:status/:page" exact render={(props) =>(
                                <AllSketches {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
                            )} />
                            <Route path="/panel/head/sketch/show/:id" exact render={(props) =>(
                                <ShowSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
                            )} />
                            <Redirect from="/panel/head/sketch" to="/panel/head/sketch/status/active/1" />
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

class AllSketches extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaderHidden: false,
            response: null,
            current_head: '',
            apz_heads:[],
            pageNumbers: []
        };
    }

    componentDidMount() {
        this.props.breadCrumbs();
    }

    componentWillMount() {
        this.getHeads();
    }

    componentWillReceiveProps(nextProps) {
        this.getSketches(nextProps.match.params.status, nextProps.match.params.page);
    }

    getHeads(){
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/apz/getheads", true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                //console.log(data);
                var select_directors = [];
                for (var i = 0; i < data.length; i++) {
                    select_directors.push(<option value={data[i].user_id}> {data[i].last_name +' ' + data[i].first_name+' '+data[i].middle_name} </option>);
                }
                this.setState({apz_heads: select_directors});
                if(this.state.current_head == "" || this.state.current_head == " "){
                    this.setState({current_head: data[0].user_id}, function stateUpdateComplete() {
                        this.getSketches();
                    }.bind(this));
                }
            }
        }.bind(this);
        xhr.send();
    }

    getSketches(status = null, page = null) {
        if (!status) {
            status = this.props.match.params.status;
        }

        if (!page) {
            page = this.props.match.params.page;
        }

        this.setState({ loaderHidden: false });

        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/sketch/head/all/" + status + '/' + this.state.current_head + '?page=' + page, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
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

    handleHeadChange(event){
        this.setState({current_head: event.target.value}, function stateUpdateComplete() {
            this.getSketches();
        }.bind(this));
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
        var sketches = this.state.response ? this.state.response.data : [];

        return (
            <div>
                <div className="card-header">
                    <h4 className="mb-0">Эскизные проекты</h4>
                </div>
                {this.state.loaderHidden &&
                <div>
                    <div style={{fontSize: '18px', margin: '10px 0px'}}>
                        <b>Выберите главного архитектора:</b>
                        <select style={{padding: '0px 4px', margin: '5px'}} value={this.state.current_head} onChange={this.handleHeadChange.bind(this)}>
                            {this.state.apz_heads}
                        </select>
                    </div>
                    <ul className="nav nav-tabs mb-2 pull-right">
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/head/sketch/status/active/1" replace>Активные</NavLink></li>
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'inproccess'} to="/panel/head/sketch/status/inproccess/1" replace>В процессе</NavLink></li>
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/head/sketch/status/accepted/1" replace>Принятые</NavLink></li>
                        <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/head/sketch/status/declined/1" replace>Отказанные</NavLink></li>
                    </ul>

                    <table className="table">
                        <thead>
                        <tr>
                            <th style={{width: '5%'}}>ИД</th>
                            <th style={{width: '21%'}}>Название</th>
                            <th style={{width: '20%'}}>Заявитель</th>
                            <th style={{width: '20%'}}>Адрес</th>
                            <th style={{width: '20%'}}>Дата заявления</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {sketches.map(function(sketch, index) {
                            return(
                                <tr key={index}>
                                    <td>{sketch.id}</td>
                                    <td>
                                        {sketch.project_name}

                                        {sketch.object_type &&
                                        <span className="ml-1">({sketch.object_type})</span>
                                        }
                                    </td>
                                    <td>{sketch.applicant}</td>
                                    <td>{sketch.project_address}</td>
                                    <td>{this.toDate(sketch.created_at)}</td>
                                    <td>
                                        <Link className="btn btn-outline-info" to={'/panel/head/sketch/show/' + sketch.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                                    </td>
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
                                <Link className="page-link" to={'/panel/head/sketch/status/' + status + '/1'}>В начало</Link>
                            </li>

                            {this.state.pageNumbers.map(function(num, index) {
                                return(
                                    <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                                        <Link className="page-link" to={'/panel/head/sketch/status/' + status + '/' + num}>{num}</Link>
                                    </li>
                                );
                            }.bind(this))
                            }
                            <li className="page-item">
                                <Link className="page-link" to={'/panel/head/sketch/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
                            </li>
                        </ul>
                    </nav>
                    }
                </div>
                }

                {!this.state.loaderHidden &&
                <div style={{textAlign: 'center'}}>
                    <br />
                    <br />
                    <Loader type="Oval" color="#46B3F2" height="200" width="200" />
                </div>
                }
            </div>
        )
    }
}

class ShowSketch extends React.Component {
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
            showSendButton: false,
            showSignButtons: false,
            file: false,
            docNumber: "",
            description: '',
            responseFile: null,
            headResponseFile: null,
            callSaveFromSend: false,
            personalIdFile: false,
            apzFile:false,
            sketchFile: false,

            showMapText: 'Показать карту',
            headResponse: null,
            response: false,
            loaderHidden: false,
            loaderHiddenSign:true,
            storageAlias: "PKCS12",
            xmlFile: false,
            //returnedState: false,
            lastDecisionIsMO: false,
            isSigned: false
        };

        this.onDocNumberChange = this.onDocNumberChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
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

    onFileChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    componentWillMount() {
        this.getSketchInfo();
    }

    getSketchInfo() {
        var id = this.props.match.params.id;
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/sketch/head/detail/" + id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                console.log(data);
                var hasDeclined = data.state_history.filter(function(obj) {
                    return obj.state_id === 3
                });

                this.setState({sketch: data});
                this.setState({showButtons: false});
                this.setState({docNumber: data.id});
                this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
                this.setState({apzFile: data.files.filter(function(obj) { return obj.category_id === 2 })[0]});
                this.setState({sketchFile: data.files.filter(function(obj) { return obj.category_id === 1 })[0]});
                // this.setState({: data.files.filter(function(obj) { return obj.category_id === 27 })[0]});
                // this.setState({reglamentFile: data.files.filter(function(obj) { return obj.category_id === 29 })[0]});
                //this.setState({returnedState: data.state_history.filter(function(obj) { return obj.state_id === 3 && obj.comment != null })[0]});
                // var pack2IdFile = data.files.filter(function(obj) { return obj.category_id === 25 }) ?
                //     data.files.filter(function(obj) { return obj.category_id === 25 }) : [];
                // if ( pack2IdFile.length > 0 ) {
                //     this.setState({pack2IdFile: pack2IdFile[0]});
                // }
                for(var data_index = data.state_history.length-1; data_index >= 0; data_index--){
                    switch (data.state_history[data_index].state_id) {
                        case 5:
                            break;
                        case 3:
                            this.setState({lastDecisionIsMO: true});
                            break;
                        default:
                            continue;
                    }
                    break;
                }




                if (data.status_id === 6 && !data.apz_head_response) {
                    this.setState({showButtons: true});
                }

                if (data.status_id === 6 && data.apz_head_response && data.apz_head_response.files.filter(function(obj) { return obj.category_id === 19})[0] == null) {
                    this.setState({showButtons: true});
                }

                if (data.apz_head_response && data.apz_head_response && data.apz_head_response.files.filter(function(obj) { return obj.category_id === 19})[0] != null) {
                    this.setState({isSigned: true});
                    this.setState({xmlFile: data.apz_head_response.files.filter(function(obj) { return obj.category_id === 19})[0]});
                    this.setState({headResponse: data.apz_head_response.response});
                }

                if (data.apz_head_response && data.apz_head_response.files.filter(function(obj) { return obj.category_id === 19})[0] != null && data.status_id === 6) {
                    this.setState({showSendButton: true});
                }

                /*if (!this.state.xmlFile && this.state.headResponseFile && data.status_id === 7) {
                  this.setState({showSignButtons: true});
                }*/

                this.setState({loaderHidden: true});

                if (hasDeclined.length != 0) {
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
                alert('Не удалось скачать файл');
                vision.css('display', 'inline');
                progressbar.css('display', 'none');
                $('div', progressbar).css('width', 0);
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
        this.setState({loaderHiddenSign: false});
        this.saveSketchForm(this.state.sketch.id, this.state.lastDecisionIsMO ? false : true, "");
        this.setState({ loaderHidden: false });
        let password = document.getElementById("inpPassword").value;
        let path = document.getElementById("storagePath").value;
        let keyType = "SIGN";
        if (path !== null && path !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
            if (password !== null && password !== "") {
                this.getKeys(this.state.storageAlias, path, password, keyType, "loadKeysBack");
            } else {
                alert("Введите пароль к хранилищу");
                this.setState({ loaderHiddenSign: true });
            }
        } else {
            alert("Не выбран хранилище!");
            this.setState({ loaderHiddenSign: true });
        }
        this.setState({ loaderHidden: true });
    }

    loadKeysBack(result) {
        if (result.errorCode === "WRONG_PASSWORD") {
            alert("Неверный пароль!");
            this.setState({ loaderHiddenSign: true });
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
        xhr.open("get", window.url + 'api/sketch/head/get_xml/' + this.state.sketch.id, true);
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
            xhr.open("post", window.url + 'api/sketch/head/save_xml/' + this.state.sketch.id, true);
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            xhr.onload = function() {
                switch (xhr.status) {
                    case 200:
                        this.setState({ isSigned: true });
                        this.setState({ showSendButton: true });
                        alert('Успешно подписан.');
                        break;
                    case 403:
                        if(JSON.parse(xhr.responseText).message){
                            alert(JSON.parse(xhr.responseText).message);
                        }else{
                            alert("Не удалось подписать файл");
                            this.setState({ loaderHiddenSign: true });
                        }
                        break;
                    default:
                        alert(xhr.status + " - для этого статуса не определена ошибка");
                        this.setState({ loaderHiddenSign: true });
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
            //console.log(event);
            this.setMissedHeartbeatsLimitToMin();
        }.bind(this);
    }

    openDialog() {
        if (window.confirm("Ошибка при подключений к прослойке. Убедитесь что программа запущена и нажмите ОК") === true) {
            window.location.reload();
        }
    }

    saveSketchForm(sketchId, status, comment) {
        var token = sessionStorage.getItem('tokenInfo');
        var formData = new FormData();
        /*if(status){
          var file = this.state.file;
          if(!file){alert("Загрузите файл"); return;}
          formData.append('file', file);
        }*/
        formData.append('Response', status);
        formData.append('Message', comment);
        if(this.state.docNumber == '' || this.state.docNumber == ' '){alert("Введите номер документа"); return;}
        formData.append('DocNumber', this.state.docNumber);

        var xhr = new XMLHttpRequest();
        xhr.open("post", window.url + "api/sketch/head/save/" + sketchId, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);

                this.setState({ showButtons: false });
                this.setState({ headResponse: data.response });

                if(this.state.callSaveFromSend){
                    this.setState({callSaveFromSend: false});
                    this.acceptDeclineSketchForm(sketchId, status, comment);
                } else {
                    // alert("Ответ сохранен!");
                    this.setState({ showSignButtons: true });
                }
            }
            else if(xhr.status === 401){
                sessionStorage.clear();
                alert("Время сессии истекло. Пожалуйста войдите заново!");
                this.props.history.replace("/login");
            }
        }.bind(this);
        xhr.send(formData);

        /*$('.modal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();*/
    }

    showSignBtns(){
        this.setState({ showSignButtons: true });
        this.setState({ showButtons: false });
    }
    hideSignBtns(){
        this.setState({ showSignButtons: false });
        this.setState({ showButtons: true });
    }

    returnSketchForm(sketchId) {
        var token = sessionStorage.getItem('tokenInfo');
        var formData = new FormData();
        formData.append('description', this.state.description);
        var xhr = new XMLHttpRequest();
        xhr.open("post", window.url + "api/sketch/head/return/" + sketchId, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                this.setState({ showButtons: false });
                alert("Заявка возвращена!");
            }
            else if(xhr.status === 401){
                sessionStorage.clear();
                alert("Время сессии истекло. Пожалуйста войдите заново!");
                this.props.history.replace("/login");
            }
        }.bind(this);
        xhr.send(formData);

        $('.modal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }

    acceptDeclineSketchForm(sketchId, status, comment) {
        if(this.state.headResponse === null){
            this.setState({callSaveFromSend: true});
            this.saveSketchForm(sketchId, status, comment);
            return true;
        }

        var token = sessionStorage.getItem('tokenInfo');
        var formData = new FormData();
        formData.append('Response', status);

        var xhr = new XMLHttpRequest();
        xhr.open("post", window.url + "api/sketch/head/status/" + sketchId, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                //var data = JSON.parse(xhr.responseText);

                if(status === true) {
                    alert("Заявление принято!");
                } else {
                    alert("Заявление отклонено!");
                }

                this.setState({ showButtons: false });
                this.setState({ showSendButton: false });
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


    printSketch(sketchId, project) {
        var token = sessionStorage.getItem('tokenInfo');
        if (token) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", window.url + "api/print/sketch/" + sketchId, true);
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

    printRegionAnswer(sketchId, progbarId = null) {
        var token = sessionStorage.getItem('tokenInfo');
        if (token) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", window.url + "api/print/region/" + sketchId, true);
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
                                setTimeout(function() {window.URL.revokeObjectURL(url);},1000);
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

    printSketchAnswer(sketchId, progbarId = null) {
        var token = sessionStorage.getItem('tokenInfo');
        if (token) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", window.url + "api/print/sketch/" + sketchId, true);
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    //test of IE
                    if (typeof window.navigator.msSaveBlob === "function") {
                        window.navigator.msSaveBlob(xhr.response, "Sogl.pdf");
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
                                setTimeout(function() {window.URL.revokeObjectURL(url);},1000);
                            };

                        }());

                        saveByteArray([base64ToArrayBuffer(data.file)], "Sogl.pdf");
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

    render() {
        var sketch = this.state.sketch;

        if (sketch.length === 0) {
            return false;
        }

        return (
            <div>
                {this.state.loaderHidden &&
                <div className="row">
                    <div className="col-sm-6">
                        <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

                        <table className="table table-bordered table-striped">
                            <tbody>
                            <tr>
                                <td style={{width: '40%'}}><b>ИД заявки</b></td>
                                <td>{sketch.id}</td>
                            </tr>
                            <tr>
                                <td><b>Заявитель</b></td>
                                <td>{sketch.applicant}</td>
                            </tr>
                            <tr>
                                <td><b>Телефон</b></td>
                                <td>{sketch.phone}</td>
                            </tr>
                            <tr>
                                <td><b>Заказчик</b></td>
                                <td>{sketch.customer}</td>
                            </tr>
                            {/*<tr>*/}
                                {/*<td><b>Разработчик</b></td>*/}
                                {/*<td>{sketch.designer}</td>*/}
                            {/*</tr>*/}
                            <tr>
                                <td><b>Название проекта</b></td>
                                <td>{sketch.project_name}</td>
                            </tr>
                            <tr>
                                <td><b>Адрес проектируемого объекта</b></td>
                                <td>
                                    {sketch.project_address}

                                    {sketch.project_address_coordinates &&
                                    <a className="ml-2 pointer text-info" onClick={this.toggleMap.bind(this, true)}>Показать на карте</a>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td><b>Дата заявления</b></td>
                                <td>{sketch.created_at && this.toDate(sketch.created_at)}</td>
                            </tr>

                            {/*{this.state.personalIdFile &&*/}
                            {/*<tr>*/}
                                {/*<td><b>Уд. лич./ Реквизиты</b></td>*/}
                                {/*<td><a className="text-info pointer" data-category="1" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id, 1)}>Скачать</a>*/}
                                    {/*<div className="progress mb-2" data-category="1" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                        {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                    {/*</div>*/}
                                {/*</td>*/}
                            {/*</tr>*/}
                            {/*}*/}

                            {/*{this.state.apzFile &&*/}
                            {/*<tr>*/}
                                {/*<td><b>Архитектурно-планировочное задание</b></td>*/}
                                {/*<td><a className="text-info pointer" data-category="2" onClick={this.downloadFile.bind(this, this.state.apzFile.id, 2)}>Скачать</a>*/}
                                    {/*<div className="progress mb-2" data-category="2" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                        {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                    {/*</div>*/}
                                {/*</td>*/}
                            {/*</tr>*/}
                            {/*}*/}

                            {/*{this.state.sketchFile  &&*/}
                            {/*<tr>*/}
                                {/*<td><b>Эскиз</b></td>*/}
                                {/*<td><a className="text-info pointer" data-category="3" onClick={this.downloadFile.bind(this, this.state.sketchFile.id, 3)}>Скачать</a>*/}
                                    {/*<div className="progress mb-2" data-category="3" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                        {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                    {/*</div>*/}
                                {/*</td>*/}
                            {/*</tr>*/}
                            {/*}*/}

                            </tbody>
                        </table>
                    </div>

                    <div className="col-sm-6">
                        <h5 className="block-title-2 mt-3 mb-3">Решение</h5>

                        {sketch.apz_department_response && !this.state.lastDecisionIsMO &&
                        <div>
                            <table className="table table-bordered table-striped">
                                <tbody>
                                <tr>
                                    <td style={{width: '40%'}}><b>Отдел АПЗ</b></td>
                                    <td><a className="text-info pointer" onClick={this.printApz.bind(this, sketch.id, sketch.project_name)}>Скачать</a></td>
                                </tr>
                                {this.state.reglamentFile &&
                                <tr>
                                    <td style={{width: '40%'}}><b>Регламент</b></td>
                                    <td><a className="text-info pointer" data-category="21" onClick={this.downloadFile.bind(this, this.state.reglamentFile.id, 6)}>Скачать</a>
                                        <div className="progress mb-2" data-category="21" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </td>
                                </tr>}
                                </tbody>
                            </table>
                        </div>
                        }

                        {this.state.lastDecisionIsMO &&
                        <table className="table table-bordered">
                            <tbody>
                            <tr>
                                <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                                <td><a className="text-info pointer" onClick={this.printRegionAnswer.bind(this, sketch.id)}>Скачать</a></td>
                            </tr>
                            </tbody>
                        </table>
                        }{console.log(sketch)}
                        {sketch.urban_response &&
                            <table className="table table-bordered">
                                <tbody>
                                <tr>
                                    <td style={{width: '22%'}}><b>Согласование</b></td>
                                    <td><a className="text-info pointer"
                                           onClick={this.printSketchAnswer.bind(this, sketch.id)}>Скачать</a></td>
                                </tr>
                                </tbody>
                            </table>
                        }








                        {/*<div className="col-sm-6">*/}
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

                        {/*</div>*/}



















                        {this.state.showSignButtons && !this.state.isSigned &&
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
                            {!this.state.loaderHiddenSign &&
                            <div style={{margin: '0 auto'}}>
                                <Loader type="Ball-Triangle" color="#46B3F2" height="70" width="70" />
                            </div>
                            }
                            {this.state.loaderHiddenSign &&
                            <div className="form-group">
                                <button className="btn btn-raised btn-success" type="button"
                                        style={{marginRight: '5px'}} onClick={this.signMessage.bind(this)}>Подписать
                                </button>
                                <button className="btn btn-primary" type="button"
                                        onClick={this.hideSignBtns.bind(this)}>Назад
                                </button>
                            </div>
                            }
                        </div>
                        }

                        <div>
                            {this.state.showButtons && !this.state.isSigned &&
                            <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', marginBottom: '10px'}}>
                                <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.showSignBtns.bind(this)}>Поставить подпись</button>
                                <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnSketchForm">
                                    Вернуть на доработку
                                </button>

                                <div className="modal fade" id="ReturnSketchForm" tabIndex="-1" role="dialog" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Вернуть заявку на доработку</h5>
                                                <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="form-group">
                                                    <label htmlFor="docNumber">Комментарий</label>
                                                    <input type="text" className="form-control" id="docNumber" placeholder="" value={this.state.description} onChange={this.onDescriptionChange} />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.returnSketchForm.bind(this, sketch.id)}>Отправить</button>
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*<button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#DeclineApzForm">
                      Отклонить
                    </button>*/}
                                {/*<div className="modal fade" id="AcceptApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Одобрение Заявки</h5>
                            <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <div className="form-group">
                              <label htmlFor="pname">Наименование объекта</label>
                              <input type="text" readOnly="readonly" className="form-control" id="pname" style={{background:'lightblue'}} value={apz.project_name} />
                            </div>
                            <div className="form-group">
                              <label htmlFor="adress">Адрес объекта</label>
                              <input type="text" readOnly="readonly" className="form-control" id="adress" style={{background:'lightblue'}} value={apz.project_address} />
                            </div>
                            <div className="form-group">
                              <label htmlFor="docNumber">Номер документа</label>
                              <input type="text" className="form-control" id="docNumber" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.saveApzForm.bind(this, apz.id, true, "your form was accepted")}>Сохранить</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal fade" id="DeclineApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
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
                              <label htmlFor="pname">Наименование объекта</label>
                              <input type="text" readOnly="readonly" className="form-control" id="pname" style={{background:'lightblue'}} value={apz.project_name} />
                            </div>
                            <div className="form-group">
                              <label htmlFor="adress">Адрес объекта</label>
                              <input type="text" readOnly="readonly" className="form-control" id="adress" style={{background:'lightblue'}} value={apz.project_address} />
                            </div>
                            <div className="form-group">
                              <label htmlFor="docNumber">Номер документа</label>
                              <input type="text" className="form-control" id="docNumber" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.saveApzForm.bind(this, apz.id, false, 'Откланен главным архитектором')}>Сохранить</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                          </div>
                        </div>
                      </div>
                    </div>*/}
                            </div>
                            }

                            {this.state.showSendButton &&
                            <button type="button" className="btn btn-raised btn-success" onClick={this.acceptDeclineSketchForm.bind(this,sketch.id, this.state.lastDecisionIsMO ? false : true, "")}>Отправить заявителю</button>
                            }
                        </div>
                    </div>

                    <div className="col-sm-12">
                        {this.state.showMap && <ShowMap coordinates={sketch.project_address_coordinates} />}

                        <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                            {this.state.showMapText}
                        </button>
                    </div>

                    {/*{apz.commission &&  apz.commission.apz_water_response &&*/}
                    {/*<div className="modal fade" id="water_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">*/}
                        {/*<div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>*/}
                            {/*<div className="modal-content">*/}
                                {/*<div className="modal-header">*/}
                                    {/*<h5 className="modal-title">Решение водоснабжения</h5>*/}
                                    {/*<button type="button" className="close" data-dismiss="modal" aria-label="Close">*/}
                                        {/*<span aria-hidden="true">&times;</span>*/}
                                    {/*</button>*/}
                                {/*</div>*/}
                                {/*<div className="modal-body">*/}
                                    {/*<table className="table table-bordered table-striped">*/}
                                        {/*{this.state.waterCustomTcFile && apz.commission.apz_water_response.response &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Техническое условие</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="6" onClick={this.downloadFile.bind(this, this.state.waterCustomTcFile.id, 6)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="6" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}

                                        {/*{Boolean(!this.state.waterCustomTcFile) && Boolean(apz.commission.apz_water_response.response) &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Общая потребность (м<sup>3</sup>/сутки)</b></td>*/}
                                            {/*<td>{apz.commission.apz_water_response.gen_water_req}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Хозпитьевые нужды (м<sup>3</sup>/сутки)</b></td>*/}
                                            {/*<td>{apz.commission.apz_water_response.drinking_water}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Производственные нужды (м<sup>3</sup>/сутки)</b></td>*/}
                                            {/*<td>{apz.commission.apz_water_response.prod_water}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Расходы пожаротушения внутренные (л/сек)</b></td>*/}
                                            {/*<td>{apz.commission.apz_water_response.fire_fighting_water_in}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Расходы пожаротушения внешные (л/сек)</b></td>*/}
                                            {/*<td>{apz.commission.apz_water_response.fire_fighting_water_out}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Точка подключения</b></td>*/}
                                            {/*<td>{apz.commission.apz_water_response.connection_point}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Рекомендация</b></td>*/}
                                            {/*<td>{apz.commission.apz_water_response.recommendation}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Номер документа</b></td>*/}
                                            {/*<td>{apz.commission.apz_water_response.doc_number}</td>*/}
                                        {/*</tr>*/}

                                        {/*{this.state.waterResponseFile &&*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Загруженный ТУ</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="7" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id, 7)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="7" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*}*/}

                                        {/*<tr>*/}
                                            {/*<td><b>Сформированный ТУ</b></td>*/}
                                            {/*<td><a className="text-info pointer" onClick={this.printWaterTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                        {/*{!apz.commission.apz_water_response.response && !this.state.waterResponseFile &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Причина отказа</b></td>*/}
                                            {/*<td>{apz.commission.apz_water_response.response_text}</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                        {/*{!apz.commission.apz_water_response.response && this.state.waterResponseFile &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>МО Вода</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="8" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id, 8)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="8" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                    {/*</table>*/}
                                {/*</div>*/}
                                {/*<div className="modal-footer">*/}
                                    {/*<button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*}*/}

                    {/*{apz.commission && apz.commission.apz_heat_response &&*/}
                    {/*<div className="modal fade" id="heat_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">*/}
                        {/*<div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>*/}
                            {/*<div className="modal-content">*/}
                                {/*<div className="modal-header">*/}
                                    {/*<h5 className="modal-title">Решение теплоснабжения</h5>*/}
                                    {/*<button type="button" className="close" data-dismiss="modal" aria-label="Close">*/}
                                        {/*<span aria-hidden="true">&times;</span>*/}
                                    {/*</button>*/}
                                {/*</div>*/}
                                {/*<div className="modal-body">*/}
                                    {/*<table className="table table-bordered table-striped">*/}
                                        {/*{this.state.heatCustomTcFile && apz.commission.apz_heat_response.response &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Техническое условие</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="9" onClick={this.downloadFile.bind(this, this.state.heatCustomTcFile.id, 9)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="9" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}

                                        {/*{Boolean(!this.state.heatCustomTcFile) && Boolean(apz.commission.apz_heat_response.response) &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Источник теплоснабжения</b></td>*/}
                                            {/*<td>{apz.commission.apz_heat_response.resource}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Точка подключения</b></td>*/}
                                            {/*<td>{apz.commission.apz_heat_response.connection_point}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Тепловые нагрузки по договору</b></td>*/}
                                            {/*<td>{apz.commission.apz_heat_response.load_contract_num}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Отопление по договору</b></td>*/}
                                            {/*<td>{apz.commission.apz_heat_response.main_in_contract}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Вентиляция по договору</b></td>*/}
                                            {/*<td>{apz.commission.apz_heat_response.ven_in_contract}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Горячее водоснабжение по договору (ср/ч)</b></td>*/}
                                            {/*<td>{apz.commission.apz_heat_response.water_in_contract}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Горячее водоснабжение по договору (макс/ч)</b></td>*/}
                                            {/*<td>{apz.commission.apz_heat_response.water_in_contract_max}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Дополнительное</b></td>*/}
                                            {/*<td>{apz.commission.apz_heat_response.addition}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Номер документа</b></td>*/}
                                            {/*<td>{apz.commission.apz_heat_response.doc_number}</td>*/}
                                        {/*</tr>*/}

                                        {/*{this.state.heatResponseFile &&*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Загруженный ТУ</b>:</td>*/}
                                            {/*<td><a className="text-info pointer" data-category="10" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id, 10)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="10" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*}*/}

                                        {/*<tr>*/}
                                            {/*<td><b>Сформированный ТУ</b></td>*/}
                                            {/*<td><a className="text-info pointer" onClick={this.printHeatTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                        {/*{!apz.commission.apz_heat_response.response && !this.state.heatResponseFile &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Причина отказа</b></td>*/}
                                            {/*<td>{apz.commission.apz_heat_response.response_text}</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                        {/*{!apz.commission.apz_heat_response.response && this.state.heatResponseFile &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>МО Тепло</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="11" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id, 11)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="11" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                    {/*</table>*/}

                                    {/*{Boolean(!this.state.heatCustomTcFile) && Boolean(apz.commission.apz_heat_response.response) && Boolean(apz.commission.apz_heat_response.blocks) &&*/}
                                    {/*<div>*/}
                                        {/*{apz.commission.apz_heat_response.blocks.map(function(item, index) {*/}
                                            {/*return(*/}
                                                {/*<div key={index}>*/}
                                                    {/*{apz.commission.apz_heat_response.blocks.length > 1 &&*/}
                                                    {/*<h5>Здание №{index + 1}</h5>*/}
                                                    {/*}*/}

                                                    {/*<table className="table table-bordered table-striped">*/}
                                                        {/*<tbody>*/}
                                                        {/*<tr>*/}
                                                            {/*<td style={{width: '50%'}}><b>Отопление (Гкал/ч)</b></td>*/}
                                                            {/*<td>{item.main}</td>*/}
                                                        {/*</tr>*/}
                                                        {/*<tr>*/}
                                                            {/*<td><b>Вентиляция (Гкал/ч)</b></td>*/}
                                                            {/*<td>{item.ven}</td>*/}
                                                        {/*</tr>*/}
                                                        {/*<tr>*/}
                                                            {/*<td><b>Горячее водоснабжение (ср/ч)</b></td>*/}
                                                            {/*<td>{item.water}</td>*/}
                                                        {/*</tr>*/}
                                                        {/*<tr>*/}
                                                            {/*<td><b>Горячее водоснабжение (макс/ч)</b></td>*/}
                                                            {/*<td>{item.water_max}</td>*/}
                                                        {/*</tr>*/}
                                                        {/*</tbody>*/}
                                                    {/*</table>*/}
                                                {/*</div>*/}
                                            {/*);*/}
                                        {/*}.bind(this))}*/}
                                    {/*</div>*/}
                                    {/*}*/}
                                {/*</div>*/}
                                {/*<div className="modal-footer">*/}
                                    {/*<button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*}*/}

                    {/*{apz.commission && apz.commission.apz_electricity_response &&*/}
                    {/*<div className="modal fade" id="electricity_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">*/}
                        {/*<div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>*/}
                            {/*<div className="modal-content">*/}
                                {/*<div className="modal-header">*/}
                                    {/*<h5 className="modal-title">Решение электроснабжения</h5>*/}
                                    {/*<button type="button" className="close" data-dismiss="modal" aria-label="Close">*/}
                                        {/*<span aria-hidden="true">&times;</span>*/}
                                    {/*</button>*/}
                                {/*</div>*/}
                                {/*<div className="modal-body">*/}
                                    {/*<table className="table table-bordered table-striped">*/}
                                        {/*{this.state.electroCustomTcFile && apz.commission.apz_electricity_response.response &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Номер документа</b></td>*/}
                                            {/*<td>{apz.commission.apz_electricity_response.doc_number}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Рекомендация</b></td>*/}
                                            {/*<td>{apz.commission.apz_electricity_response.recommendation}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Техническое условие</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="12" onClick={this.downloadFile.bind(this, this.state.electroCustomTcFile.id, 12)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="12" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}

                                        {/*{Boolean(!this.state.electroCustomTcFile) && Boolean(apz.commission.apz_electricity_response.response) &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Требуемая мощность (кВт)</b></td>*/}
                                            {/*<td>{apz.commission.apz_electricity_response.req_power}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Характер нагрузки (фаза)</b></td>*/}
                                            {/*<td>{apz.commission.apz_electricity_response.phase}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Категория по надежности (кВт)</b></td>*/}
                                            {/*<td>{apz.commission.apz_electricity_response.safe_category}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Точка подключения</b></td>*/}
                                            {/*<td>{apz.commission.apz_electricity_response.connection_point}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Рекомендация</b></td>*/}
                                            {/*<td>{apz.commission.apz_electricity_response.recommendation}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Номер документа</b></td>*/}
                                            {/*<td>{apz.commission.apz_electricity_response.doc_number}</td>*/}
                                        {/*</tr>*/}

                                        {/*{this.state.electroResponseFile &&*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Загруженный ТУ</b>:</td>*/}
                                            {/*<td><a className="text-info pointer" data-category="13" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id, 13)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="13" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*}*/}

                                        {/*<tr>*/}
                                            {/*<td><b>Сформированный ТУ</b></td>*/}
                                            {/*<td><a className="text-info pointer" onClick={this.printElectroTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                        {/*{!apz.commission.apz_electricity_response.response && !this.state.electroResponseFile &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Причина отказа</b></td>*/}
                                            {/*<td>{apz.commission.apz_electricity_response.response_text}</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                        {/*{!apz.commission.apz_electricity_response.response && this.state.electroResponseFile &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>МО Электро</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="14" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id, 14)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="14" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                    {/*</table>*/}
                                {/*</div>*/}
                                {/*<div className="modal-footer">*/}
                                    {/*<button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*}*/}

                    {/*{apz.commission && apz.commission.apz_gas_response &&*/}
                    {/*<div className="modal fade" id="gas_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">*/}
                        {/*<div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>*/}
                            {/*<div className="modal-content">*/}
                                {/*<div className="modal-header">*/}
                                    {/*<h5 className="modal-title">Решение газоснабжения</h5>*/}
                                    {/*<button type="button" className="close" data-dismiss="modal" aria-label="Close">*/}
                                        {/*<span aria-hidden="true">&times;</span>*/}
                                    {/*</button>*/}
                                {/*</div>*/}
                                {/*<div className="modal-body">*/}
                                    {/*<table className="table table-bordered table-striped">*/}
                                        {/*{this.state.gasCustomTcFile && apz.commission.apz_gas_response.response &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Номер документа</b></td>*/}
                                            {/*<td>{apz.commission.apz_gas_response.doc_number}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Предусмотрение</b></td>*/}
                                            {/*<td>{apz.commission.apz_gas_response.reconsideration}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Техническое условие</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="15" onClick={this.downloadFile.bind(this, this.state.gasCustomTcFile.id, 15)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="15" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}

                                        {/*{Boolean(!this.state.gasCustomTcFile) && Boolean(apz.commission.apz_gas_response.response) &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Точка подключения</b></td>*/}
                                            {/*<td>{apz.commission.apz_gas_response.connection_point}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Диаметр газопровода (мм)</b></td>*/}
                                            {/*<td>{apz.commission.apz_gas_response.gas_pipe_diameter}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Предполагаемый объем (м<sup>3</sup>/час)</b></td>*/}
                                            {/*<td>{apz.commission.apz_gas_response.assumed_capacity}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Предусмотрение</b></td>*/}
                                            {/*<td>{apz.commission.apz_gas_response.GasReconsideration}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Номер документа</b></td>*/}
                                            {/*<td>{apz.commission.apz_gas_response.doc_number}</td>*/}
                                        {/*</tr>*/}

                                        {/*{this.state.gasResponseFile &&*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Загруженный ТУ</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="16" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id, 16)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="16" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*}*/}

                                        {/*<tr>*/}
                                            {/*<td><b>Сформированный ТУ</b></td>*/}
                                            {/*<td><a className="text-info pointer" onClick={this.printGasTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                        {/*{!apz.commission.apz_gas_response.response && !this.state.gasResponseFile &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Причина отказа</b></td>*/}
                                            {/*<td>{apz.commission.apz_gas_response.response_text}</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                        {/*{!apz.commission.apz_gas_response.response && this.state.gasResponseFile &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>МО Газ</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="17" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id, 17)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="17" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                    {/*</table>*/}
                                {/*</div>*/}
                                {/*<div className="modal-footer">*/}
                                    {/*<button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*}*/}

                    {/*{apz.commission && apz.commission.apz_phone_response &&*/}
                    {/*<div className="modal fade" id="phone_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">*/}
                        {/*<div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>*/}
                            {/*<div className="modal-content">*/}
                                {/*<div className="modal-header">*/}
                                    {/*<h5 className="modal-title">Решение телефонизации</h5>*/}
                                    {/*<button type="button" className="close" data-dismiss="modal" aria-label="Close">*/}
                                        {/*<span aria-hidden="true">&times;</span>*/}
                                    {/*</button>*/}
                                {/*</div>*/}
                                {/*<div className="modal-body">*/}
                                    {/*<table className="table table-bordered table-striped">*/}
                                        {/*{this.state.phoneCustomTcFile && apz.commission.apz_phone_response.response &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Номер документа</b></td>*/}
                                            {/*<td>{apz.commission.apz_phone_response.doc_number}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Пожелания заказчика (тип оборудования, тип кабеля и др.)</b></td>*/}
                                            {/*<td>{apz.commission.apz_phone_response.client_wishes}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Техническое условие</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="18" onClick={this.downloadFile.bind(this, this.state.phoneCustomTcFile.id, 18)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="18" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}

                                        {/*{Boolean(!this.state.phoneCustomTcFile) && Boolean(apz.commission.apz_phone_response.response) &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</b></td>*/}
                                            {/*<td>{apz.commission.apz_phone_response.service_num}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Телефонная емкость</b></td>*/}
                                            {/*<td>{apz.commission.apz_phone_response.capacity}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Планируемая телефонная канализация</b></td>*/}
                                            {/*<td>{apz.commission.apz_phone_response.sewage}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Пожелания заказчика (тип оборудования, тип кабеля и др.)</b></td>*/}
                                            {/*<td>{apz.commission.apz_phone_response.client_wishes}</td>*/}
                                        {/*</tr>*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Номер документа</b></td>*/}
                                            {/*<td>{apz.commission.apz_phone_response.doc_number}</td>*/}
                                        {/*</tr>*/}

                                        {/*{this.state.phoneResponseFile &&*/}
                                        {/*<tr>*/}
                                            {/*<td><b>Загруженный ТУ</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="19" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id, 19)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="19" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*}*/}

                                        {/*<tr>*/}
                                            {/*<td><b>Сформированный ТУ</b></td>*/}
                                            {/*<td><a className="text-info pointer" onClick={this.printPhoneTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                        {/*{!apz.commission.apz_phone_response.response && !this.state.phoneResponseFile &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>Причина отказа</b></td>*/}
                                            {/*<td>{apz.commission.apz_phone_response.response_text}</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                        {/*{!apz.commission.apz_phone_response.response && this.state.phoneResponseFile &&*/}
                                        {/*<tbody>*/}
                                        {/*<tr>*/}
                                            {/*<td style={{width: '50%'}}><b>МО Газ</b></td>*/}
                                            {/*<td><a className="text-info pointer" data-category="20" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id, 20)}>Скачать</a>*/}
                                                {/*<div className="progress mb-2" data-category="20" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                                    {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                {/*</div>*/}
                                            {/*</td>*/}
                                        {/*</tr>*/}
                                        {/*</tbody>*/}
                                        {/*}*/}
                                    {/*</table>*/}
                                {/*</div>*/}
                                {/*<div className="modal-footer">*/}
                                    {/*<button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*}*/}

                    {sketch.state_history.length > 0 &&
                    <div className="col-sm-12">
                        <h5 className="block-title-2 mb-3 mt-3">Логи</h5>
                        <div className="border px-3 py-2">
                            {sketch.state_history.map(function(state, index) {
                                return(
                                    <div key={index}>
                                        <p className="mb-0">{state.created_at}&emsp;{state.state.name} {state.receiver && '('+state.receiver+')'}</p>
                                    </div>
                                );
                            }.bind(this))}
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
                                         'esri/config',
                                         'dojo/domReady!'
                                     ]}

                                     onReady={({loadedModules: [MapView, LayerList, WebScene, FeatureLayer, TileLayer, Search, WebMap, webMercatorUtils, dom, Graphic, esriConfig], containerNode}) => {
                                         esriConfig.portalUrl = "https://gis.uaig.kz/arcgis";
                                         var map = new WebMap({
                                             portalItem: {
                                                 id: "b5a3c97bd18442c1949ba5aefc4c1835"
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
                                                     //url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                                                     url: "https://gis.uaig.kz/server/rest/services/Map2d/объекты_города/MapServer/20",
                                                     popupTemplate: { // autocasts as new PopupTemplate()
                                                         title: `<table>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Кадастровый номер:</td>  <td class="attrValue">`+"{kad_n}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Код района:</td>  <td class="attrValue">`+"{coder}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Адрес:</td>  <td class="attrValue">`+"{adress}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Целевое назначение</td>  <td class="attrValue">`+"{funk}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Площадь зу:</td>  <td class="attrValue">`+"{s}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Право:</td>  <td class="attrValue">`+"{right_}"+`</td></tr>
                      </table>`
                                                     }
                                                 }),
                                                 searchFields: ["kad_n"],
                                                 displayField: "kad_n",
                                                 exactMatch: false,
                                                 outFields: ["*"],
                                                 name: "Кадастровый номер",
                                                 placeholder: "введите кадастровый номер",
                                                 maxResults: 6,
                                                 maxSuggestions: 6,
                                                 enableSuggestions: true,
                                                 minCharacters: 0
                                             },
                                                 {
                                                     featureLayer: new FeatureLayer({
                                                         url: "https://gis.uaig.kz/server/rest/services/Map2d/Базовая_карта_MIL1/MapServer/16",
                                                         popupTemplate: {
                                                             title: `<table>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);width:100%"><td class="attrName">Адресный массив:</td>  <td class="attrValue">`+"{id_adr_massive}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Количество этажей:</td>  <td class="attrValue">`+"{floor}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Год постройки:</td>  <td class="attrValue">`+"{year_of_foundation}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Общая площадь:</td>  <td class="attrValue">`+"{obsch_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Объем здания, м3:</td>  <td class="attrValue">`+"{volume_build}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Площадь жил. помещения:</td>  <td class="attrValue">`+"{zhil_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Площадь застройки, м2:</td>  <td class="attrValue">`+"{zastr_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Наименование первичной улицы:</td>  <td class="attrValue">`+"{street_name_1}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Основной номер дома:</td>  <td class="attrValue">`+"{number_1}"+`</td></tr>
                      </table>`
                                                         }
                                                     }),
                                                     searchFields: ["street_name_1"],
                                                     displayField: "street_name_1",
                                                     exactMatch: false,
                                                     outFields: ["*"],
                                                     name: "Здания и сооружения",
                                                     placeholder: "введите адрес",
                                                     maxResults: 6,
                                                     maxSuggestions: 6,
                                                     enableSuggestions: true,
                                                     minCharacters: 0
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
