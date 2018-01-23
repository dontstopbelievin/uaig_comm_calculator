import React from 'react';
//import { NavLink } from 'react-router-dom';

export default class BudgetPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: []
    };

  }

  componentDidMount() {
    this.getFiles();
  }

  getFiles() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/File/system_category/budget", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          this.setState({ files: JSON.parse(xhr.responseText).reverse() });
        }
      }.bind(this)
      xhr.send();
  }

  // Скачивание файла
  downloadFile(event) {
    var id =  event.target.getAttribute("data-id");
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/File/download/" + id, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        window.location = window.url + "api/File/download/" + id
      } else {
        alert('Не удалось скачать файл');
      }
    }
    xhr.send();
  }

  render() {
    return (
      <div className="content container budget-plan-page">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Бюджетное планирование</h4></div>
          <div className="card-body">
            <ul>
            {this.state.files.map(function(file, index){
              return(
                <a key={index} className="list-group-item" >
                  <i className="glyphicon glyphicon-file"></i>
                  <div className="bmd-list-group-col">
                    <p className="list-group-item-heading pointer" data-id={file.Id} onClick={this.downloadFile.bind(this)}>
                      {file.Name}
                    </p>
                    <p className="list-group-item-text">{file.Description}</p>
                  </div>
                  <i className="glyphicon glyphicon-download-alt pull-xs-right pointer" data-id={file.Id} onClick={this.downloadFile.bind(this)}></i>
                </a>
                );
              }.bind(this))
            }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}