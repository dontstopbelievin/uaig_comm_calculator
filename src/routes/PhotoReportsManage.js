import React, { Component } from 'react';
import { Route, NavLink, Switch, Redirect} from 'react-router-dom';
import PreloaderIcon, {ICON_TYPE} from 'react-preloader-icon';

export default class PhotoReportsManage extends React.Component {
  constructor() {
    super();
    this.state = {
      loadingVisible: false,
      showDetails: false,
      showUploadBtn: false,
      showDeclineBtn: false,
      activeList: [],
      file: [],
      linkToggle: "",
      RequestId: "",
      ApplicationDate: "",
      CompanyName: "",
      CompanyLegalAddress: "",
      CompanyFactualAddress: "",
      PhotoAddress: "",
      CompanyRegion: "",
      IIN: "",
      CompanyPhone: "",
      StartDate: "",
      EndDate: "",
      Comments: "",
      Status: ""
    }
    
    this.getList = this.getList.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  getList() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/photoreport/request/active", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        this.setState({ activeList: data });
      }
    }.bind(this);
    xhr.send();
  }

  getDetails(e) {
    // console.log(e);
    this.setState({ showDetails: true });
    this.setState({ linkToggle: e.Id });
    this.setState({ RequestId: e.Id });
    this.setState({ CompanyName: e.CompanyName });
    this.setState({ CompanyLegalAddress: e.CompanyLegalAddress });
    this.setState({ CompanyFactualAddress: e.CompanyFactualAddress });
    this.setState({ PhotoAddress: e.PhotoAddress });
    this.setState({ CompanyRegion: e.CompanyRegion });
    this.setState({ IIN: e.IIN });
    this.setState({ CompanyPhone: e.CompanyPhone });
    this.setState({ Comments: e.Comments });
    this.setState({ Status: e.Status });
    this.setState(() => { var x = new Date(e.ApplicationDate);
      return { ApplicationDate: (x.getDate()) + "." + (x.getMonth()+1) + "." + (x.getFullYear()) }
    });
    this.setState(() => { var x = new Date(e.StartDate);
      return { StartDate: (x.getDate()) + "." + (x.getMonth()+1) + "." + (x.getFullYear()) }
    });
    this.setState(() => { var x = new Date(e.EndDate);
      return { EndDate: (x.getDate()) + "." + (x.getMonth()+1) + "." + (x.getFullYear()) }
    });
    // document.getElementById(e.Id).style.fontWeight = "900"
  }

  responseCreate(){
    if(document.querySelector('input[name="responseCreate"]:checked').value == 1) {
      this.setState({ showUploadBtn: true, showDeclineBtn: false });
      var PhotosExist = true;
    }
    else {
      this.setState({ showUploadBtn: false, showDeclineBtn: true });
      var PhotosExist = false;
    }
      

    var data = {
      RequestId: this.state.RequestId,
      PhotosExist: PhotosExist
    }
    var formData = JSON.stringify(data);

    if (!this.state.RequestId) {
      return;
    } 
    else {
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/photoreport/response/create", true);
      xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log(xhr.response);
        } else {
          // alert("Ошибка " + xhr.status + ': ' + xhr.statusText);
        }
      }
      console.log(formData);
      xhr.send(formData);
    }
  }

  responseSend() {
    if (!this.state.RequestId) {
      return;
    } 
    else {
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/photoreport/response/send/" + this.state.RequestId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log(xhr.response);
          document.getElementById(this.state.RequestId).outerHTML = '';
          document.getElementById("rC1").checked = false;
          document.getElementById("rC2").checked = false;
          this.setState({ showDetails: false });
        } else {
          console.log(xhr.statusText);
          // alert("Ошибка " + xhr.status + ': ' + xhr.statusText);
        }
      }.bind(this);
      xhr.send();
    }
  }

  uploadFile(e) {
    // console.log(this.state.file);
    e.preventDefault();
    
    var formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('ResponseId', this.state.RequestId);

    if (!this.state.file) {
      return;
    } 
    else 
    {
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/photoreport/response/photo", true);
      xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      // xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          document.getElementById('uploadFileModalClose').click();
          alert("Файл успешно загружен");
        } else {
          console.log(xhr.response);
          // alert("Ошибка " + xhr.status + ': ' + xhr.statusText);
        }
      }
      console.log(formData);
      xhr.send(formData);
    }
  }

  componentWillMount() {
    //console.log("UrbanComponent will mount");
    // if(sessionStorage.getItem('tokenInfo')){
    //   var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];
    //   this.props.history.replace('/' + userRole);
    // }else {
    //   this.props.history.replace('/');
    // }
  }

  componentDidMount() {
    //console.log("UrbanComponent did mount");
    this.getList();
  }
  
  render() {
    // console.log(this.getList)
    return (
      <div className="content container files-page">
        <div className="card">
          <div className="card-header"><h4 className="mb-0">Фотоотчеты</h4></div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-9">
                
              </div>
              <div className="col-sm-3">
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '25%'}}>Список заявлений</th>
                  <th style={{width: '35%'}}>Паспорт</th>
                  <th style={{width: '40%'}}>Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ul>
                    {
                      this.state.activeList.map(function(e, i){
                      return(
                          <li id={e.Id} key={i}>
                            <a href="javascript:;" onClick={this.getDetails.bind(this, e)} className={(this.state.linkToggle == e.Id) ? 'bold btn btn-primary' : 'btn btn-primary'}>{e.PhotoAddress}</a>
                          </li>
                        )
                      }.bind(this))
                    }
                    </ul>
                  </td>
                  <td>
                    <div className={this.state.showDetails ? 'row' : 'invisible'}>
                      <div className="col-6"><b>Дата заявления</b>:</div> <div className="col-6">{this.state.ApplicationDate}</div>
                      <div className="col-6"><b>Название компании</b>:</div> <div className="col-6">{this.state.CompanyName}</div>
                      <div className="col-6"><b>Юридический адрес</b>:</div> <div className="col-6">{this.state.CompanyLegalAddress}</div>
                      <div className="col-6"><b>Фактический адрес</b>:</div> <div className="col-6">{this.state.CompanyFactualAddress}</div>
                      <div className="col-6"><b>Адрес рекламы</b>:</div> <div className="col-6">{this.state.PhotoAddress}</div>
                      <div className="col-6"><b>Регион компании</b>:</div> <div className="col-6">{this.state.CompanyRegion}</div>
                      <div className="col-6"><b>ИИН/БИН</b>:</div> <div className="col-6">{this.state.IIN}</div>
                      <div className="col-6"><b>Телефон</b>:</div> <div className="col-6">{this.state.CompanyPhone}</div>
                      <div className="col-6"><b>Период с</b>:</div> <div className="col-6">{this.state.StartDate}</div>
                      <div className="col-6"><b>Период до</b>:</div> <div className="col-6">{this.state.EndDate}</div>
                      <div className="col-6"><b>Комментарии</b>:</div> <div className="col-6">{this.state.Comments}</div>
                    </div>
                  </td>
                  <td>
                    <div className={this.state.showDetails ? 'row' : 'invisible'}>
                      <div className="col-md-12 alert alert-primary">
                      {(() => {
                        switch (this.state.Status) {
                          case '0': return 'Вы отклонили заявку';
                          case '1': return 'Вы одобрили заявку';
                          case '2': return 'Ожидается ответ';
                          default: return '';
                        }
                      })()}
                      </div>
                      <hr />
                      <div className="col-md-12">
                        <input type="radio" id="rC1" name="responseCreate" onClick={this.responseCreate.bind(this)} value="1" />&nbsp;
                        <label htmlFor="rC1" className="col-form-label">Фото есть</label>&nbsp;
                        <input type="radio" id="rC2" name="responseCreate" onClick={this.responseCreate.bind(this)} value="0" />&nbsp;
                        <label htmlFor="rC2" className="col-form-label">Фото нет</label>
                        { 
                          this.state.showUploadBtn ? 
                          <div>
                            <button className="btn btn-outline-primary mt-3" data-toggle="modal" data-target="#uploadFileModal">Добавить фото</button>&nbsp;
                            <button className="btn btn-outline-success mt-3" onClick={this.responseSend.bind(this)}>Отправить заявителю</button>
                          </div>
                          : '' 
                        }
                        { this.state.showDeclineBtn ? 
                          <div>
                            <button className="btn btn-outline-danger mt-3" onClick={this.responseSend.bind(this)}>Отклонить заявку</button>
                          </div>
                          : ''
                        }

                        <div className="modal fade" id="uploadFileModal" tabIndex="-1" role="dialog" aria-hidden="true">
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <form onSubmit={this.uploadFile.bind(this)}>
                                <div className="modal-header">
                                  <h5 className="modal-title">Загрузить файл</h5>
                                  <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div className="modal-body">
                                  <div className="form-group">
                                    <label>Файл
                                      <input type="file" id="upload_file" className="form-control" onChange={(e) => this.setState({file: e.target.files[0]})} />
                                    </label>
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <input type="submit" className="btn btn-primary" value="Загрузить" />
                                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

class Loading extends Component {
  render() {
    return (
      <PreloaderIcon type={ICON_TYPE.OVAL} size={32} strokeWidth={8} strokeColor="#135ead" duration={800} />
    )
  }
}