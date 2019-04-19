import React from 'react';
import Loader from 'react-loader-spinner';
import {NavLink} from 'react-router-dom';
import $ from 'jquery';
import ReactQuill from 'react-quill';
import ShowMap from "../components/ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Logs from "../components/Logs";
import Answers from "../components/Answers";
import MotivationalReject from "../components/MotivationalReject";

export default class ShowLandInLocality extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        landinlocality: [],
        showMap: false,
        showButtons: true,
        comment: '',
        showMapText: 'Показать карту',
        loaderHidden: false,
        personalIdFile: false,
        landLocationSchemeFile: false,
        actChooseLandFile: false,
        needSign: false,
        lastDecisionIsMO: false,
        backFromHead: false,
        head_id: '',
        head_ids: [],
        templates: [],
        theme: '',
        xmlFile: false
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
        console.log('MOUNTING');
        this.getHeads();
        this.getApplications();
      }
    }

    getHeads(){
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/users/getheads", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          //console.log(data);
          var select_directors = [];
          for (var i = 0; i < data.length; i++) {
            select_directors.push(<option key={i} value={data[i].user_id}> {data[i].last_name +' ' + data[i].first_name+' '+data[i].middle_name} </option>);
          }
          this.setState({head_ids: select_directors});
          if((this.state.head_id === "" || this.state.head_id === " ") && data.length > 0){
              this.setState({head_id: data[0].user_id});
          }
        }
      }.bind(this);
      xhr.send();
    }

    getApplications() {
      var id = this.props.match.params.id;
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/land_in_locality/region/detail/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText).landinlocality;
          var templates = JSON.parse(xhr.responseText).templates;
          this.setState({landinlocality: response});
          this.setState({templates: templates});
          this.setState({personalIdFile: response.files.filter(function(obj) { return obj.category_id === 3 })[0]});
          this.setState({landLocationSchemeFile: response.files.filter(function(obj) { return obj.category_id === 42 })[0]});
          this.setState({actChooseLandFile: response.files.filter(function(obj) { return obj.category_id === 43 })[0]});
          this.setState({backFromHead: response.state_history.filter(function(obj) { return obj.state_id === 9 })[0]});
          this.setState({showButtons: false});
          for(var data_index = response.state_history.length-1; data_index >= 0; data_index--){
            switch (response.state_history[data_index].state_id) {
              case 2:
                break;
              case 3:
                this.setState({lastDecisionIsMO: true});
                break;
              default:
                continue;
            }
            break;
          }

          if(response.head_id){this.setState({head_id: response.head_id});}
          if(response.status_id === 3) {
            this.setState({showButtons: true});
          }

          this.setState({loaderHidden: true});
          // BE CAREFUL OF category_id should be xml регионального архитектора
          this.setState({xmlFile: response.files.filter(function(obj) { return obj.category_id === 21})[0]});
          //use instead new columns from table
          if(!response.urban_sign_returned){
              this.setState({xmlFile: false});
          }
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.send();
    }

    handleHeadIDChange(event){
      this.setState({head_id: event.target.value});
    }

    onCommentChange(value) {
      this.setState({ comment: value });
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

    onThemeChange(e) {
      this.setState({ theme: e.target.value });
    }

    acceptDeclineForm(applicationId, status, comment) {
      var token = sessionStorage.getItem('tokenInfo');

      if (status && !this.state.actChooseLandFile) {
        alert('Закрепите файл!');
        return false;
      }

      if(!status && (comment.trim() == '' || this.state.theme.trim() == '')){
        alert('Для отказа напишите тему и причину отказа.');
        return false;
      }

      var registerData = {
        response: status,
        message: comment,
        head_id: this.state.head_id,
        theme: this.state.theme,
        file: this.state.actChooseLandFile
      };

      var data = JSON.stringify(registerData);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/land_in_locality/region/status/" + applicationId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function () {
        if (xhr.status === 200) {
          //var data = JSON.parse(xhr.responseText);

          if(status === true) {
            alert("Заявление принято!");
            this.setState({ showButtons: false });
          } else {
            alert("Заявление отклонено!");
            this.setState({ showButtons: false });
          }
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        }

        if (!status) {
          $('#accDecApzForm').modal('hide');
          $('#ReturnForm').modal('hide');
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
              case 43:
                this.setState({actChooseLandFile: data});
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

    showSignBtns() {
      if(!this.state.actChooseLandFile){
        alert("Загрузите файл акта выбора земельного участка");
        return false;
      }
      this.setState({needSign: true });
    }

    hideSignBtns() {
      this.setState({needSign: false });
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

    ecpSignSuccess(){
      this.setState({ xmlFile: true });
    }

    render() {
      return (
        <div>
          {this.state.loaderHidden &&
            <div>

              <AllInfo toggleMap={this.toggleMap.bind(this, true)} landinlocality={this.state.landinlocality} personalIdFile={this.state.personalIdFile}
              landLocationSchemeFile={this.state.landLocationSchemeFile} historygoBack={this.props.history.goBack}/>

              {this.state.showMap && <ShowMap coordinates={this.state.landinlocality.project_address_coordinates} mapId={"b5a3c97bd18442c1949ba5aefc4c1835"}/>}

              <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                {this.state.showMapText}
              </button>

              <Answers backFromHead={this.state.backFromHead} landinlocality_id={this.state.landinlocality.id} lastDecisionIsMO={this.state.lastDecisionIsMO}
                       actChooseLandFile={this.state.actChooseLandFile} landinlocality_status={this.state.landinlocality.status_id}/>

              <div className={this.state.showButtons ? '' : 'invisible'}>
                <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                  {!this.state.needSign ?
                    <div style={{margin: 'auto', display: 'table'}}>
                      <div className="file_container">
                        <div className="col-md-12">
                          <div className="progress mb-2" data-category="43" style={{height: '20px', display: 'none'}}>
                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                        {this.state.actChooseLandFile &&
                          <div className="file_block mb-2">
                            <div>
                              {this.state.actChooseLandFile.name}
                              <a className="pointer" onClick={(e) => this.setState({actChooseLandFile: false}) }>×</a>
                            </div>
                          </div>
                        }
                        <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                          <label><h6>Акт выбора земельного участка</h6></label>
                          <label htmlFor="actChooseLandFile" className="btn btn-success" style={{marginLeft: '5px'}}>Загрузить</label>
                          <input type="file" id="actChooseLandFile" name="actChooseLandFile" className="form-control" onChange={this.uploadFile.bind(this, 43)} style={{display: 'none'}} />
                        </div>
                        <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                      </div>
                      <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.showSignBtns.bind(this)}>Поставить подпись</button>
                      <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnForm">
                          Вернуть на доработку
                      </button>
                    </div>
                    :
                      <div>
                      { !this.state.xmlFile ?
                          <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="region" id={this.state.landinlocality.id} serviceName='land_in_locality'/>
                        :
                          <div style={{paddingLeft:'5px', fontSize: '18px', textAlign:'center'}}>
                            <b>Выберите главного архитектора:</b>
                            <select id="gas_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.head_id} onChange={this.handleHeadIDChange.bind(this)}>
                              {this.state.head_ids}
                            </select>
                            <div>
                              <button type="button" className="btn btn-raised btn-success" onClick={this.acceptDeclineForm.bind(this, this.state.landinlocality.id, true, "")}>Отправить главному архитектору</button>
                            </div>
                          </div>
                      }
                    </div>
                  }
                  <MotivationalReject templates={this.state.templates} theme={this.state.theme} comment={this.state.comment} head_id={this.state.head_id}
                    acceptDeclineForm={this.acceptDeclineForm.bind(this, this.state.landinlocality.id, false, this.state.comment)} head_ids={this.state.head_ids}
                    onCommentChange={this.onCommentChange.bind(this)} onThemeChange={this.onThemeChange.bind(this)} onTemplateListChange={this.onTemplateListChange.bind(this)}
                    handleHeadIDChange={this.handleHeadIDChange.bind(this)}/>
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
