import React from 'react';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CommissionAnswersList from '../components/CommissionAnswersList';
import ShowMap from "../components/ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Answers from "../components/Answers";
import Logs from "../components/Logs";

export default class ShowApz extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        apz: [],
        showMap: false,
        showButtons: false,
        description: '',
        showMapText: 'Показать карту',
        loaderHidden: false,
        personalIdFile: false,
        confirmedTaskFile: false,
        titleDocumentFile: false,
        additionalFile: false,
        schemeroadFile: false,
        schemeComment: false,
        schemeFile: false,
        calculationComment: false,
        calculationFile: false,
        reglamentComment: false,
        reglamentFile: false
      };

      this.onDescriptionChange = this.onDescriptionChange.bind(this);
    }

    onDescriptionChange(value) {
      this.setState({ description: value });
    }

    componentDidMount() {
      this.props.breadCrumbs();
    }

    componentWillMount() {
      if(!sessionStorage.getItem('tokenInfo')){
        let fullLoc = window.location.href.split('/');
        this.props.history.replace({pathname: "/panel/common/login", state:{url_apz_id: fullLoc[fullLoc.length-1]}});
      }else {
        this.getApzInfo();
        // this.webSocketFunction();
      }
    }

    getApzInfo() {
      var id = this.props.match.params.id;
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/schemeroadhead/detail/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          var apz = data;
          this.setState({apz: apz});
          this.setState({personalIdFile: apz.files.filter(function(obj) { return obj.category_id === 3 })[0]});
          this.setState({confirmedTaskFile: apz.files.filter(function(obj) { return obj.category_id === 9 })[0]});
          this.setState({titleDocumentFile: apz.files.filter(function(obj) { return obj.category_id === 10 })[0]});
          this.setState({additionalFile: apz.files.filter(function(obj) { return obj.category_id === 27 })[0]});
          this.setState({reglamentComment: apz.state_history.filter(function(obj) { return obj.state_id === 42 })[0]});
          this.setState({reglamentFile: apz.files.filter(function(obj) { return obj.category_id === 29 })[0]});
          this.setState({schemeroadFile: apz.files.filter(function(obj) { return obj.category_id === 40 })[0]});
          this.setState({schemeComment: apz.state_history.filter(function(obj) { return obj.state_id === 56 })[0]});
          this.setState({schemeFile: apz.files.filter(function(obj) { return obj.category_id === 38 })[0]});
          this.setState({calculationComment: apz.state_history.filter(function(obj) { return obj.state_id === 57 })[0]});
          this.setState({calculationFile: apz.files.filter(function(obj) { return obj.category_id === 39 })[0]});
          if (apz.state_history.filter(function(obj) { return obj.state_id === 50 })[0] != null &&
              apz.state_history.filter(function(obj) { return obj.state_id === 51 })[0] == null) {
            this.setState({showButtons: true});
          }
          this.setState({loaderHidden: true});
          // BE CAREFUL OF category_id should be xml регионального архитектора
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.onerror = function () {
        alert('Сервер не отвечает');
        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }
    
    acceptDeclineApzForm(apzId, status, comment) {
      var token = sessionStorage.getItem('tokenInfo');
      var registerData = {
        response: status,
        message: comment
      };
      var data = JSON.stringify(registerData);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/schemeroadhead/status/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function () {
        if (xhr.status === 200) {
          //var data = JSON.parse(xhr.responseText);

          if(status === true) {
            alert("Заявление принято!");
          } else {
            alert("Заявление отклонено!");
          }
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        }
        this.setState({ showSendButtons: false });
        if (!status) {
          $('#accDecApzForm').modal('hide');
        }
      }.bind(this);
      xhr.send(data);
      $('#ReturnApzForm').modal('hide');
      $('#AcceptApzForm').modal('hide');
    }

    showSignBtns(){
        this.setState({ showSignButtons: true });
        this.setState({ showButtons: false });
    }

    hideSignBtns(){
        this.setState({ showSignButtons: false });
        this.setState({ showButtons: true });
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
      var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
      var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
      var curr_year = jDate.getFullYear();
      var curr_hour = jDate.getHours() < 10 ? "0" + jDate.getHours() : jDate.getHours();
      var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
      var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;

      return formated_date;
    }

    ecpSignSuccess(){
        this.setState({ showSendButtons: true });
        this.setState({ showSignButtons: false });
    }

    render() {
      return (
        <div>
          {this.state.loaderHidden &&
            <div>
              <AllInfo toggleMap={this.toggleMap.bind(this, true)} apz={this.state.apz} personalIdFile={this.state.personalIdFile} confirmedTaskFile={this.state.confirmedTaskFile} titleDocumentFile={this.state.titleDocumentFile}
                       historygoBack={this.props.history.goBack} additionalFile={this.state.additionalFile} claimedCapacityJustification={this.state.claimedCapacityJustification}/>

              {this.state.showMap && <ShowMap coordinates={this.state.apz.project_address_coordinates} mapId={"b5a3c97bd18442c1949ba5aefc4c1835"} />}

              <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                {this.state.showMapText}
              </button>
              <Answers engineerReturnedState={this.state.engineerReturnedState} apzReturnedState={this.state.apzReturnedState}
                       backFromHead={this.state.backFromHead} apz_department_response={this.state.apz.apz_department_response} apz_id={this.state.apz.id} p_name={this.state.apz.project_name}
                       apz_status={this.state.apz.status_id} schemeComment={this.state.schemeComment}
                       calculationComment={this.state.calculationComment} reglamentComment={this.state.reglamentComment} schemeFile={this.state.schemeFile}
                       calculationFile={this.state.calculationFile} reglamentFile={this.state.reglamentFile} schemeroadFile={this.state.schemeroadFile}/>

              <div className={this.state.showButtons ? '' : 'invisible'}>
                <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                  <div style={{margin: 'auto', display: 'table'}}>
                    <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.showSignBtns.bind(this)}>Поставить подпись</button>
                  </div>
                </div>
              </div>

              {this.state.showSendButtons &&
                <div style={{margin: 'auto', display: 'table'}}>
                  <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineApzForm.bind(this, this.state.apz.id, true, 'accepted')}>Отправить в отдел гос услуг</button>
                </div>
              }

              {this.state.showSignButtons && !this.state.isSigned &&
                <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="schemeroadhead" id={this.state.apz.id} serviceName='apz'/>
              }
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
