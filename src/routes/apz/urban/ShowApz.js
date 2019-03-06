import React from 'react';
import Loader from 'react-loader-spinner';
import {NavLink} from 'react-router-dom';
import $ from 'jquery';
import ReactQuill from 'react-quill';
import CommissionAnswersList from '../components/CommissionAnswersList';
import ShowMap from "./ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Logs from "../components/Logs";
import Answers from "../components/Answers";

export default class ShowApz extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        apz: [],
        showMap: false,
        showButtons: true,
        description: '',
        showMapText: 'Показать карту',
        loaderHidden: false,
        personalIdFile: false,
        confirmedTaskFile: false,
        titleDocumentFile: false,
        additionalFile: false,
        engineerReturnedState: false,
        apzReturnedState: false,
        needSign: false,
        backFromHead: false,
        apz_head_id: '',
        apz_heads_id: [],
        engineerSign: false,
        apzSign: false,
        xmlFile: false
      };

      this.onDescriptionChange = this.onDescriptionChange.bind(this);
    }

    onDescriptionChange(e) {
      this.setState({ description: e.target.value });
    }

    componentDidMount() {
      this.props.breadCrumbs();
    }

    componentWillMount() {
      if(!sessionStorage.getItem('tokenInfo')){
        let fullLoc = window.location.href.split('/');
        this.props.history.replace({pathname: "/panel/common/login", state:{url_apz_id: fullLoc[fullLoc.length-1]}});
      }else {
        console.log('MOUNTING');
        this.getHeads();
        this.getApzInfo();
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
            select_directors.push(<option key={i} value={data[i].user_id}> {data[i].last_name +' ' + data[i].first_name+' '+data[i].middle_name} </option>);
          }
          this.setState({apz_heads_id: select_directors});
          if((this.state.apz_head_id === "" || this.state.apz_head_id === " ") && data.length > 0){
              this.setState({apz_head_id: data[0].user_id});
          }
        }
      }.bind(this);
      xhr.send();
    }

    getApzInfo() {
      var id = this.props.match.params.id;
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/region/detail/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var apz = JSON.parse(xhr.responseText);
          this.setState({apz: apz});
          this.setState({personalIdFile: apz.files.filter(function(obj) { return obj.category_id === 3 })[0]});
          this.setState({confirmedTaskFile: apz.files.filter(function(obj) { return obj.category_id === 9 })[0]});
          this.setState({titleDocumentFile: apz.files.filter(function(obj) { return obj.category_id === 10 })[0]});
          this.setState({additionalFile: apz.files.filter(function(obj) { return obj.category_id === 27 })[0]});
          this.setState({reglamentFile: apz.files.filter(function(obj) { return obj.category_id === 29 })[0]});
          this.setState({showButtons: false});
          for(var data_index = apz.state_history.length-1; data_index >= 0; data_index--){
            switch (apz.state_history[data_index].state_id) {
              case 33:
                this.setState({backFromHead: apz.state_history[data_index]});
                break;
              default:
                continue;
            }
            break;
          }
          this.setState({engineerReturnedState: apz.state_history.filter(function(obj) { return obj.state_id === 1 && obj.sender === 'engineer'})[0]});
          this.setState({apzReturnedState: apz.state_history.filter(function(obj) { return obj.state_id === 1 && obj.sender === 'apz'})[0]});
          this.setState({needSign: apz.state_history.filter(function(obj) { return obj.state_id === 1 && obj.comment === null })[0]});
          this.setState({engineerSign: apz.files.filter(function(obj) { return obj.category_id === 28 })[0]});
          this.setState({apzSign: apz.files.filter(function(obj) { return obj.category_id === 18 })[0]});
          if(apz.apz_head_id){this.setState({apz_head_id: apz.apz_head_id});}

          if (apz.status_id === 3) {
            this.setState({showButtons: true});
          }

          this.setState({loaderHidden: true});
          // BE CAREFUL OF category_id should be xml регионального архитектора
          this.setState({xmlFile: apz.files.filter(function(obj) { return obj.category_id === 21})[0]});
          this.setState({needSign: apz.files.filter(function(obj) { return obj.category_id === 21})[0]});
          if(apz.state_history.filter(function(obj) { return obj.state_id === 33 })[0] != null){
              this.setState({needSign: false});
          }
          //use instead new columns from table
          if(!apz.urban_sign_returned){
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

    acceptDeclineApzForm(apzId, status, comment) {
      var token = sessionStorage.getItem('tokenInfo');

      var registerData = {
        response: status,
        message: comment,
        apz_head_id: this.state.apz_head_id
      };

      if (!status && !comment) {
        alert('Заполните причину отказа');
        return false;
      }

      var data = JSON.stringify(registerData);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/region/status/" + apzId, true);
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
          $('#ReturnApzForm').modal('hide');
        }
      }.bind(this);
      xhr.send(data);
    }

    sendToApz() {
      this.setState({needSign: true });
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

    ecpSignSuccess(){
      this.setState({ xmlFile: true });
    }

    render() {
      var apz = this.state.apz;

      return (
        <div>
          {this.state.loaderHidden &&
            <div>

              <AllInfo toggleMap={this.toggleMap.bind(this, true)} apz={this.state.apz} personalIdFile={this.state.personalIdFile} confirmedTaskFile={this.state.confirmedTaskFile} titleDocumentFile={this.state.titleDocumentFile}
                additionalFile={this.state.additionalFile} claimedCapacityJustification={this.state.claimedCapacityJustification}/>

              {apz.commission && (Object.keys(apz.commission).length > 0) &&
                <div>
                  <h5 className="block-title-2 mb-3">Ответы от служб</h5>
                  <CommissionAnswersList apz={apz} />
                </div>
              }

              {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}

              <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                {this.state.showMapText}
              </button>

              <Answers engineerReturnedState={this.state.engineerReturnedState} apzReturnedState={this.state.apzReturnedState}
                backFromHead={this.state.backFromHead} apz_department_response={this.props.apz_department_response} apz_id={apz.id} p_name={apz.project_name}
                  reglamentFile={this.state.reglamentFile} apz_status={apz.status_id}/>

              <div className={this.state.showButtons ? '' : 'invisible'}>
                <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                  {!this.state.needSign ?
                    <div style={{margin: 'auto', display: 'table'}}>
                      <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.sendToApz.bind(this)}>Поставить подпись</button>
                      <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm">
                          Вернуть на доработку
                      </button>
                    </div>
                    :
                      <div>
                      { !this.state.xmlFile ?
                          <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="region" apz_id={apz.id}/>
                        :
                          <div style={{paddingLeft:'5px', fontSize: '18px', textAlign:'center'}}>
                            <b>Выберите главного архитектора:</b>
                            <select id="gas_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.apz_head_id} onChange={this.handleHeadIDChange.bind(this)}>
                              {this.state.apz_heads_id}
                            </select>
                            <div>
                              <button type="button" className="btn btn-raised btn-success" onClick={this.acceptDeclineApzForm.bind(this, apz.id, true, "")}>Отправить главному архитектору</button>
                            </div>
                          </div>
                      }
                    </div>
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
              </div>

              <Logs state_history={apz.state_history} />

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
