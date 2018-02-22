import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';

export default class Citizen extends React.Component {
  render() {
    return (
      <div className="content container citizen-apz-list-page">
        <div className="card">
          <div className="card-header">
              <h4 className="mb-0 mt-2">Архитектурно-планировочное задание</h4>
          </div>
          
          <div className="card-body">
            <Switch>
              <Route path="/citizen/status/:status" component={AllApzs} />
              <Route path="/citizen/add" component={AddApz} />
              <Route path="/citizen/:id" component={ShowApz} />
              <Redirect from="/citizen" to="/citizen/status/active" />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

class AllApzs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apzs: []
    };

  }

  componentDidMount() {
    this.getApzs();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.status !== nextProps.match.params.status) {
      this.getApzs(nextProps.match.params.status);
    }
  }

  getApzs(status = null) {
    if (!status) {
      status = this.props.match.params.status;
    }
    
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/citizen", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        
        switch (status) {
          case 'active':
            var apzs = data.filter(function(obj) { return obj.status_id !== 1 && obj.status_id !== 2; });
            break;

          case 'accepted':
            apzs = data.filter(function(obj) { return obj.status_id === 2; });
            break;

          case 'declined':
            apzs = data.filter(function(obj) { return obj.status_id === 1; });
            break;

          default:
            apzs = data;
            break;
        }
        
        this.setState({apzs: apzs});
      }
    }.bind(this)
    xhr.send();


  }

  render() {
    return (
      <div>  
        <div className="row">
          <div className="col-sm-8">
            <Link className="btn btn-outline-primary mb-3" to="/citizen/add">Создать заявление</Link>
          </div>
          <div className="col-sm-4">
            <ul className="nav nav-tabs mb-2 pull-right">
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/citizen/status/active" replace>Активные</NavLink></li>
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/citizen/status/accepted" replace>Принятые</NavLink></li>
              <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/citizen/status/declined" replace>Отказанные</NavLink></li>
            </ul>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th style={{width: '85%'}}>Название</th>
              <th style={{width: '15%'}}>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.apzs.map(function(apz, index) {
              return(
                <tr key={index}>
                  <td>{apz.project_name}</td>
                  <td>
                    {apz.status_id === 1 &&
                      <span className="text-danger">Отказано</span>
                    }

                    {apz.status_id === 2 &&
                      <span className="text-success">Принято</span>
                    }

                    {apz.status_id !== 1 && apz.status_id !== 2 &&
                      <span className="text-info">В процессе</span>
                    }
                  </td>
                  <td>
                    <Link className="btn btn-outline-info" to={'/citizen/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                  </td>
                </tr>
                );
              })
            }

            {this.state.apzs.length === 0 &&
              <tr>
                <td colSpan="3">Пусто</td>
              </tr>
            }
          </tbody>
        </table>
      </div>  
    )
  }
}

