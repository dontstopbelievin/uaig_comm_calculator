import React, { Component } from 'react';
import { Route, NavLink, Switch, Redirect} from 'react-router-dom';
import PreloaderIcon, {ICON_TYPE} from 'react-preloader-icon';

export default class PhotoReports extends React.Component {
  constructor() {
    super();
    this.state = {
      loadingVisible: false,
      showDetails: false,
      showPhotos: false,
      activeList: [],
      photosList: [],
      linkToggle: "",
      RequestId: "",
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
    this.getPhotos = this.getPhotos.bind(this);
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
        // console.log(data);
        this.setState({ activeList: data });
      }
    }.bind(this);
    xhr.send();
  }

  getDetails(e) {
    // console.log(e);
    this.setState({ showDetails: true });
    this.setState({ showPhotos: false });
    this.setState({ linkToggle: e.Id });
    this.setState({ RequestId: e.Id });
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

  getPhotos() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/photoreport/response/" + this.state.RequestId, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText)
        this.setState({ photosList: data.Photos });
        this.setState({ showPhotos: true });
        // console.log(this.state.photosList);
      }
    }.bind(this);
    xhr.send();
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
      <div className="content container files-page">
        <div className="card">
          <div className="card-header"><h4 className="mb-0">Мои фотоотчеты</h4></div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-9" style={{marginBottom: '15px'}}>
                <button type="button" className="btn btn-outline-primary" data-toggle="modal" data-target=".bd-example-modal-lg">
                  Создать заявление
                </button>&nbsp;
                <button type="button" className="btn btn-outline-info" data-toggle="modal" data-target=".documents-modal-lg">
                  Перечень необходимых документов
                </button>
      {/*<div className="content container">
        
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
                      <a onClick={this.getDetails.bind(this, e)} className="btn btn-primary">{e.PhotoAddress}</a>
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
                <div className="col-6"><b>Комментарии</b>:</div> <div className="col-6">{this.state.Comments}</div>*/}
              </div>
              <div className="col-sm-3">
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '25%'}}>Список заявлений</th>
                  <th style={{width: '35%'}}>Паспорт</th>
                  <th style={{width: '40%'}}>Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {
                      this.state.activeList.map(function(e, i){
                      return(
                          <li key={i}>
                            <a href="javascript:;" onClick={this.getDetails.bind(this, e)} className={(this.state.linkToggle == e.Id) ? 'bold btn btn-primary' : 'btn btn-primary'}>{e.PhotoAddress}</a>
                          </li>
                        )
                      }.bind(this))
                    }
                  </td>
                  <td>
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
                  </td>
                  <td>
                    <div className={this.state.showDetails ? '' : 'invisible'}>
                      <div className="alert alert-primary">
                      {(() => {
                        switch (this.state.Status) {
                          case '0': return (
                            <div>
                              <p>Управление архитектуры и градостроительства города Алматы, рассмотрев Ваше обращение от {this.state.ApplicationDate}, сообщает следующее.</p>
                              <p>Для объективного, всестороннего рассмотрения обращений по вопросам размещения наружных (визуальных) информационных объектов в городе Алматы необходимо представить Уполномоченному органу - Управление архитектуры и градостроительства города Алматы документы, материалы, имеющие значение для рассмотрения обращений <small><i>(эскиз, включающий дневное и ночное изображение информационного объекта, объекта, на который предлагается разместить информационный объект; копия правоустанавливающего документа на земельный участок или объект, на который предлагается разместить объект наружной (визуальной) рекламы либо договора о размещении объекта наружной (визуальной) рекламы, заключенный заявителем с собственником (собственниками) объекта, на который предлагается разместить объект наружной (визуальный) информационный объект, органом управления объектом кондоминиума или лицами, обладающими иными вещными правами; а также нотариально засвидетельствованная копия свидетельства на знаки обслуживания в соответствии с п.3 ст. 1024 ГК РК, либо нотариально засвидетельствованная копия договора о передачи права пользования (рекламы) на знаки обслуживания, уведомление «о погашении налоговой задолженности» (код платежа-105424) от Департамента государственных доходов г. Алматы и другие материалы, имеющие значение для рассмотрения обращений (документы подтверждающие принадлежность, а также сведения касательно месторасположения объектов наружных (визуальных) информационных объектов).</i></small></p> 
                              <p>В соответствии с п. 6 ст. 14 Закона Республики Казахстан «О порядке рассмотрения обращений физических и юридических лиц» Вы имеете право обжаловать действие (бездействие) должностных лиц либо решение, принятое по обращению.</p>
                            </div>);
                          case '1': return (
                            <div>
                              <p>Управление архитектуры и градостроительства города Алматы, рассмотрев Ваше обращение от {this.state.ApplicationDate} направляет Вам фотографии объектов наружной (визуальной) рекламы. Вместе с тем, сообщаем, что сведения в органы государственных доходов Управлением подаются без указания наименования и ИИН (БИН) налогоплательщика.</p> 
                              <p>В соответствии с п. 6 ст. 14 Закона Республики Казахстан «О порядке рассмотрения обращений физических и юридических лиц» Вы имеете право обжаловать действие (бездействие) должностных лиц либо решение, принятое по обращению.</p>
                            </div>
                            )
                          case '2': return 'Ваше заявление находится в обработке.';
                          default: return '';
                        }
                      })()}
                      </div>
                      {
                        (this.state.Status == 1)
                          ? <div><button onClick={this.getPhotos} className="btn btn-outline-primary">Показать фото</button></div>
                          : <div></div>
                      }
                      {
                        this.state.showPhotos
                          ? <ShowPhotos photosList={this.state.photosList} />
                          : <div></div>
                      }
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
            <div className="modal fade documents-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Перечень необходимых документов</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p><b>Для размещения объектов наружной (визуальной) рекламы в населенных пунктах:</b></p>
                    <p>1) заявление по форме, установленной в приложении 2 к настоящему стандарту государственной услуги;</p>
                    <p>2) нотариально засвидетельствованная копия правоустанавливающего документа на земельный участок или объект, на который предлагается разместить объект наружной (визуальной) рекламы, либо копия договора о размещении объекта наружной (визуальной) рекламы, заключенный заявителем с собственником (собственниками) объекта, на который предлагается разместить объект наружной (визуальной) рекламы, органом управления объектом кондоминиума или лицами, обладающими иными вещными правами;</p>
                    <p>3) эскиз (цветной), включающий дневное и ночное изображение объекта наружной (визуальной) рекламы, объекта на который предлагается разместить объект наружной (визуальной) рекламы, решения по инженерному функционирования объекта наружной (визуальной) рекламы;</p>
                    <p>4) документ, удостоверяющий личность уполномоченного представителя, и документ, удостоверяющий полномочия на представительство, – при обращении представителя услугополучателя (для идентификации личности);</p>
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

