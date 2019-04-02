import React from 'react';
import $ from 'jquery';
import Loader from 'react-loader-spinner';
import saveAs from 'file-saver';
import ShowMap from "../components/ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Logs from "../components/Logs";

export default class ShowApz extends React.Component {
  constructor(props) {
    super(props);

    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    this.state = {
      apz: [],
      showMap: false,
      showButtons: false,
      showSignButtons: false,
      showTechCon: false,
      file: false,
      responseServiceNum: "",
      responseCapacity: "",
      responseSewage: "",
      responseClientWishes: "",
      docNumber: "",
      description: '',
      responseId: 0,
      response: false,
      responseFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
      additionalFile: false,
      paymentPhotoFile: false,
      showMapText: 'Показать карту',
      accept: 'answer',
      callSaveFromSend: false,
      phoneStatus: 2,
      xmlFile: false,
      isSigned: false,
      isPerformer: (roles.indexOf('PerformerPhone') !== -1),
      isHead: (roles.indexOf('HeadPhone') !== -1),
      isDirector: (roles.indexOf('DirectorPhone') !== -1),
      heads_responses: [],
      head_accepted: true,
      headComment: "",
      ty_director_id: "",
      phone_directors_id: [],
      customTcFile: null,
      loaderHidden:true
    };

    this.onResponseServiceNumChange = this.onResponseServiceNumChange.bind(this);
    this.onResponseCapacityChange = this.onResponseCapacityChange.bind(this);
    this.onResponseSewageChange = this.onResponseSewageChange.bind(this);
    this.onDocNumberChange = this.onDocNumberChange.bind(this);
    this.onResponseClientWishesChange = this.onResponseClientWishesChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.saveResponseForm = this.saveResponseForm.bind(this);
    this.sendPhoneResponse = this.sendPhoneResponse.bind(this);
    this.onHeadCommentChange = this.onHeadCommentChange.bind(this);
    this.onCustomTcFileChange = this.onCustomTcFileChange.bind(this);
  }

  componentDidMount() {
    this.props.breadCrumbs();
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    if(roles[2] === 'PerformerPhone'){
      this.getDirectors();
    }
  }

  onResponseServiceNumChange(e) {
    this.setState({ responseServiceNum: e.target.value });
  }

  onResponseCapacityChange(e) {
    this.setState({ responseCapacity: e.target.value });
  }

  onResponseSewageChange(e) {
    this.setState({ responseSewage: e.target.value });
  }

  onResponseClientWishesChange(e) {
    this.setState({ responseClientWishes: e.target.value });
  }

