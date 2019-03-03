import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Loader from 'react-loader-spinner';

export default class AllApzs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderHidden: false,
      response: null,
      data: [],
      data_reserve: [],
      pageNumbers: [],
      searchApz: '',
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.getApzs();
  }

  componentDidMount() {
    this.props.breadCrumbs();
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
    console.log(sessionStorage.getItem('userRoles'));
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/lawyer/all/" + status + '?page=' + page, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response);
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
    xhr.onerror = function () {
      alert('Сервер не отвечает');
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
  handleSearch(e){
    if(e.target.value.trim() === ''){this.setState({data: this.state.data_reserve}); return;}
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
        {this.state.loaderHidden &&
          <div>
            <div>
              <h4 className="mb-0">Архитектурно-планировочное задание</h4>
            </div>
            <table style={{width:'100%'}}><tbody>
            <tr><td>
              <input placeholder="Поиск по ФИО" type="text" className="mb-2" id="filter" onChange={this.handleSearch} style={{padding:'3px'}}/>
            </td><td>
              <ul className="nav nav-tabs mb-2 pull-right">
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'new'} to="/panel/lawyer/apz/status/new/1" replace>Новые</NavLink></li>
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'processed'} to="/panel/lawyer/apz/status/processed/1" replace>Обработанные</NavLink></li>
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/lawyer/apz/status/accepted/1" replace>Принятые</NavLink></li>
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/lawyer/apz/status/declined/1" replace>Отказанные</NavLink></li>
              </ul>
            </td></tr></tbody>
            </table>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '7%'}} className="apzs_header" onClick={this.sortData.bind(this, 'id')}>ИД<img className="filter_img" src="/images/filter_icon.png"/></th>
                  <th style={{width: '19%'}} className="apzs_header" onClick={this.sortData.bind(this, 'project_name')}>Название<img className="filter_img" src="/images/filter_icon.png"/></th>
                  <th style={{width: '20%'}} className="apzs_header" onClick={this.sortData.bind(this, 'applicant')}>Заявитель<img className="filter_img" src="/images/filter_icon.png"/></th>
                  <th style={{width: '20%'}} className="apzs_header" onClick={this.sortData.bind(this, 'project_address')}>Адрес<img className="filter_img" src="/images/filter_icon.png"/></th>
                  <th style={{width: '20%'}} className="apzs_header" onClick={this.sortData.bind(this, 'created_at')}>Дата заявления<img className="filter_img" src="/images/filter_icon.png"/></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {apzs && apzs.map(function(apz, index) {
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
                      <td>
                        <Link className="btn btn-outline-info" to={'/panel/lawyer/apz/show/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
                    <Link className="page-link" to={'/panel/lawyer/apz/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page === num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/lawyer/apz/status/' + status + '/' + num}>{num}</Link>
                      </li>
                      );
                    })
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/lawyer/apz/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
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
