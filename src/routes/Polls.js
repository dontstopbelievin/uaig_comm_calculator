import React from 'react';

export default class Polls extends React.Component {
  
  render() {
    return (
      <div className="content container project-page">
        <div className="card">
          <div className="card-header"><h4 className="mb-0">Опрос</h4></div>
          <div className="card-body">
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScj6irispAI_eZL_zbnw7H5XDUFDYKx7JWbHZXk9j3rdvL3tw/viewform?embedded=true" width="100%" height="1175"  scrolling="no" frameborder="0" marginheight="0" marginwidth="0">Загрузка...</iframe>
          </div>
        </div>
      </div>
    )
  }
}