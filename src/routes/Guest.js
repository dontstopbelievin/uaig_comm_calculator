import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/guest.json';
import $ from 'jquery';


let e = new LocalizedStrings({ru,kk});

export default class Guest extends React.Component {
  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      tokenExists: false,
      rolename: ""
    }
    this.showAlert = this.showAlert.bind(this);
  }

  gotoLogin() {
    this.props.history.replace('/login');
  }

  showAlert() {
    $('#alertModal').modal('show');
    //alert('Вам надо зайти в систему или зарегистрироваться!');
	//dferfe
  }
 
  componentWillMount() {
    //console.log("GuestComponent will mount");
  }

  componentDidMount() {
    //console.log("GuestComponent did mount");
    if(sessionStorage.getItem('tokenInfo')){
      this.setState({ tokenExists: true });
      var roleName = JSON.parse(sessionStorage.getItem('userRoles'))[0];
      if(roleName === 'Urban' || roleName === 'Provider'){
        roleName = JSON.parse(sessionStorage.getItem('userRoles'))[1];
        this.setState({ rolename: roleName });
      }
      else{
        this.setState({ rolename: roleName });
      }
    }
  }

  componentWillUnmount() {
    //console.log("GuestComponent will unmount");
  }

  render() {
    return (
      <div>
    <div className="mish">
      <div className="container">
        <div className="row" style={{fontFamely:'Roboto'}}>
          <div className="col_1">
            <ul>
              <li><NavLink to={'/npm'} replace className="">{e.npm}</NavLink></li>
            </ul>
          </div>
          <div className="col_2">
            <ul>
              <li><a target="_blank" href="https://v3bl.goszakup.gov.kz/ru/register/plansreg?name_bin=990740001176&number_plan=&name_plan=&years_plan=2017&trade_method=&trade_vid=&attribute=&point_status=&pln_month=&region=&finance_point=&adm_bud=&program=&sub_program=&spec">{e.legalpurchese}</a></li>
            </ul>
          </div>
          <div className="col_3">
            <ul>
              <li><NavLink to={'/counteraction'} replace className="">{e.counteraction}</NavLink></li>
            </ul>
          </div>
          <div className="col_4">
            <ul>
              <li id="s"><NavLink to={'/news'} replace className="">{e.news}</NavLink></li>
              <li id="s"><NavLink to={'/control'} replace className="">{e.control}</NavLink></li>
              <li id="t"><NavLink to={'/contacts'} replace className="">{e.contacts}</NavLink></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
        {/*<div className="slide">
          <h1>УПРАВЛЕНИЕ АРХИТЕКТУРЫ И ГРАДОСТРОИТЕЛЬСТВА ГОРОДА АЛМАТЫ</h1>
          <h2>Официальный сайт</h2>
        </div>*/}

        <div className="container home-page">
          <div className="row">
            <div className="col-9 block-main">
              <h5>{e.publicServices}</h5>

              <div className="card-deck">
                <div className="card mb-4">
                  <div className="card-image card-color-1">
                    <div className="image-border">
                      <img alt="true" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4MC4wMDEgNDgwLjAwMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDgwLjAwMSA0ODAuMDAxOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMjM5Ljk5OSwzMmMtNzQuOTkyLDAtMTM2LDYxLjAwOC0xMzYsMTM2czYxLjAwOCwxMzYsMTM2LDEzNnMxMzYtNjEuMDA4LDEzNi0xMzZTMzE0Ljk5MSwzMiwyMzkuOTk5LDMyeiBNMjM5Ljk5OSwyODggICAgYy02Ni4xNjgsMC0xMjAtNTMuODMyLTEyMC0xMjBjMC02Ni4xNjgsNTMuODMyLTEyMCwxMjAtMTIwYzY2LjE2OCwwLDEyMCw1My44MzIsMTIwLDEyMEMzNTkuOTk5LDIzNC4xNjgsMzA2LjE2NywyODgsMjM5Ljk5OSwyODggICAgeiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTMxNy4zMTksMTQ2LjAxNmwtMTMuMzItMTEuODMyVjg4YzAtNC40MTYtMy41ODQtOC04LThoLTMyYy00LjQxNiwwLTgsMy41ODQtOCw4djMuNTJsLTEwLjY4LTkuNTA0ICAgIGMtMy4wMzItMi42OTYtNy42LTIuNjk2LTEwLjYzMiwwbC03Miw2NGMtMS43MTIsMS41Mi0yLjY4OCwzLjY5Ni0yLjY4OCw1Ljk4NHY4OGMwLDQuNDE2LDMuNTg0LDgsOCw4aDU2aDMyaDU2ICAgIGM0LjQxNiwwLDgtMy41ODQsOC04di04OEMzMTkuOTk5LDE0OS43MTIsMzE5LjAyMywxNDcuNTM2LDMxNy4zMTksMTQ2LjAxNnogTTI0Ny45OTksMjMyaC0xNnYtNDBoMTZWMjMyeiBNMzAzLjk5OSwyMzJoLTQwdi00OCAgICBjMC00LjQxNi0zLjU4NC04LTgtOGgtMzJjLTQuNDE2LDAtOCwzLjU4NC04LDh2NDhoLTQwdi03Ni40MDhsNjQtNTYuODg4bDE4LjY4LDE2LjYwOGMyLjM2LDIuMDk2LDUuNzIsMi42MDgsOC41OTIsMS4zMiAgICBjMi44OC0xLjI5Niw0LjcyOC00LjE1Miw0LjcyOC03LjI5NlY5NmgxNnY0MS43NzZjMCwyLjI4OCwwLjk3Niw0LjQ2NCwyLjY4LDUuOTg0bDEzLjMyLDExLjgzMlYyMzJ6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDc4LjU5MSw0NjcuNDcybC04OC0xMjhjLTEuNDg4LTIuMTc2LTMuOTYtMy40NzItNi41OTItMy40NzJoLTUwLjk4NGMzOC40OC00NS42MTYsNzQuOTg0LTEwMy41MTIsNzQuOTg0LTE1OS4xNjggICAgQzQwNy45OTksNjkuNDA4LDM0Mi4wNTUsMCwyMzkuOTk5LDBzLTE2OCw2OS40MDgtMTY4LDE3Ni44MzJjMCw1NS42NTYsMzYuNTA0LDExMy41NTIsNzQuOTg0LDE1OS4xNjhIOTUuOTk5ICAgIGMtMi42MzIsMC01LjEwNCwxLjI5Ni02LjU5MiwzLjQ3MmwtODgsMTI4Yy0xLjY4LDIuNDQ4LTEuODcyLDUuNjI0LTAuNDg4LDguMjU2QzIuMzAzLDQ3OC4zNTIsNS4wMjMsNDgwLDcuOTk5LDQ4MGg0NjQgICAgYzIuOTc2LDAsNS42OTYtMS42NDgsNy4wOC00LjI4QzQ4MC40NjMsNDczLjA5Niw0ODAuMjc5LDQ2OS45MTIsNDc4LjU5MSw0NjcuNDcyeiBNODcuOTk5LDE3Ni44MzIgICAgYzAtMTE4LjU4NCw3OC41Mi0xNjAuODMyLDE1Mi0xNjAuODMyYzczLjQ4LDAsMTUyLDQyLjI0OCwxNTIsMTYwLjgzMmMwLDkzLjA0LTExNi40MzIsMTk4LjU3Ni0xNDguNzI4LDIyNi4wNTYgICAgYy0wLjY5NiwwLjU5Mi0xLjM4NCwxLjE3Ni0yLDEuNjg4Yy0wLjQyNCwwLjM1Mi0wLjg5NiwwLjc1Mi0xLjI3MiwxLjA3MmMtMC4zMTItMC4yNjQtMC43MDQtMC41OTItMS4wNDgtMC44OCAgICBjLTAuNzQ0LTAuNjI0LTEuNTg0LTEuMzM2LTIuNDQ4LTIuMDcyYy0wLjgyNC0wLjY5Ni0xLjY1Ni0xLjQxNi0yLjU4NC0yLjIwOGMtMC4yNTYtMC4yMTYtMC41Ni0wLjQ4OC0wLjgyNC0wLjcxMiAgICBjLTIuMTItMS44NC00LjQ2NC0zLjg4LTcuMDQtNi4xNzZjLTAuMjMyLTAuMjA4LTAuNDgtMC40MzItMC43Mi0wLjY0OEMxODMuMjMxLDM1NS4zNiw4Ny45OTksMjYxLjAzMiw4Ny45OTksMTc2LjgzMnogICAgIE0xNjAuOTY3LDM1MmMzNC4zNDQsMzcuODcyLDY2Ljg4OCw2NC41Miw3My4xNiw2OS41NDRjMC40NTYsMC4zNjgsMC44LDAuNjQsMC45MTIsMC43MjhjMi45MDQsMi4zMDQsNy4wMjQsMi4zMDQsOS45MjgsMCAgICBjMC4xMTItMC4wODgsMC40NDgtMC4zNiwwLjkxMi0wLjcyOGM2LjI3Mi01LjAyNCwzOC44MTYtMzEuNjcyLDczLjE1Mi02OS41NDRoNjAuNzY4bDI5LjgwOCw0My4zNTJsLTIwNi4yNTYsNTEuNTZMMTM1LjU0MywzNTIgICAgSDE2MC45Njd6IE0xMDAuMjA3LDM1MmgxNS42NzJsMjQuNiwzNC40NDhsLTc2LjAyNCwxNy41NDRMMTAwLjIwNywzNTJ6IE0xMzUuMDA3LDQ2NGgtMTExLjhsMjcuODMyLTQwLjQ4OGw5OS41MTItMjIuOTY4ICAgIGwzNi4xMDQsNTAuNTQ0TDEzNS4wMDcsNDY0eiBNMjAwLjk5MSw0NjRsMTU1LjY2NC0zOC45MmwyNy44LDM4LjkySDIwMC45OTF6IE00MDQuMTE5LDQ2NGwtMzAuNzc2LTQzLjA4OGw0NS45MzYtMTEuNDggICAgTDQ1Ni43OTEsNDY0SDQwNC4xMTl6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">Выдача справки по определению адреса объектов недвижимости</p>
                  </div>
                  <div className="card-footer">
                    {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {!this.state.tokenExists && <a onClick={this.showAlert} className="btn btn-primary">Подать заявку</a>}
                  </div>
                </div>
                <div className="card mb-4">
                  <div className="card-image card-color-2">
                    <div className="image-border">
                      <img alt="true" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4MCA0ODAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4MCA0ODA7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTI4cHgiIGhlaWdodD0iMTI4cHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00NDgsMTc2LjgwOFYxNTJjMC0wLjA1Ni0wLjAzMi0wLjA5Ni0wLjAzMi0wLjE1MmMtMC4wMTYtMC45Mi0wLjIwOC0xLjgyNC0wLjU0NC0yLjY5NiAgICBjLTAuMDg4LTAuMjMyLTAuMjA4LTAuNDQtMC4zMi0wLjY1NmMtMC4xNTItMC4zMTItMC4yNTYtMC42MzItMC40NDgtMC45MjhsLTk2LTE0NEMzNDkuMTY4LDEuMzM2LDM0Ni42NzIsMCwzNDQsMEgxMDQgICAgYy0yLjU5MiwwLTQuOTQ0LDEuMzA0LTYuNDQsMy4zNzZjLTAuMDU2LDAuMDgtMC4xNjgsMC4xMDQtMC4yMTYsMC4xOTJsLTk2LDE0NGMtMC4xOTIsMC4yODgtMC4yOTYsMC42MTYtMC40NDgsMC45MjggICAgYy0wLjExMiwwLjIyNC0wLjIzMiwwLjQyNC0wLjMyLDAuNjU2Yy0wLjMzNiwwLjg3Mi0wLjUyOCwxLjc3Ni0wLjU0NCwyLjcwNEMwLjAzMiwxNTEuOTA0LDAsMTUxLjk0NCwwLDE1MnYxOTIgICAgYzAsMjIuMDU2LDE3Ljk0NCw0MCw0MCw0MGgyNGg4MGg1NmgyNHY1NmMwLDIyLjA1NiwxNy45NDQsNDAsNDAsNDBoMTQ0YzE5LjU2OCwwLDM1LjgzMi0xNC4xNDQsMzkuMjY0LTMyLjczNiAgICBDNDY1Ljg1Niw0NDMuODMyLDQ4MCw0MjcuNTY4LDQ4MCw0MDhWMjE2QzQ4MCwxOTYuNjg4LDQ2Ni4yMzIsMTgwLjUyOCw0NDgsMTc2LjgwOHogTTEwNCwyMi40MjRMMTg1LjA1NiwxNDRIMjIuOTQ0TDEwNCwyMi40MjR6ICAgICBNMTM2LDM2OEg3MlYyNjRoNjRWMzY4eiBNMTkyLDM2OGgtNDBWMjU2YzAtNC40MjQtMy41NzYtOC04LThINjRjLTQuNDI0LDAtOCwzLjU3Ni04LDh2MTEySDQwYy0xMy4yMzIsMC0yNC0xMC43NjgtMjQtMjRWMTYwICAgIGgxNzZWMzY4eiBNMTE4Ljk0NCwxNmgyMjAuNzY4bDg1LjM0NCwxMjhIMjA0LjI4TDExOC45NDQsMTZ6IE0yMjQsMjQ4djEyMGgtMTZWMTYwaDIyNHYxNkgyOTYgICAgYy0xOS41NjgsMC0zNS44MzIsMTQuMTQ0LTM5LjI2NCwzMi43MzZDMjM4LjE0NCwyMTIuMTY4LDIyNCwyMjguNDMyLDIyNCwyNDh6IE00MzIsNDQwYzAsMTMuMjMyLTEwLjc2OCwyNC0yNCwyNEgyNjQgICAgYy0xMy4yMzIsMC0yNC0xMC43NjgtMjQtMjRWMjQ4YzAtMTMuMjMyLDEwLjc2OC0yNCwyNC0yNGgxMTJ2NDhjMCw0LjQyNCwzLjU3Niw4LDgsOGg0OFY0NDB6IE0zOTIsMjY0di0yOC42ODhMNDIwLjY4OCwyNjRIMzkyeiAgICAgTTQ2NCw0MDhjMCwxMC40MTYtNi43MTIsMTkuMjE2LTE2LDIyLjUyOFYyNzJjMC0yLjIxNi0wLjkwNC00LjIxNi0yLjM1Mi01LjY2NGwtNTUuOTc2LTU1Ljk3NiAgICBjLTEuNDU2LTEuNDU2LTMuNDU2LTIuMzYtNS42NzItMi4zNkgyNzMuNDcyYzMuMzEyLTkuMjg4LDEyLjExMi0xNiwyMi41MjgtMTZoMTQ0YzEzLjIzMiwwLDI0LDEwLjc2OCwyNCwyNFY0MDh6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cmVjdCB4PSI5NiIgeT0iNDAwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxyZWN0IHg9Ijk2IiB5PSI0MzIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMTI4IiB5PSI0MzIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMTYwIiB5PSI0MzIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMTkyIiB5PSI0MzIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMjY0IiB5PSIyNDgiIHdpZHRoPSI4OCIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMjY0IiB5PSIyODAiIHdpZHRoPSI4OCIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMzYwIiB5PSIzMTIiIHdpZHRoPSI0OCIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMzYwIiB5PSIzNDQiIHdpZHRoPSI0OCIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMzYwIiB5PSIzOTIiIHdpZHRoPSI0OCIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMzYwIiB5PSI0MjQiIHdpZHRoPSI0OCIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTMzMC4zNDQsMzE0LjM0NEwyODgsMzU2LjY4OGwtMTguMzQ0LTE4LjM0NGwtMTEuMzEyLDExLjMxMmwyNCwyNGMxLjU2LDEuNTYsMy42MDgsMi4zNDQsNS42NTYsMi4zNDQgICAgYzIuMDQ4LDAsNC4wOTYtMC43ODQsNS42NTYtMi4zNDRsNDgtNDhMMzMwLjM0NCwzMTQuMzQ0eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTMzMC4zNDQsMzc4LjM0NEwyODgsNDIwLjY4OGwtMTguMzQ0LTE4LjM0NGwtMTEuMzEyLDExLjMxMmwyNCwyNGMxLjU2LDEuNTYsMy42MDgsMi4zNDQsNS42NTYsMi4zNDQgICAgYzIuMDQ4LDAsNC4wOTYtMC43ODQsNS42NTYtMi4zNDRsNDgtNDhMMzMwLjM0NCwzNzguMzQ0eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">Выдача архитектурно-планировочного задания</p>
                  </div>
                  <div className="card-footer">
                    {this.state.tokenExists && this.state.rolename === 'Admin' && <NavLink to={"/admin"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Citizen' && <NavLink to={"/citizen"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Region' &&  <NavLink to={"/urban"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Head' &&  <NavLink to={"/head"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Electricity' &&  <NavLink to={"/providerelectro"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Gas' &&  <NavLink to={"/providergas"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Heat' &&  <NavLink to={"/providerheat"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Water' &&  <NavLink to={"/providerwater"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {!this.state.tokenExists && <a onClick={this.showAlert} className="btn btn-primary">Подать заявку</a>}
                  </div>
                </div>
                <div className="card mb-4">
                  <div className="card-image card-color-3">
                    <div className="image-border">
                      <img alt="true" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4MCA0ODAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4MCA0ODA7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTI4cHgiIGhlaWdodD0iMTI4cHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0zNjUuNjU2LDIxMC4zNDRMMzM2LDE4MC42ODhWOTZjMC00LjQxNi0zLjU4NC04LTgtOGgtNDhjLTQuNDE2LDAtOCwzLjU4NC04LDh2MjAuNjg4bC0yNi4zNDQtMjYuMzQ0ICAgIGMtMy4xMjgtMy4xMjgtOC4xODQtMy4xMjgtMTEuMzEyLDBsLTEyMCwxMjBDMTEyLjg0LDIxMS44NCwxMTIsMjEzLjg4LDExMiwyMTZ2MTY4YzAsNC40MTYsMy41ODQsOCw4LDhoODhoNjRoODggICAgYzQuNDE2LDAsOC0zLjU4NCw4LThWMjE2QzM2OCwyMTMuODgsMzY3LjE2LDIxMS44NCwzNjUuNjU2LDIxMC4zNDR6IE0yNjQsMzc2aC00OHYtODhoNDhWMzc2eiBNMzUyLDM3NmgtNzJ2LTk2ICAgIGMwLTQuNDE2LTMuNTg0LTgtOC04aC02NGMtNC40MTYsMC04LDMuNTg0LTgsOHY5NmgtNzJWMjE5LjMxMmwxMTItMTEybDM0LjM0NCwzNC4zNDRjMi4yODgsMi4yOCw1LjcyLDIuOTY4LDguNzIsMS43MzYgICAgYzIuOTg0LTEuMjQsNC45MzYtNC4xNiw0LjkzNi03LjM5MnYtMzJoMzJ2ODBjMCwyLjEyLDAuODQsNC4xNiwyLjM0NCw1LjY1NkwzNTIsMjE5LjMxMlYzNzZ6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDU2LjY4OCwyOTYuOTEyYy0xLjM3Niw1LjI2NC0yLjk4NCwxMC41NDQtNC43NTIsMTUuNzEybDE1LjEzNiw1LjE5MmMxLjkwNC01LjUzNiwzLjYxNi0xMS4yLDUuMDk2LTE2Ljg0ICAgIEw0NTYuNjg4LDI5Ni45MTJ6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDY3LjExMiwxNjIuMjg4bC0xNS4xMzYsNS4xODRjMS43NjgsNS4xNiwzLjM2LDEwLjQ0OCw0Ljc0NCwxNS43MTJsMTUuNDgtNC4wNCAgICBDNDcwLjcyLDE3My40ODgsNDY5LjAxNiwxNjcuODE2LDQ2Ny4xMTIsMTYyLjI4OHoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00NTMuMjg4LDEyOS45NDRsLTE0LjIwOCw3LjM1MmMyLjUxMiw0Ljg2NCw0Ljg3Miw5Ljg1Niw3LDE0Ljg0OGwxNC43MTItNi4yODggICAgQzQ1OC41MDQsMTQwLjUxMiw0NTUuOTg0LDEzNS4xNTIsNDUzLjI4OCwxMjkuOTQ0eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQ0Ni4wNDgsMzI3Ljk0NGMtMi4xNDQsNS4wMTYtNC40OTYsMTAuMDA4LTcsMTQuODRsMTQuMiw3LjM2YzIuNjg4LTUuMTc2LDUuMjE2LTEwLjUyOCw3LjUxMi0xNS45MTJMNDQ2LjA0OCwzMjcuOTQ0eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQ2Mi42NTYsMjY0LjY1NmMtMC41OTIsNS40MDgtMS4zOTIsMTAuODY0LTIuMzg0LDE2LjI0bDE1LjczNiwyLjkwNGMxLjA1Ni01Ljc1MiwxLjkyLTExLjYwOCwyLjU1Mi0xNy40ICAgIEw0NjIuNjU2LDI2NC42NTZ6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDc2LjAyNCwxOTYuMzJsLTE1LjczNiwyLjg4OGMwLjk4NCw1LjM2LDEuNzg0LDEwLjgzMiwyLjM3NiwxNi4yNTZsMTUuOTA0LTEuNzQ0ICAgIEM0NzcuOTM2LDIwNy45MTIsNDc3LjA4LDIwMi4wNTYsNDc2LjAyNCwxOTYuMzJ6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDc5Ljg0LDIzMS4yNzJsLTE1Ljk5MiwwLjU3NmMwLjEwNCwyLjcwNCwwLjE1Miw1LjQyNCwwLjE1Miw4LjE0NGMwLDIuNzg0LTAuMDU2LDUuNTQ0LTAuMTUyLDguMjk2bDE1Ljk5MiwwLjU2OCAgICBjMC4xMDQtMi45MzYsMC4xNi01Ljg4LDAuMTYtOC44NTZDNDgwLDIzNy4wOCw0NzkuOTUyLDIzNC4xNjgsNDc5Ljg0LDIzMS4yNzJ6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNCwxOTYuMmMtMS4wNjQsNS43NTItMS45MjgsMTEuNjA4LTIuNTYsMTcuNGwxNS45MDQsMS43NDRjMC41OTItNS40MDgsMS4zOTItMTAuODY0LDIuMzg0LTE2LjI0TDQsMTk2LjJ6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMTIuOTIsMTYyLjE4NGMtMS44OTYsNS41MzYtMy42MTYsMTEuMi01LjA5NiwxNi44NGwxNS40OCw0LjA2NGMxLjM3Ni01LjI1NiwyLjk4NC0xMC41NDQsNC43NTItMTUuNzEyTDEyLjkyLDE2Mi4xODR6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMzMuOTEyLDMyNy44NTZMMTkuMiwzMzQuMTQ0YzIuMjg4LDUuMzQ0LDQuODA4LDEwLjcwNCw3LjUwNCwxNS45MTJsMTQuMjE2LTcuMzUyICAgIEMzOC40LDMzNy44NCwzNi4wNDgsMzMyLjg0OCwzMy45MTIsMzI3Ljg1NnoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0xNi4xNTIsMjMxLjcxMkwwLjE2LDIzMS4xNDRDMC4wNTYsMjM0LjA4LDAsMjM3LjAyNCwwLDI0MGMwLDIuOTIsMC4wNDgsNS44MzIsMC4xNiw4LjcyOGwxNS45OTItMC41NzYgICAgYy0wLjEwNC0yLjcwNC0wLjE1Mi01LjQyNC0wLjE1Mi04LjE0NEMxNiwyMzcuMjI0LDE2LjA1NiwyMzQuNDY0LDE2LjE1MiwyMzEuNzEyeiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTI2Ljc1MiwxMjkuODU2Yy0yLjY4OCw1LjE3Ni01LjIxNiwxMC41MjgtNy41MTIsMTUuOTEybDE0LjcxMiw2LjI4OGMyLjE0NC01LjAxNiw0LjQ5Ni0xMC4wMDgsNy0xNC44NEwyNi43NTIsMTI5Ljg1NnoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0xNy4zMzYsMjY0LjUzNkwxLjQzMiwyNjYuMjhjMC42MzIsNS44MDgsMS40ODgsMTEuNjY0LDIuNTQ0LDE3LjRsMTUuNzM2LTIuODg4ICAgIEMxOC43MjgsMjc1LjQzMiwxNy45MjgsMjY5Ljk2LDE3LjMzNiwyNjQuNTM2eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTIzLjI3MiwyOTYuODE2bC0xNS40OCw0LjA0OGMxLjQ4LDUuNjU2LDMuMTg0LDExLjMyOCw1LjA4OCwxNi44NTZsMTUuMTM2LTUuMTkyICAgIEMyNi4yNDgsMzA3LjM2OCwyNC42NTYsMzAyLjA4LDIzLjI3MiwyOTYuODE2eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTM4NCwxNnYzMi4xNDRDMzQyLjU3NiwxNy4wMjQsMjkyLjA0OCwwLDI0MCwwQzE4Mi43MDQsMCwxMjcuMjA4LDIwLjU3Niw4My43Miw1Ny45MzZsMTAuNDMyLDEyLjEzNiAgICBDMTM0LjczNiwzNS4yLDE4Ni41MjgsMTYsMjQwLDE2YzQ1LjcxMiwwLDkwLjE0NCwxNC4xNDQsMTI3LjQ1Niw0MEgzNDR2MTZoNDhjNC40MTYsMCw4LTMuNTg0LDgtOFYxNkgzODR6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMzg1Ljg0OCw0MDkuOTI4QzM0NS4yNjQsNDQ0LjgsMjkzLjQ3Miw0NjQsMjQwLDQ2NGMtNDUuNzEyLDAtOTAuMTQ0LTE0LjE0NC0xMjcuNDU2LTQwSDEzNnYtMTZIODhjLTQuNDE2LDAtOCwzLjU4NC04LDggICAgdjQ4aDE2di0zMi4xNDRDMTM3LjQyNCw0NjIuOTc2LDE4Ny45NTIsNDgwLDI0MCw0ODBjNTcuMjk2LDAsMTEyLjc5Mi0yMC41NzYsMTU2LjI4LTU3LjkzNkwzODUuODQ4LDQwOS45Mjh6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">Выдача решения на фотоотчет</p>
                  </div>
                  <div className="card-footer">
                    {this.state.tokenExists && <NavLink to={"/photoreports"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {!this.state.tokenExists && <a onClick={this.showAlert} className="btn btn-primary">Подать заявку</a>}
                  </div>
                </div>
              </div>

              <div className="card-deck">
                <div className="card mb-4">
                  <div className="card-image card-color-4">
                    <div className="image-border">
                      <img alt="true" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4MCA0ODAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4MCA0ODA7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTI4cHgiIGhlaWdodD0iMTI4cHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00NDAsMEg0MEMxNy45NDQsMCwwLDE3Ljk0NCwwLDQwdjMwNGMwLDIyLjA1NiwxNy45NDQsNDAsNDAsNDBoMTQ5Ljc1MmwtMTIsNDhIMTY4Yy0yMi4wNTYsMC00MCwxNy45NDQtNDAsNDAgICAgYzAsNC40MTYsMy41ODQsOCw4LDhoMjA4YzQuNDE2LDAsOC0zLjU4NCw4LThjMC0yMi4wNTYtMTcuOTQ0LTQwLTQwLTQwaC05Ljc1MmwtMTItNDhINDQwYzIyLjA1NiwwLDQwLTE3Ljk0NCw0MC00MFY0MCAgICBDNDgwLDE3Ljk0NCw0NjIuMDU2LDAsNDQwLDB6IE0yOTYsNDQ4aDE2YzEwLjQzMiwwLDE5LjMyOCw2LjY4OCwyMi42MzIsMTZIMTQ1LjM2OGMzLjMwNC05LjMxMiwxMi4yLTE2LDIyLjYzMi0xNmgxNkgyOTZ6ICAgICBNMTk0LjI0OCw0MzJsMTItNDhoNjcuNTA0bDEyLDQ4SDE5NC4yNDh6IE00NjQsMzQ0YzAsMTMuMjMyLTEwLjc2OCwyNC0yNCwyNEgyODBoLTgwSDQwYy0xMy4yMzIsMC0yNC0xMC43NjgtMjQtMjR2LTI0aDQ0OFYzNDR6ICAgICBNNDY0LDMwNEgxNlY4MGg0NDhWMzA0eiBNNDY0LDY0SDE2VjQwYzAtMTMuMjMyLDEwLjc2OC0yNCwyNC0yNGg0MDBjMTMuMjMyLDAsMjQsMTAuNzY4LDI0LDI0VjY0eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMTA0IiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cmVjdCB4PSI3MiIgeT0iMzIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iNDAiIHk9IjMyIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxyZWN0IHg9IjIzMiIgeT0iMzM2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0zMTEuOTM2LDE4My42OTZjLTAuMDMyLTAuOTM2LTAuMTkyLTEuODY0LTAuNTUyLTIuNzQ0Yy0wLjA0OC0wLjEyLTAuMTI4LTAuMjA4LTAuMTg0LTAuMzIgICAgYy0wLjI0OC0wLjUzNi0wLjUxMi0xLjA2NC0wLjg4OC0xLjU0NGwtNTYtNzJjLTAuMDQtMC4wNTYtMC4xMTItMC4wNzItMC4xNi0wLjEyYy0xLjQ5Ni0xLjgzMi0zLjcyLTIuOTY4LTYuMTUyLTIuOTY4SDEwNCAgICBjLTIuNDcyLDAtNC44LDEuMTQ0LTYuMzIsMy4wODhsLTU2LDcyYy0wLjM3NiwwLjQ4LTAuNjMyLDEuMDA4LTAuODg4LDEuNTQ0Yy0wLjA1NiwwLjExMi0wLjEzNiwwLjItMC4xODQsMC4zMiAgICBjLTAuMzYsMC44OC0wLjUyLDEuODA4LTAuNTUyLDIuNzQ0YzAsMC4xMTItMC4wNTYsMC4yLTAuMDU2LDAuMzA0djk2YzAsNC40MTYsMy41ODQsOCw4LDhoMTQ0aDQwaDMyaDQwYzQuNDE2LDAsOC0zLjU4NCw4LTh2LTk2ICAgIEMzMTIsMTgzLjg5NiwzMTEuOTQ0LDE4My44MDgsMzExLjkzNiwxODMuNjk2eiBNMjg3LjY0OCwxNzZIMjA4LjM2TDI0OCwxMjUuMDMyTDI4Ny42NDgsMTc2eiBNMTg0LDI3Mkg1NnYtODBoMTI4VjI3MnogICAgIE0xODguMDgsMTc2SDY0LjM1Mmw0My41Ni01NkgyMzEuNjRsLTMxLjExMiw0MEwxODguMDgsMTc2eiBNMjU2LDI3MmgtMTZ2LTMyaDE2VjI3MnogTTI5NiwyNzJoLTI0di00MGMwLTQuNDE2LTMuNTg0LTgtOC04aC0zMiAgICBjLTQuNDE2LDAtOCwzLjU4NC04LDh2NDBoLTI0di04MGg5NlYyNzJ6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMzk4LjgwOCwyMTkuNDk2bDIxLjY2NC03LjIxNmMzLjItMS4wNjQsNS4zOTItNC4wMzIsNS40NjQtNy40MDhjMC4wOC0zLjM3Ni0xLjk3Ni02LjQ0LTUuMTI4LTcuNjQ4bC03My41MzYtMjguMjg4ICAgIGMtMi45NTItMS4xMzYtNi4yODgtMC40MjQtOC41MjgsMS44MDhjLTIuMjMyLDIuMjMyLTIuOTQ0LDUuNTc2LTEuODA4LDguNTI4bDI4LjI4OCw3My41MzZjMS4xODQsMy4wOTYsNC4xNiw1LjEyOCw3LjQ2NCw1LjEyOCAgICBjMC4wNTYsMCwwLjEyLDAsMC4xODQsMGMzLjM3Ni0wLjA3Miw2LjMzNi0yLjI2NCw3LjQwOC01LjQ2NGw3LjIxNi0yMS42NjRsMzAuNDQ4LDMwLjQ0OGwxMS4zMTItMTEuMzEyTDM5OC44MDgsMjE5LjQ5NnogICAgIE0zODEuNDY0LDIwOC40MTZjLTIuMzg0LDAuNzkyLTQuMjU2LDIuNjY0LTUuMDU2LDUuMDU2bC00LjI2NCwxMi43OTJsLTEzLjgxNi0zNS45MjhsMzUuOTI4LDEzLjgxNkwzODEuNDY0LDIwOC40MTZ6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">Выдача решения о строительстве культовых зданий (сооружений), определении их месторасположения</p>
                  </div>
                  <div className="card-footer">
                    {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {!this.state.tokenExists && <a onClick={this.showAlert} className="btn btn-primary">Подать заявку</a>}
                  </div>
                </div>
                <div className="card mb-4">
                  <div className="card-image card-color-5">
                    <div className="image-border">
                      <img alt="true" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4MCA0ODAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4MCA0ODA7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTI4cHgiIGhlaWdodD0iMTI4cHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00MDAsMEgxMTJDOTIuNDMyLDAsNzYuMTY4LDE0LjE0NCw3Mi43MzYsMzIuNzI4QzU0LjE0NCwzNi4xNjgsNDAsNTIuNDMyLDQwLDcydjM2OGMwLDIyLjA1NiwxNy45NDQsNDAsNDAsNDBoMjg4ICAgIGMxOS41NjgsMCwzNS44MzItMTQuMTQ0LDM5LjI2NC0zMi43MzZDNDI1Ljg1Niw0NDMuODMyLDQ0MCw0MjcuNTY4LDQ0MCw0MDhWNDBDNDQwLDE3Ljk0NCw0MjIuMDU2LDAsNDAwLDB6IE0zOTIsNDQwICAgIGMwLDEzLjIzMi0xMC43NjgsMjQtMjQsMjRIODBjLTEzLjIzMiwwLTI0LTEwLjc2OC0yNC0yNFY3MmMwLTEzLjIzMiwxMC43NjgtMjQsMjQtMjRoMjU2djQ4YzAsNC40MTYsMy41NzYsOCw4LDhoNDhWNDQweiBNMzUyLDg4ICAgIFY1OS4zMTJMMzgwLjY4OCw4OEgzNTJ6IE00MjQsNDA4YzAsMTAuNDE2LTYuNzEyLDE5LjIxNi0xNiwyMi41MjhWOTZjMC0yLjIxNi0wLjg5Ni00LjIxNi0yLjM1Mi01LjY2NGwtNTUuOTg0LTU1Ljk5MiAgICBDMzQ4LjIxNiwzMi44OTYsMzQ2LjIxNiwzMiwzNDQsMzJIODkuNDcyYzMuMzEyLTkuMjk2LDEyLjExMi0xNiwyMi41MjgtMTZoMjg4YzEzLjIzMiwwLDI0LDEwLjc2LDI0LDI0VjQwOHoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0zNDkuNjU2LDIwMi4zNDRMMzIwLDE3Mi42ODhWODhjMC00LjQxNi0zLjU3Ni04LTgtOGgtNDhjLTQuNDI0LDAtOCwzLjU4NC04LDh2MjAuNjg4bC0yNi4zNDQtMjYuMzQ0ICAgIGMtMy4xMjgtMy4xMjgtOC4xODQtMy4xMjgtMTEuMzEyLDBsLTEyMCwxMjBDOTYuODQsMjAzLjg0LDk2LDIwNS44OCw5NiwyMDh2MTM2YzAsNC40MTYsMy41NzYsOCw4LDhoODhoNjRoODggICAgYzQuNDI0LDAsOC0zLjU4NCw4LThWMjA4QzM1MiwyMDUuODgsMzUxLjE2LDIwMy44NCwzNDkuNjU2LDIwMi4zNDR6IE0yNDgsMzM2aC00OHYtODBoNDhWMzM2eiBNMzM2LDMzNmgtNzJ2LTg4ICAgIGMwLTQuNDE2LTMuNTc2LTgtOC04aC02NGMtNC40MjQsMC04LDMuNTg0LTgsOHY4OGgtNzJWMjExLjMxMmwxMTItMTEybDM0LjM0NCwzNC4zNDRjMi4yODgsMi4yOTYsNS43MzYsMi45NzYsOC43MiwxLjczNiAgICBjMi45OTItMS4yNCw0LjkzNi00LjE2LDQuOTM2LTcuMzkyVjk2aDMydjgwYzAsMi4xMiwwLjg0LDQuMTYsMi4zNDQsNS42NTZMMzM2LDIxMS4zMTJWMzM2eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTE3My42NTYsMzc4LjM0NGMtMy4xMjgtMy4xMjgtOC4xODQtMy4xMjgtMTEuMzEyLDBMMTUyLDM4OC42ODhsLTEwLjM0NC0xMC4zNDRjLTMuMTI4LTMuMTI4LTguMTg0LTMuMTI4LTExLjMxMiwwICAgIEwxMjAsMzg4LjY4OGwtMTAuMzQ0LTEwLjM0NGwtMTEuMzEyLDExLjMxMmwxNiwxNmMzLjEyOCwzLjEyOCw4LjE4NCwzLjEyOCwxMS4zMTIsMEwxMzYsMzk1LjMxMmwxMC4zNDQsMTAuMzQ0ICAgIGMxLjU2LDEuNTYsMy42MDgsMi4zNDQsNS42NTYsMi4zNDRjMi4wNDgsMCw0LjA5Ni0wLjc4NCw1LjY1Ni0yLjM0NEwxNjgsMzk1LjMxMmwxMC4zNDQsMTAuMzQ0bDExLjMxMi0xMS4zMTJMMTczLjY1NiwzNzguMzQ0eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMTA0IiB5PSI0MjQiIHdpZHRoPSI4OCIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTMyNS42NTYsMzc4LjM0NGMtMy4xMjgtMy4xMjgtOC4xODQtMy4xMjgtMTEuMzEyLDBMMzA0LDM4OC42ODhsLTEwLjM0NC0xMC4zNDRjLTMuMTI4LTMuMTI4LTguMTg0LTMuMTI4LTExLjMxMiwwICAgIEwyNzIsMzg4LjY4OGwtMTAuMzQ0LTEwLjM0NGwtMTEuMzEyLDExLjMxMmwxNiwxNmMzLjEyOCwzLjEyOCw4LjE4NCwzLjEyOCwxMS4zMTIsMEwyODgsMzk1LjMxMmwxMC4zNDQsMTAuMzQ0ICAgIGMxLjU2LDEuNTYsMy42MDgsMi4zNDQsNS42NTYsMi4zNDRjMi4wNDgsMCw0LjA5Ni0wLjc4NCw1LjY1Ni0yLjM0NEwzMjAsMzk1LjMxMmwxMC4zNDQsMTAuMzQ0bDExLjMxMi0xMS4zMTJMMzI1LjY1NiwzNzguMzQ0eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMjU2IiB5PSI0MjQiIHdpZHRoPSI4OCIgaGVpZ2h0PSIxNiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">Выдача решения о перепрофилировании (изменении функционального назначения) зданий (сооружений) в культовые здания (сооружения)</p>
                  </div>
                  <div className="card-footer">
                    {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {!this.state.tokenExists && <a onClick={this.showAlert} className="btn btn-primary">Подать заявку</a>}
                  </div>
                </div>
                <div className="card mb-4">
                  <div className="card-image card-color-6">
                    <div className="image-border">
                      <img alt="true" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4MCA0ODAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4MCA0ODA7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTI4cHgiIGhlaWdodD0iMTI4cHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00NzkuOTA0LDYzLjUwNGMtMC4wNDgtMC43MjgtMC4xOTItMS40MjQtMC40MzItMi4xMTJjLTAuMDg4LTAuMjU2LTAuMTUyLTAuNTEyLTAuMjcyLTAuNzYgICAgYy0wLjM4NC0wLjgyNC0wLjg2NC0xLjYtMS41MjgtMi4yNjRjLTAuMDA4LTAuMDA4LTAuMDE2LTAuMDI0LTAuMDI0LTAuMDMyTDQyMS42NjQsMi4zNTJjLTAuMDA4LTAuMDA4LTAuMDI0LTAuMDE2LTAuMDQtMC4wMzIgICAgYy0wLjY3Mi0wLjY2NC0xLjQ1Ni0xLjE1Mi0yLjI4LTEuNTM2Yy0wLjIyNC0wLjEwNC0wLjQ1Ni0wLjE2LTAuNjg4LTAuMjQ4Yy0wLjcyLTAuMjU2LTEuNDU2LTAuNDA4LTIuMjE2LTAuNDQ4ICAgIEM0MTYuMjgsMC4wOCw0MTYuMTUyLDAsNDE2LDBINDBDMTcuOTQ0LDAsMCwxNy45NDQsMCw0MHY0MDBjMCwyMi4wNTYsMTcuOTQ0LDQwLDQwLDQwaDQwMGMyMi4wNTYsMCw0MC0xNy45NDQsNDAtNDBWNjQgICAgQzQ4MCw2My44MjQsNDc5LjkxMiw2My42OCw0NzkuOTA0LDYzLjUwNHogTTQyNCwyNy4zMTJMNDUyLjY4OCw1Nkg0MjRWMjcuMzEyeiBNNDY0LDQ0MGMwLDEzLjIzMi0xMC43NjgsMjQtMjQsMjRINDAgICAgYy0xMy4yMzIsMC0yNC0xMC43NjgtMjQtMjRWNDBjMC0xMy4yMzIsMTAuNzY4LTI0LDI0LTI0aDM2OHY0OGMwLDQuNDI0LDMuNTg0LDgsOCw4aDQ4VjQ0MHoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0zODQsNTZoLTQwaC00MGgtNDBoLTQwSDQ4Yy00LjQxNiwwLTgsMy41NzYtOCw4djM0LjJ2MzUuNTkyVjE2OHYxMDR2MTUyYzAsNC40MjQsMy41ODQsOCw4LDhoMTQ0YzQuNDE2LDAsOC0zLjU3Niw4LTggICAgdi00OHYtNjR2LTMyaDE4NGM0LjQxNiwwLDgtMy41NzYsOC04di00MFY2NEMzOTIsNTkuNTc2LDM4OC40MTYsNTYsMzg0LDU2eiBNMzEyLDcyaDI0djE2aC0yNFY3MnogTTI3Miw3MmgyNHYxNmgtMjRWNzJ6ICAgICBNMjcyLDEwNGgzMmgzMnY2NGgtNjRWMTA0eiBNNTYsMTA0LjgzMkM1OS44NTYsMTA0LjI4LDYzLjg3MiwxMDQsNjgsMTA0YzIzLjM4NCwwLDM2LDguNTEyLDM2LDEyYzAsMy40ODgtMTIuNjE2LDEyLTM2LDEyICAgIGMtNC4xMjgsMC04LjE0NC0wLjI4LTEyLTAuODMyVjEwNC44MzJ6IE01NiwxNDMuMjU2QzU5LjkxMiwxNDMuNzIsNjMuOTA0LDE0NCw2OCwxNDRjMjUuODQsMCw1Mi05LjYxNiw1Mi0yOCAgICBjMC0yMS4zMi0zNC45ODQtMzAuNTg0LTY0LTI3LjIyNFY3MmgxNjB2MjRoLTU2Yy00LjQxNiwwLTgsMy41NzYtOCw4YzAsMjIuNjA4LDEwLjQ5Niw0Mi43OTIsMjYuODQ4LDU2SDU2VjE0My4yNTZ6IE0yMTYsMTEyICAgIHY0Ny40MzJjLTI0LjQ4OC0zLjUxMi00My45MTItMjIuOTM2LTQ3LjQzMi00Ny40MzJIMjE2eiBNMTg0LDM2Ny40MzJjLTI0LjQ4OC0zLjUxMi00My45MTItMjIuOTM2LTQ3LjQzMi00Ny40MzJIMTg0VjM2Ny40MzJ6ICAgICBNMTg0LDMwNGgtNTZjLTQuNDE2LDAtOCwzLjU3Ni04LDhjMCwzNywyOC4wNTYsNjcuNTM2LDY0LDcxLjUyOFY0MTZINTZWMjgwaDEyOFYzMDR6IE0zNzYsMjY0SDE5Mkg1NnYtODhoMTYwdjU2ICAgIGMwLDQuNDI0LDMuNTg0LDgsOCw4aDE1MlYyNjR6IE0zNzYsMjI0SDIzMnYtNTZ2LTY0VjcyaDI0djI0djgwYzAsNC40MjQsMy41ODQsOCw4LDhoODBjNC40MTYsMCw4LTMuNTc2LDgtOFY5NlY3MmgyNFYyMjR6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cmVjdCB4PSIzMDQiIHk9IjM0NCIgd2lkdGg9Ijk2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cmVjdCB4PSI0MTYiIHk9IjM0NCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cmVjdCB4PSIzMDQiIHk9IjM3NiIgd2lkdGg9Ijk2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cmVjdCB4PSI0MTYiIHk9IjM3NiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cmVjdCB4PSIzMDQiIHk9IjQwOCIgd2lkdGg9Ijk2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cmVjdCB4PSI0MTYiIHk9IjQwOCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cmVjdCB4PSIzMjgiIHk9IjMxMiIgd2lkdGg9Ijg4IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">Предоставление земельного участка для строительства объекта в черте населенного пункта</p>
                  </div>
                  <div className="card-footer">
                    {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {!this.state.tokenExists && <a onClick={this.showAlert} className="btn btn-primary">Подать заявку</a>}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-3 block-main">
              <h5>Новости</h5>
            </div>

          </div>
        </div>
        <div className="modal fade" id="alertModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Информация</h5>
                <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Вам надо <NavLink to={"/login"} replace onClick={() => document.getElementById("uploadFileModalClose").click()}>войти</NavLink> в систему или <NavLink to={"/register"} replace onClick={() => document.getElementById("uploadFileModalClose").click()}>зарегистрироваться</NavLink>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              </div>
            </div>
          </div>
        </div>

      </div>



    )
  }
}
