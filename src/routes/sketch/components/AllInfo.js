import React from 'react';
import {Switch} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import ReactQuill from 'react-quill';

export default class AllInfo extends React.Component {
    constructor(props){
      super(props);
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

    downloadFile(id, progbarId = null) {
        var token = sessionStorage.getItem('tokenInfo');

        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + 'api/file/download/' + id, true);
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

    render() {
        return (
          <React.Fragment>
          <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

          <table className="table table-bordered table-striped">
              <tbody>
              <tr>
                  <td style={{width: '22%'}}><b>ИД заявки</b></td>
                  <td>{this.props.sketch.id}</td>
              </tr>
              <tr>
                  <td><b>Заявитель</b></td>
                  <td>{this.props.sketch.applicant}</td>
              </tr>
              <tr>
                  <td><b>Телефон</b></td>
                  <td>{this.props.sketch.phone}</td>
              </tr>
              <tr>
                  <td><b>Заказчик</b></td>
                  <td>{this.props.sketch.customer}</td>
              </tr>
              <tr>
                  <td><b>Проектировщик</b></td>
                  <td>{this.props.sketch.designer}</td>
              </tr>
              <tr>
                  <td><b>Главный архитектор проекта</b></td>
                  <td>{this.props.sketch.urbanId}</td>
              </tr>
              <tr>
                  <td><b>Название проекта</b></td>
                  <td>{this.props.sketch.project_name}</td>
              </tr>
              <tr>
                  <td><b>Адрес проектируемого объекта</b></td>
                  <td>
                      {this.props.sketch.project_address}

                      {this.props.sketch.project_address_coordinates &&
                      <a className="ml-2 pointer text-info" onClick={this.toggleMap.bind(this, true)}>Показать на карте</a>
                      }
                  </td>
              </tr>
              <tr>
                  <td><b>Дата заявления</b></td>
                  <td>{this.props.sketch.created_at && this.toDate(this.props.sketch.created_at)}</td>
              </tr>

              {this.props.personalIdFile &&
              <tr>
                  <td><b>Уд. лич./ Реквизиты</b></td>
                  <td><a className="text-info pointer" data-category="1" onClick={this.downloadFile.bind(this, this.props.personalIdFile.id, 1)}>Скачать</a>
                      <div className="progress mb-2" data-category="1" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                  </td>
              </tr>
              }

              {this.props.sketchFile &&
              <tr>
                  <td><b>Эскизный проект</b></td>
                  <td><a className="text-info pointer" data-category="2" onClick={this.downloadFile.bind(this, this.props.sketchFile.id, 2)}>Скачать</a>
                      <div className="progress mb-2" data-category="2" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                  </td>
              </tr>
              }

              {this.props.apzFile &&
              <tr>
                  <td><b>АПЗ</b></td>
                  <td><a className="text-info pointer" data-category="3" onClick={this.downloadFile.bind(this, this.props.apzFile.id, 3)}>Скачать</a>
                      <div className="progress mb-2" data-category="3" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                  </td>
              </tr>
              }
              {this.props.sketchFilePDF &&
              <tr>
                  <td><b>Эскизный проект(PDF)</b></td>
                  <td><a className="text-info pointer" data-category="4" onClick={this.downloadFile.bind(this, this.props.sketchFilePDF.id, 4)}>Скачать</a>
                      <div className="progress mb-2" data-category="4" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                  </td>
              </tr>
              }

              </tbody>
          </table>

          <h5 className="block-title-2 mb-3">Показатели</h5>

          <table className="table table-bordered table-striped">
              <tbody>
              {this.props.sketch &&
              <tr>
                  <td style={{width: '40%'}}><b>Показатели по ген плану</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#gen_modal">Просмотр</a></td>
              </tr>
              }

              {this.props.sketch &&
              <tr>
                  <td style={{width: '40%'}}><b>Показатели по проекту</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#project_modal">Просмотр</a></td>
              </tr>
              }

              {this.props.sketch &&
              <tr>
                  <td style={{width: '40%'}}><b>Архитектурные решения по отделки фасада здания и сооружения</b></td>
                  <td><a className="text-info pointer" data-toggle="modal" data-target="#architect_modal">Просмотр</a></td>
              </tr>
              }
              </tbody>
          </table>

          {this.props.sketch &&
          <div className="modal fade" id="gen_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                  <div className="modal-content">
                      <div className="modal-header">
                          <h5 className="modal-title">Показатели по ген плану</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div className="modal-body">
                          <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                              <tbody>
                              <tr>
                                  <td style={{width: '70%'}}>Площадь земельного участка (га)</td>
                                  <td>{this.props.sketch.land_area}</td>
                              </tr>
                              <tr>
                                  <td>Площадь покрытия (м<sup>2</sup>)</td>
                                  <td>{this.props.sketch.cover_area}</td>
                              </tr>
                              <tr>
                                  <td>Площадь озеленения (м<sup>2</sup>)</td>
                                  <td>{this.props.sketch.green_area}</td>
                              </tr>
                              </tbody>
                          </table>
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                      </div>
                  </div>
              </div>
          </div>
          }

          {this.props.sketch &&
          <div className="modal fade" id="project_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                  <div className="modal-content">
                      <div className="modal-header">
                          <h5 className="modal-title">Показатели по проекту</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div className="modal-body">
                          <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                              <tbody>
                              <tr>
                                  <td style={{width: '70%'}}>Этажность</td>
                                  <td>{this.props.sketch.object_level}</td>
                              </tr>
                              <tr>
                                  <td>Общая площадь(м<sup>2</sup>)</td>
                                  <td>{this.props.sketch.common_area}</td>
                              </tr>
                              <tr>
                                  <td>Площадь застройки(м<sup>2</sup>)</td>
                                  <td>{this.props.sketch.build_area}</td>
                              </tr>
                              <tr>
                                  <td>Тип проекта</td>
                                  <td>{this.props.sketch.object_type}</td>
                              </tr>
                              <tr>
                                  <td>Сроки строительства</td>
                                  <td>{this.props.sketch.object_term}</td>
                              </tr>
                              {(this.props.sketch.object_type == 'МЖК Общественное задание' || this.props.sketch.object_type == 'МЖК Производственное задание') &&
                                <React.Fragment>
                                <tr>
                                  <td>Количество пятен</td>
                                  <td>{this.props.sketch.object_pyaten}</td>
                                  </tr>
                                <tr>
                                  <td>Количество парковочных мест</td>
                                  <td>{this.props.sketch.object_carpark}</td>
                                </tr>
                                <tr>
                                  <td>Количество мест в детское дошкольное учреждение и детский сад</td>
                                  <td>{this.props.sketch.object_dou}</td>
                                </tr>
                                </React.Fragment>
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
          }
          
          {this.props.sketch &&
          <div className="modal fade" id="architect_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                  <div className="modal-content">
                      <div className="modal-header">
                          <h5 className="modal-title">Архитектурные решения по отделки фасада здания и сооружения</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div className="modal-body">
                          <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                              <tbody>
                              <tr>
                                  <td style={{width: '70%'}}>Цоколь здания(фасад)</td>
                                  <td>{this.props.sketch.basement_facade}</td>
                              </tr>
                              <tr>
                                  <td>Цоколь здания(цвет)</td>
                                  <td>{this.props.sketch.basement_color}</td>
                              </tr>
                              <tr>
                                  <td>Стены здания(фасад)</td>
                                  <td>{this.props.sketch.walls_facade}</td>
                              </tr>
                              <tr>
                                  <td>Стены здания(цвет)</td>
                                  <td>{this.props.sketch.walls_color}</td>
                              </tr>
                              </tbody>
                          </table>
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                      </div>
                  </div>
              </div>
          </div>
          }
          </React.Fragment>
        )
    }
}
