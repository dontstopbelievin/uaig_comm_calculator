import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import '../../assets/css/citizen.css';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../../languages/header.json';
import ReactHintFactory from 'react-hint'
import '../../assets/css/reacthint.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import saveAs from 'file-saver';
import AllApzs from './AllApzs';


export default class ShowStatusBar extends React.Component {
  constructor(props) {
    super(props);

    this.getStatusForArch = this.getStatusForArch.bind(this);
    this.getStatusForHeadArch = this.getStatusForHeadArch.bind(this);
    this.getStatusForProvider = this.getStatusForProvider.bind(this);
  }

  // change status for Architect in ProgressBar
  getStatusForArch(status, rd, rr) {
    if((status === 0 || status === 1 || status === 3 || status === 4) && (rd !== null && rr === null))
      return 'circle done';
    else if(status === 0 && (rd !== null && rr !== null))
      return 'circle fail';
    else if(status === 2)
      return 'circle active';
    else
      return 'circle';
  }

  // change status for Providers(water, heat, gas, electricity) in ProgressBar
  getStatusForProvider(pStatus, status) {
    if(status === 1)
      return 'circle done';
    else if(status === 0)
      return 'circle fail';
    else if(pStatus === 3 && status === 2)
      return 'circle active';
    else
      return 'circle';
  }

  // change status for HeadArchitect in ProgressBar
  getStatusForHeadArch(status, hd, hr) {
    if(status === 2 || ((status === 0 || status === 1 || status === 2 || status === 3) && (hd === null && hr === null)))
      return 'circle';
    else if(status === 4)
      return 'circle active';
    else if(status === 0)
      return 'circle fail';
    else
      return 'circle done';
  }

  toDate(date) {
    if(date === null) {
      return date;
    }

    var jDate = new Date(date);
    var curr_date = jDate.getDate();
    var curr_month = jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var curr_hour = jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;

    return formated_date;
  }

  render() {
    return (
      <div className="row">
        <div className="row statusBar">
          {/*<div id="infoDiv">Нажмите на участок или объект, чтобы получить информацию</div>*/}
          {/*<div id="viewDiv"></div>*/}
          <div className="progressBar container">
            <ul className="timeline">
              <li>
                <div className="timestamp">
                  <span>
                    <p>Районный архитектор</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Инженер</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Коммунальные службы</p>
                    <div className="status">
                      <div className="komStatus">
                                <ul>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">Алматы Су</span>
                                        </div>
                                    </li>
                                    <li className=" li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">Алматы Телеком</span>
                                        </div>
                                    </li>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/error.png" alt="error"/>
                                          <span className="author">Алатау Жарык Компаниясы</span>
                                        </div>
                                    </li>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">КазТрансГаз</span>
                                        </div>
                                    </li>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">Тепловые сети Алматы</span>
                                        </div>
                                    </li>
                                </ul>
                      </div>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Инженер</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Отдел АПЗ</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Главный архитектор</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <br />
          <div className="row actionDate">
            <div className="col-2" style={{padding: '0'}}></div>
            <div className="col-8" style={{padding: '0', fontSize: '0.9em'}}>
              <div className="row">
                <div className="col-2">{this.props.apz.RegionDate && this.toDate(this.props.apz.RegionDate)}</div>
                <div className="col-1point5">{this.props.apz.ProviderWaterDate && this.toDate(this.props.apz.ProviderWaterDate)}</div>
                <div className="col-1point5">{this.props.apz.ProviderGasDate && this.toDate(this.props.apz.ProviderGasDate)}</div>
                <div className="col-1point5">{this.props.apz.ProviderHeatDate && this.toDate(this.props.apz.ProviderHeatDate)}</div>
                <div className="col-2">{this.props.apz.ProviderElectricityDate && this.toDate(this.props.apz.ProviderElectricityDate)}</div>
                <div className="col-2">{this.props.apz.ProviderPhoneDate && this.toDate(this.props.apz.ProviderPhoneDate)}</div>
                <div className="col-2">{this.props.apz.HeadDate && this.toDate(this.props.apz.HeadDate)}</div>
              </div>
            </div>
            <div className="col-2" style={{padding: '0'}}></div>
          </div>
        </div>
      </div>
    )
  }
}