class ShowPhotos extends Component {
  constructor() {
    super();

    this.state = {
      photosList: []
    }    
  }

  render() {
    console.log(this.props.photosList);
    return (
      this.props.photosList.map(function(item, i){
        return (
          <img src={'data:' + item.ContentType + ';base64,' + item.File} key={i} width="447" />
          )
      })
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

// class Consideration extends React.Component {
//   constructor() {
//     super();
    
//     this.sendConsideration = this.sendConsideration.bind(this);
//   }

//   sendConsideration() {
//     console.log(this.props);
//     this.props.router.push('/photoReports/answer');
//   }

//   render() {
//     return (
//       <div>
//         <form>
//           <div className="row">
//             <div className="col-2" />
//             <div className="col-8">
//               <div className="form-group">
//                 <label htmlFor="Consideration"></label>
//                 <input type="text" className="form-control" required id="PhotoRepConsideration" name="Consideration" placeholder="Текст на рассмотрение" />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="PhotoFile">Прикрепить файл</label>
//                 <input type="file" className="form-control" required id="PhotoRepAttachedFile" name="PhotoFile" />
//               </div>
//             </div>
//             <div className="col-2" />
//           </div>
//           <div className="row">
//             <div className="col-4" />
//             <div className="col-4">
//               <button type="button" className="btn btn-outline-danger" style={{marginRight: '2px'}}>Отмена</button>
//               <button type="button" className="btn btn-outline-success" onClick={this.sendConsideration}>Отправить</button>
//             </div>
//             <div className="col-4" />
//           </div>
//         </form>
//       </div>
//     )
//   }
// }

// class Answer extends React.Component {
//   render() {
//     return (
//       <div className="container">
//         <div style={{textAlign: 'center', marginTop: '15px'}}>
//           <h5>{window.companyName}</h5>
//           <span className="help-block">г. Алматы, {window.address}</span>
//         </div><br />
//         <p style={{fontSize: '18px'}}>Управление архитектуры и градостроительства города Алматы,
//           рассмотрев Ваше обращение от <strong>{window.durFrom}</strong> № ЖТ-Ц- 856 направляет
//           Вам фотографии объектов наружной (визуальной) рекламы.
//           Вместе с тем, сообщаем, что сведения в органы государственных доходов
//           Управлением подаются без указания наименования и ИИН (БИН)
//           налогоплательщика.
//           В соответствии с п. 6 ст. 14 Закона Республики Казахстан «О порядке
//           рассмотрения обращений физических и юридических лиц» Вы имеете право
//           обжаловать действие (бездействие) должностных лиц либо решение, принятое
//           по обращению.
//         </p>
//       </div>
//     )
//   }
// }

// class PhotoReport extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       companyName: "",
//       add: "",
//       durFrom: "",
//       durTo: ""
//     }
    
//     this.updateCompanyName = this.updateCompanyName.bind(this);
//     this.updateAddress = this.updateAddress.bind(this);
//     this.updateDurFrom = this.updateDurFrom.bind(this);
//     this.updateDurTo = this.updateDurTo.bind(this);
//   }

//   updateCompanyName(compName) {
//     this.setState({companyName: compName})
//   }

//   updateAddress(address) {
//     this.setState({add: address})
//   }

//   updateDurFrom(dFrom) {
//     this.setState({durFrom: dFrom})
//   }

//   updateDurTo(dTo) {
//     this.setState({durTo: dTo})
//   }

//   componentWillMount() {
//     //console.log("PhotoReport will mount");
//   }

//   componentDidMount() {
//     //console.log("PhotoReport did mount");
//   }

//   componentWillUnmount() {
//     //console.log("PhotoReport will unmount");
//   }

//   render() {
//     //console.log("rendering the PhotoReport");
//     window.companyName = this.state.companyName;
//     window.address = this.state.add;
//     window.durFrom = this.state.durFrom;
//     window.durTo = this.state.durTo;
//     window.changeComName = this.updateCompanyName;
//     window.changeAddress = this.updateAddress;
//     window.changeDurFrom = this.updateDurFrom;
//     window.changeDurTo = this.updateDurTo;
//     return (
//       <div className="container">
//         <ul className="header">
//           <li><NavLink exact activeClassName="active" activeStyle={{color:"black"}} to="/photoReports/form" replace>Заявление</NavLink></li>
//           <li><NavLink activeClassName="active" activeStyle={{color:"black"}} to="/photoReports/consideration" replace>Рассмотрение</NavLink></li>
//           <li><NavLink activeClassName="active" activeStyle={{color:"black"}} to="/photoReports/answer" replace>Ответ</NavLink></li>
//         </ul>
//         {/*<Switch>
//           <Route path="/photoreports/form" component={PhotoReportForm} />
//           <Route path="/photoreports/consideration" component={Consideration} />
//           <Route path="/photoreports/answer" component={Answer} />
//           <Redirect from="/photoReports" to="/photoReports/form" />
//         </Switch>*/}
//       </div>
//     )
//   }
// }