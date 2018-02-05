import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
//import { NavLink } from 'react-router-dom';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';

export default class ProviderHeat extends React.Component {
  render() {
    return (
      <div className="content container urban-apz-page">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/providerheat/status/:status" component={AllApzs} />
              <Route path="/providerheat/:id" component={ShowApz} />
              <Redirect from="/providerheat" to="/providerheat/status/active" />
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

    this.state = {
      apzs: []
    };

  }

  componentDidMount() {
    this.getApzs();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.status !== nextProps.match.params.status) {
       this.getApzs(nextProps.match.params.status);
   }
  }

  getApzs(status = null) {
    if (!status) {
      status = this.props.match.params.status;
    }

    var token = sessionStorage.getItem('tokenInfo');
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Token is expired, please login again!");
        this.props.history.replace("/login");
        return false;
    }

    var providerName = roles[1];
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/provider/" + providerName, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        
        switch (status) {
          case 'active':
            var apzs = data.filter(function(obj) { return obj.ApzHeatStatus === 2 && obj.Status === 3; });
            break;

          case 'accepted':
            apzs = data.filter(function(obj) { return obj.ApzHeatStatus === 1; });
            break;

          case 'declined':
            apzs = data.filter(function(obj) { return obj.ApzHeatStatus === 0; });
            break;

          default:
            apzs = data;
            break;
        }
        
