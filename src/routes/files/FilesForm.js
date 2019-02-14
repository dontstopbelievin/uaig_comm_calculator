import React from 'react';

export default class FilesForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: [],
      categories: [],
      name: "",
      category: "",
      description: ""
    }

    this.onFileChange = this.onFileChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.getCategories = this.getCategories.bind(this);
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  onNameChange(e) {
    this.setState({ name: e.target.value });
  }

  onCategoryChange(e) {
    this.setState({ category: e.target.value });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  componentWillMount() {
    this.getCategories();
  }

  uploadFile() {
    // console.log("uploadFile function started");

    var file = this.state.file;
    var name = this.state.name;
    var category = this.state.category;
    var description = this.state.description;
    var token = sessionStorage.getItem('tokenInfo');

    var registerData = {
      file: file,
      name: name,
      category: category,
      description: description
    };

    var formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);

    var data = JSON.stringify(registerData);

    if (!file || !name || !category || !description) {
      return;
    }
    else
    {
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/file/upload", true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      //xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          document.getElementById('uploadFileModalClose').click();
          alert("Файл успешно загружен")
        } else {
          console.log(xhr.response);
          // alert("Ошибка " + xhr.status + ': ' + xhr.statusText);
        }
      }.bind(this)
      console.log(data);
      xhr.send(formData);
    }
  }

  getCategories() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/file/categoriesList", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          this.setState({ categories: JSON.parse(xhr.responseText) });
        } else {
          console.log(xhr.response);
        }
      }.bind(this)
      xhr.send();
  }

  render() {
    return(
      <div>
        <button className="btn btn-outline-primary mt-3" data-toggle="modal" data-target="#uploadFileModal">
          Добавить файл
        </button>
        <div className="modal fade" id="uploadFileModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form>
                <div className="modal-header">
                  <h5 className="modal-title">Загрузить файл</h5>
                  <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="upload_name">Название</label>
                    <input type="text" className="form-control" id="upload_name" placeholder="Название" value={this.state.name} onChange={this.onNameChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="upload_category">Категория</label>
                    <select className="form-control" id="upload_category" onChange={this.onCategoryChange}>
                      <option value="" selected disabled>Выберите категорию</option>
                      {
                        this.state.categories.map(function(category, index)
                          {
                            return(
                              <option value={category.id}  key={index}>{category.name_ru}</option>
                            )
                          }
                        )
                      }
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="upload_description">Описание</label>
                    <textarea className="form-control" id="upload_description" value={this.state.description} onChange={this.onDescriptionChange} placeholder="Описание"></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="upload_file">Файл</label>
                    <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <input type="button" onClick={this.uploadFile} className="btn btn-primary" value="Загрузить" />
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      )
  }
}
