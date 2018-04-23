import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';

export default class Sketch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      acceptedForms: [],
      declinedForms: [],
      activeForms: [],
      showDetails: false,
      Applicant: "",
      Address: "",
      Phone: "",
      Customer: "",
      Designer: "",
      ProjectName: "",
      ProjectAddress: "",
      SketchDate: ""
    }

    this.getAcceptedForms = this.getAcceptedForms.bind(this);
    this.getDeclinedForms = this.getDeclinedForms.bind(this);
    this.getActiveForms = this.getActiveForms.bind(this);
  }

  getActiveForms() {
    $.ajax({
      type: 'GET',
      url: window.url + 'api/Sketch/active',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      success: function (data) {
        this.setState({ activeForms: data });
      }.bind(this)
    });
  }

  getAcceptedForms() {
    $.ajax({
      type: 'GET',
      url: window.url + 'api/Sketch/accepted',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      success: function (data) {
        this.setState({ acceptedForms: data });
      }.bind(this)
    });
  }

  getDeclinedForms() {
    $.ajax({
      type: 'GET',
      url: window.url + 'api/Sketch/declined',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      success: function (data) {
        this.setState({ declinedForms: data });
      }.bind(this)
    });
  }

  details(e) {
    this.setState({ showDetails: true });
    this.setState({ Applicant: e.Applicant });
    this.setState({ Address: e.Address });
    this.setState({ Phone: e.Phone });
    this.setState({ Customer: e.Customer });
    this.setState({ Designer: e.Designer });
    this.setState({ ProjectName: e.ProjectName });
    this.setState({ ProjectAddress: e.ProjectAddress });
    this.setState(function(){
      var jDate = new Date(e.SketchDate);
      var curr_date = jDate.getDate();
      var curr_month = jDate.getMonth() + 1;
      var curr_year = jDate.getFullYear();
      var formated_date = curr_date + "-" + curr_month + "-" + curr_year;
      return { SketchDate: formated_date }
    });
  }

  componentDidMount() {
    this.getAcceptedForms();
    this.getDeclinedForms();
    this.getActiveForms();
  }

  render() {
    var acceptedForms = this.state.acceptedForms;
    var declinedForms = this.state.declinedForms;
    var activeForms = this.state.activeForms;
    return (
      <div className="content container body-content">
        <div className="row">
          <style dangerouslySetInnerHTML={{__html: `
            .apz-list {
              padding: 15px 20px;
            }
            .apz-list h4 {
              display: block !important;
            }
            .apz-list h4 li {
                list-style-type: none;
                margin: 10px 0 0 15px;
                font-size: 16px;
                font-weight: bold;
            }
          `}} />
            <div className="col-md-3">
                <h4 style={{textAlign: 'center'}}>Список заявлений</h4>
            </div>
            <div className="col-md-6">
                <h4 style={{textAlign: 'center'}}>Карта</h4>
            </div>
            <div className="col-md-3">
                <h4 style={{textAlign: 'center'}}>Информация</h4>
            </div>
        </div>
        <div className="row container">
          <div className="col-md-3 apz-list card">
            <h4><span id="in-process">В Процессе</span>
            {
              activeForms.map(function(acvForm, i){
                return(
                  <li key={i} onClick={this.details.bind(this, acvForm)}>
                    {acvForm.ProjectName}
                  </li>
                )
              }.bind(this))
            }
            </h4>
            <h4><span id="accepted">Принятые</span>
            {
              acceptedForms.map(function(accForm, i){
                return(
                  <li key={i} onClick={this.details.bind(this, accForm)}>
                    {accForm.ProjectName}
                  </li>
                  )
              }.bind(this))
            }
            </h4>
            <h4><span id="declined">Отказ</span>
            {
              declinedForms.map(function(decForm, i){
                return(
                  <li key={i} onClick={this.details.bind(this, decForm)}>
                    {decForm.ProjectName}
                  </li>
                )
              }.bind(this))
            }
            </h4>
          </div>
          <div className="col-md-6 apz-additional card">
            <div id="citizenMapPause" className="col-md-12 well" style={{paddingTop:'10px', height:'500px', width:'100%'}}>
                Карта со слоями
            </div>
          </div>
          <div className="col-md-3 apz-detailed card">
            <div className={this.state.showDetails ? 'row' : 'invisible'}>
                <div className="col-6"><b>Заявитель</b>:</div> <div className="col-6">{this.state.Applicant}</div>
                <div className="col-6"><b>Адрес</b>:</div> <div className="col-6">{this.state.Address}</div>
                <div className="col-6"><b>Телефон</b>:</div> <div className="col-6">{this.state.Phone}</div>
                <div className="col-6"><b>Заказчик</b>:</div> <div className="col-6">{this.state.Customer}</div>
                <div className="col-6"><b>Разработчик</b>:</div> <div className="col-6">{this.state.Designer}</div>
                <div className="col-6"><b>Название проекта</b>:</div> <div className="col-6">{this.state.ProjectName}</div>
                <div className="col-6"><b>Адрес проекта</b>:</div> <div className="col-6">{this.state.ProjectAddress}</div>
                <div className="col-6"><b>Дата заявления</b>:</div> <div className="col-6">{this.state.SketchDate}</div>
              </div>
          </div>
        </div>
        <SketchForm />
      </div>
    )
  }
}

