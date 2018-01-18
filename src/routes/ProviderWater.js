import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
//import { NavLink } from 'react-router-dom';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';

export default class ProviderWater extends React.Component {
  render() {
    return (
      <div className="content container urban-apz-page">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/providerwater/status/:status" component={AllApzs} />
              <Route path="/providerwater/:id" component={ShowApz} />
              <Redirect from="/providerwater" to="/providerwater/status/active" />
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
            var apzs = data.filter(function(obj) { return obj.ApzWaterStatus === 2 && obj.Status === 3; });
            break;

          case 'accepted':
            apzs = data.filter(function(obj) { return obj.ApzWaterStatus === 1; });
            break;

          case 'declined':
            apzs = data.filter(function(obj) { return obj.ApzWaterStatus === 0; });
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
          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerwater/status/active" replace>Активные</NavLink></li>
          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerwater/status/accepted" replace>Принятые</NavLink></li>
          <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerwater/status/declined" replace>Отказанные</NavLink></li>
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
                    {apz.ApzWaterStatus === 0 &&
                      <span className="text-danger">Отказано</span>
                    }

                    {apz.ApzWaterStatus === 1 &&
                      <span className="text-success">Принято</span>
                    }

                    {apz.ApzWaterStatus === 2 && apz.Status === 3 &&
                      <span className="text-info">В процессе</span>
                    }
                  </td>
                  <td>
                    <Link className="btn btn-outline-info" to={'/providerwater/' + apz.Id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
      genWaterReq: "",
      drinkingWater: "",
      prodWater: "",
      fireFightingWaterIn: "",
      fireFightingWaterOut: "",
      connectionPoint: "",
      recomendation: "",
      docNumber: "",
      description: '',
      showMapText: 'Показать карту'
    };

    this.toggleMap = this.toggleMap.bind(this);
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

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Token is expired, please login again!");
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
        this.setState({apz: data});
        this.setState({showButtons: false});
        this.setState({showTechCon: false});

        if (data.Status === 3 && data.ApzWaterStatus === 2) { 
          this.setState({showButtons: true}); 
        }
        if(data.ApzWaterStatus === 1){
          this.setState({showTechCon: true});
        }
      }
    }.bind(this)
    xhr.send();
  }

  downloadFile(event) {
    var buffer = event.target.getAttribute("data-file")
    var name = event.target.getAttribute("data-name");
    var ext = event.target.getAttribute("data-ext");

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

  acceptDeclineApzForm(apzId, status, comment) {
    var token = sessionStorage.getItem('tokenInfo');
    var file = this.state.file;

    var formData = new FormData();
    formData.append('file', file);
    formData.append('Response', status);
    formData.append('Message', comment);
    formData.append('GenWaterReq', this.state.genWaterReq);
    formData.append('DrinkingWater', this.state.drinkingWater);
    formData.append('ProdWater', this.state.prodWater);
    formData.append('FireFightingWaterIn', this.state.fireFightingWaterIn);
    formData.append('FireFightingWaterOut', this.state.fireFightingWaterOut);
    formData.append('ConnectionPoint', this.state.connectionPoint);
    formData.append('Recomendation', this.state.recomendation);
    formData.append('DocNumber', this.state.docNumber);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/status/" + apzId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        if(data.ApzWaterStatus === 1) {
          alert("Заявление принято!");
          this.setState({ showButtons: false });
        } 
        else if(data.ApzWaterStatus === 0) {
          alert("Заявление отклонено!");
          this.setState({ showButtons: false });
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

  // print technical condition
  printTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/print/tc/water/" + apzId, true);
      xhr.responseType = "blob";
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        console.log(xhr);
        console.log(xhr.status);
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
            link.download = "ТУ-Вода-" + project + formated_date + ".pdf";

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

  toggleMap(e) {
    this.setState({
      showMap: !this.state.showMap
    })

    if (this.state.showMap) {
      this.setState({
        showMapText: 'Показать карту'
      })
    } else {
      this.setState({
        showMapText: 'Скрыть карту'
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
        <div className="col-sm-6">
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
                <td>{apz.ProjectAddress}</td>
              </tr>
              <tr>
                <td><b>Дата заявления</b></td>
                <td>{apz.ApzDate && this.toDate(apz.ApzDate)}</td>
              </tr>
              
              {apz.PersonalIdFile != null &&
                <tr>
                  <td><b>Уд. лич./ Реквизиты</b></td>
                  <td><a className="text-info pointer" data-file={apz.PersonalIdFile} data-name="Уд. лич./Реквизиты" data-ext={apz.PersonalIdFileExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                </tr>
              }

              {apz.ConfirmedTaskFile != null &&
                <tr>
                  <td><b>Утвержденное задание</b></td>
                  <td><a className="text-info pointer" data-file={apz.ConfirmedTaskFile} data-name="Утвержденное задание" data-ext={apz.ConfirmedTaskFileExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                </tr>
              }

              {apz.TitleDocumentFile != null &&
                <tr>
                  <td><b>Правоустанавл. документ</b></td>
                  <td><a className="text-info pointer" data-file={apz.TitleDocumentFile} data-name="Правоустанавл. документ" data-ext={apz.TitleDocumentFileExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className="col-sm-6">
          <h5 className="block-title-2 mt-3 mb-3">Детали водоснабжения</h5>

          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <td style={{width: '40%'}}>Общая потребность (м<sup>3</sup>/сутки)</td> 
                <td>{apz.WaterRequirement}</td>
              </tr>
              <tr>
                <td>Хозпитьевые нужды (м<sup>3</sup>/сутки)</td>
                <td>{apz.WaterDrinking}</td>
              </tr>
              <tr>
                <td>Производ. нужды (м<sup>3</sup>/сутки)</td>
                <td>{apz.WaterProduction}</td>
              </tr>
              <tr>
                <td>Расходы пожаротушения (л/сек)</td>
                <td>{apz.WaterFireFighting}</td>
              </tr>
              <tr>
                <td>Общ. кол. сточных вод (м<sup>3</sup>/сутки)</td>
                <td>{apz.WaterSewage}</td>
              </tr>
            </tbody>
          </table>

          <div className={this.state.showTechCon ? '' : 'invisible'}>
            <h5 className="block-title-2 mt-3 mb-3">Ответ</h5>

            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td><b>Сформированный ТУ</b></td>  
                  <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.Id, apz.ProjectName)}>Скачать</a></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={this.state.showButtons ? 'btn-group' : 'invisible'} role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', marginBottom: '10px'}}>
            <button className="btn btn-raised btn-success" style={{marginRight: '5px'}}
                    data-toggle="modal" data-target="#AcceptApzForm">
              Одобрить
            </button>
            <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#DeclineApzForm">
              Отклонить
            </button>
            <div className="modal fade" id="AcceptApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Одобрение Заявки</h5>
                    <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="pname">Наименование объекта</label>
                          <input type="text" readOnly="readonly" className="form-control" id="pname" placeholder={apz.ProjectName} />
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
                          <label>Расходы пожаротушения внутренные (л/сек)</label>
                          <input type="number" step="any" className="form-control" value={this.state.fireFightingWaterIn} onChange={this.onFireFightingWaterInChange} />
                        </div>
                        <div className="form-group">
                          <label>Расходы пожаротушения внешные (л/сек)</label>
                          <input type="number" step="any" className="form-control" value={this.state.fireFightingWaterOut} onChange={this.onFireFightingWaterOutChange} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="adress">Адрес объекта</label>
                          <input type="text" readOnly="readonly" className="form-control" id="adress" placeholder={apz.ProjectAddress} />
                        </div>
                        <div className="form-group">
                          <label>Точка подключения</label>
                          <input type="text" className="form-control" placeholder="" value={this.state.connectionPoint} onChange={this.onConnectionPointChange} />
                        </div>
                        <div className="form-group">
                          <label>Рекомендация</label>
                          <textarea rows="5" className="form-control" value={this.state.recomendation} onChange={this.onRecomendationChange} placeholder="Описание"></textarea>
                        </div>
                        <div className="form-group">
                          <label>Номер документа</label>
                          <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="upload_file">Прикрепить файл</label>
                          <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.acceptDeclineApzForm.bind(this, apz.Id, true, "your form was accepted")}>Отправить</button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="DeclineApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Отклонение Заявки</h5>
                    <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="docNumber">Номер документа</label>
                      <input type="text" className="form-control" id="docNumber" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                    </div>
                    <div className="form-group">
                     <label>Причина отклонения</label>
                      <textarea rows="5" className="form-control" value={this.state.description} onChange={this.onDescriptionChange} placeholder="Описание"></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="upload_file">Прикрепить файл</label>
                      <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.acceptDeclineApzForm.bind(this, apz.Id, false, this.state.description)}>Отправить</button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-12">
          {this.state.showMap && <ShowMap />} 

          <button className="btn btn-raised btn-info" onClick={this.toggleMap} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>
        </div>

        <div className="col-sm-12">
          <hr />
          <Link className="btn btn-outline-secondary pull-right" to={'/providerwater/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
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
              'dojo/domReady!'
            ]}    
            
            onReady={({loadedModules: [MapView, LayerList, WebScene, FeatureLayer, TileLayer, Search, WebMap], containerNode}) => {
              var map = new WebMap({
                portalItem: {
                  id: "a0b7247966fa4754ad21634c3844371f"
                }
              });

              /*
              var waterLines = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%A2%D1%80%D1%83%D0%B1%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D1%8B_%D0%B2%D0%BE%D0%B4%D0%BE%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F2/FeatureServer",
                outFields: ["*"],
                title: "Трубопроводы водоснабжения"
              });
              map.add(waterLines);

              var waterLineSafetyZone = new FeatureLayer({
                url: 'https://gis.uaig.kz/server/rest/services/Hosted/%D0%9E%D1%85%D1%80%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B7%D0%BE%D0%BD%D0%B0_%D0%B2%D0%BE%D0%B4%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D0%B0/FeatureServer',
                outFields: ["*"],
                title: "Охранная зона водопровода"
              });
              map.add(waterLineSafetyZone);

              var waterResourse = new FeatureLayer({
                url: 'https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%BE%D0%BD%D0%B0_%D0%BE%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D0%B2%D0%BE%D0%B4%D0%BD%D1%8B%D0%BC%D0%B8_%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%B0%D0%BC%D0%B8/FeatureServer',
                outFields: ["*"],
                title: "Зоны обеспеч. водными ресурсами"
              });
              map.add(waterResourse);

              var flGosAkts = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                outFields: ["*"],
                title: "Гос акты"
              });
              map.add(flGosAkts);
              */
              
              var view = new MapView({
                container: containerNode,
                map: map,
                center: [76.886, 43.250], // lon, lat
                scale: 10000
              });
              
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