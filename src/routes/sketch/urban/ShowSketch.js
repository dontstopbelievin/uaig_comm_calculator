import React from 'react';
import {Switch} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import ReactQuill from 'react-quill';
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
            templates: [],
            theme: '',
            apz_head_id: '',
            apz_heads_id: [],
            showMap: false,
            showButtons: true,
            comment: '',
            docNumber: "",
            showMapText: 'Показать карту',
            loaderHidden: false,
            personalIdFile: false,
            sketchFile: false,
            apzFile: false,
            apzReturnedState: false,
            sketchReturnedState: false,
            needSign: false,
            response: true,
            storageAlias: "PKCS12",
            backFromHead: false,
            engineerSign: false,
            xmlFile: false,
            loaderHiddenSign:true,
            isSended:false
        };

        this.onCommentChange = this.onCommentChange.bind(this);
        this.onDocNumberChange = this.onDocNumberChange.bind(this);
    }
    onDocNumberChange(e) {
        this.setState({ docNumber: e.target.value });
    }


    onCommentChange(value) {
        this.setState({ comment: value });
    }

    onTemplateListChange(e) {
      if(e.target.value != ''){
        var template = this.state.templates.find(template => template.id == e.target.value);
        this.setState({ comment: template.text });
        this.setState({ theme: template.title });
      }else{
        this.setState({ theme: '' });
      }
    }

    onThemeChange(e) {
      this.setState({ theme: e.target.value });
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
                this.setState({docNumber: sketch.docNumber});
                this.setState({personalIdFile: sketch.files.filter(function(obj) { return obj.category_id === 3 })[0]});
                this.setState({sketchFile: sketch.files.filter(function(obj) { return obj.category_id === 1 })[0]});
                this.setState({apzFile: sketch.files.filter(function(obj) { return obj.category_id === 2 })[0]});
                // this.setState({docNumber: sketch.docNumber});
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
                this.setState({engineerReturnedState: sketch.state_history.filter(function(obj) { return obj.state_id === 6})[0]});
                this.setState({apzReturnedState: sketch.state_history.filter(function(obj) { return obj.state_id === 17})[0]});
                this.setState({needSign: sketch.state_history.filter(function(obj) { return obj.state_id === 1 && obj.comment === null })[0]});
                this.setState({engineerSign: sketch.files.filter(function(obj) { return obj.category_id === 28 })[0]});
                if(sketch.apz_head_id){this.setState({apz_head_id: sketch.apz_head_id});}

                if (sketch.status_id === 3) {
                    this.setState({showButtons: true});
                }

                if (sketch.state_history.filter(function(obj) { return obj.state_id === 1 || obj.state_id ===10})[0] != null) {
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
            var data = {xml: signedXml,
                        apz_head_id: this.state.apz_head_id,
                        docNumber:this.state.docNumber}

            console.log("SIGNED XML ------> \n", signedXml);

            var xhr = new XMLHttpRequest();
            xhr.open("post", window.url + 'api/sketch/region/save_xml/' + this.state.sketch.id, true);
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            xhr.onload = function() {
                if (xhr.status === 200) {
                    console.log(this.state.xmlFile);
                    this.setState({ xmlFile: true });
                    console.log(this.state.xmlFile);
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

    sendToApz(publish) {
        if(publish) {
            this.setState({needSign: true});

            var requiredFields = {
                docNumber: 'номер документа'
            }

            var errors = 0;
            var err_msgs = "";
            Object.keys(requiredFields).forEach(function (key) {
                if (!this.state[key]) {
                    err_msgs += 'Заполните поле ' + requiredFields[key] + '\n';
                    errors++;
                    return false;
                }
            }.bind(this));

            if (errors > 0) {
                alert(err_msgs);
                return false;
            }
        }
    }

    acceptDeclineSketchForm(sketchId, status, comment, direct) {
        //console.log(this.state.apz_head_id);
        var token = sessionStorage.getItem('tokenInfo');

        var registerData = {
            response: status,
            message: comment,
            apz_head_id: this.state.apz_head_id,
            direct: direct.length > 0 ? direct : 'engineer',
            docNumber: this.state.docNumber,
            theme: this.state.theme
        };

        if (!status && (comment.trim() == '' || this.state.theme.trim() == '')) {
            alert('Для отказа напишите тему и причину отказа.');
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
                    // this.setState({ isSended: true});

                } else {
                    this.setState({ isSended: true});

                    alert("Заявление отклонено!");
                    this.setState({ showButtons: false });
                    console.log(this.state.isSended);
                }
            } else if (xhr.status === 401) {
                sessionStorage.clear();
                alert("Время сессии истекло. Пожалуйста войдите заново!");
                this.props.history.replace("/login");
            } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
                alert(JSON.parse(xhr.responseText).message);
            }

            if (!status) {
                $('#ReturnApzForm').modal('hide');
            }
        }.bind(this);
        xhr.send(data);
    }

    hideSignBtns() {
        this.setState({needSign: false });
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
                        Комментарий главного архитектора: {this.state.apzReturnedState.comment}
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
                    {(!this.state.xmlFile && !this.state.isSended && this.state.response ) &&
                        <div style={{margin: 'auto', marginTop: '20px', display: 'table', width: '30%'}}>
                            <div className="form-group">
                                <label>Номер документа</label>
                                <input type="text" className="form-control" placeholder="" value={this.state.docNumber}
                                       onChange={this.onDocNumberChange}/>
                            </div>
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
                                    <button className="btn btn-raised btn-danger" data-toggle="modal"  data-target="#accDecApzForm">
                                        Отклонить
                                    </button>
                                </div>
                                :
                                <div>
                                    {!this.state.needSign ?
                                        <div style={{margin: 'auto', display: 'table'}}>{console.log(this.state.engineerReturnedState)}
                                            <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} disabled={!this.state.docNumber} onClick={this.sendToApz.bind(this,true)}>Одобрить</button>
                                            <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm">
                                                Отклонить
                                            </button>
                                        </div>
                                        :
                                        <div>
                                            { !this.state.xmlFile  ?
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
                                                    <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineSketchForm.bind(this, sketch.id, true, "your form was accepted","")}>Отправить инженеру</button>
                                                    <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineSketchForm.bind(this, sketch.id, true, "your form was accepted", "chief")}>
                                                        Отправить главному архитектору
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            }

                            <div className="modal fade" id="ReturnApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
                              <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title">Мотивированный отказ</h5>
                                    <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                    {this.state.templates && this.state.templates.length > 0 &&
                                      <div className="form-group">
                                        <select className="form-control" defaultValue="" id="templateList" onChange={this.onTemplateListChange.bind(this)}>
                                          <option value="">Выберите шаблон</option>
                                          {this.state.templates.map(function(template, index) {
                                            return(
                                              <option key={index} value={template.id}>{template.title}</option>
                                              );
                                            })
                                          }
                                        </select>
                                      </div>
                                    }
                                    <div style={{paddingLeft:'5px', fontSize: '18px'}}>
                                      <b>Выберите главного архитектора:</b>
                                      <select id="gas_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.apz_head_id} onChange={this.handleHeadIDChange.bind(this)}>
                                        {this.state.apz_heads_id}
                                      </select>
                                    </div>
                                    <div className="form-group">
                                      <label>Тема(краткое описание)</label>
                                      <div>
                                        <input value={this.state.theme} onChange={this.onThemeChange.bind(this)} />
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <label>Причина отказа</label>
                                      <ReactQuill value={this.state.comment} onChange={this.onCommentChange} />
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                    <button type="button" className="btn btn-raised btn-success" style={{marginRight:'5px'}} onClick={this.acceptDeclineSketchForm.bind(this, sketch.id, false, this.state.comment,"",this.state.docNumber)}>Отправить</button>
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
