import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import Loader from 'react-loader-spinner';
import '../../../assets/css/welcomeText.css';
import ShowMap from './ShowMap';


export default class ShowSketch extends React.Component {
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
