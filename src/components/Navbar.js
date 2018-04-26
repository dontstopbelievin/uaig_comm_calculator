import React from 'react';
import {NavLink} from 'react-router-dom';
import {ru, kk} from '../languages/header.json';
import LocalizedStrings from 'react-localization';
//import '../assets/css/navbar.css';
let e = new LocalizedStrings({ru,kk});

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
      (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.giveActiveClass = this.giveActiveClass.bind(this);
  }

  giveActiveClass(path) {
    if(path === this.props.pathName)
      return 'active';
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light">
        <NavLink exact className="nav-link goHome" activeClassName="active" to="/" >{e.home}</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" 
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {e.aboutmanagement}
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="/#/InfoAboutDepartment">{e.informationabouttheman}</a>
                <a className="dropdown-item" href="#">{e.infabthestatebody}</a>
                <a className="dropdown-item" href="/#/ExecutiveAgency">{e.activritirsoftheexecutivebody}</a>
                <a className="dropdown-item" href="/#/timeOfReception">{e.scheduleofreceptionofcitizens}</a>
                <a className="dropdown-item" href="/#/tutorials">{e.exampleofwork}</a>
              </div>
            </li>
            
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {e.stateservices}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="/#/businessbuilding">{e.businessbuilding}</a></li>
                <li><a className="dropdown-item" href="http://www.akorda.kz/ru/state_symbols/about_state_symbols" target="_blank">{e.statesymbols}</a></li>
                <li><a className="dropdown-item" href="/#/publicservices">{e.govornmentservices}</a></li>
                <li><a className="dropdown-item" href="https://www.almaty.gov.kz/page.php?page_id=3147&lang=1#id_34784" target="_blank">{e.typesofpublicservices}</a></li>
                <li><a className="dropdown-item" href="/#/reports">{e.reportfor}</a></li>
                <li><a className="dropdown-item" href="/#/stats">{e.resultoftheapz}</a></li>
                <li><a className="dropdown-item" href="/#/population">{e.workwiththepopulation}</a></li>
                <li><a className="dropdown-item" href="/#/BudgetPlan">{e.budget_plan}</a></li>
                <li><a className="dropdown-item" href="/#/Staff">{e.staffing}</a></li>
                <li><a className="dropdown-item" href="/#/EntrepreneurSupport">{e.entrepreneurialsupport}</a></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {e.stateprocurement}
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="http://www.adilet.gov.kz/ru/taxonomy/term/881" target="_blank">{e.purchaseplans}</a>
                <a className="dropdown-item" href="https://v3bl.goszakup.gov.kz/ru/reports/plans_report_admin" target="_blank">{e.termsofparticipationinpublicprocurement}</a>
                <a className="dropdown-item" href="https://www.goszakup.gov.kz/ru/search/announce?filter[method][]=3&filter[method][]=2&filter[method][]=7&filter[method][]=6&filter[method][]=50&filter[method][]=52&filter[method][]=22"  target="_blank">{e.opencompetitions}</a>
              </div>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle opros" href="#" id="navbarDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {e.interview}
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="/#/polls">{e.reconstructionofpedestrianstreets}</a>
                <a target="_blank" className="dropdown-item" href="/docs/designCode.pdf">{e.designcode}</a>
                <a className="dropdown-item" href="/#/councilMaterials">{e.materialsofthetownplanningcouncil}</a>
              </div>
            </li>
              
            <li className="nav-item map">
              <span>Карта:</span> <a className={this.giveActiveClass('/map')} href="/#/map">3D</a> | <a className={this.giveActiveClass('/map2d')} href="/#/map2d">2D</a>
            </li>
            <li><a className="nav-link last-item" target="_blank" href="/docs/doingBusiness.pdf">Doing business</a></li>
          </ul>
        </div>
      </nav>
    );
  }
}