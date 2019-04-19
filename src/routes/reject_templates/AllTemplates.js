import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Loader from 'react-loader-spinner';

export default class AllTemplates extends React.Component{
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
    this.getTemplates();
  }

  componentWillReceiveProps(nextProps) {
    this.getTemplates(nextProps.match.params.page, nextProps.match.params.type);
  }

  getTemplates(page = null, type =null) {
    if (!page) {
      page = this.props.match.params.page;
    }
    if(!type){
      type = this.props.match.params.type;
    }

    this.setState({ loaderHidden: false });

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/"+type+"/answer_template/all?page=" + page, true);
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
      }

      this.setState({ loaderHidden: true });
    }.bind(this);
    xhr.send();
  }

  deleteTemplate(id, title) {
    var type = this.props.match.params.type;
    if (!window.confirm('Вы действительно хотите удалить запись "' + title + '"?')) {
      return false;
    }

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/"+type+"/answer_template/delete/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        alert('Шаблон успешно удален');
        this.getTemplates();
      }
    }.bind(this);
    xhr.send();
  }

  render() {
    var type = this.props.match.params.type;
    var page = this.props.match.params.page;
    var templates = this.state.response ? this.state.response.data : [];

    return (
      <div>
        <div>
          <h4 className="mb-0">Шаблоны отказов</h4>
          <br />
        </div>
        <Link className="btn btn-outline-primary mb-3" to={"/panel/answer-template/"+type+"/add"}>Создать шаблон</Link>

        {this.state.loaderHidden &&
          <div>
            <ul className="nav nav-tabs mb-2 pull-right">
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => type === 'apz'} to="/panel/answer-template/all/apz/1" replace>АПЗ</NavLink></li>
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => type === 'sketch'} to="/panel/answer-template/all/sketch/1" replace>Эскизный проект</NavLink></li>
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => type === 'landinlocality'} to="/panel/answer-template/all/landinlocality/1" replace>Права на зем. участка</NavLink></li>
            </ul>
            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '70%'}}>Название</th>
                  <th style={{width: '20%'}}>Активность</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {templates.map(function(template, index) {
                  return(
                    <tr key={index}>
                      <td>{template.title} </td>
                      <td>
                        {template.is_active === 1 ?
                          <p className="text-success">Активен</p>
                          :
                          <p className="text-danger">Не активен</p>
                        }
                      </td>
                      <td>
                        <div className="btn-group btn-group-xs" style={{margin: '0'}} role="group">
                          <Link className="btn btn-outline-info" to={'/panel/answer-template/show/'+type+"/" + template.id}><i className="glyphicon glyphicon-pencil mr-2"></i> Изменить</Link>
                          <button className="btn btn-outline-danger" onClick={this.deleteTemplate.bind(this, template.id, template.title)}><i className="glyphicon glyphicon-trash mr-2"></i> Удалить</button>
                        </div>
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
                    <Link className="page-link" to={'/panel/answer-template/all/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page === num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/answer-template/all/' + num}>{num}</Link>
                      </li>
                      );
                    })
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/answer-template/all/' + this.state.response.last_page}>В конец</Link>
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
