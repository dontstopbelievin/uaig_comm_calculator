import React from 'react';
import 'jquery-validation';
import 'jquery-serializejson';
import { Link, NavLink } from 'react-router-dom';
import Loader from 'react-loader-spinner';

export default class AllApplications extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loaderHidden: false,
        response: [],
        data:[],
        pageNumbers: []
      };

    }
    componentDidMount() {
      this.props.breadCrumbs();
      this.getApplications();
    }

    componentWillReceiveProps(nextProps) {
      this.getApplications(nextProps.match.params.status, nextProps.match.params.page);
    }

    getApplications(status = null, page = null) {
      if (!status) {
        status = this.props.match.params.status;
      }

      if (!page) {
        page = this.props.match.params.page;
      }

      this.setState({ loaderHidden: false });

      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/relig_building/citizen/all/" + status + '?page=' + page, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
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
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
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

    render() {
      return (
        <div>
          {this.state.loaderHidden &&
            <div>
              <div className="card-header">
                <h4 className="mb-0 mt-2 col-sm-7" style={{paddingLeft:'0px', paddingBottom:'5px'}}>Выдача решения о строительстве культовых зданий </h4>
              </div>
              <div className="row">
                <div className="col-sm-7">
                  <Link className="btn btn-outline-primary mb-3" to="/panel/citizen/religbuilding/add">Создать заявление</Link>
                </div>
                <div className="col-sm-5 statusActive">
                  <ul className="nav nav-tabs mb-2 pull-right">
                    <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => this.props.match.params.status === 'active'} activeStyle={{color:"black"}} to="/panel/citizen/religbuilding/status/active/1" replace>Активные</NavLink></li>
                    <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => this.props.match.params.status === 'draft'} activeStyle={{color:"black"}} to="/panel/citizen/religbuilding/status/draft/1" replace>Черновики</NavLink></li>
                    <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => this.props.match.params.status === 'accepted'} activeStyle={{color:"black"}} to="/panel/citizen/religbuilding/status/accepted/1" replace>Принятые</NavLink></li>
                    <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => this.props.match.params.status === 'declined'} activeStyle={{color:"black"}} to="/panel/citizen/religbuilding/status/declined/1" replace>Отказанные</NavLink></li>
                  </ul>
                </div>
              </div>

              <table className="table allapzs_fonts">
                <thead>
                  <tr>
                    <th style={{width: '7%'}} className="apzs_header" onClick={this.sortData.bind(this, 'id')}>ИД<img className="filter_img" src="/images/filter_icon.png"/></th>
                    <th style={{width: '25%'}} className="apzs_header" onClick={this.sortData.bind(this, 'applicant')}>Заявитель<img className="filter_img" src="/images/filter_icon.png"/></th>
                    <th style={{width: '30%'}} className="apzs_header" onClick={this.sortData.bind(this, 'project_address')}>Адрес земельного участка<img className="filter_img" src="/images/filter_icon.png"/></th>
                    <th style={{width: '25%'}} className="apzs_header" onClick={this.sortData.bind(this, 'created_at')}>Дата заявления<img className="filter_img" src="/images/filter_icon.png"/></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.response.data && this.state.response.data.map(function(applications, index) {
                    return(
                      <tr key={index}>
                        <td>{applications.id}</td>
                        <td>{applications.applicant}</td>
                        <td>{applications.land_address}</td>
                        <td>{this.toDate(applications.application_start)}</td>
                        <td>
                          <Link className="btn btn-outline-info btn-sm allapz_btn" to={'/panel/citizen/religbuilding/' + (applications.status_id === 5 ? 'edit/' : 'show/') + applications.id}><i className="glyphicon glyphicon-eye-open small"></i> Просмотр</Link>
                          {applications.status_id === 1 &&
                             <Link className="btn btn-outline-info btn-sm allapz_btn" to={'/panel/citizen/religbuilding/edit/'+ applications.id}><i className="glyphicon glyphicon-eye-open small"></i>Переотправить</Link>
                          }
                        </td>
                      </tr>
                      );
                    }.bind(this))
                  }

                  {this.state.response.data == null &&
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
                      <Link className="page-link" to={'/panel/citizen/religbuilding/status/' + this.props.match.params.status + '/1'}>В начало</Link>
                    </li>

                    {this.state.pageNumbers.map(function(num, index) {
                      return(
                        <li key={index} className={'page-item ' + (this.props.match.params.page === num ? 'active' : '')}>
                          <Link className="page-link" to={'/panel/citizen/religbuilding/status/' + this.props.match.params.status + '/' + num}>{num}</Link>
                        </li>
                        );
                      })
                    }
                    <li className="page-item">
                      <Link className="page-link" to={'/panel/citizen/religbuilding/status/' + this.props.match.params.status + '/' + this.state.response.last_page}>В конец</Link>
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
