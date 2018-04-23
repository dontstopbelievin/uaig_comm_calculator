import React from 'react';
//import LocalizedStrings from 'react-localization';
//import $ from 'jquery';
//import {ru, kk} from '../languages/guest.json';
//import { NavLink } from 'react-router-dom';
//let e = new LocalizedStrings({ru,kk});

export default class BudgetPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: []
    };

  }

  componentDidMount() {
    this.getFiles();
  }

  getFiles() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/system_files/category/budget", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          this.setState({ files: JSON.parse(xhr.responseText).reverse() });
        }
      }.bind(this)
      xhr.send();
  }

  // Скачивание файла
  downloadFile(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/system_files/download/budget/' + id, true);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
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
                window.URL.revokeObjectURL(url);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
          }
        } else {
          alert('Не удалось скачать файл');
        }
      }
    xhr.send();
  }

  render() {
    return (
      <div>
        <div className="content container budget-plan-page body-content">
          <div className="card">
            <div className="card-header">
            <h4 className="mb-0">Бюджетное планирование</h4></div>
            <div className="card-body">
              <ul>
              {this.state.files.map(function(file, index){
                return(
                  <a key={index} className="list-group-item" >
                    <i className="glyphicon glyphicon-file"></i>
                    <div className="bmd-list-group-col">
                      <p className="list-group-item-heading pointer" onClick={this.downloadFile.bind(this, file.id)}>
                        {file.name}
                      </p>
                      <p className="list-group-item-text">{file.description}</p>
                    </div>
                    <i className="glyphicon glyphicon-download-alt pull-xs-right pointer" onClick={this.downloadFile.bind(this, file.id)}></i>
                  </a>
                  );
                }.bind(this))
              }
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}