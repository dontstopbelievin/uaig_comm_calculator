import React from 'react';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';
import $ from 'jquery';
import Loader from 'react-loader-spinner';

export default class PhotoReportsCitizen extends React.Component {
  render() {
    return (
      <div className="content container body-content">
        <div>
          <div>
            <Switch>
              <Route path="/panel/citizen/photoreports/status/:status/:page" exact render={(props) =>(
                <AllPhotoReports {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/photoreports/add" exact render={(props) =>(
                <AddPhotoReport {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/photoreports/show/:id" exact render={(props) =>(
                <ShowPhotoReport {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Redirect from="/panel/citizen/photoreports" to="/panel/citizen/photoreports/status/active/1" />
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
    xhr.open("get", window.url + "api/photoreports/citizen/all/" + status + '?page=' + page, true);
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
        <h4>Мои фотоотчеты</h4>

        {this.state.loaderHidden &&
          <div>
            <div className="row">
              <div className="col-sm-7">
                <div className="btn-group" role="group">
                  <Link className="btn btn-outline-primary mr-2" to="/panel/citizen/photoreports/add">Создать заявление</Link>
                  <button type="button" className="btn btn-outline-info" data-toggle="modal" data-target=".documents-modal">Перечень необходимых документов</button>
                </div>
              </div>
              <div className="col-sm-5 statusActive">
                <ul className="nav nav-tabs mb-2 pull-right">
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/citizen/photoreports/status/active/1" replace>Активные</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/citizen/photoreports/status/accepted/1" replace>Принятые</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/citizen/photoreports/status/declined/1" replace>Отказанные</NavLink></li>
                </ul>
              </div>
            </div>

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
                        <Link className="btn btn-outline-info" to={'/panel/citizen/photoreports/show/' + report.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
                    <Link className="page-link" to={'/panel/citizen/photoreports/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/citizen/photoreports/status/' + status + '/' + num}>{num}</Link>
                      </li>
                      );
                    }.bind(this))
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/citizen/photoreports/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
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

        <div className="modal fade documents-modal" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Перечень необходимых документов</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p><b>Для размещения объектов наружной (визуальной) рекламы в населенных пунктах:</b></p>
                <p>1) заявление по форме, установленной в приложении 2 к настоящему стандарту государственной услуги;</p>
                <p>2) нотариально засвидетельствованная копия правоустанавливающего документа на земельный участок или объект, на который предлагается разместить объект наружной (визуальной) рекламы, либо копия договора о размещении объекта наружной (визуальной) рекламы, заключенный заявителем с собственником (собственниками) объекта, на который предлагается разместить объект наружной (визуальной) рекламы, органом управления объектом кондоминиума или лицами, обладающими иными вещными правами;</p>
                <p>3) эскиз (цветной), включающий дневное и ночное изображение объекта наружной (визуальной) рекламы, объекта на который предлагается разместить объект наружной (визуальной) рекламы, решения по инженерному функционирования объекта наружной (визуальной) рекламы;</p>
                <p>4) документ, удостоверяющий личность уполномоченного представителя, и документ, удостоверяющий полномочия на представительство, – при обращении представителя услугополучателя (для идентификации личности);</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class AddPhotoReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      CompanyName: "",
      CompanyLegalAddress: "",
      CompanyFactualAddress: "",
      PhotoAddress: "",
      CompanyRegion: "",
      IIN: "",
      CompanyPhone: "",
      StartDate: "",
      EndDate: "",
      Comments: ""
    };
    
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(e) {
    const { value, name } = e.target;
    this.setState({ [name] : value });
  }

  sendForm(e) {
    e.preventDefault();

    var data = JSON.stringify(this.state);
    var token = sessionStorage.getItem('tokenInfo');
    
    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/photoreports/citizen/create", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert("Ваш запрос успешно отправлен!");

        this.props.history.push('/panel/citizen/photoreports/');
      } else {
        alert("Не удалось отправить заявку");
      }
    }.bind(this);
    xhr.send(data);
  }

  render() {
    return (
      <div>
        <h5 className="block-title-2 mt-0 mb-3">Заявление для получения фотоотчета</h5>

        <form onSubmit={this.sendForm.bind(this)}>
          <div className="row">
            <div className="col-4">
              <div className="form-group">
                <label>От ТОО/ИП</label>
                <input type="text" className="form-control" required placeholder="Компания" name="CompanyName" value={this.state.CompanyName} onChange={this.onInputChange} />
              </div>
              <div className="form-group">
                <label>Юридический адрес</label>
                <input type="text" className="form-control" required placeholder="Юридический адрес" name="CompanyLegalAddress" value={this.state.CompanyLegalAddress} onChange={this.onInputChange} />
              </div>
              <div className="form-group">
                <label>Фактический адрес</label>
                <input type="text" className="form-control" required placeholder="Фактический адрес" name="CompanyFactualAddress" value={this.state.CompanyFactualAddress} onChange={this.onInputChange} />
              </div>
              <div className="form-group">
                <label>Адрес рекламы</label>
                <input type="text" className="form-control" required placeholder="Фактический адрес" name="PhotoAddress" value={this.state.PhotoAddress} onChange={this.onInputChange} />
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label>Регион</label>
                <input type="text" className="form-control" required placeholder="Регион компании" name="CompanyRegion" value={this.state.CompanyRegion} onChange={this.onInputChange} />
              </div>
              <div className="form-group">
                <label>ИИН/БИН</label>
                <input type="number" className="form-control" required placeholder="ИИН/БИН" name="IIN" value={this.state.IIN} onChange={this.onInputChange} />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input type="text" className="form-control" required placeholder="Телефон" name="CompanyPhone" value={this.state.CompanyPhone} onChange={this.onInputChange} />
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label>Период с</label>
                <input type="date" className="form-control" required placeholder="Период" name="StartDate" value={this.state.StartDate} onChange={this.onInputChange} />
              </div>
              <div className="form-group">
                <label>Период до</label>
                <input type="date" className="form-control" required placeholder="Период" name="EndDate" value={this.state.EndDate} onChange={this.onInputChange} />
              </div>
              <div className="form-group">
                <label>Комментарий</label>
                <textarea className="form-control" required placeholder="Комментарий" rows="2" name="Comments" value={this.state.Comments} onChange={this.onInputChange}></textarea>
              </div>
            </div>
          </div>

          <input type="submit" className="btn btn-primary" value="Отправить заявку" />
        </form>

        <hr />
        <Link className="btn btn-outline-secondary pull-right" to={'/panel/citizen/photoreports/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
      </div>
    )
  }
}

class ShowPhotoReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photoReport: []
    };
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
    xhr.open("get", window.url + "api/photoreports/citizen/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        this.setState({photoReport: data});
      }
    }.bind(this)
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
    var formated_date = curr_date + "." + curr_month + "." + curr_year;
    
    return formated_date;
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
        
        <hr />
        <Link className="btn btn-outline-secondary pull-right" to={'/panel/citizen/photoreports/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
      </div>
    )
  }
}