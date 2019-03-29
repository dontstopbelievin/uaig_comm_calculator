import React from 'react';
import $ from 'jquery';
import Loader from 'react-loader-spinner';
import ReactQuill from 'react-quill';
import saveAs from 'file-saver';
import ShowMap from "../components/ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Logs from "../components/Logs";

export default class ShowApz extends React.Component {
  constructor(props) {
    super(props);

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
      xmlFile: false,
      isSigned: false,
      isPerformer: (roles.indexOf('PerformerWater') !== -1),
      isHead: (roles.indexOf('HeadWater') !== -1),
      isDirector: (roles.indexOf('DirectorWater') !== -1),
      heads_responses: [],
      head_accepted: true,
      headComment: "",
      customTcFile: null,
      tcTextWater: "",
      tcTextWaterRequirements: "",
      tcTextWaterGeneral: "",
      tcTextSewage: "",
      // tcTextSewageRequirements: "",
      // tcTextSewageGeneral: "",
      zhk_tcTextWater: "",
      zhk_tcTextWaterRequirements: "",
      zhk_tcTextWaterGeneral: "",
      // zhk_tcTextSewageRequirements: "",
      zhk_tcTextSewage: "",
      // zhk_tcTextSewageGeneral: "",
      perenos_tcTextWater: "",
      perenos_tcTextWaterRequirements: "",
      perenos_tcTextWaterGeneral: "",
      ks_tcTextWater: "",
      ks_tcTextWaterRequirements: "",
      ks_tcTextWaterGeneral: "",
      ks_tcTextSewage: "",
      // ks_tcTextSewageRequirements: "",
      // ks_tcTextSewageGeneral: "",
      tab_tcTextWater: "",
      tab_tcTextWaterRequirements: "",
      tab_tcTextWaterGeneral: "",
      tab_tcTextSewage: "",
      // tab_tcTextSewageRequirements: "",
      // tab_tcTextSewageGeneral: "",
      waterTab: true,
      sewageTab: false,
      ty_director_id: "",
      water_directors_id: [],
      loaderHidden:true
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
    // this.onTcTextSewageRequirementsChange = this.onTcTextSewageRequirementsChange.bind(this);
    // this.onTcTextSewageGeneralChange = this.onTcTextSewageGeneralChange.bind(this);
    this.onzhk_TcTextWaterChange = this.onzhk_TcTextWaterChange.bind(this);
    this.onzhk_TcTextWaterRequirementsChange = this.onzhk_TcTextWaterRequirementsChange.bind(this);
    this.onzhk_TcTextWaterGeneralChange = this.onzhk_TcTextWaterGeneralChange.bind(this);
    this.onzhk_TcTextSewageChange = this.onzhk_TcTextSewageChange.bind(this);
    // this.onzhk_TcTextSewageRequirementsChange = this.onzhk_TcTextSewageRequirementsChange.bind(this);
    // this.onzhk_TcTextSewageGeneralChange = this.onzhk_TcTextSewageGeneralChange.bind(this);
    this.onks_TcTextWaterChange = this.onks_TcTextWaterChange.bind(this);
    this.onks_TcTextWaterRequirementsChange = this.onks_TcTextWaterRequirementsChange.bind(this);
    this.onks_TcTextWaterGeneralChange = this.onks_TcTextWaterGeneralChange.bind(this);
    this.onks_TcTextSewageChange = this.onks_TcTextSewageChange.bind(this);
    // this.onks_TcTextSewageRequirementsChange = this.onks_TcTextSewageRequirementsChange.bind(this);
    // this.onks_TcTextSewageGeneralChange = this.onks_TcTextSewageGeneralChange.bind(this);
    this.onperenos_TcTextWaterChange = this.onperenos_TcTextWaterChange.bind(this);
    this.onperenos_TcTextWaterRequirementsChange = this.onperenos_TcTextWaterRequirementsChange.bind(this);
    this.onperenos_TcTextWaterGeneralChange = this.onperenos_TcTextWaterGeneralChange.bind(this);
    //this.toggleFormTabs = this.toggleFormTabs.bind(this);
    // this.printQuestionnaire = this.printQuestionnaire.bind(this);
  }

