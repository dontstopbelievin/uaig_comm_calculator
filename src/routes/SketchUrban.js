import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import saveAs from 'file-saver';
import CommissionAnswersList from '../components/CommissionAnswersList';

export default class SketchUrban extends React.Component {
    render() {
        return (
            <div className="content container body-content">
                <div>
                    <div>
                        <Switch>
                            <Route path="/panel/urban/sketch/status/:status/:page" exact render={(props) =>(
                                <AllSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
                            )} />
                            <Route path="/panel/urban/sketch/show/:id" exact render={(props) =>(
                                <ShowSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
                            )} />
                            <Redirect from="/panel/urban/sketch" to="/panel/urban/sketch/status/active/1" />
                        </Switch>
                    </div>
                </div>
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
            templates: [],
            showMap: false,
            showButtons: true,
            description: '',
            showMapText: 'Показать карту',
            loaderHidden: false,
            personalIdFile: false,
            sketchFile: false,
            apzFile: false,
            engineerReturnedState: false,
            sketchReturnedState: false,
            needSign: false,
            response: true,
            storageAlias: "PKCS12",
            //acceptSign: false,
            backFromHead: false,
            apz_head_id: '',
            apz_heads_id: [],
            engineerSign: false,
            xmlFile: false,
            loaderHiddenSign:true,


        };

        this.onDescriptionChange = this.onDescriptionChange.bind(this);
    }

    onDescriptionChange(value) {
        this.setState({ description: value });
    }

