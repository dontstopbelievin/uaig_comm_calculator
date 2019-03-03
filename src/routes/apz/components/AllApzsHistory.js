import React from 'react';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import { Link, } from 'react-router-dom';

export default class AllApzs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderHidden: false,
      response: null,
      pageNumbers: [],
      results: '',
      rolename: 'Temporary',
    };

    this.search = this.search.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  componentDidMount() {
    this.props.breadCrumbs();
    this.getAll();
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    switch (roles[1]) {
      case 'Region':
        this.setState({rolename: 'urban'});
        break;
      case 'Engineer':
        this.setState({rolename: 'engineer'});
        break;
      default:
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getAll(nextProps.match.params.user_id, nextProps.match.params.page);
  }

  getAll(user_id = null, page = null) {
    if (!user_id) {
      user_id = this.props.match.params.user_id;
    }
    if (!page) {
      page = this.props.match.params.page;
    }

    this.setState({ loaderHidden: false });

    var data = $("form input, form select").filter(function(index, element) {
      return $(element).val() !== '';
    }).serialize();
    //console.log(data);
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/all_history/"+user_id+"?page=" + page + "&" + data, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        //console.log(response);
        var pageNumbers = [];
        var start = (response.current_page - 4) > 0 ? (response.current_page - 4) : 1;
        var end = (response.current_page + 4) < response.last_page ? (response.current_page + 4) : response.last_page;

        for (start; start <= end; start++) {
          pageNumbers.push(start);
        }

        this.setState({pageNumbers: pageNumbers});
        this.setState({response: response});
        this.setState({results: response.total});
      }

      this.setState({ loaderHidden: true });
    }.bind(this);
    xhr.send();
  }

  search(user_id, page) {
    var data = $("form input, form select").filter(function(index, element) {
      return $(element).val() !== '';
    }).serialize();

    this.props.history.push('/panel/apz/all_history/'+ user_id +'/'+ page + '?' + data);
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

  render() {
    var user_id = this.props.match.params.user_id;
    var page = this.props.match.params.page;
    var apzs = this.state.response ? this.state.response.data : [];
    var params = new URLSearchParams(this.props.location.search);
    var search = this.props.location.search;

    return (
      <div>
        <div className="filter">
          <form className="office_filter">
            <div className="row">
              <div className="col-sm-4">
                <div className="form-group">
                  <label htmlFor="object_type" className="bmd-label-floating">Тип строения</label>
                  <select className="form-control" id="object_type" name="object_type" defaultValue={params.get('object_type')}>
                    <option value="">Все</option>
                    <option>ИЖС</option>
                    <option>МЖК</option>
                    <option>КомБыт</option>
                    <option>ПромПред</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status" className="bmd-label-floating">Статус</label>
                  <select className="form-control" id="status" name="status" defaultValue={params.get('status')}>
                    <option value="">Все</option>
                    <option value="1">Отказано</option>
                    <option value="2">Принято</option>
                    <option value="3">Архитектор</option>
                    <option value="4">Инженер</option>
                    <option value="5">Службы</option>
                    <option value="6">Отдел АПЗ</option>
                    <option value="7">Главный архитектор</option>
                  </select>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <label htmlFor="region" className="bmd-label-floating">Район</label>
                  <select className="form-control" id="region" name="region" defaultValue={params.get('region')}>
                    <option value="">Все</option>
                    <option>Наурызбай</option>
                    <option>Алатау</option>
                    <option>Алмалы</option>
                    <option>Ауезов</option>
                    <option>Бостандық</option>
                    <option>Жетісу</option>
                    <option>Медеу</option>
                    <option>Турксиб</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="type" className="bmd-label-floating">Пакет</label>
                  <select className="form-control" id="type" name="type" defaultValue={params.get('type')}>
                    <option value="">Все</option>
                    <option value="1">Пакет 1</option>
                    <option value="2">Пакет 2</option>
                  </select>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <label htmlFor="start_date" className="bmd-label-floating">Дата создания от</label>
                  <input type="date" className="form-control" id="start_date" name="start_date" defaultValue={params.get('start_date')} />
                </div>
                <div className="form-group">
                  <label htmlFor="end_date" className="bmd-label-floating">Дата создания до</label>
                  <input type="date" className="form-control" id="end_date" name="end_date" defaultValue={params.get('end_date')} />
                </div>
              </div>
              <div className="col-sm-12">
                <button type="button" onClick={this.search.bind(this, user_id, 1)} className="btn btn-success" style={{marginRight:'10px'}}>Поиск</button>
                <span style={{color:'#4caf50'}}>Всего результатов: {this.state.results}</span>
              </div>
            </div>
          </form>
        </div>

        {this.state.loaderHidden &&
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '5%'}}>ИД</th>
                  <th style={{width: '21%'}}>Название</th>
                  <th style={{width: '21%'}}>Заявитель</th>
                  <th style={{width: '20%'}}>Адрес</th>
                  <th style={{width: '20%'}}>Дата заявления</th>
                  <th style={{width: '19%'}}>Статус</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {apzs.map(function(apz, index) {
                  return(
                    <tr key={index}>
                      <td>{apz.id}</td>
                      <td>
                        {apz.project_name}

                        {apz.object_type &&
                          <span className="ml-1">({apz.object_type})</span>
                        }
                      </td>
                      <td>{apz.applicant}</td>
                      <td>{apz.project_address}</td>
                      <td>{this.toDate(apz.created_at)}</td>
                      <td>{apz.apz_status.name}</td>
                      <td>
                        <Link className="btn btn-outline-info" to={'/panel/'+this.state.rolename+'/apz/show/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
                    <Link className="page-link" to={'/panel/apz/all_history/'+user_id+'/1' + search}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page === num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/apz/all_history/' + user_id+ '/' + num + search}>{num}</Link>
                      </li>
                      );
                    })
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/apz/all_history/' + user_id + '/' + this.state.response.last_page + search}>В конец</Link>
                  </li>
                </ul>
              </nav>
            }
          </div>
        }
        <div className="col-sm-12">
          <hr />
          <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
        </div>

        {!this.state.loaderHidden &&
          <div style={{textAlign: 'center'}}>
            <br />
            <br />
            <Loader type="Oval" color="#46B3F2" height="200" width="200" />
          </div>
        }
      </div>
    )
  }
}
