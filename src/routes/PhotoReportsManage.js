import React, { Component } from 'react';
import { Route, NavLink, Switch, Redirect} from 'react-router-dom';
import PreloaderIcon, {ICON_TYPE} from 'react-preloader-icon';

export default class PhotoReportsManage extends React.Component {
  constructor() {
    super();
    this.state = {
      loadingVisible: false,
      showDetails: false,
      activeList: [],
      ApplicationDate: "",
      CompanyName: "",
      CompanyLegalAddress: "",
      CompanyFactualAddress: "",
      PhotoAddress: "",
      CompanyRegion: "",
      IIN: "",
      CompanyPhone: "",
      StartDate: "",
      EndDate: "",
      Comments: "",
      Status: ""
    }
    
    this.sendForm = this.sendForm.bind(this);
    this.getList = this.getList.bind(this);
  }

  getList() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/photoreport/request/active", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        this.setState({ activeList: data });
      }
    }.bind(this);
    xhr.send();
  }

  getDetails(e) {
    // console.log(e);
    this.setState({ showDetails: true });
    this.setState({ CompanyName: e.CompanyName });
    this.setState({ CompanyLegalAddress: e.CompanyLegalAddress });
    this.setState({ CompanyFactualAddress: e.CompanyFactualAddress });
    this.setState({ PhotoAddress: e.PhotoAddress });
    this.setState({ CompanyRegion: e.CompanyRegion });
    this.setState({ IIN: e.IIN });
    this.setState({ CompanyPhone: e.CompanyPhone });
    this.setState({ Comments: e.Comments });
    this.setState({ Status: e.Status });
    this.setState(() => { var x = new Date(e.ApplicationDate);
      return { ApplicationDate: (x.getDate()) + "." + (x.getMonth()+1) + "." + (x.getFullYear()) }
    });
    this.setState(() => { var x = new Date(e.StartDate);
      return { StartDate: (x.getDate()) + "." + (x.getMonth()+1) + "." + (x.getFullYear()) }
    });
    this.setState(() => { var x = new Date(e.EndDate);
      return { EndDate: (x.getDate()) + "." + (x.getMonth()+1) + "." + (x.getFullYear()) }
    });
  }

  sendForm(e) {
    e.preventDefault();
    var formData = {
      
    };

    var data = JSON.stringify(formData);

    if (this.state.CompanyName)
    {
      // console.log('true');
      this.setState({loadingVisible: true});
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/photoreport/request/create", true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          alert("Ваш запрос успешно отправлен!");
        }else {
          console.log("a"+xhr.response);
          this.setState({loadingVisible: false}); 
          //alert("Ошибка " + xhr.status + ': ' + xhr.statusText);
        }
      }.bind(this);
      //console.log(data);
      xhr.send(data);
    }
    else { 
      // console.log('false');
      return; 
    }
  }

  componentWillMount() {
    //console.log("UrbanComponent will mount");
    // if(sessionStorage.getItem('tokenInfo')){
    //   var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];
    //   this.props.history.replace('/' + userRole);
    // }else {
    //   this.props.history.replace('/');
    // }
  }

  componentDidMount() {
    //console.log("UrbanComponent did mount");
    this.getList();
  }
  
  render() {
    // console.log(this.getList)
    return (
      <div className="content container">
        <div className="row">
          
          <div className="col-md-3 card">
            <h4 className="card-header">Активные</h4>
            <div className="card-body">
              {
                this.state.activeList.map(function(e, i){
                return(
                    <p>
                      <a href="javascript:;" onClick={this.getDetails.bind(this, e)} className="btn btn-primary">{e.PhotoAddress}</a>
                    </p>
                  )
                }.bind(this))
              }
            </div>
            
          </div>
          <div className="col-md-4 card">
            <h4 className="card-header">Паспорт</h4>
            <div className="card-body">
              <div className={this.state.showDetails ? 'row' : 'invisible'}>
                <div className="col-6"><b>Дата заявления</b>:</div> <div className="col-6">{this.state.ApplicationDate}</div>
                <div className="col-6"><b>Название компании</b>:</div> <div className="col-6">{this.state.CompanyName}</div>
                <div className="col-6"><b>Юридический адрес</b>:</div> <div className="col-6">{this.state.CompanyLegalAddress}</div>
                <div className="col-6"><b>Фактический адрес</b>:</div> <div className="col-6">{this.state.CompanyFactualAddress}</div>
                <div className="col-6"><b>Адрес рекламы</b>:</div> <div className="col-6">{this.state.PhotoAddress}</div>
                <div className="col-6"><b>Регион компании</b>:</div> <div className="col-6">{this.state.CompanyRegion}</div>
                <div className="col-6"><b>ИИН/БИН</b>:</div> <div className="col-6">{this.state.IIN}</div>
                <div className="col-6"><b>Телефон</b>:</div> <div className="col-6">{this.state.CompanyPhone}</div>
                <div className="col-6"><b>Период с</b>:</div> <div className="col-6">{this.state.StartDate}</div>
                <div className="col-6"><b>Период до</b>:</div> <div className="col-6">{this.state.EndDate}</div>
                <div className="col-6"><b>Комментарии</b>:</div> <div className="col-6">{this.state.Comments}</div>
              </div>
            </div>
            
            {/*<button className="btn-block btn-info col-md-3" id="printApz">
              Распечатать АПЗ
            </button>*/}
          </div>
          <div className="col-md-5 card">
            <h4 className="card-header">Фотографии</h4>
            <div className="card-body">
              {(() => {
                  switch (this.state.Status) {
                    case '0': return 'Вы отклонили заявку';
                    case '1': return 'Вы одобрили заявку';
                    case '2': return 'Ожидается ответ';
                    default: return '';
                  }
                })()}
            </div>
          </div>
        </div>
        
      </div>
    )
  }
}

class Loading extends Component {
  render() {
    return (
      <PreloaderIcon type={ICON_TYPE.OVAL} size={32} strokeWidth={8} strokeColor="#135ead" duration={800} />
      )
  }
}