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
  constructor(props) {
    super(props);

    this.state = {
      welcome_text: true,
      left_tabs: true
    };
  }
  componentWillMount(){
    if(this.props.history.location.pathname != "/panel/citizen/sketch"){
      this.setState({welcome_text:false,left_tabs: false});
    }
  }

  hide_text(){
    this.setState({welcome_text:false, left_tabs: false});
    this.props.history.push("/panel/citizen/sketch/status/active/1");
  }


  render() {
    return (
      <div className="content container body-content citizen-sketch-list-page">

        <div>
        <div class="left-tabs">
          {this.state.left_tabs &&
            <ul>
               <li>
                 <Link to="/panel/citizen/apz">Выдача архитектурно-планировочного задания</Link>
               </li>
               <li>
                 <Link to="/panel/citizen/sketch">Выдача решения на эскизный проект</Link>
               </li>
               <li>
                 <Link to="/panel/citizen/photoreports">Выдача решения на фотоотчет</Link>
               </li>
             </ul>
          }
        </div>

          <div className="card-body">

            <Switch>
                <Route path="/panel/citizen/sketch/status/:status/:page" exact render={(props) =>(
                <AllSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/sketch/add" exact render={(props) =>(
                <AddSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/sketch/edit/:id" exact render={(props) =>(
                <AddSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/sketch/show/:id" exact render={(props) =>(
                <ShowSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              {/*<Redirect from="/panel/citizen/sketch" to="/panel/citizen/sketch/status/active/1" />*/}
            </Switch>
            {this.state.welcome_text &&
              <div class="apzinfo">
                <div class = "time">
                   <p>Срок рассмотрения заявления:</p>
                   <li>Срок рассмотрения заявления и согласования эскиза (эскизного проекта) технически и (или) технологически несложных объектов – 10 (десять) рабочих дней.</li>
                   <li>Срок рассмотрения заявления и согласования эскиза (эскизного проекта) технически и (или) технологически сложных объектов – 15 (пятнадцать) рабочих дней</li>
                   <li>Срок рассмотрения заявления и согласования эскиза (эскизного проекта) при изменении внешнего облика (фасадов) существующего объекта – 15 (пятнадцать) рабочих дней.</li>
                </div>
                <div class="application">
                   <p>Необходимый перечень документов для получения услуги:</p>
                   <li>заявление о предоставлении государственной услуги (заполняется онлайн);</li>
                   <li>электронная копия документа удостоверяющего личность;</li>
                   <li>электронная копия эскиза (эскизный проект);</li>
                   <li>копия архитектурно-планировочного задания;</li>
                </div>
                <button class="btn btn-raised btn-success" onClick={this.hide_text.bind(this)}>Перейти к заявкам</button>
              </div>
            }

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
              <div className="col-sm-7">
                <Link className="btn btn-outline-primary mb-3" to="/panel/citizen/sketch/add">Создать заявление</Link>
              </div>
              <div className="col-sm-5 statusActive">
                <ul className="nav nav-tabs mb-2 pull-right">
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'active'} activeStyle={{color:"black"}} to="/panel/citizen/sketch/status/active/1" replace>Активные</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'draft'} activeStyle={{color:"black"}} to="/panel/citizen/sketch/status/draft/1" replace>Черновики</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'accepted'} activeStyle={{color:"black"}} to="/panel/citizen/sketch/status/accepted/1" replace>Принятые</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'declined'} activeStyle={{color:"black"}} to="/panel/citizen/sketch/status/declined/1" replace>Отказанные</NavLink></li>
                </ul>
              </div>
            </div>

            <table className="table">
              <thead>
              <tr>
                <th style={{width: '5%'}}>ИД</th>
                <th style={{width: '21%'}}>Название</th>
                <th style={{width: '20%'}}>Заявитель</th>
                <th style={{width: '20%'}}>Адрес</th>
                <th style={{width: '20%'}}>Дата заявления</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
                {sketches.map(function(sketch, index) {
                  return(
                    <tr key={index}>
                      <td>{sketch.id}</td>
                      <td>{sketch.project_name} </td>
                      <td>{sketch.applicant}</td>
                      <td>{sketch.project_address}</td>
                      <td>{this.toDate(sketch.created_at)}</td>
                      <td>
                        <Link className="btn btn-outline-info" to={'/panel/citizen/sketch/' + (sketch.status_id === 7 ? 'edit/' : 'show/') + sketch.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
      personalIdFile:false,
      apzFile:false,
      sketchFile:false

    };
  }

  componentDidMount() {
    this.props.breadCrumbs();
  }

  // componentWillMount() {
  //     if (this.props.match.params.id) {
  //         this.getSketchInfo();
  //     }
  //   }
  //
  //   getSketchInfo() {
  //       var id = this.props.match.params.id;
  //       var token = sessionStorage.getItem('tokenInfo');
  //
  //       this.setState({ loaderHidden: false });
  //
  //       var xhr = new XMLHttpRequest();
  //       xhr.open("get", window.url + "api/sketch/detail/" + id, true);
  //       xhr.setRequestHeader("Authorization", "Bearer " + token);
  //       xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  //       xhr.onload = function() {
  //           if (xhr.status === 200) {
  //               var sketch = JSON.parse(xhr.responseText);
  //               var commission = sketch.commission;
  //               console.log(sketch.files);
  //               this.setState({sketch: sketch});
  //               this.setState({personalIdFile: sketch.files.filter(function(obj) { return obj.files.category_id === 3 })[0]});
  //               this.setState({apzFile: sketch.files.filter(function(obj) { return obj.category_id === 2 })[0]});
  //               this.setState({sketchFile: sketch.files.filter(function(obj) { return obj.category_id === 1 })[0]});
  //               // this.setState({additionalFile: sketch.files.filter(function(obj) { return obj.category_id === 27 })[0]});
  //               // this.setState({paymentPhotoFile: sketch.files.filter(function(obj) { return obj.category_id === 20 })[0]});
  //               // var pack2IdFile = sketch.files.filter(function(obj) { return obj.category_id === 25 }) ?
  //               //     sketch.files.filter(function(obj) { return obj.category_id === 25 }) : [];
  //               // if ( pack2IdFile.length > 0 ) {
  //               //     this.setState({pack2IdFile: pack2IdFile[0]});
  //               // }
  //               this.setState({loaderHidden: true});
  //           } else if (xhr.status === 401) {
  //               sessionStorage.clear();
  //               alert("Время сессии истекло. Пожалуйста войдите заново!");
  //               this.props.history.replace("/login");
  //           }
  //       }.bind(this)
  //       xhr.send();
  //   }

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
        //console.log(sketch);
        this.setState({sketch: sketch});
        this.setState({loaderHidden: true});

        this.setState({personalIdFile: sketch.files.filter(function(obj) {return obj.category_id === 3 })[0]});
        this.setState({apzFile: sketch.files.filter(function(obj) { return obj.category_id === 2 })[0]});
        this.setState({sketchFile: sketch.files.filter(function(obj) { return obj.category_id === 1 })[0]});

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

    printSketch(sketchId, project) {
        var token = sessionStorage.getItem('tokenInfo');
        if (token) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", window.url + "api/print/sketch/" + sketchId, true);
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    //test of IE
                    if (typeof window.navigator.msSaveBlob === "function") {
                        window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
                    } else {
                        var data = JSON.parse(xhr.responseText);
                        var today = new Date();
                        var curr_date = today.getDate();
                        var curr_month = today.getMonth() + 1;
                        var curr_year = today.getFullYear();
                        var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";

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

                        saveByteArray([base64ToArrayBuffer(data.file)], "апз-" + project + formated_date + ".pdf");
                    }
                } else {
                    alert('Не удалось скачать файл');
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


    printSketchAnswer(sketchId, progbarId = null) {
        var token = sessionStorage.getItem('tokenInfo');
        if (token) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", window.url + "api/print/sketch/" + sketchId, true);
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    //test of IE
                    if (typeof window.navigator.msSaveBlob === "function") {
                        window.navigator.msSaveBlob(xhr.response, "Sogl.pdf");
                    } else {
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
                                setTimeout(function() {window.URL.revokeObjectURL(url);},1000);
                            };

                        }());

                        saveByteArray([base64ToArrayBuffer(data.file)], "Sogl.pdf");
                    }
                } else {
                    alert('Не удалось скачать файл');
                }
            }
            xhr.send();
        } else {
            console.log('Время сессии истекло.');
        }
    }

  // downloadFile(id) {
  //   var token = sessionStorage.getItem('tokenInfo');
  //   var url = window.url + 'api/file/download/' + id;
  //
  //   var xhr = new XMLHttpRequest();
  //   xhr.open("get", url, true);
  //     xhr.setRequestHeader("Authorization", "Bearer " + token);
  //     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  //     xhr.onload = function() {
  //       if (xhr.status === 200) {
  //         var data = JSON.parse(xhr.responseText);
  //         var base64ToArrayBuffer = (function () {
  //
  //           return function (base64) {
  //             var binaryString =  window.atob(base64);
  //             var binaryLen = binaryString.length;
  //             var bytes = new Uint8Array(binaryLen);
  //
  //             for (var i = 0; i < binaryLen; i++) {
  //               var ascii = binaryString.charCodeAt(i);
  //               bytes[i] = ascii;
  //             }
  //
  //             return bytes;
  //           }
  //
  //         }());
  //
  //         var saveByteArray = (function () {
  //           var a = document.createElement("a");
  //           document.body.appendChild(a);
  //           a.style = "display: none";
  //
  //           return function (data, name) {
  //             var blob = new Blob(data, {type: "octet/stream"}),
  //                 url = window.URL.createObjectURL(blob);
  //             a.href = url;
  //             a.download = name;
  //             a.click();
  //             setTimeout(function() {window.URL.revokeObjectURL(url);},0);
  //           };
  //
  //         }());
  //
  //         saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
  //       } else {
  //         alert('Не удалось скачать файл');
  //       }
  //     }
  //   xhr.send();
  // }

    downloadFile(id, progbarId = null) {
        var token = sessionStorage.getItem('tokenInfo');
        var url = window.url + 'api/file/download/' + id;

        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        var vision = $('.text-info[data-category='+progbarId+']');
        var progressbar = $('.progress[data-category='+progbarId+']');
        vision.css('display', 'none');
        progressbar.css('display', 'flex');
        xhr.onprogress = function(event) {
            $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100) + '%');
        }
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
                        setTimeout(function() {
                            window.URL.revokeObjectURL(url);
                            $('div', progressbar).css('width', 0);
                            progressbar.css('display', 'none');
                            vision.css('display','inline');
                            alert("Файлы успешно загружены");
                        },1000);
                    };

                }());

                saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
            } else {
                $('div', progressbar).css('width', 0);
                progressbar.css('display', 'none');
                vision.css('display','inline');
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
                      <React.Fragment>
                        {(file.category_id == 1 || file.category_id == 2 || file.category_id == 3) &&
                          <tr key={index}>
                            <td style={{width: '22%'}}>{file.category.name_ru} </td>
                            <td><a className="text-info pointer" data-category={file.id} onClick={this.downloadFile.bind(this, file.id, file.id)}>Скачать</a>
                              <div className="progress mb-2" data-category={file.id} style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </td>
                          </tr>}
                        </React.Fragment>
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


                {/*{this.state.responseFile &&*/}
                  <table className="table table-bordered table-striped">
                    <tbody>
                    {sketch.urban_response &&
                    <table className="table table-bordered">
                        <tbody>
                        <tr>
                            <td style={{width: '22%'}}><b>Согласование</b></td>
                            <td><a className="text-info pointer"
                                   onClick={this.printSketchAnswer.bind(this, sketch.id)}>Скачать</a></td>
                        </tr>
                        </tbody>
                    </table>
                    }
                      {sketch.status_id === 2 ?
                        <tr>


                            {/*<td style={{width: '22%'}}><b>Решение на эскизный проект</b></td>*/}
                          {/*<td><a className="text-info pointer" data-category="45" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 45)}>Скачать</a>*/}
                              {/*<div className="progress mb-2" data-category="45" style={{height: '20px', display: 'none', marginTop:'5px'}}>*/}
                                  {/*<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                              {/*</div>*/}
                          {/*</td>*/}
                        </tr>
                        :
                        <tr>
                          <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                          <td><a className="text-info pointer" data-category="46" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 46)}>Скачать</a>
                              <div className="progress mb-2" data-category="46" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                {/*}*/}
              </div>
            }

            {sketch.state_history.length > 0 &&
              <div>
                <h5 className="block-title-2 mb-3 mt-3">Логи</h5>
                <div className="border px-3 py-2">
                  {sketch.state_history.map(function(state, index) {
                    if(state.state_id == 21){
                      return(
                        <div key={index}>
                          <p className="mb-0">{state.created_at}&emsp;{state.state.name} {state.receiver && '('+state.receiver+')'}</p>
                        </div>
                      );
                    }else{
                      return(
                        <div key={index}>
                          <p className="mb-0">{state.created_at}&emsp;{state.state.name}</p>
                        </div>
                      );
                    }
                  }.bind(this))}
                </div>
              </div>
            }

            <div className="col-sm-12">
              <hr />
              <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
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
          customer:'',
          address:'',
          phone:'',
          projectName:'',
          projectAddress:'',
          landArea:'',
          coverArea:'',
          greenArea:'',
          objectLevel:'',
          commonArea:'',
          buildArea:'',
          objectType:'',
          basementFacade:'',
          basementColor:'',
          wallsFacade:'',
          wallsColor:'',
          region: 'Наурызбай',
          categoryFiles: [],
          // hasCoordinates:false,
          personalIdFile: null,
          sketchFile: null,
          apzFile:null,
          additionalFile: '',
          paymentPhotoFile: '',
          survey: null,
          claimedCapacityJustification: null,
          loaderHidden : true,
          aktNumber: '',
          objectPyaten: '',
          objectCarpark: '',
          objectDOU: '',
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
      this.onAreaCheck=this.onAreaCheck.bind(this);
      this.selectFile = this.selectFile.bind(this);
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

  onAreaCheck(e){
      const name =e.target.name;
      const value=e.target.value;
      var check=value>0?this.setState({[name]:value}):alert("error");
  }



  downloadFile(id, progbarId = null) {
        var token = sessionStorage.getItem('tokenInfo');
        var url = window.url + 'api/file/download/' + id;

        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        var vision = $('.text-info[data-category='+progbarId+']');
        var progressbar = $('.progress[data-category='+progbarId+']');
        vision.css('display', 'none');
        progressbar.css('display', 'flex');
        xhr.onprogress = function(event) {
            $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100) + '%');
        }
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
                        setTimeout(function() {
                            window.URL.revokeObjectURL(url);
                            $('div', progressbar).css('width', 0);
                            progressbar.css('display', 'none');
                            vision.css('display','inline');
                            alert("Файлы успешно загружены");
                        },1000);
                    };

                }());

                saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
            } else {
                $('div', progressbar).css('width', 0);
                progressbar.css('display', 'none');
                vision.css('display','inline');
                alert('Не удалось скачать файл');
            }
        }
        xhr.send();
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

              case 2:
                this.setState({apzFile: data});
                break;

              case 1:
                this.setState({sketchFile: data});
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

  selectFile(e) {
    var fileName = e.target.dataset.name;
    var id = e.target.dataset.id;
    var category = e.target.dataset.category;
    var data = {id: id, name: fileName};

    switch (category) {
      case '3':
        this.setState({personalIdFile: data});
        break;

      case '1':
        this.setState({sketchFile: data});
        break;

      case '2':
        this.setState({apzFile: data});
        break;
    }

    $('#selectFileModal').modal('hide');
  }


    componentWillMount() {
        if (this.props.match.params.id) {
            this.getSketchInfo();
        }
    }

    getSketchInfo() {
    this.setState({loaderHidden: false});

    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/sketch/citizen/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
        if (xhr.status === 200) {
            var sketch = JSON.parse(xhr.responseText);

            this.setState({applicant: sketch.applicant ? sketch.applicant : '' });
            this.setState({address: sketch.address ? sketch.address : '' });
            this.setState({phone: sketch.phone ? sketch.phone : '' });
            this.setState({region: sketch.region ? sketch.region : '' });
            this.setState({designer: sketch.designer ? sketch.designer : '' });
            this.setState({type: sketch.type ? sketch.type : '' });
            this.setState({projectName: sketch.project_name ? sketch.project_name : '' });
            this.setState({projectAddress: sketch.project_address ? sketch.project_address : '' });
            // this.setState({projectAddressCoordinates: sketch.project_address_coordinates ? sketch.project_address_coordinates : '' });
            // this.setState({hasCoordinates: sketch.project_address_coordinates ? true : false });

            this.setState({personalIdFile: sketch.files.filter(function(obj) { return obj.category_id === 3 })[0]});
            this.setState({apzFile: sketch.files.filter(function(obj) { return obj.category_id === 2 })[0]});
            this.setState({sketchFile: sketch.files.filter(function(obj) { return obj.category_id === 1 })[0]});

            this.setState({objectType: sketch.object_type ? sketch.object_type : '' });
            this.setState({objectPyaten: sketch.object_pyaten ? sketch.object_pyaten : '' });
            this.setState({objectCarpark: sketch.object_carpark ? sketch.object_carpark : '' });
            this.setState({objectDOU: sketch.object_dou ? sketch.object_dou : '' });
            this.setState({customer: sketch.customer ? sketch.customer : '' });
            // this.setState({cadastralNumber: sketch.cadastral_number ? sketch.cadastral_number : '' });
            this.setState({objectTerm: sketch.object_term ? sketch.object_term : '' });
            this.setState({objectLevel: sketch.object_level ? sketch.object_level : '' });
            this.setState({commonArea: sketch.common_area ? sketch.common_area : '' });
            this.setState({buildArea: sketch.build_area ? sketch.build_area : '' });
            this.setState({aktNumber: sketch.akt_number ? sketch.akt_number: '' });
            this.setState({landArea: sketch.land_area ? sketch.land_area : '' });
            this.setState({coverArea: sketch.cover_area ? sketch.cover_area : '' });
            this.setState({greenArea: sketch.green_area ? sketch.green_area : '' });
            this.setState({basementFacade: sketch.basement_facade ? sketch.basement_facade : '' });
            this.setState({basementColor: sketch.basement_color ? sketch.basement_color : '' });
            this.setState({wallsFacade: sketch.walls_facade ? sketch.walls_facade : '' });
            this.setState({wallsColor: sketch.walls_color ? sketch.walls_color : '' });

        }

        this.setState({loaderHidden: true});
    }.bind(this)
    xhr.send();
}


  saveApz(publish,e) {
    e.preventDefault();

    if (publish) {
      var requiredFields = {
      };

      if(this.state.objectType == 'МЖК'){
        requiredFields['objectLevel'] = 'Этажность';
        requiredFields['objectRooms'] = 'Количество квартир (номеров, кабинетов)';
        requiredFields['objectPyaten'] = 'Количество пятен';
        requiredFields['objectCarpark'] = 'Количество парковочных мест';
        requiredFields['objectDOU'] = 'Количество мест в детское дошкольное учреждение и детский сад';
      }
      var errors = 0;
      var err_msgs = "";
      Object.keys(requiredFields).forEach(function(key){
        if (!this.state[key]) {
          err_msgs += 'Заполните поле ' + requiredFields[key] + '\n';
          errors++;
          return false;
        }
      }.bind(this));

      if (errors > 0) {
        alert(err_msgs);
        return false;
      }
    }

    var sketchId = this.props.match.params.id;
    var link = sketchId > 0 ? ("api/sketch/citizen/save/" + sketchId) : "api/sketch/citizen/save";

    var data={
        publish:publish?true:false
    }

      Object.keys(this.state).forEach(function(k) {
          data[k] = this.state[k]
      }.bind(this));

      this.setState({loaderHidden: false});
      console.log(data);
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + link, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
          this.setState({loaderHidden: true});

          if (xhr.status === 200) {
              var data = JSON.parse(xhr.responseText);

              if (publish) {
                  alert("Заявка успешно подана.\nЗаявка будет рассматриваться завтра.");
                  this.props.history.replace('/panel/citizen/sketch');
              } else {
                  alert('Заявка успешно сохранена');

                  if (!sketchId) {
                      this.props.history.push('/panel/citizen/sketch/edit/' + data.id);
                  }
              }
          } else {
              alert("При сохранении заявки произошла ошибка!"+xhr.status);
          }
      }.bind(this);
      xhr.send(JSON.stringify(data));


    // var formData = $('#sketch-form').serializeJSON();
    //
    // $.ajax({
    //   type: 'POST',
    //   url: window.url + 'api/sketch/citizen/create',
    //   contentType: 'application/json; charset=utf-8',
    //   beforeSend: function (xhr) {
    //     xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
    //   },
    //   data: JSON.stringify(formData),
    //   success: function (data) {
    //     this.resetForm();
    //     alert("Заявка отправлена");
    //   }.bind(this)
    // });
  };

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
                            <a className="nav-link" id="tab1-link" data-toggle="pill" href="#tab1" role="tab" aria-controls="tab1" aria-selected="false">Показатели по генеральному плану <span id="tabIcon"></span></a>
                            <a className="nav-link" id="tab2-link" data-toggle="pill" href="#tab2" role="tab" aria-controls="tab2" aria-selected="false">Показатели по проекту<span id="tabIcon"></span></a>
                            <a className="nav-link" id="tab3-link" data-toggle="pill" href="#tab3" role="tab" aria-controls="tab3" aria-selected="false">Архитектурные решения по отделки фасада здания и сооружения<span id="tabIcon"></span></a>
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
                                                <label htmlFor="address">Адрес жительства:</label>
                                                <input data-rh="Адрес жительства" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} name="address" value={this.state.address} required />
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
                                                <input data-rh="Адрес проектируемого объекта" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.projectAddress} name="projectAddress" />
                                                <div className="row coordinates_block pt-0">
                                                    {/*<div className="col-md-6">*/}
                                                        {/*<input data-rh="Адрес проектируемого объекта" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.projectAddress} name="projectAddress" />*/}
                                                        {/*<input type="hidden" onChange={this.onInputChange} value={this.state.projectAddressCoordinates} id="ProjectAddressCoordinates" name="projectAddressCoordinates" />*/}
                                                    {/*</div>*/}
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
                                                <label>Эскиз (эскизный проект)</label>
                                                <div className="file_container">
                                                    <div className="progress mb-2" data-category="1" style={{height: '20px', display: 'none'}}>
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>

                                                    {this.state.sketchFile &&
                                                    <div className="file_block mb-2">
                                                        <div>
                                                            {this.state.sketchFile.name}
                                                            <a className="pointer" onClick={(e) => this.setState({sketchFile: false}) }>×</a>
                                                        </div>
                                                    </div>
                                                    }

                                                    <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                                        <label htmlFor="SketchFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                                        <input type="file" id="SketchFile" name="SketchFile" className="form-control" onChange={this.uploadFile.bind(this, 1)} style={{display: 'none'}} />
                                                        <label onClick={this.selectFromList.bind(this, 1)} className="btn btn-info btn-sm">Выбрать из списка</label>
                                                    </div>
                                                    <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Архитектурно-планировочное задание (копия)</label>
                                                <div className="file_container">
                                                    <div className="progress mb-2" data-category="2" style={{height: '20px', display: 'none'}}>
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>

                                                    {this.state.apzFile &&
                                                    <div className="file_block mb-2">
                                                        <div>
                                                            {this.state.apzFile.name}
                                                            <a className="pointer" onClick={(e) => this.setState({apzFile: false}) }>×</a>
                                                        </div>
                                                    </div>
                                                    }

                                                    <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                                        <label htmlFor="ApzFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                                        <input type="file" id="ApzFile" name="ApzFile" className="form-control" onChange={this.uploadFile.bind(this, 2)} style={{display: 'none'}} />
                                                        <label onClick={this.selectFromList.bind(this, 2)} className="btn btn-info btn-sm">Выбрать из списка</label>
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
                                                <div className="form-group">
                                                    <label htmlFor="landArea">Площадь земельного участка(га):</label>
                                                    <input data-rh="Площадь земельного участка(га)" data-rh-at="right" type="number" min="0" className="form-control" onChange={this.onInputChange} value={this.state.landArea} name="landArea" placeholder="" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="form-group">
                                                    <label htmlFor="coverArea">Площадь покрытия (м<sup>2</sup>):</label>
                                                    <input data-rh="Площадь покрытия(кв.м)" data-rh-at="right" type="number" min="0" className="form-control" onChange={this.onInputChange} value={this.state.coverArea} name="coverArea" placeholder="" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="GreenArea">Площадь озеленения (м<sup>2</sup>):</label>
                                                <input data-rh="Площадь озеленения (кв.м)" data-rh-at="right" type="number" min={0} step="any" className="form-control" name="greenArea" onChange={this.onInputChange} value={this.state.greenArea} />
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
                                    <div className="row">
                                        <div className="col-md-6">
                                            {/*<div className="form-group">
                                                <div className="form-group">
                                                    <label htmlFor="ObjectType">Тип объекта:</label>
                                                    <input data-rh="Тип объекта" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.objectType} name="objectType" placeholder="" />
                                                    <small>Пример: строительства индивидуального жилого дома со сносом существующего жилого дома</small>
                                                </div>
                                            </div>*/}
                                            <div className="form-group">
                                              <label htmlFor="ObjectType">Тип объекта:</label>
                                              <select required className="form-control" name="objectType" id="ObjectType" onChange={this.onInputChange} value={this.state.objectType}>
                                                <option value="null" disabled>Выберите тип объекта</option>
                                                <option>ИЖС</option>
                                                <option>МЖК Общественное задание</option>
                                                <option>МЖК Производственное задание</option>
                                                <option>Реконструкция (перепланировка в т.ч)</option>
                                              </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="CommonArea">Общая площадь (м<sup>2</sup>):</label>
                                                <input data-rh="Общая площадь" data-rh-at="right" type="number" min="0" name="commonArea" onChange={this.onInputChange} value={this.state.commonArea} className="form-control" id="commonArea" placeholder="" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="ObjectLevel">Этажность :</label>
                                                <input data-rh="Этажность" data-rh-at="right" type="number" min="0" className="form-control" onChange={this.onInputChange} value={this.state.objectLevel} name="objectLevel" placeholder="" />
                                            </div>
                                            {(this.state.objectType == 'МЖК Общественное задание' || this.state.objectType == 'МЖК Производственное задание') &&
                                              <React.Fragment>
                                              <div className="form-group">
                                                <label htmlFor="objectPyaten">Количество пятен</label>
                                                <input data-rh="Количество пятен" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.objectPyaten} name="objectPyaten" />
                                              </div>
                                              <div className="form-group">
                                                <label htmlFor="objectCarpark">Количество парковочных мест</label>
                                                <input data-rh="Количество парковочных мест" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.objectCarpark} name="objectCarpark" />
                                              </div>
                                              <div className="form-group">
                                                <label htmlFor="objectDOU">Количество мест в детское дошкольное учреждение и детский сад</label>
                                                <input data-rh="Количество мест в детское дошкольное учреждение и детский сад" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.objectDOU} name="objectDOU" />
                                              </div>
                                              </React.Fragment>
                                            }
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="ObjectTerm">Срок строительства по нормам :</label>
                                                <input data-rh="Срок строительства по нормам" data-rh-at="right" type="text" name="objectTerm" onChange={this.onInputChange} value={this.state.objectTerm} className="form-control" id="ObjectTerm" placeholder="" />
                                            </div>
                                            <div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="BuildArea">Площадь застройки (м<sup>2</sup>):</label>
                                                <input data-rh="Площадь застройки" data-rh-at="right" type="number" min="0" name="buildArea" onChange={this.onInputChange} value={this.state.buildArea} className="form-control" id="buildArea" placeholder="" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="AktNumber">№ акта на право частной собственности:</label>
                                                <input data-rh="№ акта на право частной собственности " data-rh-at="right" type="text" name="aktNumber" onChange={this.onInputChange} value={this.state.aktNumber} className="form-control" id="aktNumber" placeholder="№XXXXXXX от dd.mm.YYY" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                                    </div>
                                </form>
                                <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                            </div>
                            <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-link">
                                <form id="tab3-form" data-tab="3" onSubmit={this.saveApz.bind(this, false)}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="BasementFacade">Цоколь здания (облицовка):</label>
                                                <input data-rh="Облицовка" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.basementFacade} name="basementFacade" placeholder="" />
                                                <small>Пример: облицовочная плитка</small>
                                            </div>
                                            <div className="form-group">
                                            <label htmlFor="WallsFacade">Стены здания (облицовка):</label>
                                                <input data-rh="Облицовка" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.wallsFacade} name="wallsFacade" placeholder="" />
                                                <small>Пример: штукатурка</small>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="BasementColor">Цоколь здания (цвет):</label>
                                                <input data-rh="Цвет" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.basementColor} name="basementColor" placeholder="" />
                                            </div>
                                            <br></br>
                                            <div className="form-group">
                                                <label htmlFor="WallsColor">Стены здания (цвет):</label>
                                                <input data-rh="Цвет" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.wallsColor} name="wallsColor" placeholder="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                                    </div>
                                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                                </form>
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
                <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
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