class AddApz extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      personalIdFile: null,
      confirmedTaskFile: null,
      titleDocumentFile: null,
      showMap: false,
      hasCoordinates: false
    }
    
    this.tabSubmission = this.tabSubmission.bind(this);
    this.onPersonalIdFileChange = this.onPersonalIdFileChange.bind(this);
    this.onConfirmedTaskFileChange = this.onConfirmedTaskFileChange.bind(this);
    this.onTitleDocumentFileChange = this.onTitleDocumentFileChange.bind(this);
    this.hasCoordinates = this.hasCoordinates.bind(this);
    this.toggleMap = this.toggleMap.bind(this);
  }

  onPersonalIdFileChange(e) {
    this.setState({ personalIdFile: e.target.files[0] });
  }

  onConfirmedTaskFileChange(e) {
    this.setState({ confirmedTaskFile: e.target.files[0] });
  }

  onTitleDocumentFileChange(e) {
    this.setState({ titleDocumentFile: e.target.files[0] });
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
      $('#tab0-form').slideUp();
    } else {
      $('#tab0-form').slideDown();
    }
  }

  tabSubmission(elem) { 
    elem.preventDefault();
    var id = document.querySelector('#'+elem.target.id).dataset.tab;
    
    if ($('#tab'+id+'-form').valid()) 
    {

      //проверка полей на валидность в Газоснабжении
      if(document.getElementsByName('GasGeneral')[0] !== 'undefined')
      {
        var a = parseFloat( "0" + document.getElementsByName('GasCooking')[0].value);
        var b = parseFloat( "0" + document.getElementsByName('GasHeat')[0].value);
        var c = parseFloat( "0" + document.getElementsByName('GasVentilation')[0].value); 
        var d = parseFloat( "0" + document.getElementsByName('GasConditioner')[0].value);
        var e = parseFloat( "0" + document.getElementsByName('GasWater')[0].value);
        var GasSum = a + b + c + d + e;

        if($('a#tab8-link').attr('aria-expanded') === 'true') 
        {
          if(parseFloat(document.getElementsByName('GasGeneral')[0].value !== GasSum)) 
          {
            console.log(document.getElementsByName('GasGeneral')[0].value+" - "+GasSum);
            alert('Сумма всех полей должна быть равна полю Общая потребность');
          } 
          else 
          {
            $('#tab'+id+'-link').children('#tabIcon').removeClass().addClass('glyphicon glyphicon-ok');
            $('#tab'+id+'-link').next().trigger('click');
          }
        }
        else 
        {
          $('#tab'+id+'-link').children('#tabIcon').removeClass().addClass('glyphicon glyphicon-ok');
          $('#tab'+id+'-link').next().trigger('click');
        }
      }
      else 
      {
        $('#tab'+id+'-link').children('#tabIcon').removeClass().addClass('glyphicon glyphicon-ok');
        $('#tab'+id+'-link').next().trigger('click');
      }
    } 
    else 
    {
      $('#tab'+id+'-link').children('#tabIcon').removeClass().addClass('glyphicon glyphicon-remove');
    }
  }

  requestSubmission(e) {
    if ($('#tab0-link').children().hasClass('glyphicon-ok')
                && $('#tab1-link').children().hasClass('glyphicon-ok')
                && $('#tab2-link').children().hasClass('glyphicon-ok')
                && $('#tab3-link').children().hasClass('glyphicon-ok')
                && $('#tab4-link').children().hasClass('glyphicon-ok')
                && $('#tab5-link').children().hasClass('glyphicon-ok')
                && $('#tab6-link').children().hasClass('glyphicon-ok')
                && $('#tab7-link').children().hasClass('glyphicon-ok')
                && $('#tab8-link').children().hasClass('glyphicon-ok')) 
    {
      var apzData = $('#tab0-form, #tab1-form, #tab2-form, #tab3-form, #tab4-form, #tab5-form, #tab6-form, #tab7-form, #tab8-form').serializeJSON();
      if (sessionStorage.getItem('tokenInfo')) {
        $.ajax({
          type: 'POST',
          url: window.url + 'api/apz/citizen/create',
          contentType: 'application/json; charset=utf-8',
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
          },
          data: JSON.stringify(apzData),
          success: function (data) {
            var formData = new FormData();
            formData.append('PersonalIdFile', this.state.personalIdFile);
            formData.append('ConfirmedTaskFile', this.state.confirmedTaskFile);
            formData.append('TitleDocumentFile', this.state.titleDocumentFile);
            $.ajax({
              type: 'POST',
              url: window.url + 'api/apz/citizen/upload/' + data.id ,
              contentType: false,
              beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
              },
              data: formData,
              processData: false,
              success: function (data) {
                // after form is submitted: calls the function from CitizenComponent to update the list 
                this.props.history.replace('/citizen/status/active');
                alert("Заявка успешно подана");
              }.bind(this),
              fail: function (jqXHR) {
                alert("Ошибка " + jqXHR.status + ': ' + jqXHR.statusText);
              },
              statusCode: {
                400: function () {
                  alert("При сохранении заявки произошла ошибка!");
                }
              },
              complete: function (jqXHR) {
              }
            });
            $('#tab0-form')[0].reset();
            $('#tab1-form')[0].reset();
            $('#tab2-form')[0].reset();
            $('#tab3-form')[0].reset();
            $('#tab4-form')[0].reset();
            $('#tab5-form')[0].reset();
            $('#tab6-form')[0].reset();
            $('#tab7-form')[0].reset();
            $('#tab8-form')[0].reset();
            $('#tabIcon').removeClass();
          }.bind(this),
          fail: function (jqXHR) {
            alert("Ошибка " + jqXHR.status + ': ' + jqXHR.statusText);
          },
          statusCode: {
            400: function () {
              alert("При сохранении заявки произошла ошибка!");
            }
          },
          complete: function (jqXHR) {
          }
        });
      } else { console.log('session expired'); }
    } else { alert('Сохранены не все вкладки'); }
  }

  //правила вкладки Объект/Газоснабжение
  ObjectType(e) {
    document.getElementsByName('ObjectArea')[0].disabled = false;
  }

  ObjectArea(e) {
    //ИЖС if selected
    if(document.getElementById('ObjectType').value === 'obj_ijs')
    {
      if(document.getElementsByName('ObjectArea')[0].value !== '')
      {
        var ObjectArea = parseInt(document.getElementsByName('ObjectArea')[0].value, 3);
        switch (true) 
        {
          case (ObjectArea <= 100):
            document.getElementsByName('GasGeneral')[0].max = 6;
            break;
          case (ObjectArea >= 101) && (ObjectArea <= 500):
            document.getElementsByName('GasGeneral')[0].max = 15;
            break;
          default:
            document.getElementsByName('GasGeneral')[0].removeAttribute("max");
        }
      }

      if(document.getElementsByName('ElectricAllowedPower')[0].value !== '')
      {
        //console.log(1);
        document.getElementsByName("ElectricRequiredPower")[0].required = false;
        document.getElementsByName("ElectricityPhase")[0].required = false;
        document.getElementsByName("ElectricSafetyCategory")[0].required = false;
      }

      if(document.getElementsByName('ElectricRequiredPower')[0].value !== '')
      {
        var ElectricRequiredPower = parseInt(document.getElementsByName('ElectricRequiredPower')[0].value, 3);
        var select = document.getElementsByName('ElectricityPhase')[0];
        switch (true) 
        {
          case (ElectricRequiredPower <= 5):
            document.getElementsByName('ElectricityPhase')[0].options.length = 0; //очищаем список
            select.options[select.options.length] = new Option('Однофазная', 'Однофазная');
            select.options[select.options.length] = new Option('Двухфазная', 'Двухфазная');
            break;
          case (ElectricRequiredPower >= 6):
            document.getElementsByName('ElectricityPhase')[0].options.length = 0;
            select.options[select.options.length] = new Option('Трехфазная', 'Трехфазная');
            select.options[select.options.length] = new Option('Постоянная', 'Постоянная');
            select.options[select.options.length] = new Option('Временная', 'Временная');
            select.options[select.options.length] = new Option('Сезонная', 'Сезонная');
            break;
          default:
            break;
        }
      }
      
    }
    if(document.getElementById('ObjectType').value === 'obj_mjk') //МЖК
    {
      //rules
    }
    if(document.getElementById('ObjectType').value === 'obj_kp') 
    {
      //rules
    }
    if(document.getElementById('ObjectType').value === 'obj_pp') 
    {
      //rules
    }
  }

  //правила вкладки Водоснабжение
  PeopleCount(e) {
    document.getElementsByName('WaterRequirement')[0].value = parseFloat( "0.19" * document.getElementsByName('PeopleCount')[0].value);
    document.getElementsByName('WaterSewage')[0].value = document.getElementsByName('WaterRequirement')[0].value;
  }

  render() {
    return (
      <div className="container" id="apzFormDiv">
        <div className="tab-pane">
          <div className="row">
          <div className="col-4">
            <div className="nav flex-column nav-pills container-fluid" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a className="nav-link active" id="tab0-link" data-toggle="pill" href="#tab0" role="tab" aria-controls="tab0" aria-selected="true">Заявление <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab1-link" data-toggle="pill" href="#tab1" role="tab" aria-controls="tab1" aria-selected="false">Объект <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab2-link" data-toggle="pill" href="#tab2" role="tab" aria-controls="tab2" aria-selected="false">Электроснабжение <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab3-link" data-toggle="pill" href="#tab3" role="tab" aria-controls="tab3" aria-selected="false">Водоснабжение <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab4-link" data-toggle="pill" href="#tab4" role="tab" aria-controls="tab4" aria-selected="false">Канализация <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab5-link" data-toggle="pill" href="#tab5" role="tab" aria-controls="tab5" aria-selected="false">Теплоснабжение <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab6-link" data-toggle="pill" href="#tab6" role="tab" aria-controls="tab6" aria-selected="false">Ливневая канализация <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab7-link" data-toggle="pill" href="#tab7" role="tab" aria-controls="tab7" aria-selected="false">Телефонизация <span id="tabIcon"></span></a>
            <a className="nav-link" id="tab8-link" data-toggle="pill" href="#tab8" role="tab" aria-controls="tab8" aria-selected="false">Газоснабжение <span id="tabIcon"></span></a>
            </div>
          </div>
          <div className="col-8">
            <div className="tab-content" id="v-pills-tabContent">
            <div className="tab-pane fade show active" id="tab0" role="tabpanel" aria-labelledby="tab0-link">
              <form id="tab0-form" data-tab="0" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="Applicant">Наименование заявителя:</label>
                  <input type="text" className="form-control" required name="Applicant" placeholder="Наименование" />
                  <span className="help-block">Ф.И.О. (при его наличии) физического лица <br />или наименование юридического лица</span>
                </div>
                <div className="form-group">
                  <label htmlFor="PersonalIdFile">Прикрепить личные данные</label>
                  <input type="file" required name="PersonalIdFile" className="form-control" onChange={this.onPersonalIdFileChange}/>
                  <span className="help-block">Удостверение личности (физ. лица) <br />или Реквизиты (юр. лица)</span>
                </div>
                <div className="form-group">
                  <label htmlFor="Address">Адрес:</label>
                  <input type="text" className="form-control" required id="ApzAddressForm" name="Address" placeholder="Адрес" />
                </div>
                <div className="form-group">
                  <label htmlFor="Phone">Телефон</label>
                  <input type="tel" className="form-control" name="Phone" placeholder="Телефон" />
                </div>
                <div className="form-group">
                  <label htmlFor="Region">Район</label>
                  <select className="form-control" name="Region">
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
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="Customer">Заказчик</label>
                    <input type="text" required className="form-control" name="Customer" placeholder="Заказчик" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="Designer">Проектировщик №ГСЛ, категория</label>
                    <input type="text" required className="form-control" name="Designer" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ProjectName">Наименование проектируемого объекта</label>
                    <input type="text" required className="form-control" id="ProjectName" name="ProjectName" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ProjectAddress">Адрес проектируемого объекта</label>
                    <div className="row coordinates_block">
                      <div className="col-sm-7">
                        <input type="text" required className="form-control" name="ProjectAddress" />
                        <input type="hidden" id="ProjectAddressCoordinates" name="ProjectAddressCoordinates" />
                      </div>
                      <div className="col-sm-5 p-0">
                        <a className="btn btn-outline-secondary btn-sm" onClick={() => this.toggleMap(true)}>
                          {this.state.hasCoordinates &&
                            <i className="glyphicon glyphicon-ok coordinateIcon mr-1"></i>
                          }

                          Отметить на карте
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ConfirmedTaskFile">Прикрепить файл</label>
                    <input type="file" required name="ConfirmedTaskFile" className="form-control" onChange={this.onConfirmedTaskFileChange} />
                    <span className="help-block">Утвержденное задание на проектирование</span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="TitleDocumentFile">Прикрепить файл</label>
                    <input type="file" required name="TitleDocumentFile" className="form-control" onChange={this.onTitleDocumentFileChange} />
                    <span className="help-block">Правоустанавливающий документ на земельный участок</span>
                  </div>
                  {/*<div className="form-group">
                    <label htmlFor="ApzDate">Дата</label>
                    <input type="date" required className="form-control" name="ApzDate" />
                  </div>*/}
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>

              {this.state.showMap && 
                <div className="mb-4">
                  <ShowMap point={true} mapFunction={this.toggleMap} hasCoordinates={this.hasCoordinates}/>
                </div>
              }

              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab1" role="tabpanel" aria-labelledby="tab1-link">
              <form id="tab1-form" data-tab="1" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="ObjectType">Тип объекта</label>
                    <select required className="form-control" id="ObjectType" onChange={this.ObjectType.bind(this)} defaultValue="null">
                      <option value="null" disabled>Выберите тип объекта</option>
                      <option value="obj_ijs">ИЖС</option>
                      <option value="obj_mjk">МЖК</option>
                      <option value="obj_kb">КомБыт</option>
                      <option value="obj_pp">ПромПред</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ObjectClient">Заказчик</label>
                    <input type="text" required className="form-control" name="ObjectClient" placeholder="" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ObjectName">Наименование объекта:</label>
                    <input type="text" required className="form-control" name="ObjectName" placeholder="наименование" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="CadastralNumber">Кадастровый номер:</label>
                    <input type="text" className="form-control" name="CadastralNumber" placeholder="" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ObjectTerm">Срок строительства по нормам</label>
                    <input type="text" className="form-control" id="ObjectTerm" placeholder="" />
                  </div>
                  {/* <div className="form-group">
                    <label htmlFor="">Правоустанавливающие документы на объект (реконструкция)</label>
                    <div className="fileinput fileinput-new" data-provides="fileinput">
                    <span className="btn btn-default btn-file"><span></span><input type="file" multiple /></span>
                    <span className="fileinput-filename"></span><span className="fileinput-new"></span>
                    </div>
                  </div> */}
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="ObjectLevel">Этажность</label>
                  <input type="number" className="form-control" name="ObjectLevel" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="ObjectArea">Площадь здания (кв.м)</label>
                  <input type="number" step="any" className="form-control" name="ObjectArea" onChange={this.ObjectArea.bind(this)} readOnly="readonly" />
                </div>
                <div className="form-group">
                  <label htmlFor="ObjectRooms">Количество квартир (номеров, кабинетов)</label>
                  <input type="number" className="form-control" name="OBjectRooms" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-link">
              <form id="tab2-form" data-tab="2" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="ElectricAllowedPower">Разрешенная по договору мощность трансформаторов (кВА) (Лицевой счет)</label>
                  <input type="number" step="any" name="ElectricAllowedPower" onChange={this.ObjectArea.bind(this)} className="form-control" />
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricRequiredPower">Требуемая мощность (кВт)</label>
                  <input type="number" step="any" required className="form-control" onChange={this.ObjectArea.bind(this)}  name="ElectricRequiredPower" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricityPhase">Характер нагрузки (фаза)</label>
                  <select className="form-control" name="ElectricityPhase">
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricSafetyCategory">Категория по надежности (кВт)</label>
                  <select required className="form-control" name="ElectricSafetyCategory" defaultValue="3">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                </div>
                <div className="col-md-6">
                {/*<div className="form-group">
                  <label htmlFor="">Предполагается установить</label>
                  <br />
                  <div className="col-md-6">
                  <ul style="list-style-type: none; padding-left: 3px">
                    <li><input type="checkbox" id="CB1"><span style="padding-left: 3px" htmlFor="CB1">электрокотлы</span><input type="text" className="form-control" placeholder=""></li>
                    <li><input type="checkbox" id="CB2"><span style="padding-left: 3px" htmlFor="CB2">электрокалориферы</span><input type="text" className="form-control" placeholder=""></li>
                    <li><input type="checkbox" id="CB3"><span style="padding-left: 3px" htmlFor="CB3">электроплитки</span><input type="text" className="form-control" placeholder=""></li>
                  </ul>
                  </div>
                  <div className="col-md-6">
                  <ul style="list-style-type: none; padding-left: 3px">
                    <li><input type="checkbox" id="CB4"><span style="padding-left: 3px" htmlFor="CB4">электропечи</span><input type="text" className="form-control" placeholder=""></li>
                    <li><input type="checkbox" id="CB5"><span style="padding-left: 3px" htmlFor="CB5">электроводонагреватели</span><input type="text" className="form-control" placeholder=""></li>
                  </ul>
                  </div>
                </div>*/}
                <div className="form-group">
                  <label htmlFor="ElectricMaxLoadDevice">Из указанной макс. нагрузки относятся к электроприемникам (кВА):</label>
                  <input type="number" className="form-control" readOnly="readonly" name="ElectricMaxLoadDevice" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricMaxLoad">Существующая максимальная нагрузка (кВА)</label>
                  <input type="number" className="form-control" name="ElectricMaxLoad" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-link">
              <form id="tab3-form" data-tab="3" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label>Количество людей</label>
                  <input type="number" required className="form-control" name="PeopleCount" onChange={this.PeopleCount.bind(this)} placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="WaterRequirement">Общая потребность в воде (м<sup>3</sup>/сутки)</label>
                  <input type="number" readOnly="readonly" className="form-control" name="WaterRequirement" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="WaterSewage">Канализация (м<sup>3</sup>/сутки)</label>
                  <input type="number" readOnly="readonly" className="form-control" name="WaterSewage" />
                </div>
                <div className="form-group">
                  <label htmlFor="WaterProduction">На производственные нужды (м<sup>3</sup>/сутки)</label>
                  <input type="number" step="any" className="form-control" name="WaterProduction" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="WaterDrinking">На хозпитьевые нужды (м<sup>3</sup>/сутки)</label>
                  <input type="number" step="any" className="form-control" name="WaterDrinking" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="WaterFireFighting">Потребные расходы наружного пожаротушения (л/сек)</label>
                  <input type="number" min="10" defaultValue="10" className="form-control" name="WaterFireFighting" />
                </div>
                <div className="form-group">
                  <label>Потребные расходы внутреннего пожаротушения (л/сек)</label>
                  <input type="number" className="form-control" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab4" role="tabpanel" aria-labelledby="tab4-link">
              <form id="tab4-form" data-tab="4" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="SewageAmount">Общее количество сточных вод  (м<sup>3</sup>/сутки)</label>
                  <input type="number" step="any" required className="form-control" name="SewageAmount" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="SewageFeksal">фекcальных (м<sup>3</sup>/сутки)</label>
                  <input type="number" step="any" className="form-control" name="SewageFeksal" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="SewageProduction">Производственно-загрязненных (м<sup>3</sup>/сутки)</label>
                  <input type="number" step="any" className="form-control" name="SewageProduction" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="SewageToCity">Условно-чистых сбрасываемых на городскую канализацию (м<sup>3</sup>/сутки)</label>
                  <input type="number" step="any" className="form-control" name="SewageToCity" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab5" role="tabpanel" aria-labelledby="tab5-link">
              <form id="tab5-form" data-tab="5" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="HeatGeneral">Общая тепловая нагрузка (Гкал/ч)</label>
                  <input type="number" step="any" className="form-control" name="HeatGeneral" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatMain">Отопление (Гкал/ч)</label>
                  <input type="number" step="any" className="form-control" name="HeatMain" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatVentilation">Вентиляция (Гкал/ч)</label>
                  <input type="number" step="any" className="form-control" name="HeatVentilation" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatWater">Горячее водоснабжение (Гкал/ч)</label>
                  <input type="number" step="any" className="form-control" id="HeatWater" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="HeatTech">Технологические нужды(пар) (Т/ч)</label>
                  <input type="number" step="any" className="form-control" name="HeatTech" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatDistribution">Разделить нагрузку по жилью и по встроенным помещениям</label>
                  <input type="text" className="form-control" name="HeatDistribution" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatSaving">Энергосберегающее мероприятие</label>
                  <input type="text" className="form-control" name="HeatSaving" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab6" role="tabpanel" aria-labelledby="tab6-link">
              <form id="tab6-form" data-tab="6" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="SewageClientWishes">Пожелание заказчика</label>
                  <input type="text" className="form-control" name="SewageClientWishes" placeholder="" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab7" role="tabpanel" aria-labelledby="tab7-link">
              <form id="tab7-form" data-tab="7" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="PhoneServiceNum">Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</label>
                  <input type="number" step="any" className="form-control" name="PhoneServiceNum" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="PhoneCapacity">Телефонная емкость</label>
                  <input type="text" className="form-control" name="PhoneCapacity" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="PhoneSewage">Планируемая телефонная канализация</label>
                  <input type="text" className="form-control" name="PhoneSewage" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="PhoneClientWishes">Пожелания заказчика (тип оборудования, тип кабеля и др.)</label>
                  <input type="text" className="form-control" name="PhoneClientWishes" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab8" role="tabpanel" aria-labelledby="tab8-link">
              <form id="tab8-form" data-tab="8" onSubmit={this.tabSubmission.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="GasGeneral">Общая потребность (м<sup>3</sup>/час)</label>
                  <input type="number" step="any" required className="form-control" name="GasGeneral" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasCooking">На приготовление пищи (м<sup>3</sup>/час)</label>
                  <input type="number" step="any" className="form-control" name="GasCooking" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasHeat">Отопление (м<sup>3</sup>/час)</label>
                  <input type="number" step="any" required className="form-control" name="GasHeat" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="GasVentilation">Вентиляция (м<sup>3</sup>/час)</label>
                  <input type="number" step="any" className="form-control" name="GasVentilation" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasConditioner">Кондиционирование (м<sup>3</sup>/час)</label>
                  <input type="number" step="any" className="form-control" name="GasConditioner" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasWater">Горячее водоснабжение при газификации многоэтажных домов (м<sup>3</sup>/час)</label>
                  <input type="number" step="any" className="form-control" name="GasWater" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission.bind(this)} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            </div>
          </div>
          </div>
        </div>

        <div>
          <hr />
          <Link className="btn btn-outline-secondary pull-right" to={'/citizen/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
        </div>
      </div>
    )
  }
}

