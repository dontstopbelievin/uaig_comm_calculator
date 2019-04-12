import React from 'react';
import Loader from 'react-loader-spinner';
import {NavLink} from 'react-router-dom';
import $ from 'jquery';
import ReactQuill from 'react-quill';
import CommissionAnswersList from '../components/CommissionAnswersList';
import ShowMap from "../components/ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Logs from "../components/Logs";
import Answers from "../components/Answers";
import ReturnBack from "../components/ReturnBack";

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
      return (
        <div>
          {this.state.loaderHidden &&
            <div>

              <AllInfo toggleMap={this.toggleMap.bind(this, true)} apz={this.state.apz} personalIdFile={this.state.personalIdFile} confirmedTaskFile={this.state.confirmedTaskFile} titleDocumentFile={this.state.titleDocumentFile}
                historygoBack={this.props.history.goBack} additionalFile={this.state.additionalFile} claimedCapacityJustification={this.state.claimedCapacityJustification}/>

              {this.state.apz.commission && (Object.keys(this.state.apz.commission).length > 0) &&
                <div>
                  <h5 className="block-title-2 mb-3">Ответы от служб</h5>
                  <CommissionAnswersList apz={this.state.apz} />
                </div>
              }

              {this.state.showMap && <ShowMap coordinates={this.state.apz.project_address_coordinates} mapId={"b5a3c97bd18442c1949ba5aefc4c1835"}/>}

              <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                {this.state.showMapText}
              </button>

              <Answers engineerReturnedState={this.state.engineerReturnedState} apzReturnedState={this.state.apzReturnedState}
                       backFromHead={this.state.backFromHead} apz_department_response={this.state.apz.apz_department_response} apz_id={this.state.apz.id} p_name={this.state.apz.project_name}
                       apz_status={this.state.apz.status_id} schemeComment={this.state.schemeComment}
                       calculationComment={this.state.calculationComment} reglamentComment={this.state.reglamentComment} schemeFile={this.state.schemeFile}
                       calculationFile={this.state.calculationFile} reglamentFile={this.state.reglamentFile}/>

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
                          <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="region" id={this.state.apz.id} serviceName='apz'/>
                        :
                          <div style={{paddingLeft:'5px', fontSize: '18px', textAlign:'center'}}>
                            <b>Выберите главного архитектора:</b>
                            <select id="gas_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.apz_head_id} onChange={this.handleHeadIDChange.bind(this)}>
                              {this.state.apz_heads_id}
                            </select>
                            <div>
                              <button type="button" className="btn btn-raised btn-success" onClick={this.acceptDeclineApzForm.bind(this, this.state.apz.id, true, "")}>Отправить главному архитектору</button>
                            </div>
                          </div>
                      }
                    </div>
                  }
                  <ReturnBack description={this.state.description} onDescriptionChange={this.onDescriptionChange}
                    acceptDeclineApzForm={this.acceptDeclineApzForm.bind(this, this.state.apz.id, false, this.state.description)} />
                </div>
              </div>

              <Logs state_history={this.state.apz.state_history} />

              <div className="col-sm-12">
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