        this.setState({apzs: apzs});
      }
    }.bind(this);
    xhr.send();
  }

  render() {
    return (
      <div>
        <ul className="nav nav-tabs mb-2 pull-right">
          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerheat/status/active" replace>Активные</NavLink></li>
          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerheat/status/accepted" replace>Принятые</NavLink></li>
          <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerheat/status/declined" replace>Отказанные</NavLink></li>
        </ul>

        <table className="table">
          <thead>
            <tr>
              <th style={{width: '85%'}}>Название</th>
              <th style={{width: '15%'}}>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.apzs.map(function(apz, index) {
              return(
                <tr key={index}>
                  <td>{apz.ProjectName}</td>
                  <td>
                    {apz.ApzHeatStatus === 0 &&
                      <span className="text-danger">Отказано</span>
                    }

                    {apz.ApzHeatStatus === 1 &&
                      <span className="text-success">Принято</span>
                    }

                    {apz.ApzHeatStatus === 2 && apz.Status === 3 &&
                      <span className="text-info">В процессе</span>
                    }
                  </td>
                  <td>
                    <Link className="btn btn-outline-info" to={'/providerheat/' + apz.Id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                  </td>
                </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>  
    )
  }
}

class ShowApz extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apz: [],
      showMap: false,
      showButtons: false,
      showTechCon: false,
      file: false,
      heatResource: "",
      heatTransPressure: "",
      heatLoadContractNum: "",
      heatMainInContract: "",
      heatVenInContract: "",
      heatWaterInContract: "",
      connectionPoint: "",
      addition: "",
      docNumber: "",
      description: '',
      responseId: 0,
      response: false,
      responseFileExt: null,
      showMapText: 'Показать карту',
      accept: true,
      callSaveFromSend: false,
      heatStatus: 2
    };

    this.onHeatResourceChange = this.onHeatResourceChange.bind(this);
    this.onHeatTransPressureChange = this.onHeatTransPressureChange.bind(this);
    this.onHeatLoadContractNumChange = this.onHeatLoadContractNumChange.bind(this);
    this.onHeatMainInContractChange = this.onHeatMainInContractChange.bind(this);
    this.onHeatVenInContractChange = this.onHeatVenInContractChange.bind(this);
    this.onHeatWaterInContractChange = this.onHeatWaterInContractChange.bind(this);
    this.onConnectionPointChange = this.onConnectionPointChange.bind(this);
    this.onAdditionChange = this.onAdditionChange.bind(this);
    this.onDocNumberChange = this.onDocNumberChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.saveResponseForm = this.saveResponseForm.bind(this);
    this.sendHeatResponse = this.sendHeatResponse.bind(this);
  }

  onHeatResourceChange(e) {
    this.setState({ heatResource: e.target.value });
  }

  onHeatTransPressureChange(e) {
    this.setState({ heatTransPressure: e.target.value });
  }

  onHeatLoadContractNumChange(e) {
    this.setState({ heatLoadContractNum: e.target.value });
  }

  onHeatMainInContractChange(e) {
    this.setState({ heatMainInContract: e.target.value });
  }

  onHeatVenInContractChange(e) {
    this.setState({ heatVenInContract: e.target.value });
  }

  onHeatWaterInContractChange(e) {
    this.setState({ heatWaterInContract: e.target.value });
  }

  onConnectionPointChange(e) {
    this.setState({ connectionPoint: e.target.value });
  }

  onAdditionChange(e) {
    this.setState({ addition: e.target.value });
  }

  onDocNumberChange(e) {
    this.setState({ docNumber: e.target.value });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  // this function to show one of the forms Accept/Decline
  toggleAcceptDecline(value) {
    this.setState({accept: value});
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

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
        this.setState({description: data.HeatResponseText});
        this.setState({connectionPoint: data.HeatConnectionPoint});
        this.setState({heatResource: data.HeatResource});
        this.setState({heatTransPressure: data.HeatTransPressure});
        this.setState({heatLoadContractNum: data.HeatLoadContractNum});
        this.setState({heatMainInContract: data.HeatMainInContract});
        this.setState({heatVenInContract: data.HeatVenInContract});
        this.setState({heatWaterInContract: data.HeatWaterInContract});
        this.setState({addition: data.HeatAddition});
        this.setState({docNumber: data.HeatDocNumber});
        this.setState({responseId: data.HeatResponseId});
        this.setState({response: data.HeatResponse});
        if(data.HeatResponseId !== -1){
          this.setState({accept: data.HeatResponse});
        }
        this.setState({responseFileExt: data.HeatResponseFileExt});
        this.setState({heatStatus: data.ApzHeatStatus});

        if (data.Status === 3 && data.ApzHeatStatus === 2) { 
          this.setState({showButtons: true}); 
        }
        if(data.ApzHeatStatus === 1){
          this.setState({showTechCon: true});
        }
      }
    }.bind(this)
    xhr.send();
  }

  // Скачивание файла (ТУ/МО)
  downloadResponseFile(event) {
    var token = sessionStorage.getItem('tokenInfo');
    var id =  event.target.getAttribute("data-id");
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/download/provider/heat/" + id, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function() {
      if (xhr.status === 200) {
        window.location = window.url + "api/apz/download/provider/heat/" + id
      } else {
        alert('Не удалось скачать файл');
      }
    }
    xhr.send();
  }

  downloadFile(event) {
    var token = sessionStorage.getItem('tokenInfo');
    var apzId = this.props.match.params.id;
    var url =  event.target.getAttribute("data-url");

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/file/download/' + url + '/' + apzId, true);
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
              window.URL.revokeObjectURL(url);
            };

          }());

          saveByteArray([base64ToArrayBuffer(data.byteFile)], data.fileName + data.fileExt);
        } else {
          alert('Не удалось скачать файл');
        }
      }
    xhr.send();
  }

  // this function is to save the respones form when any change is made
  saveResponseForm(apzId, status, comment){
    var token = sessionStorage.getItem('tokenInfo');
    var file = this.state.file;

    var formData = new FormData();
    formData.append('file', file);
    formData.append('Response', status);
    formData.append('Message', comment);
    if(status === false){
      formData.append('HeatResource', "");
      formData.append('HeatTransPressure', "");
      formData.append('HeatLoadContractNum', "");
      formData.append('HeatMainInContract', "");
      formData.append('HeatVenInContract', "");
      formData.append('HeatWaterInContract', "");
      formData.append('ConnectionPoint', "");
      formData.append('Addition', "");
    }
    else{
      formData.append('HeatResource', this.state.heatResource);
      formData.append('HeatTransPressure', this.state.heatTransPressure);
      formData.append('HeatLoadContractNum', this.state.heatLoadContractNum);
      formData.append('HeatMainInContract', this.state.heatMainInContract);
      formData.append('HeatVenInContract', this.state.heatVenInContract);
      formData.append('HeatWaterInContract', this.state.heatWaterInContract);
      formData.append('ConnectionPoint', this.state.connectionPoint);
      formData.append('Addition', this.state.addition);
    }
    formData.append('DocNumber', this.state.docNumber);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/save/provider/heat/" + apzId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        this.setState({responseId: data.ResponseId});
        this.setState({response: data.Response});
        this.setState({accept: data.Response});
        this.setState({description: data.ResponseText});
        this.setState({responseFileExt: data.HeatResponseFileExt});
        this.setState({connectionPoint: data.ConnectionPoint});
        this.setState({heatResource: data.HeatResource});
        this.setState({heatTransPressure: data.HeatTransPressure});
        this.setState({heatLoadContractNum: data.HeatLoadContractNum});
        this.setState({heatMainInContract: data.HeatMainInContract});
        this.setState({heatVenInContract: data.HeatVenInContract});
        this.setState({heatWaterInContract: data.HeatWaterInContract});
        this.setState({addition: data.Addition});
        if(this.state.callSaveFromSend){
          this.setState({callSaveFromSend: false});
          this.sendHeatResponse(apzId, status, comment);
        }
        else{
          alert("Ответ сохранен!");
        }
      }
      else if(xhr.status === 401){
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData);
  }

  // this function is to send the final response
  sendHeatResponse(apzId, status, comment) {
    if(this.state.responseId < 0){
      this.setState({callSaveFromSend: true});
      this.saveResponseForm(apzId, status, comment);
    }
    else{
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/update/provider/heat/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);

          if(data.ApzHeatStatus === 1) {
            alert("Заявление принято!");
            this.setState({ showButtons: false });
            this.setState({ heatStatus: 1 });
            this.setState({showTechCon: true});
          } 
          else if(data.ApzHeatStatus === 0) {
            alert("Заявление отклонено!");
            this.setState({ showButtons: false });
            this.setState({ heatStatus: 0 })
          }
        }
        else if(xhr.status === 401){
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.send();
    } 
  }

  // print technical condition
  printTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/print/tc/heat/" + apzId, true);
      xhr.responseType = "blob";
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
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
            link.download = "ТУ-Тепло-" + project + formated_date + ".pdf";

            //append the link to the document body
            document.body.appendChild(link);
            link.click();
          }
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
  
  render() {
    var apz = this.state.apz;

    return (
      <div className="row">
        <div className="col-sm-4">
          <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>
          
          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <td style={{width: '40%'}}><b>Заявитель</b></td>
                <td>{apz.Applicant}</td>
              </tr>
              <tr>
                <td><b>Адрес</b></td>
                <td>{apz.Address}</td>
              </tr>
              <tr>
                <td><b>Телефон</b></td>
                <td>{apz.Phone}</td>
              </tr>
              <tr>
                <td><b>Заказчик</b></td>
                <td>{apz.Customer}</td>
              </tr>
              <tr>
                <td><b>Разработчик</b></td>
                <td>{apz.Designer}</td>
              </tr>
              <tr>
                <td><b>Название проекта</b></td>
                <td>{apz.ProjectName}</td>
              </tr>
              <tr>
                <td><b>Адрес проекта</b></td>
                <td>
                  {apz.ProjectAddress}

                  {apz.ProjectAddressCoordinates !== "" &&
                    <a className="ml-2 pointer text-info" onClick={this.toggleMap.bind(this, true)}>Показать на карте</a>
                  }
                </td>
              </tr>
              <tr>
                <td><b>Дата заявления</b></td>
                <td>{apz.ApzDate && this.toDate(apz.ApzDate)}</td>
              </tr>
              
              {apz.PersonalIdExist &&
                <tr>
                  <td><b>Уд. лич./ Реквизиты</b></td>
                  <td><a className="text-info pointer" data-url={'citizenfile/personalId/' + apz.CitizenFileId} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                </tr>
              }

              {apz.ConfirmedTaskExist &&
                <tr>
                  <td><b>Утвержденное задание</b></td>
                  <td><a className="text-info pointer" data-url={'citizenfile/confirmedTask/' + apz.CitizenFileId} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                </tr>
              }

              {apz.TitleDocumentExist &&
                <tr>
                  <td><b>Правоустанавл. документ</b></td>
                  <td><a className="text-info pointer" data-url={'citizenfile/titleDocument/' + apz.CitizenFileId} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className="col-sm-4">
          <h5 className="block-title-2 mt-3 mb-3">Детали</h5>

          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <td style={{width: '40%'}}>Общая нагрузка (Гкал/ч)</td> 
                <td>{apz.HeatGeneral}</td>
              </tr>
              <tr>
                <td>Отопление (Гкал/ч)</td>
                <td>{apz.HeatMain}</td>
              </tr>
              <tr>
                <td>Вентиляция (Гкал/ч)</td>
                <td>{apz.HeatVentilation}</td>
              </tr>
              <tr>
                <td>Энергосб. мероприятие</td>
                <td>{apz.HeatSaving}</td>
              </tr>
              <tr>
                <td>Горячее водоснаб.(Гкал/ч)</td>
                <td>{apz.HeatWater}</td>
              </tr>
              <tr>
                <td>Технолог. нужды(пар) (Т/ч)</td>
                <td>{apz.HeatTech}</td>
              </tr>
              <tr>
                <td>Разделить нагрузку</td>
                <td>{apz.HeatDistribution}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-sm-4">
          <div className="row" style={{margin: '16px 0'}}>
            <div className="col-sm-6">
              <h5 className="block-title-2 mt-3 mb-3" style={{display: 'inline'}}>Ответ</h5> 
            </div>
            <div className="col-sm-6">
              {this.state.showButtons &&
                <div className="btn-group" style={{float: 'right', margin: '0'}}>
                  <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.toggleAcceptDecline.bind(this, true)}>
                    <i className="glyphicon glyphicon-ok"></i>
                  </button>
                  <button className="btn btn-raised btn-danger" onClick={this.toggleAcceptDecline.bind(this, false)}>
                    <i className="glyphicon glyphicon-remove"></i>
                  </button>
                </div>
              }
            </div>
          </div>

          {this.state.accept && this.state.heatStatus === 2 &&
            <form style={{border: 'solid 3px #46A149', padding: '5px'}}>
              <div className="form-group">
                <label>Теплоснабжение осуществляется от источников</label>
                <input type="text" className="form-control" placeholder="" value={this.state.heatResource} onChange={this.onHeatResourceChange} />
              </div>
              <div className="form-group">
                <label>Точка подключения</label>
                <input type="text" className="form-control" placeholder="" value={this.state.connectionPoint} onChange={this.onConnectionPointChange} />
              </div>
              <div className="form-group">
                <label>Давление теплоносителя в тепловой камере {this.state.connectionPoint}</label>
                <input type="text" className="form-control" placeholder="" value={this.state.heatTransPressure} onChange={this.onHeatTransPressureChange} />
              </div>
              <div className="form-group">
                <label>Тепловые нагрузки по договору 
                  <input type="text" className="form-control" placeholder="Введите номер договора" value={this.state.heatLoadContractNum} onChange={this.onHeatLoadContractNumChange} />
                </label>
                <label>Отопление (Гкал/ч)</label>
                <input type="number" step="any" className="form-control" placeholder="" value={this.state.heatMainInContract} onChange={this.onHeatMainInContractChange} />
                <label>Вентиляция (Гкал/ч)</label>
                <input type="number" step="any" className="form-control" placeholder="" value={this.state.heatVenInContract} onChange={this.onHeatVenInContractChange} />
                <label>Горячее водоснабжение (Гкал/ч)</label>
                <input type="number" step="any" className="form-control" placeholder="" value={this.state.heatWaterInContract} onChange={this.onHeatWaterInContractChange} />
              </div>
              <div className="form-group">
                <label>Дополнительное</label>
                <textarea rows="5" className="form-control" value={this.state.addition} onChange={this.onAdditionChange} placeholder="Описание"></textarea>
              </div>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              {(this.state.response === true && this.state.responseFileExt) &&
                <div className="form-group">
                  <label style={{display: 'block'}}>Прикрепленный файл</label>
                  <a className="pointer text-info" title="Скачать" data-id={this.state.responseId} onClick={this.downloadResponseFile.bind(this)}>
                    Скачать 
                  </a>
                </div>
              }
              <div className="form-group">
                <label htmlFor="upload_file">Прикрепить файл</label>
                <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.Id, true, "")}>
                  Сохранить
                </button>
                <button type="button" className="btn btn-primary" onClick={this.sendHeatResponse.bind(this, apz.Id, true, "")}>
                  Отправить
                </button>
              </div>
            </form>
          }

          {this.state.accept && this.state.heatStatus === 1 &&
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td style={{width: '40%'}}>Источник</td> 
                  <td>{this.state.heatResource}</td>
                </tr>
                <tr>
                  <td>Точка подключения</td> 
                  <td>{this.state.connectionPoint}</td>
                </tr> 
                <tr>
                  <td>Давление теплоносителя в тепловой камере {this.state.connectionPoint}</td>
                  <td>{this.state.heatTransPressure}</td>
                </tr>
                <tr>
                  <td>Тепловые нагрузки по договору</td>
                  <td>{this.state.heatLoadContractNum}</td>
                </tr>
                <tr>
                  <td>Отопление (Гкал/ч)</td>
                  <td>{this.state.heatMainInContract}</td>
                </tr>
                <tr>
                  <td>Вентиляция (Гкал/ч)</td>
                  <td>{this.state.heatVenInContract}</td>
                </tr>
                <tr>
                  <td>Горячее водоснабжение (Гкал/ч)</td>
                  <td>{this.state.heatWaterInContract}</td>
                </tr>
                <tr>
                  <td>Дополнительное</td>
                  <td>{this.state.addition}</td>
                </tr>
                <tr>
                  <td>Номер документа</td>
                  <td>{this.state.docNumber}</td>
                </tr>
                <tr>
                  <td>Прикрепленный файл</td>
                  <td>
                    <a className="pointer text-info" title="Скачать" data-id={this.state.responseId} onClick={this.downloadResponseFile.bind(this)}>
                      Скачать 
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          }

          {!this.state.accept && this.state.heatStatus === 2 &&
            <form style={{border: 'solid 3px #F55549', padding: '5px'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
               <label>Причина отклонения</label>
                <textarea rows="5" className="form-control" value={this.state.description} onChange={this.onDescriptionChange} placeholder="Описание"></textarea>
              </div>
              {(this.state.response === false && this.state.responseFileExt) &&
                <div className="form-group">
                  <label style={{display: 'block'}}>Прикрепленный файл</label>
                  <a className="pointer text-info" title="Скачать" data-id={this.state.responseId} onClick={this.downloadResponseFile.bind(this)}>
                    Скачать 
                  </a>
                </div>
              }
              <div className="form-group">
                <label htmlFor="upload_file">Прикрепить файл</label>
                <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.Id, false, this.state.description)}>
                  Сохранить
                </button>
                <button type="button" className="btn btn-primary" onClick={this.sendHeatResponse.bind(this, apz.Id, false, this.state.description)}>
                  Отправить
                </button>
              </div>
            </form>
          }

          {!this.state.accept && this.state.heatStatus === 0 &&
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
                <tr>
                  <td>Прикрепленный файл</td>
                  <td>
                    <a className="pointer text-info" title="Скачать" data-id={this.state.responseId} onClick={this.downloadResponseFile.bind(this)}>
                      Скачать 
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          }

          <div className={this.state.showTechCon ? '' : 'invisible'}>
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td><b>Сформированный ТУ</b></td>  
                  <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.Id, apz.ProjectName)}>Скачать</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-sm-12">
          {this.state.showMap && <ShowMap coordinates={apz.ProjectAddressCoordinates} />} 

          <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>
        </div>

        <div className="col-sm-12">
          <hr />
          <Link className="btn btn-outline-secondary pull-right" to={'/providerheat/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
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
              'esri/layers/FeatureLayer',
              'esri/layers/TileLayer',
              'esri/widgets/Search',
              'esri/WebMap',
              'esri/geometry/support/webMercatorUtils',
              'dojo/dom',
              'esri/Graphic',
              'dojo/domReady!'
            ]}    
            
            onReady={({loadedModules: [MapView, LayerList, WebScene, FeatureLayer, TileLayer, Search, WebMap, webMercatorUtils, dom, Graphic], containerNode}) => {
              var map = new WebMap({
                portalItem: {
                  id: "a3b89fe64c0d4b06b0e55afad63a7ab8"
                }
              });

              /*
              var heatLineSafetyZone = new FeatureLayer({
                url: 'https://gis.uaig.kz/server/rest/services/Hosted/%D0%9E%D1%85%D1%80%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B7%D0%BE%D0%BD%D0%B0_%D1%82%D0%B5%D0%BF%D0%BB%D0%BE%D1%82%D1%80%D0%B0%D1%81%D1%81%D1%8B/FeatureServer',
                outFields: ["*"],
                title: "Охранная зона теплотрассы"
              });
              map.add(heatLineSafetyZone);

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
                    url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                    popupTemplate: { // autocasts as new PopupTemplate()
                      title: "Кадастровый номер: {cadastral_number} </br> Назначение: {function} <br/> Вид собственности: {ownership}"
                    }
                  }),
                  searchFields: ["cadastral_number"],
                  displayField: "cadastral_number",
                  exactMatch: false,
                  outFields: ["cadastral_number", "function", "ownership"],
                  name: "Зарегистрированные государственные акты",
                  placeholder: "Кадастровый поиск"
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