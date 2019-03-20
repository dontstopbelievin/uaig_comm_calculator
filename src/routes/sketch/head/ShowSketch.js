import React from 'react';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import { Switch } from 'react-router-dom';
import ShowMap from './ShowMap';
import EcpSign from '../../apz/components/EcpSign';
import Logs from "../../apz/components/Logs";

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
            xmlFile: false,
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




                if (data.status_id === 6 && !data.sketch_head_response) {
                    this.setState({showButtons: true});
                }

                if (data.status_id === 6 && data.sketch_head_response && data.sketch_head_response.files.filter(function(obj) { return obj.category_id === 19})[0] == null) {
                    this.setState({showButtons: true});
                }

                if (data.sketch_head_response && data.sketch_head_response && data.sketch_head_response.files.filter(function(obj) { return obj.category_id === 19})[0] != null) {
                    this.setState({isSigned: true});
                    this.setState({xmlFile: data.sketch_head_response.files.filter(function(obj) { return obj.category_id === 19})[0]});
                    this.setState({headResponse: data.sketch_head_response.response});
                }

                if (data.sketch_head_response && data.sketch_head_response.files.filter(function(obj) { return obj.category_id === 19})[0] != null && data.status_id === 6) {
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
        xhr.open("post", window.url + "api/sketch/head/saveHead/" + sketchId, true);
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

    ecpSignSuccess(){
      this.setState({ isSigned: true });
      this.setState({ showSendButton: true });
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
                            </tbody>
                        </table>
                    </div>

                    <div className="col-sm-6">
                        <h5 className="block-title-2 mt-3 mb-3">Решение</h5>

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

                        {this.state.showSignButtons && !this.state.isSigned &&
                          <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="head" id={this.state.sketch.id} serviceName='sketch'/>
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

                    <div className="col-sm-12">
                      <Logs state_history={this.state.sketch.state_history} />
                    </div>

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
