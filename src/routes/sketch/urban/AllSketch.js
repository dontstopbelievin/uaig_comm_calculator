import React from 'react';
import {Link, NavLink, Switch} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import $ from 'jquery';

export default class AllSketch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaderHidden: false,
            response: null,
            pageNumbers: [],
            regions:[],
            // current_region: ""
        };

    }

    componentDidMount() {
        this.props.breadCrumbs();
        this.getSketches();
    }

    componentWillMount() {
        var data = JSON.parse(sessionStorage.getItem('userRoles'));
        var select_regions = [];
        for (var i = 2; i < data.length; i++) {
            select_regions.push(<option value={data[i]}> {data[i]} </option>);
        }
        this.setState({regions: select_regions});
        // this.setState({current_region: data[2]});
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
        var xhr = new XMLHttpRequest();
        // xhr.open("get", window.url + "api/sketch/region/all/" + status + '/' + this.state.current_region + '?page=' + page, true);
        xhr.open("get", window.url + "api/sketch/region/all/" + status + '?page=' + page, true);
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

    // handleRegionChange(event){
    //     this.setState({current_region: event.target.value}, function stateUpdateComplete() {
    //         this.getSketches();
    //     }.bind(this));
    // }

    render() {
        var status = this.props.match.params.status;
        var page = this.props.match.params.page;
        var sketches = this.state.response ? this.state.response.data : [];

        return (
            <div>
                {this.state.loaderHidden &&
                <div>
                    <div>
                        <h4 className="mb-0">Эскизные проекты</h4>
                    </div>
                    {/*<div style={{fontSize: '18px', margin: '10px 0px'}}>*/}
                        {/*<b>Выберите регион:</b>*/}
                        {/*<select style={{padding: '0px 4px', margin: '5px'}} value={this.state.current_region} onChange={this.handleRegionChange.bind(this)}>*/}
                            {/*{this.state.regions}*/}
                        {/*</select>*/}
                    {/*</div>*/}
                    <ul className="nav nav-tabs mb-2 pull-right">
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/urban/sketch/status/active/1" replace>Активные</NavLink></li>
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/urban/sketch/status/accepted/1" replace>Принятые</NavLink></li>
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/urban/sketch/status/declined/1" replace>Отказанные</NavLink></li>
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
                                        <Link className="btn btn-outline-info" to={'/panel/urban/sketch/show/' + sketch.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
                                <Link className="page-link" to={'/panel/urban/sketch/status/' + status + '/1'}>В начало</Link>
                            </li>

                            {this.state.pageNumbers.map(function(num, index) {
                                return(
                                    <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                                        <Link className="page-link" to={'/panel/urban/sketch/status/' + status + '/' + num}>{num}</Link>
                                    </li>
                                );
                            }.bind(this))
                            }
                            <li className="page-item">
                                <Link className="page-link" to={'/panel/urban/sketch/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
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
