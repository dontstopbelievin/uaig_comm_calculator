import React from 'react';
import EsriLoaderReact from 'esri-loader-react';
import $ from 'jquery';
import 'jquery-serializejson';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import saveAs from 'file-saver';

export default class EngineerAllApzs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderHidden: false,
      response: null,
      data: [],
      data_reserve: [],
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
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Token is expired, please login again!");
        this.props.history.replace("/login");
        return false;
    }

    //var providerName = roles[1];
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/engineer/all/" + status + '?page=' + page, true);
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
        this.setState({data: response.data});
        this.setState({data_reserve: response.data});
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
    var curr_hour = jDate.getHours() < 10 ? "0" + jDate.getHours() : jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;

    return formated_date;
  }

  toApz(id, e) {
    this.props.history.push('/panel/engineer/apz/show/' + id);
  }

  handleSearch(e){
    if(e.target.value.trim() == ''){this.setState({data: this.state.data_reserve}); return;}
    var items = e.target.value.trim().split(' ');
    var data = this.state.data_reserve.filter(function(obj) {
        for(var i = 0; i < items.length; i++){
          if(obj.applicant.toLowerCase().includes(items[i].toLowerCase())){continue;}
          else{return false;}
        }
       return true;
     });
    this.setState({data: data});
  }

  render() {
    var status = this.props.match.params.status;
    var page = this.props.match.params.page;
    var apzs = this.state.data ? this.state.data : [];

    return (
      <div>
        <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание <NavLink exact className="btn btn-raised btn-primary btn-sm" to="/panel/engineer/apz/search/1" replace>Расширенный поиск</NavLink></h4>
        </div>
        {this.state.loaderHidden &&
          <div>
            <table style={{width:'100%'}}><tbody>
            <tr><td>
              <input placeholder="Поиск по ФИО" type="text" className="mb-2" id="filter" onChange={this.handleSearch.bind(this)} style={{padding:'3px'}}/>
            </td><td>
              <ul className="nav nav-tabs mb-2 pull-right">
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/engineer/apz/status/active/1" replace>Активные</NavLink></li>
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'awaiting'} to="/panel/engineer/apz/status/awaiting/1" replace>Комм. службы в процессе</NavLink></li>
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'complete'} to="/panel/engineer/apz/status/complete/1" replace>Комм. службы выполнены</NavLink></li>
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/engineer/apz/status/accepted/1" replace>Принятые</NavLink></li>
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/engineer/apz/status/declined/1" replace>Отказанные</NavLink></li>
              </ul>
            </td></tr></tbody>
            </table>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '5%'}}>ИД</th>
                  <th style={{width: '16%'}}>Дата</th>
                  <th style={{width: '5%'}}>Тип</th>
                  <th style={{width: '16%'}}>Заявитель</th>
                  <th style={{width: '16%'}}>Адрес</th>
                  <th style={{width: '16%'}}>Район</th>
                  {/*<th></th>*/}
                </tr>
              </thead>

              <tbody className="tbody">
                {apzs.map(function(apz, index) {
                  return(
                    <tr style={{background: !apz.commission ? '#e1e7ef' : ''}} key={index} className="cursor" onClick={this.toApz.bind(this, apz.id)}>
                      <td>
                        {apz.id}
                      </td>
                      <td>
                        {this.toDate(apz.created_at)}
                      </td>
                      <td>
                        {apz.object_type &&
                          <span className="ml-1">({apz.object_type})</span>
                        }
                      </td>
                      <td>
                        {apz.applicant}
                      </td>
                      <td>
                        {apz.project_address}
                      </td>
                      <td>
                        {apz.region}
                      </td>
                      {/*<td>*/}
                        {/*<Link className="btn btn-outline-info" to={'/panel/engineer/apz/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>*/}
                      {/*</td>*/}
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
                    <Link className="page-link" to={'/panel/engineer/apz/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/engineer/apz/status/' + status + '/' + num}>{num}</Link>
                      </li>
                      );
                    }.bind(this))
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/engineer/apz/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
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
