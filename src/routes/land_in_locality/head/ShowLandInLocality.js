import React from 'react';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import ShowMap from "../components/ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Answers from "../components/Answers";
import Logs from "../components/Logs";

export default class ShowLandInLocality extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            landinlocality: [],
            showMap: false,
            showButtons: false,
            showSendButton: false,
            showSignButtons: false,
            file: false,
            description: '',
            responseFile: null,
            callSaveFromSend: false,
            personalIdFile: false,
            landLocationSchemeFile: false,
            actChooseLandFile: false,
            paymentFile: false,
            rightLandInLocalityFile: false,
            showMapText: 'Показать карту',
            headResponse: null,
            response: false,
            loaderHidden: false,
            xmlFile: false,
            lastDecisionIsMO: false,
            isSigned: false
        };

        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }
    componentDidMount() {
        this.props.breadCrumbs();
    }

    onDescriptionChange(e) {
        this.setState({ description: e.target.value });
    }

    onFileChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    componentWillMount() {
        this.getApplications();
    }

    getApplications() {
        var id = this.props.match.params.id;
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/land_in_locality/head/detail/" + id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                var hasDeclined = data.state_history.filter(function(obj) {
                    return obj.state_id === 3
                });

                this.setState({landinlocality: data});
                this.setState({showButtons: false});
                this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
                this.setState({landLocationSchemeFile: data.files.filter(function(obj) { return obj.category_id === 42 })[0]});
                this.setState({actChooseLandFile: data.files.filter(function(obj) { return obj.category_id === 43 })[0]});
                this.setState({paymentFile: data.files.filter(function(obj) { return obj.category_id === 44 })[0]});
                this.setState({rightLandInLocalityFile: data.files.filter(function(obj) { return obj.category_id === 45 })[0]});

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

                /*if (data.land_in_locality_head_responses && data.land_in_locality_head_responses.files) {
                  this.setState({headResponseFile: data.land_in_locality_head_responses.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
                }*/

                if (data.status_id === 4 && !data.land_in_locality_head_responses) {
                    this.setState({showButtons: true});
                }

                if (data.status_id === 4 && data.land_in_locality_head_responses && data.files.filter(function(obj) { return obj.category_id === 19})[0] == null) {
                    this.setState({showButtons: true});
                }

                if (data.land_in_locality_head_responses && data.land_in_locality_head_responses && data.files.filter(function(obj) { return obj.category_id === 19})[0] != null) {
                    this.setState({isSigned: true});
                    this.setState({xmlFile: data.files.filter(function(obj) { return obj.category_id === 19})[0]});
                    this.setState({headResponse: data.land_in_locality_head_responses.response});
                }

                if (data.land_in_locality_head_responses && data.files.filter(function(obj) { return obj.category_id === 19})[0] != null && data.status_id === 4) {
                    this.setState({showSendButton: true});
                }

                /*if (!this.state.xmlFile && this.state.headResponseFile && data.status_id === 4) {
                  this.setState({showSignButtons: true});
                }*/

                this.setState({loaderHidden: true});

                if (hasDeclined.length !== 0) {
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

    beforeSign(){
      this.saveApplicationForm(this.state.landinlocality.id, this.state.lastDecisionIsMO ? false : true, "");
    }

    ecpSignSuccess(){
      this.setState({ isSigned: true });
      this.setState({ showSendButton: true });
    }

    saveApplicationForm(landinlocalityId, status, comment) {
        var token = sessionStorage.getItem('tokenInfo');
        var formData = new FormData();
        formData.append('Response', status);
        formData.append('Message', comment);

        var xhr = new XMLHttpRequest();
        xhr.open("post", window.url + "api/land_in_locality/head/saveHead/" + landinlocalityId, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);

                this.setState({ showButtons: false });
                this.setState({ headResponse: data.response });

                if(this.state.callSaveFromSend){
                    this.setState({callSaveFromSend: false});
                    this.acceptDeclineForm(landinlocalityId, status, comment);
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
            if (!status) {
              $('#accDecApzForm').modal('hide');
              $('#ReturnApplicationForm').modal('hide');
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

    returnApplicationForm(landinlocalityId) {
        var token = sessionStorage.getItem('tokenInfo');
        var formData = new FormData();
        if(this.state.description == '' || this.state.description == ' '){
            alert("Заполните комментарий!");
            return false;
        }
        formData.append('message', this.state.description);
        var xhr = new XMLHttpRequest();
        xhr.open("post", window.url + "api/land_in_locality/head/return/" + landinlocalityId, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function () {
            if (xhr.status === 200) {
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

    acceptDeclineForm(landinlocalityId, status, comment) {
        if(this.state.headResponse === null){
            this.setState({callSaveFromSend: true});
            this.saveApplicationForm(landinlocalityId, status, comment);
            return true;
        }

        var token = sessionStorage.getItem('tokenInfo');
        var formData = new FormData();
        formData.append('Response', status);
        formData.append('message', comment);
        if(this.state.rightLandInLocalityFile){
          formData.append('Payment', true);
        }else{
          formData.append('Payment', false);
        }

        var xhr = new XMLHttpRequest();
        xhr.open("post", window.url + "api/land_in_locality/head/status/" + landinlocalityId, true);
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

    render() {
        return (
            <div>
              {this.state.loaderHidden &&
                <div>
                  <AllInfo toggleMap={this.toggleMap.bind(this, true)} landinlocality={this.state.landinlocality} personalIdFile={this.state.personalIdFile}
                  landLocationSchemeFile={this.state.landLocationSchemeFile} historygoBack={this.props.history.goBack}/>

                 {this.state.showMap && <ShowMap coordinates={this.state.landinlocality.land_address_coordinates} mapId={"b5a3c97bd18442c1949ba5aefc4c1835"}/>}

                 <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                     {this.state.showMapText}
                 </button>

                 <Answers landinlocality_id={this.state.landinlocality.id} landinlocality_status={this.state.landinlocality.status_id}
                          actChooseLandFile={this.state.actChooseLandFile} lastDecisionIsMO={this.state.lastDecisionIsMO}
                          paymentFile={this.state.paymentFile} rightLandInLocalityFile={this.state.rightLandInLocalityFile} />

                  <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                    {this.state.showSignButtons && !this.state.isSigned &&
                    <EcpSign beforeSign={this.beforeSign.bind(this)} ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="head" id={this.state.landinlocality.id} serviceName='land_in_locality'/>
                    }

                    {this.state.showButtons && !this.state.isSigned &&
                    <div>
                        <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.showSignBtns.bind(this)}>Поставить подпись</button>
                        <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApplicationForm">
                            Вернуть на доработку
                        </button>

                        <div className="modal fade" id="ReturnApplicationForm" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                            <label htmlFor="description">Комментарий</label>
                                            <input type="text" className="form-control" id="description" placeholder="" value={this.state.description} onChange={this.onDescriptionChange} />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.returnApplicationForm.bind(this, this.state.landinlocality.id)}>Отправить</button>
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }

                    {
                      this.state.showSendButton &&
                      <button type="button" className="btn btn-raised btn-success" onClick={this.acceptDeclineForm.bind(this, this.state.landinlocality.id, this.state.lastDecisionIsMO ? false : true, "")}>Отправить заявителю</button>
                    }
                  </div>

                  <Logs state_history={this.state.landinlocality.state_history} />

                  <div className="col-sm-12">
                      <hr />
                      <button className="btn btn-outline-secondary pull-right btn-sm" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
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
