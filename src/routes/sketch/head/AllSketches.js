import React from 'react';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import {NavLink, Link } from 'react-router-dom';


export default class AllSketches extends React.Component {

      constructor(props) {
          super(props);

          this.state = {
              loaderHidden: false,
              response: null,
              current_head: '',
              apz_heads:[],
              pageNumbers: []
          };
      }

      componentDidMount() {
          this.props.breadCrumbs();
      }

      componentWillMount() {
          this.getHeads();
      }

      componentWillReceiveProps(nextProps) {
          this.getSketches(nextProps.match.params.status, nextProps.match.params.page);
      }

      getHeads(){
          var token = sessionStorage.getItem('tokenInfo');
          var xhr = new XMLHttpRequest();
          xhr.open("get", window.url + "api/apz/getheads", true);
          xhr.setRequestHeader("Authorization", "Bearer " + token);
          xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
          xhr.onload = function() {
              if (xhr.status === 200) {
                  var data = JSON.parse(xhr.responseText);
                  //console.log(data);
                  var select_directors = [];
                  for (var i = 0; i < data.length; i++) {
                      select_directors.push(<option value={data[i].user_id}> {data[i].last_name +' ' + data[i].first_name+' '+data[i].middle_name} </option>);
                  }
                  this.setState({apz_heads: select_directors});
                  if(this.state.current_head == "" || this.state.current_head == " "){
                      this.setState({current_head: data[0].user_id}, function stateUpdateComplete() {
                          this.getSketches();
                      }.bind(this));
                  }
              }
          }.bind(this);
          xhr.send();
      }

      getSketches(status = null, page = null) {
          if (!status) {
              status = this.props.match.params.status;
          }

          if (!page) {
              page = this.props.match.params.page;
          }

          this.setState({ loaderHidden: false });

          var token = sessionStorage.getItem('tokenInfo');
          var xhr = new XMLHttpRequest();
          xhr.open("get", window.url + "api/sketch/head/all/" + status + '/' + this.state.current_head + '?page=' + page, true);
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
              }

              this.setState({ loaderHidden: true });
          }.bind(this);
          xhr.send();
      }

      handleHeadChange(event){
          this.setState({current_head: event.target.value}, function stateUpdateComplete() {
              this.getSketches();
          }.bind(this));
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
          var sketches = this.state.response ? this.state.response.data : [];

          return (
              <div>
                  <div className="card-header">
                      <h4 className="mb-0">Эскизные проекты</h4>
                  </div>
                  {this.state.loaderHidden &&
                  <div>
                      <div style={{fontSize: '18px', margin: '10px 0px'}}>
                          <b>Выберите главного архитектора:</b>
                          <select style={{padding: '0px 4px', margin: '5px'}} value={this.state.current_head} onChange={this.handleHeadChange.bind(this)}>
                              {this.state.apz_heads}
                          </select>
                      </div>
                      <ul className="nav nav-tabs mb-2 pull-right">
                          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/head/sketch/status/active/1" replace>Активные</NavLink></li>
                          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'inproccess'} to="/panel/head/sketch/status/inproccess/1" replace>В процессе</NavLink></li>
                          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/head/sketch/status/accepted/1" replace>Принятые</NavLink></li>
                          <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/head/sketch/status/declined/1" replace>Отказанные</NavLink></li>
                      </ul>

                      <table className="table">
                          <thead>
                          <tr>
                              <th style={{width: '5%'}}>ИД</th>
                              <th style={{width: '21%'}}>Название</th>
                              <th style={{width: '20%'}}>Заявитель</th>
                              <th style={{width: '20%'}}>Адрес</th>
                              <th style={{width: '20%'}}>Дата заявления</th>
                              <th></th>
                          </tr>
                          </thead>
                          <tbody>
                          {sketches.map(function(sketch, index) {
                              return(
                                  <tr key={index}>
                                      <td>{sketch.id}</td>
                                      <td>
                                          {sketch.project_name}

                                          {sketch.object_type &&
                                          <span className="ml-1">({sketch.object_type})</span>
                                          }
                                      </td>
                                      <td>{sketch.applicant}</td>
                                      <td>{sketch.project_address}</td>
                                      <td>{this.toDate(sketch.created_at)}</td>
                                      <td>
                                          <Link className="btn btn-outline-info" to={'/panel/head/sketch/show/' + sketch.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
                                  <Link className="page-link" to={'/panel/head/sketch/status/' + status + '/1'}>В начало</Link>
                              </li>

                              {this.state.pageNumbers.map(function(num, index) {
                                  return(
                                      <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                                          <Link className="page-link" to={'/panel/head/sketch/status/' + status + '/' + num}>{num}</Link>
                                      </li>
                                  );
                              }.bind(this))
                              }
                              <li className="page-item">
                                  <Link className="page-link" to={'/panel/head/sketch/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
                              </li>
                          </ul>
                      </nav>
                      }
                  </div>
                  }

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
