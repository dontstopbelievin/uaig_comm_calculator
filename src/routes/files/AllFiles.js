import React from 'react';
import { NavLink } from 'react-router-dom';
import FilesForm from './FilesForm';

class AllFiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      roles: sessionStorage.getItem('userRoles')
    };
  }

  componentDidMount() {
    this.props.breadCrumbs();
    this.getFiles();
  }

  getFiles() {
    console.log("getFiles started");
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/file/all", true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        console.log(JSON.parse(xhr.responseText));
        if (xhr.status === 200) {
          this.setState({ files: JSON.parse(xhr.responseText) });
        } else {
          console.log(xhr.response);
          // alert("Ошибка " + xhr.status + ': ' + xhr.statusText);
        }
      }.bind(this)
      // console.log(data);
      xhr.send();
  }

  // Скачивание файла
  downloadFile(id) {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/file/download/' + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          var base64ToArrayBuffer = (function () {

            return function (base64) {
              var binaryString = window.atob(base64);
              var binaryLen = binaryString.length;
              var bytes = new Uint8Array(binaryLen);

              for (var i = 0; i < binaryLen; i++) {
                var ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
              }

              return bytes;
            }

          }());

          var saveByteArray = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";

            return function (data, name) {
              var blob = new Blob(data, {type: "octet/stream"}),
                  url = window.URL.createObjectURL(blob);
              a.href = url;
              a.download = name;
              a.click();
              setTimeout(function() {window.URL.revokeObjectURL(url);},0);
            };

          }());

          saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
        } else {
          alert('Не удалось скачать файл');
        }
      }
    xhr.send();
  }

  deleteFile(event) {
    var id =  event.target.getAttribute("data-id");
    var name =  event.target.getAttribute("data-name");
    var token = sessionStorage.getItem('tokenInfo');

    if (!window.confirm('Вы действительно хотите удалить файл "' + name + '"?')) {
      return false;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/file/delete/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        this.getFiles();
      }
    }.bind(this)
    xhr.send();
  }

  render() {
    return (
      <div className="content container files-page body-content">
        <div >
          <div><h4 className="mb-0">Мои файлы</h4></div>
          <div>
            <div className="row">
              <div className="col-sm-9">
                <FilesForm history={this.props.history} />
              </div>
              <div className="col-sm-3">
                <ul className="nav nav-tabs">
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/panel/common/files/all" replace>Все</NavLink></li>
                  <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/panel/common/files/images" replace>Изображении</NavLink></li>
                </ul>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '25%'}}>Название</th>
                  <th style={{width: '25%'}}>Категория</th>
                  <th style={{width: '33.33333%'}}>Описание</th>
                  <th style={{width: '16.66667%'}}>Управление</th>
                </tr>
              </thead>
              <tbody>
                {this.state.files.map(function(file, index){
                  return(
                    <tr key={index}>
                      <td>{file.name}</td>
                      <td>
                        {file.category &&
                          file.category.name_ru
                        }
                      </td>
                      <td>{file.description}</td>
                      <td>
                        <a className="pointer control_buttons" title="Скачать" data-id={file.id} onClick={this.downloadFile.bind(this, file.id)}>
                          Скачать
                        </a>

                        {this.state.roles.indexOf('Admin') !== -1 &&
                          <a className="pointer control_buttons" data-name={file.name} data-id={file.id} onClick={this.deleteFile.bind(this)}>
                            Удалить
                          </a>
                        }
                      </td>
                    </tr>
                    );
                  }.bind(this))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
};

export { AllFiles }