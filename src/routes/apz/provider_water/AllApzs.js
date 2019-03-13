import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';

export default class AllApzs extends React.Component {
  constructor(props) {
    super(props);

    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    this.state = {
      loaderHidden: false,
      isPerformer: roles != null ? (roles.indexOf('PerformerWater') !== -1) : null,
      response: null,
      data: null,
      pageNumbers: []
    };

  }

  componentDidMount() {
    //console.log('1');
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
      return false;
    }
    var directorId = JSON.parse(sessionStorage.getItem('userId'));
    var providerName = roles[1];
    var xhr = new XMLHttpRequest();
    if(roles[2] === 'DirectorWater'){
      xhr.open("get", window.url + "api/apz/provider/" + providerName + "/all/" + status + "/" + directorId + '?page=' + page, true);
    }else{
      xhr.open("get", window.url + "api/apz/provider/" + providerName + "/all/" + status + "/0?page=" + page, true);
    }
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
      }

      this.setState({ loaderHidden: true });
    }.bind(this);
    xhr.send();
  }
  sortData(column){
    if(this.state.sortState == 'ASC'){
      this.setState({ sortState: 'DESC'});
      this.setState({ data: this.state.data.sort(function(a, b){
          if(a[column] > b[column]) { return -1; }
          if(a[column] < b[column]) { return 1; }
          return 0;
      }) });
    }else{
      this.setState({ sortState: 'ASC'});
      this.setState({ data: this.state.data.sort(function(a, b){
          if(a[column] < b[column]) { return -1; }
          if(a[column] > b[column]) { return 1; }
          return 0;
      }) });
    }
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
    var status = this.props.match.params.status;
    var page = this.props.match.params.page;
    var apzs = this.state.data ? this.state.data : [];

    return (
      <div>
        <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание</h4>
        </div>
        {this.state.loaderHidden &&
          <div>
            <ul className="nav nav-tabs mb-2 pull-right">
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/water-provider/apz/status/active/1" replace>Активные</NavLink></li>

              {this.state.isPerformer &&
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'awaiting'} to="/panel/water-provider/apz/status/awaiting/1" replace>В ожидании</NavLink></li>
              }

              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/water-provider/apz/status/accepted/1" replace>Принятые</NavLink></li>
              <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/water-provider/apz/status/declined/1" replace>Отказанные</NavLink></li>
            </ul>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '14%'}} className="apzs_header" onClick={this.sortData.bind(this, 'id')}>Дата поступления<img className="filter_img" src="/images/filter_icon.png"/></th>
                  <th style={{width: '5%'}} className="apzs_header" onClick={this.sortData.bind(this, 'id')}>№<img className="filter_img" src="/images/filter_icon.png"/></th>
                  <th style={{width: '14%'}} className="apzs_header" onClick={this.sortData.bind(this, 'created_at')}>Дата<img className="filter_img" src="/images/filter_icon.png"/></th>
                  <th style={{width: '17%'}} className="apzs_header" onClick={this.sortData.bind(this, 'applicant')}>Заявитель<img className="filter_img" src="/images/filter_icon.png"/></th>
                  <th style={{width: '18%'}} className="apzs_header" onClick={this.sortData.bind(this, 'project_name')}>Название<img className="filter_img" src="/images/filter_icon.png"/></th>
                  <th style={{width: '18%'}} className="apzs_header" onClick={this.sortData.bind(this, 'object_type')}>Адрес<img className="filter_img" src="/images/filter_icon.png"/></th>

                  {(status === 'active' || status === 'awaiting') &&
                    <th style={{width: '14%'}} className="apzs_header" onClick={this.sortData.bind(this, 'provider_deadline')}>Срок<img className="filter_img" src="/images/filter_icon.png"/></th>
                  }
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {apzs.map(function(apz, index) {
                  return(
                    <tr key={index}>
                      <td>{this.toDate(apz.commission.created_at)}</td>
                      <td>{apz.id}</td>
                      <td>{this.toDate(apz.created_at)}</td>
                      <td>{apz.applicant}</td>
                      <td>
                        {apz.project_name}

                        {apz.object_type &&
                          <span className="ml-1">({apz.object_type})</span>
                        }
                      </td>
                      <td>{apz.project_address}</td>
                      {(status === 'active' || status === 'awaiting') &&
                        <td>
                          {apz.provider_deadline ?
                            this.toDate(apz.provider_deadline)
                            :
                            this.toDate(apz.term.date)}
                        </td>
                      }
                      <td>
                        <Link className="btn btn-outline-info" to={'/panel/water-provider/apz/show/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
                    <Link className="page-link" to={'/panel/water-provider/apz/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page === num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/water-provider/apz/status/' + status + '/' + num}>{num}</Link>
                      </li>
                      );
                    })
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/water-provider/apz/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
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
