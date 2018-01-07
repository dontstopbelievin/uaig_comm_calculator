import React from 'react';
import * as esriLoader from 'esri-loader';
//import { NavLink } from 'react-router-dom';

export default class Urban extends React.Component {
  constructor() {
    super();

    this.state = {
      acceptedForms: [],
      declinedForms: [],
      activeForms: [],
      showDetails: false,
      showButtons: true,
      Id: "",
      Applicant: "",
      Address: "",
      Phone: "",
      Customer: "",
      Designer: "",
      ProjectName: "",
      ProjectAddress: "",
      ApzDate: "",
      description: "",
      personalIdDoc: null,
      personalIdDocExt: null,
      confirmedTaskDoc: null,
      confirmedTaskDocExt: null,
      titleDocumentDoc: null,
      titleDocumentDocExt: null
    }

    this.getApzFormList = this.getApzFormList.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  // get the list of apz forms
  getApzFormList() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/region", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        // filter the whole list to get only accepted apzForms
        var acc_forms_list = data.filter(function(obj) { return ((obj.Status === 0 || obj.Status === 1 || obj.Status === 3 || obj.Status === 4) && (obj.RegionDate !== null && obj.RegionResponse === null)); });
        this.setState({acceptedForms: acc_forms_list});
        // filter the list to get the declined apzForms
        var dec_forms_list = data.filter(function(obj) { return (obj.Status === 0 && (obj.RegionDate !== null && obj.RegionResponse !== null)); });
        this.setState({declinedForms: dec_forms_list});
        // filter the list to get the unanswered apzForms
        var act_forms_list = data.filter(function(obj) { return obj.Status === 2; });
        this.setState({activeForms: act_forms_list});
      }
    }.bind(this);
    xhr.send();
  }

  // get detailed info for clicked apz
  getApzDetails(apzId) {
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/region/detail/" + apzId, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send();
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        this.setState({ showButtons: false });
        if(data.Status === 2) { this.setState({ showButtons: true }); }
        this.setState({ showDetails: true });
        this.setState({ Id: data.Id });
        this.setState({ Applicant: data.Applicant });
        this.setState({ Address: data.Address });
        this.setState({ Phone: data.Phone });
        this.setState({ Customer: data.Customer });
        this.setState({ Designer: data.Designer });
        this.setState({ ProjectName: data.ProjectName });
        this.setState({ ProjectAddress: data.ProjectAddress });
        this.setState({ personalIdDoc: data.PersonalIdFile });
        this.setState({ personalIdDocExt: data.PersonalIdFileExt });
        this.setState({ confirmedTaskDoc: data.ConfirmedTaskFile });
        this.setState({ confirmedTaskDocExtir: data.ConfirmedTaskFileExt });
        this.setState({ titleDocumentDoc: data.TitleDocumentFile });
        this.setState({ titleDocumentDocExt: data.TitleDocumentFileExt });
        this.setState(function(){
          var jDate = new Date(data.ApzDate);
          var curr_date = jDate.getDate();
          var curr_month = jDate.getMonth() + 1;
          var curr_year = jDate.getFullYear();
          var formated_date = curr_date + "-" + curr_month + "-" + curr_year;
          return { ApzDate: formated_date }
        });
      }
    }.bind(this);
  }

  // accept or decline the form
  acceptDeclineApzForm(apzId, status, comment) {
    //console.log(apzId);
    //console.log(statusName);
    var token = sessionStorage.getItem('tokenInfo');

    var formData = new FormData();
    formData.append('Response', status);
    formData.append('Message', comment);

    var tempAccForms = this.state.acceptedForms;
    var tempDecForms = this.state.declinedForms;
    var tempActForms = this.state.activeForms;
    // need to get the position of form in the list
    var formPos = tempActForms.map(function(x) {return x.Id; }).indexOf(apzId);
    //console.log(formPos);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/status/" + apzId, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      var data = JSON.parse(xhr.responseText);
      console.log(data);
      if (xhr.status === 200) {
        if(status === true){
          alert("Заявление принято!");
          // to hide the buttons
          this.setState({ showButtons: false });
          tempActForms.splice(formPos,1);
          this.setState({activeForms: tempActForms});
          tempAccForms.push(data);
          this.setState({acceptedForms: tempAccForms});
          console.log("Заявление принято!");
        }
        else{
          alert("Заявление отклонено!");
          // to hide the buttons
          this.setState({ showButtons: false });
          tempActForms.splice(formPos,1);
          this.setState({activeForms: tempActForms});
          tempDecForms.push(data);
          this.setState({declinedForms: tempDecForms});
          console.log("Заявление отклонено!");
        }
      }
      else if(xhr.status === 401){
        sessionStorage.clear();
        alert("Token is expired, please login again!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData); 
  }

  // function to download files
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

  createMap(element){
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

      var flGosAkts = new FeatureLayer({
        url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
        outFields: ["*"],
        title: "Гос акты"
      });
      map.add(flGosAkts);
      
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
    //console.log("UrbanComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];
      this.props.history.replace('/' + userRole);
    }else {
      this.props.history.replace('/');
    }
  }

  componentDidMount() {
    //console.log("UrbanComponent did mount");
    this.getApzFormList();
  }

  componentWillUnmount() {
    //console.log("UrbanComponent will unmount");
  }

  render() {
    //console.log("rendering the UrbanComponent");
    var acceptedForms = this.state.acceptedForms;
    var declinedForms = this.state.declinedForms;
    var activeForms = this.state.activeForms;
    return (
      <div>
        {/*<nav className="navbar-expand-lg navbar-light bg-secondary">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="container collapse navbar-collapse" id="navbarTogglerDemo03">
           <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
             <li className="nav-item">
               <NavLink to={"/Urban"} replace className="nav-link" activeClassName="active">Гос. услуги 1</NavLink>
             </li>
             <li className="nav-item">
               <NavLink to={"/Urban"} replace className="nav-link" activeClassName="active">Гос. услуги 2</NavLink>
             </li>
             <li className="nav-item">
               <NavLink to={"/Urban"} replace className="nav-link" activeClassName="active">Гос. услуги 3</NavLink>
             </li>
            </ul>
          </div>
        </nav>*/}
        <div className="content container">
          <div className="row">
            <style dangerouslySetInnerHTML={{__html: ``}} />
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
                  <div className="viewDivUrban" ref={this.onReference.bind(this)}>
                    <div className="container">
                      <p>Загрузка...</p>
                    </div>
                  </div>
              </div>
              {/*<button class="btn-block btn-info col-md-3" id="printApz">
                Распечатать АПЗ
              </button>*/}
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
                { this.state.personalIdDoc ? <div className="col-sm-12"><div className="row"><div className="col-6"><b>Уд. лич./ Реквизиты</b>:</div> <div className="col-6"><a className="text-info pointer" data-file={this.state.personalIdDoc} data-name="Уд. лич./Реквизиты" data-ext={this.state.personalIdDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></div></div></div> :''}
                { this.state.confirmedTaskDoc ? <div className="col-sm-12"><div className="row"><div className="col-6"><b>Утвержденное задание</b>:</div> <div className="col-6"><a className="text-info pointer" data-file={this.state.confirmedTaskDoc} data-name="Утвержденное задание" data-ext={this.state.confirmedTaskDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></div></div></div> :''}
                { this.state.titleDocumentDoc ? <div className="col-sm-12"><div className="row"><div className="col-6"><b>Правоустанавл. документ</b>:</div> <div className="col-6"><a className="text-info pointer" data-file={this.state.titleDocumentDoc} data-name="Правоустанавл. документ" data-ext={this.state.titleDocumentDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></div></div></div> :''}
              
                <div className={this.state.showButtons ? 'btn-group' : 'invisible'} role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px'}}>
                  <button className="btn btn-raised btn-success" style={{marginRight: '5px'}}
                          onClick={this.acceptDeclineApzForm.bind(this, this.state.Id, true, "your form was accepted")}>
                    Одобрить
                  </button>
                  <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#accDecApzForm">
                          {/*onClick={this.acceptDeclineApzForm.bind(this, this.state.Id, false, "your form was rejected")}>*/}
                    Отклонить
                  </button>
                  <div className="modal fade" id="accDecApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Причина отклонения</h5>
                          <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group">
                            <textarea rows="5" className="form-control" value={this.state.description} onChange={this.onDescriptionChange} placeholder="Описание"></textarea>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.acceptDeclineApzForm.bind(this, this.state.Id, false, this.state.description)}>Отправить</button>
                          <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}