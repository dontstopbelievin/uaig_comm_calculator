import React from 'react';
import $ from 'jquery';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import { Document, Page } from 'react-pdf';

let e = new LocalizedStrings({ru,kk});

export default class VideoTutorials extends React.Component {
  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');
    this.state = {
      numPages: null,
      pageNumber: 1,
    }
  }

  componentWillMount() {
    //console.log("Map2dViewComponent will mount");
  }

  componentDidMount() {
    //console.log("Map2dViewComponent did mount");
  }

  componentWillUnmount() {
    //console.log("Map2dViewComponent will unmount");
  }

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  }

  render() {
    return (
        <div>
          <div className="container navigational_price">
            <NavLink to="/" replace className="">{e.hometwo}</NavLink> / DOING BUSINESS
          </div>
          <div className="content container video_tutorials-plan-page">
            <div className="card">
              <div className="card-header">
              <h4 className="mb-0">Doing Business</h4></div>
              <div className="card-body">
                <Document
                  file="/docs/doingBusiness.pdf"
                  onLoadSuccess={this.onDocumentLoad}
                >
                <Page width="1100" pageNumber={this.state.pageNumber} />
                </Document>
                <p>Страница {this.state.pageNumber} из {this.state.numPages}</p>
                <p>
                  <button className="btn btn-outline-secondary" onClick={() => (this.state.pageNumber > 1) ? this.setState({ pageNumber: this.state.pageNumber - 1 }) : ""}>«</button>&nbsp;
                  <button className="btn btn-outline-secondary" onClick={() => (this.state.pageNumber < this.state.numPages) ? this.setState({ pageNumber: this.state.pageNumber + 1 }) : ""}>»</button>
                </p>
              </div>
            </div>
          </div>
        </div>
    )
  }
}