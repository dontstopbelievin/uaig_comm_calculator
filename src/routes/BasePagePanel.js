import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/guest.json';
import '../assets/css/NewsArticle.css';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import WOW from 'wowjs';
import $ from 'jquery';
import Loader from 'react-loader-spinner';
import Citizen from "./Citizen";
import Sketch from "./Sketch";
import PhotoReports from "./PhotoReports";
import Files from "./Files";
import { UncontrolledCarousel, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

let e = new LocalizedStrings({ru,kk});

export default class BasePagePanel extends React.Component{

  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      tokenExists: false,
      loaderHidden: true
    };
  }
  componentDidMount() {
    this.props.breadCrumbs();
  }
  componentWillMount () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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

  render() {
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    var auth;
    if (roles){
      if ( roles[0] === "Admin" && sessionStorage.getItem('tokenInfo') )
      {
        auth = false;
      }else if ( roles[0] !== "Admin" && sessionStorage.getItem('tokenInfo') ) {
        auth = true;
      }
    } else {
      auth = false;
    }
    return(
      <div className="container body-content">

        <div className="container home-page col-md-12 wow fadeInUp" data-wow-duration="1.5s">
          <div className="row">
            <div className="col-md-12 col-xs-12 black-main text-center">
              <h4 >{e.public_services}</h4>
              <span><img src="images/line.png" /></span>

              <div className="card-deck wow fadeInUp" data-wow-duration="1.5s">
                <div className="card  mt-4 mb-4 ">
                  <div className="card-image card-color-2">
                    <div className="image-border">
                      <img src="./images/2.svg" alt="true" />
                    </div>
                  </div>

                  <div className="card-body">
                    <p className="card-text">
                      {e.secondblock}
                    </p>
                  </div>
                  <div className="card-button">
                    {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                    {this.state.tokenExists && this.state.rolename === 'Admin' && <NavLink to={"/admin"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Citizen' && <NavLink to={"/citizen"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Region' &&  <NavLink to={"/urban"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Head' &&  <NavLink to={"/head"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Electricity' &&  <NavLink to={"/providerelectro"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Gas' &&  <NavLink to={"/providergas"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Heat' &&  <NavLink to={"/providerheat"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Water' &&  <NavLink to={"/providerwater"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'ApzDepartment' &&  <NavLink to={"/apz"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Engineer' &&  <NavLink to={"/engineer"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {!this.state.tokenExists && <AlertModal />}
                  </div>
                </div>

                <div className="card mt-4 mb-4 info-block">
                  <div className="card-image card-color-1">
                    <div className="image-border">
                      <img src="./images/7.svg" alt="true" />
                    </div>

                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      {e.homeSketchBlock}
                    </p>
                  </div>
                  <div className="card-button">
                    {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                    {auth &&
                    <NavLink to={"/panel/citizen/sketch"} replace className="btn btn-primary" style={{"text-transform":"none"}}>{e.apply}</NavLink>
                    }
                    {!auth &&
                    <NavLink to={"/panel/common/login"} replace className="btn  bg-danger text-white font-weight-bold" style={{"text-transform":"none"}}>{e.apply}</NavLink>
                    }
                  </div>
                </div>

                <div className="card  mt-4 mb-4 ">
                  <div className="card-image card-color-3">
                    <div className="image-border">
                      <img src="./images/3.svg" alt="true" />
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      {e.thirdblock}
                    </p>
                  </div>
                  <div className="card-button">
                    {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                    {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">{e.apply}</NavLink>}
                    {!this.state.tokenExists && <AlertModal />}
                  </div>
                </div>
              </div>

              <div className="card-deck wow fadeInUp" data-wow-duration="1.5s">
                <div className="card mt-4 mb-4 info-block">
                  <div className="card-image card-color-1">
                    <div className="image-border">
                      <img src="./images/1.svg" alt="true" />
                    </div>

                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      {e.firstblock}
                    </p>
                  </div>
                  <div className="card-button">
                    {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                    {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">{e.apply}</NavLink>}
                    {!this.state.tokenExists && <AlertModal />}
                  </div>
                </div>

                <div className="card mt-4 mb-4 ">
                  <div className="card-image card-color-4">
                    <div className="image-border">
                      <img src="./images/4.svg" alt="true" />
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      {e.fourthblock}
                    </p>
                  </div>
                  <div className="card-button">
                    {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                    {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">{e.apply}</NavLink>}
                    {!this.state.tokenExists && <AlertModal />}
                  </div>
                </div>

                <div className="card  mt-4 mb-4 ">
                  <div className="card-image card-color-5">
                    <div className="image-border">
                      <img src="./images/5.svg" alt="true" />
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      {e.fifthblock}
                    </p>
                  </div>
                  <div className="card-button">
                    {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                    {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">{e.apply}</NavLink>}
                    {!this.state.tokenExists && <AlertModal />}
                  </div>
                </div>

                <div className="card mt-4 mb-4 ">
                  <div className="card-image card-color-6">
                    <div className="image-border">
                      <img src="./images/6.svg" alt="true" />
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      {e.sixthblock}
                    </p>
                  </div>
                  <div className="card-button">
                    {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                    {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">{e.apply}</NavLink>}
                    {!this.state.tokenExists && <AlertModal />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

class AlertModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div>
        <Button className="btn btn-danger bg-danger text-white font-weight-bold" style={{textTransform:'none'}} onClick={this.toggle}>{e.apply}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{e.info}</ModalHeader>
          <ModalBody>
            {e.youneed} &nbsp;
            <NavLink to={"/panel/common/login"} className="navLink" replace>
              {e.login}
            </NavLink> {e.or}  &nbsp;
            <NavLink to={"/panel/common/register"} className="navLink" replace>
              {e.logup}
            </NavLink> {e.needkz}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>{e.close}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
