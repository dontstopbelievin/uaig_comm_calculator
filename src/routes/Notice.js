import React from 'react';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';

export default class Notice extends React.Component {
  render() {
    return (
      <div className="content container notice-page">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Уведомления</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/notice/all" component={AllNotice} />
              <Route path="/notice/:id" component={ShowNotice} />
              <Redirect from="/notice" to="/notice/all" />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

class AllNotice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notices: []
    };
  }

  componentDidMount() {
    this.getNotices();
  }

  getNotices() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/notice/all", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        this.setState({notices: JSON.parse(xhr.responseText)});
      }
    }.bind(this);
    xhr.send();
  }

  toDate(date) {
    if(date === null) {
      return date;
    }
    
    var jDate = new Date(date);
    var curr_date = (jDate.getDate() < 10 ? "0" : "") + jDate.getDate();
    var curr_month = ((jDate.getMonth() + 1) < 10 ? "0" : "") + (jDate.getMonth() + 1);
    var curr_year = jDate.getFullYear();
    var curr_hour = jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
    
    return formated_date;
  }

  render() {
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th style={{width: '85%'}}>Заголовок</th>
              <th style={{width: '15%'}}>Дата</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.notices.map(function(notice, index) {
              return(
                <tr key={index}>
                  {notice.IsRead ?
                    <td>{notice.Title}</td>
                    :
                    <td><b>{notice.Title}</b></td>
                  }
                  <td>{this.toDate(notice.CreationDate)}</td>
                  <td>
                    <Link className="btn btn-outline-info" to={'/notice/' + notice.Id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                  </td>
                </tr>
                );
              }.bind(this))
            }
          </tbody>
        </table>
      </div>  
    )
  }
}

class ShowNotice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notice: [],
    };
  }

  componentWillMount() {
    this.getNoticeInfo();
  }

  getNoticeInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/notice/show/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        this.setState({notice: JSON.parse(xhr.responseText)});
      }
    }.bind(this)
    xhr.send();
  }

  render() {
    var notice = this.state.notice;

    return (
      <div>
        <h5 className="block-title-2 mt-3 mb-3">{notice.Title}</h5>
        
        {notice.Text}

        <div className="col-sm-12">
          <hr />
          <Link className="btn btn-outline-secondary pull-right" to={'/notice/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
        </div>
      </div>
    )
  }
}