import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import Loader from 'react-loader-spinner';
import ShowMap from "../components/ShowMap";
import AllInfo from "../components/AllInfo";
import Logs from "../components/Logs";
import Answers from "../components/Answers";

export default class ShowLandInLocality extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        landinlocality: [],
        showMap: false,
        showMapText: 'Показать карту',
        personalIdFile: false,
        landLocationSchemeFile: false,
        actChooseLandFile: false,
        paymentFile: false,
        rightLandInLocalityFile: false,
        paymentFile: false,
        showButtons: false,
        loaderHidden: false
      };
    }

    componentDidMount() {
      this.props.breadCrumbs();
    }

    componentWillMount() {
      this.getLandInLocalityInfo();
    }

    getLandInLocalityInfo() {
      var id = this.props.match.params.id;
      var token = sessionStorage.getItem('tokenInfo');

      this.setState({ loaderHidden: false });

      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/land_in_locality/citizen/detail/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var landinlocality = JSON.parse(xhr.responseText);
          this.setState({landinlocality: landinlocality});
          this.setState({personalIdFile: landinlocality.files.filter(function(obj) { return obj.category_id === 3 })[0]});
          this.setState({landLocationSchemeFile: landinlocality.files.filter(function(obj) { return obj.category_id === 42 })[0]});
          this.setState({actChooseLandFile: landinlocality.files.filter(function(obj) { return obj.category_id === 43 })[0]});
          this.setState({paymentFile: landinlocality.files.filter(function(obj) { return obj.category_id === 44 })[0]});
          this.setState({rightLandInLocalityFile: landinlocality.files.filter(function(obj) { return obj.category_id === 45 })[0]});
          if(landinlocality.status_id === 6) {
            this.setState({showButtons: true});
          }
          this.setState({loaderHidden: true});
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this)
      xhr.send();
    }

    acceptDeclineForm(applicationId) {
      var token = sessionStorage.getItem('tokenInfo');

      if (!this.state.paymentFile) {
        alert('Закрепите файл!');
        return false;
      }

      var registerData = {
        file: this.state.paymentFile
      };

      var data = JSON.stringify(registerData);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/land_in_locality/citizen/status/" + applicationId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function () {
        if (xhr.status === 200) {

          alert("Файл отправлен!");
          this.setState({ showButtons: false });

        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        }
      }.bind(this);
      xhr.send(data);
    }

    uploadFile(category, e) {
      if(e.target.files[0] == null){ return;}
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
              percentComplete = parseInt(percentComplete * 100, 10);
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
              case 44:
                this.setState({paymentFile: data});
                break;
              default:
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
          $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100, 10) + '%');
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

    printLandInLocality(landinlocalityId, project) {
      var token = sessionStorage.getItem('tokenInfo');
      if (token) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/print/land_in_locality/" + landinlocalityId, true);
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

    printRegionAnswer(landinlocalityId) {
      var token = sessionStorage.getItem('tokenInfo');
      if (token) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/print/region/" + landinlocalityId, true);
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
                  setTimeout(function() {window.URL.revokeObjectURL(url);},0);
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

    render() {
      return (
        <div>
          {this.state.loaderHidden &&
            <div>

              <AllInfo toggleMap={this.toggleMap.bind(this, true)} landinlocality={this.state.landinlocality} personalIdFile={this.state.personalIdFile} landLocationSchemeFile={this.state.landLocationSchemeFile}
                   historygoBack={this.props.history.goBack} />

              {this.state.showMap && <ShowMap coordinates={this.state.landinlocality.land_address_coordinates} mapId={"b5a3c97bd18442c1949ba5aefc4c1835"}/>}

              <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                {this.state.showMapText}
              </button>

              <Answers backFromHead={this.state.backFromHead} landinlocality_id={this.state.landinlocality.id}
                       actChooseLandFile={this.state.actChooseLandFile} landinlocality_status={this.state.landinlocality.status_id}
                       paymentFile={this.state.paymentFile} rightLandInLocalityFile={this.state.rightLandInLocalityFile} />

             <div className={this.state.showButtons ? '' : 'invisible'}>
               <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                   <div style={{margin: 'auto', display: 'table'}}>
                     <div className="file_container">
                       <div className="col-md-12">
                         <div className="progress mb-2" data-category="44" style={{height: '20px', display: 'none'}}>
                           <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                         </div>
                       </div>
                       {this.state.paymentFile &&
                         <div className="file_block mb-2">
                           <div>
                             {this.state.paymentFile.name}
                             <a className="pointer" onClick={(e) => this.setState({paymentFile: false}) }>×</a>
                           </div>
                         </div>
                       }
                       <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                         <label><h6>Оплата за услуги земельно-кадастровых работ</h6></label>
                         <label htmlFor="paymentFile" className="btn btn-success" style={{marginLeft: '5px'}}>Загрузить</label>
                         <input type="file" id="paymentFile" name="paymentFile" className="form-control" onChange={this.uploadFile.bind(this, 44)} style={{display: 'none'}} />
                       </div>
                       <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                     </div>
                     <button type="button" className="btn btn-raised btn-success" onClick={this.acceptDeclineForm.bind(this, this.state.landinlocality.id)}>Отправить</button>
                   </div>
               </div>
             </div>

              <Logs state_history={this.state.landinlocality.state_history} />

              <div className="col-sm-12">
                <button className="btn btn-outline-secondary pull-right btn-sm" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
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