class ShowApz extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apz: [],
      showMap: false,
      showMapText: 'Показать карту',
      headResponseFile: null,
      waterResponseFile: null,
      phoneResponseFile: null,
      electroResponseFile: null,
      heatResponseFile: null,
      gasResponseFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
    };
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/citizen/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var apz = JSON.parse(xhr.responseText);
        var commission = apz.commission;
        
        this.setState({apz: apz});
        this.setState({personalIdFile: apz.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: apz.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: apz.files.filter(function(obj) { return obj.category_id === 10 })[0]});

        if (apz.status_id === 1 || apz.status_id === 2) {

          if (commission) {
            if (commission.apz_water_response && commission.apz_water_response.files) {
              this.setState({waterResponseFile: commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
            }
            
            if (commission.apz_electricity_response && commission.apz_electricity_response.files) {
              this.setState({electroResponseFile: commission.apz_electricity_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
            }

            if (commission.apz_phone_response && commission.apz_phone_response.files) {
              this.setState({phoneResponseFile: commission.apz_phone_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
            }

            if (commission.apz_heat_response && commission.apz_heat_response.files) {
              this.setState({heatResponseFile: commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
            }

            if (commission.apz_gas_response && commission.apz_gas_response.files) {
              this.setState({gasResponseFile: commission.apz_gas_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
            }
          }

          if (apz.apz_head_response && apz.apz_head_response.files) {
            this.setState({headResponseFile: apz.apz_head_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
          }
        }
      }
    }.bind(this)
    xhr.send();
  }

  downloadFile(id) {
    var token = sessionStorage.getItem('tokenInfo');
    var url = window.url + 'api/file/download/' + id;

    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
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
              window.URL.revokeObjectURL(url);
            };

          }());

          saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
        } else {
          alert('Не удалось скачать файл');
        }
      }
    xhr.send();
  }

  printApz(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/print/" + apzId, true);
      xhr.responseType = "blob";
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        console.log(xhr);
        console.log(xhr.status);
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "apz-" + new Date().getTime() + ".pdf");
          } 
          else {
            var blob = xhr.response;
            var link = document.createElement('a');
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";
            //console.log(curr_day);
            link.href = window.URL.createObjectURL(blob);
            link.download = "апз-" + project + formated_date + ".pdf";

            //append the link to the document body
            document.body.appendChild(link);
            link.click();
          }
        }
      }
      xhr.send();
    } else {
      console.log('session expired');
    }
  }

  toggleMap(value) {
    this.setState({
      showMap: value
    })

    if (value) {
      this.setState({
        showMapText: 'Скрыть карту'
      })
    } else {
      this.setState({
        showMapText: 'Показать карту'
      })
    }
  }

  toDate(date) {
    if(date === null) {
      return date;
    }
    
    var jDate = new Date(date);
    var curr_date = jDate.getDate();
    var curr_month = jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var curr_hour = jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
    
    return formated_date;
  }

  // print technical condition of waterProvider
  printWaterTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/print/tc/water/" + apzId, true);
      xhr.responseType = "blob";
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        console.log(xhr);
        console.log(xhr.status);
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } 
          else {
            var blob = xhr.response;
            var link = document.createElement('a');
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";
            //console.log(curr_day);
            link.href = window.URL.createObjectURL(blob);
            link.download = "ТУ-Вода-" + project + formated_date + ".pdf";

            //append the link to the document body
            document.body.appendChild(link);
            link.click();
          }
        }
      }
      xhr.send();
    } else {
      console.log('session expired');
    }
  }

  // print technical condition of gasProvider
  printGasTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/print/tc/gas/" + apzId, true);
      xhr.responseType = "blob";
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        console.log(xhr);
        console.log(xhr.status);
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } 
          else {
            var blob = xhr.response;
            var link = document.createElement('a');
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";
            //console.log(curr_day);
            link.href = window.URL.createObjectURL(blob);
            link.download = "ТУ-Газ-" + project + formated_date + ".pdf";

            //append the link to the document body
            document.body.appendChild(link);
            link.click();
          }
        }
      }
      xhr.send();
    } else {
      console.log('session expired');
    }
  }

  // print technical condition of electroProvider
  printElectroTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/print/tc/electro/" + apzId, true);
      xhr.responseType = "blob";
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        console.log(xhr);
        console.log(xhr.status);
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } 
          else {
            var blob = xhr.response;
            var link = document.createElement('a');
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";
            //console.log(curr_day);
            link.href = window.URL.createObjectURL(blob);
            link.download = "ТУ-Электр-" + project + formated_date + ".pdf";

            //append the link to the document body
            document.body.appendChild(link);
            link.click();
          }
        }
      }
      xhr.send();
    } else {
      console.log('session expired');
    }
  }

  // print technical condition of phoneProvider
  printPhoneTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/print/tc/phone/" + apzId, true);
      xhr.responseType = "blob";
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        console.log(xhr);
        console.log(xhr.status);
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } 
          else {
            var blob = xhr.response;
            var link = document.createElement('a');
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";
            //console.log(curr_day);
            link.href = window.URL.createObjectURL(blob);
            link.download = "ТУ-Телефон-" + project + formated_date + ".pdf";

            //append the link to the document body
            document.body.appendChild(link);
            link.click();
          }
        }
      }
      xhr.send();
    } else {
      console.log('session expired');
    }
  }

  // print technical condition of heatProvider
  printHeatTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/print/tc/heat/" + apzId, true);
      xhr.responseType = "blob";
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        console.log(xhr);
        console.log(xhr.status);
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } 
          else {
            var blob = xhr.response;
            var link = document.createElement('a');
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";
            //console.log(curr_day);
            link.href = window.URL.createObjectURL(blob);
            link.download = "ТУ-Тепло-" + project + formated_date + ".pdf";

            //append the link to the document body
            document.body.appendChild(link);
            link.click();
          }
        }
      }
      xhr.send();
    } else {
      console.log('session expired');
    }
  }
  
  render() {
    var apz = this.state.apz;

    if (apz.length === 0) {
      return false;
    }

    return (
      <div>
        <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>
        
        <table className="table table-bordered table-striped">
          <tbody>
            <tr>
              <td style={{width: '22%'}}><b>Заявитель</b></td>
              <td>{apz.applicant}</td>
            </tr>
            <tr>
              <td><b>Адрес</b></td>
              <td>{apz.address}</td>
            </tr>
            <tr>
              <td><b>Телефон</b></td>
              <td>{apz.phone}</td>
            </tr>
            <tr>
              <td><b>Заказчик</b></td>
              <td>{apz.customer}</td>
            </tr>
            <tr>
              <td><b>Разработчик</b></td>
              <td>{apz.designer}</td>
            </tr>
            <tr>
              <td><b>Название проекта</b></td>
              <td>{apz.project_name}</td>
            </tr>
            <tr>
              <td><b>Адрес проекта</b></td>
              <td>
                {apz.project_address}

                {apz.project_address_coordinates &&
                  <a className="ml-2 pointer text-info" onClick={this.toggleMap.bind(this, true)}>Показать на карте</a>
                }
              </td>
            </tr>
            <tr>
              <td><b>Дата заявления</b></td>
              <td>{apz.created_at && this.toDate(apz.created_at)}</td>
            </tr>
            
            {this.state.personalIdFile &&
              <tr>
                <td><b>Уд. лич./ Реквизиты</b></td>
                <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id)}>Скачать</a></td>
              </tr>
            }

            {this.state.confirmedTaskFile &&
              <tr>
                <td><b>Утвержденное задание</b></td>
                <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.confirmedTaskFile.id)}>Скачать</a></td>
              </tr>
            }

            {this.state.titleDocumentFile &&
              <tr>
                <td><b>Правоустанавл. документ</b></td>
                <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.titleDocumentFile.id)}>Скачать</a></td>
              </tr>
            }
          </tbody>
        </table>

        {this.state.headResponseFile &&
          <div>
            <h5 className="block-title-2 mt-5 mb-3">Результат</h5>

            { apz.status_id !== 1 ? 
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '22%'}}><b>Загруженный АПЗ</b></td> 
                    <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.headResponseFile.id)}>Скачать</a></td>
                  </tr>
                  <tr>
                    <td><b>Сформированный АПЗ</b></td>
                    <td><a className="text-info pointer" onClick={this.printApz.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                  </tr>
                </tbody>
              </table>
              :
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                    <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.headResponseFile.id)}>Скачать</a></td>
                  </tr>
                </tbody>
              </table>
            }

            {(apz.status_id === 1 || apz.status_id === 2) &&
              <table className="table table-bordered table-striped">
                <tbody>
                  {this.state.waterResponseFile &&
                    <tr>
                      <td style={{width: '22%'}}>
                        <b>Водоснабжение</b>
                      </td> 
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#water_provier_modal">Просмотр</a></td>
                    </tr>
                  }
                  
                  {this.state.heatResponseFile &&
                    <tr>
                      <td>
                        <b>Теплоснабжение</b>
                      </td> 
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#heat_provier_modal">Просмотр</a></td>
                    </tr>
                  }
                
                  {this.state.electroResponseFile &&
                    <tr>
                      <td>
                        <b>Электроснабжение</b>
                      </td> 
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#electro_provier_modal">Просмотр</a></td>
                    </tr>
                  }
                
                  {this.state.gasResponseFile &&
                    <tr>
                      <td>
                        <b>Газоснабжение</b>
                      </td> 
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#gas_provier_modal">Просмотр</a></td>
                    </tr>
                  }

                  {this.state.phoneResponseFile &&
                    <tr>
                      <td>
                        <b>Телефонизация</b>
                      </td> 
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#phone_provier_modal">Просмотр</a></td>
                    </tr>
                  }
                </tbody>
              </table>
            }

            {this.state.waterResponseFile &&
              <div className="modal fade" id="water_provier_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Решение водоснабжения</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <table className="table table-bordered table-striped">
                        {apz.commission.apz_water_response.response ?
                          <tbody>
                            <tr>
                              <td style={{width: '50%'}}><b>Общая потребность (м<sup>3</sup>/сутки)</b></td>
                              <td>{apz.commission.apz_water_response.gen_water_req}</td>
                            </tr>
                            <tr>
                              <td><b>Хозпитьевые нужды (м<sup>3</sup>/сутки)</b></td>
                              <td>{apz.commission.apz_water_response.drinking_water}</td>
                            </tr>
                            <tr>
                              <td><b>Производственные нужды (м<sup>3</sup>/сутки)</b></td>
                              <td>{apz.commission.apz_water_response.prod_water}</td>
                            </tr>
                            <tr>
                              <td><b>Расходы пожаротушения внутренные (л/сек)</b></td>
                              <td>{apz.commission.apz_water_response.fire_fighting_water_in}</td>
                            </tr>
                            <tr>
                              <td><b>Расходы пожаротушения внешные (л/сек)</b></td>
                              <td>{apz.commission.apz_water_response.fire_fighting_water_out}</td>
                            </tr>
                            <tr>
                              <td><b>Точка подключения</b></td>
                              <td>{apz.commission.apz_water_response.connection_point}</td>
                            </tr>
                            <tr>
                              <td><b>Рекомендация</b></td>
                              <td>{apz.commission.apz_water_response.recommendation}</td>
                            </tr>
                            <tr>
                              <td><b>Номер документа</b></td>
                              <td>{apz.commission.apz_water_response.doc_number}</td>
                            </tr>
                            <tr>
                              <td><b>Загруженный ТУ</b></td>  
                              <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id)}>Скачать</a></td>
                            </tr>
                            <tr>
                              <td><b>Сформированный ТУ</b></td>  
                              <td><a className="text-info pointer" onClick={this.printWaterTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                            </tr>
                          </tbody>
                          :
                          <tbody>
                            <tr>
                              <td style={{width: '50%'}}><b>МО Вода</b></td>  
                              <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id)}>Скачать</a></td>
                            </tr>
                          </tbody>
                        }
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                    </div>
                  </div>
                </div>
              </div>
            }

            {this.state.heatResponseFile &&
              <div className="modal fade" id="heat_provier_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Решение теплоснабжения</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <table className="table table-bordered table-striped">
                        {apz.commission.apz_heat_response.response ?
                          <tbody>
                            <tr> 
                              <td style={{width: '50%'}}><b>Источник теплоснабжения</b></td>
                              <td>{apz.commission.apz_heat_response.resource}</td>
                            </tr>
                            <tr>
                              <td><b>Точка подключения</b></td>
                              <td>{apz.commission.apz_heat_response.connection_point}</td>
                            </tr>
                            <tr>
                              <td><b>Давление теплоносителя</b></td>
                              <td>{apz.commission.apz_heat_response.trans_pressure}</td>
                            </tr>
                            <tr>
                              <td><b>Тепловые нагрузки по договору</b></td>
                              <td>{apz.commission.apz_heat_response.load_contract_num}</td>
                            </tr>
                            <tr>
                              <td><b>Отопление (Гкал/ч)</b></td>
                              <td>{apz.commission.apz_heat_response.main_in_contract}</td>
                            </tr>
                            <tr>
                              <td><b>Вентиляция (Гкал/ч)</b></td>
                              <td>{apz.commission.apz_heat_response.ven_in_contract}</td>
                            </tr>
                            <tr>
                              <td><b>Горячее водоснабжение (Гкал/ч)</b></td>
                              <td>{apz.commission.apz_heat_response.water_in_contract}</td>
                            </tr>
                            <tr>
                              <td><b>Дополнительное</b></td>
                              <td>{apz.commission.apz_heat_response.addition}</td>
                            </tr>
                            <tr>
                              <td><b>Номер документа</b></td>
                              <td>{apz.commission.apz_heat_response.doc_number}</td> 
                            </tr>
                            <tr>
                              <td><b>Загруженный ТУ</b>:</td> 
                              <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id)}>Скачать</a></td>
                            </tr>
                            <tr>
                              <td><b>Сформированный ТУ</b></td>  
                              <td><a className="text-info pointer" onClick={this.printHeatTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                            </tr>
                          </tbody>
                          :
                          <tbody>
                            <tr>
                              <td style={{width: '50%'}}><b>МО Тепло</b></td>  
                              <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id)}>Скачать</a></td>
                            </tr>
                          </tbody>
                        }
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                    </div>
                  </div>
                </div>
              </div>
            }

            {this.state.electroResponseFile &&
              <div className="modal fade" id="electro_provier_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Решение электроснабжения</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <table className="table table-bordered table-striped">
                        {apz.commission.apz_heat_response.response ?
                          <tbody>
                            <tr>
                              <td style={{width: '50%'}}><b>Требуемая мощность (кВт)</b></td>
                              <td>{apz.commission.apz_heat_response.req_power}</td>
                            </tr>
                            <tr> 
                              <td><b>Характер нагрузки (фаза)</b></td>
                              <td>{apz.commission.apz_heat_response.phase}</td>
                            </tr>
                            <tr>
                              <td><b>Категория по надежности (кВт)</b></td>
                              <td>{apz.commission.apz_heat_response.safe_category}</td>
                            </tr>
                            <tr>
                              <td><b>Точка подключения</b></td>
                              <td>{apz.commission.apz_heat_response.connection_point}</td>
                            </tr>
                            <tr>
                              <td><b>Рекомендация</b></td>
                              <td>{apz.commission.apz_heat_response.recommendation}</td>
                            </tr>
                            <tr>
                              <td><b>Номер документа</b></td>
                              <td>{apz.commission.apz_heat_response.doc_number}</td> 
                            </tr>
                            <tr>
                              <td><b>Загруженный ТУ</b>:</td> 
                              <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id)}>Скачать</a></td>
                            </tr>
                            <tr>
                              <td><b>Сформированный ТУ</b></td>  
                              <td><a className="text-info pointer" onClick={this.printElectroTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                            </tr>
                          </tbody>
                          :
                          <tbody>
                            <tr>
                              <td style={{width: '50%'}}><b>МО Электро</b></td>  
                              <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id)}>Скачать</a></td>
                            </tr>
                          </tbody>
                        }
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                    </div>
                  </div>
                </div>
              </div>
            }

            {this.state.gasResponseFile &&
              <div className="modal fade" id="gas_provier_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Решение газоснабжения</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <table className="table table-bordered table-striped">
                        {apz.commission.apz_gas_response.response ?
                          <tbody>
                            <tr>
                              <td style={{width: '50%'}}><b>Точка подключения</b></td>
                              <td>{apz.commission.apz_gas_response.connection_point}</td>
                            </tr>
                            <tr>
                              <td><b>Диаметр газопровода (мм)</b></td>
                              <td>{apz.commission.apz_gas_response.gas_pipe_diameter}</td>
                            </tr>
                            <tr>
                              <td><b>Предполагаемый объем (м<sup>3</sup>/час)</b></td>
                              <td>{apz.commission.apz_gas_response.assumed_capacity}</td>
                            </tr>
                            <tr>
                              <td><b>Предусмотрение</b></td>
                              <td>{apz.commission.apz_gas_response.GasReconsideration}</td>
                            </tr>
                            <tr>
                              <td><b>Номер документа</b></td>
                              <td>{apz.commission.apz_gas_response.doc_number}</td>
                            </tr>
                            <tr>
                              <td><b>Загруженный ТУ</b></td> 
                              <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id)}>Скачать</a></td>
                            </tr>
                            <tr>
                              <td><b>Сформированный ТУ</b></td>  
                              <td><a className="text-info pointer" onClick={this.printGasTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                            </tr>
                          </tbody>
                          :
                          <tbody>
                            <tr>
                              <td style={{width: '50%'}}><b>МО Газ</b></td>  
                              <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id)}>Скачать</a></td>
                            </tr>
                          </tbody>
                        }
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                    </div>
                  </div>
                </div>
              </div>
            }

            {this.state.phoneResponseFile &&
              <div className="modal fade" id="phone_provier_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Решение телефонизации</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <table className="table table-bordered table-striped">
                        {apz.commission.apz_phone_response.response ?
                          <tbody>
                            <tr>
                              <td style={{width: '50%'}}><b>Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</b></td>
                              <td>{apz.commission.apz_phone_response.service_num}</td>
                            </tr>
                            <tr>
                              <td><b>Телефонная емкость</b></td>
                              <td>{apz.commission.apz_phone_response.capacity}</td>
                            </tr>
                            <tr>
                              <td><b>Планируемая телефонная канализация</b></td>
                              <td>{apz.commission.apz_phone_response.sewage}</td>
                            </tr>
                            <tr>
                              <td><b>Пожелания заказчика (тип оборудования, тип кабеля и др.)</b></td>
                              <td>{apz.commission.apz_phone_response.client_wishes}</td>
                            </tr>
                            <tr>
                              <td><b>Номер документа</b></td>
                              <td>{apz.commission.apz_phone_response.doc_number}</td>
                            </tr>
                            <tr>
                              <td><b>Загруженный ТУ</b></td>
                              <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id)}>Скачать</a></td>
                            </tr>
                            <tr>
                              <td><b>Сформированный ТУ</b></td>
                              <td><a className="text-info pointer" onClick={this.printPhoneTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                            </tr>
                          </tbody>
                          :
                          <tbody>
                            <tr>
                              <td style={{width: '50%'}}><b>МО Газ</b></td>
                              <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id)}>Скачать</a></td>
                            </tr>
                          </tbody>
                        }
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />} 

        <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
          {this.state.showMapText}
        </button>

        <h5 className="block-title-2 mt-5 mb-3">Статус</h5>
        <ShowStatusBar apz={this.state.apz} />

        <div className="col-sm-12">
          <hr />
          <Link className="btn btn-outline-secondary pull-right" to={'/citizen/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
        </div>
      </div>
    )
  }
}

