import React from 'react';
import ReactQuill from 'react-quill';

export default class AddTemplate extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      text: '',
      type: 'apz',
      isActive: '1'
    };

    this.onTextChange = this.onTextChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name] : value });
  }

  componentDidMount() {
    this.props.breadCrumbs();
  }

  requestSubmission(e) {
    e.preventDefault();

    var token = sessionStorage.getItem('tokenInfo');
    var formData = new FormData();
    formData.append('title', this.state.title);
    formData.append('text', this.state.text);
    formData.append('is_active', this.state.isActive);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + 'api/'+this.state.type+'/answer_template/create', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert('Шаблон успешно создан');
        this.props.history.push('/panel/answer-template/all/'+this.state.type+'/1');
      }else{
        alert('Не удалось');
      }
    }.bind(this);
    xhr.send(formData);
  }

  onTextChange(value){
    this.setState({text: value});
  }

  render() {
    return (
      <div className="container">
        <form method="post" onSubmit={this.requestSubmission.bind(this)}>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="Region">Район</label>
                <select className="form-control" onChange={this.onInputChange} value={this.state.type} name="type">
                  <option value="apz">АПЗ</option>
                  <option value="sketch">Эскизный проект</option>
                </select>
              </div>
            </div>
            <div className="col-sm-10">
              <div className="form-group">
                <label htmlFor="title">Название</label>
                <input type="text" maxLength="150" id="title" className="form-control" required onChange={(e) => this.setState({title: e.target.value})} />
              </div>
            </div>
            <div className="col-sm-2">
              <div className="form-group">
                <label htmlFor="isActive">Флаг активности</label>
                <select className="form-control" style={{background: 'none'}} onChange={(e) => this.setState({isActive: e.target.value})}>
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
          <input type="submit" className="btn btn-outline-success" value="Отправить" />
        </form>

        <div>
          <hr />
          <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
        </div>
      </div>
    )
  }
}
