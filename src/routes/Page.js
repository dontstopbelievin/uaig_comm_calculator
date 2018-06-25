import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import '../assets/css/NewsArticle.css';
import WOW from 'wowjs';
import $ from 'jquery';
import Loader from 'react-loader-spinner';

let e = new LocalizedStrings({ru,kk});

export default class Page extends React.Component{

  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
        tokenExists: false,
        loaderHidden: false,
        page: []
    };
      this.insertItemIntoPage = this.insertItemIntoPage.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.id !== nextProps.match.params.id) {
      this.getPage(nextProps.match.params.id);
    }
  }
  componentDidMount() {
     new WOW.WOW({
        live: false
    }).init();

  }

  componentWillMount () {
    this.getPage(this.props.match.params.id);
  }

  getPage (id) {
    var link = '/api/getPage/show/' + id;
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + link, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data.page);
        this.setState({page: data.page});
        this.setState({loaderHidden: true});

        var re = /&lt;/gi;
        var str = this.state.page.content;
        var newstr = str.replace(re, '<');
        console.log(newstr);
        console.log('_______________');
        var me = /&gt;/gi;
        var str1  = newstr.replace(me,'>');
        console.log(str1);
        console.log('_______________');
        var te = /&quot;/gi;
        var str2  = str1.replace(te,'"');
        console.log(str2);

        var d1 = document.getElementById('innerText');
        d1.innerHTML = '<div>' + str2 + '</div>';
      } else {
        alert("Страница не найдена!");
        this.props.history.replace('/');
      }
    }.bind(this);
    xhr.send();
  }

  insertItemIntoPage () {

  }

  render() {
    return(
      <div className="container body-content newsArticle wow fadeInUp" data-wow-duration="1s">
        <div className="row col-md-12">
          {this.state.loaderHidden &&
          <div className="col-md-12 text-center">
            <div className="list-group-item flex-column align-items-start ">
                <div className="text-left mt-2 mb-1 innerText" id="innerText">
                </div>
              <br/>
            </div>
            <hr/>
            <div className="col-md-12 text-center">
                <a className="allnews" href="/#/" onClick={this.props.history.goBack}>Вернуться</a>
            </div>
          </div>
          }
          {!this.state.loaderHidden &&
            <div className={'row col-md-12'}>
              <div className={'col-md-5'}></div>
              <Loader type="Oval" color="#46B3F2" height="200" width="200"/>
              <div className={'col-md-4'}></div>
            </div>
          }
        </div>
        <br/>
        <br/>
      </div>
    )
  }
}
