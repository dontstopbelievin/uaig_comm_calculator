import React from 'react';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import CommissionAnswersList from '../components/CommissionAnswersList';
import ShowMap from "../components/ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Answers from "../components/Answers";
import Logs from "../components/Logs";

export default class ShowApz extends React.Component {
    constructor(props) {
      super(props);

      this.webSocket = new WebSocket('wss://127.0.0.1:13579/');
      this.heartbeat_msg = '--heartbeat--';
      this.heartbeat_interval = null;
      this.missed_heartbeats = 0;
      this.missed_heartbeats_limit_min = 3;
      this.missed_heartbeats_limit_max = 50;
      this.missed_heartbeats_limit = this.missed_heartbeats_limit_min;
      this.callback = null;

      this.state = {
        apz: [],
        showMap: false,
        showButtons: false,
        description: '',
        showMapText: 'Показать карту',
        loaderHidden: false,
        personalIdFile: false,
        confirmedTaskFile: false,
        titleDocumentFile: false,
        additionalFile: false,
        needSign: false,
        storageAlias: "PKCS12",
        reglamentFile: false,
        schemeComment: false,
        schemeFile: false,
        calculationComment: false,
        calculationFile: false,
        loaderHiddenSign:true,
        showSendButtons:false
      };

      this.onDescriptionChange = this.onDescriptionChange.bind(this);
    }

    onDescriptionChange(e) {
      this.setState({ description: e.target.value });
    }

    componentDidMount() {
      this.props.breadCrumbs();
    }

    componentWillMount() {
      if(!sessionStorage.getItem('tokenInfo')){
        let fullLoc = window.location.href.split('/');
        this.props.history.replace({pathname: "/panel/common/login", state:{url_apz_id: fullLoc[fullLoc.length-1]}});
      }else {
        this.getApzInfo();
      }
    }

    ecpSignSuccess(){
        this.setState({ showSendButtons: true });
        this.setState({ showSignButtons: false });
    }