class ShowMap extends React.Component {
  constructor(props) {
    super(props);

    this.toggleMap = this.toggleMap.bind(this);
  }

  toggleMap(value) {
    this.props.mapFunction(value)
  }

  saveCoordinates() {
    $('#ProjectAddressCoordinates').val($('#coordinates').html());

    this.props.hasCoordinates(true)

    if (window.confirm('Местоположение отмечено. Закрыть карту?')) {
      this.toggleMap(false);
    }
  }

  render() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    var oldPoint = [];
    var withPoint = this.props.point;
    var coordinates = this.props.coordinates;

    return (
      <div>
        {withPoint ? 
          <div className="row">
            <div className="col-sm-6">
              <h5 className="block-title-2 mt-0 mb-3">Карта</h5>
            </div>
            <div className="col-sm-6">
              <div className="pull-right">
                <button type="button" className="btn btn-outline-success mr-1" onClick={() => this.saveCoordinates()}>Сохранить</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => this.toggleMap.bind(this, false)}>Закрыть карту</button>
              </div>
            </div>
          </div>
          :
          <h5 className="block-title-2 mt-5 mb-3">Карта</h5>
        }
        <div id="coordinates" style={{display: 'none'}}></div>
        <div className="col-md-12 viewDiv"> 
          <EsriLoaderReact options={options} 
            modulesToLoad={[
              'esri/views/MapView',
              
              'esri/widgets/LayerList',

              'esri/WebScene',
              'esri/layers/FeatureLayer',
              'esri/layers/TileLayer',
              'esri/widgets/Search',
              'esri/WebMap',
              'esri/geometry/support/webMercatorUtils',
              'dojo/dom',
              'esri/Graphic',
              'dojo/domReady!'
            ]}    
            