  onDocNumberChange(e) {
    this.setState({ docNumber: e.target.value });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  onHeadCommentChange(e) {
    this.setState({ headComment: e.target.value });
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  onCustomTcFileChange(e) {
    this.setState({ customTcFile: e.target.files[0] });
  }

  toggleAcceptDecline(value) {
    this.setState({accept: value});
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getDirectors(){
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/getphonedirectors", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        var select_directors = [];
        for (var i = 0; i < data.length; i++) {
          select_directors.push(<option value={data[i].user_id}> {data[i].last_name +' ' + data[i].first_name+' '+data[i].middle_name} </option>);
        }
        this.setState({phone_directors_id: select_directors});
        if(this.state.ty_director_id === "" || this.state.ty_director_id === " "){
            this.setState({ty_director_id: data[0].user_id});
        }
      }
    }.bind(this);
    xhr.send();
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

  getApzInfo() {
    var id = this.props.match.params.id;
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    var userId = JSON.parse(sessionStorage.getItem('userId'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
        return false;
    }

    var providerName = roles[1];
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/provider/" + providerName + "/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        this.setState({apz: data});
        this.setState({showButtons: false});
        this.setState({showTechCon: false});
        this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});
        this.setState({additionalFile: data.files.filter(function(obj) { return obj.category_id === 27 })[0]});
        this.setState({paymentPhotoFile: data.files.filter(function(obj) { return obj.category_id === 20 })[0]});

        if (data.commission.apz_phone_response) {
          data.commission.apz_phone_response.response_text ? this.setState({description: data.commission.apz_phone_response.response_text}) : this.setState({description: ""});
          data.commission.apz_phone_response.service_num ? this.setState({responseServiceNum: data.commission.apz_phone_response.service_num}) : this.setState({responseServiceNum: ""});
          data.commission.apz_phone_response.capacity ? this.setState({responseCapacity: data.commission.apz_phone_response.capacity}) : this.setState({responseCapacity: ""});
          data.commission.apz_phone_response.sewage ? this.setState({responseSewage: data.commission.apz_phone_response.sewage}) : this.setState({responseSewage: ""});
          data.commission.apz_phone_response.client_wishes ? this.setState({responseClientWishes: data.commission.apz_phone_response.client_wishes}) : this.setState({responseClientWishes: ""});
          data.commission.apz_phone_response.doc_number ? this.setState({docNumber: data.commission.apz_phone_response.doc_number}) : this.setState({docNumber: ""});
          data.commission.apz_phone_response.id ? this.setState({responseId: data.commission.apz_phone_response.id}) : this.setState({responseId: ""});
          data.commission.apz_phone_response.response ? this.setState({response: data.commission.apz_phone_response.response}) : this.setState({response: ""});
          data.commission.apz_phone_response.files ? this.setState({customTcFile: data.commission.apz_phone_response.files.filter(function(obj) { return obj.category_id === 23})[0]}) : this.setState({customTcFile: null});;
          data.commission.apz_phone_response.phone_director_id ? this.setState({ty_director_id: data.commission.apz_phone_response.phone_director_id}) : this.setState({ty_director_id: "" });

          if(data.PhoneResponseId !== -1){
            this.setState({accept: data.commission.apz_phone_response.response ? 'answer' : 'decline'});
          }

          this.setState({responseFile: data.commission.apz_phone_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12})[0]});
          this.setState({xmlFile: data.commission.apz_phone_response.files.filter(function(obj) { return obj.category_id === 17})[0]});
        }

        this.setState({phoneStatus: data.apz_phone.status});

        if (data.status_id === 5 && data.apz_phone.status === 2) {
          this.setState({showButtons: true});
        }

        if(data.apz_phone.status === 1){
          this.setState({showTechCon: true});
        }

        if (this.state.xmlFile) {
          this.setState({isSigned: true});
        }

        this.setState({heads_responses: data.apz_provider_head_response.filter(function(obj) { return obj.role_id === 36 })});

