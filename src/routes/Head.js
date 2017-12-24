import React from 'react';
//import { NavLink } from 'react-router-dom';

export default class Head extends React.Component {

  constructor() {
    super();

    this.state = {
      acceptedForms: [],
      declinedForms: [],
      onHoldForms: [],
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
    if(e.Status === 4) { this.setState({ showButtons: true }); }
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
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/all", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        // filter the whole list to get only accepted apzForms
        var acc_forms_list = data.filter(function(obj) { return (obj.Status === 1 && (obj.HeadDate !== null && obj.HeadResponse === null)); });
        this.setState({acceptedForms: acc_forms_list});
        // filter the list to get the declined apzForms
        var dec_forms_list = data.filter(function(obj) { return (obj.Status === 0 && (obj.HeadDate !== null && obj.HeadResponse !== null)); });
        this.setState({declinedForms: dec_forms_list});
        // filter the list to get the unanswered apzForms
        var onhold_forms_list = data.filter(function(obj) { return obj.Status === 4; });
        this.setState({onHoldForms: onhold_forms_list});
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
    var tempOnHoldList = this.state.onHoldForms;
    // need to get the position of form in the list
    var formPos = tempOnHoldList.map(function(x) {return x.Id; }).indexOf(apzId);
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
          tempOnHoldList.splice(formPos,1);
          this.setState({onHoldForms: tempOnHoldList});
          tempAccForms.push(data);
          this.setState({acceptedForms: tempAccForms});
          console.log("Заявление принято!");
        }
        else{
          alert("Заявление отклонено!");
          // to hide the buttons
          this.setState({ showButtons: false });
          tempOnHoldList.splice(formPos,1);
          this.setState({onHoldForms: tempOnHoldList});
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
    //console.log("HeadComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[1];
      this.props.history.replace('/' + userRole);
    }else {
      this.props.history.replace('/');
    }
  }

  componentDidMount() {
    //console.log("HeadComponent did mount");
    this.getApzFormList();
  }

  componentWillUnmount() {
    //console.log("HeadComponent will unmount");
  }

  render() {
    //console.log("rendering the HeadComponent");
    var acceptedForms = this.state.acceptedForms;
    var declinedForms = this.state.declinedForms;
    var onHoldForms = this.state.onHoldForms;
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
              <h4><span id="in-process">В процессе</span>
              {
                onHoldForms.map(function(onholdForm, i){
                  return(
                    <li key={i} onClick={this.details.bind(this, onholdForm)}>
                      {onholdForm.ProjectName}
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
              <div className="col-md-12 well" style={{paddingLeft:'0px', paddingRight:'0px', height:'300px', width:'100%'}}>
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
                <div className={this.state.showButtons ? 'btn-group' : 'invisible'} role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', marginBottom: '10px'}}>
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