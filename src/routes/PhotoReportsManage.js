import React from 'react';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';
import $ from 'jquery';
import Loader from 'react-loader-spinner';

export default class PhotoReportsManage extends React.Component {
  render() {
    return (
      <div className="content container body-content">
        <div>
          <div>
            <Switch>
              <Route path="/panel/photo-reporter/photoreportsManage/status/:status/:page" exact render={(props) =>(
                <AllPhotoReports {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/photo-reporter/photoreportsManage/show/:id" exact render={(props) =>(
                <ShowPhotoReport {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Redirect from="/panel/photo-reporter/photoreportsManage" to="/panel/photo-reporter/photoreportsManage/status/active/1" />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

class AllPhotoReports extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderHidden: false,
      response: null,
      pageNumbers: []
    };
  }

  componentDidMount() {
    this.props.breadCrumbs();
    this.getPhotoReports();
  }

  componentWillReceiveProps(nextProps) {
    this.getPhotoReports(nextProps.match.params.status, nextProps.match.params.page);
  }

  getPhotoReports(status = null, page = null) {
    if (!status) {
      status = this.props.match.params.status;
    }

    if (!page) {
      page = this.props.match.params.page;
    }

    this.setState({ loaderHidden: false });

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/photoreports/manager/all/" + status + '?page=' + page, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var pageNumbers = [];
        var start = (response.current_page - 4) > 0 ? (response.current_page - 4) : 1;
        var end = (response.current_page + 4) < response.last_page ? (response.current_page + 4) : response.last_page;
        
        for (start; start <= end; start++) {
          pageNumbers.push(start);
        }

        this.setState({pageNumbers: pageNumbers});
        this.setState({response: response});
      }

      this.setState({ loaderHidden: true });
    }.bind(this);
    xhr.send();
  }

  toDate(date) {
    if(date === null) {
      return date;
    }

    var jDate = new Date(date);
    var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
    var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year;
    
    return formated_date;
  }

  render() {
    var status = this.props.match.params.status;
    var page = this.props.match.params.page;
    var reports = this.state.response ? this.state.response.data : [];

    return (
      <div>
        <h4 className="mb-0">Фотоотчеты</h4>

        {this.state.loaderHidden &&
          <div>
            <ul className="nav nav-tabs mb-2 pull-right">
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/photo-reporter/photoreportsManage/status/active/1" replace>Активные</NavLink></li>
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/photo-reporter/photoreportsManage/status/accepted/1" replace>Принятые</NavLink></li>
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/photo-reporter/photoreportsManage/status/declined/1" replace>Отказанные</NavLink></li>
            </ul>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '30%'}}>Название</th>
                  <th style={{width: '15%'}}>Период с</th>
                  <th style={{width: '15%'}}>Период до</th>
                  <th style={{width: '15%'}}>Дата</th>
                  <th style={{width: '15%'}}>Статус</th>
                  <th style={{width: '10%'}}></th>
                </tr>
              </thead>

              <tbody className="tbody">
                {reports.map(function(report, index) {
                  return(
                    <tr key={index}>
                      <td>
                        <a href=""></a>{report.company_name}
                      </td>
                      <td>
                        {this.toDate(report.start_date)}
                      </td>
                      <td>
                        {this.toDate(report.end_date)}
                      </td>
                      <td>
                        {this.toDate(report.created_at)}
                      </td>
                      <td>
                        {report.status.name}
                      </td>
                      <td>
                        <Link className="btn btn-outline-info" to={'/panel/photo-reporter/photoreportsManage/show/' + report.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                      </td>
                    </tr>
                  );
                  }.bind(this))
                }
              </tbody>
            </table>

            {this.state.response && this.state.response.last_page > 1 &&
              <nav className="pagination_block">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/photo-reporter/photoreportsManage/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/photo-reporter/photoreportsManage/status/' + status + '/' + num}>{num}</Link>
                      </li>
                      );
                    }.bind(this))
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/photo-reporter/photoreportsManage/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
                  </li>
                </ul>
              </nav>
            }
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

class ShowPhotoReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photoReport: [],
      files: []
    };