            onReady={({loadedModules: [MapView, LayerList, WebScene, FeatureLayer, TileLayer, Search, WebMap, webMercatorUtils, dom, Graphic], containerNode}) => {
              var map = new WebMap({
                basemap: "streets",
                portalItem: {
                  id: "caa580cafc1449dd9aa4fd8eafd3a14d"
                }
              });

              /*var flRedLines = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8/FeatureServer",
                outFields: ["*"],
                title: "Красные линии"
              });
              map.add(flRedLines);

              var flFunZones = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%A4%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5_%D0%B7%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B52/FeatureServer",
                outFields: ["*"],
                title: "Функциональное зонирование"
              });
              map.add(flFunZones);
            
              var flGosAkts = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                outFields: ["*"],
                title: "Гос акты"
              });
              map.add(flGosAkts);*/

              if (coordinates) {
                var coordinatesArray = coordinates.split(", ");

                var view = new MapView({
                  container: containerNode,
                  map: map,
                  center: [parseFloat(coordinatesArray[0]), parseFloat(coordinatesArray[1])], 
                  scale: 10000
                });

                var point = {
                  type: "point",
                  longitude: parseFloat(coordinatesArray[0]),
                  latitude: parseFloat(coordinatesArray[1])
                };

                var markerSymbol = {
                  type: "simple-marker",
                  color: [226, 119, 40],
                  outline: {
                    color: [255, 255, 255],
                    width: 2
                  }
                };

                var pointGraphic = new Graphic({
                  geometry: point,
                  symbol: markerSymbol
                });

                view.graphics.add(pointGraphic);
              } else {
                  view = new MapView({
                  container: containerNode,
                  map: map,
                  center: [76.886, 43.250], 
                  scale: 10000
                });
              }
              
              if (withPoint) {
                view.on("click", showCoordinates);

                function showCoordinates(evt) {
                  var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
                  dom.byId("coordinates").innerHTML = mp.x.toFixed(5) + ", " + mp.y.toFixed(5);

                  var point = {
                    type: "point",
                    longitude: mp.x.toFixed(5),
                    latitude: mp.y.toFixed(5)
                  };

                  var markerSymbol = {
                    type: "simple-marker",
                    color: [226, 119, 40],
                    outline: {
                      color: [255, 255, 255],
                      width: 2
                    }
                  };

                  var pointGraphic = new Graphic({
                    geometry: point,
                    symbol: markerSymbol
                  });

                  view.graphics.remove(oldPoint);
                  view.graphics.add(pointGraphic);

                  oldPoint = pointGraphic;
                }
              }

              var searchWidget = new Search({
                view: view,
                sources: [{
                  featureLayer: new FeatureLayer({
                    url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                    popupTemplate: { // autocasts as new PopupTemplate()
                      title: "Кадастровый номер: {cadastral_number} </br> Назначение: {function} <br/> Вид собственности: {ownership}"
                    }
                  }),
                  searchFields: ["cadastral_number"],
                  displayField: "cadastral_number",
                  exactMatch: false,
                  outFields: ["cadastral_number", "function", "ownership"],
                  name: "Зарегистрированные государственные акты",
                  placeholder: "Кадастровый поиск"
                }]
              });
    
              view.when( function(callback){
                var layerList = new LayerList({
                  view: view
                });

                // Add the search widget to the top right corner of the view
                view.ui.add(searchWidget, {
                  position: "top-right"
                });

                // Add widget to the bottom right corner of the view
                view.ui.add(layerList, "bottom-right");

              }, function(error) {
                console.log('MapView promise rejected! Message: ', error);
              });
            }}
          /> 
        </div>
      </div>
    )
  }
}

