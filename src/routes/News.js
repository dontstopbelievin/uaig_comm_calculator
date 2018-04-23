import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});



export default class news extends React.Component{

    constructor() {
        super();
        (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

        this.state = {
            tokenExists: false,
            rolename: ""
        }
    }

  render() {
    return (
    <div> 
        <div className="container navigational_price body-content">
            <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.news}
        </div>
        <div className="container app monthlyreport body-content">
                <p>{e.app}</p>
                <h5>{e.app_header}</h5>
                <h5>{e.app_header2}</h5>

                <hr/>

                <table className="table table-striped monthlyreport" style={{margin: '0'}}>
                  <thead>
                    <td><strong>№</strong></td>
                    <td><strong>{e.monthlyreport_thead_1}</strong></td>
                    <td><strong>{e.monthlyreport_thead_2}</strong></td>
                    <td className="monthlyreporttd3"><strong>{e.monthlyreport_thead_3}</strong></td>
                    <td><strong>{e.monthlyreport_thead_4}</strong></td>
                    <td><strong>{e.monthlyreport_thead_5}</strong></td>
                  </thead>
                  <tbody>
                      <tr>
                        <td>1</td>
                        <td className="monthlyreporttd">{e.monthlyreport_2_2}</td>
                        <td><strong>121</strong></td>
                        <td>121</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td className="monthlyreporttd">{e.monthlyreport_3_2}</td>
                        <td><strong>76</strong></td>
                        <td>76</td>
                        <td>{e.monthlyreport_psno}</td>
                        <td>{e.monthlyreport_psno}</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td className="monthlyreporttd">{e.monthlyreport_4_2}</td>
                        <td><strong>7624</strong></td>
                        <td>3306</td>
                        <td>4318</td>
                        <td>{e.monthlyreport_psno}</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td className="monthlyreporttd">{e.monthlyreport_5_2}</td>
                        <td><strong>102</strong></td>
                        <td>102</td>
                        <td>{e.monthlyreport_psno}</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td className="monthlyreporttd">{e.monthlyreport_6_2}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{e.monthlyreport_psno}</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>6</td>
                        <td className="monthlyreporttd">{e.monthlyreport_7_2}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{e.monthlyreport_psno}</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>7</td>
                        <td className="monthlyreporttd">{e.monthlyreport_8_2}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{e.monthlyreport_psno}</td>
                      </tr>
                      <tr>
                        <td>8</td>
                        <td className="monthlyreporttd">{e.monthlyreport_9_2}</td>
                        <td><strong>20</strong></td>
                        <td>{e.monthlyreport_psno}</td>
                        <td>{e.monthlyreport_psno}</td>
                        <td>20</td>
                      </tr>
                      <tr>
                        <td>9</td>
                        <td className="monthlyreporttd">{e.monthlyreport_10_2}</td>
                        <td><strong>237</strong></td>
                        <td>{e.monthlyreport_psno}</td>
                        <td>{e.monthlyreport_psno}</td>
                        <td>237</td>
                      </tr>

                      <tr>
                        <td>10</td>
                        <td className="monthlyreporttd">{e.monthlyreport_11_2}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </tr> 

                      <tr>
                        <td></td>
                        <td className="monthlyreporttd"><strong>{e.monthlyreport_total}</strong></td>
                        <td><strong>8180</strong></td>
                        <td><strong>3605</strong></td>
                        <td><strong>4318</strong></td>
                        <td><strong>257</strong></td>
                      </tr>                      
                  </tbody>
                </table>
            </div>
    </div>
    )
  }
}