    onTemplateListChange(e) {
        if(e.target.value == ''){
          this.setState({ description: '' });
        }else{
          var template = this.state.templates.find(template => template.id == e.target.value);
          this.setState({ description: template.text });
        }
    }
    componentDidMount() {
        this.props.breadCrumbs();
    }
    componentWillMount() {
        if(!sessionStorage.getItem('tokenInfo')){
            let fullLoc = window.location.href.split('/');
            this.props.history.replace({pathname: "/panel/common/login", state:{url_apz_id: fullLoc[fullLoc.length-1]}});
        }else {
            this.getSketchInfo();
            this.getHeads();
        }
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
                this.setState({apz_heads_id: select_directors});
                if(this.state.apz_head_id == "" || this.state.apz_head_id == " "){
                    this.setState({apz_head_id: data[0].user_id});
                }
            }
        }.bind(this);
        xhr.send();
    }

    getSketchInfo() {
        var id = this.props.match.params.id;
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/sketch/region/detail/" + id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                var sketch = data.sketch;
                this.setState({templates: data.templates});
                this.setState({sketch: sketch});
                this.setState({personalIdFile: sketch.files.filter(function(obj) { return obj.category_id === 3 })[0]});
                this.setState({sketchFile: sketch.files.filter(function(obj) { return obj.category_id === 1 })[0]});
                this.setState({apzFile: sketch.files.filter(function(obj) { return obj.category_id === 2 })[0]});
                // this.setState({additionalFile: apz.files.filter(function(obj) { return obj.category_id === 27 })[0]});
                // this.setState({reglamentFile: apz.files.filter(function(obj) { return obj.category_id === 29 })[0]});
                this.setState({showButtons: false});
                for(var data_index = sketch.state_history.length-1; data_index >= 0; data_index--){
                    switch (sketch.state_history[data_index].state_id) {
                        case 17:
                            this.setState({backFromHead: sketch.state_history[data_index]});
                            break;
                        default:
                            continue;
                    }
                    break;
                }
                //this.setState({engineerReturnedState: sketch.state_history.filter(function(obj) { return obj.state_id === 1 && obj.sender == 'engineer'})[0]});
                //this.setState({apzReturnedState: sketch.state_history.filter(function(obj) { return obj.state_id === 1 && obj.sender == 'apz'})[0]});
                this.setState({needSign: sketch.state_history.filter(function(obj) { return obj.state_id === 1 && obj.comment === null })[0]});
                this.setState({engineerSign: sketch.files.filter(function(obj) { return obj.category_id === 28 })[0]});
                if(sketch.apz_head_id){this.setState({apz_head_id: sketch.apz_head_id});}

                if (sketch.status_id === 3) {
                    this.setState({showButtons: true});
                }

                if (sketch.state_history.filter(function(obj) { return obj.state_id === 1 && obj.sender != null })[0] != null) {
                    this.setState({response: false});
                }

                this.setState({loaderHidden: true});
                // BE CAREFUL OF category_id should be xml регионального архитектора
                this.setState({xmlFile: sketch.files.filter(function(obj) { return obj.category_id === 21})[0]});
                this.setState({needSign: sketch.files.filter(function(obj) { return obj.category_id === 21})[0]});
                // if(sketch.state_history.filter(function(obj) { return obj.state_id === 33 })[0] != null){
                //     this.setState({needSign: false});
                // }
                //use instead new columns from table
                if(!sketch.urban_sign_returned){
                    this.setState({xmlFile: false});
                }
            } else if (xhr.status === 401) {
                sessionStorage.clear();
                alert("Время сессии истекло. Пожалуйста войдите заново!");
                this.props.history.replace("/login");
            }
        }.bind(this);
        xhr.send();
    }

    handleHeadIDChange(event){
        this.setState({apz_head_id: event.target.value});
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
        this.setState({loaderHiddenSign: false});
        let password = document.getElementById("inpPassword").value;
        let path = document.getElementById("storagePath").value;
        let keyType = "SIGN";
        //console.log(path);
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
        //console.log(result);
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
        xhr.open("get", window.url + 'api/sketch/region/get_xml/' + this.state.sketch.id, true);
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
            xhr.open("post", window.url + 'api/sketch/region/save_xml/' + this.state.sketch.id, true);
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            xhr.onload = function() {
                if (xhr.status === 200) {
                    this.setState({ xmlFile: true });
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

    sendToApz() {
        this.setState({needSign: true });
    }

    acceptDeclineSketchForm(sketchId, status, comment, direct) {
        console.log(this.state.apz_head_id);
        var token = sessionStorage.getItem('tokenInfo');

        var registerData = {
            response: status,
            message: comment,
            apz_head_id: this.state.apz_head_id,
            direct: direct.length > 0 ? direct : 'engineer'
        };

        if (!status && !comment) {
            alert('Заполните причину отказа');
            return false;
        }

        var data = JSON.stringify(registerData);

        var xhr = new XMLHttpRequest();
        xhr.open("post", window.url + "api/sketch/region/status/" + sketchId, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status === 200) {
                //var data = JSON.parse(xhr.responseText);

                if(status === true) {
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
            }

            if (!status) {
                $('#accDecApzForm').modal('hide');
            }
        }.bind(this);
        xhr.send(data);
    }

    hideSignBtns() {
        this.setState({needSign: false });
    }

    /*sendToApzAccept(){
      this.setState({acceptSign: true });
    }*/

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

    printRegionAnswer(sketchId) {
        var token = sessionStorage.getItem('tokenInfo');
        if (token) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", window.url + "api/print/region/sketch/" + sketchId, true);
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

    render() {
        var sketch = this.state.sketch;

        return (
            <div>
                {this.state.loaderHidden &&
                <div>
                    <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

                    <table className="table table-bordered table-striped">
                        <tbody>
                        <tr>
                            <td style={{width: '22%'}}><b>ИД заявки</b></td>
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

                        {this.state.sketchFile &&
                        <tr>
                            <td><b>Эскизный проект</b></td>
                            <td><a className="text-info pointer" data-category="2" onClick={this.downloadFile.bind(this, this.state.sketchFile.id, 2)}>Скачать</a>
                                <div className="progress mb-2" data-category="2" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </td>
                        </tr>
                        }

                        {this.state.apzFile &&
                        <tr>
                            <td><b>АПЗ</b></td>
                            <td><a className="text-info pointer" data-category="3" onClick={this.downloadFile.bind(this, this.state.apzFile.id, 3)}>Скачать</a>
                                <div className="progress mb-2" data-category="3" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </td>
                        </tr>
                        }
                        </tbody>
                    </table>

                    <h5 className="block-title-2 mb-3">Показатели</h5>

                    <table className="table table-bordered table-striped">
                        <tbody>
                        {sketch &&
                        <tr>
                            <td style={{width: '40%'}}><b>Показатели по ген плану</b></td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#gen_modal">Просмотр</a></td>
                        </tr>
                        }

                        {sketch &&
                        <tr>
                            <td style={{width: '40%'}}><b>Показатели по проекту</b></td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#project_modal">Просмотр</a></td>
                        </tr>
                        }

                        {sketch &&
                        <tr>
                            <td style={{width: '40%'}}><b>Архитектурные решения по отделки фасада здания и сооружения</b></td>
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
                    {sketch.commission && (Object.keys(sketch.commission).length > 0) &&
                    <div>
                        <h5 className="block-title-2 mb-3">Ответы от служб</h5>
                        <CommissionAnswersList sketch={sketch} />
                    </div>
                    }

                    {sketch.apz_department_response &&
                    <div>
                        <h5 className="block-title-2 mb-3">Ответ от АПЗ отдела</h5>
                        <table className="table table-bordered table-striped">
                            <tbody>
                            <tr>
                                <td style={{width: '22%'}}><b>Сформированный АПЗ</b></td>
                                <td><a className="text-info pointer" onClick={this.printSketch.bind(this, sketch.id, sketch.project_name)}>Скачать</a></td>
                            </tr>
                            {this.state.reglamentFile &&
                            <tr>
                                <td style={{width: '22%'}}><b>Регламент</b></td>
                                <td><a className="text-info pointer" data-category="6" onClick={this.downloadFile.bind(this, this.state.reglamentFile.id, 6)}>Скачать</a>
                                    <div className="progress mb-2" data-category="6" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </td>
                            </tr>}
                            </tbody>
                        </table>
                    </div>
                    }

                    {this.state.showMap && <ShowMap coordinates={sketch.project_address_coordinates} />}

                    <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                        {this.state.showMapText}
                    </button>

                    {this.state.engineerReturnedState &&
                    <div className="alert alert-danger">
                        Комментарий инженера: {this.state.engineerReturnedState.comment}
                    </div>
                    }
                    {this.state.apzReturnedState &&
                    <div className="alert alert-danger">
                        Комментарий апз отдела: {this.state.apzReturnedState.comment}
                    </div>
                    }
                    {sketch.status_id == 1 &&
                    <table className="table table-bordered">
                        <tbody>
                        <tr>
                            <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                            {this.state.headResponseFile ?
                                <td><a className="text-info pointer" data-category="6" onClick={this.downloadFile.bind(this, this.state.headResponseFile.id, 6)}>Скачать</a>
                                    <div className="progress mb-2" data-category="6" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </td>
                                :
                                <td><a className="text-info pointer" onClick={this.printRegionAnswer.bind(this, sketch.id)}>Скачать</a></td>
                            }
                        </tr>
                        </tbody>
                    </table>
                    }
                    {this.state.backFromHead &&
                    <div className="alert alert-danger">
                        Комментарий главного архитектора: {this.state.backFromHead.comment}
                    </div>
                    }
                    <div className={this.state.showButtons ? '' : 'invisible'}>
                        <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                            {sketch.status_id == 3 && !this.state.xmlFile &&
                            <div style={{paddingLeft:'5px', fontSize: '18px', textAlign:'center'}}>
                                <b>Выберите главного архитектора:</b>
                                <select id="gas_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.apz_head_id} onChange={this.handleHeadIDChange.bind(this)}>
                                    {this.state.apz_heads_id}
                                </select>
                            </div>
                            }
                            {!this.state.response ?
                                <div className="text-center">
                                    <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} disabled="disabled">Одобрить</button>
                                    <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#accDecApzForm">
                                        Отклонить
                                    </button>
                                </div>
                                :
                                <div>
                                    {!this.state.needSign ?
                                        <div style={{margin: 'auto', display: 'table'}}>{console.log(this.state.engineerReturnedState)}
                                            <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.sendToApz.bind(this)}>Одобрить</button>
                                            <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#accDecApzForm">
                                                Отклонить
                                            </button>
                                        </div>
                                        :
                                        <div>
                                            { !this.state.xmlFile ?
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
                                                                onClick={this.hideSignBtns.bind(this)}>Назад
                                                        </button>
                                                    </div>
                                                    }
                                                </div>
                                                :
                                                <div>
                                                    <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineSketchForm.bind(this, sketch.id, true, "your form was accepted")}>Отправить инженеру</button>
                                                    <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineSketchForm.bind(this, sketch.id, true, "your form was accepted", "chief")}>
                                                        Отправить главному архитектору
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            }

                            <div className="modal fade" id="accDecApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
                                <div className="modal-dialog modal-lg" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Причина отклонения</h5>
                                            <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            {this.state.templates.length > 0 &&
                                            <div className="form-group">
                                                <select className="form-control" defaultValue="" id="templateList" onChange={this.onTemplateListChange.bind(this)}>
                                                    <option value="">Выберите шаблон</option>
                                                    {this.state.templates.map(function(template, index) {
                                                        return(
                                                            <option key={index} value={template.id}>{template.title}</option>
                                                        );
                                                    }.bind(this))
                                                    }
                                                </select>
                                            </div>
                                            }

                                            <div className="form-group">
                                                <ReactQuill value={this.state.description} onChange={this.onDescriptionChange} />
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-raised btn-success" style={{marginRight:'5px'}} onClick={this.acceptDeclineSketchForm.bind(this, sketch.id, false, this.state.description)}>Отправить</button>
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {sketch.state_history.length > 0 &&
                      <div>
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
                        <button className="btn btn-outline-secondary pull-right" onClick={this.routeChange.bind(this)}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
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
    routeChange(){
        this.props.history.goBack();
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
                                                 id: "0e8ae8f43ea94d358673e749f9a5e147"
                                             }
                                         });

                                         /*
                                           var flRedLines = new FeatureLayer({
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
                                           map.add(flGosAkts);
                                         */

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

class AllSketch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaderHidden: false,
            response: null,
            pageNumbers: [],
            regions:[],
            current_region: ""
        };

    }

    componentDidMount() {
        this.props.breadCrumbs();
        this.getSketches();
    }

    componentWillMount() {
        var data = JSON.parse(sessionStorage.getItem('userRoles'));
        var select_regions = [];
        for (var i = 2; i < data.length; i++) {
            select_regions.push(<option value={data[i]}> {data[i]} </option>);
        }
        this.setState({regions: select_regions});
        this.setState({current_region: data[2]});
    }

    componentWillReceiveProps(nextProps) {
        this.getSketches(nextProps.match.params.status, nextProps.match.params.page);
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
        xhr.open("get", window.url + "api/sketch/region/all/" + status + '/' + this.state.current_region + '?page=' + page, true);
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

    handleRegionChange(event){
        this.setState({current_region: event.target.value}, function stateUpdateComplete() {
            this.getSketches();
        }.bind(this));
    }

    render() {
        var status = this.props.match.params.status;
        var page = this.props.match.params.page;
        var sketches = this.state.response ? this.state.response.data : [];

        return (
            <div>
                {this.state.loaderHidden &&
                <div>
                    <div>
                        <h4 className="mb-0">Эскизные проекты</h4>
                    </div>
                    <div style={{fontSize: '18px', margin: '10px 0px'}}>
                        <b>Выберите регион:</b>
                        <select style={{padding: '0px 4px', margin: '5px'}} value={this.state.current_region} onChange={this.handleRegionChange.bind(this)}>
                            {this.state.regions}
                        </select>
                    </div>
                    <ul className="nav nav-tabs mb-2 pull-right">
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/urban/sketch/status/active/1" replace>Активные</NavLink></li>
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/urban/sketch/status/accepted/1" replace>Принятые</NavLink></li>
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/urban/sketch/status/declined/1" replace>Отказанные</NavLink></li>
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
                                        <Link className="btn btn-outline-info" to={'/panel/urban/sketch/show/' + sketch.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
                                <Link className="page-link" to={'/panel/urban/sketch/status/' + status + '/1'}>В начало</Link>
                            </li>

                            {this.state.pageNumbers.map(function(num, index) {
                                return(
                                    <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                                        <Link className="page-link" to={'/panel/urban/sketch/status/' + status + '/' + num}>{num}</Link>
                                    </li>
                                );
                            }.bind(this))
                            }
                            <li className="page-item">
                                <Link className="page-link" to={'/panel/urban/sketch/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
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