  componentDidMount() {
    this.props.breadCrumbs();
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    if(roles[2] === 'PerformerWater'){
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

  onperenos_TcTextWaterChange(value) {
    this.setState({ perenos_tcTextWater: value });
  }

  onperenos_TcTextWaterRequirementsChange(value) {
    this.setState({ perenos_tcTextWaterRequirements: value });
  }

  onperenos_TcTextWaterGeneralChange(value) {
    this.setState({ perenos_tcTextWaterGeneral: value });
  }

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
          select_directors.push(<option key={i} value={data[i].user_id}> {data[i].last_name +' ' + data[i].first_name+' '+data[i].middle_name} </option>);
        }
        this.setState({water_directors_id: select_directors});
        if(this.state.ty_director_id === "" || this.state.ty_director_id === " "){
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
        //console.log(data.tc_text_sewage);
        //this.setState({tcTextSewageRequirements: data.tc_text_sewage_requirements});
        // this.setState({tcTextSewageGeneral: data.tc_text_sewage_general});
        if(data.resp_tc_text_water !=null){
          this.setState({tab_tcTextWater: data.resp_tc_text_water});
        }else{
          this.setState({tab_tcTextWater: data.tc_text_water});
        }
        if(data.resp_tc_text_water_requirements !=null){
          this.setState({tab_tcTextWaterRequirements: data.resp_tc_text_water_requirements});
        }else{
          this.setState({tab_tcTextWaterRequirements: data.tc_text_water_requirements});
        }
        if(data.resp_tc_text_water_general !=null){
          this.setState({tab_tcTextWaterGeneral: data.resp_tc_text_water_general});
        }else{
          this.setState({tab_tcTextWaterGeneral: data.tc_text_water_general});
        }
        if(data.resp_tc_text_sewage !=null){
          this.setState({tab_tcTextSewage: data.resp_tc_text_sewage});
        }else{
          this.setState({tab_tcTextSewage: data.tc_text_sewage});
        }
        //this.setState({tab_tcTextSewageRequirements: data.tc_text_sewage_requirements});
        // this.setState({tab_tcTextSewageGeneral: data.tc_text_sewage_general});
        this.setState({zhk_tcTextWater: data.tc_text_water_zhk});
        this.setState({zhk_tcTextWaterRequirements: data.tc_text_water_requirements_zhk});
        this.setState({zhk_tcTextWaterGeneral: data.tc_text_water_general_zhk});
        this.setState({zhk_tcTextSewage: data.tc_text_sewage_zhk});
        //this.setState({zhk_tcTextSewageRequirements: data.tc_text_sewage_requirements_zhk});
        // this.setState({zhk_tcTextSewageGeneral: data.tc_text_sewage_general_zhk});
        this.setState({ks_tcTextWater: data.tc_text_water_ks});
        this.setState({ks_tcTextWaterRequirements: data.tc_text_water_requirements_ks});
        this.setState({ks_tcTextWaterGeneral: data.tc_text_water_general_ks});
        this.setState({ks_tcTextSewage: data.tc_text_sewage_ks});
        //this.setState({ks_tcTextSewageRequirements: data.tc_text_sewage_requirements_ks});
        //this.setState({ks_tcTextSewageGeneral: data.tc_text_sewage_general_ks});
        this.setState({perenos_tcTextWater: data.tc_text_water_perenos});
        this.setState({perenos_tcTextWaterRequirements: data.tc_text_water_requirements_perenos});
        this.setState({perenos_tcTextWaterGeneral: data.tc_text_water_general_perenos});

        if (data.commission && data.commission.apz_water_response) {
          data.commission.apz_water_response.response_text ? this.setState({description: data.commission.apz_water_response.response_text}) : this.setState({description: "" });
          data.commission.apz_water_response.connection_point ? this.setState({connectionPoint: data.commission.apz_water_response.connection_point}) : this.setState({connectionPoint: "" });
          data.commission.apz_water_response.gen_water_req ? this.setState({genWaterReq: data.commission.apz_water_response.gen_water_req}) : this.setState({genWaterReq: "" });
          data.commission.apz_water_response.drinking_water ? this.setState({drinkingWater: data.commission.apz_water_response.drinking_water}) : this.setState({drinkingWater: "" });
          data.commission.apz_water_response.prod_water ? this.setState({prodWater: data.commission.apz_water_response.prod_water}) : this.setState({prodWater: "" });
          //data.commission.apz_water_response.fire_fighting_water_in ? this.setState({fireFightingWaterIn: data.commission.apz_water_response.fire_fighting_water_in}) : this.setState({fireFightingWaterIn: "" });
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
      // formData.append('TcTextSewageRequirements', this.state.tab_tcTextSewageRequirements);
      // formData.append('TcTextSewageGeneral', this.state.tab_tcTextSewageGeneral);
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
        }
        else if(!this.state.docNumber){
          alert("Ответ не сохранен!");
        }
        else  {
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

  sendWaterResponse(apzId, status, comment) {
    if((this.state.responseId <= 0 || this.state.responseId > 0) && this.state.response !== status){
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

  printMainInfo(){
      var divToPrint=document.getElementById("printTable");
      var divToRightPrint=document.getElementById("rightMainTable");
      var newWin= window.open("");
      newWin.document.write(divToPrint.outerHTML+divToRightPrint.outerHTML);
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
              //this.setState({tab_tcTextSewageRequirements: this.state.tcTextSewageRequirements});
              //this.setState({tab_tcTextSewageGeneral: this.state.tcTextSewageGeneral});
              break;
          case 'ЖК':
              this.setState({tab_tcTextWater: this.state.zhk_tcTextWater});
              this.setState({tab_tcTextWaterRequirements: this.state.zhk_tcTextWaterRequirements});
              this.setState({tab_tcTextWaterGeneral: this.state.zhk_tcTextWaterGeneral});
              this.setState({tab_tcTextSewage: this.state.zhk_tcTextSewage});
              // this.setState({tab_tcTextSewageRequirements: this.state.zhk_tcTextSewageRequirements});
              // this.setState({tab_tcTextSewageGeneral: this.state.zhk_tcTextSewageGeneral});
              break;
          case 'КоммСтр':
              this.setState({tab_tcTextWater: this.state.ks_tcTextWater});
              this.setState({tab_tcTextWaterRequirements: this.state.ks_tcTextWaterRequirements});
              this.setState({tab_tcTextWaterGeneral: this.state.ks_tcTextWaterGeneral});
              this.setState({tab_tcTextSewage: this.state.ks_tcTextSewage});
              // this.setState({tab_tcTextSewageRequirements: this.state.ks_tcTextSewageRequirements});
              // this.setState({tab_tcTextSewageGeneral: this.state.ks_tcTextSewageGeneral});
              break;
          case 'Перенос':
              this.setState({tab_tcTextWater: this.state.perenos_tcTextWater});
              this.setState({tab_tcTextWaterRequirements: this.state.perenos_tcTextWaterRequirements});
              this.setState({tab_tcTextWaterGeneral: this.state.perenos_tcTextWaterGeneral});
              this.setState({tab_tcTextSewage: ""});
              // this.setState({tab_tcTextSewageRequirements: ""});
              // this.setState({tab_tcTextSewageGeneral: ""});
              break;
          default:
              this.setState({tab_tcTextWater: this.state.tcTextWater});
              this.setState({tab_tcTextWaterRequirements: this.state.tcTextWaterRequirements});
              this.setState({tab_tcTextWaterGeneral: this.state.tcTextWaterGeneral});
              this.setState({tab_tcTextSewage: this.state.tcTextSewage});
              // this.setState({tab_tcTextSewageRequirements: this.state.tcTextSewageRequirements});
              // this.setState({tab_tcTextSewageGeneral: this.state.tcTextSewageGeneral});
      }
  }

  ecpSignSuccess(){
    this.setState({ xmlFile: true });
  }

  hideSignBtns() {
    this.setState({needSign: false });
  }

  render() {
    var apz = this.state.apz;

    if (apz.length === 0) {
      return false;
    }

    return (
      <div className="row">
        <div className="col-sm-12">
          <AllInfo toggleMap={this.toggleMap.bind(this, true)} apz={this.state.apz} personalIdFile={this.state.personalIdFile} confirmedTaskFile={this.state.confirmedTaskFile} titleDocumentFile={this.state.titleDocumentFile}
          historygoBack={this.props.history.goBack} additionalFile={this.state.additionalFile} claimedCapacityJustification={this.state.claimedCapacityJustification}/>
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
            </tbody>
          </table>
        </div>

        {apz.apz_sewage &&
          <div className="col-sm-6">
            <h5 className="block-title-2 mt-3 mb-3">Детали водоотведения</h5>

            <table className="table table-bordered table-striped" style={{textAlign: 'left'}} id={"detailWaterDisposal"}>
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
          {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} mapId={"248f0662b4fb4c93b58d4d1ae046efc0"} />}

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
            {(this.state.isPerformer === true || this.state.responseId !== 0) &&
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

                  {/*this.state.apz.object_type != "ИЖС" &&
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
                  */}
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

                  {/*this.state.apz.object_type != "ИЖС" &&
                    <div className="form-group">
                      <label>Для присоединения к городским сетям и сооружениям водоотведения Заказчик обязан:</label>
                      <textarea disabled='disabled' title="Пожалуйста заполните этот пункт в тексте ТУ ВОДООТВЕДЕНИЕ" rows="5" className="form-control" value={this.state.sewageCustomerDuties} onChange={this.onSewageCustomerDutiesChange} placeholder="Описание"></textarea>
                    </div>
                  */}

                  {(this.state.response === true && this.state.responseFile) &&
                    <div className="form-group">
                      <label style={{display: 'block'}}>Прикрепленный файл</label>
                      <a className="pointer text-info" title="Скачать" data-category="7" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 7)}>
                        Скачать
                      </a>
                      <div className="progress mb-2" data-category="7" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
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
                  {/*<ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                      <a className="water_tab nav-link pointer active" onClick={this.toggleFormTabs.bind(this, 'water')}>Водопотребление</a>
                      Водопотребление
                    </li>
                  </ul>*/}

                  {this.state.waterTab &&
                    <div>
                      <div className="form-group">
                        <label><b>1. Водопотребление</b></label>
                        <ReactQuill value={this.state.tab_tcTextWater} onChange={this.onTcTextWaterChange} />
                      </div>
                      <div className="form-group">
                        <label><b>2. Водоотведение</b></label>
                        <ReactQuill value={this.state.tab_tcTextSewage} onChange={this.onTcTextSewageChange} />
                      </div>
                      <div className="form-group">
                        <label><b>3. Другие требования</b></label>
                        <ReactQuill value={this.state.tab_tcTextWaterRequirements} onChange={this.onTcTextWaterRequirementsChange} />
                      </div>
                      <div className="form-group">
                        <label><b>4. Общие положения</b></label>
                        <ReactQuill value={this.state.tab_tcTextWaterGeneral} onChange={this.onTcTextWaterGeneralChange} />
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
                      <div style={{paddingLeft:'5px', fontSize: '18px', margin: '10px 0px'}}>
                          <div className="form-group">
                              <b>Номер документа</b>
                              <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                          </div>
                      </div>
                      <button type="button" style={{ marginRight: '5px' }} className="btn btn-secondary" disabled={!this.state.docNumber} onClick={this.saveResponseForm.bind(this, apz.id, "accept", "")}>
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

          {this.state.accept === "accept" && this.state.responseId !== 0 && (this.state.waterStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
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
                        <a className="pointer text-info" data-category="8" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 8)}>
                          Скачать
                        </a>
                        <div className="progress mb-2" data-category="8" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
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
                      (текущий файл: <a className="pointer text-info" data-category="9" title="Скачать" onClick={this.downloadFile.bind(this, this.state.customTcFile.id, 9)}>{this.state.customTcFile.name}</a>)
                      <div className="progress mb-2" data-category="9" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
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
              <div className="form-group" style={{marginBottom:'5px'}}>
                {!this.state.xmlFile &&
                    <button type="button" className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, true, "")}>
                      Сохранить
                    </button>
                }
                <button type="button" style={{ marginLeft: '5px' }} className="btn btn-secondary" onClick={this.sendWaterResponse.bind(this, apz.id, true, "")}>
                  Отправить без ЭЦП
                </button>
              </div>
              <p style={{color:'#777777', marginBottom:'0px'}}>Если есть сканированное техническое условие. Сканированный ТУ заменяет ТУ созданный сайтом.</p>
              <p style={{color:'#777777'}}>Сохранение перезаписывает предыдущий файл.</p>
            </div>
          }

          {this.state.accept === 'answer' && this.state.responseId !== 0 && (this.state.waterStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <table className="table table-bordered table-striped">
              <tbody>
              {this.state.customTcFile &&
                <tr>
                  <td>Технические условия</td>
                  <td><a className="pointer text-info" title="Скачать" data-category="10" onClick={this.downloadFile.bind(this, this.state.customTcFile.id, 10)}>Скачать</a>
                    <div className="progress mb-2" data-category="10" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
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

          {this.state.isDirector && this.state.waterStatus === 2 &&
            <div>
              {!this.state.xmlFile && !this.state.isSigned && apz.status_id === 5 &&
               <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="water" id={apz.id} serviceName='apz'/>
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
                <button type="button" className="btn btn-raised btn-success" onClick={this.sendWaterResponse.bind(this, apz.id, true, "")}>
                  Отправить инженеру
                </button>
              </div>
            </div>
          }

          {this.state.accept === "decline" && this.state.waterStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <div className="provider_answer_body" style={{border: 'solid 1px #f44336', padding: '20px'}}>
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
                  <a className="pointer text-info" title="Скачать" data-category="11" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 11)}>
                    Скачать
                  </a>
                  <div className="progress mb-2" data-category="11" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              }

              <div className="form-group">
                <label htmlFor="upload_file">Прикрепить файл</label>
                <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
              </div>
              <div className="form-group">
                <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm">Отклонить</button>
              </div>
            </div>
          }
          <div className="modal fade" id="ReturnApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Вы уверены что хотите отколнить заявление?</h5>
                  <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-footer" style={{margin:'auto'}}>
                  <button type="button" className="btn btn-secondary" onClick={this.sendWaterResponse.bind(this, apz.id, false, this.state.description)}>
                    Да
                  </button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal" style={{marginLeft:'5px'}}>Нет</button>
                </div>
              </div>
            </div>
          </div>

          {this.state.accept === 'decline' && this.state.responseId !== 0 && (this.state.waterStatus === 0 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
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
                        <a className="pointer text-info" title="Скачать" data-category="12" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 12)}>
                          Скачать
                        </a>
                        <div className="progress mb-2" data-category="12" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
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

        <div className="col-sm-12">
          <Logs state_history={this.state.apz.state_history} />
        </div>

        <div className="col-sm-12">
          <hr />
          <button className="btn btn-outline-secondary pull-right btn-sm" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
        </div>
      </div>
    )
  }
}