    getApzInfo() {
      var id = this.props.match.params.id;
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/generalplan/detail/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          var apz = data;
          this.setState({apz: apz});
          this.setState({personalIdFile: apz.files.filter(function(obj) { return obj.category_id === 3 })[0]});
          this.setState({confirmedTaskFile: apz.files.filter(function(obj) { return obj.category_id === 9 })[0]});
          this.setState({titleDocumentFile: apz.files.filter(function(obj) { return obj.category_id === 10 })[0]});
          this.setState({additionalFile: apz.files.filter(function(obj) { return obj.category_id === 27 })[0]});
          this.setState({reglamentFile: apz.files.filter(function(obj) { return obj.category_id === 29 })[0]});
          this.setState({schemeComment: apz.state_history.filter(function(obj) { return obj.state_id === 56 })[0]});
          this.setState({schemeFile: apz.files.filter(function(obj) { return obj.category_id === 38 })[0]});
          this.setState({calculationComment: apz.state_history.filter(function(obj) { return obj.state_id === 57 })[0]});
          this.setState({calculationFile: apz.files.filter(function(obj) { return obj.category_id === 39 })[0]});

          if (apz.state_history.filter(function(obj) { return obj.state_id === 41 })[0] != null &&
              apz.state_history.filter(function(obj) { return obj.state_id === 42 })[0] == null) {
            this.setState({showButtons: true});
          }
          this.setState({loaderHidden: true});
          // BE CAREFUL OF category_id should be xml регионального архитектора
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.onerror = function () {
        alert('Сервер не отвечает');
        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
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
              case 29:
                this.setState({reglamentFile: data});
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

    acceptDeclineApzForm(apzId, status, comment) {
      var token = sessionStorage.getItem('tokenInfo');

      if (!this.state.reglamentFile) {
        alert('Закрепите файл!');
        return false;
      }

      var registerData = {
        response: status,
        message: comment,
        file: this.state.reglamentFile
      };

      var data = JSON.stringify(registerData);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/generalplan/status/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function () {
        if (xhr.status === 200) {
          //var data = JSON.parse(xhr.responseText);

          if(status === true) {
            alert("Заявление принято!");
          } else {
            alert("Заявление отклонено!");
          }
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        }
        this.setState({ showSendButtons: false });
        if (!status) {
          $('#accDecApzForm').modal('hide');
        }
      }.bind(this);
      xhr.send(data);
      $('#ReturnApzForm').modal('hide');
      $('#AcceptApzForm').modal('hide');
    }

    showSignBtns(){
        if (!this.state.description || this.state.description.trim() == '' || !this.state.reglamentFile) {
          alert('Напишите комментарий и закрепите файл!');
          return false;
        }
        this.setState({ showSignButtons: true });
        this.setState({ showButtons: false });
    }

    hideSignBtns(){
        this.setState({ showSignButtons: false });
        this.setState({ showButtons: true });
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

    render() {
      var apz = this.state.apz;

      return (
        <div>
          {this.state.loaderHidden &&
            <div>
                <AllInfo toggleMap={this.toggleMap.bind(this, true)} apz={this.state.apz} personalIdFile={this.state.personalIdFile} confirmedTaskFile={this.state.confirmedTaskFile} titleDocumentFile={this.state.titleDocumentFile}
                         additionalFile={this.state.additionalFile} claimedCapacityJustification={this.state.claimedCapacityJustification}/>

              {apz.commission && (Object.keys(apz.commission).length > 0) &&
                <div>
                  <h5 className="block-title-2 mb-3">Ответы от служб</h5>
                  <CommissionAnswersList apz={apz} />
                </div>
              }

              {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} mapId={"0e8ae8f43ea94d358673e749f9a5e147"}/>}

              <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                {this.state.showMapText}
              </button>

              <Answers engineerReturnedState={this.state.engineerReturnedState} apzReturnedState={this.state.apzReturnedState}
                       backFromHead={this.state.backFromHead} apz_department_response={this.props.apz_department_response} apz_id={this.state.apz.id} p_name={this.state.apz.project_name}
                       apz_status={this.state.apz.status_id} schemeComment={this.state.schemeComment}
                       calculationComment={this.state.calculationComment} reglamentComment={this.state.reglamentComment} schemeFile={this.state.schemeFile}
                       calculationFile={this.state.calculationFile} reglamentFile={this.state.reglamentFile}/>

              <div className={this.state.showButtons ? '' : 'invisible'}>
                <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                  <h5 className="modal-title">Комментарий</h5>
                  <div className="form-group">
                    <textarea className="my_comments_ta" value={this.state.description} onChange={this.onDescriptionChange}></textarea>
                  </div>
                  <div className="form-group">
                    <div className="file_container">
                      <div className="col-md-12">
                        <div className="progress mb-2" data-category="29" style={{height: '20px', display: 'none'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </div>
                      {this.state.reglamentFile &&
                        <div className="file_block mb-2">
                          <div>
                            {this.state.reglamentFile.name}
                            <a className="pointer" onClick={(e) => this.setState({reglamentFile: false}) }>×</a>
                          </div>
                        </div>
                      }
                      <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                        <label><h6>Регламент</h6></label>
                        <label htmlFor="reglamentFile" className="btn btn-success" style={{marginLeft: '5px'}}>Загрузить</label>
                        <input type="file" id="reglamentFile" name="reglamentFile" className="form-control" onChange={this.uploadFile.bind(this, 29)} style={{display: 'none'}} />
                      </div>
                      <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                    </div>
                  </div>
                  <div style={{margin: 'auto', display: 'table'}}>
                    <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.showSignBtns.bind(this)}>Поставить подпись</button>
                  </div>
                </div>
              </div>

              {this.state.showSendButtons &&
                <div style={{margin: 'auto', display: 'table'}}>
                  <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineApzForm.bind(this, apz.id, true, this.state.description)}>Отправить начальнику ген план</button>
                </div>
              }

              {this.state.showSignButtons && !this.state.isSigned &&
                <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="generalplan" id={this.state.apz.id} serviceName='apz'/>
              }

              <Logs state_history={this.state.apz.state_history} />

              <div className="col-sm-12">
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
