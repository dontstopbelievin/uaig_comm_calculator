import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
//import { NavLink } from 'react-router-dom';
import $ from 'jquery';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import saveAs from 'file-saver';
import '../assets/css/visited.css'
export default class ProviderWater extends React.Component {
  render() {
    return (
      <div className="content container body-content">
        <div>
          <div>
            <Switch>
              <Route path="/panel/water-provider/apz/status/:status/:page" exact render={(props) =>(
                <AllApzs {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/water-provider/apz/show/:id" exact render={(props) =>(
                <ShowApz {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Redirect from="/panel/water-provider/apz" to="/panel/water-provider/apz/status/active/1" />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

class AllApzs extends React.Component {
  constructor(props) {
    super(props);

    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    this.state = {
      loaderHidden: false,
      isPerformer: (roles.indexOf('PerformerWater') != -1),
      response: null,
      pageNumbers: []
    };

  }

  componentDidMount() {
    console.log('1');
    this.props.breadCrumbs();
    this.getApzs();
  }

  componentWillReceiveProps(nextProps) {
    this.getApzs(nextProps.match.params.status, nextProps.match.params.page);
  }

  getApzs(status = null, page = null) {
    if (!status) {
      status = this.props.match.params.status;
    }

    if (!page) {
      page = this.props.match.params.page;
    }

    this.setState({ loaderHidden: false });

    var token = sessionStorage.getItem('tokenInfo');
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    if (roles == null) {
      sessionStorage.clear();
      alert("Token is expired, please login again!");
      this.props.history.replace("/login");
      return false;
    }
    var directorId = JSON.parse(sessionStorage.getItem('userId'));
    var providerName = roles[1];
    var xhr = new XMLHttpRequest();
    if(roles[2] == 'DirectorWater'){
      xhr.open("get", window.url + "api/apz/provider/" + providerName + "/all/" + status + "/" + directorId + '?page=' + page, true);
    }else{
      xhr.open("get", window.url + "api/apz/provider/" + providerName + "/all/" + status + "/0" + '?page=' + page, true);
    }
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var pageNumbers = [];
        var start = (response.current_page - 4) > 0 ? (response.current_page - 4) : 1;
        var end = (response.current_page + 4) < response.last_page ? (response.current_page + 4) : response.last_page;

        for (start; start <= end; start++) {
          pageNumbers.push(start);
        }

        this.setState({pageNumbers: pageNumbers});
        this.setState({response: response});
      }

      this.setState({ loaderHidden: true });
    }.bind(this);
    xhr.send();
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

  render() {
    var status = this.props.match.params.status;
    var page = this.props.match.params.page;
    var apzs = this.state.response ? this.state.response.data : [];

    return (
      <div>
        <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание</h4>
        </div>
        {this.state.loaderHidden &&
          <div>
            <ul className="nav nav-tabs mb-2 pull-right">
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/water-provider/apz/status/active/1" replace>Активные</NavLink></li>

              {this.state.isPerformer &&
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'awaiting'} to="/panel/water-provider/apz/status/awaiting/1" replace>В ожидании</NavLink></li>
              }

              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/water-provider/apz/status/accepted/1" replace>Принятые</NavLink></li>
              <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/water-provider/apz/status/declined/1" replace>Отказанные</NavLink></li>
            </ul>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '23%'}}>Название</th>
                  <th style={{width: '23%'}}>Заявитель</th>
                  <th style={{width: '20%'}}>Адрес</th>
                  <th style={{width: '20%'}}>Дата заявления</th>

                  {(status === 'active' || status === 'awaiting') &&
                    <th style={{width: '14%'}}>Срок</th>
                  }
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {apzs.map(function(apz, index) {
                  return(
                    <tr key={index}>
                      <td>
                        {apz.project_name}

                        {apz.object_type &&
                          <span className="ml-1">({apz.object_type})</span>
                        }
                      </td>
                      <td>{apz.applicant}</td>
                      <td>{apz.project_address}</td>
                      <td>{this.toDate(apz.created_at)}</td>

                      {(status === 'active' || status === 'awaiting') &&
                        <td>
                          {apz.term > 1 ?
                            apz.term === 3 ? '2 д. (начиная со следующего дня)' : apz.term - 1 + ' д.'
                            :
                            apz.term === 1 ? 'Сегодня до 16:00' : 'Просрочено'
                          }
                        </td>
                      }
                      <td>
                        <Link className="btn btn-outline-info" to={'/panel/water-provider/apz/show/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                      </td>
                    </tr>
                    );
                  }.bind(this))
                }
              </tbody>
            </table>

            {this.state.response && this.state.response.last_page > 1 &&
              <nav className="pagination_block">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/water-provider/apz/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/water-provider/apz/status/' + status + '/' + num}>{num}</Link>
                      </li>
                      );
                    }.bind(this))
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/water-provider/apz/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
                  </li>
                </ul>
              </nav>
            }
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

class ShowApz extends React.Component {
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

    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    this.state = {
      apz: [],
      showMap: false,
      showButtons: false,
      showSignButtons: false,
      showTechCon: false,
      file: false,
      genWaterReq: "",
      drinkingWater: "",
      prodWater: "",
      fireFightingWaterIn: "",
      fireFightingWaterOut: "",
      connectionPoint: "",
      recomendation: "",
      estimatedWaterFlowRate: "0.76",
      existingWaterConsumption: "0.76",
      sewageEstimatedWaterFlowRate: "0.76",
      sewageExistingWaterConsumption: "0.76",
      waterPressure: "",
      waterCustomerDuties: "",
      sewageCustomerDuties: "",
      docNumber: "",
      description: '',
      responseId: 0,
      response: false,
      responseFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
      additionalFile: false,
      surveyFile: false,
      showMapText: 'Показать карту',
      accept: 'accept',
      callSaveFromSend: false,
      waterStatus: 2,
      storageAlias: "PKCS12",
      xmlFile: false,
      isSigned: false,
      isPerformer: (roles.indexOf('PerformerWater') != -1),
      isHead: (roles.indexOf('HeadWater') != -1),
      isDirector: (roles.indexOf('DirectorWater') != -1),
      heads_responses: [],
      head_accepted: true,
      headComment: "",
      customTcFile: null,
      tcTextWater: "",
      tcTextWaterRequirements: "",
      tcTextWaterGeneral: "",
      tcTextSewage: "",
      tcTextSewageRequirements: "",
      tcTextSewageGeneral: "",
      zhk_tcTextWater: "",
      zhk_tcTextWaterRequirements: "",
      zhk_tcTextWaterGeneral: "",
      zhk_tcTextSewageRequirements: "",
      zhk_tcTextSewage: "",
      zhk_tcTextSewageGeneral: "",
      perenos_tcTextWater: "",
      perenos_tcTextWaterRequirements: "",
      perenos_tcTextWaterGeneral: "",
      ks_tcTextWater: "",
      ks_tcTextWaterRequirements: "",
      ks_tcTextWaterGeneral: "",
      ks_tcTextSewage: "",
      ks_tcTextSewageRequirements: "",
      ks_tcTextSewageGeneral: "",
      tab_tcTextWater: "",
      tab_tcTextWaterRequirements: "",
      tab_tcTextWaterGeneral: "",
      tab_tcTextSewage: "",
      tab_tcTextSewageRequirements: "",
      tab_tcTextSewageGeneral: "",
      waterTab: true,
      sewageTab: false,
      ty_director_id: "",
      water_directors_id: []
    };

    this.onGenWaterReqChange = this.onGenWaterReqChange.bind(this);
    this.onDrinkingWaterChange = this.onDrinkingWaterChange.bind(this);
    this.onProdWaterChange = this.onProdWaterChange.bind(this);
    this.onFireFightingWaterInChange = this.onFireFightingWaterInChange.bind(this);
    this.onFireFightingWaterOutChange = this.onFireFightingWaterOutChange.bind(this);
    this.onConnectionPointChange = this.onConnectionPointChange.bind(this);
    this.onRecomendationChange = this.onRecomendationChange.bind(this);
    this.onDocNumberChange = this.onDocNumberChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.saveResponseForm = this.saveResponseForm.bind(this);
    this.sendWaterResponse = this.sendWaterResponse.bind(this);
    this.onHeadCommentChange = this.onHeadCommentChange.bind(this);
    this.onEstimatedWaterFlowRateChange = this.onEstimatedWaterFlowRateChange.bind(this);
    this.onExistingWaterConsumptionChange = this.onExistingWaterConsumptionChange.bind(this);
    this.onSewageEstimatedWaterFlowRateChange = this.onSewageEstimatedWaterFlowRateChange.bind(this);
    this.onSewageExistingWaterConsumptionChange = this.onSewageExistingWaterConsumptionChange.bind(this);
    this.onWaterPressureChange = this.onWaterPressureChange.bind(this);
    this.onWaterCustomerDutiesChange = this.onWaterCustomerDutiesChange.bind(this);
    this.onSewageCustomerDutiesChange = this.onSewageCustomerDutiesChange.bind(this);
    this.onCustomTcFileChange = this.onCustomTcFileChange.bind(this);
    this.onTcTextWaterChange = this.onTcTextWaterChange.bind(this);
    this.onTcTextWaterRequirementsChange = this.onTcTextWaterRequirementsChange.bind(this);
    this.onTcTextWaterGeneralChange = this.onTcTextWaterGeneralChange.bind(this);
    this.onTcTextSewageChange = this.onTcTextSewageChange.bind(this);
    this.onTcTextSewageRequirementsChange = this.onTcTextSewageRequirementsChange.bind(this);
    this.onTcTextSewageGeneralChange = this.onTcTextSewageGeneralChange.bind(this);
    this.onzhk_TcTextWaterChange = this.onzhk_TcTextWaterChange.bind(this);
    this.onzhk_TcTextWaterRequirementsChange = this.onzhk_TcTextWaterRequirementsChange.bind(this);
    this.onzhk_TcTextWaterGeneralChange = this.onzhk_TcTextWaterGeneralChange.bind(this);
    this.onzhk_TcTextSewageChange = this.onzhk_TcTextSewageChange.bind(this);
    this.onzhk_TcTextSewageRequirementsChange = this.onzhk_TcTextSewageRequirementsChange.bind(this);
    this.onzhk_TcTextSewageGeneralChange = this.onzhk_TcTextSewageGeneralChange.bind(this);
    this.onks_TcTextWaterChange = this.onks_TcTextWaterChange.bind(this);
    this.onks_TcTextWaterRequirementsChange = this.onks_TcTextWaterRequirementsChange.bind(this);
    this.onks_TcTextWaterGeneralChange = this.onks_TcTextWaterGeneralChange.bind(this);
    this.onks_TcTextSewageChange = this.onks_TcTextSewageChange.bind(this);
    this.onks_TcTextSewageRequirementsChange = this.onks_TcTextSewageRequirementsChange.bind(this);
    this.onks_TcTextSewageGeneralChange = this.onks_TcTextSewageGeneralChange.bind(this);
    this.onperenos_TcTextWaterChange = this.onperenos_TcTextWaterChange.bind(this);
    this.onperenos_TcTextWaterRequirementsChange = this.onperenos_TcTextWaterRequirementsChange.bind(this);
    this.onperenos_TcTextWaterGeneralChange = this.onperenos_TcTextWaterGeneralChange.bind(this);
    this.toggleFormTabs = this.toggleFormTabs.bind(this);
  }
  componentDidMount() {
    this.props.breadCrumbs();
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    if(roles[2] == 'PerformerWater'){
      this.getDirectors();
    }
  }

  onGenWaterReqChange(e) {
    this.setState({ genWaterReq: e.target.value });
  }

  onDrinkingWaterChange(e) {
    this.setState({ drinkingWater: e.target.value });
  }

  onProdWaterChange(e) {
    this.setState({ prodWater: e.target.value });
  }

  onFireFightingWaterInChange(e) {
    this.setState({ fireFightingWaterIn: e.target.value });
  }

  onFireFightingWaterOutChange(e) {
    this.setState({ fireFightingWaterOut: e.target.value });
  }

  onConnectionPointChange(e) {
    this.setState({ connectionPoint: e.target.value });
  }

  onRecomendationChange(e) {
    this.setState({ recomendation: e.target.value });
  }

  onDocNumberChange(e) {
    this.setState({ docNumber: e.target.value });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  onHeadCommentChange(e) {
    this.setState({ headComment: e.target.value });
  }

  onEstimatedWaterFlowRateChange(e) {
    this.setState({ genWaterReq: (e.target.value ? parseFloat(e.target.value) : 0) + parseFloat(this.state.existingWaterConsumption) });
    this.setState({ estimatedWaterFlowRate: e.target.value });
  }

  onExistingWaterConsumptionChange(e) {
    this.setState({ genWaterReq: parseFloat(this.state.estimatedWaterFlowRate) + (e.target.value ? parseFloat(e.target.value) : 0) });
    this.setState({ existingWaterConsumption: e.target.value });
  }

  onSewageEstimatedWaterFlowRateChange(e) {
    this.setState({ sewageEstimatedWaterFlowRate: e.target.value });
  }

  onSewageExistingWaterConsumptionChange(e) {
    this.setState({ sewageExistingWaterConsumption: e.target.value });
  }

  onWaterPressureChange(e) {
    this.setState({ waterPressure: e.target.value });
  }

  onWaterCustomerDutiesChange(e) {
    this.setState({ waterCustomerDuties: e.target.value });
  }

  onSewageCustomerDutiesChange(e) {
    this.setState({ sewageCustomerDuties: e.target.value });
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  onCustomTcFileChange(e) {
    this.setState({ customTcFile: e.target.files[0] });
  }

  onTcTextWaterChange(value) {
    this.setState({ tab_tcTextWater: value });
  }
  onTcTextWaterRequirementsChange(value) {
    this.setState({ tab_tcTextWaterRequirements: value });
  }
  onTcTextWaterGeneralChange(value) {
    this.setState({ tab_tcTextWaterGeneral: value });
  }
  onTcTextSewageChange(value) {
    this.setState({ tab_tcTextSewage: value });
  }
  onTcTextSewageRequirementsChange(value) {
    this.setState({ tab_tcTextSewageRequirements: value });
  }
  onTcTextSewageGeneralChange(value) {
    this.setState({ tab_tcTextSewageGeneral: value });
  }

  onzhk_TcTextWaterChange(value) {
    this.setState({ zhk_tcTextWater: value });
  }
  onzhk_TcTextWaterRequirementsChange(value) {
    this.setState({ zhk_tcTextWaterRequirements: value });
  }
  onzhk_TcTextWaterGeneralChange(value) {
    this.setState({ zhk_tcTextWaterGeneral: value });
  }
  onzhk_TcTextSewageChange(value) {
    this.setState({ zhk_tcTextSewage: value });
  }
  onzhk_TcTextSewageRequirementsChange(value) {
    this.setState({ zhk_tcTextSewageRequirements: value });
  }
  onzhk_TcTextSewageGeneralChange(value) {
    this.setState({ zhk_tcTextSewageGeneral: value });
  }

  onks_TcTextWaterChange(value) {
    this.setState({ ks_tcTextWater: value });
  }
  onks_TcTextWaterRequirementsChange(value) {
    this.setState({ ks_tcTextWaterRequirements: value });
  }
  onks_TcTextWaterGeneralChange(value) {
    this.setState({ ks_tcTextWaterGeneral: value });
  }
  onks_TcTextSewageChange(value) {
    this.setState({ ks_tcTextSewage: value });
  }
  onks_TcTextSewageRequirementsChange(value) {
    this.setState({ ks_tcTextSewageRequirements: value });
  }
  onks_TcTextSewageGeneralChange(value) {
    this.setState({ ks_tcTextSewageGeneral: value });
  }

  onperenos_TcTextWaterChange(value) {
    this.setState({ perenos_tcTextWater: value });
  }
  onperenos_TcTextWaterRequirementsChange(value) {
    this.setState({ perenos_tcTextWaterRequirements: value });
  }
  onperenos_TcTextWaterGeneralChange(value) {
    this.setState({ perenos_tcTextWaterGeneral: value });
  }

  toggleFormTabs(tab) {
    if (tab === 'water') {
      this.setState({ waterTab: true });
      this.setState({ sewageTab: false });

      $('.water_tab').removeClass('active').addClass('active');
      $('.sewage_tab').removeClass('active');
    } else {
      this.setState({ waterTab: false });
      this.setState({ sewageTab: true });

      $('.sewage_tab').removeClass('active').addClass('active');
      $('.water_tab').removeClass('active');
    }
  }

  // this function to show one of the forms Accept/Decline
  toggleAcceptDecline(value) {
    this.setState({accept: value});
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getDirectors(){
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/getwaterdirectors", true);
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
        this.setState({water_directors_id: select_directors});
        if(this.state.ty_director_id == "" || this.state.ty_director_id == " "){
            this.setState({ty_director_id: data[0].user_id});
        }
      }
    }.bind(this);
    xhr.send();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    var userId = JSON.parse(sessionStorage.getItem('userId'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
        return false;
    }

    var providerName = roles[1];
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/provider/" + providerName + "/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);

        this.setState({apz: data});
        this.setState({showButtons: false});
        this.setState({showTechCon: false});
        this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});
        this.setState({additionalFile: data.files.filter(function(obj) { return obj.category_id === 27 })[0]});
        this.setState({surveyFile: data.files.filter(function(obj) { return obj.category_id === 22 })[0]});
        this.setState({tcTextWater: data.tc_text_water});
        this.setState({tcTextWaterRequirements: data.tc_text_water_requirements});
        this.setState({tcTextWaterGeneral: data.tc_text_water_general});
        this.setState({tcTextSewage: data.tc_text_sewage});
        this.setState({tcTextSewageRequirements: data.tc_text_sewage_requirements});
        this.setState({tcTextSewageGeneral: data.tc_text_sewage_general});
        this.setState({tab_tcTextWater: data.tc_text_water});
        this.setState({tab_tcTextWaterRequirements: data.tc_text_water_requirements});
        this.setState({tab_tcTextWaterGeneral: data.tc_text_water_general});
        this.setState({tab_tcTextSewage: data.tc_text_sewage});
        this.setState({tab_tcTextSewageRequirements: data.tc_text_sewage_requirements});
        this.setState({tab_tcTextSewageGeneral: data.tc_text_sewage_general});
        this.setState({zhk_tcTextWater: data.tc_text_water_zhk});
        this.setState({zhk_tcTextWaterRequirements: data.tc_text_water_requirements_zhk});
        this.setState({zhk_tcTextWaterGeneral: data.tc_text_water_general_zhk});
        this.setState({zhk_tcTextSewage: data.tc_text_sewage_zhk});
        this.setState({zhk_tcTextSewageRequirements: data.tc_text_sewage_requirements_zhk});
        this.setState({zhk_tcTextSewageGeneral: data.tc_text_sewage_general_zhk});
        this.setState({ks_tcTextWater: data.tc_text_water_ks});
        this.setState({ks_tcTextWaterRequirements: data.tc_text_water_requirements_ks});
        this.setState({ks_tcTextWaterGeneral: data.tc_text_water_general_ks});
        this.setState({ks_tcTextSewage: data.tc_text_sewage_ks});
        this.setState({ks_tcTextSewageRequirements: data.tc_text_sewage_requirements_ks});
        this.setState({ks_tcTextSewageGeneral: data.tc_text_sewage_general_ks});
        this.setState({perenos_tcTextWater: data.tc_text_water_perenos});
        this.setState({perenos_tcTextWaterRequirements: data.tc_text_water_requirements_perenos});
        this.setState({perenos_tcTextWaterGeneral: data.tc_text_water_general_perenos});

        if (data.commission && data.commission.apz_water_response) {
          data.commission.apz_water_response.response_text ? this.setState({description: data.commission.apz_water_response.response_text}) : this.setState({description: "" });
          data.commission.apz_water_response.connection_point ? this.setState({connectionPoint: data.commission.apz_water_response.connection_point}) : this.setState({connectionPoint: "" });
          data.commission.apz_water_response.gen_water_req ? this.setState({genWaterReq: data.commission.apz_water_response.gen_water_req}) : this.setState({genWaterReq: "" });
          data.commission.apz_water_response.drinking_water ? this.setState({drinkingWater: data.commission.apz_water_response.drinking_water}) : this.setState({drinkingWater: "" });
          data.commission.apz_water_response.prod_water ? this.setState({prodWater: data.commission.apz_water_response.prod_water}) : this.setState({prodWater: "" });
          data.commission.apz_water_response.fire_fighting_water_in ? this.setState({fireFightingWaterIn: data.commission.apz_water_response.fire_fighting_water_in}) : this.setState({fireFightingWaterIn: "" });
          data.commission.apz_water_response.fire_fighting_water_out ? this.setState({fireFightingWaterOut: data.commission.apz_water_response.fire_fighting_water_out}) : this.setState({fireFightingWaterOut: "" });
          data.commission.apz_water_response.recommendation ? this.setState({recomendation: data.commission.apz_water_response.recommendation}) : this.setState({recomendation: "" });
          data.commission.apz_water_response.estimated_water_flow_rate ? this.setState({estimatedWaterFlowRate: data.commission.apz_water_response.estimated_water_flow_rate}) : this.setState({estimatedWaterFlowRate: "" });
          data.commission.apz_water_response.existing_water_consumption ? this.setState({existingWaterConsumption: data.commission.apz_water_response.existing_water_consumption}) : this.setState({existingWaterConsumption: "" });
          data.commission.apz_water_response.sewage_estimated_water_flow_rate ? this.setState({sewageEstimatedWaterFlowRate: data.commission.apz_water_response.sewage_estimated_water_flow_rate}) : this.setState({sewageEstimatedWaterFlowRate: "" });
          data.commission.apz_water_response.sewage_existing_water_consumption ? this.setState({sewageExistingWaterConsumption: data.commission.apz_water_response.sewage_existing_water_consumption}) : this.setState({sewageExistingWaterConsumption: "" });
          data.commission.apz_water_response.water_pressure ? this.setState({waterPressure: data.commission.apz_water_response.water_pressure}) : this.setState({waterPressure: "" });
          data.commission.apz_water_response.water_customer_duties ? this.setState({waterCustomerDuties: data.commission.apz_water_response.water_customer_duties}) : this.setState({waterCustomerDuties: "" });
          data.commission.apz_water_response.sewage_customer_duties ? this.setState({sewageCustomerDuties: data.commission.apz_water_response.sewage_customer_duties}) : this.setState({sewageCustomerDuties: "" });
          data.commission.apz_water_response.doc_number ? this.setState({docNumber: data.commission.apz_water_response.doc_number}) : this.setState({docNumber: "" });
          data.commission.apz_water_response.ty_object_type ? this.setState({ty_object_type: data.commission.apz_water_response.ty_object_type}) : this.setState({ty_object_type: "ИЖС" });
          data.commission.apz_water_response.water_director_id ? this.setState({ty_director_id: data.commission.apz_water_response.water_director_id}) : this.setState({ty_director_id: "" });
          data.commission.apz_water_response.id ? this.setState({responseId: data.commission.apz_water_response.id}) : this.setState({responseId: "" });
          data.commission.apz_water_response.response ? this.setState({response: data.commission.apz_water_response.response}) : this.setState({response: "" });
          data.commission.apz_water_response.files ? this.setState({customTcFile: data.commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 23})[0]}) : this.setState({customTcFile: null});;

          if(data.commission.apz_water_response.id !== -1){
            this.setState({accept: this.state.customTcFile ? 'answer' : data.commission.apz_water_response.response ? 'accept' : 'decline'});
          }

          this.setState({responseFile: data.commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12})[0]});
          this.setState({xmlFile: data.commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 13})[0]});
        }

        this.setState({waterStatus: data.apz_water.status})

        if(data.apz_water.status === 1){
          this.setState({showTechCon: true});
        }

        if (data.status_id === 5 && data.apz_water.status === 2) {
          this.setState({showButtons: true});
        }

        if (this.state.xmlFile) {
          this.setState({isSigned: true});
        }

        this.setState({heads_responses: data.apz_provider_head_response.filter(function(obj) { return obj.role_id === 30 })});

        if (this.state.isHead && data.apz_provider_head_response.filter(function(obj) { return obj.role_id === 30 && obj.user_id === userId }).length === 0) {
          this.setState({head_accepted: false});
        }
      }
    }.bind(this);
    xhr.send();
  }

  downloadFile(id) {
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/file/download/' + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
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
              setTimeout(function() {window.URL.revokeObjectURL(url);},1000);
            };

          }());

          saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
        } else {
          alert('Не удалось скачать файл');
        }
      }
    xhr.send();
  }

  downloadAllFile(id) {
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/file/downloadAll/' + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var progressbar = $('.progress[data-category=1]');
    progressbar.css('display', 'flex');
    xhr.onprogress = function(event) {
      $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100) + '%');
    }
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data.my_files[0]);return;
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

        var JSZip = require("jszip");
        var zip = new JSZip();
        for(var i=0; i<data.my_files.length;i++){
          zip.file(data.my_files[i].file_name, base64ToArrayBuffer(data.my_files[i].file), {binary:true});
        }
        zip.generateAsync({type:"blob"})
        .then(function (content) {
            // see FileSaver.js
            saveAs(content, data.zip_name);
        });
        setTimeout(function() {
          progressbar.css('display', 'none');
          alert("Файлы успешно загружены");
          $('div', progressbar).css('width', 0);
        }.bind(this), '2000');
      } else {
        alert('Не удалось скачать файл');
        progressbar.css('display', 'none');
        $('div', progressbar).css('width', 0);
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
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
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
    let password = document.getElementById("inpPassword").value;
    let path = document.getElementById("storagePath").value;
    let keyType = "SIGN";
    if (path !== null && path !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
      if (password !== null && password !== "") {
        this.getKeys(this.state.storageAlias, path, password, keyType, "loadKeysBack");
      } else {
        alert("Введите пароль к хранилищу");
      }
    } else {
      alert("Не выбран хранилище!");
    }
  }

  loadKeysBack(result) {
    if (result.errorCode === "WRONG_PASSWORD") {
      alert("Неверный пароль!");
      return false;
    }

    let alias = "";
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
    xhr.open("get", window.url + 'api/apz/provider/get_xml/water/' + this.state.apz.id, true);
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
      var data = {xml: signedXml}

      console.log("SIGNED XML ------> \n", signedXml);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + 'api/apz/provider/save_xml/water/' + this.state.apz.id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          this.setState({ isSigned: true });
          alert("Успешно подписан.");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        } else {
          alert("Не удалось подписать файл");
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
      //console.log(event);
      this.setMissedHeartbeatsLimitToMin();
    }.bind(this);
  }

  openDialog() {
    if (window.confirm("Ошибка при подключений к прослойке. Убедитесь что программа запущена и нажмите ОК") === true) {
      window.location.reload();
    }
  }

  // this function is to save the respones form when any change is made
  saveResponseForm(apzId, status, comment){
    var token = sessionStorage.getItem('tokenInfo');
    var file = this.state.file;
    var customTcFile = this.state.customTcFile;

    var formData = new FormData();
    formData.append('file', file);
    formData.append('customTcFile', customTcFile);
    formData.append('Response', status);
    formData.append('Message', comment);
    if(status === false){
      formData.append('GenWaterReq', 0);
      formData.append('DrinkingWater', 0);
      formData.append('ProdWater', 0);
      formData.append('FireFightingWaterIn', 0);
      formData.append('FireFightingWaterOut', 0);
      formData.append('ConnectionPoint', "");
      formData.append('Recomendation', "");
      formData.append('EstimatedWaterFlowRate', "");
      formData.append('ExistingWaterConsumption', "");
      formData.append('SewageEstimatedWaterFlowRate', "");
      formData.append('SewageExistingWaterConsumption', "");
      formData.append('WaterPressure', "");
      formData.append('WaterCustomerDuties', "");
      formData.append('SewageCustomerDuties', "");
    }
    else{
      formData.append('GenWaterReq', this.state.genWaterReq);
      formData.append('DrinkingWater', this.state.drinkingWater);
      formData.append('ProdWater', this.state.prodWater);
      formData.append('FireFightingWaterIn', this.state.fireFightingWaterIn);
      formData.append('FireFightingWaterOut', this.state.fireFightingWaterOut);
      formData.append('ConnectionPoint', this.state.connectionPoint);
      formData.append('Recomendation', this.state.recomendation);
      formData.append('EstimatedWaterFlowRate', this.state.estimatedWaterFlowRate);
      formData.append('ExistingWaterConsumption', this.state.existingWaterConsumption);
      formData.append('SewageEstimatedWaterFlowRate', this.state.sewageEstimatedWaterFlowRate);
      formData.append('SewageExistingWaterConsumption', this.state.sewageExistingWaterConsumption);
      formData.append('WaterPressure', this.state.waterPressure);
      formData.append('WaterCustomerDuties', this.state.waterCustomerDuties);
      formData.append('SewageCustomerDuties', this.state.sewageCustomerDuties);
      formData.append('TcTextWater', this.state.tab_tcTextWater);
      formData.append('TcTextWaterRequirements', this.state.tab_tcTextWaterRequirements);
      formData.append('TcTextWaterGeneral', this.state.tab_tcTextWaterGeneral);
      formData.append('TcTextSewage', this.state.tab_tcTextSewage);
      formData.append('TcTextSewageRequirements', this.state.tab_tcTextSewageRequirements);
      formData.append('TcTextSewageGeneral', this.state.tab_tcTextSewageGeneral);
    }
    formData.append('DocNumber', this.state.docNumber);
    formData.append('ty_object_type', this.state.ty_object_type);
    formData.append('ty_director_id', this.state.ty_director_id);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/provider/water/" + apzId + '/save', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        this.setState({responseId: data.id});
        data.response ? this.setState({response: data.response}) : this.setState({response: ""});
        data.files ? this.setState({customTcFile: data.files.filter(function(obj) { return obj.category_id === 23})[0]}) : this.setState({customTcFile: null});;
        data.response ? this.setState({accept: this.state.customTcFile ? 'answer' : data.response ? 'accept' : 'decline'}) : this.setState({accept: "accept"});
        data.response_text ? this.setState({description: data.response_text}) : this.setState({description: ""});
        data.files ? this.setState({responseFile: data.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]}) : this.setState({responseFile: null });
        data.connection_point ? this.setState({connectionPoint: data.connection_point}) : this.setState({connectionPoint: ""});
        data.gen_water_req ? this.setState({genWaterReq: data.gen_water_req}) : this.setState({genWaterReq: ""});
        data.drinking_water ? this.setState({drinkingWater: data.drinking_water}) : this.setState({drinkingWater: ""});
        data.prod_water ? this.setState({prodWater: data.prod_water}) : this.setState({prodWater: ""});
        data.fire_fighting_water_in ? this.setState({fireFightingWaterIn: data.fire_fighting_water_in}) : this.setState({fireFightingWaterIn: ""});
        data.fire_fighting_water_out ? this.setState({fireFightingWaterOut: data.fire_fighting_water_out}) : this.setState({fireFightingWaterOut: ""});
        data.recommendation ? this.setState({recomendation: data.recommendation}) : this.setState({recomendation: ""});
        data.estimated_water_flow_rate ? this.setState({estimatedWaterFlowRate: data.estimated_water_flow_rate}) : this.setState({estimatedWaterFlowRate: ""});
        data.existing_water_consumption ? this.setState({existingWaterConsumption: data.existing_water_consumption}) : this.setState({existingWaterConsumption: ""});
        data.sewage_estimated_water_flow_rate ? this.setState({sewageEstimatedWaterFlowRate: data.sewage_estimated_water_flow_rate}) : this.setState({sewageEstimatedWaterFlowRate: ""});
        data.sewage_existing_water_consumption ? this.setState({sewageExistingWaterConsumption: data.sewage_existing_water_consumption}) : this.setState({sewageExistingWaterConsumption: ""});
        data.water_pressure ? this.setState({waterPressure: data.water_pressure}) : this.setState({waterPressure: ""});
        data.water_customer_duties ? this.setState({waterCustomerDuties: data.water_customer_duties}) : this.setState({waterCustomerDuties: ""});
        data.sewage_customer_duties ? this.setState({sewageCustomerDuties: data.sewage_customer_duties}) : this.setState({sewageCustomerDuties: ""});

        if (this.state.callSaveFromSend) {
          this.setState({callSaveFromSend: false});
          this.sendWaterResponse(apzId, status, comment);
        } else {
          alert("Ответ сохранен!");

          this.setState({showSignButtons: true});
        }
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData);
  }

  // this function is to send the final response
  sendWaterResponse(apzId, status, comment) {
    if(this.state.responseId <= 0 || this.state.responseId > 0 && this.state.response != status){
      console.log('saving');
      this.setState({callSaveFromSend: true});
      this.saveResponseForm(apzId, status, comment);
    }
    else{
      console.log('updating or sending');
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/provider/water/" + apzId + '/update', true);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);

          if(data.response === 1) {
            alert("Заявление принято!");
            this.setState({ showButtons: false });
            this.setState({ waterStatus: 1 });
            this.setState({ showTechCon: true });
          }
          else if(data.response === 0) {
            alert("Заявление отклонено!");
            this.setState({ showButtons: false });
            this.setState({ waterStatus: 0 });
          }
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        }
      }.bind(this);
      xhr.send(JSON.stringify({docNumber: this.state.docNumber}));
    }
  }

  sendHeadResponse(apzId, status, comment) {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();

    if (!comment) {
      alert('Заполните поле "Комментарий"');
      return false;
    }

    var formData = new FormData();
    formData.append('status', status);
    formData.append('comment', comment);

    xhr.open("post", window.url + "api/apz/provider/headwater/" + apzId + '/response', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        alert('Ответ успешно отправлен');
        this.setState({head_accepted: true});
        this.setState({heads_responses: data.head_responses});
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

  // print technical condition
  printTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/water/" + apzId, true);
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

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Вода-" + project + formated_date + ".pdf");
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

  printMainInfo()
  {
      var divToPrint=document.getElementById("printTable");
      var newWin= window.open("");
      newWin.document.write(divToPrint.outerHTML);
      var elements = newWin.document.getElementsByClassName('shukichi');
      while(elements.length > 0){
          elements[0].parentNode.removeChild(elements[0]);
      }
      newWin.print();
      newWin.close();
  }

  printData()
{
   var divToPrint=document.getElementById("printTable");
   var divToPrints=document.getElementById("detail_table");
   var newWin= window.open("");
   newWin.document.write(divToPrint.outerHTML + divToPrints.outerHTML);
    var elements = newWin.document.getElementsByClassName('shukichi');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
   newWin.print();
   newWin.close();
}
handleDirectorIDChange(event){
  this.setState({ty_director_id: event.target.value});
}
handleObjTypeChange(event){
  this.setState({ty_object_type: event.target.value});
  switch(event.target.value) {
        case 'ИЖС':
            this.setState({tab_tcTextWater: this.state.tcTextWater});
            this.setState({tab_tcTextWaterRequirements: this.state.tcTextWaterRequirements});
            this.setState({tab_tcTextWaterGeneral: this.state.tcTextWaterGeneral});
            this.setState({tab_tcTextSewage: this.state.tcTextSewage});
            this.setState({tab_tcTextSewageRequirements: this.state.tcTextSewageRequirements});
            this.setState({tab_tcTextSewageGeneral: this.state.tcTextSewageGeneral});
            break;
        case 'ЖК':
            this.setState({tab_tcTextWater: this.state.zhk_tcTextWater});
            this.setState({tab_tcTextWaterRequirements: this.state.zhk_tcTextWaterRequirements});
            this.setState({tab_tcTextWaterGeneral: this.state.zhk_tcTextWaterGeneral});
            this.setState({tab_tcTextSewage: this.state.zhk_tcTextSewage});
            this.setState({tab_tcTextSewageRequirements: this.state.zhk_tcTextSewageRequirements});
            this.setState({tab_tcTextSewageGeneral: this.state.zhk_tcTextSewageGeneral});
            break;
        case 'КоммСтр':
            this.setState({tab_tcTextWater: this.state.ks_tcTextWater});
            this.setState({tab_tcTextWaterRequirements: this.state.ks_tcTextWaterRequirements});
            this.setState({tab_tcTextWaterGeneral: this.state.ks_tcTextWaterGeneral});
            this.setState({tab_tcTextSewage: this.state.ks_tcTextSewage});
            this.setState({tab_tcTextSewageRequirements: this.state.ks_tcTextSewageRequirements});
            this.setState({tab_tcTextSewageGeneral: this.state.ks_tcTextSewageGeneral});
            break;
        case 'Перенос':
            this.setState({tab_tcTextWater: this.state.perenos_tcTextWater});
            this.setState({tab_tcTextWaterRequirements: this.state.perenos_tcTextWaterRequirements});
            this.setState({tab_tcTextWaterGeneral: this.state.perenos_tcTextWaterGeneral});
            this.setState({tab_tcTextSewage: ""});
            this.setState({tab_tcTextSewageRequirements: ""});
            this.setState({tab_tcTextSewageGeneral: ""});
            break;
        default:
            this.setState({tab_tcTextWater: this.state.tcTextWater});
            this.setState({tab_tcTextWaterRequirements: this.state.tcTextWaterRequirements});
            this.setState({tab_tcTextWaterGeneral: this.state.tcTextWaterGeneral});
            this.setState({tab_tcTextSewage: this.state.tcTextSewage});
            this.setState({tab_tcTextSewageRequirements: this.state.tcTextSewageRequirements});
            this.setState({tab_tcTextSewageGeneral: this.state.tcTextSewageGeneral});
    }
}

  render() {
    var apz = this.state.apz;

    if (apz.length === 0) {
      return false;
    }

    return (
      <div className="row">
        <div className="col-sm-12">
          <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>
        </div>

        <div className="col-sm-6">
          <table className="table table-bordered table-striped"  style={{textAlign: 'left'}} id="printTable">
            <tbody>
              <tr>
                <td><b>ИД заявки</b></td>
                <td>{apz.id}</td>
              </tr>
              <tr>
                <td><b>Заявитель</b></td>
                <td>{apz.applicant}</td>
              </tr>
              {apz.user.bin &&
                <tr>
                  <td><b>БИН</b></td>
                  <td>{apz.user.bin}</td>
                </tr>
              }
              {!apz.user.bin &&
                <tr>
                  <td><b>ИИН</b></td>
                  <td>{apz.user.iin}</td>
                </tr>
              }
              <tr>
                <td><b>Телефон</b></td>
                <td>{apz.phone}</td>
              </tr>
              <tr>
                <td><b>Заказчик</b></td>
                <td>{apz.customer}</td>
              </tr>
              <tr>
                <td><b>Разработчик</b></td>
                <td>{apz.designer}</td>
              </tr>
              <tr>
                <td><b>Название проекта</b></td>
                <td>{apz.project_name}</td>
              </tr>
              <tr>
                <td><b>Адрес проектируемого объекта</b></td>
                <td>
                  {apz.project_address}

                  {apz.project_address_coordinates &&
                    <a className="ml-2 pointer text-info" onClick={this.toggleMap.bind(this, true)}>Показать на карте</a>
                  }
                </td>
              </tr>
            </tbody>
          </table>
            <button className="btn btn-raised btn-success" onClick={this.printMainInfo}>Печать общей информации</button>

        </div>

        <div className="col-sm-6">
          <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
            <tbody>
              <tr>
                <td><b>Срок строительства</b></td>
                <td>{apz.object_term}</td>
              </tr>
              <tr>
                <td><b>Этажность</b></td>
                <td>{apz.object_level}</td>
              </tr>
              <tr>
                <td><b>Площадь здания</b></td>
                <td>{apz.object_area}</td>
              </tr>
              <tr>
                <td><b>Количество квартир</b></td>
                <td>{apz.object_rooms}</td>
              </tr>
              <tr>
                <td><b>Дата заявления</b></td>
                <td>{apz.created_at && this.toDate(apz.created_at)}</td>
              </tr>

              {this.state.personalIdFile &&
                <tr className="shukichi">
                  <td><b>Уд. лич./ Реквизиты</b></td>
                  <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id)}>Скачать</a></td>
                </tr>
              }

              {this.state.confirmedTaskFile &&
                <tr className="shukichi">
                  <td><b>Утвержденное задание</b></td>
                  <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.confirmedTaskFile.id)}>Скачать</a></td>
                </tr>
              }

              {this.state.titleDocumentFile &&
                <tr className="shukichi">
                  <td><b>Правоустанавл. документ</b></td>
                  <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.titleDocumentFile.id)}>Скачать</a></td>
                </tr>
              }

              {this.state.additionalFile &&
                <tr className="shukichi">
                  <td><b>Дополнительно</b></td>
                  <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.additionalFile.id)}>Скачать</a></td>
                </tr>
              }

              {this.state.surveyFile &&
                <tr className="shukichi">
                  <td><b>Топографическая съемка</b></td>
                  <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.surveyFile.id)}>Скачать</a></td>
                </tr>
              }
              {(this.state.personalIdFile || this.state.confirmedTaskFile || this.state.titleDocumentFile || this.state.additionalFile || this.state.surveyFile) &&
                <tr className="shukichi">
                  <td><a className="text-info pointer" onClick={this.downloadAllFile.bind(this, this.state.apz.id)}><img style={{height:'16px'}} src="./images/download.png"/>Скачать одним архивом</a>
                  <div className="progress mb-2" data-category="1" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  </td><td></td>
                </tr>
              }
            </tbody>
          </table>
       </div>
        <div className={apz.apz_sewage ? 'col-sm-6' : 'col-sm-12'}>
          <h5 className="block-title-2 mt-3 mb-3">Детали водоснабжения</h5>

          <table className="table table-bordered table-striped" style={{textAlign: 'left'}} id="detail_table">
            <tbody>
              <tr>
                <td>Общая потребность (м<sup>3</sup>/сутки)</td>
                <td>{apz.apz_water.requirement}</td>
              </tr>
              <tr>
                <td>Общая потребность питьевой воды (м<sup>3</sup>/час)</td>
                <td>{apz.apz_water.requirement_hour}</td>
              </tr>
              <tr>
                <td>Общая потребность (л/сек макс)</td>
                <td>{apz.apz_water.requirement_sec}</td>
              </tr>
              <tr>
                <td>Хозпитьевые нужды (м<sup>3</sup>/сутки)</td>
                <td>{apz.apz_water.drinking}</td>
              </tr>
              <tr>
                <td>Хозпитьевые нужды (м<sup>3</sup>/час)</td>
                <td>{apz.apz_water.drinking_hour}</td>
              </tr>
              <tr>
                <td>Хозпитьевые нужды (л/сек макс)</td>
                <td>{apz.apz_water.drinking_sec}</td>
              </tr>
              <tr>
                <td>Производственные нужды (м<sup>3</sup>/сутки)</td>
                <td>{apz.apz_water.production}</td>
              </tr>
              <tr>
                <td>Производственные нужды (м<sup>3</sup>/час)</td>
                <td>{apz.apz_water.production_hour}</td>
              </tr>
              <tr>
                <td>Производственные нужды (л/сек макс)</td>
                <td>{apz.apz_water.production_sec}</td>
              </tr>
              <tr>
                <td>Расходы пожаротушения (л/сек наружное)</td>
                <td>{apz.apz_water.fire_fighting}</td>
              </tr>
              <tr>
                <td>Расходы пожаротушения (л/сек внутреннее)</td>
                <td>{apz.apz_water.fire_fighting}</td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-raised btn-success" onClick={this.printData}>Печать</button>

        </div>

        {apz.apz_sewage &&
          <div className="col-sm-6">
            <h5 className="block-title-2 mt-3 mb-3">Детали водоотведения</h5>

            <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
              <tbody>
                <tr>
                  <td>Общее количество сточных вод (м<sup>3</sup>/сутки)</td>
                  <td>{apz.apz_sewage.amount}</td>
                </tr>
                <tr>
                  <td>Общее количество сточных вод (м<sup>3</sup>/час макс)</td>
                  <td>{apz.apz_sewage.amount_hour}</td>
                </tr>
                <tr>
                  <td>Фекальных (м<sup>3</sup>/сутки)</td>
                  <td>{apz.apz_sewage.feksal}</td>
                </tr>
                <tr>
                  <td>Фекальных (м<sup>3</sup>/час макс)</td>
                  <td>{apz.apz_sewage.feksal_hour}</td>
                </tr>
                <tr>
                  <td>Производственно-загрязненных (м<sup>3</sup>/сутки)</td>
                  <td>{apz.apz_sewage.production}</td>
                </tr>
                <tr>
                  <td>Производственно-загрязненных (м<sup>3</sup>/час макс)</td>
                  <td>{apz.apz_sewage.production_hour}</td>
                </tr>
                <tr>
                  <td>Условно-чистых сбрасываемых на городскую сеть (м<sup>3</sup>/сутки)</td>
                  <td>{apz.apz_sewage.to_city}</td>
                </tr>
                <tr>
                  <td>Условно-чистых сбрасываемых на городскую сеть (м<sup>3</sup>/час макс)</td>
                  <td>{apz.apz_sewage.to_city_hour}</td>
                </tr>
              </tbody>
            </table>
          </div>
        }

        <div className="col-sm-12">
          {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}

          <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>
        </div>

        <div className="col-sm-12">
          {apz.commission && apz.commission.comment &&
            <div className="alert alert-info mt-3">
              {apz.commission.comment}
            </div>
          }

          {(!this.state.isHead && !this.state.isDirector) && this.state.heads_responses.length > 0 &&
            <div style={{marginBottom: '50px'}}>
              <h5 className="block-title-2 mt-4 mb-3">Комментарии:</h5>

              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <th>ФИО</th>
                    <th>Комментарий</th>
                    <th>Дата</th>
                  </tr>
                  {this.state.heads_responses.map(function(item, index) {
                    return(
                      <tr key={index}>
                        <td width="40%">
                          {item.user.name}
                        </td>
                        <td width="40%">{item.comments}</td>
                        <td>{this.toDate(item.created_at)}</td>
                      </tr>
                      );
                    }.bind(this))
                  }
                </tbody>
              </table>
            </div>
          }

          <div className="row provider_answer_top" style={{margin: '16px 0 0'}}>
            {(this.state.isPerformer === true || this.state.responseId != 0) &&
              <div className="col-sm-6">
                <h5 className="block-title-2 mt-3 mb-3" style={{display: 'inline'}}>Ответ</h5>
              </div>
            }

            <div className="col-sm-6 pr-0">
              {this.state.showButtons && !this.state.isSigned && this.state.isPerformer &&
                <div className="btn-group" style={{float: 'right', margin: '0'}}>
                  <button className={'btn btn-raised ' + (this.state.accept === 'accept' ? 'btn-success' : 'btn-secondary')} style={{marginRight: '5px'}} onClick={this.toggleAcceptDecline.bind(this, "accept")}>
                    Одобрить
                  </button>
                  <button className={'btn btn-raised ' + (this.state.accept === 'answer' ? 'btn-success' : 'btn-secondary')} style={{marginRight: '5px'}} onClick={this.toggleAcceptDecline.bind(this, "answer")}>
                    Ответ
                  </button>
                  <button className={'btn btn-raised ' + (this.state.accept === 'decline' ? 'btn-danger' : 'btn-secondary')} onClick={this.toggleAcceptDecline.bind(this, "decline")}>
                    Отклонить
                  </button>
                </div>
              }
            </div>
          </div>

          {this.state.accept === "accept" && this.state.waterStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <form className="provider_answer_body" style={{border: 'solid 1px #46A149', padding: '20px'}}>
              <div className="row pt-0">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Точка подключения</label>
                    <input type="text" className="form-control" id="connectionPoint" placeholder="" value={this.state.connectionPoint} onChange={this.onConnectionPointChange} />
                  </div>
                  <div className="form-group">
                    <label>Номер документа</label>
                    <input type="text" className="form-control" id="docNumber" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                  </div>
                  <div className="form-group">
                    <label>Общая потребность (м<sup>3</sup>/сутки)</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.genWaterReq} onChange={this.onGenWaterReqChange} />
                  </div>
                  <div className="form-group">
                    <label>Хозпитьевые нужды (м<sup>3</sup>/сутки)</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.drinkingWater} onChange={this.onDrinkingWaterChange} />
                  </div>
                  <div className="form-group">
                    <label>Производственные нужды (м<sup>3</sup>/сутки)</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.prodWater} onChange={this.onProdWaterChange} />
                  </div>
                  <div className="form-group">
                    <label>Расчетный расход воды (Водопотребление)</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.estimatedWaterFlowRate} onChange={this.onEstimatedWaterFlowRateChange} />
                  </div>
                  <div className="form-group">
                    <label>Существующий расход воды (Водопотребление)</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.existingWaterConsumption} onChange={this.onExistingWaterConsumptionChange} />
                  </div>

                  {this.state.apz.object_type != "ИЖС" &&
                    <div>
                      <div className="form-group">
                        <label>Давление в сети городского водопровода в точке подключения</label>
                        <input disabled='disabled' title="Пожалуйста заполните этот пункт в тексте ТУ ВОДОПОТРЕБЛЕНИЕ" type="number" step="any" className="form-control" placeholder="" value={this.state.waterPressure} onChange={this.onWaterPressureChange} />
                      </div>
                      <div className="form-group">
                        <label>Для подключения к городским сетям и сооружениям водопотребление Заказчик обязан:</label>
                        <textarea disabled='disabled' title="Пожалуйста заполните этот пункт в тексте ТУ ВОДОПОТРЕБЛЕНИЕ" rows="5" className="form-control" value={this.state.waterCustomerDuties} onChange={this.onWaterCustomerDutiesChange} placeholder="Описание"></textarea>
                      </div>
                    </div>
                  }
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Расчетный расход сточных вод</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.sewageEstimatedWaterFlowRate} onChange={this.onSewageEstimatedWaterFlowRateChange} />
                  </div>
                  <div className="form-group">
                    <label>Существующий расход сточных вод</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.sewageExistingWaterConsumption} onChange={this.onSewageExistingWaterConsumptionChange} />
                  </div>
                  <div className="form-group">
                    <label>Расходы внутреннего пожаротушения (л/сек)</label>
                    <input type="number" step="any" className="form-control" value={this.state.fireFightingWaterIn} onChange={this.onFireFightingWaterInChange} />
                  </div>
                  <div className="form-group">
                    <label>Расходы наружного пожаротушения (л/сек)</label>
                    <input type="number" step="any" className="form-control" value={this.state.fireFightingWaterOut} onChange={this.onFireFightingWaterOutChange} />
                  </div>
                  <div className="form-group">
                    <label>Рекомендация</label>
                    <textarea rows="5" className="form-control" value={this.state.recomendation} onChange={this.onRecomendationChange} placeholder="Описание"></textarea>
                  </div>

                  {this.state.apz.object_type != "ИЖС" &&
                    <div className="form-group">
                      <label>Для присоединения к городским сетям и сооружениям водоотведения Заказчик обязан:</label>
                      <textarea disabled='disabled' title="Пожалуйста заполните этот пункт в тексте ТУ ВОДООТВЕДЕНИЕ" rows="5" className="form-control" value={this.state.sewageCustomerDuties} onChange={this.onSewageCustomerDutiesChange} placeholder="Описание"></textarea>
                    </div>
                  }

                  {(this.state.response === true && this.state.responseFile) &&
                    <div className="form-group">
                      <label style={{display: 'block'}}>Прикрепленный файл</label>
                      <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                        Скачать
                      </a>
                    </div>
                  }
                  <div className="form-group">
                    <label htmlFor="upload_file">Прикрепить файл</label>
                    <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div style={{paddingLeft:'5px', fontSize: '18px', margin: '10px 0px'}}>
                    <b>Выберите тип ТУ:</b>
                    <select style={{padding: '0px 4px', margin: '5px'}} value={this.state.ty_object_type} onChange={this.handleObjTypeChange.bind(this)}>
                      <option value="ИЖС">ИЖС</option>
                      <option value="ЖК">ЖК</option>
                      <option value="КоммСтр">Коммерческие структуры</option>
                      <option value="Перенос">Перенос сетей</option>
                    </select>
                  </div>
                  <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                      <a className="water_tab nav-link pointer active" onClick={this.toggleFormTabs.bind(this, 'water')}>Водопотребление</a>
                    </li>
                    <li className="nav-item">
                      <a className="sewage_tab nav-link pointer" onClick={this.toggleFormTabs.bind(this, 'sewage')}>Водоотведение</a>
                    </li>
                  </ul>

                  {this.state.waterTab &&
                    <div>
                      <div className="form-group">
                        <label><b>1. Водопотребление</b></label>
                        <ReactQuill value={this.state.tab_tcTextWater} onChange={this.onTcTextWaterChange} />
                      </div>
                      <div className="form-group">
                        <label><b>2. Другие требования</b></label>
                        <ReactQuill value={this.state.tab_tcTextWaterRequirements} onChange={this.onTcTextWaterRequirementsChange} />
                      </div>
                      <div className="form-group">
                        <label><b>3. Общие положения</b></label>
                        <ReactQuill value={this.state.tab_tcTextWaterGeneral} onChange={this.onTcTextWaterGeneralChange} />
                      </div>
                    </div>
                  }

                  {this.state.sewageTab &&
                    <div>
                      <div className="form-group">
                        <label><b>1. Водопотребление</b></label>
                        <ReactQuill value={this.state.tab_tcTextSewage} onChange={this.onTcTextSewageChange} />
                      </div>
                      <div className="form-group">
                        <label><b>2. Другие требования</b></label>
                        <ReactQuill value={this.state.tab_tcTextSewageRequirements} onChange={this.onTcTextSewageRequirementsChange} />
                      </div>
                      <div className="form-group">
                        <label><b>3. Общие положения</b></label>
                        <ReactQuill value={this.state.tab_tcTextSewageGeneral} onChange={this.onTcTextSewageGeneralChange} />
                      </div>
                    </div>
                  }

                  {!this.state.xmlFile &&
                    <div className="form-group">
                      <div style={{paddingLeft:'5px', fontSize: '18px', margin: '10px 0px'}}>
                        <b>Выберите директора:</b>
                        <select id="water_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.ty_director_id} onChange={this.handleDirectorIDChange.bind(this)}>
                          {this.state.water_directors_id}
                        </select>
                      </div>
                      <button type="button" style={{ marginRight: '5px' }} className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, "accept", "")}>
                        Сохранить
                      </button>

                      {/*<button type="button" style={{ marginRight: '5px' }} className="btn btn-secondary" onClick={this.sendWaterResponse.bind(this, apz.id, true, "")}>
                        Отправить без ЭЦП
                      </button>*/}

                      {this.state.response &&
                        <button type="button" className="btn btn-secondary" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>
                          Предварительный просмотр
                        </button>
                      }
                      <p style={{color:'#777777'}}>Сохранение перезаписывает предыдущий вариант.</p>
                    </div>
                  }
                </div>
              </div>
            </form>
          }

          {this.state.accept === "accept" && this.state.responseId != 0 && (this.state.waterStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>Точка подключения</td>
                    <td>{this.state.connectionPoint}</td>
                  </tr>
                  <tr>
                    <td>Номер документа</td>
                    <td>{this.state.docNumber}</td>
                  </tr>
                  <tr>
                    <td>Общая потребность (м<sup>3</sup>/сутки)</td>
                    <td>{this.state.genWaterReq}</td>
                  </tr>
                  <tr>
                    <td>Хозпитьевые нужды (м<sup>3</sup>/сутки)</td>
                    <td>{this.state.drinkingWater}</td>
                  </tr>
                  <tr>
                    <td>Производственные нужды (м<sup>3</sup>/час)</td>
                    <td>{this.state.prodWater}</td>
                  </tr>
                  <tr>
                    <td>Расходы пожаротушения внутренные (л/сек)</td>
                    <td>{this.state.fireFightingWaterIn}</td>
                  </tr>
                  <tr>
                    <td>Расходы пожаротушения внешные (л/сек)</td>
                    <td>{this.state.fireFightingWaterOut}</td>
                  </tr>
                  <tr>
                    <td>Рекомендация</td>
                    <td>{this.state.recomendation}</td>
                  </tr>
                  {this.state.responseFile &&
                    <tr>
                      <td>Прикрепленный файл</td>
                      <td>
                        <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                          Скачать
                        </a>
                      </td>
                    </tr>
                  }

                  {this.state.showTechCon === false && (this.state.isDirector || this.state.isHead) &&
                    <tr>
                      <td>Ответ в PDF</td>
                      <td>
                        <a className="pointer text-info" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>
                          Скачать
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          {this.state.accept === 'answer' && this.state.waterStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <div className="provider_answer_body" style={{border: 'solid 1px #46A149', padding: '20px'}}>
              <div className="form-group">
                <label htmlFor="custom_tc_file">
                  Прикрепить файл

                  {this.state.customTcFile &&
                    <span style={{paddingLeft: '5px'}}>
                      (текущий файл: <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.customTcFile.id)}>{this.state.customTcFile.name}</a>)
                    </span>
                  }
                </label>
                <input type="file" id="custom_tc_file" className="form-control" onChange={this.onCustomTcFileChange} />
              </div>

              <div style={{paddingLeft:'5px', fontSize: '18px', margin: '10px 0px'}}>
                <b>Выберите директора:</b>
                <select id="water_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.ty_director_id} onChange={this.handleDirectorIDChange.bind(this)}>
                  {this.state.water_directors_id}
                </select>
              </div>

              {!this.state.xmlFile &&
                <div className="form-group" style={{marginBottom:'5px'}}>
                  <button type="button" className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, true, "")}>
                    Сохранить
                  </button>
                </div>
              }
              <p style={{color:'#777777', marginBottom:'0px'}}>Если есть сканированное техническое условие. Сканированный ТУ заменяет ТУ созданный сайтом.</p>
              <p style={{color:'#777777'}}>Сохранение перезаписывает предыдущий файл.</p>
            </div>
          }

          {this.state.accept === 'answer' && this.state.responseId != 0 && (this.state.waterStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <table className="table table-bordered table-striped">
              <tbody>
              {this.state.customTcFile &&
                <tr>
                  <td>Технические условия</td>
                  <td><a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.customTcFile.id)}>Скачать</a></td>
                </tr>
              }
              </tbody>
            </table>
          }

          {this.state.heads_responses.length > 0 &&
            <div>
              <h5 className="block-title-2 mt-4 mb-3">Комментарии:</h5>

              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <th>ФИО</th>
                    <th>Комментарий</th>
                    <th>Дата</th>
                  </tr>
                  {this.state.heads_responses.map(function(item, index) {
                    return(
                      <tr key={index}>
                        <td width="40%">
                          {item.user.name}
                        </td>
                        <td width="40%">{item.comments}</td>
                        <td>{this.toDate(item.created_at)}</td>
                      </tr>
                      );
                    }.bind(this))
                  }
                </tbody>
              </table>
            </div>
          }

          {this.state.isHead &&
            <div className={this.state.showButtons ? '' : 'invisible'}>
              <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                <textarea style={{marginBottom: '10px'}} placeholder="Комментарий" rows="7" cols="50" className="form-control" value={this.state.headComment} onChange={this.onHeadCommentChange}></textarea>
                <button className="btn btn-raised btn-success" onClick={this.sendHeadResponse.bind(this, apz.id, true, this.state.headComment)}>
                  Отправить
                </button>
              </div>
            </div>
          }

          {this.state.isDirector && this.state.waterStatus != 0 &&
            <div>
              {!this.state.xmlFile && !this.state.isSigned && apz.status_id === 5 &&
                <div style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                  <div>Выберите хранилище</div>

                  <div className="btn-group mb-2" role="group" style={{margin: 'auto', display: 'table'}}>
                    <button className="btn btn-raised" style={{marginRight: '5px'}} onClick={this.chooseFile.bind(this)}>файловое хранилище</button>
                    <button className="btn btn-raised" onClick={this.chooseStorage.bind(this, 'AKKaztokenStore')}>eToken</button>
                  </div>

                  <div className="form-group">
                    <input className="form-control" placeholder="Путь к ключу" type="hidden" id="storagePath" />
                    <input className="form-control" placeholder="Пароль" id="inpPassword" type="password" />
                  </div>

                  <div className="form-group">
                    <button className="btn btn-secondary" type="button" onClick={this.signMessage.bind(this)}>Подписать</button>
                  </div>
                </div>
              }
            </div>
          }

          {this.state.waterStatus === 2 && this.state.isSigned && this.state.isPerformer &&
            <div style={{margin: 'auto', marginTop: '20px', display: 'table', width: '30%'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={this.sendWaterResponse.bind(this, apz.id, true, "")}>
                  Отправить инженеру
                </button>
              </div>
            </div>
          }

          {this.state.accept === "decline" && this.state.waterStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <form className="provider_answer_body" style={{border: 'solid 1px #f44336', padding: '20px'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
                <label>Причина отклонения</label>
                <textarea rows="5" className="form-control" value={this.state.description} onChange={this.onDescriptionChange} placeholder="Описание"></textarea>
              </div>

              {(this.state.response === false && this.state.responseFile) &&
                <div className="form-group">
                  <label style={{display: 'block'}}>Прикрепленный файл</label>
                  <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                    Скачать
                  </a>
                </div>
              }

              <div className="form-group">
                <label htmlFor="upload_file">Прикрепить файл</label>
                <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-secondary" onClick={this.sendWaterResponse.bind(this, apz.id, false, this.state.description)}>
                  Вернуть архитектору
                </button>
              </div>
            </form>
          }

          {this.state.accept === 'decline' && this.state.responseId != 0 && (this.state.waterStatus === 0 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>Причина отклонения</td>
                    <td>{this.state.description}</td>
                  </tr>
                  <tr>
                    <td>Номер документа</td>
                    <td>{this.state.docNumber}</td>
                  </tr>

                  {this.state.responseFile &&
                    <tr>
                      <td>Прикрепленный файл</td>
                      <td>
                        <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                          Скачать
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          {!this.state.customTcFile && <div className={this.state.showTechCon ? '' : 'invisible'}>
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td style={{width: '40%'}}><b>Сформированный ТУ</b></td>
                  <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                </tr>
              </tbody>
            </table>
          </div>}
        </div>

        {apz.state_history.length > 0 &&
          <div className="col-sm-12">
            <h5 className="block-title-2 mb-3 mt-3">Логи</h5>
            <div className="border px-3 py-2">
              {apz.state_history.map(function(state, index) {
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
          <Link className="btn btn-outline-secondary pull-right" to={'/panel/water-provider/apz/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
        </div>
      </div>
    )
  }
}

class ShowMap extends React.Component {
  render() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    var coordinates = this.props.coordinates;

    return (
      <div>
        <h5 className="block-title-2 mt-5 mb-3">Карта</h5>
        <div className="col-md-12 viewDiv">
          <EsriLoaderReact options={options}
            modulesToLoad={[
              'esri/views/MapView',

              'esri/widgets/LayerList',

              'esri/WebScene',
              'esri/config',
              'esri/layers/FeatureLayer',
              'esri/layers/TileLayer',
              'esri/widgets/Search',
              'esri/WebMap',
              'esri/geometry/support/webMercatorUtils',
              'dojo/dom',
              'esri/Graphic',
              'esri/portal/PortalItem',
              'dojo/domReady!'
            ]}

            onReady={({loadedModules: [MapView, LayerList, WebScene, esriConfig, FeatureLayer, TileLayer, Search,
              WebMap, webMercatorUtils, dom, Graphic, PortalItem], containerNode}) => {
              esriConfig.portalUrl = "https://gis.uaig.kz/arcgis";
              var map = new WebMap({
                portalItem: {
                  id: "248f0662b4fb4c93b58d4d1ae046efc0"
                }
              });
              /*
              var waterLines = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%A2%D1%80%D1%83%D0%B1%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D1%8B_%D0%B2%D0%BE%D0%B4%D0%BE%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F2/FeatureServer",
                outFields: ["*"],
                title: "Трубопроводы водоснабжения"
              });
              map.add(waterLines);

              var waterLineSafetyZone = new FeatureLayer({
                url: 'https://gis.uaig.kz/server/rest/services/Hosted/%D0%9E%D1%85%D1%80%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B7%D0%BE%D0%BD%D0%B0_%D0%B2%D0%BE%D0%B4%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D0%B0/FeatureServer',
                outFields: ["*"],
                title: "Охранная зона водопровода"
              });
              map.add(waterLineSafetyZone);

              var waterResourse = new FeatureLayer({
                url: 'https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%BE%D0%BD%D0%B0_%D0%BE%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D0%B2%D0%BE%D0%B4%D0%BD%D1%8B%D0%BC%D0%B8_%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%B0%D0%BC%D0%B8/FeatureServer',
                outFields: ["*"],
                title: "Зоны обеспеч. водными ресурсами"
              });
              map.add(waterResourse);

              var flGosAkts = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                outFields: ["*"],
                title: "Гос акты"
              });
              map.add(flGosAkts);
              */

              if (coordinates) {
                var coordinatesArray = coordinates.split(", ");

                var view = new MapView({
                  container: containerNode,
                  map: map,
                  center: [parseFloat(coordinatesArray[0]), parseFloat(coordinatesArray[1])],
                  scale: 10000
                });

                var point = {
                  type: "point",
                  longitude: parseFloat(coordinatesArray[0]),
                  latitude: parseFloat(coordinatesArray[1])
                };

                var markerSymbol = {
                  type: "simple-marker",
                  color: [226, 119, 40],
                  outline: {
                    color: [255, 255, 255],
                    width: 2
                  }
                };

                var pointGraphic = new Graphic({
                  geometry: point,
                  symbol: markerSymbol
                });

                view.graphics.add(pointGraphic);
              } else {
                  view = new MapView({
                  container: containerNode,
                  map: map,
                  center: [76.886, 43.250],
                  scale: 10000
                });
              }

              var searchWidget = new Search({
                view: view,
                sources: [{
                  featureLayer: new FeatureLayer({
                    //url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                    url: "https://gis.uaig.kz/server/rest/services/Map2d/объекты_города/MapServer/20",
                    popupTemplate: { // autocasts as new PopupTemplate()
                      title: `<table>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Кадастровый номер:</td>  <td class="attrValue">`+"{kad_n}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Код района:</td>  <td class="attrValue">`+"{coder}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Адрес:</td>  <td class="attrValue">`+"{adress}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Целевое назначение</td>  <td class="attrValue">`+"{funk}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Площадь зу:</td>  <td class="attrValue">`+"{s}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Право:</td>  <td class="attrValue">`+"{right_}"+`</td></tr>
                      </table>`
                    }
                  }),
                  searchFields: ["kad_n"],
                  displayField: "kad_n",
                  exactMatch: false,
                  outFields: ["*"],
                  name: "Кадастровый номер",
                  placeholder: "введите кадастровый номер",
                  maxResults: 6,
                  maxSuggestions: 6,
                  enableSuggestions: true,
                  minCharacters: 0
                },
                {
                  featureLayer: new FeatureLayer({
                    url: "https://gis.uaig.kz/server/rest/services/Map2d/Базовая_карта_MIL1/MapServer/16",
                    popupTemplate: {
                      title: `<table>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);width:100%"><td class="attrName">Адресный массив:</td>  <td class="attrValue">`+"{id_adr_massive}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Количество этажей:</td>  <td class="attrValue">`+"{floor}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Год постройки:</td>  <td class="attrValue">`+"{year_of_foundation}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Общая площадь:</td>  <td class="attrValue">`+"{obsch_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Объем здания, м3:</td>  <td class="attrValue">`+"{volume_build}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Площадь жил. помещения:</td>  <td class="attrValue">`+"{zhil_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Площадь застройки, м2:</td>  <td class="attrValue">`+"{zastr_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Наименование первичной улицы:</td>  <td class="attrValue">`+"{street_name_1}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Основной номер дома:</td>  <td class="attrValue">`+"{number_1}"+`</td></tr>
                      </table>`
                    }
                  }),
                  searchFields: ["street_name_1"],
                  displayField: "street_name_1",
                  exactMatch: false,
                  outFields: ["*"],
                  name: "Здания и сооружения",
                  placeholder: "введите адрес",
                  maxResults: 6,
                  maxSuggestions: 6,
                  enableSuggestions: true,
                  minCharacters: 0
                }]
              });

              view.when( function(callback){
                var layerList = new LayerList({
                  view: view
                });

                // Add the search widget to the top right corner of the view
                view.ui.add(searchWidget, {
                  position: "top-right"
                });

                // Add widget to the bottom right corner of the view
                view.ui.add(layerList, "bottom-right");

              }, function(error) {
                console.log('MapView promise rejected! Message: ', error);
              });
            }}
          />
        </div>
      </div>
    )
  }
}
