import React from 'react';
import EsriLoaderReact from 'esri-loader-react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';

export default class Sketch extends React.Component {
  render() {
    return (
      <div className="content container body-content citizen-sketch-list-page">
        <div className="card">
          <div className="card-header">
            <h4 className="mb-0 mt-2">Эскизный проект</h4>
          </div>
          
          <div className="card-body">
            <Switch>
              <Route path="/sketch/status/:status/:page" component={AllSketch} />
              <Route path="/sketch/add" component={AddSketch} />
              <Route path="/sketch/show/:id" component={ShowSketch} />
              <Redirect from="/sketch" to="/sketch/status/active/1" />
            </Switch>
          </div>
        </div>
        
      </div>
    )
  }
}

class AllSketch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sketches: [],
      loaderHidden: false
    };

  }

  componentDidMount() {
    this.getSketches();
  }

  componentWillReceiveProps(nextProps) {
    this.getSketches(nextProps.match.params.status, nextProps.match.params.page);
  }

  getSketches(status = null, page = null) {
    if (!status) {
      status = this.props.match.params.status;
    }

    if (!page) {
      page = this.props.match.params.page;
    }

    this.setState({ loaderHidden: false });

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/sketch/citizen/all/" + status + '?page=' + page, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var pageNumbers = [];
        var start = (response.current_page - 4) > 0 ? (response.current_page - 4) : 1;
        var end = (response.current_page + 4) < response.last_page ? (response.current_page + 4) : response.last_page;
        
        for (start; start <= end; start++) {
          pageNumbers.push(start);
        }

        this.setState({pageNumbers: pageNumbers});
        this.setState({response: response});
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }

      this.setState({ loaderHidden: true });
    }.bind(this)
    xhr.send();
  }

  toDate(date) {
    if(date === null) {
      return date;
    }

    var jDate = new Date(date);
    var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
    var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var curr_hour = jDate.getHours() < 10 ? "0" + jDate.getHours() : jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
    
    return formated_date;
  }

  render() {
    var status = this.props.match.params.status;
    var page = this.props.match.params.page;
    var sketches = this.state.response ? this.state.response.data : [];

    return (
      <div>
        {this.state.loaderHidden &&
          <div>  
            <div className="row">
              <div className="col-sm-8">
                <Link className="btn btn-outline-primary mb-3" to="/sketch/add">Создать заявление</Link>
              </div>
              <div className="col-sm-4 statusActive">
                <ul className="nav nav-tabs mb-2 pull-right">
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'active'} activeStyle={{color:"black"}} to="/sketch/status/active/1" replace>Активные</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'accepted'} activeStyle={{color:"black"}} to="/sketch/status/accepted/1" replace>Принятые</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'declined'} activeStyle={{color:"black"}} to="/sketch/status/declined/1" replace>Отказанные</NavLink></li>
                </ul>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '23%'}}>Название</th>
                  <th style={{width: '23%'}}>Заявитель</th>
                  <th style={{width: '20%'}}>Адрес</th>
                  <th style={{width: '20%'}}>Дата заявления</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sketches.map(function(sketch, index) {
                  return(
                    <tr key={index}>
                      <td>{sketch.project_name} </td>
                      <td>{sketch.applicant}</td>
                      <td>{sketch.project_address}</td>
                      <td>{this.toDate(sketch.created_at)}</td>
                      <td>
                        <Link className="btn btn-outline-info" to={'/sketch/show/' + sketch.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                      </td>
                    </tr>
                    );
                  }.bind(this))
                }

                {sketches.length === 0 &&
                  <tr>
                    <td colSpan="5">Пусто</td>
                  </tr>
                }
              </tbody>
            </table>

            {this.state.response && this.state.response.last_page > 1 &&
              <nav className="pagination_block">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <Link className="page-link" to={'/sketch/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                        <Link className="page-link" to={'/sketch/status/' + status + '/' + num}>{num}</Link>
                      </li>
                      );
                    }.bind(this))
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/sketch/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
                  </li>
                </ul>
              </nav>
            }
          </div>
        }

        {!this.state.loaderHidden &&
          <div style={{textAlign: 'center'}}>
            <Loader type="Oval" color="#46B3F2" height="200" width="200" />
          </div>
        }
      </div>
    )
  }
}

