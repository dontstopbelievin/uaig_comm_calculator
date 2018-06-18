import React from 'react';
import $ from 'jquery';
import { Route, Link,  Switch, Redirect } from 'react-router-dom';

export default class Search extends React.Component {
  render() {
    return (
      <div className="content container body-content">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Результат поиска</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/search/:query" component={SearchResults} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

class SearchResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      response: [],
      //pageNumbers: []
    };
  }

  componentDidMount() {
    this.search();
  }

  componentWillReceiveProps(nextProps) {
    this.search(nextProps.match.params.query);
  }

  search(q) {
    var query = q ? q : this.props.match.params.query;
    var searchField = document.getElementById('search_field').value = query;
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/search?query=" + query, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        this.setState({response: data.result});
      }
    }.bind(this);
    xhr.send();
  }

  getLink(item) {
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    if (item.heading_id) {
      return '/NewsArticle/' + item.id;
    }

    if (item.id) {
      return '/page/' + item.id;
    }

    switch(roles[0]) {
      case 'Citizen':
        return '/citizen/';

      case 'Urban':
        return '/urban/';

      case 'Engineer':
        return '/engineer/';

      case 'Provider':
        if (roles[1] === 'Electricity') {
          return '/providerelectro/';
        } else if(roles[1] === 'Gas') {
          return '/providergas/';
        } else if (roles[1] === 'Heat') {
          return '/providerheat/';
        } else if (roles[1] === 'Phone') {
          return '/providerphone/';
        } else {
          return '/providerwater/';
        }

      case 'ApzDepartment': 
        return '/apz_department/';

      case 'Head': 
        return '/head/';

      default: 
        return '/';
    }
  }

  render() {
    var response = this.state.response ? this.state.response : [];

    return (
      <div className="search_results">
        {response.length > 0 ?
          <div>
            {response.map(function(item, index) {
              return(
                <div className="search_item" key={index}>
                  <h4><Link to={this.getLink(item)}>{item.title}</Link></h4>
                  <p>{item.description}</p>
                </div>
                );
              }.bind(this))
            }
          </div>
          :
          <div>Поиск не дал резльтатов</div>
        }
        
      </div>
    )
  }
}