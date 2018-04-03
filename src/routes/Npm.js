import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import { Document, Page } from 'react-pdf';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class Npm extends React.Component{

    constructor() {
        super();
        (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

        this.state = {
            tokenExists: false,
            rolename: "",
            numPages: null,
            pageNumber: 1,
        }
    }
      onDocumentLoad = ({ numPages }) => {
      this.setState({ numPages });
    }

  render() {
        const { pageNumber, numPages } = this.state;
    return(
        <div>
        <div className="container navigational_price">

          <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.npm}
            <div className="content container project-page">
        <div className="card">
          <div className="card-header"><h4 className="mb-0">{e.npm}</h4></div>
          <div className="card-body">
            <Document
              file="/docs/npbPDF.pdf"
              onLoadSuccess={this.onDocumentLoad}

            >
              <Page width="1100" pageNumber={pageNumber} />
            </Document>
            <p>Страница {pageNumber} из {numPages}</p>
            <p>
              <button className="btn btn-outline-secondary" onClick={() => (this.state.pageNumber > 1) ? this.setState({ pageNumber: this.state.pageNumber - 1 }) : ""}>«</button>&nbsp;
              <button className="btn btn-outline-secondary" onClick={() => (this.state.pageNumber < this.state.numPages) ? this.setState({ pageNumber: this.state.pageNumber + 1 }) : ""}>»</button>
            </p>
          </div>
        </div>
      </div>
        </div>
        </div>
    )
  }
}
