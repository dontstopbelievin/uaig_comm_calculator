import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import {Link, Switch } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactHintFactory from "react-hint";
import '../../../assets/css/welcomeText.css';
import ShowMap from './ShowMap';

const ReactHint = ReactHintFactory(React)

export default class AddSketch extends React.Component {
  constructor() {
      super();

      this.state = {
          applicant: '',
          customer:'',
          address:'',
          phone:'',
          projectName:'',
          projectAddress:'',
          landArea:'',
          coverArea:'',
          greenArea:'',
          objectLevel:'',
          commonArea:'',
          buildArea:'',
          objectType:'',
          basementFacade:'',
          basementColor:'',
          wallsFacade:'',
          wallsColor:'',
          region: 'Наурызбай',
          categoryFiles: [],
          // hasCoordinates:false,
          personalIdFile: null,
          sketchFile: null,
          apzFile:null,
          additionalFile: '',
          paymentPhotoFile: '',
          survey: null,
          claimedCapacityJustification: null,
          loaderHidden : true,
          aktNumber: '',
          objectPyaten: '',
          objectCarpark: '',
          objectDOU: '',
          checkboxes: ['1'
  :
      false, '2'
  :
      false, '3'
  :
      false, '4'
  :
      false
  ]
  }
      this.hasCoordinates=this.hasCoordinates.bind(this);
      this.toggleMap=this.toggleMap.bind(this);
      this.onCheckboxChange = this.onCheckboxChange.bind(this);
      this.resetForm = this.resetForm.bind(this);
      this.onNameChange = this.onNameChange.bind(this);
      this.onCustomerChange = this.onCustomerChange.bind(this);
      this.onInputChange=this.onInputChange.bind(this);
      this.uploadFile=this.uploadFile.bind(this);
      this.saveApz=this.saveApz.bind(this);
      this.onAreaCheck=this.onAreaCheck.bind(this);
      this.selectFile = this.selectFile.bind(this);
  }

  toggleMap(value) {
      this.setState({
          showMap: value
      })

      if (value) {
          $('#tab0-form').slideUp();
      } else {
          $('#tab0-form').slideDown();
      }
  }

  hasCoordinates(value) {

      if (value) {
          $('.coordinates_block div:eq(0)').removeClass('col-sm-7').addClass('col-sm-6');
          $('.coordinates_block div:eq(1)').removeClass('col-sm-5').addClass('col-sm-6');
      } else {
          $('.coordinates_block div:eq(0)').removeClass('col-sm-6').addClass('col-sm-7');
          $('.coordinates_block div:eq(1)').removeClass('col-sm-6').addClass('col-sm-5');
      }
      this.setState({ hasCoordinates: value });
  }

  onCustomerChange(e){
      this.setState({customer:e.target.value});
  }

  onNameChange(e){
    this.setState({applicant:e.target.value});
  }

  onInputChange(e) {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      const name = e.target.name;
      this.setState({ [name] : value });
  }

  onAreaCheck(e){
      const name =e.target.name;
      const value=e.target.value;
      var check=value>0?this.setState({[name]:value}):alert("error");
  }



