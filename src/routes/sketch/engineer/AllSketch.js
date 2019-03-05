import React from 'react';
import $ from 'jquery';
import 'jquery-serializejson';
import { NavLink, Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';

export default class AllSketch extends React.Component {
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
        this.getSketches();
    }

    componentWillReceiveProps(nextProps) {
        this.getSketches(nextProps.match.params.status, nextProps.match.params.page);
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
        var roles = JSON.parse(sessionStorage.getItem('userRoles'));

        if (roles == null) {
            sessionStorage.clear();
            alert("Token is expired, please login again!");
            this.props.history.replace("/login");
            return false;
        }

        //var providerName = roles[1];
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/sketch/engineer/all/" + status + '?page=' + page, true);
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

    toSketch(id, e) {
        this.props.history.push('/panel/engineer/sketch/show/' + id);
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
                    <ul className="nav nav-tabs mb-2 pull-right">
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/engineer/sketch/status/active/1" replace>Активные</NavLink></li>
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/engineer/sketch/status/accepted/1" replace>Принятые</NavLink></li>
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/engineer/sketch/status/declined/1" replace>Отказанные</NavLink></li>
                    </ul>

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
                        {sketches.map(function(sketch, index) {
                            return(
                                <tr style={{background: !sketch.commission ? '#e1e7ef' : ''}} key={index} className="cursor" onClick={this.toSketch.bind(this, sketch.id)}>
                                    <td>
                                        {sketch.id}
                                    </td>
                                    <td>
                                        {this.toDate(sketch.created_at)}
                                    </td>
                                    <td>
                                        {sketch.object_type &&
                                        <span className="ml-1">({sketch.object_type})</span>
                                        }
                                    </td>
                                    <td>
                                        {sketch.applicant}
                                    </td>
                                    <td>
                                        {sketch.project_address}
                                    </td>
                                    <td>
                                        {sketch.region}
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
                                <Link className="page-link" to={'/panel/engineer/sketch/status/' + status + '/1'}>В начало</Link>
                            </li>

                            {this.state.pageNumbers.map(function(num, index) {
                                return(
                                    <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                                        <Link className="page-link" to={'/panel/engineer/sketch/status/' + status + '/' + num}>{num}</Link>
                                    </li>
                                );
                            }.bind(this))
                            }
                            <li className="page-item">
                                <Link className="page-link" to={'/panel/engineer/sketch/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
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
