import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/guest.json';
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
                    <NavLink to={"/panel/services/1"} replace className="btn btn-primary">Подробнее</NavLink>
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
                      <NavLink to={"/panel/services/2"} replace className="btn btn-primary">Подробнее</NavLink>
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
                    <NavLink to={"/panel/services/3"} replace className="btn btn-primary">Подробнее</NavLink>
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
                    <NavLink to={"/panel/services/4"} replace className="btn btn-primary">Подробнее</NavLink>
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
                    <NavLink to={"/panel/services/5"} replace className="btn btn-primary">Подробнее</NavLink>
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
                    <NavLink to={"/panel/services/6"} replace className="btn btn-primary">Подробнее</NavLink>
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
                    <NavLink to={"/panel/services/7"} replace className="btn btn-primary">Подробнее</NavLink>
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