// class ShowHide extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       childVisible: false
//     }
//   }

//   onClick() {
//     this.setState({childVisible: !this.state.childVisible});
//   }

//   render() {
//     return (
//       <div className="row">
//         <div className="col-3">
//           <button className="btn btn-outline-secondary" onClick={() => this.onClick()}>
//             Создать заявление
//           </button>
//         </div>
//         {
//           this.state.childVisible
//             ? <SketchForm />
//             : <div className="col-9"></div>
//         }
//       </div>
//     )
//   }
// }

class SketchForm extends React.Component {
  constructor() {
    super();

    this.state = {
      checkboxes: ['1': false, '2': false, '3': false, '4': false],
      visible: false
    }

    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onClick() {
    this.setState({visible: !this.state.visible});
  }

  onCheckboxChange(e) {
    var checkbox = $(e.target);
    var type = checkbox.attr('data-type');
    var stateCopy = Object.assign({}, this.state);
    stateCopy.checkboxes[type] = checkbox.prop('checked');
    
    if (checkbox.prop('checked')) {
      checkbox.parent().addClass('active');
    } else {
      checkbox.parent().removeClass('active');
    }

    this.setState(stateCopy);
  };
  
  sendForm(e) {
    e.preventDefault();

    var formData = $('#sketch-form').serializeJSON();

    $.ajax({
      type: 'POST',
      url: window.url + 'api/Sketch/Create',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      data: JSON.stringify(formData),
      success: function (data) {
        alert("Заявка отправлена");
      }
    });
  };

  render() {
    return (
      <div>
        <br />
        <button className="btn btn-outline-secondary" onClick={() => this.onClick()}>
          Создать заявку
        </button>
        {(this.state.visible) ?
        <div className="content container sketch-page pt-3">
          <form onSubmit={this.sendForm.bind(this)} id="sketch-form">
            <div className="row">
              <div className="col-sm-8">
                <div className="card">
                  <div className="card-header"><h4 className="mb-0">Заявление эскизного проекта</h4></div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="Applicant">Наименование заявителя:</label>
                          <input type="text" className="form-control" required name="Applicant" placeholder="Наименование" />
                          <small className="form-text text-muted help-block">Ф.И.О. (при его наличии) физического лица или наименование юридического лица</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="Customer">Заказчик</label>
                          <input type="text" className="form-control" name="Customer" placeholder="Заказчик" />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="Address">Адрес:</label>
                          <input type="text" className="form-control" required id="PhotoRepAddressForm" name="Address" placeholder="Адрес" />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="Designer">Проектировщик №ГСЛ, категория</label>
                          <input type="text" className="form-control" name="Designer" />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="Phone">Телефон</label>
                          <input type="tel" className="form-control" required id="PhotoRepPhone" name="Phone" placeholder="Телефон" />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="ProjectName">Наименование проектируемого объекта</label>
                          <input type="text" className="form-control" id="ProjectName" name="ProjectName" />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="ProjectAddress">Адрес проектируемого объекта</label>
                          <input type="text" className="form-control" name="ProjectAddress" />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label>Дата</label>
                          <input type="date" name="SketchDate" className="form-control" required />
                          <small className="form-text text-muted help-block">до</small>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="mx-auto">
                        <button type="button" className="btn btn-outline-secondary" style={{marginRight: '2px'}}>Отмена</button>
                        <button type="submit" className="btn btn-outline-success">Отправить заявку</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <p>Прилагается:</p>

                        <div className="list-group">
                          <label>
                            <div className="list-group-item list-group-item-action">
                              <input data-type="1" onClick={this.onCheckboxChange} type="checkbox" value="" />   Эскиз (эскизный проект)
                              <div className="file_block"></div>
                              {this.state.checkboxes[1] === true ? <FilesForm category = '1' type = '1' /> : ''}
                            </div>
                          </label>
                          <label>
                            <div className="list-group-item list-group-item-action">
                              <input data-type="2" onClick={this.onCheckboxChange} type="checkbox" value="" />   Архитектурно-планировочное задание (копия)
                              <div className="file_block"></div>
                              {this.state.checkboxes[2] === true ? <FilesForm category = '2' type = '2' /> : ''}
                            </div>
                          </label>
                          <label>
                            <div className="list-group-item list-group-item-action">
                              <input data-type="3" onClick={this.onCheckboxChange} type="checkbox" value="" />   Удостверение личности (копия)
                              <div className="file_block"></div>
                              {this.state.checkboxes[3] === true ? <FilesForm category = '3' type = '3' /> : ''}
                            </div>
                          </label>
                          <label>
                            <div className="list-group-item list-group-item-action">
                              <input data-type="4" onClick={this.onCheckboxChange} type="checkbox" value="" />   Удостверение личности поверенного (копия)
                              <div className="file_block"></div>
                              {this.state.checkboxes[4] === true ? <FilesForm category = '3' type = '4' /> : ''}
                            </div>
                          </label>
                          <label>
                            <div className="list-group-item list-group-item-action">
                              <input data-type="5" onClick={this.onCheckboxChange} type="checkbox" value="" />   Доверенность (копия)
                              <div className="file_block"></div>
                              {this.state.checkboxes[5] === true ? <FilesForm category = '4' type = '5' /> : ''}
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div id="modal_block">
            {this.state.checkboxes[1] === true ? <FileModal category = '1' type = '1' /> : ''}
            {this.state.checkboxes[2] === true ? <FileModal category = '2' type = '2' /> : ''}
            {this.state.checkboxes[3] === true ? <FileModal category = '3' type = '3' /> : ''}
            {this.state.checkboxes[4] === true ? <FileModal category = '3' type = '4' /> : ''}
            {this.state.checkboxes[5] === true ? <FileModal category = '4' type = '5' /> : ''}
          </div>
        </div>
      : ''}
      </div>
    )
  }
}

class FilesForm extends React.Component {
  constructor(props) {
    super(props);

    this.uploadFile = this.uploadFile.bind(this);
    this.selectFromList = this.selectFromList.bind(this);
  }

