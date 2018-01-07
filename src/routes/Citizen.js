import React from 'react';
import * as esriLoader from 'esri-loader';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';


export default class Citizen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      acceptedForms: [],
      declinedForms: [],
      activeForms: [],
      showDetails: false,
      showStatusBar: false,
      formHidden: true,
      Id: "",
      Applicant: "",
      Address: "",
      Phone: "",
      Customer: "",
      Designer: "",
      ProjectName: "",
      ProjectAddress: "",
      ApzDate: "",
      regionDate: null,
      headDate: null,
      Status: 0,
      regionResponse: null,
      headResponse: null,
      wStatus: 7,
      hStatus: 7,
      eStatus: 7,
      gStatus: 7,
      eActionDate: null,
      hActionDate: null,
      gActionDate: null,
      wActionDate: null,
      eResponse: null,
      hResponse: null,
      gResponse: null,
      wResponse: null,
      headResponseFile: null,
      headResponseFileExt: null
    }

    this.getApzFormList = this.getApzFormList.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.getStatusForArch = this.getStatusForArch.bind(this);
    this.getStatusForHeadArch = this.getStatusForHeadArch.bind(this);
    this.getStatusForProvider = this.getStatusForProvider.bind(this);
    this.showStepBarOrText = this.showStepBarOrText.bind(this);
    this.toggleResponseText = this.toggleResponseText.bind(this);
    this.hideStatusBar = this.hideStatusBar.bind(this);
  }

  // function to get the list of ApzForms
  getApzFormList() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/user", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        // filter the whole list to get only accepted apzForms
        var acc_forms_list = data.filter(function(obj) { return obj.Status === 1; });
        this.setState({acceptedForms: acc_forms_list});
        // filter the list to get the declined apzForms
        var dec_forms_list = data.filter(function(obj) { return obj.Status === 0; });
        this.setState({declinedForms: dec_forms_list});
        // filter the list to get in-process apzForms
        var act_forms_list = data.filter(function(obj) { return (obj.Status !== 0 && obj.Status !== 1); });
        this.setState({activeForms: act_forms_list});
      }
      else if(xhr.status === 401){
        sessionStorage.clear();
        alert("Token is expired, please login again!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }

  // function to show the detailed info and statusBar for every form
  getApzDetails(apzId) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/detail/" + apzId, true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.send();
      xhr.onload = function () {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          console.log(data);
          // to show minute with two numbers, E.g.: 12:00 instead of 12:0
          function addZero(i) {
              if (i < 10) {
                  i = "0" + i;
              }
              return i;
          }
          this.setState({ showDetails: true });
          this.setState({ showStatusBar: true });
          this.setState({ Id: data.Id });
          this.setState({ Applicant: data.Applicant });
          this.setState({ Address: data.Address });
          this.setState({ Phone: data.Phone });
          this.setState({ Customer: data.Customer });
          this.setState({ Designer: data.Designer });
          this.setState({ ProjectName: data.ProjectName });
          this.setState({ ProjectAddress: data.ProjectAddress });
          this.setState({ headResponseFile: data.HeadResponseFile });
          this.setState({ headResponseFileExt: data.HeadResponseFileExt });
          this.setState(function(){
            var jDate = new Date(data.ApzDate);
            var jDate = new Date(data.ApzDate);
            var curr_date = jDate.getDate();
            var curr_month = jDate.getMonth() + 1;
            var curr_year = jDate.getFullYear();
            var formated_date = curr_date + "-" + curr_month + "-" + curr_year;
            return { ApzDate: formated_date }
          });
          this.setState({ Status: data.Status });
          this.setState({ wStatus: data.ApzWaterStatus });
          this.setState({ hStatus: data.ApzHeatStatus });
          this.setState({ eStatus: data.ApzElectricityStatus });
          this.setState({ gStatus: data.ApzGasStatus });
          this.setState(function(){
            if(data.RegionDate !== null){
              var jDate = new Date(data.RegionDate);
              var curr_date = jDate.getDate();
              var curr_month = jDate.getMonth() + 1;
              var curr_year = jDate.getFullYear();
              var curr_hour = jDate.getHours();
              var curr_minute = addZero(jDate.getMinutes());
              var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
              return { regionDate: formated_date }
            }
            else{
              return { regionDate: data.RegionDate }
            } 
          });
          this.setState({ regionResponse: data.RegionResponse});
          this.setState(function(){
            if(data.HeadDate !== null){
              var jDate = new Date(data.HeadDate);
              var curr_date = jDate.getDate();
              var curr_month = jDate.getMonth() + 1;
              var curr_year = jDate.getFullYear();
              var curr_hour = jDate.getHours();
              var curr_minute = addZero(jDate.getMinutes());
              var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
              return { headDate: formated_date }
            }
            else{
              return { headDate: data.HeadDate }
            }
          });
          this.setState({ headResponse: data.HeadResponse});
          this.setState(function(){
            if(data.ProviderElectricityDate !== null){
              var jDate = new Date(data.ProviderElectricityDate);
              var curr_date = jDate.getDate();
              var curr_month = jDate.getMonth() + 1;
              var curr_year = jDate.getFullYear();
              var curr_hour = jDate.getHours();
              var curr_minute = addZero(jDate.getMinutes());
              var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
              return { eActionDate: formated_date }
            }
            else{
              return { eActionDate: data.ProviderElectricityDate }
            }
          });
          this.setState({ eResponse: data.ProviderElectricityResponse});
          this.setState(function(){
            if(data.ProviderGasDate !== null){
              var jDate = new Date(data.ProviderGasDate);
              var curr_date = jDate.getDate();
              var curr_month = jDate.getMonth() + 1;
              var curr_year = jDate.getFullYear();
              var curr_hour = jDate.getHours();
              var curr_minute = addZero(jDate.getMinutes());
              var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
              return { gActionDate: formated_date }
            }
            else{
              return { gActionDate: data.ProviderGasDate }
            }
          });
          this.setState({ gResponse: data.ProviderGasResponse});
          this.setState(function(){
            if(data.ProviderHeatDate !== null){
              var jDate = new Date(data.ProviderHeatDate);
              var curr_date = jDate.getDate();
              var curr_month = jDate.getMonth() + 1;
              var curr_year = jDate.getFullYear();
              var curr_hour = jDate.getHours();
              var curr_minute = addZero(jDate.getMinutes());
              var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
              return { hActionDate: formated_date }
            }
            else{
              return { hActionDate: data.ProviderHeatDate }
            }
          });
          this.setState({ hResponse: data.ProviderHeatResponse});
          this.setState(function(){
            if(data.ProviderWaterDate !== null){
              var jDate = new Date(data.ProviderWaterDate);
              var curr_date = jDate.getDate();
              var curr_month = jDate.getMonth() + 1;
              var curr_year = jDate.getFullYear();
              var curr_hour = jDate.getHours();
              var curr_minute = addZero(jDate.getMinutes());
              var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
              return { wActionDate: formated_date }
            }
            else{
              return { wActionDate: data.ProviderWaterDate }
            }
          });
          this.setState({ wResponse: data.ProviderWaterResponse});
        }
        else if(xhr.status === 401){
          sessionStorage.clear();
          alert("Время сессий истекло, войдите снова!");
          this.props.history.replace("/login");
        }
      }.bind(this);
    } else {
      console.log('session expired');
    }   

  };

  downloadFile(event) {
    var buffer =  event.target.getAttribute("data-file")
    var name =  event.target.getAttribute("data-name");
    var ext =  event.target.getAttribute("data-ext");

    var base64ToArrayBuffer = (function () {
      
      return function (base64) {
        var binaryString =  window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        
        for (var i = 0; i < binaryLen; i++)        {
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
          window.URL.revokeObjectURL(url);
      };

    }());

    saveByteArray([base64ToArrayBuffer(buffer)], name + ext);
  }

  // function to print apzForm in .pdf format
  printApz(apzId, project) {
    //console.log(apzId);
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/print/" + apzId, true);
      xhr.responseType = "blob";
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        console.log(xhr);
        console.log(xhr.status);
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "apz-" + new Date().getTime() + ".pdf");
          } 
          else {
            var blob = xhr.response;
            var link = document.createElement('a');
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";
            //console.log(curr_day);
            link.href = window.URL.createObjectURL(blob);
            link.download = "апз-" + project + formated_date + ".pdf";

            //append the link to the document body
            document.body.appendChild(link);
            link.click();
          }
        }
      }
      xhr.send();
    } else {
      console.log('session expired');
    }
  }

  // function to hide/show ApzForm, gets called when button "Создать заявление" is clicked
  toggleForm(e){
    this.hideStatusBar();
    this.setState({
      formHidden: !this.state.formHidden
    })
  }

  // function to update the list of ActiveForms
  updateActiveFormsList(form) {
    //console.log("updateOtherForms started")
    var tempList = this.state.activeForms;
    tempList.push(form);
    //console.log(tempList);
    this.setState({activeForms: tempList});
  }

  // function to show StepBar or ResponseMessages
  showStepBarOrText(status){
    if(status === 0)
      return false;
    else
      return true;
  }

  //
  hideStatusBar() {
    this.setState({ showStatusBar: false });
  }

  // function to show responseText if its not null
  toggleResponseText(response){
    if(response === null)
      return false;
    else
      return true;
  }

  // change status for Architect in ProgressBar
  getStatusForArch(status, rd, rr) {
    //console.log(status);
    //console.log(rd);
    //console.log(rr);
    if((status === 0 || status === 1 || status === 3 || status === 4) && (rd !== null && rr === null))
      return 'circle done';
    else if(status === 0 && (rd !== null && rr !== null))
      return 'circle fail';
    else if(status === 2)
      return 'circle active';
    else
      return 'circle';
  }

  // change status for Providers(water, heat, gas, electricity) in ProgressBar
  getStatusForProvider(pStatus, status) {
    if(status === 1)
      return 'circle done';
    else if(status === 0)
      return 'circle fail';
    else if(pStatus === 3 && status === 2)
      return 'circle active';
    else
      return 'circle';
  }

  // change status for HeadArchitect in ProgressBar
  getStatusForHeadArch(status, hd, hr) {
    if(status === 2 || ((status === 0 || status === 1 || status === 2 || status === 3) && (hd === null && hr === null)))
      return 'circle';
    else if(status === 4)
      return 'circle active';
    else if(status === 0)
      return 'circle fail';
    else
      return 'circle done';
  }

  createMap(element){
    console.log(this.refs)
    esriLoader.dojoRequire([
      "esri/views/SceneView",
      "esri/widgets/LayerList",
      "esri/WebScene",
      "esri/layers/FeatureLayer",
      "esri/layers/TileLayer",
      "esri/widgets/Search",
      "esri/Map",
      "dojo/domReady!"
    ], function(
      SceneView, LayerList, WebScene, FeatureLayer, TileLayer, Search, Map
    ) {
      var map = new Map({
        basemap: "topo"
      });
      
      var flRedLines = new FeatureLayer({
        url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8/FeatureServer",
        outFields: ["*"],
        title: "Красные линии"
      });
      map.add(flRedLines);

      var flFunZones = new FeatureLayer({
        url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%A4%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5_%D0%B7%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5/FeatureServer",
        outFields: ["*"],
        title: "Функциональное зонирование"
      });
      map.add(flFunZones);
      /*
      var flGosAkts = new FeatureLayer({
        url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
        outFields: ["*"],
        title: "Гос акты"
      });
      map.add(flGosAkts);
      */
      
      var view = new SceneView({
        container: element,
        map: map,
        center: [76.886, 43.250], // lon, lat
        scale: 10000
      });
      
      var searchWidget = new Search({
        view: view,
        sources: [{
          featureLayer: new FeatureLayer({
            url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
            popupTemplate: { // autocasts as new PopupTemplate()
              title: "Кадастровый номер: {CADASTRAL_NUMBER} </br> Назначение: {FUNCTION_} <br/> Вид собственности: {OWNERSHIP}"
            }
          }),
          searchFields: ["CADASTRAL_NUMBER"],
          displayField: "CADASTRAL_NUMBER",
          exactMatch: false,
          outFields: ["CADASTRAL_NUMBER", "FUNCTION_", "OWNERSHIP"],
          name: "Зарегистрированные государственные акты",
          placeholder: "Кадастровый поиск"
        }]
      });
      // Add the search widget to the top left corner of the view
      view.ui.add(searchWidget, {
        position: "top-right"
      });
      
      
      view.then(function() {
        var layerList = new LayerList({
          view: view
        });

        // Add widget to the top right corner of the view
        view.ui.add(layerList, "bottom-right");
      });
      
    });
  }

  onReference(element) {
    console.log('mounted');
    if(!esriLoader.isLoaded()) {
      esriLoader.bootstrap(
        err => {
          if(err) {
            console.log(err);
          } else {
            this.createMap(element);
          }
        },
        {
          url: "https://js.arcgis.com/4.5/"
        }
      );
    } else {
      this.createMap(element);
    }
  }

  componentWillMount() {
    //console.log("CitizenComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];
      this.props.history.replace('/' + userRole);
    }else {
      this.props.history.replace('/');
    }   
  }

  componentDidMount() {
    //console.log("CitizenComponent did mount");
    this.getApzFormList();
  }

  componentWillUnmount() {
    //console.log("CitizenComponent will unmount");
  }

  render() {
    //console.log("rendering the CitizenComponent");
    var acceptedForms = this.state.acceptedForms;
    var declinedForms = this.state.declinedForms;
    var activeForms = this.state.activeForms;
    var updateList = this.updateActiveFormsList.bind(this);
    return (
      <div className="content container" style={{paddingBottom: '0'}}>
        <div className="row">
          <button className="btn btn-raised btn-info" onClick={this.toggleForm} style={{margin: 'auto', marginBottom: '10px'}}>
            Создать заявление
          </button>
          {!this.state.formHidden && <ApzForm updateList={updateList} />}
        </div>
        <div className="row">
          <div className="col-md-3">
            <h4 style={{textAlign: 'center'}}>Список заявлений</h4>
          </div>
          <div className="col-md-6">
            <h4 style={{textAlign: 'center'}}>Карта</h4>
          </div>
          <div className="col-md-3">
            <h4 style={{textAlign: 'center'}}>Информация</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 apz-list card">
            <h4><span id="in-process">В Процессе</span>
            {
              activeForms.map(function(actForm, i){
                return(
                  <li key={i} onClick={this.getApzDetails.bind(this, actForm.Id)}>
                    {actForm.ProjectName}
                  </li>
                )
              }.bind(this))
            }
            </h4>
            <h4><span id="accepted">Принятые</span>
            {
              acceptedForms.map(function(accForm, i){
                return(
                  <li key={i} onClick={this.getApzDetails.bind(this, accForm.Id)}>
                    {accForm.ProjectName}
                  </li>
                  )
              }.bind(this))
            }
            </h4>
            <h4><span id="declined">Отказ</span>
            {
              declinedForms.map(function(decForm, i){
                return(
                  <li key={i} onClick={this.getApzDetails.bind(this, decForm.Id)}>
                    {decForm.ProjectName}
                  </li>
                )
              }.bind(this))
            }
            </h4>
          </div>
          <div className="col-md-6 apz-additional card" style={{padding: '0'}}>
            <div className="col-md-12 well" style={{padding: '0', height:'600px', width:'100%'}}>
                <div className="viewDivCitizen" ref={this.onReference.bind(this)}>
                  <div className="container">
                    <p>Загрузка...</p>
                  </div>
                </div>
            </div>
          </div>
          <div id="apz-detailed" className="col-md-3 apz-detailed card" style={{paddingTop: '10px'}}>
            <div className={this.state.showDetails ? 'row' : 'invisible'}>
              <div className="col-6"><b>Заявитель</b>:</div> <div className="col-6">{this.state.Applicant}</div>
              <div className="col-6"><b>Адрес</b>:</div> <div className="col-6">{this.state.Address}</div>
              <div className="col-6"><b>Телефон</b>:</div> <div className="col-6">{this.state.Phone}</div>
              <div className="col-6"><b>Заказчик</b>:</div> <div className="col-6">{this.state.Customer}</div>
              <div className="col-6"><b>Разработчик</b>:</div> <div className="col-6">{this.state.Designer}</div>
              <div className="col-6"><b>Название проекта</b>:</div> <div className="col-6">{this.state.ProjectName}</div>
              <div className="col-6"><b>Адрес проекта</b>:</div> <div className="col-6">{this.state.ProjectAddress}</div>
              <div className="col-6"><b>Дата заявления</b>:</div> <div className="col-6">{this.state.ApzDate}</div>
              { this.state.headResponseFile ? 
                <div className="col-sm-12">
                  { this.state.Status != 0 ? 
                    <div class="row">
                      <div className="col-6"><b>Готовое АПЗ</b>:</div> <div className="col-6"><a className="text-info pointer" data-file={this.state.headResponseFile} data-name="Готовое АПЗ" data-ext={this.state.headResponseFileExt} onClick={this.downloadFile.bind(this)}>Скачать</a></div>
                      <div className="col-6"><b>АПЗ на базе Опросного листа</b>:</div> <div className="col-6"><a className="text-info pointer" onClick={this.printApz.bind(this, this.state.Id, this.state.ProjectName)}>Скачать</a></div>
                    </div>
                    :
                    <div class="row">
                      <div className="col-6"><b>Мотивированный отказ</b>:</div> <div className="col-6"><a className="text-info pointer" data-file={this.state.headResponseFile} data-name="Мотивированный отказ" data-ext={this.state.headResponseFileExt} onClick={this.downloadFile.bind(this)}>Скачать</a></div>
                    </div>
                  }
                </div> : ''
              }
              
              <button className="btn btn-raised btn-info" 
                      style={{margin: 'auto', marginTop: '20px', marginBottom: '10px'}}
                      onClick={this.printApz.bind(this, this.state.Id, this.state.ProjectName)}>
                Распечатать АПЗ
              </button>
            </div>
          </div>
        </div>
        <div className={this.state.showStatusBar ? 'row' : 'invisible'}>
          <div className={this.showStepBarOrText(this.state.Status) ? 'row statusBar' : 'invisible'}>
            {/*<div id="infoDiv">Нажмите на участок или объект, чтобы получить информацию</div>*/}
            {/*<div id="viewDiv"></div>*/}
            <div className="progressBar">
              <div className={this.getStatusForArch(this.state.Status, this.state.regionDate, this.state.regionResponse)}>
                <span className="label">1</span>
                <span className="title">Районный архитектор</span>
              </div>
              <span className="bar"></span>
              <div className="box">
                <div className={this.getStatusForProvider(this.state.Status, this.state.wStatus)}>
                  <span className="label">2</span>
                  <span className="title">Поставщик (вода) </span>
                </div>
                <span className="bar"></span>
                <div className={this.getStatusForProvider(this.state.Status, this.state.gStatus)}>
                  <span className="label">2</span>
                  <span className="title">Поставщик (газ)</span>
                </div>
                <span className="bar"></span>
                <div className={this.getStatusForProvider(this.state.Status, this.state.hStatus)}>
                  <span className="label">2</span>
                  <span className="title">Поставщик (тепло)</span>
                </div>
                <span className="bar"></span>
                <div className={this.getStatusForProvider(this.state.Status, this.state.eStatus)}>
                  <span className="label">2</span>
                  <span className="title">Поставщик (электр)</span>
                </div>
              </div>
              <span className="bar"></span>
              <div className={this.getStatusForHeadArch(this.state.Status, this.state.headDate, this.state.headResponse)}>
                <span className="label">3</span>
                <span className="title">Главный архитектор</span>
              </div>
            </div>
            <div className="row actionDate">
              <div className="col-3"></div>
              <div className="col-7" style={{padding: '0', fontSize: '0.8em'}}>
                <div className="row">
                  <div className="col-2">{this.state.regionDate}</div>
                  <div className="col-2">{this.state.wActionDate}</div>
                  <div className="col-2">{this.state.gActionDate}</div>
                  <div className="col-2">{this.state.hActionDate}</div>
                  <div className="col-2">{this.state.eActionDate}</div>
                  <div className="col-2">{this.state.headDate}</div>
                </div>
              </div>
              <div className="col-2"></div>
            </div>
          </div>
          <div className={!this.showStepBarOrText(this.state.Status) ? 'allResponseText' : 'invisible'}>
            <div className={this.toggleResponseText(this.state.regionResponse) ? 'responseText' : 'invisible'}>
              {this.state.regionResponse}
            </div>
            <div className={this.toggleResponseText(this.state.eResponse) ? 'responseText' : 'invisible'}>
              {this.state.eResponse}
            </div>
            <div className={this.toggleResponseText(this.state.gResponse) ? 'responseText' : 'invisible'}> 
              {this.state.gResponse} 
            </div>
            <div className={this.toggleResponseText(this.state.hResponse) ? 'responseText' : 'invisible'}>
              {this.state.hResponse} 
            </div>
            <div className={this.toggleResponseText(this.state.wResponse) ? 'responseText' : 'invisible'}>
              {this.state.wResponse}
            </div>
            <div className={this.toggleResponseText(this.state.headResponse) ? 'responseText' : 'invisible'}>
              {this.state.headResponse}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ApzForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.tabSubmission = this.tabSubmission.bind(this);
  }

  tabSubmission(e) { 
    e.preventDefault();
    var id = document.querySelector('#'+e.target.id).dataset.tab;
    if ($('#tab'+id+'-form').valid())
    {
      $('#tab'+id+'-link').children('#tabIcon').removeClass().addClass('glyphicon glyphicon-ok');
      $('#tab'+id+'-link').next().trigger('click');
    } else {
      $('#tab'+id+'-link').children('#tabIcon').removeClass().addClass('glyphicon glyphicon-remove');
    }
  }

  // function to submit ApzForm
  requestSubmission(e) {
    if ($('#tab0-link').children().hasClass('glyphicon-ok')
                && $('#tab1-link').children().hasClass('glyphicon-ok')
                && $('#tab2-link').children().hasClass('glyphicon-ok')
                && $('#tab3-link').children().hasClass('glyphicon-ok')
                && $('#tab4-link').children().hasClass('glyphicon-ok')
                && $('#tab5-link').children().hasClass('glyphicon-ok')
                && $('#tab6-link').children().hasClass('glyphicon-ok')
                && $('#tab7-link').children().hasClass('glyphicon-ok')
                && $('#tab8-link').children().hasClass('glyphicon-ok')) 
    {
      var apzData = $('#tab0-form, #tab1-form, #tab2-form, #tab3-form, #tab4-form, #tab5-form, #tab6-form, #tab7-form, #tab8-form').serializeJSON();
      if (sessionStorage.getItem('tokenInfo')) {
        $.ajax({
          type: 'POST',
          url: window.url + 'api/Apz/Create',
          contentType: 'application/json; charset=utf-8',
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
          },
          data: JSON.stringify(apzData),
          success: function (data) {
            //console.log(data);
            // after form is submitted: calls the function from CitizenComponent to update the list 
            this.props.updateList(data);
            alert("Заявка успешно подана");
            $('#tab0-form')[0].reset();
            $('#tab1-form')[0].reset();
            $('#tab2-form')[0].reset();
            $('#tab3-form')[0].reset();
            $('#tab4-form')[0].reset();
            $('#tab5-form')[0].reset();
            $('#tab6-form')[0].reset();
            $('#tab7-form')[0].reset();
            $('#tab8-form')[0].reset();
            $('#tabIcon').removeClass();
            $('#apzFormDiv').hide(1000);
          }.bind(this),
          fail: function (jqXHR) {
            alert("Ошибка " + jqXHR.status + ': ' + jqXHR.statusText);
          },
          statusCode: {
            400: function () {
              alert("При сохранении заявки произошла ошибка!");
            }
          },
          complete: function (jqXHR) {
          }
        });
      } else { console.log('session expired'); }
    } else { alert('Сохранены не все вкладки'); }
  }


  render() {
    return (
      <div className="container" id="apzFormDiv">
        <div className="tab-pane">
          <h4>Заявление на АПЗ</h4>
          <div className="row">
          <div className="col-4">
            <div className="nav flex-column nav-pills container-fluid" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a className="nav-link active" id="tab0-link" data-toggle="pill" href="#tab0" role="tab" aria-controls="tab0" aria-selected="true">Заявление <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab1-link" data-toggle="pill" href="#tab1" role="tab" aria-controls="tab1" aria-selected="false">Объект <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab2-link" data-toggle="pill" href="#tab2" role="tab" aria-controls="tab2" aria-selected="false">Электроснабжение <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab3-link" data-toggle="pill" href="#tab3" role="tab" aria-controls="tab3" aria-selected="false">Водоснабжение <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab4-link" data-toggle="pill" href="#tab4" role="tab" aria-controls="tab4" aria-selected="false">Канализация <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab5-link" data-toggle="pill" href="#tab5" role="tab" aria-controls="tab5" aria-selected="false">Теплоснабжение <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab6-link" data-toggle="pill" href="#tab6" role="tab" aria-controls="tab6" aria-selected="false">Ливневая канализация <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab7-link" data-toggle="pill" href="#tab7" role="tab" aria-controls="tab7" aria-selected="false">Телефонизация <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab8-link" data-toggle="pill" href="#tab8" role="tab" aria-controls="tab8" aria-selected="false">Газоснабжение <span id="tabIcon"></span></a>
            </div>
          </div>
          <div className="col-8">
            <div className="tab-content" id="v-pills-tabContent">
            <div className="tab-pane fade show active" id="tab0" role="tabpanel" aria-labelledby="tab0-link">
              <form id="tab0-form" data-tab="0" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="Applicant">Наименование заявителя:</label>
                  <input type="text" className="form-control" required name="Applicant" placeholder="Наименование" />
                  <span className="help-block">Ф.И.О. (при его наличии) физического лица <br />или наименование юридического лица</span>
                </div>
                <div className="form-group">
                  <label htmlFor="Address">Адрес:</label>
                  <input type="text" className="form-control" required id="ApzAddressForm" name="Address" placeholder="Адрес" />
                </div>
                <div className="form-group">
                  <label htmlFor="Phone">Телефон</label>
                  <input type="tel" className="form-control" name="Phone" placeholder="Телефон" />
                </div>
                <div className="form-group">
                  <label htmlFor="Region">Район</label>
                  <select className="form-control" name="Region">
                  <option>Наурызбай</option>
                  <option>Алатау</option>
                  <option>Алмалы</option>
                  <option>Ауезов</option>
                  <option>Бостандық</option>
                  <option>Жетісу</option>
                  <option>Медеу</option>
                  <option>Турксиб</option>
                  </select>
                </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="Customer">Заказчик</label>
                    <input type="text" required className="form-control" name="Customer" placeholder="Заказчик" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="Designer">Проектировщик №ГСЛ, категория</label>
                    <input type="text" required className="form-control" name="Designer" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ProjectName">Наименование проектируемого объекта</label>
                    <input type="text" required className="form-control" id="ProjectName" name="ProjectName" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ProjectAddress">Адрес проектируемого объекта</label>
                    <input type="text" required className="form-control" name="ProjectAddress" />
                  </div>
                  {/*<div className="form-group">
                    <label htmlFor="ApzDate">Дата</label>
                    <input type="date" required className="form-control" name="ApzDate" />
                  </div>*/}
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab1" role="tabpanel" aria-labelledby="tab1-link">
              <form id="tab1-form" data-tab="1" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="ObjectClient">Заказчик</label>
                  <input type="text" required className="form-control" name="ObjectClient" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="ObjectName">Наименование объекта:</label>
                  <input type="text" required className="form-control" name="ObjectName" placeholder="наименование" />
                </div>
                <div className="form-group">
                  <label htmlFor="CadastralNumber">Кадастровый номер:</label>
                  <input type="text" className="form-control" name="ObjectName" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="ObjectTerm">Срок строительства по нормам</label>
                  <input type="text" className="form-control" id="ObjectTerm" placeholder="" />
                </div>
                {/* <div className="form-group">
                  <label htmlFor="">Правоустанавливающие документы на объект (реконструкция)</label>
                  <div className="fileinput fileinput-new" data-provides="fileinput">
                  <span className="btn btn-default btn-file"><span></span><input type="file" multiple /></span>
                  <span className="fileinput-filename"></span><span className="fileinput-new"></span>
                  </div>
                </div> */}
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="ObjectLevel">Этажность</label>
                  <input type="number" className="form-control" name="ObjectLevel" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="ObjectArea">Площадь здания</label>
                  <input type="number" className="form-control" name="ObjectArea" />
                </div>
                <div className="form-group">
                  <label htmlFor="ObjectRooms">Количество квартир (номеров, кабинетов)</label>
                  <input type="number" className="form-control" name="OBjectRooms" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-link">
              <form id="tab2-form" data-tab="2" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="ElectricRequiredPower">Требуемая мощность (кВт)</label>
                  <input type="number" className="form-control" name="ElectricRequiredPower" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricityPhase">Характер нагрузки (фаза)</label>
                  <select className="form-control" name="ElectricityPhase">
                  <option>Однофазная</option>
                  <option>Трехфазная</option>
                  <option>Постоянная</option>
                  <option>Временная</option>
                  <option>Сезонная</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricSafetyCategory">Категория по надежности (кВт)</label>
                  <input type="text" className="form-control" required name="ElectricSafetyCategory" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricMaxLoadDevice">из указанной макс. нагрузки относятся к электроприемникам (кВА):</label>
                  <input type="number" className="form-control" name="ElectricMaxLoadDevice" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                {/*<div className="form-group">
                  <label htmlFor="">Предполагается установить</label>
                  <br />
                  <div className="col-md-6">
                  <ul style="list-style-type: none; padding-left: 3px">
                    <li><input type="checkbox" id="CB1"><span style="padding-left: 3px" htmlFor="CB1">электрокотлы</span><input type="text" className="form-control" placeholder=""></li>
                    <li><input type="checkbox" id="CB2"><span style="padding-left: 3px" htmlFor="CB2">электрокалориферы</span><input type="text" className="form-control" placeholder=""></li>
                    <li><input type="checkbox" id="CB3"><span style="padding-left: 3px" htmlFor="CB3">электроплитки</span><input type="text" className="form-control" placeholder=""></li>
                  </ul>
                  </div>
                  <div className="col-md-6">
                  <ul style="list-style-type: none; padding-left: 3px">
                    <li><input type="checkbox" id="CB4"><span style="padding-left: 3px" htmlFor="CB4">электропечи</span><input type="text" className="form-control" placeholder=""></li>
                    <li><input type="checkbox" id="CB5"><span style="padding-left: 3px" htmlFor="CB5">электроводонагреватели</span><input type="text" className="form-control" placeholder=""></li>
                  </ul>
                  </div>
                </div>*/}
                <div className="form-group">
                  <label htmlFor="ElectricMaxLoad">Существующая максимальная нагрузка (кВА)</label>
                  <input type="number" className="form-control" name="ElectricMaxLoad" />
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricAllowedPower">Разрешенная по договору мощность трансформаторов (кВА)</label>
                  <input type="number" className="form-control" name="ElectricAllowedPower" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-link">
              <form id="tab3-form" data-tab="3" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="WaterRequirement">Общая потребность в воде (м<sup>3</sup>/сутки)</label>
                  <input type="number" required className="form-control" name="WaterRequirement" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="WaterDrinking">На хозпитьевые нужды (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="WaterDrinking" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="WaterProduction">На производственные нужды (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="WaterProduction" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="WaterFireFighting">Потребные расходы пожаротушения (л/сек)</label>
                  <input type="number" className="form-control" name="WaterFireFighting" />
                </div>
                <div className="form-group">
                  <label htmlFor="WaterSewage">Общее количество сточных вод (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="WaterSewage" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab4" role="tabpanel" aria-labelledby="tab4-link">
              <form id="tab4-form" data-tab="4" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="SewageAmount">Общее количество сточных вод  (м<sup>3</sup>/сутки)</label>
                  <input type="number" required className="form-control" name="SewageAmount" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="SewageFeksal">фекcальных (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="SewageFeksal" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="SewageProduction">Производственно-загрязненных (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="SewageProduction" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="SewageToCity">Условно-чистых сбрасываемых на городскую канализацию (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="SewageToCity" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab5" role="tabpanel" aria-labelledby="tab5-link">
              <form id="tab5-form" data-tab="5" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="HeatGeneral">Общая тепловая нагрузка (Гкал/ч)</label>
                  <input type="number" className="form-control" name="HeatGeneral" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatMain">Отопление (Гкал/ч)</label>
                  <input type="number" className="form-control" name="HeatMain" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatVentilation">Вентиляция (Гкал/ч)</label>
                  <input type="number" className="form-control" name="HeatVentilation" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatWater">Горячее водоснабжение (Гкал/ч)</label>
                  <input type="number" className="form-control" id="HeatWater" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="HeatTech">Технологические нужды(пар) (Т/ч)</label>
                  <input type="number" className="form-control" name="HeatTech" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatDistribution">Разделить нагрузку по жилью и по встроенным помещениям</label>
                  <input type="text" className="form-control" name="HeatDistribution" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatSaving">Энергосберегающее мероприятие</label>
                  <input type="text" className="form-control" name="HeatSaving" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab6" role="tabpanel" aria-labelledby="tab6-link">
              <form id="tab6-form" data-tab="6" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="SewageClientWishes">Пожелание заказчика</label>
                  <input type="text" className="form-control" name="SewageClientWishes" placeholder="" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab7" role="tabpanel" aria-labelledby="tab7-link">
              <form id="tab7-form" data-tab="7" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="PhoneServiceNum">Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</label>
                  <input type="number" className="form-control" name="PhoneServiceNum" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="PhoneCapacity">Телефонная емкость</label>
                  <input type="text" className="form-control" name="PhoneCapacity" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="PhoneSewage">Планируемая телефонная канализация</label>
                  <input type="text" className="form-control" name="PhoneSewage" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="PhoneClientWishes">Пожелания заказчика (тип оборудования, тип кабеля и др.)</label>
                  <input type="text" className="form-control" name="PhoneClientWishes" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab8" role="tabpanel" aria-labelledby="tab8-link">
              <form id="tab8-form" data-tab="8" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="GasGeneral">Общая потребность (м<sup>3</sup>/час)</label>
                  <input type="number" required className="form-control" name="GasGeneral" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasCooking">На приготовление пищи (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasCooking" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasHeat">Отопление (м<sup>3</sup>/час)</label>
                  <input type="number" required className="form-control" name="GasHeat" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="GasVentilation">Вентиляция (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasVentilation" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasConditioner">Кондиционирование (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasConditioner" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasWater">Горячее водоснабжение при газификации многоэтажных домов (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasWater" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission.bind(this)} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }
}