        if (this.state.isHead && data.apz_provider_head_response.filter(function(obj) { return obj.role_id === 36 && obj.user_id === userId }).length === 0) {
          this.setState({head_accepted: false});
        }
      }
    }.bind(this)
    xhr.send();
  }

  saveResponseForm(apzId, status, comment){
    var token = sessionStorage.getItem('tokenInfo');
    var file = this.state.file;
    var customTcFile = this.state.customTcFile;

    var formData = new FormData();
    formData.append('file', file);
    formData.append('customTcFile', customTcFile);
    formData.append('Response', status);
    formData.append('Message', comment);
    if(status === false){
      formData.append('ResponseServiceNum', "");
      formData.append('ResponseCapacity', "");
      formData.append('ResponseSewage', "");
      formData.append('ResponseClientWishes', "");
    }
    else{
      formData.append('ResponseServiceNum', this.state.responseServiceNum);
      formData.append('ResponseCapacity', this.state.responseCapacity);
      formData.append('ResponseSewage', this.state.responseSewage);
      formData.append('ResponseClientWishes', this.state.responseClientWishes);
    }
    formData.append('DocNumber', this.state.docNumber);
    console.log(this.state.ty_director_id);
    formData.append('ty_director_id', this.state.ty_director_id);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/provider/phone/" + apzId + '/save', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        this.setState({responseId: data.id});
        data.response ? this.setState({response: data.response}) : this.setState({response: ""});
        data.files ? this.setState({customTcFile: data.files.filter(function(obj) { return obj.category_id === 23})[0]}) : this.setState({customTcFile: null});
        data.response ? this.setState({accept: data.response ? 'answer' : 'decline'}) : this.setState({accept: "answer"});
        data.response_text ? this.setState({description: data.response_text}) : this.setState({description: ""});
        data.files ? this.setState({responseFile: data.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]}) : this.setState({responseFile: null});
        data.service_num ? this.setState({responseServiceNum: data.service_num}) : this.setState({responseServiceNum: ""});
        data.capacity ? this.setState({responseCapacity: data.capacity}) : this.setState({responseCapacity: ""});
        data.sewage ? this.setState({responseSewage: data.sewage}) : this.setState({responseSewage: ""});
        data.client_wishes ? this.setState({responseClientWishes: data.client_wishes}) : this.setState({responseClientWishes: ""});

        if (this.state.callSaveFromSend) {
          this.setState({callSaveFromSend: false});
          this.sendPhoneResponse(apzId, status, comment);
        } else {
          alert("Ответ сохранен!");

          this.setState({showSignButtons: true})
        }
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData);
  }

  sendPhoneResponse(apzId, status, comment) {
    if((this.state.responseId <= 0 || this.state.responseId > 0) && this.state.response !== status){
      this.setState({callSaveFromSend: true});
      this.saveResponseForm(apzId, status, comment);
    }
    else{
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/provider/phone/" + apzId + '/update', true);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);

          if(data.response === 1) {
            alert("Заявление принято!");
            this.setState({ showButtons: false });
            this.setState({ phoneStatus: 1 });
            this.setState({showTechCon: true});
          }
          else if(data.response === 0) {
            alert("Заявление отклонено!");
            this.setState({ showButtons: false });
            this.setState({ phoneStatus: 0 })
          }
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        }
      }.bind(this);
      xhr.send(JSON.stringify({docNumber: this.state.docNumber}));
    }
  }

  sendHeadResponse(apzId, status, comment) {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();

    var formData = new FormData();
    formData.append('status', status);
    formData.append('comment', comment);

    if (!comment) {
      alert('Заполните поле "Комментарий"');
      return false;
    }

    xhr.open("post", window.url + "api/apz/provider/headphone/" + apzId + '/response', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        alert('Ответ успешно отправлен');
        this.setState({head_accepted: true});
        this.setState({heads_responses: data.head_responses});
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
        alert(JSON.parse(xhr.responseText).message);
      }
    }.bind(this);
    xhr.send(formData);
  }

  printTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/phone/" + apzId, true);
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

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Телефон-" + project + formated_date + ".pdf");
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

  handleDirectorIDChange(event){
    this.setState({ty_director_id: event.target.value});
  }

  ecpSignSuccess(){
    this.setState({ xmlFile: true });
  }

  hideSignBtns() {
    this.setState({needSign: false });
  }

  render() {
    var apz = this.state.apz;

    if (apz.length === 0) {
      return false;
    }

    return (
      <div className="row">
        <div className="col-sm-12">
          <AllInfo toggleMap={this.toggleMap.bind(this, true)} apz={this.state.apz} personalIdFile={this.state.personalIdFile} confirmedTaskFile={this.state.confirmedTaskFile} titleDocumentFile={this.state.titleDocumentFile}
          historygoBack={this.props.history.goBack} additionalFile={this.state.additionalFile} claimedCapacityJustification={this.state.claimedCapacityJustification}/>
        </div>

        <div className="col-sm-12">
          <div className="row provider_answer_top" style={{margin: '16px 0 0'}}>
            {(this.state.isPerformer === true || this.state.responseId !== 0) &&
              <div className="col-sm-6">
                <h5 className="block-title-2 mt-3 mb-3" style={{display: 'inline'}}>Ответ</h5>
              </div>
            }
            <div className="col-sm-6 pr-0">
              {this.state.showButtons && !this.state.isSigned && this.state.isPerformer &&
                <div className="btn-group" style={{float: 'right', margin: '0'}}>
                  <button className={'btn btn-raised ' + (this.state.accept === 'answer' ? 'btn-success' : 'btn-secondary')} style={{marginRight: '5px'}} onClick={this.toggleAcceptDecline.bind(this, 'answer')}>
                    Одобрить
                  </button>
                  <button className={'btn btn-raised ' + (this.state.accept === 'decline' ? 'btn-danger' : 'btn-secondary')} onClick={this.toggleAcceptDecline.bind(this, 'decline')}>
                    Отклонить
                  </button>
                </div>
              }
            </div>
          </div>

          {this.state.accept === 'accept' && this.state.phoneStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <form className="provider_answer_body" style={{border: 'solid 1px #46A149', padding: '20px'}}>
              <div className="row pt-0">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="responseServiceNum">Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</label>
                    <input type="number" step="any" className="form-control" id="responseServiceNum" placeholder="" value={this.state.responseServiceNum} onChange={this.onResponseServiceNumChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="responseCapacity">Телефонная емкость</label>
                    <input type="number" step="any" className="form-control" id="responseCapacity" placeholder="" value={this.state.responseCapacity} onChange={this.onResponseCapacityChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="responseSewage">Планируемая телефонная канализация</label>
                    <input type="number" step="any" className="form-control" id="responseSewage" placeholder="" value={this.state.responseSewage} onChange={this.onResponseSewageChange} />
                  </div>
                  <div className="form-group">
                    <label>Номер документа</label>
                    <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="responseClientWishes">Пожелания заказчика (тип оборудования, тип кабеля и др.)</label>
                    <textarea rows="5" id="responseClientWishes" className="form-control" value={this.state.responseClientWishes} onChange={this.onResponseClientWishesChange}></textarea>
                  </div>

                  {(this.state.response === true && this.state.responseFile) &&
                    <div className="form-group">
                      <label style={{display: 'block'}}>Прикрепленный файл</label>
                      <a className="pointer text-info" title="Скачать" data-category="7" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 7)}>
                        Скачать
                      </a>
                      <div className="progress mb-2" data-category="7" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  }
                  <div className="form-group">
                    <label htmlFor="upload_file">Прикрепить файл</label>
                    <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
                  </div>
                </div>
                <div className="col-sm-12">
                  {!this.state.xmlFile &&
                    <div className="form-group">
                      <div style={{paddingLeft:'5px', fontSize: '18px', margin: '10px 0px'}}>
                        <b>Выберите директора:</b>
                        <select id="phone_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.ty_director_id} onChange={this.handleDirectorIDChange.bind(this)}>
                          {this.state.phone_directors_id}
                        </select>
                      </div>
                      <button type="button" style={{ marginRight: '5px' }} className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, "accept", "")}>
                        Сохранить
                      </button>

                      {/*<button type="button" style={{ marginRight: '5px' }} className="btn btn-secondary" onClick={this.sendPhoneResponse.bind(this, apz.id, true, "")}>
                        Отправить без ЭЦП
                      </button>*/}

                      {this.state.response &&
                        <button type="button" className="btn btn-secondary" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>
                          Предварительный просмотр
                        </button>
                      }
                      <p style={{color:'#777777'}}>Сохранение перезаписывает предыдущий вариант.</p>
                    </div>
                  }
                </div>
              </div>
            </form>
          }

          {this.state.accept === 'accept' && this.state.responseId !== 0 && (this.state.phoneStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</td>
                    <td>{this.state.responseServiceNum}</td>
                  </tr>
                  <tr>
                    <td>Телефонная емкость</td>
                    <td>{this.state.responseCapacity}</td>
                  </tr>
                  <tr>
                    <td>Планируемая телефонная канализация</td>
                    <td>{this.state.responseSewage}</td>
                  </tr>
                  <tr>
                    <td>Пожелания заказчика (тип оборудования, тип кабеля и др.)</td>
                    <td>{this.state.responseClientWishes}</td>
                  </tr>
                  <tr>
                    <td>Номер документа</td>
                    <td>{this.state.docNumber}</td>
                  </tr>
                  {this.state.titleDocumentFile &&
                    <tr>
                      <td>Прикрепленный файл</td>
                      <td>
                        <a className="pointer text-info" title="Скачать" data-category="8" onClick={this.downloadFile.bind(this, this.state.titleDocumentFile.id, 8)}>
                          Скачать
                        </a>
                        <div className="progress mb-2" data-category="8" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.state.showTechCon === false && (this.state.isDirector || this.state.isHead) &&
                    <tr>
                      <td>Ответ в PDF</td>
                      <td>
                        <a className="pointer text-info" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>
                          Скачать
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          {this.state.accept === 'answer' && this.state.phoneStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <div className="provider_answer_body" style={{border: 'solid 1px #46A149', padding: '20px'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
                <label htmlFor="responseClientWishes">Пожелания заказчика (тип оборудования, тип кабеля и др.)</label>
                <textarea rows="5" id="responseClientWishes" className="form-control" value={this.state.responseClientWishes} onChange={this.onResponseClientWishesChange}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="custom_tc_file">
                  Прикрепить файл

                  {this.state.customTcFile &&
                    <span style={{paddingLeft: '5px'}}>
                      (текущий файл: <a className="pointer text-info" title="Скачать" data-category="9" onClick={this.downloadFile.bind(this, this.state.customTcFile.id, 9)}>{this.state.customTcFile.name}</a>)
                      <div className="progress mb-2" data-category="9" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </span>
                  }
                </label>
                <input type="file" id="custom_tc_file" className="form-control" onChange={this.onCustomTcFileChange} />
              </div>

              <div style={{paddingLeft:'5px', fontSize: '18px', margin: '10px 0px'}}>
                <b>Выберите директора:</b>
                <select id="phone_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.ty_director_id} onChange={this.handleDirectorIDChange.bind(this)}>
                  {this.state.phone_directors_id}
                </select>
              </div>
              <div className="form-group" style={{marginBottom:'5px'}}>
                {!this.state.xmlFile &&
                    <button type="button" className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, true, "")}>
                      Сохранить
                    </button>
                }
                <button type="button" style={{ marginLeft: '5px' }} className="btn btn-secondary" onClick={this.sendPhoneResponse.bind(this, apz.id, true, "")}>
                  Отправить без ЭЦП
                </button>
              </div>
              <p style={{color:'#777777', marginBottom:'0px'}}>Если есть сканированное техническое условие. Сканированный ТУ заменяет ТУ созданный сайтом.</p>
              <p style={{color:'#777777'}}>Сохранение перезаписывает предыдущий файл.</p>
            </div>
          }

          {this.state.accept === 'answer' && this.state.responseId !== 0 && (this.state.phoneStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td>Номер документа</td>
                  <td>{this.state.docNumber}</td>
                </tr>
                <tr>
                  <td>Пожелания заказчика (тип оборудования, тип кабеля и др.)</td>
                  <td>{this.state.responseClientWishes}</td>
                </tr>
              {this.state.customTcFile &&
                <tr>
                  <td>Технические условия</td>
                  <td><a className="pointer text-info" title="Скачать" data-category="10" onClick={this.downloadFile.bind(this, this.state.customTcFile.id, 10)}>Скачать</a>
                    <div className="progress mb-2" data-category="10" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </td>
                </tr>}
              </tbody>
            </table>
          }

          {this.state.accept === 'decline' && this.state.phoneStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <div className="provider_answer_body" style={{border: 'solid 1px #f44336', padding: '20px'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
               <label>Причина отклонения</label>
                <textarea rows="5" className="form-control" value={this.state.description} onChange={this.onDescriptionChange} placeholder="Описание"></textarea>
              </div>
              {(this.state.response === false && this.state.responseFile) &&
                <div className="form-group">
                  <label style={{display: 'block'}}>Прикрепленный файл</label>
                  <a className="pointer text-info" title="Скачать" data-category="11" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 11)}>
                    Скачать
                  </a>
                  <div className="progress mb-2" data-category="11" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              }
              <div className="form-group">
                <label htmlFor="upload_file">Прикрепить файл</label>
                <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
              </div>
              <div className="form-group">
                <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm">Отклонить</button>
              </div>
            </div>
          }
          <div className="modal fade" id="ReturnApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Вы уверены что хотите отколнить заявление?</h5>
                  <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-footer" style={{margin:'auto'}}>
                  <button type="button" className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, 'decline', this.state.description)}>
                    Да
                  </button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal" style={{marginLeft:'5px'}}>Нет</button>
                </div>
              </div>
            </div>
          </div>

          {this.state.accept === 'decline' && this.state.responseId !== 0 && (this.state.phoneStatus === 0 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>Причина отклонения</td>
                    <td>{this.state.description}</td>
                  </tr>
                  <tr>
                    <td>Номер документа</td>
                    <td>{this.state.docNumber}</td>
                  </tr>
                  {this.state.responseFile &&
                    <tr>
                      <td>Прикрепленный файл</td>
                      <td>
                        <a className="pointer text-info" title="Скачать" data-category="12" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 12)}>
                          Скачать
                        </a>
                        <div className="progress mb-2" data-category="12" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          {this.state.phoneStatus === 2 && this.state.isSigned && this.state.isPerformer &&
            <div style={{margin: 'auto', marginTop: '20px', display: 'table', width: '30%'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={this.sendPhoneResponse.bind(this, apz.id, (this.state.response), "")}>
                  Отправить инженеру
                </button>
              </div>
            </div>
          }

          {this.state.isDirector && this.state.phoneStatus === 2 &&
            <div>
              {!this.state.xmlFile && !this.state.isSigned && apz.status_id === 5 &&
              <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="phone" id={apz.id} serviceName='apz'/>
              }
            </div>
          }

          {!this.state.customTcFile &&
            <div className={this.state.showTechCon ? '' : 'invisible'}>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}><b>Сформированный ТУ</b></td>
                    <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
        </div>

        <div className="col-sm-12">
          {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} mapId={"538a07fef340431faf5e4ba0238b1833"} />}

          <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>
        </div>

        <div className="col-sm-12">
          {apz.commission && apz.commission.comment &&
            <div className="alert alert-info mt-3">
              {apz.commission.comment}
            </div>
          }

          {this.state.heads_responses.length > 0 &&
            <div>
              <h5 className="block-title-2 mt-4 mb-3">Комментарии:</h5>

              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <th>ФИО</th>
                    <th>Комментарий</th>
                    <th>Дата</th>
                  </tr>
                  {this.state.heads_responses.map(function(item, index) {
                    return(
                      <tr key={index}>
                        <td width="40%">
                          {item.user.name}
                        </td>
                        <td width="40%">{item.comments}</td>
                        <td>{this.toDate(item.created_at)}</td>
                      </tr>
                      );
                    }.bind(this))
                  }
                </tbody>
              </table>
            </div>
          }

          {this.state.isHead &&
            <div className={this.state.showButtons ? '' : 'invisible'}>
              <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                <textarea style={{marginBottom: '10px'}} placeholder="Комментарий" rows="7" cols="50" className="form-control" value={this.state.headComment} onChange={this.onHeadCommentChange}></textarea>
                <button className="btn btn-raised btn-success" onClick={this.sendHeadResponse.bind(this, apz.id, true, this.state.headComment)}>
                  Отправить
                </button>
              </div>
            </div>
          }
        </div>

        <Logs state_history={this.state.apz.state_history} />

        <div className="col-sm-12">
          <button className="btn btn-outline-secondary pull-right btn-sm" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
        </div>
      </div>
    )
  }
}
