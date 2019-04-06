import React from 'react';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import ReactQuill from 'react-quill';
import CommissionAnswersList from '../components/CommissionAnswersList';
import ShowMap from "../components/ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Answers from "../components/Answers";
import Logs from "../components/Logs";

export default class ShowApz extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        apz: [],
        templates: [],
        theme: '',
        comment: '',
        showMap: false,
        showButtons: false,
        showMapText: 'Показать карту',
        loaderHidden: false,
        personalIdFile: false,
        confirmedTaskFile: false,
        titleDocumentFile: false,
        additionalFile: false,
        reglamentFile: false,
        schemeroadFile: false,
        schemeComment: false,
        schemeFile: false,
        calculationComment: false,
        calculationFile: false,
        showSendButtons:false
      };
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
        this.getAnswerTemplates();
      }
    }

    onThemeChange(e) {
      this.setState({ theme: e.target.value });
    }

    onTemplateListChange(e) {
      if(e.target.value != ''){
        var template = this.state.templates.find(template => template.id == e.target.value);
        this.setState({ comment: template.text });
        this.setState({ theme: template.title });
      }else{
        this.setState({ theme: '' });
      }
    }

    onCommentChange(value) {
      this.setState({ comment: value });
    }

    getAnswerTemplates(){
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/answer_template/all", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          //console.log(JSON.parse(xhr.responseText));
          this.setState({templates: JSON.parse(xhr.responseText).data});
        }
      }.bind(this)
      xhr.onerror = function () {
        alert('Сервер не отвечает');
      }.bind(this);
      xhr.send();
    }

    ecpSignSuccess(){
        this.setState({ showSendButtons: true });
        this.setState({ showSignButtons: false });
    }

    getApzInfo() {
      var id = this.props.match.params.id;
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/schemeroad/detail/" + id, true);
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
          this.setState({schemeroadFile: apz.files.filter(function(obj) { return obj.category_id === 40 })[0]});
          this.setState({schemeComment: apz.state_history.filter(function(obj) { return obj.state_id === 56 })[0]});
          this.setState({schemeFile: apz.files.filter(function(obj) { return obj.category_id === 38 })[0]});
          this.setState({calculationComment: apz.state_history.filter(function(obj) { return obj.state_id === 57 })[0]});
          this.setState({calculationFile: apz.files.filter(function(obj) { return obj.category_id === 39 })[0]});

          if (apz.state_history.filter(function(obj) { return obj.state_id === 64 })[0] == null &&
              apz.state_history.filter(function(obj) { return obj.state_id === 65 })[0] == null) {
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
              case 40:
                this.setState({schemeroadFile: data});
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

      if(!status && (comment.trim() == '' || this.state.theme.trim() == '')){
        alert('Для отказа напишите тему и причину отказа.');
        return false;
      }else{
        if (!this.state.schemeroadFile) {
          alert('Закрепите файл!');
          return false;
        }
      }

      var registerData = {
        response: status,
        message: comment,
        theme: this.state.theme,
        file: this.state.schemeroadFile
      };

      var data = JSON.stringify(registerData);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/schemeroad/status/" + apzId, true);
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
        this.setState({ showButtons: false });
        if (!status) {
          $('#accDecApzForm').modal('hide');
        }
      }.bind(this);
      xhr.send(data);
      $('#ReturnApzForm').modal('hide');
    }

    showSignBtns(){
        if (!this.state.schemeroadFile) {
          alert('Закрепите файл!');
          return false;
        }
        this.setState({ showSignButtons: true });
    }

    hideSignBtns(){
        this.setState({ showSignButtons: false });
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
      return (
        <div>
          {this.state.loaderHidden &&
            <div>
                <AllInfo toggleMap={this.toggleMap.bind(this, true)} apz={this.state.apz} personalIdFile={this.state.personalIdFile} confirmedTaskFile={this.state.confirmedTaskFile} titleDocumentFile={this.state.titleDocumentFile}
                         historygoBack={this.props.history.goBack} additionalFile={this.state.additionalFile} claimedCapacityJustification={this.state.claimedCapacityJustification}/>

              {this.state.apz.commission && (Object.keys(this.state.apz.commission).length > 0) &&
                <div>
                  <h5 className="block-title-2 mb-3">Ответы от служб</h5>
                  <CommissionAnswersList apz={this.state.apz} />
                </div>
              }

              {this.state.showMap && <ShowMap coordinates={this.state.apz.project_address_coordinates} mapId={"b5a3c97bd18442c1949ba5aefc4c1835"}/>}
              {/*//0e8ae8f43ea94d358673e749f9a5e147*/}

              <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                {this.state.showMapText}
              </button>

              <Answers engineerReturnedState={this.state.engineerReturnedState} apzReturnedState={this.state.apzReturnedState}
                       backFromHead={this.state.backFromHead} apz_department_response={this.state.apz.apz_department_response} apz_id={this.state.apz.id} p_name={this.state.apz.project_name}
                       apz_status={this.state.apz.status_id} schemeComment={this.state.schemeComment}
                       calculationComment={this.state.calculationComment} reglamentComment={this.state.reglamentComment} schemeFile={this.state.schemeFile}
                       calculationFile={this.state.calculationFile} reglamentFile={this.state.reglamentFile} schemeroadFile={this.state.schemeroadFile} />

              <div className={this.state.showButtons ? '' : 'invisible'}>
                <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                  <div className="form-group">
                    <div className="file_container">
                      <div className="col-md-12">
                        <div className="progress mb-2" data-category="40" style={{height: '20px', display: 'none'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </div>
                      {this.state.schemeroadFile &&
                        <div className="file_block mb-2">
                          <div>
                            {this.state.schemeroadFile.name}
                            <a className="pointer" onClick={(e) => this.setState({schemeroadFile: false}) }>×</a>
                          </div>
                        </div>
                      }
                      <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                        <label><h6>Схема трасс</h6></label>
                        <label htmlFor="schemeroadFile" className="btn btn-success" style={{marginLeft: '5px'}}>Загрузить</label>
                        <input type="file" id="schemeroadFile" name="schemeroadFile" className="form-control" onChange={this.uploadFile.bind(this, 40)} style={{display: 'none'}} />
                      </div>
                    </div>
                  </div>
                  {!this.state.showSignButtons && !this.state.showSendButtons &&
                  <div style={{margin: 'auto', display: 'table'}}>
                    <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.showSignBtns.bind(this)}>Поставить подпись</button>
                    <button type="button" className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm" style={{marginRight:'5px'}}>Мотивированный отказ</button>
                  </div>}
                  {this.state.showSignButtons && !this.state.isSigned &&
                    <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="schemeroad" id={this.state.apz.id} serviceName='apz'/>
                  }
                  {this.state.showSendButtons &&
                      <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineApzForm.bind(this, this.state.apz.id, true, 'your form was accepted')}>Отправить в отдел гос улсуг</button>
                  }
                </div>
              </div>

              <div className="modal fade" id="ReturnApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Мотивированный отказ</h5>
                      <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      {this.state.templates && this.state.templates.length > 0 &&
                        <div className="form-group">
                          <select className="form-control" defaultValue="" id="templateList" onChange={this.onTemplateListChange.bind(this)}>
                            <option value="">Выберите шаблон</option>
                            {this.state.templates.map(function(template, index) {
                              return(
                                <option key={index} value={template.id}>{template.title}</option>
                                );
                              })
                            }
                          </select>
                        </div>
                      }
                      <div className="form-group">
                        <label>Тема(краткое описание)</label>
                        <div>
                          <input value={this.state.theme} onChange={this.onThemeChange.bind(this)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Причина отказа</label>
                        <ReactQuill value={this.state.comment} onChange={this.onCommentChange} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-raised btn-success" style={{marginRight:'5px'}} onClick={this.acceptDeclineApzForm.bind(this, this.state.apz.id, false, this.state.comment)}>Отправить Юристу</button>
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                    </div>
                  </div>
                </div>
              </div>

              <Logs state_history={this.state.apz.state_history} />

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
