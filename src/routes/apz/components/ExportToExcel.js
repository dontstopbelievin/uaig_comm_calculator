import React from 'react';
import $ from 'jquery';

export default class ExportToExcel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start_date: '',
      end_date: '',
      object_type: 'all',
      service_type: 'apzs'
    };

    this.onInputChange = this.onInputChange.bind(this);
  }

  componentWillMount() {
    //this.getFiltersData();
  }
  componentDidMount() {
      this.props.breadCrumbs();
  }

  onInputChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name] : value });
  }

  exportToExcel(progbarId = null) {
    if(this.state.start_date === '' || this.state.end_date === ''){
      alert('Заполните даты!');
      return false;
    }
    var data = {};
    Object.keys(this.state).forEach(function(k) {
      data[k] = this.state[k]
    }.bind(this));
    //var data = {xml: 'whataduck'};
    console.log(data);
    console.log(JSON.stringify(data));

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + 'api/export_to_excel/export/' + this.state.service_type, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var vision = $('.text-info[data-category='+progbarId+']');
    vision.css('display', 'none');
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
        var a = document.createElement("a");
        a.href = data.file;
        a.download = data.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        vision.css('display','inline');
        alert('Файл успешно загружен.');
      } else {
        vision.css('display','inline');
        alert('Не удалось скачать файл');
      }
    }
    xhr.send(JSON.stringify(data));
  }

  render() {

    return (
      <div>
      <div className="card-header">
          <h4 className="mb-0">Экспорт отчета по гос услугам</h4>
      </div>
      <div className="filter">
        <form className="office_filter">
          <div className="row">
            <div className="offset-sm-2 col-sm-8">
              <div className="form-group form-inline row">
                <div className="col-sm-4">
                  <label htmlFor="object_type" className="bmd-label-floating" style={{paddingRight:'20px'}}>Вид гос услуги : </label>
                </div>
                <div className="col-sm-8">
                  <select className="form-control" id="object_type" name="service_type" onChange={this.onInputChange} value={this.state.service_type}>
                    <option value="apzs">АПЗ</option>
                    <option value="sketches">Эскизный проект</option>
                  </select>
                </div>
              </div>
              <div className="form-group form-inline row">
                <div className="col-sm-4">
                  <label htmlFor="start_date" className="bmd-label-floating" style={{paddingRight:'20px'}}>Дата создания от : </label>
                </div>
                <div className="col-sm-8">
                  <input type="date" className="form-control" required id="start_date" name="start_date" onChange={this.onInputChange} value={this.state.start_date} />
                </div>
              </div>
              <div className="form-group form-inline row">
                <div className="col-sm-4">
                  <label htmlFor="end_date" className="bmd-label-floating" required style={{paddingRight:'20px'}}>Дата создания до : </label>
                </div>
                <div className="col-sm-8">
                  <input type="date" className="form-control" id="end_date" name="end_date" onChange={this.onInputChange} value={this.state.end_date} />
                </div>
              </div>
              <div className="form-group form-inline row">
                <div className="col-sm-4">
                  <label htmlFor="object_type" className="bmd-label-floating" style={{paddingRight:'20px'}}>Тип строения : </label>
                </div>
                <div className="col-sm-8">
                  <select className="form-control" id="object_type" name="object_type" onChange={this.onInputChange} value={this.state.object_type}>
                    <option value="all">Все</option>
                    <option>ИЖС</option>
                    <option>МЖК</option>
                    <option>КомБыт</option>
                    <option>ПромПред</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <div className="offset-sm-4 col-sm-8">
                  <button type="button" data-category="1" onClick={this.exportToExcel.bind(this, 1)} className="btn btn-success text-info" style={{marginRight:'10px'}}>Экспортировать</button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
      </div>
      </div>
    )
  }
}
