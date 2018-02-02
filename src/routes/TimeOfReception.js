import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import $ from 'jquery';

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
            <div class="container">

                <div class="container navigational_price">
                    <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.timeOfReception}
                </div>



                <table class="table table-striped">

                    <tbody style={{width: '1000px', paddingTop: '0px'}}>
                    <h2 class="captionline" colspan="5">{e.captionline}</h2>
                    <hr/>

                        <thead>



                    <tr>
                        <td scope="row"></td>
                        <td style={{width: '250px' }}><strong>{e.col_1_1}</strong></td>
                        <td style={{width: '260px' }}><strong>{e.col_1_2}</strong></td>
                        <td></td>
                        <td style={{width: '240px' }}><strong>{e.col_1_3}</strong></td>
                        <td><strong>{e.col_1_4}</strong></td>
                    </tr>

                    <tr scope="row">
                        <td><strong>1</strong></td>
                        <td>{e.col_2_1}</td>
                        <td>{e.col_2_2}</td>
                        <th>
                            <img style={{width: '', height: '', display: "inline"}} src="/images/architects/zhanbyrshy.png"/>
                        </th>
                        <td>{e.col_2_3}
                            <br/>
                            {e.col_2_3_2}</td>
                        <td>{e.col_2_4}
                            <br/>
                            {e.col_2_4_2}
                        </td>
                    </tr>

                    <tr scope="row">
                        <td><strong>2</strong></td>
                        <td>{e.col_3_1}</td>
                        <td>{e.col_3_2}</td>
                        <th>
                            <img style={{width: '', height: '', display: "inline"}} src="/images/architects/tolepbergen.png"/>
                        </th>
                        <td>{e.col_3_3}
                            <br/>
                            {e.col_3_3_2}</td>
                        <td>{e.col_3_4}
                            <br/>
                            {e.col_3_4_2}
                        </td>
                    </tr>

                    <tr scope="row">
                        <td><strong>3</strong></td>
                        <td>{e.col_4_1}</td>
                        <td>{e.col_4_2}</td>
                        <th>
                            <img style={{width: '', height: '', display: "inline"}} src="/images/architects/rymzhanov.png"/>
                        </th>
                        <td>{e.col_4_3}
                            <br/>
                            {e.col_4_3_2}</td>
                        <td>{e.col_4_4}
                            <br/>
                            {e.col_4_4_2}
                        </td>
                    </tr>

                    <tr scope="row">
                        <td><strong>4</strong></td>
                        <td>{e.col_5_1}</td>
                        <td>{e.col_5_2}</td>
                        <th>
                            <img style={{width: '', height: '', display: "inline"}} src="/images/architects/isaev.png"/>
                        </th>
                        <td>{e.col_5_3}
                            <br/>
                            {e.col_5_3_2}</td>
                        <td>{e.col_5_4}
                            <br/>
                            {e.col_5_4_2}
                        </td>
                    </tr>

                    <tr scope="row">
                        <td><strong>5</strong></td>
                        <td>{e.col_6_1}</td>
                        <td>{e.col_6_2}</td>
                        <th>
                            <img style={{width: '', height: '', display: "inline"}} src="/images/architects/kultasov.png"/>
                        </th>
                        <td>{e.col_6_3}
                            <br/>
                            {e.col_6_3_2}</td>
                        <td>{e.col_6_4}
                            <br/>
                            {e.col_6_4_2}
                        </td>
                    </tr>

                    <tr scope="row">
                        <td><strong>6</strong></td>
                        <td>{e.col_7_1}</td>
                        <td>{e.col_7_2}</td>
                        <th>
                            <img style={{width: '', height: '', display: "inline"}} src="/images/architects/zhumabekov.png"/>
                        </th>
                        <td>{e.col_7_3}
                            <br/>
                            {e.col_7_3_2}</td>
                        <td>{e.col_7_4}
                            <br/>
                            {e.col_7_4_2}
                        </td>
                    </tr>

                    <tr scope="row">
                        <td><strong>7</strong></td>
                        <td>{e.col_8_1}</td>
                        <td>{e.col_8_2}</td>
                        <th>
                            <img style={{width: '', height: '', display: "inline"}} src="/images/architects/myrzekov.png"/>
                        </th>
                        <td>{e.col_8_3}
                            <br/>
                            {e.col_8_3_2}</td>
                        <td>{e.col_8_4}
                            <br/>
                            {e.col_8_4_2}
                        </td>
                    </tr>

                    <tr scope="row">
                        <td><strong>8</strong></td>
                        <td>{e.col_9_1}</td>
                        <td>{e.col_9_2}</td>
                        <th>
                            <img style={{width: '', height: '', display: "inline"}} src="/images/architects/sembaev.png"/>
                        </th>
                        <td>{e.col_9_3}
                            <br/>
                            {e.col_9_3_2}</td>
                        <td>{e.col_9_4}
                            <br/>
                            {e.col_9_4_2}
                        </td>
                    </tr>
                    </thead>
                    </tbody>
                </table>
            </div>

            )
    }
}
