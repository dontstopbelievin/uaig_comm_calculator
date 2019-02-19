import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/guest.json';
import { NavLink } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

let e = new LocalizedStrings({ru,kk});

export default class BasePagePanel extends React.Component{

  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      tokenExists: false,
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
    return(
      <div className="container body-content">
        {!sessionStorage.getItem('tokenInfo') &&
          <div className="alert alert-danger" role="alert">
            Для работы в системе необходимо <NavLink to={"/panel/common/login"}>войти </NavLink>
            или <NavLink to={"/panel/common/register"}>зарегистрироваться</NavLink>.
          </div>
        }
        <div className="container home-page col-md-12 wow fadeInUp" data-wow-duration="1.5s">
          <div className="row">
            <div className="col-md-12 col-xs-12 black-main text-center">
              <h4 >{e.public_services}</h4>
              <span><img src="/images/line.png" alt="" /></span>

              <div className="card-deck wow fadeInUp" data-wow-duration="1.5s">
                <div className="card  mt-4 mb-4 ">
                  <div className="card-image card-color-2">
                    <div className="image-border">
                      <img src="/images/2.svg" alt="true" />
                    </div>
                  </div>

                  <div className="card-body">
                    <p className="card-text">
                      {e.secondblock}
                    </p>
                  </div>
                  <div className="card-button">{console.log(this.state.rolename)}
                    {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                    {this.state.tokenExists && this.state.rolename === 'Admin' && <NavLink to={"/panel/admin/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Citizen' && <NavLink to={"/panel/citizen/apz"} replace className="btn btn-primary">Подать заявку</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Region' &&  <NavLink to={"/panel/urban/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Head' &&  <NavLink to={"/panel/head/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Electricity' &&  <NavLink to={"/panel/elector-provider/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Gas' &&  <NavLink to={"/panel/gas-provider/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Heat' &&  <NavLink to={"/panel/heat-provider/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Water' &&  <NavLink to={"/panel/water-provider/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Phone' &&  <NavLink to={"/panel/phone-provider/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'StateServices' &&  <NavLink to={"/panel/state_services/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Engineer' &&  <NavLink to={"/panel/engineer/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Office' &&  <NavLink to={"/panel/office/apz/all/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'Lawyer' &&  <NavLink to={"/panel/lawyer/apz/status/new/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'GeneralPlan' &&  <NavLink to={"/panel/gen_plan/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {this.state.tokenExists && this.state.rolename === 'HeadsStateServices' &&  <NavLink to={"/panel/head_state_services/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                    {!this.state.tokenExists && <AlertModal />}
                  </div>
                </div>

                <div className="card mt-4 mb-4 info-block">
                  <div className="card-image card-color-1">
                    <div className="image-border">
                      <img src="/images/7.svg" alt="true" />
                    </div>

                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      {e.homeSketchBlock}
                    </p>
                  </div>
                  <div className="card-button">
                      {/*this.state.tokenExists && this.state.rolename === 'Admin' && <NavLink to={"/panel"} replace className="btn btn-primary">Эскизные проекты</NavLink>*/}
                      {this.state.tokenExists && this.state.rolename === 'Citizen' && <NavLink to={"/panel/citizen/sketch"} replace className="btn btn-primary">Подать заявку</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Region' &&  <NavLink to={"/panel/urban/sketch"} replace className="btn btn-primary">Эскизные проекты</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Head' &&  <NavLink to={"/panel/head/sketch"} replace className="btn btn-primary">Эскизные проекты</NavLink>}
                      {/*this.state.tokenExists && this.state.rolename === 'Electricity' &&  <NavLink to={"/providerelectro"} replace className="btn btn-primary">Эскизные проекты</NavLink>*/}
                      {/*this.state.tokenExists && this.state.rolename === 'Gas' &&  <NavLink to={"/providergas"} replace className="btn btn-primary">Эскизные проекты</NavLink>*/}
                      {/*this.state.tokenExists && this.state.rolename === 'Heat' &&  <NavLink to={"/providerheat"} replace className="btn btn-primary">Эскизные проекты</NavLink>*/}
                      {/*this.state.tokenExists && this.state.rolename === 'Water' &&  <NavLink to={"/providerwater"} replace className="btn btn-primary">Эскизные проекты</NavLink>*/}
                      {/*this.state.tokenExists && this.state.rolename === 'ApzDepartment' &&  <NavLink to={"/panel/apz-department/sketch"} replace className="btn btn-primary">Эскизные проекты</NavLink>*/}
                      {this.state.tokenExists && this.state.rolename === 'Engineer' &&  <NavLink to={"/panel/engineer/sketch"} replace className="btn btn-primary">Эскизные проекты</NavLink>}
                      {!this.state.tokenExists && <AlertModal />}
                  </div>
                </div>

                <div className="card  mt-4 mb-4 ">
                  <div className="card-image card-color-3">
                    <div className="image-border">
                      <img src="/images/3.svg" alt="true" />
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
                      <img src="/images/1.svg" alt="true" />
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
                      <img src="/images/4.svg" alt="true" />
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
                      <img src="/images/5.svg" alt="true" />
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
                      <img src="/images/6.svg" alt="true" />
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
