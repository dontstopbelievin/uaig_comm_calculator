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
              <Route path="/urbanreport/apzs/:status" component={ApzList} />
              <Redirect from="/urbanreport" to="/urbanreport/apzs/accepted" />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

class ApzList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apzs: [],
      sortingType: ""
    };

  }

  channgeSortingType(sortName){
    this.setState({sortingType: sortName});
  }

  componentDidMount() {
    this.getApzs();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.status !== nextProps.match.params.status) {
       this.getApzs(nextProps.match.params.status);
   }
  }

  getApzs(status = null) {
    if (!status) {
      status = this.props.match.params.status;
    }

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/region", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        
        switch (status) {
          case 'accepted':
            var apzs = data.filter(function(obj) { return ((obj.Status === 0 || obj.Status === 1 || obj.Status === 3 || obj.Status === 4) && (obj.RegionDate !== null && obj.RegionResponse === null)); });
            break;

          case 'declined':
            apzs = data.filter(function(obj) { return (obj.Status === 0 && (obj.RegionDate !== null && obj.RegionResponse !== null)); });
            break;

          default:
            apzs = data;
            break;
        }
        
        this.setState({apzs: apzs});
      }
    }.bind(this);
    xhr.send();
  }

  render() {
    return (
      <div>
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
                  <td><a style={{cursor: 'pointer'}} onClick={this.channgeSortingType.bind(this, 'byDate')}>За период</a></td>
                </tr>
                <tr>
                  <td><a style={{cursor: 'pointer'}} onClick={this.channgeSortingType.bind(this, 'byRegion')}>По районам</a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-10">
            {(this.state.sortingType === 'byDate' || this.state.sortingType === '') &&
              <table className="table">
                <thead>
                  <tr>
                    <th style={{width: '50%'}}><b>За период</b></th>
                    <th style={{width: '50%'}}>
                      От: <input type="date" className="" name="ApzDate" /> 
                      До: <input type="date" className="" name="ApzDate" /> 
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Общее количество</td>
                    <td>{this.state.apzs.length}</td>
                  </tr>
                  {this.state.apzs.length > 0 &&
                    <tr style={{textAlign: 'center', fontSize: '18px', color: 'peru'}}>
                      <td colSpan="2">Список заявлении</td>
                    </tr>
                  }
                  {this.state.apzs.length > 0 &&
                    <tr>
                      <td><b>Название</b></td>
                      <td><b>Детали</b></td>
                    </tr>
                  }
                  {this.state.apzs.map(function(apz, index) {
                    return(
                      <tr key={index}>
                        <td>{apz.ProjectName}</td>
                        <td>
                          <Link className="btn btn-outline-info" to={'/urban/' + apz.Id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                        </td>
                      </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            }
            {this.state.sortingType === 'byRegion' &&
              <table className="table">
                <thead>
                  <tr>
                    <th style={{width: '50%'}}><b>По районам</b></th>
                    <th style={{width: '50%'}}>Выберите район: {' '}
                      <select className="" value={this.state.value} onChange={this.onRegionChange}>
                        <option>Выбрать&hellip;</option>
                        <option>Алатау</option>
                        <option>Алмалы</option>
                        <option>Ауезов</option>
                        <option>Бостандық</option>
                        <option>Жетісу</option>
                        <option>Медеу</option>
                        <option>Наурызбай</option>
                        <option>Турксиб</option>
                      </select></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Общее количество</td>
                    <td>{this.state.apzs.length}</td>
                  </tr>
                  {this.state.apzs.length > 0 &&
                    <tr style={{textAlign: 'center', fontSize: '18px', color: 'peru'}}>
                      <td colSpan="2">Список заявлении</td>
                    </tr>
                  }
                  {this.state.apzs.length > 0 &&
                    <tr>
                      <td><b>Название</b></td>
                      <td><b>Детали</b></td>
                    </tr>
                  }
                  {this.state.apzs.map(function(apz, index) {
                    return(
                      <tr key={index}>
                        <td>{apz.ProjectName}</td>
                        <td>
                          <Link className="btn btn-outline-info" to={'/urban/' + apz.Id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                        </td>
                      </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            }
          </div>
        </div>
      </div>  
    )
  }
}