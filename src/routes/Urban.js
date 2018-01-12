import React from 'react';
import * as esriLoader from 'esri-loader';
//import { NavLink } from 'react-router-dom';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';

export default class Urban extends React.Component {
  render() {
    return (
      <div className="content container urban-apz-page">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/urban/status/:status" component={AllApzs} />
              <Route path="/urban/:id" component={ShowApz} />
              <Redirect from="/urban" to="/urban/status/active" />
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
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/region", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        
        switch (status) {
          case 'active':
            var apzs = data.filter(function(obj) { return obj.Status === 2; });
            break;

          case 'accepted':
            var apzs = data.filter(function(obj) { return ((obj.Status === 0 || obj.Status === 1 || obj.Status === 3 || obj.Status === 4) && (obj.RegionDate !== null && obj.RegionResponse === null)); });
            break;

          case 'declined':
            var apzs = data.filter(function(obj) { return (obj.Status === 0 && (obj.RegionDate !== null && obj.RegionResponse !== null)); });
            break;

          default:
            var apzs = data;
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
          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/urban/status/active" replace>Активные</NavLink></li>
          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/urban/status/accepted" replace>Принятые</NavLink></li>
          <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/urban/status/declined" replace>Отказанные</NavLink></li>
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
                    {apz.Status === 0 && (apz.RegionDate !== null && apz.RegionResponse !== null) &&
                      <span className="text-danger">Отказано</span>
                    }

                    {(apz.Status === 0 || apz.Status === 1 || apz.Status === 3 || apz.Status === 4) && (apz.RegionDate !== null && apz.RegionResponse === null) &&
                      <span className="text-success">Принято</span>
                    }

                    {apz.Status === 2 &&
                      <span className="text-info">В процессе</span>
                    }
                  </td>
                  <td>
                    <Link className="btn btn-outline-info" to={'/urban/' + apz.Id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                  </td>
                </tr>
                );
              }.bind(this))
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
      showButtons: true,
      description: '',
      showMapText: 'Показать карту',
    };

    this.toggleMap = this.toggleMap.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/region/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        this.setState({apz: data});
        this.setState({showButtons: false});

        if (data.Status === 2) { 
          this.setState({showButtons: true}); 
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

    var formData = new FormData();
    formData.append('Response', status);
    formData.append('Message', comment);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/status/" + apzId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        if(status === true) {
          alert("Заявление принято!");
          this.setState({ showButtons: false });
        } else {
          alert("Заявление отклонено!");
          this.setState({ showButtons: false });
        }
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Token is expired, please login again!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData); 
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
      <div>
        <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>
        
        <table className="table table-bordered table-striped">
          <tbody>
            <tr>
              <td style={{width: '22%'}}><b>Заявитель</b></td>
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
              <td>{this.toDate(apz.ApzDate)}</td>
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

        {this.state.showMap && <ShowMap />} 

        <button className="btn btn-raised btn-info" onClick={this.toggleMap} style={{margin: '20px auto 10px'}}>
          {this.state.showMapText}
        </button>

        <div className={this.state.showButtons ? '' : 'invisible'}>
          <hr className="mt-3 mb-0" />

          <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px'}}>
            <button className="btn btn-raised btn-success" style={{marginRight: '5px'}}
                    onClick={this.acceptDeclineApzForm.bind(this, apz.Id, true, "your form was accepted")}>
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
                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.acceptDeclineApzForm.bind(this, apz.Id, false, this.state.description)}>Отправить</button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
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

class ShowMap extends React.Component {
  createMap(element){
    esriLoader.dojoRequire([
      "esri/views/MapView",
      "esri/widgets/LayerList",
      "esri/WebScene",
      "esri/layers/FeatureLayer",
      "esri/layers/TileLayer",
      "esri/widgets/Search",
      "esri/Map",
      "dojo/domReady!"
    ], function(
      MapView, LayerList, WebScene, FeatureLayer, TileLayer, Search, Map
    ) {

      var map = new Map({
        basemap: "topo"
      });
      
      var flRedLines = new FeatureLayer({
        url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8/FeatureServer",
        outFields: ["*"],
        title: "Красные линии"
      });
      map.add(flRedLines);

      var flFunZones = new FeatureLayer({
        url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%A4%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5_%D0%B7%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B52/FeatureServer",
        outFields: ["*"],
        title: "Функциональное зонирование"
      });
      map.add(flFunZones);
    
      var flGosAkts = new FeatureLayer({
        url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
        outFields: ["*"],
        title: "Гос акты"
      });
      map.add(flGosAkts);
      
      var view = new MapView({
        container: element,
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

  render() {
    return (
      <div>
        <h5 className="block-title-2 mt-5 mb-3">Карта</h5>
        <div className="col-md-12 well" style={{padding: '0', height:'600px', width:'100%'}}>
          <div className="viewDivUrban" ref={this.onReference.bind(this)}>
            <div className="container">
              <p>Загрузка...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}