  downloadFile(id, progbarId = null) {
        var token = sessionStorage.getItem('tokenInfo');
        var url = window.url + 'api/file/download/' + id;

        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        var vision = $('.text-info[data-category='+progbarId+']');
        var progressbar = $('.progress[data-category='+progbarId+']');
        vision.css('display', 'none');
        progressbar.css('display', 'flex');
        xhr.onprogress = function(event) {
            $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100) + '%');
        }
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                var base64ToArrayBuffer = (function () {

                    return function (base64) {
                        var binaryString =  window.atob(base64);
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
                        setTimeout(function() {
                            window.URL.revokeObjectURL(url);
                            $('div', progressbar).css('width', 0);
                            progressbar.css('display', 'none');
                            vision.css('display','inline');
                            alert("Файлы успешно загружены");
                        },1000);
                    };

                }());

                saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
            } else {
                $('div', progressbar).css('width', 0);
                progressbar.css('display', 'none');
                vision.css('display','inline');
                alert('Не удалось скачать файл');
            }
        }
        xhr.send();
    }

    uploadFile(category, e) {
      var file = e.target.files[0];
      var name = file.name.replace(/\.[^/.]+$/, "");
      var progressbar = $('.progress[data-category=' + category + ']');

      if (!file || !category) {
        alert('Не удалось загрузить файл');
        return false;
      }

      var formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('category', category);
      progressbar.css('display', 'flex');
      $.ajax({
        type: 'POST',
        url: window.url + 'api/file/upload',
        contentType: false,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
        },
        processData: false,
        data: formData,
        xhr: function() {
          var xhr = new window.XMLHttpRequest();

          xhr.upload.addEventListener("progress", function(evt) {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);
              $('div', progressbar).css('width', percentComplete + '%');
            }
          }, false);

          return xhr;
        },
        success: function (response) {
          var data = {id: response.id, name: response.name};

          setTimeout(function() {
            progressbar.css('display', 'none');
            switch (category) {
              case 3:
                this.setState({personalIdFile: data});
                break;

              case 2:
                this.setState({apzFile: data});
                break;

              case 1:
                this.setState({sketchFile: data});
                break;
            }
            alert("Файл успешно загружен");
          }.bind(this), '1000')
        }.bind(this),
        error: function (response) {
          progressbar.css('display', 'none');
          alert("Не удалось загрузить файл");
        }
      });
    }

  componentDidMount() {
    console.log(sessionStorage.getItem('userId'));
    var userId = sessionStorage.getItem('userId');
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/personalData/edit/"+userId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            data = data.userData;
            console.log(data);
            this.setState({first_name: data.first_name});
            this.setState({last_name: data.last_name});
            this.setState({middle_name: data.middle_name ?data.middle_name:" "});
            this.setState({company_name:data.company_name ?data.company_name:" "});
            if (data.bin !== null){
                this.setState({bin: data.bin});
            }else{
                this.setState({bin: false});
                this.setState({iin: data.iin});
            }
            this.setState({ loaderHidden: true });
        } else if (xhr.status === 401) {
            sessionStorage.clear();
            alert("Время сессии истекло. Пожалуйста войдите заново!");
            this.props.history.replace("/login");
        } else if (xhr.status === 500) {
            alert('Пользователь не найден в базе данных. Попробуйте еще раз!')
        }
    }.bind(this);
    xhr.send();
    this.props.breadCrumbs();
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

  resetForm() {
    document.getElementById("sketch-form").reset();

    $('#sketch-form input[type="checkbox"]').map(function(index, item){
      var parent = $(item).parent();

      parent.removeClass('active');
      $('.buttons', parent).remove();
      $('.file_block', parent).remove();
    });
  }

  ObjectArea(e) {
      if(e.target.name === 'objectArea') {
          this.setState({objectArea: e.target.value});
      }
  }

  selectFromList(category, e) {
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/file/category/" + category, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
          if (xhr.status === 200) {
              var data = JSON.parse(xhr.responseText);
              this.setState({categoryFiles: data});

              $('#selectFileModal').modal('show');
          }
      }.bind(this)
      xhr.send();
  }

  selectFile(e) {
    var fileName = e.target.dataset.name;
    var id = e.target.dataset.id;
    var category = e.target.dataset.category;
    var data = {id: id, name: fileName};

    switch (category) {
      case '3':
        this.setState({personalIdFile: data});
        break;

      case '1':
        this.setState({sketchFile: data});
        break;

      case '2':
        this.setState({apzFile: data});
        break;
    }

    $('#selectFileModal').modal('hide');
  }


    componentWillMount() {
        if (this.props.match.params.id) {
            this.getSketchInfo();
        }
    }

    getSketchInfo() {
    this.setState({loaderHidden: false});

    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/sketch/citizen/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
        if (xhr.status === 200) {
            var sketch = JSON.parse(xhr.responseText);

            this.setState({applicant: sketch.applicant ? sketch.applicant : '' });
            this.setState({address: sketch.address ? sketch.address : '' });
            this.setState({phone: sketch.phone ? sketch.phone : '' });
            this.setState({region: sketch.region ? sketch.region : '' });
            this.setState({designer: sketch.designer ? sketch.designer : '' });
            this.setState({type: sketch.type ? sketch.type : '' });
            this.setState({projectName: sketch.project_name ? sketch.project_name : '' });
            this.setState({projectAddress: sketch.project_address ? sketch.project_address : '' });
            this.setState({personalIdFile: sketch.files.filter(function(obj) { return obj.category_id === 3 })[0]});
            this.setState({apzFile: sketch.files.filter(function(obj) { return obj.category_id === 2 })[0]});
            this.setState({sketchFile: sketch.files.filter(function(obj) { return obj.category_id === 1 })[0]});
            this.setState({objectType: sketch.object_type ? sketch.object_type : '' });
            this.setState({objectPyaten: sketch.object_pyaten ? sketch.object_pyaten : '' });
            this.setState({objectCarpark: sketch.object_carpark ? sketch.object_carpark : '' });
            this.setState({objectDOU: sketch.object_dou ? sketch.object_dou : '' });
            this.setState({customer: sketch.customer ? sketch.customer : '' });
            this.setState({objectTerm: sketch.object_term ? sketch.object_term : '' });
            this.setState({objectLevel: sketch.object_level ? sketch.object_level : '' });
            this.setState({commonArea: sketch.common_area ? sketch.common_area : '' });
            this.setState({buildArea: sketch.build_area ? sketch.build_area : '' });
            this.setState({aktNumber: sketch.akt_number ? sketch.akt_number: '' });
            this.setState({landArea: sketch.land_area ? sketch.land_area : '' });
            this.setState({coverArea: sketch.cover_area ? sketch.cover_area : '' });
            this.setState({greenArea: sketch.green_area ? sketch.green_area : '' });
            this.setState({basementFacade: sketch.basement_facade ? sketch.basement_facade : '' });
            this.setState({basementColor: sketch.basement_color ? sketch.basement_color : '' });
            this.setState({wallsFacade: sketch.walls_facade ? sketch.walls_facade : '' });
            this.setState({wallsColor: sketch.walls_color ? sketch.walls_color : '' });

        }

        this.setState({loaderHidden: true});
    }.bind(this)
    xhr.send();
}


  saveApz(publish,e) {
    e.preventDefault();

    if (publish) {
      var requiredFields = {
      };

      if(this.state.objectType == 'МЖК'){
        requiredFields['objectLevel'] = 'Этажность';
        requiredFields['objectRooms'] = 'Количество квартир (номеров, кабинетов)';
        requiredFields['objectPyaten'] = 'Количество пятен';
        requiredFields['objectCarpark'] = 'Количество парковочных мест';
        requiredFields['objectDOU'] = 'Количество мест в детское дошкольное учреждение и детский сад';
      }
      var errors = 0;
      var err_msgs = "";
      Object.keys(requiredFields).forEach(function(key){
        if (!this.state[key]) {
          err_msgs += 'Заполните поле ' + requiredFields[key] + '\n';
          errors++;
          return false;
        }
      }.bind(this));

      if (errors > 0) {
        alert(err_msgs);
        return false;
      }
    }

    var sketchId = this.props.match.params.id;
    var link = sketchId > 0 ? ("api/sketch/citizen/save/" + sketchId) : "api/sketch/citizen/save";

    var data={
        publish:publish?true:false
    }

      Object.keys(this.state).forEach(function(k) {
          data[k] = this.state[k]
      }.bind(this));

      this.setState({loaderHidden: false});
      console.log(data);
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + link, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
          this.setState({loaderHidden: true});

          if (xhr.status === 200) {
              var data = JSON.parse(xhr.responseText);

              if (publish) {
                  alert("Заявка успешно подана.\nЗаявка будет рассматриваться завтра.");
                  this.props.history.replace('/panel/citizen/sketch');
              } else {
                  alert('Заявка успешно сохранена');

                  if (!sketchId) {
                      this.props.history.push('/panel/citizen/sketch/edit/' + data.id);
                  }
              }
          } else {
              alert("При сохранении заявки произошла ошибка!"+xhr.status);
          }
      }.bind(this);
      xhr.send(JSON.stringify(data));
  };

  render() {
    return (
        <div className="container" id="apzFormDiv">
            <ReactHint autoPosition events delay={100} />
            <ReactHint attribute="data-custom" events onRenderContent={this.onRenderContent} ref={(ref) => this.instance = ref} delay={100}/>
            {this.state.loaderHidden &&
            <div className="tab-pane">
                <div className="row">
                    <div className="col-4">
                        <div className="nav flex-column nav-pills container-fluid" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            <a className="nav-link active" id="tab0-link" data-toggle="pill" href="#tab0" role="tab" aria-controls="tab0" aria-selected="true">Заявление <span id="tabIcon"></span></a>
                            <a className="nav-link" id="tab1-link" data-toggle="pill" href="#tab1" role="tab" aria-controls="tab1" aria-selected="false">Показатели по генеральному плану <span id="tabIcon"></span></a>
                            <a className="nav-link" id="tab2-link" data-toggle="pill" href="#tab2" role="tab" aria-controls="tab2" aria-selected="false">Показатели по проекту<span id="tabIcon"></span></a>
                            <a className="nav-link" id="tab3-link" data-toggle="pill" href="#tab3" role="tab" aria-controls="tab3" aria-selected="false">Архитектурные решения по отделки фасада здания и сооружения<span id="tabIcon"></span></a>
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="tab-content" id="v-pills-tabContent">
                            <div className="tab-pane fade show active" id="tab0" role="tabpanel" aria-labelledby="tab0-link">
                                <form id="tab0-form" data-tab="0" onSubmit={this.saveApz.bind(this, false)}>
                                    <div className="row">
                                        <div className="col-md-7">
                                            <div className="form-group">
                                                <label htmlFor="Applicant">Наименование заявителя:</label>
                                                <input data-rh="Заявитель" data-rh-at="right" type="text" className="form-control" onChange={this.onNameChange} name="applicant" value={this.state.applicant=this.state.company_name==' ' ?this.state.last_name+" "+this.state.first_name+" "+this.state.middle_name:this.state.company_name } required />
                                                {/*<span className="help-block"></span>*/}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="address">Адрес жительства:</label>
                                                <input data-rh="Адрес жительства" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} name="address" value={this.state.address} required />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Phone">Телефон</label>
                                                <input data-rh="Телефон" data-rh-at="right" type="tel" className="form-control" onChange={this.onInputChange} value={this.state.phone} name="phone" placeholder="8 (7xx) xxx xx xx" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Customer">Заказчик</label>
                                                <input data-rh="Заказчик" data-rh-at="right" type="text" required onChange={this.onCustomerChange} value={this.state.customer=this.state.company_name==' ' ?this.state.last_name+" "+this.state.first_name+" "+this.state.middle_name:this.state.company_name} className="form-control customer_field" name="customer" placeholder="ФИО / Наименование компании" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Region">Район</label>
                                                <select className="form-control" onChange={this.onInputChange} value={this.state.region} name="region">
                                                    <option>Наурызбай</option>
                                                    <option>Алатау</option>
                                                    <option>Алмалы</option>
                                                    <option>Ауезов</option>
                                                    <option>Бостандық</option>
                                                    <option>Жетісу</option>
                                                    <option>Медеу</option>
                                                    <option>Турксиб</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Designer">Проектировщик №ГСЛ, категория</label>
                                                <input data-rh="Проектировщик №ГСЛ, категория" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.designer} name="designer" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="ProjectName">Наименование проектируемого объекта</label>
                                                <input data-rh="Наименование проектируемого объекта" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.projectName} id="ProjectName" name="projectName" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="ProjectAddress">Адрес проектируемого объекта</label>
                                                <input data-rh="Адрес проектируемого объекта" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.projectAddress} name="projectAddress" />
                                                <div className="row coordinates_block pt-0">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="form-group">
                                                <label>Уд.личности/Реквизиты</label>
                                                <div className="file_container">
                                                    <div className="progress mb-2" data-category="3" style={{height: '20px', display: 'none'}}>
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>

                                                    {this.state.personalIdFile &&
                                                    <div className="file_block mb-2">
                                                        <div>
                                                            {this.state.personalIdFile.name}
                                                            <a className="pointer" onClick={(e) => this.setState({personalIdFile: false}) }>×</a>
                                                        </div>
                                                    </div>
                                                    }

                                                    <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                                        <label htmlFor="PersonalIdFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                                        <input type="file" id="PersonalIdFile" name="PersonalIdFile" className="form-control" onChange={this.uploadFile.bind(this, 3)} style={{display: 'none'}} />
                                                        <label onClick={this.selectFromList.bind(this, 3)} className="btn btn-info btn-sm">Выбрать из списка</label>
                                                    </div>
                                                    <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Эскиз (эскизный проект)</label>
                                                <div className="file_container">
                                                    <div className="progress mb-2" data-category="1" style={{height: '20px', display: 'none'}}>
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>

                                                    {this.state.sketchFile &&
                                                    <div className="file_block mb-2">
                                                        <div>
                                                            {this.state.sketchFile.name}
                                                            <a className="pointer" onClick={(e) => this.setState({sketchFile: false}) }>×</a>
                                                        </div>
                                                    </div>
                                                    }

                                                    <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                                        <label htmlFor="SketchFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                                        <input type="file" id="SketchFile" name="SketchFile" className="form-control" onChange={this.uploadFile.bind(this, 1)} style={{display: 'none'}} />
                                                        <label onClick={this.selectFromList.bind(this, 1)} className="btn btn-info btn-sm">Выбрать из списка</label>
                                                    </div>
                                                    <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Архитектурно-планировочное задание (копия)</label>
                                                <div className="file_container">
                                                    <div className="progress mb-2" data-category="2" style={{height: '20px', display: 'none'}}>
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>

                                                    {this.state.apzFile &&
                                                    <div className="file_block mb-2">
                                                        <div>
                                                            {this.state.apzFile.name}
                                                            <a className="pointer" onClick={(e) => this.setState({apzFile: false}) }>×</a>
                                                        </div>
                                                    </div>
                                                    }

                                                    <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                                        <label htmlFor="ApzFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                                        <input type="file" id="ApzFile" name="ApzFile" className="form-control" onChange={this.uploadFile.bind(this, 2)} style={{display: 'none'}} />
                                                        <label onClick={this.selectFromList.bind(this, 2)} className="btn btn-info btn-sm">Выбрать из списка</label>
                                                    </div>
                                                    <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                                    </div>
                                </form>
                                {this.state.showMap &&
                                <div className="mb-4">
                                    <ShowMap point={true} changeFunction={this.onInputChange} mapFunction={this.toggleMap} hasCoordinates={this.hasCoordinates}/>
                                </div>
                                }

                                <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                            </div>
                            <div className="tab-pane fade" id="tab1" role="tabpanel" aria-labelledby="tab1-link">
                                <form id="tab1-form" data-tab="1" onSubmit={this.saveApz.bind(this, false)}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <div className="form-group">
                                                    <label htmlFor="landArea">Площадь земельного участка(га):</label>
                                                    <input data-rh="Площадь земельного участка(га)" data-rh-at="right" type="number" min="0" className="form-control" onChange={this.onInputChange} value={this.state.landArea} name="landArea" placeholder="" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="form-group">
                                                    <label htmlFor="coverArea">Площадь покрытия (м<sup>2</sup>):</label>
                                                    <input data-rh="Площадь покрытия(кв.м)" data-rh-at="right" type="number" min="0" className="form-control" onChange={this.onInputChange} value={this.state.coverArea} name="coverArea" placeholder="" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="GreenArea">Площадь озеленения (м<sup>2</sup>):</label>
                                                <input data-rh="Площадь озеленения (кв.м)" data-rh-at="right" type="number" min={0} step="any" className="form-control" name="greenArea" onChange={this.onInputChange} value={this.state.greenArea} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                                    </div>
                                </form>
                                <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                            </div>
                            <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-link">
                                <form id="tab2-form" data-tab="2" onSubmit={this.saveApz.bind(this, false)}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                              <label htmlFor="ObjectType">Тип объекта:</label>
                                              <select required className="form-control" name="objectType" id="ObjectType" onChange={this.onInputChange} value={this.state.objectType}>
                                                <option value="null" disabled>Выберите тип объекта</option>
                                                <option>ИЖС</option>
                                                <option>МЖК Общественное задание</option>
                                                <option>МЖК Производственное задание</option>
                                                <option>Реконструкция (перепланировка в т.ч)</option>
                                              </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="CommonArea">Общая площадь (м<sup>2</sup>):</label>
                                                <input data-rh="Общая площадь" data-rh-at="right" type="number" min="0" name="commonArea" onChange={this.onInputChange} value={this.state.commonArea} className="form-control" id="commonArea" placeholder="" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="ObjectLevel">Этажность :</label>
                                                <input data-rh="Этажность" data-rh-at="right" type="number" min="0" className="form-control" onChange={this.onInputChange} value={this.state.objectLevel} name="objectLevel" placeholder="" />
                                            </div>
                                            {(this.state.objectType == 'МЖК Общественное задание' || this.state.objectType == 'МЖК Производственное задание') &&
                                              <React.Fragment>
                                              <div className="form-group">
                                                <label htmlFor="objectPyaten">Количество пятен</label>
                                                <input data-rh="Количество пятен" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.objectPyaten} name="objectPyaten" />
                                              </div>
                                              <div className="form-group">
                                                <label htmlFor="objectCarpark">Количество парковочных мест</label>
                                                <input data-rh="Количество парковочных мест" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.objectCarpark} name="objectCarpark" />
                                              </div>
                                              <div className="form-group">
                                                <label htmlFor="objectDOU">Количество мест в детское дошкольное учреждение и детский сад</label>
                                                <input data-rh="Количество мест в детское дошкольное учреждение и детский сад" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.objectDOU} name="objectDOU" />
                                              </div>
                                              </React.Fragment>
                                            }
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="ObjectTerm">Срок строительства по нормам :</label>
                                                <input data-rh="Срок строительства по нормам" data-rh-at="right" type="text" name="objectTerm" onChange={this.onInputChange} value={this.state.objectTerm} className="form-control" id="ObjectTerm" placeholder="" />
                                            </div>
                                            <div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="BuildArea">Площадь застройки (м<sup>2</sup>):</label>
                                                <input data-rh="Площадь застройки" data-rh-at="right" type="number" min="0" name="buildArea" onChange={this.onInputChange} value={this.state.buildArea} className="form-control" id="buildArea" placeholder="" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="AktNumber">№ акта на право частной собственности:</label>
                                                <input data-rh="№ акта на право частной собственности " data-rh-at="right" type="text" name="aktNumber" onChange={this.onInputChange} value={this.state.aktNumber} className="form-control" id="aktNumber" placeholder="№XXXXXXX от dd.mm.YYY" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                                    </div>
                                </form>
                                <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                            </div>
                            <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-link">
                                <form id="tab3-form" data-tab="3" onSubmit={this.saveApz.bind(this, false)}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="BasementFacade">Цоколь здания (облицовка):</label>
                                                <input data-rh="Облицовка" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.basementFacade} name="basementFacade" placeholder="" />
                                                <small>Пример: облицовочная плитка</small>
                                            </div>
                                            <div className="form-group">
                                            <label htmlFor="WallsFacade">Стены здания (облицовка):</label>
                                                <input data-rh="Облицовка" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.wallsFacade} name="wallsFacade" placeholder="" />
                                                <small>Пример: штукатурка</small>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="BasementColor">Цоколь здания (цвет):</label>
                                                <input data-rh="Цвет" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.basementColor} name="basementColor" placeholder="" />
                                            </div>
                                            <br></br>
                                            <div className="form-group">
                                                <label htmlFor="WallsColor">Стены здания (цвет):</label>
                                                <input data-rh="Цвет" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.wallsColor} name="wallsColor" placeholder="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                                    </div>
                                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="selectFileModal" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                    {this.state.categoryFiles.map(function(file, index){
                                            return(
                                                <tr key={index}>
                                                    <td>{file.name}</td>
                                                    <td>{file.extension}</td>
                                                    <td><button onClick={this.selectFile} data-category={file.category_id} data-id={file.id} data-name={file.name} className="btn btn-success">Выбрать</button></td>
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
            </div>
            }
            {!this.state.loaderHidden &&
            <div style={{textAlign: 'center'}}>
                <Loader type="Oval" color="#46B3F2" height="200" width="200" />
            </div>
            }

            <div>
                <hr />
                <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
            </div>
        </div>
    )
  }
}
