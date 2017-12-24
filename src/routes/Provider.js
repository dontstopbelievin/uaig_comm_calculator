import React from 'react';
//import { NavLink } from 'react-router-dom';

export default class Provider extends React.Component {

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
      showElecDetail: false,
      showWaterDetail: false,
      showHeatDetail: false,
      showGasDetail: false,
      wReq: 0, wDrink: 0, wProd: 0, wFireF: 0, wS: 0,
      hGen: 0, hMain: 0, hVen: 0, hWater: 0, hTech: 0, hDist: "", hSav: "",
      gGen: 0, gCook: 0, gHeat: 0, gVen: 0, gCon: 0, gWater: 0,
      eReqPow: 0, ePhase: "", eSafeCat: "", eMaxLDev: 0, eMaxLoad: 0, eAllowedP: 0,
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
    var roleName = JSON.parse(sessionStorage.getItem('userRoles'))[1];
    if(roleName === 'Electricity'){
      if(e.Status === 3 && e.ApzElectricityStatus === 2){
        this.setState({ showButtons: true });
      }
      this.setState({ showElecDetail: true });
      this.setState({ eReqPow: e.ElectricRequiredPower }); 
      this.setState({ ePhase: e.ElectricityPhase }); 
      this.setState({ eSafeCat: e.ElectricSafetyCategory }); 
      this.setState({ eMaxLDev: e.ElectricMaxLoadDevice }); 
      this.setState({ eMaxLoad: e.ElectricMaxLoad }); 
      this.setState({ eAllowedP: e.ElectricAllowedPower }); 
    }
    else if(roleName === 'Water'){
      if(e.Status === 3 && e.ApzWaterStatus === 2){
        this.setState({ showButtons: true });
      }
      this.setState({ showWaterDetail: true });
      this.setState({ wReq: e.WaterRequirement }); 
      this.setState({ wDrink: e.WaterDrinking }); 
      this.setState({ wProd: e.WaterProduction }); 
      this.setState({ wFireF: e.WaterFireFighting }); 
      this.setState({ wS: e.WaterSewage });
    }
    else if(roleName === 'Heat'){
      if(e.Status === 3 && e.ApzHeatStatus === 2){
        this.setState({ showButtons: true });
      }
      this.setState({ showHeatDetail: true });
      this.setState({ hGen: e.HeatGeneral }); 
      this.setState({ hMain: e.HeatMain }); 
      this.setState({ hVen: e.HeatVentilation }); 
      this.setState({ hWater: e.HeatWater }); 
      this.setState({ hTech: e.HeatTech });
      this.setState({ hDist: e.HeatDistribution });
      this.setState({ hSav: e.HeatSaving }); 
    }
    else if(roleName === 'Gas'){
      if(e.Status === 3 && e.ApzGasStatus === 2){
        this.setState({ showButtons: true }); 
      }
      this.setState({ showGasDetail: true });
      this.setState({ gGen: e.GasGeneral }); 
      this.setState({ gCook: e.GasCooking }); 
      this.setState({ gVen: e.GasVentilation }); 
      this.setState({ gCon: e.GasConditioner }); 
      this.setState({ gWater: e.GasWater });
      this.setState({ gHeat: e.GasHeat });
    }
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
    //console.log(event.target.id);
    // var d = document.getElementById(e.target.id);
    // d.className += "active";
  }

  getApzFormList() {
    var token = sessionStorage.getItem('tokenInfo');
    var providerName = JSON.parse(sessionStorage.getItem('userRoles'))[1];
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/provider/" + providerName, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        // for WaterProvider
        if(providerName === 'Water'){
          // filter the whole list to get only accepted apzForms
          var acc_forms_list = data.filter(function(obj) { return obj.ApzWaterStatus === 1; });
          this.setState({acceptedForms: acc_forms_list});
          // filter the list to get the declined apzForms
          var dec_forms_list = data.filter(function(obj) { return obj.ApzWaterStatus === 0; });
          this.setState({declinedForms: dec_forms_list});
          // filter the list to get in-process apzForms
          var act_forms_list = data.filter(function(obj) { return (obj.ApzWaterStatus === 2 && obj.Status === 3); });
          this.setState({activeForms: act_forms_list});
        }
        // for HeatProvider
        else if(providerName === 'Heat'){
          // filter the whole list to get only accepted apzForms
          acc_forms_list = data.filter(function(obj) { return obj.ApzHeatStatus === 1; });
          this.setState({acceptedForms: acc_forms_list});
          // filter the list to get the declined apzForms
          dec_forms_list = data.filter(function(obj) { return obj.ApzHeatStatus === 0; });
          this.setState({declinedForms: dec_forms_list});
          // filter the list to get in-process apzForms
          act_forms_list = data.filter(function(obj) { return (obj.ApzHeatStatus === 2 && obj.Status === 3); });
          this.setState({activeForms: act_forms_list});
        }
        // for GasProvider
        else if(providerName === 'Gas'){
          // filter the whole list to get only accepted apzForms
          acc_forms_list = data.filter(function(obj) { return obj.ApzGasStatus === 1; });
          this.setState({acceptedForms: acc_forms_list});
          // filter the list to get the declined apzForms
          dec_forms_list = data.filter(function(obj) { return obj.ApzGasStatus === 0; });
          this.setState({declinedForms: dec_forms_list});
          // filter the list to get in-process apzForms
          act_forms_list = data.filter(function(obj) { return (obj.ApzGasStatus === 2 && obj.Status === 3); });
          this.setState({activeForms: act_forms_list});
        }
        // for ElectricityProvider
        else{
          // filter the whole list to get only accepted apzForms
          acc_forms_list = data.filter(function(obj) { return obj.ApzElectricityStatus === 1; });
          this.setState({acceptedForms: acc_forms_list});
          // filter the list to get the declined apzForms
          dec_forms_list = data.filter(function(obj) { return obj.ApzElectricityStatus === 0; });
          this.setState({declinedForms: dec_forms_list});
          // filter the list to get in-process apzForms
          act_forms_list = data.filter(function(obj) { return (obj.ApzElectricityStatus === 2 && obj.Status === 3); });
          this.setState({activeForms: act_forms_list});
        }
      }
    }.bind(this);
    xhr.send();
  }

  // accept or decline the form
  acceptDeclineApzForm(apzId, status, comment) {
    //console.log(apzId);
    //console.log(status);
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
    xhr.send(dd); 
  }

  componentWillMount() {
    //console.log("ProviderComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];
      this.props.history.replace('/' + userRole);
    }else {
      this.props.history.replace('/');
    }
  }

  componentDidMount() {
    //console.log("ProviderComponent did mount");
    this.getApzFormList();
  }

  componentWillUnmount() {
    //console.log("ProviderComponent will unmount");
  }

  render() {
    //console.log("rendering the ProviderComponent");
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
            <div className="col-md-6 apz-additional card" style={{paddingLeft:'0px', paddingRight:'0px'}}>
              {/*<div className="col-md-12 well" style={{paddingLeft:'0px', paddingRight:'0px', height:'300px', width:'100%'}}>
                  <div className="viewDivProvider" ref={this.onReference.bind(this)}>
                    <div className="container">
                      <p>Загрузка...</p>
                    </div>
                  </div>
              </div>*/}
              {/*<button class="btn-block btn-info col-md-3" id="printApz">
                Распечатать АПЗ
              </button>*/}
            </div>
            <div id="apz-detailed" className="col-md-3 apz-detailed card" style={{paddingTop: '10px'}}>
              <div className={this.state.showDetails ? 'row' : 'invisible'}>
                <div className="col-6"><b>Заявитель</b>:</div><div className="col-6">{this.state.Applicant}</div>
                <div className="col-6"><b>Адрес</b>:</div><div className="col-6">{this.state.Address}</div>
                <div className="col-6"><b>Телефон</b>:</div><div className="col-6">{this.state.Phone}</div>
                <div className="col-6"><b>Заказчик</b>:</div><div className="col-6">{this.state.Customer}</div>
                <div className="col-6"><b>Разработчик</b>:</div><div className="col-6">{this.state.Designer}</div>
                <div className="col-6"><b>Название проекта</b>:</div><div className="col-6">{this.state.ProjectName}</div>
                <div className="col-6"><b>Адрес проекта</b>:</div><div className="col-6">{this.state.ProjectAddress}</div>
                <div className="col-6"><b>Дата заявления</b>:</div><div className="col-6">{this.state.ApzDate}</div>
                
                <div className={this.state.showElecDetail ? 'row detail' : 'invisible'}>
                  <br /><br />
                  <div style={{margin: 'auto', color: '#D77B38'}}><b>Детали электроснабжения</b></div>
                  <div className="col-7"><b>Требуемая мощность (кВт)</b>:</div><div className="col-5">{this.state.eReqPow}</div>
                  <div className="col-7"><b>Характер нагрузки (фаза)</b>:</div><div className="col-5">{this.state.ePhase}</div>
                  <div className="col-7"><b>Категория (кВт)</b>:</div><div className="col-2">{this.state.eSafeCat}</div>
                  <div className="col-7"><b>Из указ. макс. нагрузки относ. к э-приемникам (кВА)</b>:</div><div className="col-5">{this.state.eMaxLDev}</div>
                  <div className="col-7"><b>Сущ. макс. нагрузка (кВА)</b>:</div><div className="col-5">{this.state.eMaxLoad}</div>
                  <div className="col-7"><b>мощность трансформаторов (кВА)</b>:</div><div className="col-5">{this.state.eAllowedP}</div>
                </div>
                <div className={this.state.showWaterDetail ? 'row detail' : 'invisible'}>
                  <br /><br />
                  <div style={{margin: 'auto', color: '#D77B38'}}><b>Детали водоснабжения</b></div>
                  <div className="col-7"><b>Общая потребность (м<sup>3</sup>/сутки)</b>:</div><div className="col-5">{this.state.wReq}</div>
                  <div className="col-7"><b>Хозпитьевые нужды (м<sup>3</sup>/сутки)</b>:</div><div className="col-5">{this.state.wDrink}</div>
                  <div className="col-7"><b>Производ. нужды (м<sup>3</sup>/сутки)</b>:</div><div className="col-5">{this.state.wProd}</div>
                  <div className="col-7"><b>Расходы пожаротушения (л/сек)</b>:</div><div className="col-5">{this.state.wFireF}</div>
                  <div className="col-7"><b>Общ. кол. сточных вод (м<sup>3</sup>/сутки)</b>:</div><div className="col-5">{this.state.wS}</div>
                </div>
                <div className={this.state.showHeatDetail ? 'row detail' : 'invisible'}>
                  <br /><br />
                  <div style={{margin: 'auto', color: '#D77B38'}}><b>Детали теплоснабжения</b></div>
                  <div className="col-7"><b>Общая нагрузка (Гкал/ч)</b>:</div><div className="col-5">{this.state.hGen}</div>
                  <div className="col-7"><b>Отопление (Гкал/ч)</b>:</div><div className="col-5">{this.state.hMain}</div>
                  <div className="col-7"><b>Вентиляция (Гкал/ч)</b>:</div><div className="col-5">{this.state.hVen}</div>
                  <div className="col-7"><b>Энергосб. мероприятие</b>:</div><div className="col-5">{this.state.hSav}</div>
                  <div className="col-7"><b>Горячее водоснаб.(Гкал/ч)</b>:</div><div className="col-5">{this.state.hWater}</div>
                  <div className="col-7"><b>Технолог. нужды(пар) (Т/ч)</b>:</div><div className="col-5">{this.state.hTech}</div>
                  <div className="col-7"><b>Разделить нагрузку</b>:</div><div className="col-5">{this.state.hDist}</div>
                </div>
                <div className={this.state.showGasDetail ? 'row detail' : 'invisible'}>
                  <br /><br />
                  <div style={{margin: 'auto', color: '#D77B38'}}><b>Детали газоснабжения</b></div>
                  <div className="col-7"><b>Общ. потребность (м<sup>3</sup>/час)</b>:</div><div className="col-5">{this.state.gGen}</div>
                  <div className="col-7"><b>На приготов. пищи (м<sup>3</sup>/час)</b>:</div><div className="col-5">{this.state.gCook}</div>
                  <div className="col-7"><b>Отопление (м<sup>3</sup>/час)</b>:</div><div className="col-5">{this.state.gHeat}</div>
                  <div className="col-7"><b>Вентиляция (м<sup>3</sup>/час)</b>:</div><div className="col-5">{this.state.gVen}</div>
                  <div className="col-7"><b>Кондиционирование (м<sup>3</sup>/час)</b>:</div><div className="col-5">{this.state.gCon}</div>
                  <div className="col-7"><b>Горячее водоснаб. (м<sup>3</sup>/час)</b>:</div><div className="col-5">{this.state.gWater}</div>
                </div>
                <div className={this.state.showButtons ? 'btn-group' : 'invisible'} role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', marginBottom: '10px'}}>
                  <button className="btn btn-raised btn-success" style={{marginRight: '5px'}}
                          onClick={this.acceptDeclineApzForm.bind(this, this.state.Id, true, "your form was accepted")}>
                    Одобрить
                  </button>
                  <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#accDecApzForm">
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