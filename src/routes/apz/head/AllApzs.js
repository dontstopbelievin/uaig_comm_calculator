import React from 'react';
import Loader from 'react-loader-spinner';
import { NavLink, Link } from 'react-router-dom';

export default class AllApzs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaderHidden: false,
            response: null,
            current_head: '',
            data: null,
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
        this.getApzs(nextProps.match.params.status, nextProps.match.params.page);
    }

    getHeads(){
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/apz/getsortheads", true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                //console.log(data);
                var select_directors = [];
                for (var i = 0; i < data.length; i++) {
                    select_directors.push(<option key={i} value={data[i].user_id}> {data[i].last_name +' ' + data[i].first_name+' '+data[i].middle_name} </option>);
                }
                this.setState({apz_heads: select_directors});
                if(this.state.current_head === "" || this.state.current_head === " "){
                    this.setState({current_head: data[0].user_id}, function stateUpdateComplete() {
                        this.getApzs();
                    }.bind(this));
                }
            }
        }.bind(this);
        xhr.send();
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
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/apz/head/all/" + status + '/' + this.state.current_head + '?page=' + page, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                //console.log(response);
                var pageNumbers = [];
                var start = (response.current_page - 4) > 0 ? (response.current_page - 4) : 1;
                var end = (response.current_page + 4) < response.last_page ? (response.current_page + 4) : response.last_page;

                for (start; start <= end; start++) {
                    pageNumbers.push(start);
                }

                this.setState({pageNumbers: pageNumbers});
                this.setState({response: response});
                this.setState({data: response.data});
            }

            this.setState({ loaderHidden: true });
        }.bind(this);
        xhr.send();
    }

    handleHeadChange(event){
        this.setState({current_head: event.target.value}, function stateUpdateComplete() {
            this.getApzs();
        }.bind(this));
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
        var apzs = this.state.data ? this.state.data : [];

        return (
            <div>
                <div className="card-header">
                    <h4 className="mb-0">Архитектурно-планировочное задание
                    <NavLink to="/panel/common/export_to_excel"><img title="Экспорт в excel" src='/images/excelicon.png' className="export_image" alt="export excel"/></NavLink>
                    </h4>
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
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'active'} to="/panel/head/apz/status/active/1" replace>Активные</NavLink></li>
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'inproccess'} to="/panel/head/apz/status/inproccess/1" replace>В процессе</NavLink></li>
                        <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'accepted'} to="/panel/head/apz/status/accepted/1" replace>Принятые</NavLink></li>
                        <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} isActive={(match, location) => status === 'declined'} to="/panel/head/apz/status/declined/1" replace>Отказанные</NavLink></li>
                    </ul>

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
                        {apzs.map(function(apz, index) {
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
                                        <Link className="btn btn-outline-info" to={'/panel/head/apz/show/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
                                <Link className="page-link" to={'/panel/head/apz/status/' + status + '/1'}>В начало</Link>
                            </li>

                            {this.state.pageNumbers.map(function(num, index) {
                                return(
                                    <li key={index} className={'page-item ' + (page === num ? 'active' : '')}>
                                        <Link className="page-link" to={'/panel/head/apz/status/' + status + '/' + num}>{num}</Link>
                                    </li>
                                );
                            })
                            }
                            <li className="page-item">
                                <Link className="page-link" to={'/panel/head/apz/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
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