class ShowSketch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sketch: [],
      showMap: false,
      showMapText: 'Показать карту',
      loaderHidden: false,
      responseFile: false,
    };
  }

  componentWillMount() {
    this.getSketchInfo();
  }

  getSketchInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');

    this.setState({ loaderHidden: false });

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/sketch/citizen/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var sketch = JSON.parse(xhr.responseText);
        this.setState({sketch: sketch});
        this.setState({loaderHidden: true});

        if (sketch.apz_department_response && sketch.apz_department_response.files) {
          this.setState({responseFile: sketch.apz_department_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
        }
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this)
    xhr.send();
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

  downloadFile(id) {
    var token = sessionStorage.getItem('tokenInfo');
    var url = window.url + 'api/file/download/' + id;

    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          var base64ToArrayBuffer = (function () {
        
            return function (base64) {
              var binaryString =  window.atob(base64);
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
              setTimeout(function() {window.URL.revokeObjectURL(url);},0);
            };

          }());

          saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
        } else {
          alert('Не удалось скачать файл');
        }
      }
    xhr.send();
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
    var sketch = this.state.sketch;

    if (sketch.length === 0) {
      return (
        <div>
          {!this.state.loaderHidden &&
            <div style={{textAlign: 'center'}}>
              <Loader type="Oval" color="#46B3F2" height="200" width="200" />
            </div>
          }
        </div>
      );
    }

    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>
            
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td style={{width: '22%'}}><b>ИД заявки</b></td>
                  <td>{sketch.id}</td>
                </tr>
                <tr>
                  <td><b>Заявитель</b></td>
                  <td>{sketch.applicant}</td>
                </tr>
                <tr>
                  <td><b>Телефон</b></td>
                  <td>{sketch.phone}</td>
                </tr>
                <tr>
                  <td><b>Заказчик</b></td>
                  <td>{sketch.customer}</td>
                </tr>
                <tr>
                  <td><b>Проектировщик №ГСЛ, категория</b></td>
                  <td>{sketch.designer}</td>
                </tr>
                <tr>
                  <td><b>Название проекта</b></td>
                  <td>{sketch.project_name}</td>
                </tr>
                <tr>
                  <td><b>Адрес проектируемого объекта</b></td>
                  <td>{sketch.project_address}</td>
                </tr>
                <tr>
                  <td><b>Дата заявления</b></td>
                  <td>{sketch.created_at && this.toDate(sketch.created_at)}</td>
                </tr>
              </tbody>
            </table>

            {sketch.files.length > 0 &&
              <table className="table table-bordered table-striped">
                <tbody>
                  {sketch.files.map(function(file, index) {
                    return(
                      <tr key={index}>
                        <td style={{width: '22%'}}>{file.category.name_ru} </td>
                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, file.id)}>Скачать</a></td>
                      </tr>
                      );
                    }.bind(this))
                  }
                </tbody>
              </table>
            }

            {this.state.showMap && <ShowMap />} 

            <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
              {this.state.showMapText}
            </button>

            {(sketch.status_id === 1 || sketch.status_id === 2) &&
              <div>
                <h5 className="block-title-2 mt-5 mb-3">Результат</h5>

                {this.state.responseFile &&
                  <table className="table table-bordered table-striped">
                    <tbody>
                      {sketch.status_id === 2 ?
                        <tr>
                          <td style={{width: '22%'}}><b>Решение на эскизный проект</b></td> 
                          <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>Скачать</a></td>
                        </tr>
                        :
                        <tr>
                          <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                          <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>Скачать</a></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                }
              </div>
            }

            <div className="col-sm-12">
              <hr />
              <Link className="btn btn-outline-secondary pull-right" to={'/sketch'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
            </div>
          </div>
        }
          
        {!this.state.loaderHidden &&
          <div style={{textAlign: 'center'}}>
            <Loader type="Oval" color="#46B3F2" height="200" width="200" />
          </div>
        }
      </div>
    )
  }
}

class ShowMap extends React.Component {
  constructor(props) {
    super(props);

    this.toggleMap = this.toggleMap.bind(this);
  }

  toggleMap(value) {
    this.props.mapFunction(value)
  }

