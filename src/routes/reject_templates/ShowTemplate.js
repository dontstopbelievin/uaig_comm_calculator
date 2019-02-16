import React from 'react';
import Loader from 'react-loader-spinner';
import ReactQuill from 'react-quill';

export default class ShowTemplate extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      text: '',
      isActive: '',
      loaderHidden: false,
    };

    this.onTextChange = this.onTextChange.bind(this);
  }
  componentDidMount() {
    this.props.breadCrumbs();
  }

  componentWillMount() {
    this.getTemplateInfo();
  }

  getTemplateInfo() {
    var type = this.props.match.params.type;
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/"+type+"/answer_template/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        this.setState({title: data.title});
        this.setState({text: data.text});
        this.setState({isActive: data.is_active});
        this.setState({loaderHidden: true});
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }

  requestSubmission(e) {
    e.preventDefault();

    var id = this.props.match.params.id;
    var type = this.props.match.params.type;
    var token = sessionStorage.getItem('tokenInfo');
    var formData = new FormData();
    formData.append('title', this.state.title);
    formData.append('text', this.state.text);
    formData.append('is_active', this.state.isActive);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + 'api/'+type+'/answer_template/update/' + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert('Шаблон успешно сохранен');
      }else{
        alert('Не удалось, возможно шаблон не пренадлежит вам.');
      }
    };
    xhr.send(formData);
  }

  onTextChange(value){
    this.setState({text: value});
  }

  render() {
    return (
      <div>
        {this.state.loaderHidden &&
          <div className="container">
            <form method="post" onSubmit={this.requestSubmission.bind(this)}>
              <div className="row">
                <div className="col-sm-10">
                  <div className="form-group">
                    <label htmlFor="title">Название</label>
                    <input type="text" maxLength="150" id="title" className="form-control" required value={this.state.title} onChange={(e) => this.setState({title: e.target.value})} />
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="isActive">Флаг активности</label>
                    <select className="form-control" style={{background: 'none'}} value={this.state.isActive} onChange={(e) => this.setState({isActive: e.target.value})}>
                      <option value="1">Активен</option>
                      <option value="0">Не активен</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="text">Текст</label>
                <ReactQuill value={this.state.text} onChange={this.onTextChange} />
              </div>
              <input type="submit" className="btn btn-outline-success" value="Сохранить" />
            </form>

            <div>
              <hr />
              <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
            </div>
          </div>
        }

        {!this.state.loaderHidden &&
          <div style={{textAlign: 'center'}}>
            <Loader type="Oval" color="#46B3F2" height="200" width="200" />
          </div>
        }
      </div>
    )
  }
}
