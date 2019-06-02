import React from 'react';
import 'jquery-validation';
import 'jquery-serializejson';
import { Link, NavLink } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import LocalizedStrings from 'react-localization';
import { ru, kk } from '../../languages/header.json';

class AllApzs extends React.Component {
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
    this.getApzs();
  }

  componentWillReceiveProps(nextProps) {
    this.getApzs(nextProps.match.params.status, nextProps.match.params.page);
  }

  getApzs(status = null, page = null) {
    if (!status) {
      status = this.props.match.params.status;
    }

    if (!page) {
      page = this.props.match.params.page;
    }

    this.setState({ loaderHidden: false });

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/admin/all/" + status + '?page=' + page, true);
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

        this.setState({ pageNumbers: pageNumbers });
        this.setState({ response: response });
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }

      this.setState({ loaderHidden: true });
    }.bind(this)
    xhr.send();
  }

  toDate(date) {
    if (date === null) {
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
    var status = this.props.match.params.status;
    var page = this.props.match.params.page;
    var apzs = this.state.response ? this.state.response.data : [];

    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <h4 className="mb-0 mt-2">Архитектурно-планировочные задания</h4>
            <div className="row">
              <div className="col-sm-5 statusActive">
                <ul className="nav nav-tabs mb-2 pull-right">
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'active'} activeStyle={{ color: "black" }} to="/panel/admin/apz/status/active/1" replace>Активные</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'draft'} activeStyle={{ color: "black" }} to="/panel/admin/apz/status/draft/1" replace>Черновики</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'accepted'} activeStyle={{ color: "black" }} to="/panel/admin/apz/status/accepted/1" replace>Принятые</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'declined'} activeStyle={{ color: "black" }} to="/panel/admin/apz/status/declined/1" replace>Отказанные</NavLink></li>
                </ul>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '23%' }}>Название</th>
                  <th style={{ width: '23%' }}>Заявитель</th>
                  <th style={{ width: '20%' }}>Адрес</th>
                  <th style={{ width: '20%' }}>Дата заявления</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {apzs.map(function (apz, index) {
                  return (
                    <tr key={index}>
                      <td>
                        {apz.project_name}

                        {apz.object_type &&
                          <span className="ml-1">({apz.object_type})</span>
                        }
                      </td>
                      <td>{apz.applicant}</td>
                      <td>{apz.project_address}</td>
                      <td>{this.toDate(apz.created_at)}</td>
                      <td style={{ padding: '0px' }}>
                        <Link className="btn btn-outline-info btn-sm" to={'/panel/admin/apz/show/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                        <Link className="btn btn-outline-info btn-sm" to={'/panel/admin/apz/update/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Редактировать</Link>
                      </td>
                    </tr>
                  );
                }.bind(this))
                }

                {apzs.length === 0 &&
                  <tr>
                    <td colSpan="5">Пусто</td>
                  </tr>
                }
              </tbody>
            </table>

            {this.state.response && this.state.response.last_page > 1 &&
              <nav className="pagination_block">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/admin/apz/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function (num, index) {
                    return (
                      <li key={index} className={'page-item ' + (page === num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/admin/apz/status/' + status + '/' + num}>{num}</Link>
                      </li>
                    );
                  })
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/admin/apz/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
                  </li>
                </ul>
              </nav>
            }
          </div>
        }

        {!this.state.loaderHidden &&
          <div style={{ textAlign: 'center' }}>
            <Loader type="Oval" color="#46B3F2" height="200" width="200" />
          </div>
        }
      </div>
    )
  }
};

export { AllApzs }