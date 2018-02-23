import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class timeOfReception extends React.Component{

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
            <div className="container">

                <div className="container navigational_price">
                    <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.timeOfReception}
                </div>

                <h2 className="captionline" colSpan="5">{e.captionline}</h2>
                <hr/>

                <table className="table table-striped table-own-style">
                    <thead>
                        <tr style={{backgroundColor: '#c8dce3'}}>
                            <th style={{width: '5%'}} className="th-own-style"></th>
                            <th style={{width: '25%'}} className="th-own-style"><strong>{e.col_1_1}</strong></th>
                            <th style={{width: '25%'}} className="th-own-style"><strong>{e.col_1_2}</strong></th>
                            <th style={{width: '10%'}} className="th-own-style"></th>
                            <th style={{width: '15%'}} className="th-own-style"><strong>{e.col_1_3}</strong></th>
                            <th style={{width: '20%'}} className="th-own-style"><strong>{e.col_1_4}</strong></th>
                        </tr>
                    </thead>

                    <tbody>   
                        <tr style={{backgroundColor: '#d3e8ef'}}>
                            <td><strong>1</strong></td>
                            <td>{e.col_2_1}</td>
                            <td>{e.col_2_2}</td>
                            <td>
                                <img className="td-img" src="/images/architects/zhanbyrshy.png" alt="" />
                            </td>
                            <td>{e.col_2_3}
                                <br/>
                                {e.col_2_3_2}</td>
                            <td>{e.col_2_4}
                                <br/>
                                {e.col_2_4_2}
                            </td>
                        </tr>  

                        <tr style={{backgroundColor: '#c8dce3'}}>
                            <td><strong>2</strong></td>
                            <td>{e.col_3_1}</td>
                            <td>{e.col_3_2}</td>
                            <td>
                                <img className="td-img" src="/images/architects/tolepbergen.png" alt="" />
                            </td>
                            <td>{e.col_3_3}
                                <br/>
                                {e.col_3_3_2}</td>
                            <td>{e.col_3_4}
                                <br/>
                                {e.col_3_4_2}
                            </td>
                        </tr>

                        <tr style={{backgroundColor: '#d3e8ef'}}>
                            <td><strong>3</strong></td>
                            <td>{e.col_4_1}</td>
                            <td>{e.col_4_2}</td>
                            <td>
                                <img className="td-img" src="/images/architects/rymzhanov.png" alt="" />
                            </td>
                            <td>{e.col_4_3}
                                <br/>
                                {e.col_4_3_2}</td>
                            <td>{e.col_4_4}
                                <br/>
                                {e.col_4_4_2}
                            </td>
                        </tr>

                        <tr style={{backgroundColor: '#c8dce3'}}>
                            <td><strong>4</strong></td>
                            <td>{e.col_5_1}</td>
                            <td>{e.col_5_2}</td>
                            <td>
                                <img className="td-img" src="/images/architects/isaev.png" alt="" />
                            </td>
                            <td>{e.col_5_3}
                                <br/>
                                {e.col_5_3_2}</td>
                            <td>{e.col_5_4}
                                <br/>
                                {e.col_5_4_2}
                            </td>
                        </tr>

                        <tr style={{backgroundColor: '#d3e8ef'}}>
                            <td><strong>5</strong></td>
                            <td>{e.col_6_1}</td>
                            <td>{e.col_6_2}</td>
                            <td>
                                <img className="td-img" src="/images/architects/kultasov.png" alt="" />
                            </td>
                            <td>{e.col_6_3}
                                <br/>
                                {e.col_6_3_2}</td>
                            <td>{e.col_6_4}
                                <br/>
                                {e.col_6_4_2}
                            </td>
                        </tr>

                        <tr style={{backgroundColor: '#c8dce3'}}>
                            <td><strong>6</strong></td>
                            <td>{e.col_7_1}</td>
                            <td>{e.col_7_2}</td>
                            <td>
                                <img className="td-img" src="/images/architects/zhumabekov.png" alt="" />
                            </td>
                            <td>{e.col_7_3}
                                <br/>
                                {e.col_7_3_2}</td>
                            <td>{e.col_7_4}
                                <br/>
                                {e.col_7_4_2}
                            </td>
                        </tr>

                        <tr style={{backgroundColor: '#d3e8ef'}}>
                            <td><strong>7</strong></td>
                            <td>{e.col_8_1}</td>
                            <td>{e.col_8_2}</td>
                            <td>
                                <img className="td-img" src="/images/architects/myrzekov.png" alt="" />
                            </td>
                            <td>{e.col_8_3}
                                <br/>
                                {e.col_8_3_2}</td>
                            <td>{e.col_8_4}
                                <br/>
                                {e.col_8_4_2}
                            </td>
                        </tr>

                        <tr style={{backgroundColor: '#c8dce3'}}>
                            <td><strong>8</strong></td>
                            <td>{e.col_9_1}</td>
                            <td>{e.col_9_2}</td>
                            <td>
                                <img className="td-img" src="/images/architects/sembaev.png" alt="" />
                            </td>
                            <td>{e.col_9_3}
                                <br/>
                                {e.col_9_3_2}</td>
                            <td>{e.col_9_4}
                                <br/>
                                {e.col_9_4_2}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
