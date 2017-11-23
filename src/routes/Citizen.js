import React from 'react';
import $ from 'jquery';

class ApzForm extends React.Component {

  tabSubmission(id) { 
    if ($('#tab'+id+'-form').valid()) {
      $('#tab'+id+'-link').children('#tabIcon').removeClass().addClass('glyphicon glyphicon-ok');
      $('#tab'+id+'-link').next().trigger('click');
    } else {
      $('#tab'+id+'-link').children('#tabIcon').removeClass().addClass('glyphicon glyphicon-remove');
    }
  }

  requestSubmission() {
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
          url: window.url + 'api/Apz/Create',
          contentType: 'application/json; charset=utf-8',
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
          },
          data: JSON.stringify(apzData),
          success: function (data) {
            alert("Заявка успешно подана");
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
            $('#apzFormDiv').hide(1000);
          },
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


  render() {
    return (
      <div className="container" id="apzFormDiv">
        <div>
        <div className="tab-pane">
          <h4>Заявление на АПЗ</h4>
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
              <form id="tab0-form" onSubmit={(e) => {this.tabSubmission('0'); e.preventDefault();}}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label for="Applicant">Наименование заявителя:</label>
                  <input type="text" className="form-control" required name="Applicant" placeholder="Наименование" />
                  <span className="help-block">Ф.И.О. (при его наличии) физического лица <br />или наименование юридического лица</span>
                </div>
                <div className="form-group">
                  <label for="Address">Адрес:</label>
                  <input type="text" className="form-control" required id="ApzAddressForm" name="Address" placeholder="Адрес" />
                </div>
                <div className="form-group">
                  <label for="Phone">Телефон</label>
                  <input type="tel" className="form-control" name="Phone" placeholder="Телефон" />
                </div>
                <div className="form-group">
                  <label for="Region">Район</label>
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
                  <label for="Customer">Заказчик</label>
                  <input type="text" className="form-control" name="Customer" placeholder="Заказчик" />
                </div>
                <div className="form-group">
                  <label for="Designer">Проектировщик №ГСЛ, категория</label>
                  <input type="text" className="form-control" name="Designer" />
                </div>
                <div className="form-group">
                  <label for="ProjectName">Наименование проектируемого объекта</label>
                  <input type="text" className="form-control" id="ProjectName" name="ProjectName" />
                </div>
                <div className="form-group">
                  <label for="ProjectAddress">Адрес проектируемого объекта</label>
                  <input type="text" className="form-control" name="ProjectAddress" />
                </div>
                <div className="form-group">
                  <label for="ApzDate">Дата</label>
                  <input type="date" required className="form-control" name="ApzDate" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="tab-pane fade" id="tab1" role="tabpanel" aria-labelledby="tab1-link">
              <form id="tab1-form" onSubmit={(e) => {this.tabSubmission('1'); e.preventDefault();}}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label for="ObjectClient">Заказчик</label>
                  <input type="text" required className="form-control" name="ObjectClient" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="ObjectName">Наименование объекта:</label>
                  <input type="text" required className="form-control" name="ObjectName" placeholder="наименование" />
                </div>
                <div className="form-group">
                  <label for="ObjectTerm">Срок строительства по нормам</label>
                  <input type="text" className="form-control" id="ObjectTerm" placeholder="" />
                </div>
                {/* <div className="form-group">
                  <label for="">Правоустанавливающие документы на объект (реконструкция)</label>
                  <div className="fileinput fileinput-new" data-provides="fileinput">
                  <span className="btn btn-default btn-file"><span></span><input type="file" multiple /></span>
                  <span className="fileinput-filename"></span><span className="fileinput-new"></span>
                  </div>
                </div> */}
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label for="ObjectLevel">Этажность</label>
                  <input type="number" className="form-control" name="ObjectLevel" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="ObjectArea">Площадь здания</label>
                  <input type="number" className="form-control" name="ObjectArea" />
                </div>
                <div className="form-group">
                  <label for="ObjectRooms">Количество квартир (номеров, кабинетов)</label>
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
              <form id="tab2-form" onSubmit={(e) => {this.tabSubmission('2'); e.preventDefault();}}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label for="ElectricRequiredPower">Требуемая мощность (кВт)</label>
                  <input type="number" className="form-control" name="ElectricRequiredPower" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="">Характер нагрузки (фаза)</label>
                  <select className="form-control">
                  <option>Однофазная</option>
                  <option>Трехфазная</option>
                  <option>Постоянная</option>
                  <option>Временная</option>
                  <option>Сезонная</option>
                  </select>
                </div>
                <div className="form-group">
                  <label for="ElectricSafetyCategory">Категория по надежности (кВт)</label>
                  <input type="text" className="form-control" required name="ElectricSafetyCategory" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="ElectricMaxLoadDevice">из указанной макс. нагрузки относятся к электроприемникам  (кВА):</label>
                  <input type="number" className="form-control" name="ElectricMaxLoadDevice" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                {/*<div className="form-group">
                  <label for="">Предполагается установить</label>
                  <br />
                  <div className="col-md-6">
                  <ul style="list-style-type: none; padding-left: 3px">
                    <li><input type="checkbox" id="CB1"><span style="padding-left: 3px" for="CB1">электрокотлы</span><input type="text" className="form-control" placeholder=""></li>
                    <li><input type="checkbox" id="CB2"><span style="padding-left: 3px" for="CB2">электрокалориферы</span><input type="text" className="form-control" placeholder=""></li>
                    <li><input type="checkbox" id="CB3"><span style="padding-left: 3px" for="CB3">электроплитки</span><input type="text" className="form-control" placeholder=""></li>
                  </ul>
                  </div>
                  <div className="col-md-6">
                  <ul style="list-style-type: none; padding-left: 3px">
                    <li><input type="checkbox" id="CB4"><span style="padding-left: 3px" for="CB4">электропечи</span><input type="text" className="form-control" placeholder=""></li>
                    <li><input type="checkbox" id="CB5"><span style="padding-left: 3px" for="CB5">электроводонагреватели</span><input type="text" className="form-control" placeholder=""></li>
                  </ul>
                  </div>
                </div>*/}
                <div className="form-group">
                  <label for="ElectricMaxLoad">Существующая максимальная нагрузка (кВА)</label>
                  <input type="number" className="form-control" name="ElectricMaxLoad" />
                </div>
                <div className="form-group">
                  <label for="ElectricAllowedPower">Разрешенная по договору мощность трансформаторов (кВА)</label>
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
              <form id="tab3-form" onSubmit={(e) => {this.tabSubmission('3'); e.preventDefault();}}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label for="WaterRequirement">Общая потребность в воде (м<sup>3</sup>/сутки)</label>
                  <input type="number" required className="form-control" name="WaterRequirement" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="WaterDrinking">На хозпитьевые нужды (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="WaterDrinking" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label for="WaterProduction">На производственные нужды (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="WaterProduction" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="WaterFireFighting">Потребные расходы пожаротушения (л/сек)</label>
                  <input type="number" className="form-control" name="WaterFireFighting" />
                </div>
                <div className="form-group">
                  <label for="WaterSewage">Общее количество сточных вод (м<sup>3</sup>/сутки)</label>
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
              <form id="tab4-form" onSubmit={(e) => {this.tabSubmission('4'); e.preventDefault();}}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label for="SewageAmount">Общее количество сточных вод  (м<sup>3</sup>/сутки)</label>
                  <input type="number" required className="form-control" name="SewageAmount" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="SewageFeksal">фекcальных (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="SewageFeksal" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label for="SewageProduction">Производственно-загрязненных (м<sup>3</sup>/сутки)</label>
                  <input type="number" className="form-control" name="SewageProduction" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="SewageToCity">Условно-чистых сбрасываемых на городскую канализацию (м<sup>3</sup>/сутки)</label>
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
              <form id="tab5-form" onSubmit={(e) => {this.tabSubmission('5'); e.preventDefault();}}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label for="HeatGeneral">Общая тепловая нагрузка (Гкал/ч)</label>
                  <input type="number" className="form-control" name="HeatGeneral" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="HeatMain">Отопление (Гкал/ч)</label>
                  <input type="number" className="form-control" name="HeatMain" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="HeatVentilation">Вентиляция (Гкал/ч)</label>
                  <input type="number" className="form-control" name="HeatVentilation" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="HeatWater">Горячее водоснабжение (Гкал/ч)</label>
                  <input type="number" className="form-control" id="HeatWater" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label for="HeatTech">Технологические нужды(пар) (Т/ч)</label>
                  <input type="number" className="form-control" name="HeatTech" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="HeadDistribution">Разделить нагрузку по жилью и по встроенным помещениям</label>
                  <input type="tet" className="form-control" name="HeadDistribution" />
                </div>
                <div className="form-group">
                  <label for="HeatSaving">Энергосберегающее мероприятие</label>
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
              <form id="tab6-form" onSubmit={(e) => {this.tabSubmission('6'); e.preventDefault();}}>
              <div className="row">
                <div className="col-md-12">
                <div className="form-group">
                  <label for="SewageClientWishes">Пожелание заказчика</label>
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
              <form id="tab7-form" onSubmit={(e) => {this.tabSubmission('7'); e.preventDefault();}}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label for="PhoneServiceNum">Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</label>
                  <input type="number" className="form-control" name="PhoneServiceNum" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="PhoneCapacity">Телефонная емкость</label>
                  <input type="text" className="form-control" name="PhoneCapacity" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label for="PhoneSewage">Планируемая телефонная канализация</label>
                  <input type="text" className="form-control" name="PhoneSewage" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="PhoneClientWishes">Пожелания заказчика (тип оборудования, тип кабеля и др.)</label>
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
              <form id="tab8-form" onSubmit={(e) => {this.tabSubmission('8'); e.preventDefault();}}>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group">
                  <label for="GasGeneral">Общая потребность (м<sup>3</sup>/час)</label>
                  <input type="number" required className="form-control" name="GasGeneral" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="GasCooking">На приготовление пищи (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasCooking" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="GasHeat">Отопление (м<sup>3</sup>/час)</label>
                  <input type="number" required className="form-control" name="GasHeat" placeholder="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label for="GasVentilation">Вентиляция (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasVentilation" placeholder="" />
                </div>
                <div className="form-group">
                  <label for="GasConditioner">Кондиционирование (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasConditioner" />
                </div>
                <div className="form-group">
                  <label for="GasWater">Горячее водоснабжение при газификации многоэтажных домов (м<sup>3</sup>/час)</label>
                  <input type="number" className="form-control" name="GasWater" />
                </div>
                </div>
              </div>
              <div>
                <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
              </div>
              </form>
              <button onClick={this.requestSubmission} className="btn btn-outline-success">Отправить заявку</button>
            </div>
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
  }

  onClick() {
    this.setState({childVisible: !this.state.childVisible});
  }

  render() {
    return (
      <div className="row">
        <div className="col-3">
          <button className="btn btn-outline-secondary" onClick={() => this.onClick()}>
            Создать заявление
          </button>
        </div>
        {
          this.state.childVisible
            ? <ApzForm />
            : <div className="col-9"></div>
        }
      </div>
    )
  }
}

export default class Citizen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      acceptedForms: [],
      declinedForms: []
    }

    this.getAcceptedForms = this.getAcceptedForms.bind(this);
    this.getDeclinedForms = this.getDeclinedForms.bind(this);
  }

  getAcceptedForms() {
    //console.log("entered getUsers function");
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/user/accepted", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        this.setState({ acceptedForms: data });
      }
    }.bind(this);
    xhr.send();
  }

  getDeclinedForms() {
    //console.log("entered getUsers function");
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/user/declined", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        this.setState({ declinedForms: data });
      }
    }.bind(this);
    xhr.send();
  }

  renderDetailedApz(data) {
    console.log("123"+data);
    var role = sessionStorage.getItem("role");
    if (role === "Citizen") {
        var target = $(".citizen .apz-detailed");
        var panel = $("<div class='panel panel-default'>");
        var table = $("<table class='table'>");
        
        $(panel).append(table);
        $(target).empty().append(panel);
        $.each(data, (key, value) => {
            var el;
            switch (key) {
                case "Applicant":
                    el = $("<tr><td width='50%'>Заявитель</td><td width='50%' class='" + key + "'>" + value + "</td></tr>");
                    break;
                case "Address":
                    el = $("<tr><td width='50%'>Адрес</td><td width='50%' class='" + key + "'>" + value + "</td></tr>");
                    break;
                case "Phone":
                    el = $("<tr><td width='50%'>Номер телефона</td><td width='50%' class='" + key + "'>" + value + "</td></tr>");
                    break;
                case "Customer":
                    el = $("<tr><td width='50%'>Заказчик</td><td width='50%' class='" + key + "'>" + value + "</td></tr>");
                    break;
                case "Designer":
                    el = $("<tr><td width='50%'>Проектировщик</td><td width='50%' class='" + key + "'>" + value + "</td></tr>");
                    break;
                case "ProjectName":
                    el = $("<tr><td width='50%'>Наименование Проекта</td><td width='50%' class='" + key + "'>" + value + "</td></tr>");
                    break;
                case "ProjectAddress":
                    el = $("<tr><td width='50%'>Адрес Проекта</td><td width='50%' class='" + key + "'>" + value + "</td></tr>");
                    break;
                default:
                    break;
            }
            //var el = $("<tr><td width='50%'>" + key + "</td><td width='50%' class='" + key + "'>" + value + "</td></tr>");
            $(table).append(el);
        });
    }
  }



  componentWillMount() {
    //console.log("CitizenComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = sessionStorage.getItem('userRole');
      this.props.history.replace('/' + userRole);
      var userName = sessionStorage.getItem('userName');
      this.setState({username: userName});
    }else {
      this.props.history.replace('/');
    }
    
  }

  componentDidMount() {
    //console.log("CitizenComponent did mount");
    this.getAcceptedForms();
    this.getDeclinedForms();
  }

  componentWillUnmount() {
    //console.log("CitizenComponent will unmount");
  }

  render() {
    //console.log("rendering the CitizenComponent");
    var acceptedForms = this.state.acceptedForms;
    var declinedForms = this.state.declinedForms;
    return (
      <div className="content container">
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
        <div className="row">
          <div className="col-md-3 apz-list card">
            <h4>Принятые</h4>
            {
              acceptedForms.map(function(accForm, i){
                return(
                  <li key={i}>
                    {accForm.ProjectName}
                  </li>
                  )
              })
            }
            <h4>Отказ
            {
              declinedForms.map(function(decForm, i){
                return(
                  <li key={i}>
                    {decForm.ProjectName}
                  </li>
                )
              })
            }
            </h4>
            <h4>Активные</h4>
          </div>
          <div className="col-md-6 apz-additional card">
            <div id="citizenMapPause" className="col-md-12 well" style={{paddingTop:'10px', height:'500px', width:'100%'}}>
                Карта со слоями
            </div>
            {/*<button class="btn-block btn-info col-md-3" id="printApz">
              Распечатать АПЗ
            </button>*/}
          </div>
          <div className="col-md-3 apz-detailed card">
          </div>
        </div>
        <ShowHide />
        <div className="row" style={{height:'200px',paddingTop:'20px'}} id="mapApzForm">
          {/*<div id="infoDiv">Нажмите на участок или объект, чтобы получить информацию</div>*/}
          <div id="viewDiv"></div>
          <div className="progressBar">
            <div className="circle done">
            <span className="label">1</span>
            <span className="title">Районный архитектор</span>
            </div>
            
            <span className="bar half"></span>
            <div className="circle done">
            <span className="label">3</span>
            <span className="title">Провайдер водоснабжения</span>
            </div>
            <span className="bar"></span>
            <div className="circle done">
            <span className="label">4</span>
            <span className="title">Провайдер газоснабжения</span>
            </div>
            <span className="bar"></span>
            <div className="circle active">
            <span className="label">5</span>
            <span className="title">Провайдер теплоснабжения</span>
            </div>
            <span className="bar"></span>
            <div className="circle">
            <span className="label">6</span>
            <span className="title">Провайдер электроснабжения</span>
            </div>
            <span className="bar"></span>
            <div className="circle">
            <span className="label">7</span>
            <span className="title">Главный архитектор</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}