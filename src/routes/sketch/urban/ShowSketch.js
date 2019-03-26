import React from 'react';
import {Switch} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import ReactQuill from 'react-quill';
import ShowMap from './ShowMap';
import EcpSign from '../../apz/components/EcpSign';
import Logs from "../../apz/components/Logs";
import AllInfo from '../components/AllInfo';
import Answers from '../components/Answers';

export default class ShowSketch extends React.Component {
    constructor(props) {
        super(props);

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
            sketchFilePDF: false,
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
            isSent:false
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
        // this.getSketchInfo();
    }

    componentWillMount() {
        if(!sessionStorage.getItem('tokenInfo')){
            let fullLoc = window.location.href.split('/');
            this.props.history.replace({pathname: "/panel/common/login", state:{url_apz_id: fullLoc[fullLoc.length-1]}});
        }else {
            this.getSketchInfo();
            this.getHeads();
        }
        this.getSketchInfo();

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
                this.setState({sketchFilePDF: sketch.files.filter(function(obj) { return obj.category_id === 40 })[0]});
                console.log(this.state.sketchFilePDF);
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

    ecpSignSuccess(){
        this.setState({ xmlFile: true });
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
                    this.setState({ isSent: true});
                    console.log(this.state.isSent);

                } else {
                    // this.setState({ isSent: false});

                    alert("Заявление отклонено!");
                    this.setState({ showButtons: false });
                    console.log(this.state.isSent);
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
        return (
            <div>
                {this.state.loaderHidden &&
                <div>

                <AllInfo toggleMap={this.toggleMap.bind(this, true)} sketch={this.state.sketch} personalIdFile={this.state.personalIdFile}
                  sketchFile={this.state.sketchFile} sketchFilePDF={this.state.sketchFilePDF} apzFile={this.state.apzFile}/>
                  { (this.state.isSent || this.state.sketch.urban_response )&&
                    <Answers  isSent={this.state.isSent} sketch_id={this.state.sketch.id} urban_response={this.state.sketch.urban_response} lastDecisionIsMO = {this.state.lastDecisionIsMO} />
                  }


                    {this.state.showMap && <ShowMap coordinates={this.state.sketch.project_address_coordinates} />}

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
                    {this.state.sketch.status_id == 1 &&
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
                                <td><a className="text-info pointer" onClick={this.printRegionAnswer.bind(this, this.state.sketch.id)}>Скачать</a></td>
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
                    {(!this.state.xmlFile && !this.state.isSent && this.state.response ) &&
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
                            {this.state.sketch.status_id == 3 && !this.state.xmlFile &&
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
                                                <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="region" id={this.state.sketch.id} serviceName='sketch'/>
                                                :
                                                <div>
                                                    <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineSketchForm.bind(this, this.state.sketch.id, true, "your form was accepted","")}>Отправить инженеру</button>
                                                    <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineSketchForm.bind(this, this.state.sketch.id, true, "your form was accepted", "chief")}>
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
                                    <button type="button" className="btn btn-raised btn-success" style={{marginRight:'5px'}} onClick={this.acceptDeclineSketchForm.bind(this, this.state.sketch.id, false, this.state.comment,"",this.state.docNumber)}>Отправить</button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                  </div>
                                </div>
                              </div>
                            </div>

                        </div>
                    </div>

                    <Logs state_history={this.state.sketch.state_history} />

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