class ShowStatusBar extends React.Component {
  constructor(props) {
    super(props);

    this.getStatusForArch = this.getStatusForArch.bind(this);
    this.getStatusForHeadArch = this.getStatusForHeadArch.bind(this);
    this.getStatusForProvider = this.getStatusForProvider.bind(this);
  }

  // change status for Architect in ProgressBar
  getStatusForArch(status, rd, rr) {
    if((status === 0 || status === 1 || status === 3 || status === 4) && (rd !== null && rr === null))
      return 'circle done';
    else if(status === 0 && (rd !== null && rr !== null))
      return 'circle fail';
    else if(status === 2)
      return 'circle active';
    else
      return 'circle';
  }

  // change status for Providers(water, heat, gas, electricity) in ProgressBar
  getStatusForProvider(pStatus, status) {
    if(status === 1)
      return 'circle done';
    else if(status === 0)
      return 'circle fail';
    else if(pStatus === 3 && status === 2)
      return 'circle active';
    else
      return 'circle';
  }

  // change status for HeadArchitect in ProgressBar
  getStatusForHeadArch(status, hd, hr) {
    if(status === 2 || ((status === 0 || status === 1 || status === 2 || status === 3) && (hd === null && hr === null)))
      return 'circle';
    else if(status === 4)
      return 'circle active';
    else if(status === 0)
      return 'circle fail';
    else
      return 'circle done';
  }

