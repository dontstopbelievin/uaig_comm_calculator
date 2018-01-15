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
    xhr.open("get", window.url + "api/apz/user", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        
        switch (status) {
          case 'active':
            var apzs = data.filter(function(obj) { return obj.Status !== 0 && obj.Status !== 1; });
            break;

          case 'accepted':
            apzs = data.filter(function(obj) { return obj.Status === 1; });
            break;

          case 'declined':
            apzs = data.filter(function(obj) { return obj.Status === 0; });
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
                  <td>{apz.ProjectName}</td>
                  <td>
                    {apz.Status === 0 &&
                      <span className="text-danger">Отказано</span>
                    }

                    {apz.Status === 1 &&
                      <span className="text-success">Принято</span>
                    }

                    {apz.Status !== 0 && apz.Status !== 1 &&
                      <span className="text-info">В процессе</span>
                    }
                  </td>
                  <td>
                    <Link className="btn btn-outline-info" to={'/citizen/' + apz.Id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
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
      titleDocumentFile: null
    }
    
    this.tabSubmission = this.tabSubmission.bind(this);
    this.onPersonalIdFileChange = this.onPersonalIdFileChange.bind(this);
    this.onConfirmedTaskFileChange = this.onConfirmedTaskFileChange.bind(this);
    this.onTitleDocumentFileChange = this.onTitleDocumentFileChange.bind(this);
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
          url: window.url + 'api/apz/Create',
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
              url: window.url + 'api/apz/create/upload/' + data.Id ,
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
    if(document.getElementById('ObjectType').value === 'obj_ijs') 
    {
      if(document.getElementsByName('ObjectArea')[0].value <= 100) 
      {
        document.getElementsByName('GasGeneral')[0].max = 6;
      }
      else if((document.getElementsByName('ObjectArea')[0].value >= 101) 
        && (document.getElementsByName('ObjectArea')[0].value <= 500)) 
      {
        document.getElementsByName('GasGeneral')[0].max = 15;
      } 
      else 
      {
        document.getElementsByName('GasGeneral')[0].removeAttribute("max");
      }
    }
    if(document.getElementById('ObjectType').value === 'obj_mjk') 
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
                    <input type="text" required className="form-control" name="ProjectAddress" />
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
                    <input type="text" className="form-control" name="ObjectName" placeholder="" />
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
                  <input type="number" required className="form-control" name="ObjectArea" onChange={this.ObjectArea.bind(this)} disabled />
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
                  <label htmlFor="ElectricRequiredPower">Требуемая мощность (кВт)</label>
                  <input type="number" className="form-control" name="ElectricRequiredPower" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricityPhase">Характер нагрузки (фаза)</label>
                  <select className="form-control" name="ElectricityPhase">
                    <option>Однофазная</option>
                    <option>Трехфазная</option>
                    <option>Постоянная</option>
                    <option>Временная</option>
                    <option>Сезонная</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricSafetyCategory">Категория по надежности (кВт)</label>
                  <input type="text" className="form-control" required name="ElectricSafetyCategory" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricMaxLoadDevice">из указанной макс. нагрузки относятся к электроприемникам (кВА):</label>
                  <input type="number" className="form-control" name="ElectricMaxLoadDevice" placeholder="" />
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
                  <label htmlFor="ElectricMaxLoad">Существующая максимальная нагрузка (кВА)</label>
                  <input type="number" className="form-control" name="ElectricMaxLoad" />
                </div>
                <div className="form-group">
                  <label htmlFor="ElectricAllowedPower">Разрешенная по договору мощность трансформаторов (кВА)</label>
                  <input type="number" className="form-control" name="ElectricAllowedPower" />
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
                  <input type="number" disabled className="form-control" name="WaterRequirement" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="WaterDrinking">На хозпитьевые нужды (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="WaterDrinking" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="WaterProduction">На производственные нужды (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="WaterProduction" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="WaterFireFighting">Потребные расходы пожаротушения (л/сек)</label>
                  <input type="number" min="10" className="form-control" name="WaterFireFighting" />
                </div>
                <div className="form-group">
                  <label htmlFor="WaterSewage">Общее количество сточных вод (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="WaterSewage" />
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
                  <input type="number" required className="form-control" name="SewageAmount" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="SewageFeksal">фекcальных (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="SewageFeksal" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="SewageProduction">Производственно-загрязненных (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="SewageProduction" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="SewageToCity">Условно-чистых сбрасываемых на городскую канализацию (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="SewageToCity" />
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
                  <input type="number" className="form-control" name="HeatGeneral" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatMain">Отопление (Гкал/ч)</label>
                  <input type="number" className="form-control" name="HeatMain" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatVentilation">Вентиляция (Гкал/ч)</label>
                  <input type="number" className="form-control" name="HeatVentilation" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="HeatWater">Горячее водоснабжение (Гкал/ч)</label>
                  <input type="number" className="form-control" id="HeatWater" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="HeatTech">Технологические нужды(пар) (Т/ч)</label>
                  <input type="number" className="form-control" name="HeatTech" placeholder="" />
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
                  <input type="number" className="form-control" name="PhoneServiceNum" placeholder="" />
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
                  <input type="number" required className="form-control" name="GasGeneral" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasCooking">На приготовление пищи (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasCooking" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasHeat">Отопление (м<sup>3</sup>/час)</label>
                  <input type="number" required className="form-control" name="GasHeat" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="GasVentilation">Вентиляция (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasVentilation" placeholder="" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasConditioner">Кондиционирование (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasConditioner" />
                </div>
                <div className="form-group">
                  <label htmlFor="GasWater">Горячее водоснабжение при газификации многоэтажных домов (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasWater" />
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
    };

    this.toggleMap = this.toggleMap.bind(this);
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        this.setState({apz: JSON.parse(xhr.responseText)});
      }
    }.bind(this)
    xhr.send();
  }

  downloadFile(event) {
    var buffer =  event.target.getAttribute("data-file")
    var name =  event.target.getAttribute("data-name");
    var ext =  event.target.getAttribute("data-ext");

    var base64ToArrayBuffer = (function () {
      
      return function (base64) {
        var binaryString =  window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        
        for (var i = 0; i < binaryLen; i++)        {
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

    saveByteArray([base64ToArrayBuffer(buffer)], name + ext);
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

  toggleMap(e) {
    this.setState({
      showMap: !this.state.showMap
    })

    if (this.state.showMap) {
      this.setState({
        showMapText: 'Показать карту'
      })
    } else {
      this.setState({
        showMapText: 'Скрыть карту'
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
  
  render() {
    var apz = this.state.apz;

    return (
      <div>
        <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>
        
        <table className="table table-bordered table-striped">
          <tbody>
            <tr>
              <td style={{width: '22%'}}><b>Заявитель</b></td>
              <td>{apz.Applicant}</td>
            </tr>
            <tr>
              <td><b>Адрес</b></td>
              <td>{apz.Address}</td>
            </tr>
            <tr>
              <td><b>Телефон</b></td>
              <td>{apz.Phone}</td>
            </tr>
            <tr>
              <td><b>Заказчик</b></td>
              <td>{apz.Customer}</td>
            </tr>
            <tr>
              <td><b>Разработчик</b></td>
              <td>{apz.Designer}</td>
            </tr>
            <tr>
              <td><b>Название проекта</b></td>
              <td>{apz.ProjectName}</td>
            </tr>
            <tr>
              <td><b>Адрес проекта</b></td>
              <td>{apz.ProjectAddress}</td>
            </tr>
            <tr>
              <td><b>Дата заявления</b></td>
              <td>{this.toDate(apz.ApzDate)}</td>
            </tr>
            
            {apz.PersonalIdFile != null &&
              <tr>
                <td><b>Уд. лич./ Реквизиты</b></td>
                <td><a className="text-info pointer" data-file={apz.PersonalIdFile} data-name="Уд. лич./Реквизиты" data-ext={apz.PersonalIdFileExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
              </tr>
            }

            {apz.ConfirmedTaskFile != null &&
              <tr>
                <td><b>Утвержденное задание</b></td>
                <td><a className="text-info pointer" data-file={apz.ConfirmedTaskFile} data-name="Утвержденное задание" data-ext={apz.ConfirmedTaskFileExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
              </tr>
            }

            {apz.TitleDocumentFile != null &&
              <tr>
                <td><b>Правоустанавл. документ</b></td>
                <td><a className="text-info pointer" data-file={apz.TitleDocumentFile} data-name="Правоустанавл. документ" data-ext={apz.TitleDocumentFileExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
              </tr>
            }
          </tbody>
        </table>

        { apz.HeadResponseFile != null &&
          <div>
            <h5 className="block-title-2 mt-5 mb-3">Результат</h5>

            { apz.Status !== 0 ? 
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td>Загруженный АПЗ</td> 
                    <td><a className="text-info pointer" data-file={apz.HeadResponseFile} data-name="АПЗ" data-ext={apz.HeadResponseFileExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                  </tr>
                  <tr>
                    <td>Сформированный АПЗ</td>
                    <td><a className="text-info pointer" onClick={this.printApz.bind(this, apz.Id, apz.ProjectName)}>Скачать</a></td>
                  </tr>
                </tbody>
              </table>
              :
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                    <td><a className="text-info pointer" data-file={apz.HeadResponseFile} data-name="Мотивированный отказ" data-ext={apz.HeadResponseFileExt} onClick={this.downloadFile.bind(this)}>Скачать</a></td>
                  </tr>
                </tbody>
              </table>
            }
          </div>
        }

        {this.state.showMap && <ShowMap />} 

        <button className="btn btn-raised btn-info" onClick={this.toggleMap} style={{margin: '20px auto 10px'}}>
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
  render() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    return (
      <div>
        <h5 className="block-title-2 mt-5 mb-3">Карта</h5>
        <div className="col-md-12 viewDivCitizen"> 
          <EsriLoaderReact options={options} 
            modulesToLoad={[
              'esri/views/MapView',
              
              'esri/widgets/LayerList',

              'esri/layers/FeatureLayer',
              'esri/layers/TileLayer',
              'esri/widgets/Search',
              'esri/Map',
              'dojo/domReady!'
            ]}    
            
            onReady={({loadedModules: [MapView, LayerList, FeatureLayer, TileLayer, Search, Map], containerNode}) => {
              var map = new Map({
                basemap: "topo"
              });
              
              var flRedLines = new FeatureLayer({
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
              map.add(flGosAkts);
              
              var view = new MapView({
                container: containerNode,
                map: map,
                center: [76.886, 43.250], // lon, lat
                scale: 10000
              });
              
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
      <div>
        <div className="row">
          <div className="row statusBar">
            {/*<div id="infoDiv">Нажмите на участок или объект, чтобы получить информацию</div>*/}
            {/*<div id="viewDiv"></div>*/}
            <div className="progressBar">
              <div className={this.getStatusForArch(this.props.apz.Status, this.props.apz.RegionDate, this.props.apz.RegionResponse)}>
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
              </div>
              <span className="bar"></span>
              <div className={this.getStatusForHeadArch(this.props.apz.Status, this.props.apz.HeadDate, this.props.apz.HeadResponse)}>
                <span className="label">3</span>
                <span className="title">Главный архитектор</span>
              </div>
            </div>
            <div className="row actionDate">
              <div className="col-3"></div>
              <div className="col-7" style={{padding: '0', fontSize: '0.8em'}}>
                <div className="row">
                  <div className="col-2">{this.toDate(this.props.apz.RegionDate)}</div>
                  <div className="col-2">{this.toDate(this.props.apz.ProviderWaterDate)}</div>
                  <div className="col-2">{this.toDate(this.props.apz.ProviderGasDate)}</div>
                  <div className="col-2">{this.toDate(this.props.apz.ProviderHeatDate)}</div>
                  <div className="col-2">{this.toDate(this.props.apz.ProviderElectricityDate)}</div>
                  <div className="col-2">{this.toDate(this.props.apz.HeadDate)}</div>
                </div>
              </div>
              <div className="col-2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}