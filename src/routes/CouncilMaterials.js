import React from 'react';
import { Document, Page } from 'react-pdf';

export default class CouncilMaterials extends React.Component {
  state = {
    numPages: null,
    pageNumber: 1,
  }
 
  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  }
  
  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div className="content container project-page">
        <div className="card">
          <div className="card-header"><h4 className="mb-0">Материалы градостроительного совета г.Алматы</h4></div>
          <div className="card-body">
            <Document file="/docs/gradsovet.pdf" onLoadSuccess={this.onDocumentLoad}>
              <Page width="1100" pageNumber={pageNumber} />
            </Document>
            <p>Страница {pageNumber} из {numPages}</p>
            <p>
              <button className="btn btn-outline-secondary" onClick={() => (this.state.pageNumber > 1) ? this.setState({ pageNumber: this.state.pageNumber - 1 }) : ""}>&laquo;</button>&nbsp;
              <button className="btn btn-outline-secondary" onClick={() => (this.state.pageNumber < this.state.numPages) ? this.setState({ pageNumber: this.state.pageNumber + 1 }) : ""}>&raquo;</button>
            </p>
          </div>
        </div>
      </div>
    )
  }
}