  render() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    return (
      <div>
        <h5 className="block-title-2 mt-5 mb-3">Карта</h5>
        <div id="coordinates" style={{display: 'none'}}></div>
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
                basemap: "streets",
                portalItem: {
                  id: "caa580cafc1449dd9aa4fd8eafd3a14d"
                }
              });
              
              var view = new MapView({
                container: containerNode,
                map: map,
                center: [76.886, 43.250], 
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

class AddSketch extends React.Component {
  constructor() {
    super();

    this.state = {
      checkboxes: ['1': false, '2': false, '3': false, '4': false]
    }

    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  onCheckboxChange(e) {
    var checkbox = $(e.target);
    var type = checkbox.attr('data-type');
    var stateCopy = Object.assign({}, this.state);
    stateCopy.checkboxes[type] = checkbox.prop('checked');
    
    if (checkbox.prop('checked')) {
      checkbox.parent().addClass('active');
    } else {
      checkbox.parent().removeClass('active');
    }

    this.setState(stateCopy);
  };

  resetForm() {
    document.getElementById("sketch-form").reset();

    $('#sketch-form input[type="checkbox"]').map(function(index, item){
      var parent = $(item).parent();

      parent.removeClass('active');
      $('.buttons', parent).remove();
      $('.file_block', parent).remove();
    });
  }
  
  sendForm(e) {
    e.preventDefault();

    var formData = $('#sketch-form').serializeJSON();

    $.ajax({
      type: 'POST',
      url: window.url + 'api/sketch/citizen/create',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      data: JSON.stringify(formData),
      success: function (data) {
        this.resetForm();
        alert("Заявка отправлена");
      }.bind(this)
    });
  };

  render() {
    return (
      <div>
        <div className="content container sketch-page mb-0">
          <form onSubmit={this.sendForm.bind(this)} id="sketch-form" className="mb-0">
            <div className="row pt-0">
              <div className="col-sm-8">
                <div className="row pt-0">
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="Applicant">Наименование заявителя:</label>
                      <input type="text" className="form-control" required name="applicant" placeholder="Наименование" />
                      <small className="form-text text-muted help-block">Ф.И.О. (при его наличии) физического лица или наименование юридического лица</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="Customer">Заказчик</label>
                      <input type="text" className="form-control" name="customer" placeholder="Заказчик" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="Address">Адрес:</label>
                      <input type="text" className="form-control" required id="PhotoRepAddressForm" name="address" placeholder="Адрес" />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="Designer">Проектировщик №ГСЛ, категория</label>
                      <input type="text" className="form-control" name="designer" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="Phone">Телефон</label>
                      <input type="tel" className="form-control" required id="PhotoRepPhone" name="phone" placeholder="Телефон" />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="ProjectName">Наименование проектируемого объекта</label>
                      <input type="text" className="form-control" id="ProjectName" name="project_name" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="ProjectAddress">Адрес проектируемого объекта</label>
                      <input type="text" className="form-control" name="project_address" />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label>Дата</label>
                      <input type="date" name="sketch_date" className="form-control" required />
                      <small className="form-text text-muted help-block">до</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="row pt-0">
                  <div className="col-12">
                    <p>Прилагается:</p>

                    <div className="list-group">
                      <label>
                        <div className="list-group-item list-group-item-action">
                          <input data-type="1" onClick={this.onCheckboxChange} type="checkbox" value="" />   Эскиз (эскизный проект)
                          <div className="progress mt-3" data-category="1" style={{height: '20px', display: 'none'}}>
                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                          <div className="file_block"></div>
                          {this.state.checkboxes[1] === true ? <FilesForm category = '1' type = '1' /> : ''}
                        </div>
                      </label>
                      <label>
                        <div className="list-group-item list-group-item-action">
                          <input data-type="2" onClick={this.onCheckboxChange} type="checkbox" value="" />   Архитектурно-планировочное задание (копия)
                          <div className="progress mt-3" data-category="2" style={{height: '20px', display: 'none'}}>
                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                          <div className="file_block"></div>
                          {this.state.checkboxes[2] === true ? <FilesForm category = '2' type = '2' /> : ''}
                        </div>
                      </label>
                      <label>
                        <div className="list-group-item list-group-item-action">
                          <input data-type="3" onClick={this.onCheckboxChange} type="checkbox" value="" />   Удостверение личности (копия)
                          <div className="progress mt-3" data-category="3" style={{height: '20px', display: 'none'}}>
                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                          <div className="file_block"></div>
                          {this.state.checkboxes[3] === true ? <FilesForm category = '3' type = '3' /> : ''}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-12">
                <div className="mx-auto d-table">
                  <button type="submit" className="btn btn-outline-success">Отправить заявку</button>
                </div>
              </div>
            </div>
          </form>
          <div id="modal_block">
            {this.state.checkboxes[1] === true ? <FileModal category = '1' type = '1' /> : ''}
            {this.state.checkboxes[2] === true ? <FileModal category = '2' type = '2' /> : ''}
            {this.state.checkboxes[3] === true ? <FileModal category = '3' type = '3' /> : ''}
            {this.state.checkboxes[4] === true ? <FileModal category = '3' type = '4' /> : ''}
            {this.state.checkboxes[5] === true ? <FileModal category = '4' type = '5' /> : ''}
          </div>
        </div>

        <div className="col-sm-12">
          <hr />
          <Link className="btn btn-outline-secondary pull-right" to={'/sketch/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
        </div>
      </div>
    )
  }
}

class FilesForm extends React.Component {
  constructor(props) {
    super(props);

    this.uploadFile = this.uploadFile.bind(this);
    this.selectFromList = this.selectFromList.bind(this);
  }

  uploadFile(e) {
    var file = e.target.files[0];
    var name = file.name.replace(/\.[^/.]+$/, "");
    var category = this.props.category;
    var progressbar = $('.progress[data-category=' + category + ']');
    var type = this.props.type;
    var row = $(e.target).closest('.list-group-item');
    var fileBlock = $('.file_block', row);

    if (!file || !category) {
      alert('Не удалось загрузить файл');

      return false;
    }

    var formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('category', category);
    progressbar.css('display', 'flex');
    $.ajax({
      type: 'POST',
      url: window.url + 'api/file/upload',
      contentType: false,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      processData: false,
      data: formData,
      xhr: function() {
        var xhr = new window.XMLHttpRequest();

        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            $('div', progressbar).css('width', percentComplete + '%');
          }
        }, false);

        return xhr;
      },
      success: function (data) {
        var html = '<div id="file_' + type + '">' + data.name + '<input type="hidden" name="file_list[]" value="' + data.id + '"><a href="#" onClick="document.getElementById(\'file_' + type + '\').remove(); return false;">&times;</a></div>';

        setTimeout(function() {
          progressbar.css('display', 'none');
          fileBlock.html(html);
          alert("Файл успешно загружен");
        }, '1000');
      },
      error: function (response) {
        progressbar.css('display', 'none');
        alert("Не удалось загрузить файл");
      }
    });
  }

  selectFromList() {
    $('#selectFileModal' + this.props.type).modal('show');
  }

  render() {
    return (
      <div className="row mt-3 buttons">
        <div className="mx-auto">
          <label htmlFor={'upload_file' + this.props.type} className="btn btn-success" style={{marginRight: '2px'}}>Загрузить</label>
          <input id={'upload_file' + this.props.type} onChange={this.uploadFile} type="file" style={{display: 'none'}} />
          <button type="button" onClick={this.selectFromList} className="btn btn-info">Выбрать из списка</button>
        </div>
      </div>
    )
  }
}

class FileModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: []
    }

    this.getFiles = this.getFiles.bind(this);
    this.selectFile = this.selectFile.bind(this);
  }

  componentDidMount() {
    this.getFiles();
  }

  getFiles() {
    $.ajax({
      type: 'GET',
      url: window.url + 'api/file/category/' + this.props.category,
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      success: function (data) {
        this.setState({ files: data });
      }.bind(this)
    });
  }

  selectFile(e) {
    var row = $(e.target).closest('tr');
    var id = row.attr('data-id');
    var fileName = $('td:first', row).html();
    var fileBlock = $('.file_block', $('input[data-type=' + this.props.type + ']').parent());
    var html = '<div id="file_' + this.props.type + '">' + fileName + '<input type="hidden" name="file_list[]" value="' + id + '"><a href="#" onClick="document.getElementById(\'file_' + this.props.type + '\').remove(); return false;">&times;</a></div>';
    fileBlock.html(html);
    $('#selectFileModal' + this.props.type).modal('hide');
  }

  render() {
      return (
        <div className="modal fade" id={'selectFileModal' + this.props.type} tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Выбрать файл</h5>
                <button type="button" id="selectFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{width: '80%'}}>Название</th>
                      <th style={{width: '10%'}}>Формат</th>
                      <th style={{width: '10%'}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.files.map(function(file, index){
                        return(
                          <tr key={index} data-id={file.id}>
                            <td>{file.name}</td>
                            <td>{file.extension}</td>
                            <td><button onClick={this.selectFile} className="btn btn-success">Выбрать</button></td>
                          </tr>
                        );
                      }.bind(this)
                    )}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      )
    }
}