  toDate(date) {
    if(date === null) {
      return date;
    }
    
    var jDate = new Date(date);
    var curr_date = jDate.getDate();
    var curr_month = jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var curr_hour = jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
    
    return formated_date;
  }

  render() {
    return (
      <div className="row">
        <div className="row statusBar">
          {/*<div id="infoDiv">Нажмите на участок или объект, чтобы получить информацию</div>*/}
          {/*<div id="viewDiv"></div>*/}
          <div className="progressBar">
            <div className={this.getStatusForArch(this.props.apz.status, this.props.apz.RegionDate, this.props.apz.RegionResponse)}>
              <span className="label">1</span>
              <span className="title">Районный архитектор</span>
            </div>
            <span className="bar"></span>
            <div className="box">
              <div className={this.getStatusForProvider(this.props.apz.Status, this.props.apz.ApzWaterStatus)}>
                <span className="label">2</span>
                <span className="title">Поставщик (вода) </span>
              </div>
              <span className="bar"></span>
              <div className={this.getStatusForProvider(this.props.apz.Status, this.props.apz.ApzGasStatus)}>
                <span className="label">2</span>
                <span className="title">Поставщик (газ)</span>
              </div>
              <span className="bar"></span>
              <div className={this.getStatusForProvider(this.props.apz.Status, this.props.apz.ApzHeatStatus)}>
                <span className="label">2</span>
                <span className="title">Поставщик (тепло)</span>
              </div>
              <span className="bar"></span>
              <div className={this.getStatusForProvider(this.props.apz.Status, this.props.apz.ApzElectricityStatus)}>
                <span className="label">2</span>
                <span className="title">Поставщик (электр)</span>
              </div>
              <span className="bar"></span>
              <div className={this.getStatusForProvider(this.props.apz.Status, this.props.apz.ApzPhoneStatus)}>
                <span className="label">2</span>
                <span className="title">Поставщик (телефон)</span>
              </div>
            </div>
            <span className="bar"></span>
            <div className={this.getStatusForHeadArch(this.props.apz.Status, this.props.apz.HeadDate, this.props.apz.HeadResponse)}>
              <span className="label">3</span>
              <span className="title">Главный архитектор</span>
            </div>
          </div>
          <div className="row actionDate">
            <div className="col-2" style={{padding: '0'}}></div>
            <div className="col-8" style={{padding: '0', fontSize: '0.9em'}}>
              <div className="row">
                <div className="col-2">{this.props.apz.RegionDate && this.toDate(this.props.apz.RegionDate)}</div>
                <div className="col-1point5">{this.props.apz.ProviderWaterDate && this.toDate(this.props.apz.ProviderWaterDate)}</div>
                <div className="col-1point5">{this.props.apz.ProviderGasDate && this.toDate(this.props.apz.ProviderGasDate)}</div>
                <div className="col-1point5">{this.props.apz.ProviderHeatDate && this.toDate(this.props.apz.ProviderHeatDate)}</div>
                <div className="col-2">{this.props.apz.ProviderElectricityDate && this.toDate(this.props.apz.ProviderElectricityDate)}</div>
                <div className="col-2">{this.props.apz.ProviderPhoneDate && this.toDate(this.props.apz.ProviderPhoneDate)}</div>
                <div className="col-2">{this.props.apz.HeadDate && this.toDate(this.props.apz.HeadDate)}</div>
              </div>
            </div>
            <div className="col-2" style={{padding: '0'}}></div>
          </div>
        </div>
      </div>
    )
  }
}