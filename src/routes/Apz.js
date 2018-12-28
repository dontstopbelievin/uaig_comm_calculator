import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
//import { NavLink } from 'react-router-dom';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';

export default class Apz extends React.Component {
  render() {
    return (
      <div className="content container body-content">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/head/status/:status" component={AllApzs} />
              <Route path="/head/:id" component={ShowApz} />
              <Redirect from="/head" to="/head/status/active" />
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

    //var providerName = roles[1];
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/all/", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        switch (status) {
          case 'active':
            var apzs = data.filter(function(obj) { return obj.Status === 4; });
            break;

          case 'accepted':
            apzs = data.filter(function(obj) { return obj.Status === 1 && (obj.HeadDate !== null && obj.HeadResponse === null); });
            break;

          case 'declined':
            apzs = data.filter(function(obj) { return obj.Status === 0 && (obj.HeadDate !== null && obj.HeadResponse !== null); });
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
          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/head/status/active" replace>Активные</NavLink></li>
          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/head/status/accepted" replace>Принятые</NavLink></li>
          <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/head/status/declined" replace>Отказанные</NavLink></li>
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
                    {apz.Status === 0 && (apz.HeadDate !== null && apz.HeadResponse !== null) &&
                      <span className="text-danger">Отказано</span>
                    }

                    {apz.Status === 1 && (apz.HeadDate !== null && apz.HeadResponse === null) &&
                      <span className="text-success">Принято</span>
                    }

                    {apz.Status === 4 &&
                      <span className="text-info">В процессе</span>
                    }
                  </td>
                  <td>
                    <Link className="btn btn-outline-info" to={'/head/' + apz.Id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
      file: false,
      docNumber: "",
      description: '',
      showMapText: 'Показать карту',
      response: null,
    };

    this.onDocNumberChange = this.onDocNumberChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
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
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/head/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        this.setState({apz: data});
        this.setState({showButtons: false});

        if (data.Status === 4) {
          this.setState({showButtons: true});
        }

        if ([data.WaterResponse, data.ElectroResponse, data.HeatResponse, data.GasResponse, data.PhoneResponse].indexOf(false) === -1) {
          this.setState({response: true});
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
    formData.append('DocNumber', this.state.docNumber);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/status/" + apzId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        //var data = JSON.parse(xhr.responseText);

        if(status === true) {
          alert("Заявление принято!");
          this.setState({ showButtons: false });
        } else {
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

  // print technical condition of waterProvider

  printTechCon(apzId, project, techcon) {
    var token = sessionStorage.getItem('tokenInfo');
    var savedName;

    switch (techcon) {
      case "water":
        savedName = "ТУ-Вода-";
        break;

      case "gas":
        savedName = "ТУ-Газ-";
        break;

      case "electro":
        savedName = "ТУ-Электр-";
        break;

      case "heat":
        savedName = "ТУ-Тепло-";
        break;

      case "phone":
        savedName = "ТУ-Телефон";
        break;

      default:
        return false;
    }

    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/print/tc/" + techcon + "/" + apzId, true);
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
            link.download = savedName + project + formated_date + ".pdf";

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
                <td>
                  {apz.ProjectAddress}

                  {apz.ProjectAddressCoordinates != null &&
                    <a className="ml-2 pointer text-info" onClick={this.toggleMap.bind(this, true)}>Показать на карте</a>
                  }
                </td>
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
          <h5 className="block-title-2 mt-3 mb-3">Решение</h5>
          <table className="table table-bordered table-striped">
            <tbody>
                <tr>
                  <td style={{width: '40%'}}>
                    <b>Водоснабжение</b>
                  </td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#water_provier_modal">Просмотр</a></td>
                </tr>

                <tr>
                  <td style={{width: '40%'}}>
                    <b>Теплоснабжение</b>
                  </td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#heat_provier_modal">Просмотр</a></td>
                </tr>

                <tr>
                  <td style={{width: '40%'}}>
                    <b>Электроснабжение</b>
                  </td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#electro_provier_modal">Просмотр</a></td>
                </tr>

                <tr>
                  <td style={{width: '40%'}}>
                    <b>Газоснабжение</b>
                  </td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#gas_provier_modal">Просмотр</a></td>
                </tr>

                <tr>
                  <td style={{width: '40%'}}>
                    <b>Телефонизация</b>
                  </td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#phone_provier_modal">Просмотр</a></td>
                </tr>
            </tbody>
          </table>

          <div className={this.state.showButtons ? '' : 'invisible'}>
            <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', marginBottom: '10px'}}>
              { this.state.response ?
                <button className="btn btn-raised btn-success" style={{marginRight: '5px'}}
                        data-toggle="modal" data-target="#AcceptApzForm">
                  Одобрить
                </button>
                :
                <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} disabled="disabled">
                  Одобрить
                </button>
              }
              <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#DeclineApzForm">
                Отклонить
              </button>
              <div className="modal fade" id="AcceptApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Одобрение Заявки</h5>
                      <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label htmlFor="pname">Наименование объекта</label>
                        <input type="text" readOnly="readonly" className="form-control" id="pname" placeholder={apz.ProjectName} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="adress">Адрес объекта</label>
                        <input type="text" readOnly="readonly" className="form-control" id="adress" placeholder={apz.ProjectAddress} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="docNumber">Номер документа</label>
                        <input type="text" className="form-control" id="docNumber" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="upload_file">Прикрепить файл</label>
                        <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
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
        </div>

        <div className="col-sm-12">
          {this.state.showMap && <ShowMap coordinates={apz.ProjectAddressCoordinates} />}

          <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>
        </div>

        <div className="modal fade" id="water_provier_modal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Решение водоснабжения</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered table-striped">
                  <tbody>
                    {apz.WaterDoc && apz.WaterResponse &&
                      <tr>
                        <td style={{width: '50%'}}><b>Общая потребность (м<sup>3</sup>/сутки)</b></td>
                        <td>{apz.GenWaterReq}</td>
                      </tr>
                    }
                    {apz.WaterDoc && apz.WaterResponse &&
                      <tr>
                        <td><b>Хозпитьевые нужды (м<sup>3</sup>/сутки)</b></td>
                        <td>{apz.DrinkingWater}</td>
                      </tr>
                    }
                    {apz.WaterDoc && apz.WaterResponse &&
                      <tr>
                        <td><b>Производственные нужды (м<sup>3</sup>/сутки)</b></td>
                        <td>{apz.ProdWater}</td>
                      </tr>
                    }
                    {apz.WaterDoc && apz.WaterResponse &&
                      <tr>
                        <td><b>Расходы пожаротушения внутренные (л/сек)</b></td>
                        <td>{apz.FireFightingWaterIn}</td>
                      </tr>
                    }
                    {apz.WaterDoc && apz.WaterResponse &&
                      <tr>
                        <td><b>Расходы пожаротушения внешные (л/сек)</b></td>
                        <td>{apz.FireFightingWaterOut}</td>
                      </tr>
                    }
                    {apz.WaterDoc && apz.WaterResponse &&
                      <tr>
                        <td><b>Точка подключения</b></td>
                        <td>{apz.WaterConnectionPoint}</td>
                      </tr>
                    }
                    {apz.WaterDoc && apz.WaterResponse &&
                      <tr>
                        <td><b>Рекомендация</b></td>
                        <td>{apz.WaterRecomendation}</td>
                      </tr>
                    }
                    {apz.WaterDoc && apz.WaterResponse &&
                      <tr>
                        <td><b>Номер документа</b></td>
                        <td>{apz.WaterDocNumber}</td>
                      </tr>
                    }

                    {apz.WaterDoc && apz.WaterResponse &&
                      <tr>
                        <td><b>Загруженный ТУ</b></td>
                        <td><a className="text-info pointer" data-file={apz.WaterDoc} data-name="ТУ Вода" data-ext={apz.WaterDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                      </tr>
                    }
                    {apz.WaterDoc && apz.WaterResponse &&
                      <tr>
                        <td><b>Сформированный ТУ</b></td>
                        <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.Id, apz.ProjectName, "water")}>Скачать</a></td>
                      </tr>
                    }

                    {apz.WaterDoc && !apz.WaterResponse &&
                      <tr>
                        <td style={{width: '50%'}}><b>МО Вода</b></td>
                        <td><a className="text-info pointer" data-file={apz.WaterDoc} data-name="МО Вода" data-ext={apz.WaterDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="heat_provier_modal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Решение теплоснабжения</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered table-striped">
                  <tbody>
                    {apz.HeatDoc && apz.HeatResponse &&
                      <tr>
                        <td style={{width: '50%'}}><b>Источник теплоснабжения</b></td>
                        <td>{apz.HeatResource}</td>
                      </tr>
                    }
                    {apz.HeatDoc && apz.HeatResponse &&
                      <tr>
                        <td><b>Точка подключения</b></td>
                        <td>{apz.HeatConnectionPoint}</td>
                      </tr>
                    }
                    {apz.HeatDoc && apz.HeatResponse &&
                      <tr>
                        <td><b>Давление теплоносителя</b></td>
                        <td>{apz.HeatTransPressure}</td>
                      </tr>
                    }
                    {apz.HeatDoc && apz.HeatResponse &&
                      <tr>
                        <td><b>Тепловые нагрузки по договору</b></td>
                        <td>{apz.HeatLoadContractNum}</td>
                      </tr>
                    }
                    {apz.HeatDoc && apz.HeatResponse &&
                      <tr>
                        <td><b>Отопление (Гкал/ч)</b></td>
                        <td>{apz.HeatMainInContract}</td>
                      </tr>
                    }
                    {apz.HeatDoc && apz.HeatResponse &&
                      <tr>
                        <td><b>Вентиляция (Гкал/ч)</b></td>
                        <td>{apz.HeatVenInContract}</td>
                      </tr>
                    }
                    {apz.HeatDoc && apz.HeatResponse &&
                      <tr>
                        <td><b>Горячее водоснабжение (Гкал/ч)</b></td>
                        <td>{apz.HeatWaterInContract}</td>
                      </tr>
                    }
                    {apz.HeatDoc && apz.HeatResponse &&
                      <tr>
                        <td><b>Дополнительное</b></td>
                        <td>{apz.HeatAddition}</td>
                      </tr>
                    }
                    {apz.HeatDoc && apz.HeatResponse &&
                      <tr>
                        <td><b>Номер документа</b></td>
                        <td>{apz.HeatDocNumber}</td>
                      </tr>
                    }

                    {apz.HeatDoc && apz.HeatResponse &&
                      <tr>
                        <td><b>Загруженный ТУ</b>:</td>
                        <td><a className="text-info pointer" data-file={apz.HeatDoc} data-name="ТУ Тепло" data-ext={apz.HeatDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                      </tr>
                    }
                    {apz.HeatDoc && apz.HeatResponse &&
                      <tr>
                        <td><b>Сформированный ТУ</b></td>
                        <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.Id, apz.ProjectName, "heat")}>Скачать</a></td>
                      </tr>
                    }

                    {apz.HeatDoc && !apz.HeatResponse &&
                      <tr>
                        <td style={{width: '50%'}}><b>МО Тепло</b></td>
                        <td><a className="text-info pointer" data-file={apz.HeatDoc} data-name="МО Тепло" data-ext={apz.HeatDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="electro_provier_modal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Решение электроснабжения</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered table-striped">
                  <tbody>
                    {apz.ElectroDoc && apz.ElectroResponse &&
                      <tr>
                        <td style={{width: '50%'}}><b>Требуемая мощность (кВт)</b></td>
                        <td>{apz.ElecReqPower}</td>
                      </tr>
                    }
                    {apz.ElectroDoc && apz.ElectroResponse &&
                      <tr>
                        <td><b>Характер нагрузки (фаза)</b></td>
                        <td>{apz.ElecPhase}</td>
                      </tr>
                    }
                    {apz.ElectroDoc && apz.ElectroResponse &&
                      <tr>
                        <td><b>Категория по надежности (кВт)</b></td>
                        <td>{apz.ElecSafeCategory}</td>
                      </tr>
                    }
                    {apz.ElectroDoc && apz.ElectroResponse &&
                      <tr>
                        <td><b>Точка подключения</b></td>
                        <td>{apz.ElecConnectionPoint}</td>
                      </tr>
                    }
                    {apz.ElectroDoc && apz.ElectroResponse &&
                      <tr>
                        <td><b>Рекомендация</b></td>
                        <td>{apz.ElecRecomendation}</td>
                      </tr>
                    }
                    {apz.ElectroDoc && apz.ElectroResponse &&
                      <tr>
                        <td><b>Номер документа</b></td>
                        <td>{apz.ElecDocNumber}</td>
                      </tr>
                    }

                    {apz.ElectroDoc && apz.ElectroResponse &&
                      <tr>
                        <td><b>Загруженный ТУ</b>:</td>
                        <td><a className="text-info pointer" data-file={apz.ElectroDoc} data-name="ТУ Электро" data-ext={apz.ElectroDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                      </tr>
                    }
                    {apz.ElectroDoc && apz.ElectroResponse &&
                      <tr>
                        <td><b>Сформированный ТУ</b></td>
                        <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.Id, apz.ProjectName, "electro")}>Скачать</a></td>
                      </tr>
                    }

                    {apz.ElectroDoc && !apz.ElectroResponse &&
                      <tr>
                        <td style={{width: '50%'}}><b>МО Электро</b></td>
                        <td><a className="text-info pointer" data-file={apz.ElectroDoc} data-name="МО Электро" data-ext={apz.ElectroDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="gas_provier_modal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Решение газоснабжения</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered table-striped">
                  <tbody>
                    {apz.GasDoc && apz.GasResponse &&
                      <tr>
                        <td style={{width: '50%'}}><b>Точка подключения</b></td>
                        <td>{apz.GasConnectionPoint}</td>
                      </tr>
                    }
                    {apz.GasDoc && apz.GasResponse &&
                      <tr>
                        <td><b>Диаметр газопровода (мм)</b></td>
                        <td>{apz.GasPipeDiameter}</td>
                      </tr>
                    }
                    {apz.GasDoc && apz.GasResponse &&
                      <tr>
                        <td><b>Предполагаемый объем (м<sup>3</sup>/час)</b></td>
                        <td>{apz.AssumedCapacity}</td>
                      </tr>
                    }
                    {apz.GasDoc && apz.GasResponse &&
                      <tr>
                        <td><b>Предусмотрение</b></td>
                        <td>{apz.GasReconsideration}</td>
                      </tr>
                    }
                    {apz.GasDoc && apz.GasResponse &&
                      <tr>
                        <td><b>Номер документа</b></td>
                        <td>{apz.GasDocNumber}</td>
                      </tr>
                    }

                    {apz.GasDoc && apz.GasResponse &&
                      <tr>
                        <td><b>Загруженный ТУ</b></td>
                        <td><a className="text-info pointer" data-file={apz.GasDoc} data-name="ТУ Газ" data-ext={apz.GasDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                      </tr>
                    }

                    {apz.GasDoc && apz.GasResponse &&
                      <tr>
                        <td><b>Сформированный ТУ</b></td>
                        <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.Id, apz.ProjectName, "gas")}>Скачать</a></td>
                      </tr>
                    }

                    {apz.GasDoc && !apz.GasResponse &&
                      <tr>
                        <td style={{width: '50%'}}><b>МО Газ</b></td>
                        <td><a className="text-info pointer" data-file={apz.GasDoc} data-name="МО Газ" data-ext={apz.GasDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="phone_provier_modal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Решение телефонизации</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered table-striped">
                  <tbody>
                    {apz.PhoneDoc && apz.PhoneResponse &&
                      <tr>
                        <td style={{width: '50%'}}><b>Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</b></td>
                        <td>{apz.ResponseServiceNum}</td>
                      </tr>
                    }
                    {apz.PhoneDoc && apz.PhoneResponse &&
                      <tr>
                        <td><b>Телефонная емкость</b></td>
                        <td>{apz.ResponseCapacity}</td>
                      </tr>
                    }
                    {apz.PhoneDoc && apz.PhoneResponse &&
                      <tr>
                        <td><b>Планируемая телефонная канализация</b></td>
                        <td>{apz.ResponseSewage}</td>
                      </tr>
                    }
                    {apz.PhoneDoc && apz.PhoneResponse &&
                      <tr>
                        <td><b>Пожелания заказчика (тип оборудования, тип кабеля и др.)</b></td>
                        <td>{apz.ResponseClientWishes}</td>
                      </tr>
                    }
                    {apz.PhoneDoc && apz.PhoneResponse &&
                      <tr>
                        <td><b>Номер документа</b></td>
                        <td>{apz.ResponseDocNumber}</td>
                      </tr>
                    }

                    {apz.PhoneDoc && apz.PhoneResponse &&
                      <tr>
                        <td><b>Загруженный ТУ</b></td>
                        <td><a className="text-info pointer" data-file={apz.PhoneDoc} data-name="ТУ Телефон" data-ext={apz.PhoneDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                      </tr>
                    }

                    {apz.PhoneDoc && apz.PhoneResponse &&
                      <tr>
                        <td><b>Сформированный ТУ</b></td>
                        <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.Id, apz.ProjectName, "phone")}>Скачать</a></td>
                      </tr>
                    }

                    {apz.PhoneDoc && !apz.PhoneResponse &&
                      <tr>
                        <td style={{width: '50%'}}><b>МО Газ</b></td>
                        <td><a className="text-info pointer" data-file={apz.PhoneDoc} data-name="МО Телефон" data-ext={apz.PhoneDocExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-12">
          <hr />
          <Link className="btn btn-outline-secondary pull-right" to={'/head/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
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
                  id: "caa580cafc1449dd9aa4fd8eafd3a14d"
                }
              });

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
