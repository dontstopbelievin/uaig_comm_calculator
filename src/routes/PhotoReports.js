import React, { Component } from 'react';
import { Route, NavLink, Switch, Redirect} from 'react-router-dom';
import PreloaderIcon, {ICON_TYPE} from 'react-preloader-icon';

export default class PhotoReports extends React.Component {
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
    xhr.open("get", window.url + "api/photoreport/request/personal", true);
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
      CompanyName: this.state.CompanyName,
      CompanyLegalAddress: this.state.CompanyLegalAddress,
      CompanyFactualAddress: this.state.CompanyFactualAddress,
      PhotoAddress: this.state.PhotoAddress,
      CompanyRegion: this.state.CompanyRegion,
      IIN: this.state.IIN,
      CompanyPhone: this.state.CompanyPhone,
      StartDate: this.state.StartDate,
      EndDate: this.state.EndDate,
      Comments: this.state.Comments
    };

    var data = JSON.stringify(formData);

    if (this.state.CompanyName && 
      this.state.CompanyLegalAddress && 
      this.state.CompanyFactualAddress && 
      this.state.PhotoAddress &&
      this.state.CompanyRegion &&
      this.state.IIN &&
      this.state.CompanyPhone &&
      this.state.StartDate &&
      this.state.EndDate &&
      this.state.Comments) 
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
          <div className="col-md-12">
            <button type="button" className="btn btn-outline-primary" data-toggle="modal" data-target=".bd-example-modal-lg">
              Создать заявление
            </button>
          </div>
          <div className="col-md-3 card">
            <h4 className="card-header">Отвечено</h4>
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
              <div className={this.state.showDetails ? 'row' : 'invisible'}>
                {(() => {
                  switch (this.state.Status) {
                    case '0': return 'Управление архитектуры и градостроительства города Алматы, рассмотрев Ваше обращение от '+this.state.ApplicationDate+' запрашивает дополнительные данные для ориентировки.';
                    case '1': return 'Управление архитектуры и градостроительства города Алматы, рассмотрев Ваше обращение от '+this.state.ApplicationDate+' направляет Вам фотографии объектов наружной (визуальной) рекламы. Вместе с тем, сообщаем, что сведения в органы государственных доходов Управлением подаются без указания наименования и ИИН (БИН) налогоплательщика. В соответствии с п. 6 ст. 14 Закона Республики Казахстан «О порядке рассмотрения обращений физических и юридических лиц» Вы имеете право обжаловать действие (бездействие) должностных лиц либо решение, принятое по обращению.';
                    case '2': return 'Ваша заявка находится в обработке';
                    default: return '';
                  }
                })()}

              </div>
            </div>
            
          </div>
        </div>

        <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div id="loading">
              {
                this.state.loadingVisible
                  ? <Loading />
                  : <div></div>
              }
            </div>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Заявление для получения фотоотчета</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={this.sendForm.bind(this)}>
                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label>От ТОО/ИП
                          <input type="text" className="form-control" required placeholder="Компания" value={this.state.CompanyName} onChange={(e) => this.setState({CompanyName: e.target.value})} />
                        </label>
                      </div>
                      <div className="form-group">
                        <label>Юридический адрес
                          <input type="text" className="form-control" required placeholder="Юридический адрес" value={this.state.CompanyLegalAddress} onChange={(e) => this.setState({CompanyLegalAddress: e.target.value})} />
                        </label>
                      </div>
                      <div className="form-group">
                        <label>Фактический адрес
                          <input type="text" className="form-control" required placeholder="Фактический адрес" value={this.state.CompanyFactualAddress} onChange={(e) => this.setState({CompanyFactualAddress: e.target.value})} />
                        </label>
                      </div>
                      <div className="form-group">
                        <label>Адрес рекламы
                          <input type="text" className="form-control" required placeholder="Фактический адрес" value={this.state.PhotoAddress} onChange={(e) => this.setState({PhotoAddress: e.target.value})} />
                        </label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="form-group">
                        <label>Регион
                          <input type="text" className="form-control" required placeholder="Регион компании" value={this.state.CompanyRegion} onChange={(e) => this.setState({CompanyRegion: e.target.value})} />
                        </label>
                      </div>
                      <div className="form-group">
                        <label>ИИН/БИН
                          <input type="number" className="form-control" required placeholder="ИИН/БИН" value={this.state.IIN} onChange={(e) => this.setState({IIN: e.target.value})} />
                        </label>
                      </div>
                      <div className="form-group">
                        <label>Телефон
                          <input type="text" className="form-control" required placeholder="Телефон" value={this.state.CompanyPhone} onChange={(e) => this.setState({CompanyPhone: e.target.value})} />
                        </label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="form-group">
                        <label>Период с
                          <input type="date" className="form-control" required placeholder="Период" value={this.state.StartDate} onChange={(e) => this.setState({StartDate: e.target.value})} />
                        </label>
                      </div>
                      <div className="form-group">
                        <label>Период до
                          <input type="date" className="form-control" required placeholder="Период" value={this.state.EndDate} onChange={(e) => this.setState({EndDate: e.target.value})} />
                        </label>
                      </div>
                      <div className="form-group">
                        <label>Комментарий
                          <textarea className="form-control" required placeholder="Комментарий" rows="2" value={this.state.Comments} onChange={(e) => this.setState({Comments: e.target.value})}></textarea>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <input type="submit" className="btn btn-primary" value="Отправить заявку" />
                    <button type="button" className="btn btn-secondary" style={{marginRight: '2px'}}>Отмена</button>
                  </div>
                </form>
              </div>
              
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

