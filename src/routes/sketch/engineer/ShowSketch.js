import React from 'react';
import $ from 'jquery';
import 'jquery-serializejson';
import Loader from 'react-loader-spinner';
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

    ecpSignSuccess(){
      this.setState({ xmlFile: true });
      this.setState({loaderHidden: true});
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
        return (
            <div className="row">
                <AllInfo toggleMap={this.toggleMap.bind(this, true)} sketch={this.state.sketch} personalIdFile={this.state.personalIdFile}
                  sketchFile={this.state.sketchFile} sketchFilePDF={this.state.sketchFilePDF} apzFile={this.state.apzFile}/>

                <div className="col-sm-12">
                    {this.state.showMap && <ShowMap mapId={"b5a3c97bd18442c1949ba5aefc4c1835"} coordinates={this.state.sketch.project_address_coordinates} />}
                    <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                        {this.state.showMapText}
                    </button>
                </div>

                <Answers  engineerReturnedState={this.state.engineerReturnedState} apzReturnedState={this.state.apzReturnedState}
                sketch_id={this.state.sketch.id} urban_response={this.state.sketch.urban_response} lastDecisionIsMO = {this.state.lastDecisionIsMO} />

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
                                                    <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineSketchForm.bind(this, this.state.sketch.id, false, this.state.comment)}>Отправить</button>
                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div>
                                    { !this.state.xmlFile ?
                                        <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="engineer" id={this.state.sketch.id} serviceName='sketch'/>
                                        :
                                        <div>
                                            <button className="btn btn-raised btn-success" style={{marginRight: '5px'}}
                                                    onClick={this.acceptDeclineSketchForm.bind(this, this.state.sketch.id, true, "your form was accepted")}>
                                                Главному архитектору
                                            </button>
                                        </div>
                                    }
                                </div>
                            }
                          </div>
                        </div>

                    <Logs state_history={this.state.sketch.state_history} />

                    <div className="col-sm-12">
                        <hr />
                        <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
                    </div>
                </div>
            </div>
        )
    }
}
