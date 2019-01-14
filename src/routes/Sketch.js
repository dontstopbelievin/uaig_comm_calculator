import React from 'react';
import EsriLoaderReact from 'esri-loader-react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactHintFactory from "react-hint";

const ReactHint = ReactHintFactory(React)

export default class Sketch extends React.Component {
  render() {
    return (
      <div className="content container body-content citizen-sketch-list-page">
        <div>
          
          <div className="card-body">
            <Switch>
                <Route path="/panel/citizen/sketch/status/:status/:page" exact render={(props) =>(
                <AllSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/sketch/add" exact render={(props) =>(
                <AddSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/sketch/show/:id" exact render={(props) =>(
                <ShowSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Redirect from="/panel/citizen/sketch" to="/panel/citizen/sketch/status/active/1" />
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
    this.props.breadCrumbs();
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
                <Link className="btn btn-outline-primary mb-3" to="/panel/citizen/sketch/add">Создать заявление</Link>
              </div>
              <div className="col-sm-4 statusActive">
                <ul className="nav nav-tabs mb-2 pull-right">
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'active'} activeStyle={{color:"black"}} to="/panel/citizen/sketch/status/active/1" replace>Активные</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'accepted'} activeStyle={{color:"black"}} to="/panel/citizen/sketch/status/accepted/1" replace>Принятые</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'declined'} activeStyle={{color:"black"}} to="/panel/citizen/sketch/status/declined/1" replace>Отказанные</NavLink></li>
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
                        <Link className="btn btn-outline-info" to={'/panel/citizen/sketch/show/' + sketch.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
                    <Link className="page-link" to={'/panel/citizen/sketch/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/citizen/sketch/status/' + status + '/' + num}>{num}</Link>
                      </li>
                      );
                    }.bind(this))
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/citizen/sketch/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
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

  componentDidMount() {
    this.props.breadCrumbs();
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
              <Link className="btn btn-outline-secondary pull-right" to={'/panel/citizen/sketch'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
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
          applicant: '',
          region: 'Наурызбай',
          categoryFiles: [],
          hasCoordinates:false,
          checkboxes: ['1'
  :
      false, '2'
  :
      false, '3'
  :
      false, '4'
  :
      false
  ]
  }
      this.hasCoordinates=this.hasCoordinates.bind(this);
      this.toggleMap=this.toggleMap.bind(this);
      this.onCheckboxChange = this.onCheckboxChange.bind(this);
      this.resetForm = this.resetForm.bind(this);
      this.onNameChange = this.onNameChange.bind(this);
      this.onCustomerChange = this.onCustomerChange.bind(this);
      this.onInputChange=this.onInputChange.bind(this);
      this.uploadFile=this.uploadFile.bind(this);
      this.saveApz=this.saveApz.bind(this);
  }

  toggleMap(value) {
      this.setState({
          showMap: value
      })

      if (value) {
          $('#tab0-form').slideUp();
      } else {
          $('#tab0-form').slideDown();
      }
  }

  hasCoordinates(value) {

      if (value) {
          $('.coordinates_block div:eq(0)').removeClass('col-sm-7').addClass('col-sm-6');
          $('.coordinates_block div:eq(1)').removeClass('col-sm-5').addClass('col-sm-6');
      } else {
          $('.coordinates_block div:eq(0)').removeClass('col-sm-6').addClass('col-sm-7');
          $('.coordinates_block div:eq(1)').removeClass('col-sm-6').addClass('col-sm-5');
      }
      this.setState({ hasCoordinates: value });
  }

  onCustomerChange(e){
      this.setState({customer:e.target.value});
  }

  onNameChange(e){
    this.setState({applicant:e.target.value});
  }

  onInputChange(e) {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      const name = e.target.name;
      this.setState({ [name] : value });
  }

  uploadFile(category, e) {
        var file = e.target.files[0];
        var name = file.name.replace(/\.[^/.]+$/, "");
        var progressbar = $('.progress[data-category=' + category + ']');

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
            success: function (response) {
                var data = {id: response.id, name: response.name};

                setTimeout(function() {
                    progressbar.css('display', 'none');
                    switch (category) {
                        case 3:
                            this.setState({personalIdFile: data});
                            break;

                        case 9:
                            this.setState({confirmedTaskFile: data});
                            break;

                        case 10:
                            this.setState({titleDocumentFile: data});
                            break;

                        case 27:
                            this.setState({additionalFile: data});
                            break;

                        case 20:
                            this.setState({paymentPhotoFile: data});
                            break;

                        case 22:
                            this.setState({survey: data});
                            break;

                        case 24:
                            this.setState({claimedCapacityJustification: data});
                            break;
                    }
                    alert("Файл успешно загружен");
                }.bind(this), '1000')
            }.bind(this),
            error: function (response) {
                progressbar.css('display', 'none');
                alert("Не удалось загрузить файл");
            }
        });
    }


  componentDidMount() {
    console.log(sessionStorage.getItem('userId'));
    var userId = sessionStorage.getItem('userId');
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/personalData/edit/"+userId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            data = data.userData;
            console.log(data);
            this.setState({first_name: data.first_name});
            this.setState({last_name: data.last_name});
            this.setState({middle_name: data.middle_name ?data.middle_name:" "});
            this.setState({company_name:data.company_name ?data.company_name:" "});
            if (data.bin !== null){
                this.setState({bin: data.bin});
            }else{
                this.setState({bin: false});
                this.setState({iin: data.iin});
            }
            this.setState({ loaderHidden: true });
        } else if (xhr.status === 401) {
            sessionStorage.clear();
            alert("Время сессии истекло. Пожалуйста войдите заново!");
            this.props.history.replace("/login");
        } else if (xhr.status === 500) {
            alert('Пользователь не найден в базе данных. Попробуйте еще раз!')
        }
    }.bind(this);
    xhr.send();
    this.props.breadCrumbs();
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

  ObjectArea(e) {
      if(e.target.name === 'objectArea') {
          this.setState({objectArea: e.target.value});
      }
  }

  selectFromList(category, e) {
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/file/category/" + category, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
          if (xhr.status === 200) {
              var data = JSON.parse(xhr.responseText);
              this.setState({categoryFiles: data});

              $('#selectFileModal').modal('show');
          }
      }.bind(this)
      xhr.send();
  }
  
  saveApz(e) {
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

  routeChange(){
      this.props.history.goBack();
  }

  render() {
    return (
        <div className="container" id="apzFormDiv">
            <ReactHint autoPosition events delay={100} />
            <ReactHint attribute="data-custom" events onRenderContent={this.onRenderContent} ref={(ref) => this.instance = ref} delay={100}/>
            {this.state.loaderHidden &&
            <div className="tab-pane">
                <div className="row">
                    <div className="col-4">
                        <div className="nav flex-column nav-pills container-fluid" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            <a className="nav-link active" id="tab0-link" data-toggle="pill" href="#tab0" role="tab" aria-controls="tab0" aria-selected="true">Заявление <span id="tabIcon"></span></a>
                            <a className="nav-link" id="tab1-link" data-toggle="pill" href="#tab1" role="tab" aria-controls="tab1" aria-selected="false">Объект <span id="tabIcon"></span></a>
                            <a className="nav-link" id="tab2-link" data-toggle="pill" href="#tab2" role="tab" aria-controls="tab2" aria-selected="false">Электроснабжение <span id="tabIcon"></span></a>
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="tab-content" id="v-pills-tabContent">
                            <div className="tab-pane fade show active" id="tab0" role="tabpanel" aria-labelledby="tab0-link">
                                <form id="tab0-form" data-tab="0" onSubmit={this.saveApz.bind(this, false)}>
                                    <div className="row">
                                        <div className="col-md-7">
                                            <div className="form-group">
                                                <label htmlFor="Applicant">Наименование заявителя:</label>
                                                <input data-rh="Заявитель" data-rh-at="right" type="text" className="form-control" onChange={this.onNameChange} name="applicant" value={this.state.applicant=this.state.company_name==' ' ?this.state.last_name+" "+this.state.first_name+" "+this.state.middle_name:this.state.company_name } required />
                                                {/*<span className="help-block"></span>*/}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="applicantAddress">Адрес жительства:</label>
                                                <input data-rh="Адрес жительства" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} name="applicantAddress" value={this.state.applicantAddress} required />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Phone">Телефон</label>
                                                <input data-rh="Телефон" data-rh-at="right" type="tel" className="form-control" onChange={this.onInputChange} value={this.state.phone} name="phone" placeholder="8 (7xx) xxx xx xx" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Customer">Заказчик</label>
                                                <input data-rh="Заказчик" data-rh-at="right" type="text" required onChange={this.onCustomerChange} value={this.state.customer=this.state.company_name==' ' ?this.state.last_name+" "+this.state.first_name+" "+this.state.middle_name:this.state.company_name} className="form-control customer_field" name="customer" placeholder="ФИО / Наименование компании" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Region">Район</label>
                                                <select className="form-control" onChange={this.onInputChange} value={this.state.region} name="region">
                                                    <option>Наурызбай</option>
                                                    <option>Алатау</option>
                                                    <option>Алмалы</option>
                                                    <option>Ауезов</option>
                                                    <option>Бостандық</option>
                                                    <option>Жетісу</option>
                                                    <option>Медеу</option>
                                                    <option>Турксиб</option>
                                                </select>
                                            </div>
                                            {/*<div className="form-group">
                            <label htmlFor="Address">Адрес:</label>
                            <input type="text" className="form-control" required id="ApzAddressForm" name="Address" placeholder="ул. Абая, д.25" />
                          </div>*/}
                                            <div className="form-group">
                                                <label htmlFor="Designer">Проектировщик №ГСЛ, категория</label>
                                                <input data-rh="Проектировщик №ГСЛ, категория" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.designer} name="designer" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="ProjectName">Наименование проектируемого объекта</label>
                                                <input data-rh="Наименование проектируемого объекта" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.projectName} id="ProjectName" name="projectName" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="ProjectAddress">Адрес проектируемого объекта</label>
                                                <div className="row coordinates_block pt-0">
                                                    <div className="col-sm-7">
                                                        <input data-rh="Адрес проектируемого объекта" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.projectAddress} name="projectAddress" />
                                                        <input type="hidden" onChange={this.onInputChange} value={this.state.projectAddressCoordinates} id="ProjectAddressCoordinates" name="projectAddressCoordinates" />
                                                    </div>
                                                    <div className="col-sm-5 p-0">
                                                        <a className="btn btn-secondary btn-sm mark_btn" onClick={() => this.toggleMap(true)}>
                                                            {this.state.hasCoordinates &&
                                                            <i className="glyphicon glyphicon-ok coordinateIcon mr-1"></i>
                                                            }

                                                            Отметить на карте
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="form-group">
                                                <label>Уд.личности/Реквизиты</label>
                                                <div className="file_container">
                                                    <div className="progress mb-2" data-category="3" style={{height: '20px', display: 'none'}}>
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>

                                                    {this.state.personalIdFile &&
                                                    <div className="file_block mb-2">
                                                        <div>
                                                            {this.state.personalIdFile.name}
                                                            <a className="pointer" onClick={(e) => this.setState({personalIdFile: false}) }>×</a>
                                                        </div>
                                                    </div>
                                                    }

                                                    <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                                        <label htmlFor="PersonalIdFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                                        <input type="file" id="PersonalIdFile" name="PersonalIdFile" className="form-control" onChange={this.uploadFile.bind(this, 3)} style={{display: 'none'}} />
                                                        <label onClick={this.selectFromList.bind(this, 3)} className="btn btn-info btn-sm">Выбрать из списка</label>
                                                    </div>
                                                    <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Утвержденное задание на проектирование</label>
                                                <div className="file_container">
                                                    <div className="progress mb-2" data-category="9" style={{height: '20px', display: 'none'}}>
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>

                                                    {this.state.confirmedTaskFile &&
                                                    <div className="file_block mb-2">
                                                        <div>
                                                            {this.state.confirmedTaskFile.name}
                                                            <a className="pointer" onClick={(e) => this.setState({confirmedTaskFile: false}) }>×</a>
                                                        </div>
                                                    </div>
                                                    }

                                                    <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                                        <label htmlFor="ConfirmedTaskFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                                        <input type="file" id="ConfirmedTaskFile" name="ConfirmedTaskFile" className="form-control" onChange={this.uploadFile.bind(this, 9)} style={{display: 'none'}} />
                                                        <label onClick={this.selectFromList.bind(this, 9)} className="btn btn-info btn-sm">Выбрать из списка</label>
                                                    </div>
                                                    <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Госакт и правоустанавливающий документ на земельный участок, договор о купли-продажи</label>
                                                <div className="file_container">
                                                    <div className="progress mb-2" data-category="10" style={{height: '20px', display: 'none'}}>
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>

                                                    {this.state.titleDocumentFile &&
                                                    <div className="file_block mb-2">
                                                        <div>
                                                            {this.state.titleDocumentFile.name}
                                                            <a className="pointer" onClick={(e) => this.setState({titleDocumentFile: false}) }>×</a>
                                                        </div>
                                                    </div>
                                                    }

                                                    <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                                        <label htmlFor="TitleDocumentFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                                        <input type="file" id="TitleDocumentFile" name="TitleDocumentFile" className="form-control" onChange={this.uploadFile.bind(this, 10)} style={{display: 'none'}} />
                                                        <label onClick={this.selectFromList.bind(this, 10)} className="btn btn-info btn-sm">Выбрать из списка</label>
                                                    </div>
                                                    <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Дополнительно (нотариальное согласие долевика, распоряжение с акимата на временное пользование)</label>
                                                <div className="file_container">
                                                    <div className="progress mb-2" data-category="27" style={{height: '20px', display: 'none'}}>
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>

                                                    {this.state.additionalFile &&
                                                    <div className="file_block mb-2">
                                                        <div>
                                                            {this.state.additionalFile.name}
                                                            <a className="pointer" onClick={(e) => this.setState({additionalFile: false}) }>×</a>
                                                        </div>
                                                    </div>
                                                    }

                                                    <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                                        <label htmlFor="AdditionalFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                                        <input type="file" id="AdditionalFile" name="AdditionalFile" className="form-control" onChange={this.uploadFile.bind(this, 27)} style={{display: 'none'}} />
                                                        <label onClick={this.selectFromList.bind(this, 27)} className="btn btn-info btn-sm">Выбрать из списка</label>
                                                    </div>
                                                    <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                                                </div>
                                            </div>

                                            {/*<div className="form-group">
                            <label htmlFor="ApzDate">Дата</label>
                            <input type="date" required className="form-control" name="ApzDate" />
                          </div>*/}
                                        </div>
                                    </div>
                                    <div>
                                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                                    </div>
                                </form>
                                {this.state.showMap &&
                                <div className="mb-4">
                                    <ShowMap point={true} changeFunction={this.onInputChange} mapFunction={this.toggleMap} hasCoordinates={this.hasCoordinates}/>
                                </div>
                                }

                                <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                            </div>
                            <div className="tab-pane fade" id="tab1" role="tabpanel" aria-labelledby="tab1-link">
                                <form id="tab1-form" data-tab="1" onSubmit={this.saveApz.bind(this, false)}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="ObjectType">Тип объекта</label>
                                                <select required className="form-control" name="objectType" id="ObjectType" onChange={this.onInputChange} value={this.state.objectType}>
                                                    <option value="null" disabled>Выберите тип объекта</option>
                                                    <option>ИЖС</option>
                                                    <option>МЖК</option>
                                                    <option>КомБыт</option>
                                                    <option>ПромПред</option>
                                                </select>
                                            </div>
                                            {/*<div className="form-group">
                            <label htmlFor="ObjectClient">Заказчик</label>
                            <input type="text" required className="form-control" name="ObjectClient" placeholder="" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="ObjectName">Наименование объекта:</label>
                            <input type="text" required className="form-control" name="ObjectName" placeholder="наименование" />
                          </div>*/}

                                            <div className="form-group">
                                                <label htmlFor="CadastralNumber">Кадастровый номер:</label>
                                                <input data-rh="Кадастровый номер:" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.cadastralNumber} name="cadastralNumber" placeholder="" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="ObjectTerm">Срок строительства по нормам</label>
                                                <input data-rh="Срок строительства по нормам" data-rh-at="right" type="text" name="objectTerm" onChange={this.onInputChange} value={this.state.objectTerm} className="form-control" id="ObjectTerm" placeholder="" />
                                            </div>
                                            {/* <div className="form-group">
                            <label htmlFor="">Правоустанавливающие документы на объект (реконструкция)</label>
                            <div className="fileinput fileinput-new" data-provides="fileinput">
                            <span className="btn btn-default btn-file"><span></span><input type="file" multiple /></span>
                            <span className="fileinput-filename"></span><span className="fileinput-new"></span>
                            </div>
                          </div> */}
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="ObjectLevel">Этажность</label>
                                                <input data-rh="Этажность" data-rh-at="right" type="number" className="form-control" onChange={this.onInputChange} value={this.state.objectLevel} name="objectLevel" placeholder="" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="ObjectArea">Площадь здания (кв.м)</label>
                                                <input data-rh="Площадь здания (кв.м)" data-rh-at="right" type="number" step="any" className="form-control" name="objectArea" onChange={this.ObjectArea.bind(this)} value={this.state.objectArea} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="ObjectRooms">Количество квартир (номеров, кабинетов)</label>
                                                <input data-rh="Количество квартир (номеров, кабинетов)" data-rh-at="right" type="number" className="form-control" onChange={this.onInputChange} value={this.state.objectRooms} name="objectRooms" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                                    </div>
                                </form>
                                <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                            </div>
                            <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-link">
                                <form id="tab2-form" data-tab="2" onSubmit={this.saveApz.bind(this, false)}>
                                    <div className="col-md-12">
                                        <div style={{color:'#D8A82D !important'}}>
                                            <label><input type="checkbox" onChange={this.onInputChange} checked={this.state.need_electro_provider} name="need_electro_provider" /> Подать заявление на выдачу технического условия электроснабжения</label>
                                        </div>
                                        <hr style={{marginTop:'5px'}}/>
                                    </div>
                                    {this.state.need_electro_provider &&
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div style={{borderRadius: '10px', background: 'rgb(239, 239, 239)', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px'}}>
                                                <div className="text-center" style={{fontSize:'15px'}}>
                                                    <p>Расчет по типовым правилам расчета норм потребления коммунальных услуг по электроснабжению(<a target="_blank" href="http://online.zakon.kz/m/Document/?doc_id=31676321">см. Приказ</a>)</p>
                                                </div><hr/>
                                                <div className="form-group">
                                                    <label>Количество ламп <img data-custom data-custom-at="bottom" data-custom-id="1" src="./images/info.png" width="20px"
                                                                                style={{borderRadius: '10px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}/></label>
                                                    <input data-rh="Количество ламп" data-rh-at="right" type="number" step="any" className="form-control" onChange={this.Calculate_lamp.bind(this)} value={this.state.n_lamp} name="electricRequiredPower" placeholder="" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Количество розеток</label>
                                                    <input data-rh="Количество розеток" data-rh-at="right" type="number" step="any" className="form-control" onChange={this.Calculate_rozetka.bind(this)} value={this.state.n_rozetka} name="electricRequiredPower" placeholder="" />
                                                </div><hr/>
                                                <div className="form-group">
                                                    <label htmlFor="ElectricRequiredPower">Требуемая мощность (кВт)</label>
                                                    {/*<input data-rh="Требуемая мощность (кВт)" data-rh-at="right" type="number" step="any" className="form-control" onChange={this.ObjectArea.bind(this)} value={this.state.electricRequiredPower} name="electricRequiredPower" placeholder="" />*/}
                                                    <input data-rh="Требуемая мощность (кВт)" data-rh-at="right" type="number" step="any" className="form-control" onChange={this.ObjectArea.bind(this)} value={this.state.electricRequiredPower} name="electricRequiredPower" placeholder="" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            {/*<div className="form-group">
                            <label htmlFor="">Предполагается установить</label>
                            <br />
                            <div className="col-md-6">
                            <ul style="list-style-type: none; padding-left: 3px">
                              <li><input type="checkbox" id="CB1"><span style="padding-left: 3px" htmlFor="CB1">электрокотлы</span><input type="text" className="form-control" placeholder=""></li>
                              <li><input type="checkbox" id="CB2"><span style="padding-left: 3px" htmlFor="CB2">электрокалориферы</span><input type="text" className="form-control" placeholder=""></li>
                              <li><input type="checkbox" id="CB3"><span style="padding-left: 3px" htmlFor="CB3">электроплитки</span><input type="text" className="form-control" placeholder=""></li>
                            </ul>
                            </div>
                            <div className="col-md-6">
                            <ul style="list-style-type: none; padding-left: 3px">
                              <li><input type="checkbox" id="CB4"><span style="padding-left: 3px" htmlFor="CB4">электропечи</span><input type="text" className="form-control" placeholder=""></li>
                              <li><input type="checkbox" id="CB5"><span style="padding-left: 3px" htmlFor="CB5">электроводонагреватели</span><input type="text" className="form-control" placeholder=""></li>
                            </ul>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="ElectricMaxLoadDevice">Из указанной макс. нагрузки относятся к электроприемникам (кВА):</label>
                            <input type="number" className="form-control" name="ElectricMaxLoadDevice" placeholder="" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="ElectricMaxLoad">Существующая максимальная нагрузка (кВА)</label>
                            <input type="number" className="form-control" name="ElectricMaxLoad" />
                          </div>*/}
                                            <div className="form-group">
                                                <label htmlFor="ElectricAllowedPower">Разрешенная по договору мощность трансформаторов (кВА) (Лицевой счет)</label>
                                                <input data-rh="Разрешенная по договору мощность трансформаторов (кВА) (Лицевой счет)" data-rh-at="right" type="number" step="any" name="electricAllowedPower" onChange={this.ObjectArea.bind(this)} value={this.state.electricAllowedPower} className="form-control" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="ElectricityPhase">Характер нагрузки (фаза)</label>
                                                <select className="form-control" onChange={this.onInputChange} value={this.state.electricityPhase} name="electricityPhase">
                                                    <option>Однофазная</option>
                                                    <option>Двухфазная</option>
                                                    <option>Трехфазная</option>
                                                    <option>Постоянная</option>
                                                    <option>Временная</option>
                                                    <option>Сезонная</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="ElectricSafetyCategory">Категория по надежности (кВт)</label>
                                                <select required className="form-control" onChange={this.onInputChange} value={this.state.electricSafetyCategory} name="electricSafetyCategory">
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Расчет-обоснование заявленной мощности</label>
                                                <div className="file_container">
                                                    <div className="progress mb-2" data-category="24" style={{height: '20px', display: 'none'}}>
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>

                                                    {this.state.claimedCapacityJustification &&
                                                    <div className="file_block mb-2">
                                                        <div>
                                                            {this.state.claimedCapacityJustification.name}
                                                            <a className="pointer" onClick={(e) => this.setState({claimedCapacityJustification: false}) }>×</a>
                                                        </div>
                                                    </div>
                                                    }

                                                    <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                                        <label htmlFor="ClaimedCapacityJustification" className="btn btn-success" style={{marginRight: '2px'}}>Загрузить</label>
                                                        <input type="file" id="ClaimedCapacityJustification" name="ClaimedCapacityJustification" className="form-control" onChange={this.uploadFile.bind(this, 24)} style={{display: 'none'}} />
                                                        <label onClick={this.selectFromList.bind(this, 24)} className="btn btn-info">Выбрать из списка</label>
                                                    </div>
                                                    <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                    <div>
                                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                                    </div>
                                </form>
                                <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="selectFileModal" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                    {this.state.categoryFiles.map(function(file, index){
                                            return(
                                                <tr key={index}>
                                                    <td>{file.name}</td>
                                                    <td>{file.extension}</td>
                                                    <td><button onClick={this.selectFile} data-category={file.category_id} data-id={file.id} data-name={file.name} className="btn btn-success">Выбрать</button></td>
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
            </div>
            }

            {!this.state.loaderHidden &&
            <div style={{textAlign: 'center'}}>
                <Loader type="Oval" color="#46B3F2" height="200" width="200" />
            </div>
            }

            <div>
                <hr />
                <button className="btn btn-outline-secondary pull-right" onClick={this.routeChange.bind(this)}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
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