class Consideration extends React.Component {
  constructor() {
    super();
    
    this.sendConsideration = this.sendConsideration.bind(this);
  }

  sendConsideration() {
    console.log(this.props);
    this.props.router.push('/photoReports/answer');
  }

  render() {
    return (
      <div>
        <form>
          <div className="row">
            <div className="col-2" />
            <div className="col-8">
              <div className="form-group">
                <label htmlFor="Consideration"></label>
                <input type="text" className="form-control" required id="PhotoRepConsideration" name="Consideration" placeholder="Текст на рассмотрение" />
              </div>
              <div className="form-group">
                <label htmlFor="PhotoFile">Прикрепить файл</label>
                <input type="file" className="form-control" required id="PhotoRepAttachedFile" name="PhotoFile" />
              </div>
            </div>
            <div className="col-2" />
          </div>
          <div className="row">
            <div className="col-4" />
            <div className="col-4">
              <button type="button" className="btn btn-outline-danger" style={{marginRight: '2px'}}>Отмена</button>
              <button type="button" className="btn btn-outline-success" onClick={this.sendConsideration}>Отправить</button>
            </div>
            <div className="col-4" />
          </div>
        </form>
      </div>
    )
  }
}

class Answer extends React.Component {
  render() {
    return (
      <div className="container">
        <div style={{textAlign: 'center', marginTop: '15px'}}>
          <h5>{window.companyName}</h5>
          <span className="help-block">г. Алматы, {window.address}</span>
        </div><br />
        <p style={{fontSize: '18px'}}>Управление архитектуры и градостроительства города Алматы,
          рассмотрев Ваше обращение от <strong>{window.durFrom}</strong> № ЖТ-Ц- 856 направляет
          Вам фотографии объектов наружной (визуальной) рекламы.
          Вместе с тем, сообщаем, что сведения в органы государственных доходов
          Управлением подаются без указания наименования и ИИН (БИН)
          налогоплательщика.
          В соответствии с п. 6 ст. 14 Закона Республики Казахстан «О порядке
          рассмотрения обращений физических и юридических лиц» Вы имеете право
          обжаловать действие (бездействие) должностных лиц либо решение, принятое
          по обращению.
        </p>
      </div>
    )
  }
}

class PhotoReport extends React.Component {
  constructor() {
    super();
    this.state = {
      companyName: "",
      add: "",
      durFrom: "",
      durTo: ""
    }
    
    this.updateCompanyName = this.updateCompanyName.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.updateDurFrom = this.updateDurFrom.bind(this);
    this.updateDurTo = this.updateDurTo.bind(this);
  }

  updateCompanyName(compName) {
    this.setState({companyName: compName})
  }

  updateAddress(address) {
    this.setState({add: address})
  }

  updateDurFrom(dFrom) {
    this.setState({durFrom: dFrom})
  }

  updateDurTo(dTo) {
    this.setState({durTo: dTo})
  }

  componentWillMount() {
    //console.log("PhotoReport will mount");
  }

  componentDidMount() {
    //console.log("PhotoReport did mount");
  }

  componentWillUnmount() {
    //console.log("PhotoReport will unmount");
  }

  render() {
    //console.log("rendering the PhotoReport");
    window.companyName = this.state.companyName;
    window.address = this.state.add;
    window.durFrom = this.state.durFrom;
    window.durTo = this.state.durTo;
    window.changeComName = this.updateCompanyName;
    window.changeAddress = this.updateAddress;
    window.changeDurFrom = this.updateDurFrom;
    window.changeDurTo = this.updateDurTo;
    return (
      <div className="container">
        <ul className="header">
          <li><NavLink exact activeClassName="active" activeStyle={{color:"black"}} to="/photoReports/form" replace>Заявление</NavLink></li>
          <li><NavLink activeClassName="active" activeStyle={{color:"black"}} to="/photoReports/consideration" replace>Рассмотрение</NavLink></li>
          <li><NavLink activeClassName="active" activeStyle={{color:"black"}} to="/photoReports/answer" replace>Ответ</NavLink></li>
        </ul>
        {/*<Switch>
          <Route path="/photoreports/form" component={PhotoReportForm} />
          <Route path="/photoreports/consideration" component={Consideration} />
          <Route path="/photoreports/answer" component={Answer} />
          <Redirect from="/photoReports" to="/photoReports/form" />
        </Switch>*/}
      </div>
    )
  }
}