  uploadFile(e) {
    var file = e.target.files[0];
    var name = file.name;
    var category = this.props.category;
    var type = this.props.type;
    var row = $(e.target).closest('.list-group-item');
    var fileBlock = $('.file_block', row);

    if (!file || !category) {
      alert('Не удалось загрузить файл');

      return false;
    }

    var formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('category', category);

    $.ajax({
      type: 'POST',
      url: window.url + 'api/File/Upload',
      contentType: false,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      processData: false,
      data: formData,
      success: function (data) {
        var html = '<div id="file_' + type + '">' + data.Name + '<input type="hidden" name="Files[]" value="' + data.Id + '"><a href="#" onClick="document.getElementById(\'file_' + type + '\').remove(); return false;">&times;</a></div>';
        fileBlock.html(html);
        alert("Файл успешно загружен");
      }
    });
  }

  selectFromList() {
    $('#selectFileModal' + this.props.type).modal('show');
  }

  render() {
    return (
      <div className="row mt-3 buttons">
        <div className="mx-auto">
          <label htmlFor={'upload_file' + this.props.type} className="btn btn-success active" style={{marginRight: '2px'}}>Загрузить</label>
          <input id={'upload_file' + this.props.type} onChange={this.uploadFile} type="file" style={{display: 'none'}} />
          <button type="button" onClick={this.selectFromList} className="btn btn-info active">Выбрать из списка</button>
        </div>
      </div>
    )
  }
}

class FileModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: []
    }

    this.getFiles = this.getFiles.bind(this);
    this.selectFile = this.selectFile.bind(this);
  }

  componentDidMount() {
    this.getFiles();
  }

  getFiles() {
    $.ajax({
      type: 'GET',
      url: window.url + 'api/File/category/' + this.props.category,
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      success: function (data) {
        console.log(data);
        this.setState({ files: data });
      }.bind(this)
    });
  }

  selectFile(e) {
    var row = $(e.target).closest('tr');
    var id = row.attr('data-id');
    var fileName = $('td:first', row).html();
    var fileBlock = $('.file_block', $('input[data-type=' + this.props.type + ']').parent());
    var html = '<div id="file_' + this.props.type + '">' + fileName + '<input type="hidden" name="Files[]" value="' + id + '"><a href="#" onClick="document.getElementById(\'file_' + this.props.type + '\').remove(); return false;">&times;</a></div>';
    fileBlock.html(html);
    $('#selectFileModal' + this.props.type).modal('hide');
  }

  render() {
      return (
        <div className="modal fade" id={'selectFileModal' + this.props.type} tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Выбрать файл</h5>
                <button type="button" id="selectFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{width: '80%'}}>Название</th>
                      <th style={{width: '10%'}}>Формат</th>
                      <th style={{width: '10%'}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.files.map(function(file, index){
                        return(
                          <tr key={index} data-id={file.Id}>
                            <td>{file.Name}</td>
                            <td>{file.Extension}</td>
                            <td><button onClick={this.selectFile} className="btn btn-success">Выбрать</button></td>
                          </tr>
                        );
                      }.bind(this)
                    )}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      )
    }
}