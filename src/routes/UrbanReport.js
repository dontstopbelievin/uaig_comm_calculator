import React from 'react';
//import * as esriLoader from 'esri-loader';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';

export default class UrbanReport extends React.Component {

  render() {
    return (
      <div className="content container urban-apz-page">
        <div className="card">
          <div className="card-header">
            <h4 className="mb-0 h4-inline">Архитектурно-планировочное задание / Отчет</h4>
            <ul className="nav nav-tabs mb-2 pull-right">
              <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link nav-link-reports" activeStyle={{color:"black"}} to="/urbanreport/apzs/accepted" replace>Принятые</NavLink></li>
              <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link nav-link-reports" activeStyle={{color:"black"}} to="/urbanreport/apzs/declined" replace>Отказанные</NavLink></li>
            </ul>
          </div>
          <div className="card-body">
            <Switch>
              <Route path="/urbanreport/apzs/:status" component={ApzListReport} />
              <Redirect from="/urbanreport" to="/urbanreport/apzs/accepted" />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

class ApzListReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apzs: [],
      sortedApzs: [],
      periodClicked: true,
      filtr2Clicked: false,
      startDate: "",
      endDate: ""
    };

    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.getStyleForSortingType = this.getStyleForSortingType.bind(this);
  }

  onStartDateChange(e) {
    this.setState({ startDate: e.target.value });
  }

  onEndDateChange(e) {
    this.setState({ endDate: e.target.value });
  }

  changeSortingType(sortName){
    if(sortName === 'period'){
      this.sortApzs(this.props.match.params.status);
      this.setState({
        periodClicked: true,
        filtr2Clicked: false,
        startDate: "",
        endDate: ""
      });
    }
    else{
      this.setState({
        filtr2Clicked: true,
        periodClicked: false
      });
    }
  }

  getStyleForSortingType(isClicked) {
    if(isClicked === true)
      return 'sortingType';
    else
      return 'noStyleSortType';
  }

  componentWillMount() {
    //console.log("inside WillMount");
    if(sessionStorage.getItem('tokenInfo')){
      //console.log("token exist");
      if(JSON.parse(sessionStorage.getItem('userRoles'))[1] === 'Region'){
        this.props.history.replace('/urbanreport/apzs/accepted');
        //this.getApzs();
      }
      else {
        this.props.history.replace('/');
      }
    }else {
      //console.log("no token");
      this.props.history.replace('/');
    }
  }

  componentDidMount() {
    //console.log("UrbanReport Component didMount");
    if(sessionStorage.getItem('tokenInfo')){
      //console.log("token exist");
      if(JSON.parse(sessionStorage.getItem('userRoles'))[1] === 'Region'){
        this.getApzs();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    //console.log("componentWillReceiveProps is called");
    if(this.props.match.params.status !== nextProps.match.params.status) {
      this.sortApzs(nextProps.match.params.status);
    }
  }

  // get the list of all Apzs
  getApzs() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/region", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        this.setState({apzs: data});
        this.setState({sortedApzs: data.accepted});
      }
      else{
        alert("Время сессии истекло. Пожалуйста войдите заново!");
      }
    }.bind(this);
    xhr.send();
  }

  // when switching between accepted and declined
  sortApzs(status) {
    var data = this.state.apzs;
    
    switch (status) {
      case 'accepted':
        var apzs = data.accepted;
        break;

      case 'declined':
        apzs = data.declined;
        break;

      default:
        apzs = data.in_process;
        break;
    }
 
    this.setState({sortedApzs: apzs});
  }

  // give the list sorted by date
  sortByDate(start, end){
    if(!start || !end){
      alert("Выберите временной отрезок.");
    }
    else {
      var status = this.props.match.params.status;
      var endDate = this.addDay(end);
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/region/" + status + "/" + start + "/" + endDate, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function () {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          //console.log(data);
          this.setState({sortedApzs: data}); 
        }
        else if(xhr.status === 404){
          this.setState({sortedApzs: []});
          alert("По данному запросу ничего не найдено.");
        }
      }.bind(this);
      xhr.send();
    }
  }

  // add a day to endDate
  addDay(endDate){
    var end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    var day = end.getDate();
    var month = end.getMonth() + 1;
    var year = end.getFullYear();
    var formatedDate = year + "-" + month + "-" + day;
    return formatedDate;
  }

  render() {
    return (
      <div className="row">
        <div className="col-2">
          <table className="table">
            <thead>
              <tr>
                <th>Фильтр</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={this.getStyleForSortingType(this.state.periodClicked)} onClick={this.changeSortingType.bind(this, 'period')}>За период</td>
              </tr>
              <tr>
                <td className={this.getStyleForSortingType(this.state.filtr2Clicked)} onClick={this.changeSortingType.bind(this, 'filtr2')}>Второй фильтр</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-10">
          <div className="row sorting-period-header">
            <div className="col-5">
              От: <input type="date" value={this.state.startDate} onChange={this.onStartDateChange} className="form-control" name="ApzDate" />
            </div>
            <div className="col-5"> 
              До: <input type="date" value={this.state.endDate} onChange={this.onEndDateChange} className="form-control" name="ApzDate" />
            </div>
            <div className="col-2">
              <button className="btn btn-outline-info" onClick={this.sortByDate.bind(this, this.state.startDate, this.state.endDate)}>Ok</button>
            </div>  
          </div>
          <div className="row sorted-info-body">
            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '50%'}}><b>Общее количество:</b></th>
                  <th style={{width: '50%'}}>{this.state.sortedApzs.length}</th>
                </tr>
              </thead>
              <tbody>
                {this.state.sortedApzs.length > 0 &&
                  <tr style={{textAlign: 'center', fontSize: '18px', color: 'peru'}}>
                    <td colSpan="2">Список заявлении</td>
                  </tr>
                }
                {this.state.sortedApzs.length > 0 &&
                  <tr>
                    <td><b>Название</b></td>
                    <td><b>Детали</b></td>
                  </tr>
                }
                {this.state.sortedApzs.map(function(apz, index) {
                  return(
                    <tr key={index}>
                      <td>{apz.project_name}</td>
                      <td>
                        <Link className="btn btn-outline-info" to={'/urban/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                      </td>
                    </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}