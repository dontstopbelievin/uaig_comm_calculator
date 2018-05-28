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
    }

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
      } else {
        alert("Страница не найдена!");
        this.props.history.replace('/');
      }
    }.bind(this);
    xhr.send();
  }

  render() {
    return(
      <div className="container body-content newsArticle wow fadeInUp" data-wow-duration="1s">
        <div className="row col-md-12">
          {this.state.loaderHidden &&
          <div className="col-md-12 text-center">
            <div href="#" className="list-group-item flex-column align-items-start ">
                <div className="text-left mt-2 mb-1 innerText" id="innerText"
                 dangerouslySetInnerHTML={{__html: this.state.page.content}}>
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
