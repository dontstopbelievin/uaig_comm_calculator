import React from 'react';
//import * as esriLoader from 'esri-loader';
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
      description: ""
    }

    this.getApzFormList = this.getApzFormList.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  details(e) {
    console.log(e);
    this.setState({ showButtons: false });
    if(e.Status === 2) { this.setState({ showButtons: true }); }
    this.setState({ showDetails: true });
    this.setState({ Id: e.Id });
    this.setState({ Applicant: e.Applicant });
    this.setState({ Address: e.Address });
    this.setState({ Phone: e.Phone });
    this.setState({ Customer: e.Customer });
    this.setState({ Designer: e.Designer });
    this.setState({ ProjectName: e.ProjectName });
    this.setState({ ProjectAddress: e.ProjectAddress });
    this.setState(function(){
      var jDate = new Date(e.ApzDate);
      var curr_date = jDate.getDate();
      var curr_month = jDate.getMonth() + 1;
      var curr_year = jDate.getFullYear();
      var formated_date = curr_date + "-" + curr_month + "-" + curr_year;
      return { ApzDate: formated_date }
    });
  }

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

  // accept or decline the form
  acceptDeclineApzForm(apzId, status, comment) {
    //console.log(apzId);
    //console.log(statusName);
    var token = sessionStorage.getItem('tokenInfo');

    var statusData = {Response: status, Message: comment};
    var dd = JSON.stringify(statusData);

    var tempAccForms = this.state.acceptedForms;
    var tempDecForms = this.state.declinedForms;
    var tempActForms = this.state.activeForms;
    // need to get the position of form in the list
    var formPos = tempActForms.map(function(x) {return x.Id; }).indexOf(apzId);
    //console.log(formPos);

    var xhr = new XMLHttpRequest();
    xhr.open("put", window.url + "api/apz/status/" + apzId, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      var data = JSON.parse(xhr.responseText);
      console.log(data);
      if (xhr.status === 200) {
        if(status === true){
          alert("apzForm is accepted");
          // to hide the buttons
          this.setState({ showButtons: false });
          tempActForms.splice(formPos,1);
          this.setState({activeForms: tempActForms});
          tempAccForms.push(data);
          this.setState({acceptedForms: tempAccForms});
          console.log("apzForm was accepted");
        }
        else{
          alert("apzForm is rejected");
          // to hide the buttons
          this.setState({ showButtons: false });
          tempActForms.splice(formPos,1);
          this.setState({activeForms: tempActForms});
          tempDecForms.push(data);
          this.setState({declinedForms: tempDecForms});
          console.log("apzForm was declined");
        }
      }
      else if(xhr.status === 401){
        sessionStorage.clear();
        alert("Token is expired, please login again!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(dd); 
  }

  // createMap(element){
  //   console.log(this.refs)
  //   esriLoader.dojoRequire([
  //     "esri/views/SceneView",
  //     "esri/widgets/LayerList",
  //     "esri/WebScene",
  //     "esri/layers/FeatureLayer",
  //     "esri/layers/TileLayer",
  //     "esri/widgets/Search",
  //     "esri/Map",
  //     "dojo/domReady!"
  //   ], function(
  //     SceneView, LayerList, WebScene, FeatureLayer, TileLayer, Search, Map
  //   ) {

  //     //функциональное зонирование
  //     var flFunkZon = new FeatureLayer({
  //       portalItem: {  // autocasts as esri/portal/PortalItem
  //         id: "7dd6833628d34453939ed2c6fa514bb5"
  //       },
  //       outFields: ["*"],
  //       visible: true,
  //       title: "Функциональное зонирование"
  //     });
      
      
  //     //красные линии
  //     var flRedlines = new TileLayer({
  //       portalItem: {  // autocasts as esri/portal/PortalItem
  //         id: "f93a74c28c904666932f084d91719fdc"
  //       },
  //       outFields: ["*"],
  //       visible: true,
  //       title: "Красные линии"
  //     });
  //     var map = new Map({
  //       basemap: "dark-gray"
  //     });
  //     map.add(flFunkZon);
  //     map.add(flRedlines);
  //     var view = new SceneView({
  //       container: element,
  //       map: map,
  //       center: [76.886, 43.250], // lon, lat
  //       scale: 10000
  //     });
      
  //     var searchWidget = new Search({
  //       view: view,
  //       sources: [{
  //         featureLayer: new FeatureLayer({
  //           portalItem: {
  //             id: "dcd7bef523324a149843a070fd857b11"
  //           },
  //           popupTemplate: { // autocasts as new PopupTemplate()
  //             title: "Кадастровый номер: {CADASTRAL_NUMBER} </br> Назначение: {FUNCTION_} <br/> Вид собственности: {OWNERSHIP}"
  //           }
  //         }),
  //         searchFields: ["CADASTRAL_NUMBER"],
  //         displayField: "CADASTRAL_NUMBER",
  //         exactMatch: false,
  //         outFields: ["CADASTRAL_NUMBER", "FUNCTION_", "OWNERSHIP"],
  //         name: "Зарегистрированные государственные акты",
  //         placeholder: "Кадастровый поиск"
  //       }]
  //     });
  //     // Add the search widget to the top left corner of the view
  //     view.ui.add(searchWidget, {
  //       position: "top-right"
  //     });
  //     view.then(function() {
  //       var layerList = new LayerList({
  //         view: view
  //       });

  //       // Add widget to the top right corner of the view
  //       view.ui.add(layerList, "bottom-right");
  //     });
  //   });
  // }

  // onReference(element) {
  //   console.log('mounted');
  //   if(!esriLoader.isLoaded()) {
  //     esriLoader.bootstrap(
  //       err => {
  //         if(err) {
  //           console.log(err);
  //         } else {
  //           this.createMap(element);
  //         }
  //       },
  //       {
  //         url: "https://js.arcgis.com/4.5/"
  //       }
  //     );
  //   } else {
  //     this.createMap(element);
  //   }
  // }

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
                    <li key={i} onClick={this.details.bind(this, actForm)}>
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
                    <li key={i} onClick={this.details.bind(this, accForm)}>
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
                    <li key={i} onClick={this.details.bind(this, decForm)}>
                      {decForm.ProjectName}
                    </li>
                  )
                }.bind(this))
              }
              </h4>
            </div>
            <div className="col-md-6 apz-additional card" style={{padding: '0'}}>
              <div className="col-md-12 well" style={{padding: '0', height:'300px', width:'100%'}}>
                  {/*<div className="viewDivUrban" ref={this.onReference.bind(this)}>
                    <div className="container">
                      <p>Загрузка...</p>
                    </div>
                  </div>*/}
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
                        <form onSubmit={this.acceptDeclineApzForm.bind(this, this.state.Id, false, this.state.description)}>
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
                            <input type="submit" className="btn btn-primary" value="Отправить" />
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                          </div>
                        </form>
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