    this.deleteFile = this.deleteFile.bind(this);
  }
  
  componentDidMount() {
    this.props.breadCrumbs();
  }

  componentWillMount() {
    this.getPhotoReportInfo();
  }

  getPhotoReportInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/photoreports/manager/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        this.setState({
          photoReport: data,
          files: data.files
        });
      }
    }.bind(this)
    xhr.send();
  }

  sendForm(status) {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var data = JSON.stringify({status: status});

    if (status === false) {
      if (!window.confirm('Вы уверены что хотите отказать?')) {
        return false;
      }
    }

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/photoreports/manager/status/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        if (status === true) {
          alert("Заявление принято!");
        } else {
          alert("Заявление отклонено!");
        }

        this.getPhotoReportInfo();
      }
    }.bind(this);
    xhr.send(data); 
  }

  toDate(date) {
    if(date === null) {
      return date;
    }
    
    var jDate = new Date(date);
    var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
    var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var formated_date = curr_date + "." + curr_month + "." + curr_year;
    
    return formated_date;
  }

  uploadFile(category, e) {
    var id = this.props.match.params.id;
    var file = e.target.files;
    var progressbar = $('.progress');

    if (!file || !category) {
      alert('Не удалось загрузить файл');

      return false;
    }

    var formData = new FormData();

    Object.keys(file).forEach(function(k) {
      formData.append('file[' + [k] + ']', file[k]);
    }.bind(this));

    formData.append('category', category);
    formData.append('item_id', id);
    formData.append('item_type', 'photoreports');
    progressbar.css('display', 'flex');
    
    $.ajax({
      type: 'POST',
      url: window.url + 'api/file/upload_multiple',
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
            percentComplete = parseInt(percentComplete * 100);
            console.log(percentComplete);
            $('div', progressbar).css('width', percentComplete + '%');

          }
        }, false);

        return xhr;
      },
      success: function (response) {
        setTimeout(function() {
          progressbar.css('display', 'none');

          this.setState({files: response});

          alert("Файлы успешно загружены");
        }.bind(this), '1000')
      }.bind(this),
      error: function (response) {
        progressbar.css('display', 'none');
        alert("Не удалось загрузить файл");
      }
    });
  }

  deleteFile(event) {
    var id =  event.target.getAttribute("data-id");
    var name =  event.target.getAttribute("data-name");
    var token = sessionStorage.getItem('tokenInfo');
    
    if (!window.confirm('Вы действительно хотите удалить файл "' + name + '"?')) {
      return false;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/file/delete/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        this.getPhotoReportInfo();
      }
    }.bind(this)
    xhr.send();
  }

  modalImage(base64) {
    $('#imagepreview').attr('src', 'data:image/png;base64,' + base64);
    $('#imagemodal').modal('show');
  }
  
  render() {
    var photoReport = this.state.photoReport;

    if (photoReport.length === 0) {
      return false;
    }

    return (
      <div>
        <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

        <table className="table table-bordered table-striped">
          <tbody>
            <tr>
              <td style={{width: '22%'}}><b>ИД заявки</b></td>
              <td>{photoReport.id}</td>
            </tr>
            <tr>
              <td><b>Наименование компании</b></td>
              <td>{photoReport.company_name}</td>
            </tr>
            <tr>
              <td><b>Адрес рекламы</b></td>
              <td>{photoReport.photo_address}</td>
            </tr>
            <tr>
              <td><b>Период с</b></td>
              <td>{this.toDate(photoReport.start_date)}</td>
            </tr>
            <tr>
              <td><b>Период до</b></td>
              <td>{this.toDate(photoReport.end_date)}</td>
            </tr>
            <tr>
              <td><b>Дата заявления</b></td>
              <td>{this.toDate(photoReport.created_at)}</td>
            </tr>
            <tr>
              <td><b>Статус</b></td>
              <td>{photoReport.status.name}</td>
            </tr>
          </tbody>
        </table>

        {photoReport.status_id === 1 &&
          <div className="alert alert-info mt-3">
            <p>Управление архитектуры и градостроительства города Алматы, рассмотрев Ваше обращение от {this.toDate(photoReport.created_at)}, сообщает следующее.</p>
            <p>Для объективного, всестороннего рассмотрения обращений по вопросам размещения наружных (визуальных) информационных объектов в городе Алматы необходимо представить Уполномоченному органу - Управление архитектуры и градостроительства города Алматы документы, материалы, имеющие значение для рассмотрения обращений <small><i>(эскиз, включающий дневное и ночное изображение информационного объекта, объекта, на который предлагается разместить информационный объект; копия правоустанавливающего документа на земельный участок или объект, на который предлагается разместить объект наружной (визуальной) рекламы либо договора о размещении объекта наружной (визуальной) рекламы, заключенный заявителем с собственником (собственниками) объекта, на который предлагается разместить объект наружной (визуальный) информационный объект, органом управления объектом кондоминиума или лицами, обладающими иными вещными правами; а также нотариально засвидетельствованная копия свидетельства на знаки обслуживания в соответствии с п.3 ст. 1024 ГК РК, либо нотариально засвидетельствованная копия договора о передачи права пользования (рекламы) на знаки обслуживания, уведомление «о погашении налоговой задолженности» (код платежа-105424) от Департамента государственных доходов г. Алматы и другие материалы, имеющие значение для рассмотрения обращений (документы подтверждающие принадлежность, а также сведения касательно месторасположения объектов наружных (визуальных) информационных объектов).</i></small></p> 
            <p>В соответствии с п. 6 ст. 14 Закона Республики Казахстан «О порядке рассмотрения обращений физических и юридических лиц» Вы имеете право обжаловать действие (бездействие) должностных лиц либо решение, принятое по обращению.</p>
          </div>
        }

        {photoReport.status_id === 2 &&
          <div className="alert alert-success mt-3">
            <p>Управление архитектуры и градостроительства города Алматы, рассмотрев Ваше обращение от {this.toDate(photoReport.created_at)} направляет Вам фотографии объектов наружной (визуальной) рекламы. Вместе с тем, сообщаем, что сведения в органы государственных доходов Управлением подаются без указания наименования и ИИН (БИН) налогоплательщика.</p> 
            <p>В соответствии с п. 6 ст. 14 Закона Республики Казахстан «О порядке рассмотрения обращений физических и юридических лиц» Вы имеете право обжаловать действие (бездействие) должностных лиц либо решение, принятое по обращению.</p>
          </div>
        }

        {photoReport.status_id != 3 &&
          <div className="photo_reports_images row">
            {photoReport.files.map(function(file, index) {
              return(
                <div key={index} className="col-sm-3 mb-4">
                  <div className="image_block">
                    <div className="image pointer" onClick={this.modalImage.bind(this, file.base64)} style={{background: 'url(data:image/png;base64,' + file.base64 + ')'}}></div>
                  </div>
                </div>
              );
              }.bind(this))
            }

            <div class="modal fade" id="imagemodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                  </div>
                  <div class="modal-body">
                    <img src="" id="imagepreview" width="100%" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {photoReport.status_id === 3 &&
          <div>
            <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
              <button type="button" className="btn btn-raised btn-success" data-toggle="modal" data-target="#accepted_modal" style={{marginRight: '5px'}}>Одобрить</button>
              <button type="button" className="btn btn-raised btn-danger" onClick={this.sendForm.bind(this, false)}>Отказать</button>
            </div>

            <div className="modal fade" id="accepted_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Одобрить</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="upload_input" className="btn btn-success w-100" style={{marginRight: '2px'}}>Загрузить файлы</label>
                      <input type="file" id="upload_input" multiple className="form-control" style={{display: 'none'}} onChange={this.uploadFile.bind(this, 26)} />
                      
                      <div className="progress mt-2" style={{height: '20px', display: 'none'}}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div className="form-group photo_reports_files_list">
                    {this.state.files.map(function(file, index) {
                      return(
                        <div key={index} className="file_block">
                          <div>
                            {file.name}
                            <a className="pointer" data-id={file.id} data-name={file.name} onClick={this.deleteFile}>×</a>
                          </div>
                        </div>
                      );
                      }.bind(this))
                    }
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.sendForm.bind(this, true)}>
                      Одобрить
                    </button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        <hr />
        <Link className="btn btn-outline-secondary pull-right" to={'/panel/photo-reporter/photoreportsManage/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
      </div>
    )
  }
}