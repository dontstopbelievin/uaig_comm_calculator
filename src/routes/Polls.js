import React from 'react';

export default class Polls extends React.Component {
  
  render() {
    return (
      <div className="content container project-page">
        <div className="card">
          <div className="card-header"><h4 className="mb-0">Опрос</h4></div>
          <div className="card-body">
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSds3cFEnRn_WK38cKD6vbHUr8TYx92JRFAGDeAeiXyXtHS2EQ/viewform?embedded=true" width="100%" height="800" frameborder="0" marginheight="0" marginwidth="0">Загрузка...</iframe>
          </div>
        </div>
      </div>
    )
  }
}