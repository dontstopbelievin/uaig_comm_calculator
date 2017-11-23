import React from 'react';

var columnStyle = {
  textAlign: 'center'
}

var createRoleDropdownStyle = {
  position: 'absolute',
  background: 'lavender',
  zIndex: '10',
  padding: '10px'
}

export default class Files extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: ""
    };

  }

  componentWillMount() {
    //console.log("AdminComponent will mount");

  }

  componentDidMount() {
    //console.log("AdminComponent did mount");
    // this.getFiles();
  }

  componentWillUnmount() {
    //console.log("AdminComponent will unmount");
  }

  render() {
    //console.log("rendering the AdminComponent");
    return (
      <div className="content container">
        <h3>Мои файлы</h3> 
        <ShowHide />
        <div>
          <div className="container">
            <div className="panel panel-info">
              <div className="panel-heading container-fluid">
                <div className="row">
                  <div className="col-xs-1 col-sm-1 col-md-1" style={columnStyle}>Название</div>
                  <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>Категория</div>
                  <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>Описание</div>
                  <div className="col-xs-2 col-sm-2 col-md-2" style={columnStyle}>Управление</div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ShowHide extends React.Component {
  constructor() {
    super();
    this.state = {
      childVisible: false
    }

    this.visible = this.visible.bind(this);
  }

  visible() {
    this.setState({ childVisible: !this.state.childVisible });
  }

  render() {
    return (
      <div className="row">
        <div className="col-3">
          <button className="btn btn-outline-secondary" onClick={this.visible}>
            Добавить файл
          </button>
        </div>
        {
          this.state.childVisible
            ? <FilesForm />
            : <div className="col-9"></div>
        }
      </div>
    )
  }
}

class FilesForm extends React.Component {
  constructor() {
    super();

    this.state = {
      file: [], 
      name: "", 
      category: "", 
      description: ""
    }

    this.onFileChange = this.onFileChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
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

  uploadFile() {
    // console.log("uploadFile function started");
    
    var file = this.state.file;
    var name = this.state.name;
    var category = this.state.category;
    var description = this.state.description;

    var registerData = {
      file: file,
      name: name,
      category: category,
      description: description
    };

    var data = JSON.stringify(registerData);

    if (!file || !name || !category || !description) {
      return;
    } 
    else 
    {
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/File/Upload", true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          alert("Файл успешно загружен");
        } else {
          console.log(xhr.response);
          // alert("Ошибка " + xhr.status + ': ' + xhr.statusText);
        }
      }
      console.log(data);
      xhr.send(data);
    }
  }

  render() {
    return(
      <form onSubmit={this.uploadFile}>
        <div className="form-group">
          <label className="control-label">
            Название:
            <input type="text" className="form-control" value={this.state.name} onChange={this.onNameChange} />
          </label>
        </div>
        <div className="form-group">
          <label className="control-label">
            Категория:
            <input type="text" className="form-control" value={this.state.category} onChange={this.onCategoryChange} />
          </label>
        </div>
        <div className="form-group">
          <label className="control-label">
            Описание:
            <input type="text" className="form-control" value={this.state.description} onChange={this.onDescriptionChange} />
          </label>
        </div>
        <div className="form-group">
          <label className="control-label">
            Файл:
            <input type="file" className="form-control" onChange={this.onFileChange} />
          </label>
        </div>
        <input type="submit" className="btn btn-primary" value="Загрузить" />
      </form>
      )
  }
}