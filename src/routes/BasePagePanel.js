import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import '../assets/css/NewsArticle.css';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import WOW from 'wowjs';
import $ from 'jquery';
import Loader from 'react-loader-spinner';
import Citizen from "./Citizen";
import Sketch from "./Sketch";
import PhotoReports from "./PhotoReports";
import Files from "./Files";

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
  componentWillUnmount() {

  }

  componentWillMount () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  render() {
    return(
      <div className="container body-content">

        <div className="content container citizen-apz-list-page">
          <div>
            <div>
              <h1 className={'text-center'}>Electronic architecture!</h1>
              <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam atque cupiditate modi molestiae
                  nihil officia, officiis possimus repudiandae similique. Atque debitis dicta ducimus enim fuga
                  laboriosam laborum magnam quasi voluptatum!</p>
                <p>A alias amet aperiam aspernatur aut beatae dolorum nisi quam, sequi? Ad aliquid assumenda consequatur
                  culpa cupiditate dolore maiores modi non, repellat vel. Blanditiis doloremque dolorum eaque nemo
                  voluptates, voluptatum.</p>
              </div>
              <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum expedita obcaecati porro sunt. Ad alias
                  assumenda culpa iure labore maxime nesciunt non nulla, repellat vel! Harum magni quod tempore
                  voluptas.</p>
                <p>Atque eveniet hic incidunt iste qui quo. Accusantium aliquid dolorem illo possimus sequi! Aliquid
                  amet animi cupiditate eius enim eum inventore molestiae necessitatibus placeat voluptates. Architecto
                  consectetur perspiciatis ratione tempore.</p>
              </div>
              <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aspernatur cumque deleniti eaque
                  facere in incidunt ipsa, magnam maiores modi officia officiis porro qui, reiciendis tenetur vero,
                  vitae. Architecto, eum.</p>
                <p>Aliquam, blanditiis consequatur cum cupiditate deleniti ipsam laboriosam molestiae, nam nisi quaerat
                  repellendus, reprehenderit sequi sint sit sunt suscipit temporibus. Eligendi illum molestias mollitia
                  nesciunt ratione saepe sequi suscipit voluptatibus.</p>
              </div>
              <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi impedit nulla perferendis
                  provident quas vitae voluptatem? Asperiores corporis dignissimos doloremque eius excepturi, illo,
                  maiores officiis perferendis quae quia tempore vero.</p>
                <p>A aliquid aperiam et ex id nostrum officia. Aliquam, consectetur cupiditate eveniet ex excepturi fuga
                  harum hic illum incidunt iure magnam, mollitia non nulla officia placeat quae repellat tempore
                  voluptas.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
