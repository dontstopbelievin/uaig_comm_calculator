import React from 'react';
import $ from 'jquery';

export default class ShowApz extends React.Component {
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

    printApz(apzId, project, progbarId = null) {
      var token = sessionStorage.getItem('tokenInfo');
      if (token) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/print/apz/" + apzId, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        var vision = $('.text-info[data-category='+progbarId+']');
        var progressbar = $('.progress[data-category='+progbarId+']');
        vision.css('display', 'none');
        progressbar.css('display', 'flex');
        xhr.onprogress = function(event) {
          $('div', progressbar).css('width', parseInt(event.loaded / 100000 * 100, 10) + '%');
        }
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
                  setTimeout(function() {
                    window.URL.revokeObjectURL(url);
                    $('div', progressbar).css('width', 0);
                    progressbar.css('display', 'none');
                    vision.css('display','inline');
                  },1000);
                };

              }());

              saveByteArray([base64ToArrayBuffer(data.file)], "апз-" + project + formated_date + ".pdf");
            }
          } else {
            $('div', progressbar).css('width', 0);
            progressbar.css('display', 'none');
            vision.css('display','inline');
            alert('Не удалось скачать файл');
          }
        }
        xhr.send();
      } else {
        console.log('session expired');
      }
    }

    printRegionAnswer(apzId, progbarId = null) {
      var token = sessionStorage.getItem('tokenInfo');
      if (token) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/print/region/" + apzId, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        var vision = $('.text-info[data-category='+progbarId+']');
        var progressbar = $('.progress[data-category='+progbarId+']');
        vision.css('display', 'none');
        progressbar.css('display', 'flex');
        xhr.onprogress = function(event) {
          $('div', progressbar).css('width', parseInt(event.loaded / 85000 * 100, 10) + '%');
          console.log(event.loaded);
        }
        xhr.onload = function () {
          if (xhr.status === 200) {
            //test of IE
            if (typeof window.navigator.msSaveBlob === "function") {
              window.navigator.msSaveBlob(xhr.response, "МО.pdf");
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
                  setTimeout(function() {
                    window.URL.revokeObjectURL(url);
                    $('div', progressbar).css('width', 0);
                    progressbar.css('display', 'none');
                    vision.css('display','inline');
                  },1000);
                };

              }());

              saveByteArray([base64ToArrayBuffer(data.file)], "МО.pdf");
            }
          } else {
            $('div', progressbar).css('width', 0);
            progressbar.css('display', 'none');
            vision.css('display','inline');
            alert('Не удалось скачать файл');
          }
        }
        xhr.send();
      } else {
        console.log('Время сессии истекло.');
      }
    }

    viewOrDownloadFile(isAccept, apzId, progbarId = null) {
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        if(isAccept){
          xhr.open("get", window.url + "api/print/apz/" + apzId, true);
        }else{
          xhr.open("get", window.url + "api/print/region/" + apzId, true);
        }
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
            } else {
                alert('Не удалось загрузить файл');
            }
            $('div', progressbar).css('width', 0);
            progressbar.css('display', 'none');
            vision.css('display','inline');
        }
        xhr.send();
    }

    render() {
      return (
            <div>
              {this.props.engineerReturnedState &&
                <div className="alert alert-danger">
                  Комментарий инженера: {this.props.engineerReturnedState.comment}
                </div>
              }
              {this.props.apzReturnedState &&
                <div className="alert alert-danger">
                  Комментарий апз отдела: {this.props.apzReturnedState.comment}
                </div>
              }
              {this.props.backFromHead &&
                <div className="alert alert-danger">
                  Комментарий главного архитектора: {this.props.backFromHead.comment}
                </div>
              }
                {this.props.schemeComment &&
                <div className="alert alert-danger">
                    Комментарий ген план(ситуационная схема): {this.props.schemeComment.comment}
                </div>
                }
                {this.props.calculationComment &&
                <div className="alert alert-danger">
                    Комментарий ген план(расчеты): {this.props.calculationComment.comment}
                </div>
                }
                {this.props.reglamentComment &&
                <div className="alert alert-danger">
                    Комментарий ген план(регламент): {this.props.reglamentComment.comment}
                </div>
                }
                {this.props.schemeFile &&
                <div className="col-md-8 offset-2">
                    <div className="row" style={{paddingTop:'5px',paddingBottom:'5px',backgroundColor:'#eeeeff'}}>
                        <div className="col-md-6"><b>Файл ситуационной схемы</b></div>
                        <div className="col-md-6">
                            <a className="text-info pointer" data-category="9" onClick={this.downloadFile.bind(this, this.props.schemeFile.id, 9)}><b>Скачать</b></a>
                            <div className="progress mb-2" data-category="9" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {this.props.calculationFile &&
                <div className="col-md-8 offset-2">
                    <div className="row" style={{paddingTop:'5px',paddingBottom:'5px',backgroundColor:'#eeeeff'}}>
                        <div className="col-md-6"><b>Файл расчетов</b></div>
                        <div className="col-md-6">
                            <a className="text-info pointer" data-category="10" onClick={this.downloadFile.bind(this, this.props.calculationFile.id, 10)}><b>Скачать</b></a>
                            <div className="progress mb-2" data-category="10" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {this.props.reglamentFile &&
                <div className="col-md-8 offset-2">
                    <div className="row" style={{paddingTop:'5px',paddingBottom:'5px',backgroundColor:'#eeeeff'}}>
                        <div className="col-md-6"><b>Регламент</b></div>
                        <div className="col-md-6">
                            <a className="text-info pointer" data-category="11" onClick={this.downloadFile.bind(this, this.props.reglamentFile.id, 11)}><b>Скачать</b></a>
                            <div className="progress mb-2" data-category="11" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {this.props.otkazFile &&
                <div className="col-md-8 offset-2">
                    <div className="row" style={{paddingTop:'5px',paddingBottom:'5px',backgroundColor:'#eeeeff'}}>
                        <div className="col-md-6"><b>Файл отказа</b></div>
                        <div className="col-md-6">
                            <a className="text-info pointer" data-category="12" onClick={this.downloadFile.bind(this, this.props.otkazFile.id, 12)}><b>Скачать</b></a>
                            <div className="progress mb-2" data-category="12" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
                }
              {(this.props.apz_status === 2 || this.props.apz_department_response) && !this.props.lastDecisionIsMO  &&
                <div>
                  <h5 className="block-title-2 mb-3">Решение</h5>
                  <table className="table table-bordered table-striped">
                    <tbody>
                      <tr>
                        <td style={{width: '22%'}}><b>Сформированный АПЗ</b></td>
                        <td>
                          <a className="text-info pointer" data-category="13" onClick={this.printApz.bind(this, this.props.apz_id, this.props.p_name, 13)}>Скачать</a>
                            <div className="progress mb-2" data-category="13" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </td>
                        <td>
                          <a className="text-info pointer" data-category="14" onClick={this.viewOrDownloadFile.bind(this, true, this.props.apz_id, 1)}>Просмотр</a>
                            <div className="progress mb-2" data-category="14" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
              { this.props.lastDecisionIsMO && !this.props.otkazFile &&
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                      <td>
                        <a className="text-info pointer" data-category="15" onClick={this.printRegionAnswer.bind(this, this.props.apz_id, 14)}>Скачать</a>
                          <div className="progress mb-2" data-category="15" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                      </td>
                      <td>
                        <a className="text-info pointer" data-category="16" onClick={this.viewOrDownloadFile.bind(this, false, this.props.apz_id, 1)}>Просмотр</a>
                          <div className="progress mb-2" data-category="16" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              }
        </div>
      )
    }
  }
