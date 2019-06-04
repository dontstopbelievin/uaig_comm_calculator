import React from 'react';
import { NavLink } from 'react-router-dom';
import FilesForm from './FilesForm';

class Images extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: []
    };
  }

  componentDidMount() {
    this.props.breadCrumbs();
    this.getImages();
  }

  getImages() {
    console.log("getFiles started");
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/file/images", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        this.setState({ images: JSON.parse(xhr.responseText) });
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
            <div>
                <div className="container">
                 <div className="panel panel-info">
                  <div className="card-deck">

                    {this.state.images.map(function(image, index){
                        return(
                          <div className="card" key={index}>
                            <div className="image-thumbnail">
                              <div style={{background: 'url(data:' + image.ContentType + ';base64,' + image.base64 + ') center center'}}></div>
                            </div>
                            <div className="card-body">
                              <h4 className="card-title">{image.name}</h4>
                              <p className="card-text">{image.description}</p>
                            </div>
                            <div className="card-footer">
                              <button type="button" className="btn btn-outline-primary" onClick={this.downloadFile.bind(this, image.id)}>
                                Скачать
                              </button>
                            </div>
                          </div>
                        );
                      }.bind(this))
                    }

                  </div>
                </div>
              </div>
             </div>
          </div>
        </div>
      </div>
    )
  }
};

export { Images }
