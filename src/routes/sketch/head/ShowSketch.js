import React from 'react';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import { Switch } from 'react-router-dom';
import ShowMap from '../components/ShowMap';
import EcpSign from '../../apz/components/EcpSign';
import Logs from "../../apz/components/Logs";
import AllInfo from '../components/AllInfo';
import Answers from '../components/Answers';

export default class ShowSketch extends React.Component {
    constructor(props) {
        super(props);

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
                this.setState({engineerReturnedState: data.state_history.filter(function(obj) { return obj.state_id === 6})[0]});
                this.setState({apzReturnedState: data.state_history.filter(function(obj) { return obj.state_id === 17})[0]});

                for(var data_index = data.state_history.length-1; data_index >= 0; data_index--){
                    switch (data.state_history[data_index].state_id) {
                        case 2:
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

    ecpSignSuccess(){
      this.setState({ isSigned: true });
      this.setState({ showSendButton: true });
    }

    render() {
        return (
            <div>
                {this.state.loaderHidden &&
                <div className="row">


                    <AllInfo toggleMap={this.toggleMap.bind(this, true)} sketch={this.state.sketch} personalIdFile={this.state.personalIdFile}
                      sketchFile={this.state.sketchFile} sketchFilePDF={this.state.sketchFilePDF} apzFile={this.state.apzFile}/>

                    <div className="col-sm-12">
                        {this.state.showMap && <ShowMap mapId={"b5a3c97bd18442c1949ba5aefc4c1835"} coordinates={this.state.sketch.project_address_coordinates} />}

                        <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                            {this.state.showMapText}
                        </button>
                    </div>

                    <Answers engineerReturnedState={this.state.engineerReturnedState} apzReturnedState={this.state.apzReturnedState}
                    sketch_id={this.state.sketch.id} urban_response={this.state.sketch.urban_response} lastDecisionIsMO = {this.state.lastDecisionIsMO} />

                    <div className="col-sm-6" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                        {this.state.showSignButtons && !this.state.isSigned &&
                          <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="head" id={this.state.sketch.id} serviceName='sketch'/>
                        }

                        <div>
                            {this.state.showButtons && !this.state.isSigned &&
                            <div>
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
                                                <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.returnSketchForm.bind(this, this.state.sketch.id)}>Отправить</button>
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }

                            {this.state.showSendButton &&
                            <button type="button" className="btn btn-raised btn-success" onClick={this.acceptDeclineSketchForm.bind(this, this.state.sketch.id, this.state.lastDecisionIsMO ? false : true, "")}>Отправить заявителю</button>
                            }
                        </div>
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
