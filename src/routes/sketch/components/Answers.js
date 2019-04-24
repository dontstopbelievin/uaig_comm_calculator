import React from 'react';
import {Switch} from 'react-router-dom';
import $ from 'jquery';

export default class AllInfo extends React.Component {
  constructor(props){
    super(props);
  }

  printRegionAnswer(sketchId, progbarId = null) {
      var token = sessionStorage.getItem('tokenInfo');
      if (token) {
          var xhr = new XMLHttpRequest();
          xhr.open("get", window.url + "api/print/region/sketch/" + sketchId, true);
          xhr.setRequestHeader("Authorization", "Bearer " + token);
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
                              setTimeout(function() {window.URL.revokeObjectURL(url);},1000);
                          };

                      }());

                      saveByteArray([base64ToArrayBuffer(data.file)], "МО.pdf");
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

  viewOrDownloadFile(isAccept, sketchId, progbarId = null) {
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        if(isAccept){
            xhr.open("get", window.url + "api/print/sketch/" + sketchId, true);
        }else{
            xhr.open("get", window.url + "api/print/region/sketch/" + sketchId, true);
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

  render(){
    return (
        <div className="col-sm-12">
          <h5 className="block-title-2 mt-3 mb-3">Решение</h5>

          {this.props.engineerReturnedState &&
          <div className="alert alert-danger">
              Комментарий инженера: {this.props.engineerReturnedState.comment}
          </div>
          }
          {this.props.apzReturnedState &&
          <div className="alert alert-danger">
              Комментарий главного архитектора: {this.props.apzReturnedState.comment}
          </div>
          }
          {this.props.lastDecisionIsMO ?
          <table className="table table-bordered">
              <tbody>
              <tr>
                  <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                  <td><a className="text-info pointer" onClick={this.printRegionAnswer.bind(this, this.props.sketch_id)}>Скачать</a></td>
                  <td><a className="text-info pointer" data-category="1" onClick={this.viewOrDownloadFile.bind(this, false, this.props.sketch_id, 1)}>Просмотр</a></td>
              </tr>
              </tbody>
          </table>
          :
          <div>
          {(this.props.urban_response || this.props.isSent) &&
              <table className="table table-bordered">
                  <tbody>
                  <tr>
                      <td style={{width: '22%'}}><b>Согласование</b></td>
                      <td><a className="text-info pointer"  onClick={this.printSketchAnswer.bind(this, this.props.sketch_id)}>Скачать</a></td>
                      <td><a className="text-info pointer" data-category="1" onClick={this.viewOrDownloadFile.bind(this, true, this.props.sketch_id, 1)}>Просмотр</a></td>
                  </tr>
                  </tbody>
              </table>
          }
          </div>
          }
        </div>
    )}
}
