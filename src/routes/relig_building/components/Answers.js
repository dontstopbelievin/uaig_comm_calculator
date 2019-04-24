import React from 'react';
import $ from 'jquery';

export default class Answers extends React.Component {
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

    printRegionAnswer(applicationId, progbarId = null) {
      var token = sessionStorage.getItem('tokenInfo');
      if (token) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/print/region/religbuilding/" + applicationId, true);
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

    printApplication (id, progbarId = null) {
        var token = sessionStorage.getItem('tokenInfo');
        if (token) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", window.url + "api/print/religbuilding/" + id, true);
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

    viewOrDownloadFile(id, progbarId = null) {
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/print/religbuilding/" + id, true);

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
              {this.props.backFromHead &&
                <div className="alert alert-danger">
                  Комментарий главного архитектора: {this.props.backFromHead.comment}
                </div>
              }
              {(this.props.religbuilding_status === 2 || this.props.actChooseLandFile) && !this.props.lastDecisionIsMO &&
                <div>
                  <h5 className="block-title-2 mb-3">Решение</h5>
                  <table className="table table-bordered table-striped">
                    <tbody>
                      <tr>
                        <td style={{width: '22%'}}><b>Решение о строительстве культовых зданий </b></td>
                        <td>
                          <a className="text-info pointer" data-category="43" onClick={this.downloadFile.bind(this, this.props.actChooseLandFile.id, 43)}><b>Скачать</b></a>
                          <div className="progress mb-2" data-category="43" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
                {console.log("isAccept in answers = " + this.props.religbuilding_status)}
              {(this.props.religbuilding_status === 2 || this.props.is.Accept) && !this.props.lastDecisionIsMO  &&
              <div>
                  <h5 className="block-title-2 mb-3">Решение</h5>
                  <table className="table table-bordered table-striped">
                      <tbody>
                      <tr>
                          <td style={{width: '22%'}}><b>Сформированный лист</b></td>
                          <td>
                              <a className="text-info pointer" data-category="13" onClick={this.printApplication.bind(this, this.props.religbuilding_id, 13)}>Скачать</a>
                              <div className="progress mb-2" data-category="13" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                          </td>
                          <td>
                              <a className="text-info pointer" data-category="14" onClick={this.viewOrDownloadFile.bind(this, this.props.religbuilding_id, 1)}>Просмотр</a>
                              <div className="progress mb-2" data-category="14" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                          </td>
                      </tr>
                      </tbody>
                  </table>
              </div>
              }

              {console.log(this.props.lastDecisionIsMO)}
              {(this.props.religbuilding_status === 1 || this.props.lastDecisionIsMO) &&
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                      <td>
                        <a className="text-info pointer" data-category="14" onClick={this.printRegionAnswer.bind(this, this.props.religbuilding_id, 14)}>Скачать</a>
                        <div className="progress mb-2" data-category="14" style={{height: '20px', display: 'none', marginTop:'5px'}}>
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
