import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import Loader from 'react-loader-spinner';
import ShowMap from './ShowMap';
import ReactHintFactory from 'react-hint'
const ReactHint = ReactHintFactory(React)

export default class AddLandinLocality extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        landLocationSchemeFile: null,
        applicant: '',
        applicantAddress: '',
        applicantPhone: '',
        region: 'Наурызбай',
        landAddress: '',
        landPurpose: '',
        landArea: '',
        landRight: '',
        landAddressCoordinates: '',
        personalIdFile: false,
        landLocationSchemeFile: false,
        cadastralNumber: '',
        showMap: false,
        hasCoordinates: false,
        loaderHidden: true,
        categoryFiles: [],
        company_name:'',
        status  : '',
      };

      this.saveLandInLocality = this.saveLandInLocality.bind(this);
      this.hasCoordinates = this.hasCoordinates.bind(this);
      this.toggleMap = this.toggleMap.bind(this);
      this.onInputChange = this.onInputChange.bind(this);
      this.downloadFile = this.downloadFile.bind(this);
      this.selectFromList = this.selectFromList.bind(this);
      this.uploadFile = this.uploadFile.bind(this);
      this.selectFile = this.selectFile.bind(this);
    }

    onInputChange(e) {
      const { value, name } = e.target;
      this.setState({ [name] : value });
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
              //console.log(data);
              this.setState({applicant: data.last_name + ' ' + data.first_name + ' ' + data.middle_name});
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

    componentWillMount() {
      if (this.props.match.params.id) {
        this.getLandInLocalityInfo();
      }
    }

    getLandInLocalityInfo() {
      this.setState({loaderHidden: false});

      var id = this.props.match.params.id;
      var token = sessionStorage.getItem('tokenInfo');

      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/land_in_locality/citizen/detail/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var landinlocality = JSON.parse(xhr.responseText);

          this.setState({applicant: landinlocality.applicant ? landinlocality.applicant : '' });
          this.setState({applicantAddress: landinlocality.address ? landinlocality.address : '' });
          this.setState({applicantPhone: landinlocality.phone ? landinlocality.phone : '' });
          this.setState({region: landinlocality.region ? landinlocality.region : '' });
          this.setState({landAddress: landinlocality.land_address ? landinlocality.land_address : '' });
          this.setState({landAddressCoordinates: landinlocality.land_address_coordinates ? landinlocality.land_address_coordinates : '' });
          this.setState({landPurpose: landinlocality.land_purpose ? landinlocality.land_purpose : '' });
          this.setState({landArea: landinlocality.land_area ? landinlocality.land_area : '' });
          this.setState({landRight: landinlocality.land_right ? landinlocality.land_right : '' });
          this.setState({hasCoordinates: landinlocality.land_address_coordinates ? true : false });
          this.setState({personalIdFile: landinlocality.files.filter(function(obj) { return obj.category_id === 3 })[0]});
          this.setState({landLocationSchemeFile: landinlocality.files.filter(function(obj) { return obj.category_id === 42 })[0]});
          this.setState({cadastralNumber: landinlocality.cadastral_number ? landinlocality.cadastral_number : '' });
          this.setState({status: landinlocality.status_id? landinlocality.status_id : '' });
        }

        this.setState({loaderHidden: true});
      }.bind(this)
      xhr.send();
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

    toggleMap(value) {
      this.setState({
        showMap: value
      })

      if (value) {
        $('#tab1-form').slideUp();
      } else {
        $('#tab1-form').slideDown();
      }
    }

    saveLandInLocality(publish, elem) {
      elem.preventDefault();

      if (publish) {
        var requiredFields = {
          applicant: 'Заявитель',
          applicantAddress: 'Адрес жительства',
          applicantPhone: 'Телефон',
          landAddress: 'Местопложение земельного участка',
          landAddressCoordinates: 'Отметить на карте',
          landPurpose: 'Целевое назначение земельного участка',
          landArea: 'Предпологаемые размеры земельного участка',
          landRight: 'Испрашиваемое право пользования земельным участком',
          landLocationSchemeFile: 'Схема расположения земельного участка'
        };

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

      var landinlocalityId = this.props.match.params.id;

      switch(this.state.status){
          case 1://declined
            var link="api/land_in_locality/citizen/save";
            break;
          default:
            var link = landinlocalityId > 0 ? ("api/land_in_locality/citizen/save/" + landinlocalityId) : "api/land_in_locality/citizen/save";
            break;
      }

      var data = {
        publish: publish ? true : false,
      }

      Object.keys(this.state).forEach(function(k) {
        data[k] = this.state[k]
      }.bind(this));

      this.setState({loaderHidden: false});
      // console.log(data);
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
            this.props.history.push('/panel/citizen/land_in_locality/status/active/1');
          } else {
            alert('Заявка успешно сохранена');

            if (!landinlocalityId) {
              this.props.history.push('/panel/citizen/land_in_locality/edit/' + data.id);
            }
          }
        } else {
          alert("При сохранении заявки произошла ошибка!");
        }
      }.bind(this);
      xhr.send(JSON.stringify(data));
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
          $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100, 10) + '%');
        }
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
              percentComplete = parseInt(percentComplete * 100, 10);
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
              case 42:
                this.setState({landLocationSchemeFile: data});
                break;
              default:
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
        case '42':
          this.setState({landLocationSchemeFile: data});
          break;
        default:
      }

      $('#selectFileModal').modal('hide');
    }

    render() {
      return (
        <div className="container" id="landinlocalityFormDiv">
        <ReactHint autoPosition events delay={100} />
        <ReactHint attribute="data-custom" events onRenderContent={this.onRenderContent} ref={(ref) => this.instance = ref} delay={100}/>
          {this.state.loaderHidden &&
            <div className="tab-pane">
              <div className="row">
                <div className="col-4">
                  <div className="nav flex-column nav-pills container-fluid" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <a className="nav-link" style={{cursor:"pointer",color:"#007bff"}} data-toggle="modal" data-target=".documents-modal-lg" role="tab" aria-selected="false">Примечание<span id="tabIcon"></span></a>
                      <div className="modal fade documents-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                          <div className="modal-dialog modal-lg" role="document">
                              <div className="modal-content">
                                  <div className="modal-header">
                                      <h5 className="modal-title" id="exampleModalLabel">ПРИМЕЧАНИЕ:</h5>
                                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                          <span aria-hidden="true">&times;</span>
                                      </button>
                                  </div>
                                  <div className="modal-content">
                                      <div className="modal-body">
                                          <p>1. В части заполнения исходных данных представить копии следующих документов:</p>
                                          <p>  - Для физических лиц - копии удостоверения личности, для юридических лиц </p>
                                          <p>  - Копия бизнес-идентификационного номера (БИН)</p>
                                          <p>  - Копии правоустанавливающих документов (Акт на право частной собственности на земельный участок, основание его выдачи - (постановление Акимата или копия договора купли-продажи, или договор дарения и т.д.), сведения о собственнике;</p>
                                          <p>2. В части "Водоснабжение" и "Водоотведение" данные подтвердить расчетов с указанием требуемых расходов на водопотребление, пожаротушение и водоотведение, выполненных согласно требованиям СНиП c указанием количества вводов водопровода.</p>
                                          <p>3. Ситуационная схема или топографическая съемка с указанием границ земельного участка в соответствии с актами на выбор земельного участка, отражающая существующее положение объекта и коммуникаций на момент запроса технических условий, подтвержданная УАиГ города Алматы.</p>
                                       </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                    <a className="nav-link active" id="tab0-link" data-toggle="pill" href="#tab0" role="tab" aria-controls="tab0" aria-selected="true">Заявление <span id="tabIcon"></span></a>
                    <a className="nav-link" id="tab1-link" data-toggle="pill" href="#tab1" role="tab" aria-controls="tab1" aria-selected="false">Объект <span id="tabIcon"></span></a>
                  </div>
                </div>
                <div className="col-8">
                  <div className="tab-content" id="v-pills-tabContent">
                    <div className="tab-pane fade show active" id="tab0" role="tabpanel" aria-labelledby="tab0-link">
                      <div style={{marginBottom:'16px'}}>
                        <span style={{color:'red'}}>*</span><span style={{color:'#888'}}> - поля обязательные к заполнению</span>
                      </div>
                      <form id="tab0-form" data-tab="0" onSubmit={this.saveLandInLocality.bind(this, false)}>
                        <div className="row">
                          <div className="col-md-7">
                            <div className="form-group">
                              <label htmlFor="Applicant"><span style={{color:'red'}}>*</span> Заявитель:</label>
                              <input data-rh="Заявитель" data-rh-at="right" type="text" className="form-control" readOnly name="applicant" value={this.state.company_name == ' ' ? this.state.applicant : this.state.company_name } required />
                            </div>
                            <div className="form-group">
                              <label htmlFor="applicantAddress"><span style={{color:'red'}}>*</span> Адрес жительства:</label>
                              <input data-rh="Адрес жительства" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} name="applicantAddress" value={this.state.applicantAddress} required />
                            </div>
                            <div className="form-group">
                              <label htmlFor="applicantPhone"><span style={{color:'red'}}>*</span> Телефон</label>
                              <input data-rh="Телефон" data-rh-at="right" type="tel" className="form-control" onChange={this.onInputChange} value={this.state.applicantPhone} name="applicantPhone" placeholder="8 (7xx) xxx xx xx" />
                            </div>
                          </div>
                          <div className="col-md-5">
                            <div className="form-group">
                                <label><span style={{color:'red'}}>*</span> Уд.личности/Реквизиты</label>
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
                              <label><span style={{color:'red'}}>*</span> Схема расположения земельного участка</label>
                              <div className="file_container">
                                <div className="progress mb-2" data-category="42" style={{height: '20px', display: 'none'}}>
                                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>

                                {this.state.landLocationSchemeFile &&
                                  <div className="file_block mb-2">
                                    <div>
                                      {this.state.landLocationSchemeFile.name}
                                      <a className="pointer" onClick={(e) => this.setState({landLocationSchemeFile: false}) }>×</a>
                                    </div>
                                  </div>
                                }

                                <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                  <label htmlFor="landLocationSchemeFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                  <input type="file" id="landLocationSchemeFile" name="landLocationSchemeFile" className="form-control" onChange={this.uploadFile.bind(this, 42)} style={{display: 'none'}} />
                                  <label onClick={this.selectFromList.bind(this, 42)} className="btn btn-info btn-sm">Выбрать из списка</label>
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
                      <button onClick={this.saveLandInLocality.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                    </div>
                    <div className="tab-pane fade" id="tab1" role="tabpanel" aria-labelledby="tab1-link">
                        <div style={{marginBottom:'16px'}}>
                          <span style={{color:'red'}}>*</span><span style={{color:'#888'}}> - поля обязательные к заполнению</span>
                        </div>
                        <form id="tab1-form" data-tab="1" onSubmit={this.saveLandInLocality.bind(this, false)}>
                            <div className="row">
                              <div className="col-md-7">
                                <div style={{borderRadius: '10px', background: 'rgb(239, 239, 239)', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px'}}>
                                   <div className="text-center" style={{fontSize:'15px'}}>
                                   <p>Кадастровый номер не обязателен для отметки.</p>
                                   </div><hr/>
                                   <div className="form-group">
                                     <label htmlFor="CadastralNumber">Кадастровый номер:</label>
                                     <div className="row coordinates_block pt-0">
                                       <div className="col-sm-7">
                                         <input data-rh="Кадастровый номер:" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.cadastralNumber} name="cadastralNumber" placeholder="" />
                                       </div>
                                       <div className="col-sm-5 p-0">
                                         <a className="btn btn-secondary btn-sm mark_btn" onClick={() => this.toggleMap(true)}>
                                           {this.state.hasCoordinates &&
                                             <i className="glyphicon glyphicon-ok coordinateIcon mr-1"></i>
                                           }
                                           Отметить на карте
                                         </a>
                                       </div>
                                     </div>
                                   </div>
                                   <div className="form-group">
                                     <label htmlFor="landAddressCoordinates"><span style={{color:'red'}}>*</span> Координаты земельного участка</label>
                                     <input type="text" readOnly nChange={this.onInputChange} value={this.state.landAddressCoordinates} className="form-control" id="landAddressCoordinates" name="landAddressCoordinates" />
                                   </div>
                                   <div className="form-group">
                                     <label htmlFor="landAddress"><span style={{color:'red'}}>*</span> Адрес (местоположение) земельного участка</label>
                                     <input data-rh="Адрес (местоположение) земельного участка" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.landAddress} name="landAddress" />
                                   </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="Region"><span style={{color:'red'}}>*</span> Район</label>
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
                                  <label htmlFor="landPurpose"><span style={{color:'red'}}>*</span> Целевое назначение земельного участка</label>
                                  <input data-rh="Целевое назначение земельного участка" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.landPurpose} name="landPurpose" />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="landArea"><span style={{color:'red'}}>*</span> Площадь земельного участка</label>
                                  <input data-rh="Площадь земельного участка" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.landArea} name="landArea" />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="landRight"><span style={{color:'red'}}>*</span> Испрашиваемое право пользования земельным участком</label>
                                  <input data-rh="Испрашиваемое право пользования земельным участком" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.landRight} name="landRight" />
                                </div>
                              </div>
                            </div>
                            <div>
                                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                            </div>
                        </form>
                        {this.state.showMap &&
                          <div className="mb-4">
                            <ShowMap point={true} kadastr_number={this.state.cadastralNumber} changeFunction={this.onInputChange} mapFunction={this.toggleMap} hasCoordinates={this.hasCoordinates}/>
                          </div>
                        }
                        <button onClick={this.saveLandInLocality.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
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
