import React from 'react';
import {NavLink} from 'react-router-dom';
import $ from 'jquery';
import saveAs from 'file-saver';

export default class AllInfo extends React.Component {
    constructor(props) {
      super(props);
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
          $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100, 10) + '%');
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

    downloadAllFile(id) {
      var token = sessionStorage.getItem('tokenInfo');

      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + 'api/file/downloadAll/' + id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        var progressbar = $('.progress[data-category=101]');
        var vision = $('.text-info[data-category=101]');
        progressbar.css('display', 'flex');
        vision.css('display', 'none');
        xhr.onprogress = function(event) {
          $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100, 10) + '%');
        }
        xhr.onload = function() {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            //console.log(data.my_files[0]);return;
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

            var JSZip = require("jszip");
            var zip = new JSZip();
            for(var i=0; i<data.my_files.length;i++){
              zip.file(i+'_'+data.my_files[i].file_name, base64ToArrayBuffer(data.my_files[i].file), {binary:true});
            }
            zip.generateAsync({type:"blob"})
            .then(function (content) {
                // see FileSaver.js
                saveAs(content, data.zip_name);
            });
            setTimeout(function() {
              progressbar.css('display', 'none');
              vision.css('display', 'inline');
              alert("Файлы успешно загружены");
              $('div', progressbar).css('width', 0);
            }, '1000');
          } else {
            progressbar.css('display', 'none');
            vision.css('display', 'inline');
            alert("Файлы успешно загружены");
            $('div', progressbar).css('width', 0);
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
      var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
      var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
      var curr_year = jDate.getFullYear();
      var curr_hour = jDate.getHours() < 10 ? "0" + jDate.getHours() : jDate.getHours();
      var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
      var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;

      return formated_date;
    }

    printQuestionnaire() {
      var id = this.props.match.params.id;
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/questionnaire/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var newWin = window.open("");
          newWin.document.write(xhr.responseText);
          newWin.print();
          newWin.close();
        }
      }
      xhr.send();
    }

    printData(){
       var divToPrint=document.getElementById("printTable");
       var divToPrints=document.getElementById("detail_table");
       var newWin= window.open("");


       newWin.document.write(divToPrint.outerHTML + divToPrints.outerHTML);
        var elements = newWin.document.getElementsByClassName('shukichi');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
       newWin.print();
       newWin.close();
    }

    render() {
      return (
            <div>
              <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

              <table className="table table-bordered table-striped" id="printTable">
                <tbody>
                  <tr>
                    <td style={{width: '22%'}}><b>ИД заявки</b></td>
                    <td>{this.props.apz.id}</td>
                  </tr>
                  <tr>
                    <td><b>Заявитель</b></td>
                    <td>
                      {this.props.apz.applicant}
                      <NavLink style={{marginLeft:'5px'}} exact className="btn btn-raised btn-primary btn-sm" to={"/panel/apz/all_history/"+this.props.apz.user_id+"/1"}>История заявлений</NavLink>
                    </td>
                  </tr>
                  <tr>
                    <td><b>Телефон</b></td>
                    <td>{this.props.apz.phone}</td>
                  </tr>
                  <tr>
                    <td><b>Заказчик</b></td>
                    <td>{this.props.apz.customer}</td>
                  </tr>
                  <tr>
                    <td><b>Разработчик</b></td>
                    <td>{this.props.apz.designer}</td>
                  </tr>
                  <tr>
                    <td><b>Название проекта</b></td>
                    <td>{this.props.apz.project_name}</td>
                  </tr>
                  <tr>
                    <td><b>Адрес проектируемого объекта</b></td>
                    <td>
                      {this.props.apz.project_address}

                      {this.props.apz.project_address_coordinates &&
                        <a className="ml-2 pointer text-info" onClick={this.props.toggleMap}>Показать на карте</a>
                      }
                    </td>
                  </tr>
                  <tr>
                    <td><b>Дата заявления</b></td>
                    <td>{this.props.apz.created_at && this.toDate(this.props.apz.created_at)}</td>
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

                  {this.props.confirmedTaskFile &&
                    <tr>
                      <td><b>Утвержденное задание</b></td>
                      <td><a className="text-info pointer" data-category="2" onClick={this.downloadFile.bind(this, this.props.confirmedTaskFile.id, 2)}>Скачать</a>
                        <div className="progress mb-2" data-category="2" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.props.titleDocumentFile &&
                    <tr>
                      <td><b>Правоустанавл. документ</b></td>
                      <td><a className="text-info pointer" data-category="3" onClick={this.downloadFile.bind(this, this.props.titleDocumentFile.id, 3)}>Скачать</a>
                        <div className="progress mb-2" data-category="3" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.props.additionalFile &&
                    <tr>
                      <td><b>Дополнительно</b></td>
                      <td><a className="text-info pointer" data-category="4" onClick={this.downloadFile.bind(this, this.props.additionalFile.id, 4)}>Скачать</a>
                        <div className="progress mb-2" data-category="4" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }
                  {(this.props.personalIdFile || this.props.confirmedTaskFile || this.props.titleDocumentFile || this.props.additionalFile) &&
                    <tr className="shukichi">
                      <td colSpan="2"><a className="text-info pointer" data-category="101" onClick={this.downloadAllFile.bind(this, this.props.apz.id)}><img style={{height:'16px'}} src="/images/download.png" alt="download"/>Скачать одним архивом</a>
                        <div className="progress mb-2" data-category="101" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>

              <h5 className="block-title-2 mb-3">Службы</h5>


              <table className="table table-bordered table-striped">
                <tbody>
                  {!!this.props.apz.need_water_provider && this.props.apz.apz_water &&
                    <tr>
                      <td style={{width: '40%'}}><b>Водоснабжение</b></td>
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#water_modal">Просмотр</a></td>
                    </tr>
                  }

                  {!!this.props.apz.need_heat_provider && this.props.apz.apz_heat &&
                    <tr>
                      <td style={{width: '40%'}}><b>Теплоснабжение</b></td>
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#heat_modal">Просмотр</a></td>
                    </tr>
                  }

                  {!!this.props.apz.need_electro_provider && this.props.apz.apz_electricity &&
                    <tr>
                      <td style={{width: '40%'}}><b>Электроснабжение</b></td>
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#electro_modal">Просмотр</a></td>
                    </tr>
                  }

                  {!!this.props.apz.need_gas_provider && this.props.apz.apz_gas &&
                    <tr>
                      <td style={{width: '40%'}}><b>Газоснабжение</b></td>
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#gas_modal">Просмотр</a></td>
                    </tr>
                  }

                  {!!this.props.apz.need_phone_provider && this.props.apz.apz_phone &&
                    <tr>
                      <td style={{width: '40%'}}><b>Телефонизация</b></td>
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#phone_modal">Просмотр</a></td>
                    </tr>
                  }
                </tbody>
              </table>

              {this.props.apz.apz_water &&
                <div className="modal fade" id="water_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Водоснабжение</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                          <tbody>
                            <tr>
                              <td style={{width: '70%'}}>Общая потребность (м<sup>3</sup>/сутки)</td>
                              <td>{this.props.apz.apz_water.requirement}</td>
                            </tr>
                            <tr>
                              <td>Общая потребность питьевой воды (м<sup>3</sup>/час)</td>
                              <td>{this.props.apz.apz_water.requirement_hour}</td>
                            </tr>
                            <tr>
                              <td>Общая потребность (л/сек макс)</td>
                              <td>{this.props.apz.apz_water.requirement_sec}</td>
                            </tr>
                            <tr>
                              <td>Хозпитьевые нужды (м<sup>3</sup>/сутки)</td>
                              <td>{this.props.apz.apz_water.drinking}</td>
                            </tr>
                            <tr>
                              <td>Хозпитьевые нужды (м<sup>3</sup>/час)</td>
                              <td>{this.props.apz.apz_water.drinking_hour}</td>
                            </tr>
                            <tr>
                              <td>Хозпитьевые нужды (л/сек макс)</td>
                              <td>{this.props.apz.apz_water.drinking_sec}</td>
                            </tr>
                            <tr>
                              <td>Производственные нужды (м<sup>3</sup>/сутки)</td>
                              <td>{this.props.apz.apz_water.production}</td>
                            </tr>
                            <tr>
                              <td>Производственные нужды (м<sup>3</sup>/час)</td>
                              <td>{this.props.apz.apz_water.production_hour}</td>
                            </tr>
                            <tr>
                              <td>Производственные нужды (л/сек макс)</td>
                              <td>{this.props.apz.apz_water.production_sec}</td>
                            </tr>
                            <tr>
                              <td>Расходы пожаротушения (л/сек наружное)</td>
                              <td>{this.props.apz.apz_water.fire_fighting}</td>
                            </tr>
                            <tr>
                              <td>Расходы пожаротушения (л/сек внутреннее)</td>
                              <td>{this.props.apz.apz_water.fire_fighting}</td>
                            </tr>
                          </tbody>
                        </table>

                        {this.props.apz.apz_sewage &&
                          <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                            <tbody>
                              <tr>
                                <td style={{width: '70%'}}>Общее количество сточных вод (м<sup>3</sup>/сутки)</td>
                                <td>{this.props.apz.apz_sewage.amount}</td>
                              </tr>
                              <tr>
                                <td>Общее количество сточных вод (м<sup>3</sup>/час макс)</td>
                                <td>{this.props.apz.apz_sewage.amount_hour}</td>
                              </tr>
                              <tr>
                                <td>Фекальных (м<sup>3</sup>/сутки)</td>
                                <td>{this.props.apz.apz_sewage.feksal}</td>
                              </tr>
                              <tr>
                                <td>Фекальных (м<sup>3</sup>/час макс)</td>
                                <td>{this.props.apz.apz_sewage.feksal_hour}</td>
                              </tr>
                              <tr>
                                <td>Производственно-загрязненных (м<sup>3</sup>/сутки)</td>
                                <td>{this.props.apz.apz_sewage.production}</td>
                              </tr>
                              <tr>
                                <td>Производственно-загрязненных (м<sup>3</sup>/час макс)</td>
                                <td>{this.props.apz.apz_sewage.production_hour}</td>
                              </tr>
                              <tr>
                                <td>Условно-чистых сбрасываемых на городскую сеть (м<sup>3</sup>/сутки)</td>
                                <td>{this.props.apz.apz_sewage.to_city}</td>
                              </tr>
                              <tr>
                                <td>Условно-чистых сбрасываемых на городскую сеть (м<sup>3</sup>/час макс)</td>
                                <td>{this.props.apz.apz_sewage.to_city_hour}</td>
                              </tr>
                            </tbody>
                          </table>
                        }
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {this.props.apz.apz_heat &&
                <div className="modal fade" id="heat_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Теплоснабжение</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <table className="table table-bordered table-striped">
                          <tbody>
                            <tr>
                              <td style={{width: '70%'}}>Общая нагрузка (Гкал/ч)</td>
                              <td>{this.props.apz.apz_heat.general}</td>
                            </tr>
                            <tr>
                              <td>Отопление (Гкал/ч)</td>
                              <td>{this.props.apz.apz_heat.main_heat}</td>
                            </tr>
                            <tr>
                              <td>Вентиляция (Гкал/ч)</td>
                              <td>{this.props.apz.apz_heat.main_ven}</td>
                            </tr>
                            <tr>
                              <td>Горячее водоснабжение, ср (Гкал/ч)</td>
                              <td>{this.props.apz.apz_heat.main_water}</td>
                            </tr>
                            <tr>
                              <td>Горячее водоснабжение, макс (Гкал/ч)</td>
                              <td>{this.props.apz.apz_heat.main_water_max}</td>
                            </tr>
                            <tr>
                              <td>Энергосб. мероприятие</td>
                              <td>{this.props.apz.apz_heat.saving}</td>
                            </tr>
                            <tr>
                              <td>Технолог. нужды(пар) (Т/ч)</td>
                              <td>{this.props.apz.apz_heat.tech}</td>
                            </tr>

                            {this.props.apz.apz_heat.contract_num &&
                              <tr>
                                <td>Номер договора</td>
                                <td>{this.props.apz.apz_heat.contract_num}</td>
                              </tr>
                            }

                            {this.props.apz.apz_heat.general_in_contract &&
                              <tr>
                                <td>Общая тепловая нагрузка по договору (Гкал/ч)</td>
                                <td>{this.props.apz.apz_heat.general_in_contract}</td>
                              </tr>
                            }

                            {this.props.apz.apz_heat.tech_in_contract &&
                              <tr>
                                <td>Технологическая нагрузка(пар) по договору (Гкал/ч)</td>
                                <td>{this.props.apz.apz_heat.tech_in_contract}</td>
                              </tr>
                            }

                            {this.props.apz.apz_heat.main_in_contract &&
                              <tr>
                                <td>Отопление по договору (Гкал/ч)</td>
                                <td>{this.props.apz.apz_heat.main_in_contract}</td>
                              </tr>
                            }

                            {this.props.apz.apz_heat.water_in_contract &&
                              <tr>
                                <td>Горячее водоснабжение по договору (ср/ч)</td>
                                <td>{this.props.apz.apz_heat.water_in_contract}</td>
                              </tr>
                            }

                            {this.props.apz.apz_heat.ven_in_contract &&
                              <tr>
                                <td>Вентиляция по договору (Гкал/ч)</td>
                                <td>{this.props.apz.apz_heat.ven_in_contract}</td>
                              </tr>
                            }

                            {this.props.apz.apz_heat.water_in_contract_max &&
                              <tr>
                                <td>Горячее водоснабжение по договору (макс/ч)</td>
                                <td>{this.props.apz.apz_heat.water_in_contract_max}</td>
                              </tr>
                            }
                          </tbody>
                        </table>

                        {this.props.apz.apz_heat.heatDistribution && this.props.apz.apz_heat.blocks &&
                          <div>
                            <div>Разделение нагрузки</div>
                            {this.props.apz.apz_heat.blocks.map(function(item, index) {
                              return(
                                <div key={index}>
                                  {this.props.apz.apz_heat.blocks.length > 1 &&
                                    <h5 className="block-title-2 mt-4 mb-3">Здание №{index + 1}</h5>
                                  }

                                  <table className="table table-bordered table-striped">
                                    <tbody>
                                      <tr>
                                        <td style={{width: '70%'}}>Отопление (Гкал/ч)</td>
                                        <td>{item.main}</td>
                                      </tr>
                                      <tr>
                                        <td>Вентиляция (Гкал/ч)</td>
                                        <td>{item.ventilation}</td>
                                      </tr>
                                      <tr>
                                        <td>Горячее водоснаб. (ср/ч)</td>
                                        <td>{item.water}</td>
                                      </tr>
                                      <tr>
                                        <td>Горячее водоснаб. (макс/ч)</td>
                                        <td>{item.water_max}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              );
                            })}
                          </div>
                        }
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {this.props.apz.apz_electricity &&
                <div className="modal fade" id="electro_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Электроснабжение</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <table className="table table-bordered table-striped" id="detail_table">
                          <tbody>
                            <tr>
                              <td style={{width: '60%'}}>Требуемая мощность (кВт)</td>
                              <td>{this.props.apz.apz_electricity.required_power}</td>
                            </tr>
                            <tr>
                              <td>Характер нагрузки (фаза)</td>
                              <td>{this.props.apz.apz_electricity.phase}</td>
                            </tr>
                            <tr>
                              <td>Категория (кВт)</td>
                              <td>{this.props.apz.apz_electricity.safety_category}</td>
                            </tr>
                            <tr>
                              <td>Из указ. макс. нагрузки относ. к э-приемникам (кВА)</td>
                              <td>{this.props.apz.apz_electricity.max_load_device}</td>
                            </tr>
                            <tr>
                              <td>Сущ. макс. нагрузка (кВА)</td>
                              <td>{this.props.apz.apz_electricity.max_load}</td>
                            </tr>
                            <tr>
                              <td>Мощность трансформаторов (кВА)</td>
                              <td>{this.props.apz.apz_electricity.allowed_power}</td>
                            </tr>

                            {this.props.claimedCapacityJustification &&
                              <tr>
                                <td>Расчет-обоснование заявленной мощности</td>
                                <td><a className="text-info pointer" data-category="5" onClick={this.downloadFile.bind(this, this.props.claimedCapacityJustification.id, 5)}>Скачать</a>
                                  <div className="progress mb-2" data-category="5" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                  </div>
                                </td>
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
              }

              {this.props.apz.apz_gas &&
                <div className="modal fade" id="gas_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Газоснабжение</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <table className="table table-bordered table-striped">
                          <tbody>
                            <tr>
                              <td style={{width: '60%'}}>Общ. потребность (м<sup>3</sup>/час)</td>
                              <td>{this.props.apz.apz_gas.general}</td>
                            </tr>
                            <tr>
                              <td>На приготов. пищи (м<sup>3</sup>/час)</td>
                              <td>{this.props.apz.apz_gas.cooking}</td>
                            </tr>
                            <tr>
                              <td>Отопление (м<sup>3</sup>/час)</td>
                              <td>{this.props.apz.apz_gas.heat}</td>
                            </tr>
                            <tr>
                              <td>Вентиляция (м<sup>3</sup>/час)</td>
                              <td>{this.props.apz.apz_gas.ventilation}</td>
                            </tr>
                            <tr>
                              <td>Кондиционирование (м<sup>3</sup>/час)</td>
                              <td>{this.props.apz.apz_gas.conditionaer}</td>
                            </tr>
                            <tr>
                              <td>Горячее водоснаб. (м<sup>3</sup>/час)</td>
                              <td>{this.props.apz.apz_gas.water}</td>
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

              {this.props.apz.apz_phone &&
                <div className="modal fade" id="phone_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Телефонизация</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <table className="table table-bordered table-striped">
                          <tbody>
                            <tr>
                              <td style={{width: '60%'}}>Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</td>
                              <td>{this.props.apz.apz_phone.service_num}</td>
                            </tr>
                            <tr>
                              <td>Телефонная емкость</td>
                              <td>{this.props.apz.apz_phone.capacity}</td>
                            </tr>
                            <tr>
                              <td>Планируемая телефонная канализация</td>
                              <td>{this.props.apz.apz_phone.sewage}</td>
                            </tr>
                            <tr>
                              <td>Пожелания заказчика (тип оборудования, тип кабеля и др.)</td>
                              <td>{this.props.apz.apz_phone.client_wishes}</td>
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

            </div>
          )
    }
  }
