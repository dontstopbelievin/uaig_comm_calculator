import React from 'react';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import ShowMap from "./ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Answers from "../components/Answers";
import CommissionAnswersList from '../components/CommissionAnswersList';
import Logs from "../components/Logs";

export default class ShowApz extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            apz: [],
            showMap: false,
            showButtons: false,
            showSendButton: false,
            showSignButtons: false,
            file: false,
            docNumber: "",
            description: '',
            responseFile: null,
            waterResponseFile: null,
            phoneResponseFile: null,
            electroResponseFile: null,
            heatResponseFile: null,
            gasResponseFile: null,
            waterCustomTcFile: null,
            phoneCustomTcFile: null,
            electroCustomTcFile: null,
            heatCustomTcFile: null,
            fileDescription: "",
            pack2IdFile: null,
            gasCustomTcFile: null,
            headResponseFile: null,
            personalIdFile: false,
            confirmedTaskFile: false,
            titleDocumentFile: false,
            additionalFile: false,
            showMapText: 'Показать карту',
            headResponse: null,
            response: false,
            loaderHidden: false,
            xmlFile: false,
            backFromHead: false,
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
        this.getApzInfo();
    }

    getApzInfo() {
        var id = this.props.match.params.id;
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/apz/headsstateservices/detail/" + id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                var commission = data.commission;
                var hasDeclined = data.state_history.filter(function(obj) {
                    return obj.state_id === 20
                });

                this.setState({apz: data});
                this.setState({showButtons: false});
                this.setState({docNumber: data.id});
                this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
                this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
                this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});
                this.setState({additionalFile: data.files.filter(function(obj) { return obj.category_id === 27 })[0]});
                this.setState({reglamentFile: data.files.filter(function(obj) { return obj.category_id === 29 })[0]});
                this.setState({backFromHead: data.state_history.filter(function(obj) { return obj.state_id === 33 })[0]});

                var pack2IdFile = data.files.filter(function(obj) { return obj.category_id === 25 }) ?
                    data.files.filter(function(obj) { return obj.category_id === 25 }) : [];
                if ( pack2IdFile.length > 0 ) {
                    this.setState({pack2IdFile: pack2IdFile[0]});
                }
                for(var data_index = data.state_history.length-1; data_index >= 0; data_index--){
                    switch (data.state_history[data_index].state_id) {
                        case 39:
                            break;
                        case 40:
                            this.setState({lastDecisionIsMO: true});
                            break;
                        default:
                            continue;
                    }
                    break;
                }

                if (commission) {
                    if (commission.apz_water_response && commission.apz_water_response.files) {
                        this.setState({waterResponseFile: commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
                        this.setState({waterCustomTcFile: commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
                    }

                    if (commission.apz_electricity_response && commission.apz_electricity_response.files) {
                        this.setState({electroResponseFile: commission.apz_electricity_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
                        this.setState({electroCustomTcFile: commission.apz_electricity_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
                    }

                    if (commission.apz_phone_response && commission.apz_phone_response.files) {
                        this.setState({phoneResponseFile: commission.apz_phone_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
                        this.setState({phoneCustomTcFile: commission.apz_phone_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
                    }

                    if (commission.apz_heat_response && commission.apz_heat_response.files) {
                        this.setState({heatResponseFile: commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
                        this.setState({heatCustomTcFile: commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
                        this.setState({fileDescription: commission.apz_heat_response.fileDescription});
                    }

                    if (commission.apz_gas_response && commission.apz_gas_response.files) {
                        this.setState({gasResponseFile: commission.apz_gas_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
                        this.setState({gasCustomTcFile: commission.apz_gas_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
                    }
                }

                if (data.status_id === 12) {
                    this.setState({showButtons: true});
                }

                if ( data.files.filter(function(obj) { return obj.category_id === 33})[0] != null) {
                    this.setState({isSigned: true});
                    this.setState({xmlFile: data.files.filter(function(obj) { return obj.category_id === 33})[0]});
                }

                if (data.files.filter(function(obj) { return obj.category_id === 33})[0] != null && data.status_id === 12) {
                    this.setState({showSendButton: true});
                }

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

    showSignBtns(){
        this.setState({ showSignButtons: true });
        this.setState({ showButtons: false });
    }

    hideSignBtns(){
        this.setState({ showSignButtons: false });
        this.setState({ showButtons: true });
    }

    acceptDeclineApzForm(apzId, status, comment) {
        var token = sessionStorage.getItem('tokenInfo');
        var formData = new FormData();
        formData.append('response', status);
        formData.append('message', comment);

        var xhr = new XMLHttpRequest();
        xhr.open("post", window.url + "api/apz/headsstateservices/status/" + apzId, true);
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
            if (!status) {
              $('#accDecApzForm').modal('hide');
              $('#ReturnApzForm').modal('hide');
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
        var apz = this.state.apz;

        if (apz.length === 0) {
            return false;
        }

        return (
            <div>
                {this.state.loaderHidden &&
                <div className="row">
                  <div className="col-sm-12">
                    <AllInfo toggleMap={this.toggleMap.bind(this, true)} apz={this.state.apz} personalIdFile={this.state.personalIdFile} confirmedTaskFile={this.state.confirmedTaskFile} titleDocumentFile={this.state.titleDocumentFile}
                      additionalFile={this.state.additionalFile} claimedCapacityJustification={this.state.claimedCapacityJustification}/>


                    {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}
                    <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                        {this.state.showMapText}
                    </button>


                    {apz.commission && (Object.keys(apz.commission).length > 0) &&
                      <div>
                        <h5 className="block-title-2 mb-3">Ответы от служб</h5>
                        <CommissionAnswersList apz={apz} />
                      </div>
                    }



                    <Answers engineerReturnedState={this.state.engineerReturnedState} apzReturnedState={this.state.apzReturnedState}
                           backFromHead={this.state.backFromHead} apz_department_response={this.props.apz_department_response} apz_id={this.state.apz.id} p_name={this.state.apz.project_name}
                           apz_status={this.state.apz.status_id} schemeComment={this.state.schemeComment} lastDecisionIsMO={this.state.lastDecisionIsMO}
                           calculationComment={this.state.calculationComment} reglamentComment={this.state.reglamentComment} schemeFile={this.state.schemeFile}
                           calculationFile={this.state.calculationFile} reglamentFile={this.state.reglamentFile}/>

                    {this.state.showSignButtons && !this.state.isSigned &&
                    <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="headsstateservices" apz_id={apz.id}/>
                    }

                    {this.state.showButtons && !this.state.isSigned &&
                    <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', marginBottom: '10px'}}>
                        <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.showSignBtns.bind(this)}>Поставить подпись</button>
                        <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm">
                            Вернуть на доработку
                        </button>
                    </div>
                    }
                    {this.state.showSendButton &&
                    <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineApzForm.bind(this, apz.id, true, "")}>Отправить архитектору</button>
                    }
                    {this.state.showButtons && this.state.backFromHead &&
                      <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm">
                          Вернуть на доработку
                      </button>
                    }
                    <div className="modal fade" id="ReturnApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                    <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineApzForm.bind(this, apz.id, false, this.state.description)}>Отправить</button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                  <div className="col-sm-12">
                      <Logs state_history={this.state.apz.state_history} />
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
