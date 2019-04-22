import React from 'react';
import {NavLink} from 'react-router-dom';
import { withRouter } from 'react-router';
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

    viewOrDownloadFile(id, progbarId = null) {
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
            var extenstion = data.file_name.substring(data.file_name.lastIndexOf('.')+1, data.file_name.length);
            if(extenstion == 'jpg' || extenstion == 'png' || extenstion == 'dwg' || extenstion == 'tiff'){
              // var image = new Image();
              // image.src = "data:image/jpg;base64," + data.file;
              // var w = window.open("");
              // w.document.write(image.outerHTML);

              var image = new Image();
              image.src = "data:image/jpg;base64," + data.file;
              image.style = "width:inherit!important;height:inherit!important";
              var win = window.open("#","_blank");
              var title = data.file_name;
              win.document.write('<html><title>'+ title +'</title><body style="margin-top:0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;"><div class="row"><div class="col-md-12" style="width:100%;height:auto">');
              win.document.write(image.outerHTML);
              win.document.write('</div></div></body></html>');
              var layer = $(win.document);
            }else if (extenstion == 'pdf'){
              var objbuilder = '';
              objbuilder += ('<object width="100%" height="100%" data="data:application/pdf;base64,');
              objbuilder += (data.file );
              objbuilder += ('" type="application/pdf" class="internal">');
              objbuilder += ('<embed src="data:application/pdf;base64,');
              objbuilder += (data.file );
              objbuilder += ('" type="application/pdf"  />');
              objbuilder += ('</object>');

              var win = window.open("#","_blank");
              var title = data.file_name;
              win.document.write('<html><title>'+ title +'</title><body style="margin-top:0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">');
              win.document.write(objbuilder);
              win.document.write('</body></html>');
              var layer = $(win.document);
            }else{
              alert("Формат файла не поддерживается");
            }
          } else {
            alert('Не удалось загрузить файл');
          }
          $('div', progressbar).css('width', 0);
          progressbar.css('display', 'none');
          vision.css('display','inline');
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

    printData(){
       var divToPrint=document.getElementById("printTable");
       var newWin= window.open("");
       newWin.document.write(divToPrint.outerHTML);
        var elements = newWin.document.getElementsByClassName('removed_in_print');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
       newWin.print();
       newWin.close();
    }

    render() {
      return (
            <div>
              <h5 className="block-title-2 mt-3 mb-3">Общая информация
                <button className="btn btn-raised btn-success btn-sm" style={{ marginLeft:'20px'}} onClick={this.printData.bind(this)}>Печать</button>
                <button className="btn btn-outline-secondary btn-sm pull-right" onClick={this.props.historygoBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
              </h5>

              <table className="table table-bordered table-striped" id="printTable">
                <tbody>
                  <tr>
                    <td style={{width: '22%'}}><b>ИД заявки</b></td>
                    <td>{this.props.propertyaddress.id}</td>
                  </tr>
                  <tr>
                    <td><b>Заявитель</b></td>
                    <td>
                      {this.props.propertyaddress.applicant}
                      <NavLink style={{marginLeft:'5px'}} exact className="removed_in_print btn btn-raised btn-primary btn-sm" to={"/panel/propertyaddress/all_history/"+this.props.propertyaddress.user_id+"/1"}>История заявлений</NavLink>
                    </td>
                  </tr>
                  <tr>
                    <td><b>Телефон</b></td>
                    <td>{this.props.propertyaddress.phone}</td>
                  </tr>
                  <tr>
                    <td><b>Адрес земельного участка</b></td>
                    <td>
                      {this.props.propertyaddress.land_address}

                      {this.props.propertyaddress.land_address_coordinates &&
                        <a style={{marginLeft:'5px'}} className="removed_in_print btn btn-raised btn-primary btn-sm" onClick={this.props.toggleMap}>Показать на карте</a>
                      }
                    </td>
                  </tr>
                  <tr>
                    <td><b>Дата заявления</b></td>
                    <td>{this.props.propertyaddress.created_at && this.toDate(this.props.propertyaddress.created_at)}</td>
                  </tr>

                  {this.props.personalIdFile &&
                    <tr>
                      <td><b>Уд. лич./ Реквизиты</b></td>
                      <td><a className="text-info pointer" data-category="1" style={{marginRight: '10px'}} onClick={this.downloadFile.bind(this, this.props.personalIdFile.id, 1)}>Скачать</a>
                          <a className="text-info pointer" data-category="1" onClick={this.viewOrDownloadFile.bind(this, this.props.personalIdFile.id, 1)}>Просмотр</a>
                        <div className="progress mb-2" data-category="1" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.props.landLocationSchemeFile &&
                    <tr>
                      <td><b>Схема расположения земельного участка</b></td>
                      <td><a className="text-info pointer" data-category="42" style={{marginRight: '10px'}} onClick={this.downloadFile.bind(this, this.props.landLocationSchemeFile.id, 42)}>Скачать</a>
                          <a className="text-info pointer" data-category="42" onClick={this.viewOrDownloadFile.bind(this, this.props.landLocationSchemeFile.id, 42)}>Просмотр</a>
                        <div className="progress mb-2" data-category="42" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {(this.props.personalIdFile || this.props.landLocationSchemeFile) &&
                    <tr className="removed_in_print">
                      <td colSpan="2"><a className="text-info pointer" data-category="101" onClick={this.downloadAllFile.bind(this, this.props.propertyaddress.id)}><img style={{height:'16px'}} src="/images/download.png" alt="download"/>Скачать одним архивом</a>
                        <div className="progress mb-2" data-category="101" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          )
    }
  }
