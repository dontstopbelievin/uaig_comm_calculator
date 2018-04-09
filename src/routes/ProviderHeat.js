import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
//import { NavLink } from 'react-router-dom';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';
import Proptypes from "prop-types";
import $ from 'jquery';
import Loader from 'react-loader-spinner';

export default class ProviderHeat extends React.Component {
  render() {
    return (
      <div className="content container urban-apz-page">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/providerheat/status/:status" component={AllApzs} />
              <Route path="/providerheat/:id" component={ShowApz} />
              <Redirect from="/providerheat" to="/providerheat/status/active" />
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
      apzs: [],
      loaderHidden: false
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

    this.setState({ loaderHidden: false });

    var token = sessionStorage.getItem('tokenInfo');
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Token is expired, please login again!");
        this.props.history.replace("/login");
        return false;
    }

    var providerName = roles[1];
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/provider/" + providerName, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        
        switch (status) {
          case 'active':
            var apzs = data.in_process;
            break;

          case 'accepted':
            apzs = data.accepted;
            break;

          case 'declined':
            apzs = data.declined;
            break;

          default:
            apzs = data;
            break;
        }
        
        this.setState({apzs: apzs});
      }

      this.setState({ loaderHidden: true });
    }.bind(this);
    xhr.send();
  }

  toDate(date) {
    if(date === null) {
      return date;
    }

    var jDate = new Date(date);
    var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
    var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var curr_hour = jDate.getHours() < 10 ? "0" + jDate.getHours() : jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
    
    return formated_date;
  }

  render() {
    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <ul className="nav nav-tabs mb-2 pull-right">
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerheat/status/active" replace>Активные</NavLink></li>
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerheat/status/accepted" replace>Принятые</NavLink></li>
              <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerheat/status/declined" replace>Отказанные</NavLink></li>
            </ul>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '23%'}}>Название</th>
                  <th style={{width: '23%'}}>Заявитель</th>
                  <th style={{width: '20%'}}>Адрес</th>
                  <th style={{width: '20%'}}>Дата заявления</th>
                  <th style={{width: '14%'}}>Срок</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.apzs.map(function(apz, index) {
                  return(
                    <tr key={index}>
                      <td>
                        {apz.project_name} 

                        {apz.object_type &&
                          <span className="ml-1">({apz.object_type})</span>
                        }
                      </td>
                      <td>{apz.applicant}</td>
                      <td>{apz.project_address}</td>
                      <td>{this.toDate(apz.created_at)}</td>
                      <td>{apz.object_term}</td>
                      <td>
                        <Link className="btn btn-outline-info" to={'/providerheat/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                      </td>
                    </tr>
                    );
                  }.bind(this))
                }
              </tbody>
            </table>
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

class ShowApz extends React.Component {
  constructor(props) {
    super(props);

    this.webSocket = new WebSocket('wss://127.0.0.1:13579/');
    this.heartbeat_msg = '--heartbeat--';
    this.heartbeat_interval = null;
    this.missed_heartbeats = 0;
    this.missed_heartbeats_limit_min = 3;
    this.missed_heartbeats_limit_max = 50;
    this.missed_heartbeats_limit = this.missed_heartbeats_limit_min;
    this.callback = null;

    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    this.state = {
      apz: [],
      showMap: false,
      showButtons: false,
      showSignButtons: false,
      showTechCon: false,
      file: false,
      heatResource: "",
      heatTransPressure: "",
      heatLoadContractNum: "",
      heatBlocks: [],
      heatMainInContract: [],
      heatVenInContract: [],
      heatWaterInContract: [],
      heatWaterMaxInContract: [],
      connectionPoint: "",
      addition: "",
      docNumber: "",
      description: '',
      responseId: 0,
      response: false,
      responseFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
      showMapText: 'Показать карту',
      accept: true,
      callSaveFromSend: false,
      heatStatus: 2,
      storageAlias: "PKCS12",
      xmlFile: false,
      isSigned: false,
      reconcileConnectionsWith: "ЦЭР ТОО «АлТС» (тел. 274-04-47).",
      heatTransporter: '2-трубной схеме',
      twoPipePressureInTc: "",
      twoPipePressureInSc: "",
      twoPipePressureInRc: "",
      fourHeatPipePressureInTc: "",
      fourWaterPipePressureInTc: "",
      fourHeatPipePressureInSc: "",
      fourWaterPipePressureInSc: "",
      fourHeatPipePressureInRc: "",
      fourWaterPipePressureInRc: "",
      temperatureChart: "",
      connectionTerms: "– Подключение выполнить по технологии присоединения к предызолированным трубопроводам. \n\n– Размещение зданий и сооружений Вашего объекта предусмотреть на расстоянии с учетом соблюдения охранной зоны тепловых сетей 2dy_____ мм, проложенных __________ Вашего объекта. В противном случае выполнить их вынос из-под пятна застройки с переключением существующих потребителей. Проект выноса тепловых сетей согласовать с ТОО «АлТС»",
      heatingNetworksDesign: "– Тепловые сети запроектировать с применением предварительно изолированных трубопроводов с устройством системы оперативного дистанционного контроля. Способ прокладки тепловых сетей определить проектом с учетом требований МСН 4.02-02-2004 «Тепловые сети». \n\n– После выполнения работ комплект исполнительной документации на бумажном носителе и в электронном исполнении, зарегистрированный в КГУ «Управление архитектуры и градостроительства г. Алматы», передать в ТОО «АлТС».",
      finalHeatLoads: "Окончательные тепловые нагрузки уточнить проектом и согласовать с Оперативно-диспетчерским управлением ТОО «АлТС» (тел.: 378-07-00, вн.1007). Договор на оказание услуг по передаче и распределению тепловой энергии будет заключен на согласованную уточненную тепловую нагрузку.\n\nВ соответствии с п. 12.1 СНиП РК 4.02-42-2006 «Отопление, вентиляция и кондиционирование» в системе вентиляции при обосновании предусмотреть устройства утилизации теплоты вентиляционных выбросов (рекуперация, рециркуляция вытяжного воздуха) с учетом пунктов 12.2, 12.5 СНиП РК 4.02-42-2006 «Отопление, вентиляция и кондиционирование».",
      heatNetworksRelaying: "– В связи с увеличением циркуляционного расхода выполнить перекладку тепловых сетей от ТК ___ до ТК ___ с увеличением диаметра с 2Dу___ мм на 2Dу___ мм. Реконструируемые тепловые сети в установленном порядке передать на баланс ТОО «АлТС». \n\n– Выполнить поверочный расчет диаметров трубопроводов внутриплощадочных тепловых сетей с учетом дополнительно подключаемой нагрузки. В случае необходимости – выполнить их замену.",
      condensateReturn: "Возврат конденсата не предусмотрен.",
      thermalEnergyMeters: "На вводе для каждой категории абонентов установить прибор учета тепловой энергии, оборудованный модемной связью. Системы отопления и горячего водоснабжения каждой квартиры оборудовать индивидуальными приборами учета расхода теплоты и горячей воды с возможностью дистанционного снятия показаний. Проект на установку системы учета, схему организации учета, место установки приборов учета согласовать со Службой контроля приборов учета тепловой энергии ТОО «АлТС» (тел.: 341-07-77, вн. 2140).",
      heatSupplySystem: "Открытая",
      heatSupplySystemNote: "- Предусмотреть догрев ГВС в межотопительный период \n\n- Предусмотреть тепловую изоляцию разводящих трубопроводов и стояков системы горячего водоснабжения. При присоединении распределительной гребенки индивидуальных потребителей к стояку общедомовой системы горячего водоснабжения предусмотреть установку обратного клапана",
      connectionScheme: "по зависимой схеме",
      connectionSchemeNote: "В случае применения в системе отопления трубопроводов из полимерных материалов – проектирование вести с учетом требований п. 7.1.3 СНиП РК 4.02-42-2006 «Отопление, вентиляция и кондиционирование»",
      afterControlUnitInstallation: "По завершении монтажа узла управления выполнить пуско-наладочные работы по автоматизации теплового пункта.",
      negotiation: "После предварительного согласования с ЦЭР ТОО «АлТС» проектную документацию (чертежи марки ОВ, ТС, сводный план инженерных сетей) согласовать с Техническим отделом ТОО «АлТС» (тел.: 378-07-00, вн. 1023). \n\nСогласованный проект на бумажном и электронном носителях предоставить в ТОО «АлТС».",
      technicalConditionsTerms: "нормативный период проектирования и строительства, предусмотренный в проектно-сметной документации.",
      isPerformer: (roles.indexOf('PerformerHeat') != -1),
      isHead: (roles.indexOf('HeadHeat') != -1),
      isDirector: (roles.indexOf('DirectorHeat') != -1),
      heads_responses: [],
      head_accepted: true
    };

    this.onHeatResourceChange = this.onHeatResourceChange.bind(this);
    this.onHeatTransPressureChange = this.onHeatTransPressureChange.bind(this);
    this.onHeatLoadContractNumChange = this.onHeatLoadContractNumChange.bind(this);
    this.onHeatMainInContractChange = this.onHeatMainInContractChange.bind(this);
    this.onHeatVenInContractChange = this.onHeatVenInContractChange.bind(this);
    this.onHeatWaterInContractChange = this.onHeatWaterInContractChange.bind(this);
    this.onHeatWaterMaxInContractChange = this.onHeatWaterMaxInContractChange.bind(this);
    this.onConnectionPointChange = this.onConnectionPointChange.bind(this);
    this.onAdditionChange = this.onAdditionChange.bind(this);
    this.onDocNumberChange = this.onDocNumberChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.saveResponseForm = this.saveResponseForm.bind(this);
    this.sendHeatResponse = this.sendHeatResponse.bind(this);
    this.onTwoPipePressureInTcChange = this.onTwoPipePressureInTcChange.bind(this);
    this.onTwoPipePressureInScChange = this.onTwoPipePressureInScChange.bind(this);
    this.onTwoPipePressureInRcChange = this.onTwoPipePressureInRcChange.bind(this);
    this.onFourHeatPipePressureInTcChange = this.onFourHeatPipePressureInTcChange.bind(this);
    this.onFourWaterPipePressureInTcChange = this.onFourWaterPipePressureInTcChange.bind(this);
    this.onFourHeatPipePressureInScChange = this.onFourHeatPipePressureInScChange.bind(this);
    this.onFourWaterPipePressureInScChange = this.onFourWaterPipePressureInScChange.bind(this);
    this.onFourHeatPipePressureInRcChange = this.onFourHeatPipePressureInRcChange.bind(this);
    this.onFourWaterPipePressureInRcChange = this.onFourWaterPipePressureInRcChange.bind(this);
    this.onTemperatureChartChange = this.onTemperatureChartChange.bind(this);
    this.onConnectionTermsChange = this.onConnectionTermsChange.bind(this);
    this.onHeatingNetworksDesignChange = this.onHeatingNetworksDesignChange.bind(this);
    this.onFinalHeatLoadsChange = this.onFinalHeatLoadsChange.bind(this);
    this.onHeatNetworksRelayingChange = this.onHeatNetworksRelayingChange.bind(this);
    this.onThermalEnergyMetersChange = this.onThermalEnergyMetersChange.bind(this);
    this.onHeatSupplySystemNoteChange = this.onHeatSupplySystemNoteChange.bind(this);
    this.onConnectionSchemeNoteChange = this.onConnectionSchemeNoteChange.bind(this);
    this.onAfterControlUnitInstallationChange = this.onAfterControlUnitInstallationChange.bind(this);
    this.onNegotiationChange = this.onNegotiationChange.bind(this);
    this.onTechnicalConditionsTermsChange = this.onTechnicalConditionsTermsChange.bind(this);
  }

  onHeatResourceChange(e) {
    this.setState({ heatResource: e.target.value });
  }

  onHeatTransPressureChange(e) {
    this.setState({ heatTransPressure: e.target.value });
  }

  onHeatLoadContractNumChange(e) {
    this.setState({ heatLoadContractNum: e.target.value });
  }

  onHeatMainChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["main"] = e.target.value;

    this.setState({ heatBlocks: blocks });
  }

  onHeatVenChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["ven"] = e.target.value;

    this.setState({ heatBlocks: blocks });
  }

  onHeatWaterChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["water"] = e.target.value;

    this.setState({ heatBlocks: blocks });
  }

  onHeatWaterMaxChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["waterMax"] = e.target.value;

    this.setState({ heatBlocks: blocks });
  }

  onHeatMainInContractChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["main_in_contract"] = e.target.value;

    this.setState({ heatBlocks: blocks });
  }

  onHeatVenInContractChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["ven_in_contract"] = e.target.value;

    this.setState({ heatBlocks: blocks });
  }

  onHeatWaterInContractChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["water_in_contract"] = e.target.value;

    this.setState({ heatBlocks: blocks });
  }

  onHeatWaterMaxInContractChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["water_max_in_contract"] = e.target.value;

    this.setState({ heatBlocks: blocks });
  }

  onConnectionPointChange(e) {
    this.setState({ connectionPoint: e.target.value });
  }

  onAdditionChange(e) {
    this.setState({ addition: e.target.value });
  }

  onDocNumberChange(e) {
    this.setState({ docNumber: e.target.value });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  onHeatTransporterChange(transType) {
    this.setState({ heatTransporter: transType });
  }

  onTwoPipePressureInTcChange(e) {
    this.setState({ twoPipePressureInTc: e.target.value });
  }

  onTwoPipePressureInScChange(e) {
    this.setState({ twoPipePressureInSc: e.target.value });
  }

  onTwoPipePressureInRcChange(e) {
    this.setState({ twoPipePressureInRc: e.target.value });
  }

  onFourHeatPipePressureInTcChange(e) {
    this.setState({ fourHeatPipePressureInTc: e.target.value });
  }

  onFourWaterPipePressureInTcChange(e) {
    this.setState({ fourWaterPipePressureInTc: e.target.value });
  }

  onFourHeatPipePressureInScChange(e) {
    this.setState({ fourHeatPipePressureInSc: e.target.value });
  }

  onFourWaterPipePressureInScChange(e) {
    this.setState({ fourWaterPipePressureInSc: e.target.value });
  }

  onFourHeatPipePressureInRcChange(e) {
    this.setState({ fourHeatPipePressureInRc: e.target.value });
  }

  onFourWaterPipePressureInRcChange(e) {
    this.setState({ fourWaterPipePressureInRc: e.target.value });
  }

  onTemperatureChartChange(e) {
    this.setState({ temperatureChart: e.target.value });
  }

  onConnectionTermsChange(e) {
    this.setState({ connectionTerms: e.target.value });
  }

  onHeatingNetworksDesignChange(e) {
    this.setState({ heatingNetworksDesign: e.target.value });
  }

  onFinalHeatLoadsChange(e) {
    this.setState({ finalHeatLoads: e.target.value });
  }

  onHeatNetworksRelayingChange(e) {
    this.setState({ heatNetworksRelaying: e.target.value });
  }

  onThermalEnergyMetersChange(e) {
    this.setState({ thermalEnergyMeters: e.target.value });
  }

  onHeatSupplySystemChange(supplySysType) {
    this.setState({ heatSupplySystem: supplySysType });
  }

  onHeatSupplySystemNoteChange(e) {
    this.setState({ heatSupplySystemNote: e.target.value });
  }

  onConnectionSchemeChange(scheme) {
    this.setState({ connectionScheme: scheme });
  }

  onConnectionSchemeNoteChange(e) {
    this.setState({ connectionSchemeNote: e.target.value });
  }

  onAfterControlUnitInstallationChange(e) {
    this.setState({ afterControlUnitInstallation: e.target.value });
  }

  onNegotiationChange(e) {
    this.setState({ negotiation: e.target.value });
  }

  onTechnicalConditionsTermsChange(e) {
    this.setState({ technicalConditionsTerms: e.target.value });
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  // this function to show one of the forms Accept/Decline
  toggleAcceptDecline(value) {
    this.setState({accept: value});
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    var userId = JSON.parse(sessionStorage.getItem('userId'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
        return false;
    }

    var providerName = roles[1];
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/provider/" + providerName + "/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        this.setState({apz: data});
        this.setState({showButtons: false});
        this.setState({showTechCon: false});
        this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});

        if (data.commission.apz_heat_response) {
          data.commission.apz_heat_response.response_text ? this.setState({description: data.commission.apz_heat_response.response_text}) : this.setState({description: ""});
          data.commission.apz_heat_response.connection_point ? this.setState({connectionPoint: data.commission.apz_heat_response.connection_point}) : this.setState({connectionPoint: ""});
          data.commission.apz_heat_response.resource ? this.setState({heatResource: data.commission.apz_heat_response.resource}) : this.setState({heatResource: ""});
          data.commission.apz_heat_response.trans_pressure ? this.setState({heatTransPressure: data.commission.apz_heat_response.trans_pressure}) : this.setState({heatTransPressure: ""});
          data.commission.apz_heat_response.load_contract_num ? this.setState({heatLoadContractNum: data.commission.apz_heat_response.load_contract_num}) : this.setState({heatLoadContractNum: ""});
          // data.commission.apz_heat_response.main_in_contract ? this.setState({heatMainInContract: data.commission.apz_heat_response.main_in_contract}) : this.setState({heatMainInContract: ""});
          // data.commission.apz_heat_response.ven_in_contract ? this.setState({heatVenInContract: data.commission.apz_heat_response.ven_in_contract}) : this.setState({heatVenInContract: ""});
          // data.commission.apz_heat_response.water_in_contract ? this.setState({heatWaterInContract: data.commission.apz_heat_response.water_in_contract}) : this.setState({heatWaterInContract: ""});
          // data.commission.apz_heat_response.water_in_contract_max ? this.setState({heatWaterMaxInContract: data.commission.apz_heat_response.water_in_contract_max}) : this.setState({heatWaterMaxInContract: ""});
          data.commission.apz_heat_response.addition ? this.setState({addition: data.commission.apz_heat_response.addition}) : this.setState({addition: ""});
          data.commission.apz_heat_response.transporter ? this.setState({heatTransporter: data.commission.apz_heat_response.transporter}) : this.setState({heatTransporter: "2-трубной схеме"}); 
          data.commission.apz_heat_response.two_pipe_pressure_in_tc ? this.setState({twoPipePressureInTc: data.commission.apz_heat_response.two_pipe_pressure_in_tc}) : this.setState({twoPipePressureInTc: ""});
          data.commission.apz_heat_response.two_pipe_pressure_in_sc ? this.setState({twoPipePressureInSc: data.commission.apz_heat_response.two_pipe_pressure_in_sc}) : this.setState({twoPipePressureInSc: ""});
          data.commission.apz_heat_response.two_pipe_pressure_in_rc ? this.setState({twoPipePressureInRc: data.commission.apz_heat_response.two_pipe_pressure_in_rc}) : this.setState({twoPipePressureInRc: ""});
          data.commission.apz_heat_response.heat_four_pipe_pressure_in_tc ? this.setState({ fourHeatPipePressureInTc: data.commission.apz_heat_response.heat_four_pipe_pressure_in_tc}) : this.setState({ fourHeatPipePressureInTc: ""});
          data.commission.apz_heat_response.heat_four_pipe_pressure_in_sc ? this.setState({ fourHeatPipePressureInSc: data.commission.apz_heat_response.heat_four_pipe_pressure_in_sc}) : this.setState({ fourHeatPipePressureInSc: ""});
          data.commission.apz_heat_response.heat_four_pipe_pressure_in_rc ? this.setState({ fourHeatPipePressureInRc: data.commission.apz_heat_response.heat_four_pipe_pressure_in_rc}) : this.setState({ fourHeatPipePressureInRc: ""});
          data.commission.apz_heat_response.water_four_pipe_pressure_in_tc ? this.setState({ fourWaterPipePressureInTc: data.commission.apz_heat_response.water_four_pipe_pressure_in_tc}) : this.setState({ fourWaterPipePressureInTc: ""}); 
          data.commission.apz_heat_response.water_four_pipe_pressure_in_sc ? this.setState({ fourWaterPipePressureInSc: data.commission.apz_heat_response.water_four_pipe_pressure_in_sc}) : this.setState({ fourWaterPipePressureInSc: ""});
          data.commission.apz_heat_response.water_four_pipe_pressure_in_rc ? this.setState({ fourWaterPipePressureInRc: data.commission.apz_heat_response.water_four_pipe_pressure_in_rc}) : this.setState({ fourWaterPipePressureInRc: ""});
          data.commission.apz_heat_response.temperature_chart ? this.setState({temperatureChart: data.commission.apz_heat_response.temperature_chart}) : this.setState({temperatureChart: ""});
          data.commission.apz_heat_response.reconcile_connections_with ? this.setState({reconcileConnectionsWith: data.commission.apz_heat_response.reconcile_connections_with}) : this.setState({reconcileConnectionsWith: ""});
          data.commission.apz_heat_response.connection_terms ? this.setState({connectionTerms: data.commission.apz_heat_response.connection_terms}) : this.setState({connectionTerms: ""});
          data.commission.apz_heat_response.heating_networks_design ? this.setState({heatingNetworksDesign: data.commission.apz_heat_response.heating_networks_design}) : this.setState({heatingNetworksDesign: ""});
          data.commission.apz_heat_response.final_heat_loads ? this.setState({finalHeatLoads: data.commission.apz_heat_response.final_heat_loads}) : this.setState({finalHeatLoads: ""});
          data.commission.apz_heat_response.heat_networks_relaying ? this.setState({heatNetworksRelaying: data.commission.apz_heat_response.heat_networks_relaying}) : this.setState({heatNetworksRelaying: ""});
          data.commission.apz_heat_response.condensate_return ? this.setState({condensateReturn: data.commission.apz_heat_response.condensate_return}) : this.setState({condensateReturn: ""});
          data.commission.apz_heat_response.thermal_energy_meters ? this.setState({thermalEnergyMeters: data.commission.apz_heat_response.thermal_energy_meters}) : this.setState({thermalEnergyMeters: ""});
          data.commission.apz_heat_response.heat_supply_system ? this.setState({heatSupplySystem: data.commission.apz_heat_response.heat_supply_system}) : this.setState({heatSupplySystem: ""});
          data.commission.apz_heat_response.heat_supply_system_note ? this.setState({heatSupplySystemNote: data.commission.apz_heat_response.heat_supply_system_note}) : this.setState({heatSupplySystemNote: ""});
          data.commission.apz_heat_response.connection_scheme ? this.setState({connectionScheme: data.commission.apz_heat_response.connection_scheme}) : this.setState({connectionScheme: ""});
          data.commission.apz_heat_response.connection_scheme_note ? this.setState({connectionSchemeNote: data.commission.apz_heat_response.connection_scheme_note}) : this.setState({connectionSchemeNote: ""});
          data.commission.apz_heat_response.after_control_unit_installation ? this.setState({afterControlUnitInstallation: data.commission.apz_heat_response.after_control_unit_installation}) : this.setState({afterControlUnitInstallation: ""});
          data.commission.apz_heat_response.negotiation ? this.setState({negotiation: data.commission.apz_heat_response.negotiation}) : this.setState({negotiation: ""});
          data.commission.apz_heat_response.technical_conditions_terms ? this.setState({technicalConditionsTerms: data.commission.apz_heat_response.technical_conditions_terms}) : this.setState({technicalConditionsTerms: ""});
          this.setState({docNumber: data.commission.apz_heat_response.doc_number});
          this.setState({responseId: data.commission.apz_heat_response.id});
          this.setState({response: data.commission.apz_heat_response.response});
          this.setState({accept: data.commission.apz_heat_response.response});
          this.setState({responseFile: data.commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12})[0]});
          this.setState({xmlFile: data.commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 16})[0]});
        }

        if (data.commission.apz_heat_response && data.commission.apz_heat_response.blocks) {
          var response_blocks = data.commission.apz_heat_response.blocks;
          
          for (var i = 0; i < response_blocks.length; i++) {
            var blocks = this.state.heatBlocks;
            
            blocks[i] = {
              id: response_blocks[i].block_id,
              main: response_blocks[i].main,
              ven: response_blocks[i].ven,
              water: response_blocks[i].water,
              waterMax: response_blocks[i].water_max,
              main_in_contract: response_blocks[i].main_in_contract,
              ven_in_contract: response_blocks[i].ven_in_contract,
              water_in_contract: response_blocks[i].water_in_contract,
              water_max_in_contract: response_blocks[i].water_in_contract_max
            };

            this.setState({heatBlocks: blocks});
          }
        } else if (data.apz_heat.blocks) {
          for (var i = 0; i < data.apz_heat.blocks.length; i++) {
            var blocks = this.state.heatBlocks;
            
            blocks[i] = {
              id: data.apz_heat.blocks[i].id,
              main: data.apz_heat.blocks[i].main,
              ven: data.apz_heat.blocks[i].ventilation,
              water: data.apz_heat.blocks[i].water,
              waterMax: data.apz_heat.blocks[i].water_max
            };

            this.setState({heatBlocks: blocks});
          }
        }

        this.setState({heatStatus: data.apz_heat.status});

        if (data.status_id === 5 && data.apz_heat.status === 2) { 
          this.setState({showButtons: true}); 
        }
        
        if(data.apz_heat.status === 1){
          this.setState({showTechCon: true});
        }

        if (this.state.xmlFile) {
          this.setState({isSigned: true});
        }

        this.setState({heads_responses: data.apz_provider_head_response.filter(function(obj) { return obj.role_id === 33 })});

        if (this.state.isHead && data.apz_provider_head_response.filter(function(obj) { return obj.role_id === 33 && obj.user_id === userId }).length === 0) {
          this.setState({head_accepted: false});
        }
      }
    }.bind(this)
    xhr.send();
  }

  downloadFile(id) {
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/file/download/' + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
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

  setMissedHeartbeatsLimitToMax() {
    this.missed_heartbeats_limit = this.missed_heartbeats_limit_max;
  }

  setMissedHeartbeatsLimitToMin() {
    this.missed_heartbeats_limit = this.missed_heartbeats_limit_min;
  }

  browseKeyStore(storageName, fileExtension, currentDirectory, callBack) {
    var browseKeyStore = {
      "method": "browseKeyStore",
      "args": [storageName, fileExtension, currentDirectory]
    };
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(browseKeyStore));
  }

  getKeys(storageName, storagePath, password, type, callBack) {
    var getKeys = {
      "method": "getKeys",
      "args": [storageName, storagePath, password, type]
    };
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(getKeys));
  }

  chooseFile() {
    var browseKeyStore = {
      "method": "browseKeyStore",
      "args": [this.state.storageAlias, "P12", '']
    };
    this.callback = "chooseStoragePathBack";
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(browseKeyStore));
  }

  signMessage() {
    let password = document.getElementById("inpPassword").value;
    let path = document.getElementById("storagePath").value;
    let keyType = "SIGN";
    if (path !== null && path !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
      if (password !== null && password !== "") {
        this.getKeys(this.state.storageAlias, path, password, keyType, "loadKeysBack");
      } else {
        alert("Введите пароль к хранилищу");
      }
    } else {
      alert("Не выбран хранилище!");
    }
  }

  loadKeysBack(result) {
    if (result.errorCode === "WRONG_PASSWORD") {
      alert("Неверный пароль!");
      return false;
    }

    let alias = "";
    if (result && result.result) {
      let keys = result.result.split('/n');
      if (keys && keys.length > 0) {
        let arr = keys[0].split('|');
        alias = arr[3];
        this.getTokenXml(alias);
      }
    }
    if (!alias) {
      alert('Нет ключа подписания');
    }
  }

  getTokenXml(alias) {
    let password = document.getElementById("inpPassword").value;
    let storagePath = document.getElementById("storagePath").value;
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/apz/provider/get_xml/heat/' + this.state.apz.id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      var tokenXml = xhr.responseText;

      if (storagePath !== null && storagePath !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
        if (password !== null && password !== "") {
          if (alias !== null && alias !== "") {
            if (tokenXml !== null && tokenXml !== "") {
                this.signXml(this.state.storageAlias, storagePath, alias, password, tokenXml, "signXmlBack");
            }
            else {
                alert("Нет данных для подписания!");
            }
          } else {
              alert("Вы не выбрали ключ!");
          }
        } else {
            alert("Введите пароль к хранилищу");
        }
      } else {
          alert("Не выбран хранилище!");
      }
    }.bind(this);
    xhr.send();
  }

  signXml(storageName, storagePath, alias, password, xmlToSign, callBack) {
    var signXml = {
      "method": "signXml",
      "args": [storageName, storagePath, alias, password, xmlToSign]
    };
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(signXml));
  }

  signXmlBack(result) {
    if (result['errorCode'] === "NONE") {
      let signedXml = result.result;
      var token = sessionStorage.getItem('tokenInfo');
      var data = {xml: signedXml}

      console.log("SIGNED XML ------> \n", signedXml);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + 'api/apz/provider/save_xml/heat/' + this.state.apz.id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          this.setState({ isSigned: true });
        } else {
          alert("Не удалось подписать файл");
        }
      }.bind(this);
      xhr.send(JSON.stringify(data));
    }
    else {
      if (result['errorCode'] === "WRONG_PASSWORD" && result['result'] > -1) {
        alert("Неправильный пароль! Количество оставшихся попыток: " + result['result']);
      } else if (result['errorCode'] === "WRONG_PASSWORD") {
        alert("Неправильный пароль!");
      } else {
        alert(result['errorCode']);
      }
    }
  }

  chooseStoragePathBack(rw) {
    if (rw.getErrorCode() === "NONE") {
      var storagePath = rw.getResult();
      if (storagePath !== null && storagePath !== "") {
        document.getElementById("storagePath").value = storagePath;
      }
      else {
        document.getElementById("storagePath").value = "";
      }
    } else {
      document.getElementById("storagePath").value = "";
    }
  }

  webSocketFunction() {
    this.webSocket.onopen = function (event) {
      if (this.heartbeat_interval == "") {
        this.missed_heartbeats = 0;
        this.heartbeat_interval = setInterval(this.pingLayer, 2000);
      }
      console.log("Connection opened");
    }.bind(this);

    this.webSocket.onclose = function (event) {
      if (event.wasClean) {
        console.log('connection has been closed');
      } 
      else {
        console.log('Connection error');
        this.openDialog();
      }
      console.log('Code: ' + event.code + ' Reason: ' + event.reason);
    }.bind(this);

    this.webSocket.onmessage = function (event) {
      if (event.data === this.heartbeat_msg) {
        this.missed_heartbeats = 0;
        return;
      }

      var result = JSON.parse(event.data);

      if (result != null) {
        var rw = {
          result: result['result'],
          secondResult: result['secondResult'],
          errorCode: result['errorCode'],
          getResult: function () {
            return this.result;
          },
          getSecondResult: function () {
            return this.secondResult;
          },
          getErrorCode: function () {
            return this.errorCode;
          }
        };
        
        switch (this.callback) {
          case 'chooseStoragePathBack':
            this.chooseStoragePathBack(rw);
            break;

          case 'loadKeysBack':
            this.loadKeysBack(rw);
            break;

          case 'signXmlBack':
            this.signXmlBack(rw);
            break;
          default:
            break;
        }
      }
      //console.log(event);
      this.setMissedHeartbeatsLimitToMin();
    }.bind(this);
  }

  openDialog() {
    if (window.confirm("Ошибка при подключений к прослойке. Убедитесь что программа запущена и нажмите ОК") === true) {
      window.location.reload();
    }
  }

  // this function is to save the respones form when any change is made
  saveResponseForm(apzId, status, comment){
    var token = sessionStorage.getItem('tokenInfo');
    var file = this.state.file;

    if (!file) {
      alert('Не выбран файл');
      return false;
    }

    var formData = new FormData();
    formData.append('file', file);
    formData.append('Response', status);
    formData.append('Message', comment);
    if(status === 0){
      formData.append('HeatResource', "");
      formData.append('HeatTransPressure', "");
      formData.append('HeatLoadContractNum', "");
      formData.append('HeatMainInContract', "");
      formData.append('HeatVenInContract', "");
      formData.append('HeatWaterInContract', "");
      formData.append('ConnectionPoint', "");
      formData.append('Addition', "");
      formData.append('Transporter', "");
      formData.append('Two_pipe_pressure_in_tc', "");
      formData.append('Two_pipe_pressure_in_sc', "");
      formData.append('Two_pipe_pressure_in_rc', "");
      formData.append('Heat_four_pipe_pressure_in_tc', "");
      formData.append('Heat_four_pipe_pressure_in_sc', "");
      formData.append('Heat_four_pipe_pressure_in_rc', "");
      formData.append('Water_four_pipe_pressure_in_tc', "");
      formData.append('Water_four_pipe_pressure_in_sc', "");
      formData.append('Water_four_pipe_pressure_in_rc', "");
      formData.append('Temperature_chart', "");
      formData.append('Reconcile_connections_with', "");
      formData.append('Connection_terms', "");
      formData.append('Heating_networks_design', "");
      formData.append('Final_heat_loads', "");
      formData.append('Heat_networks_relaying', "");
      formData.append('Condensate_return', "");
      formData.append('Thermal_energy_meters', "");
      formData.append('Heat_supply_system', "");
      formData.append('Heat_supply_system_note', "");
      formData.append('Connection_scheme', "");
      formData.append('Connection_scheme_note', "");
      formData.append('After_control_unit_installation', "");
      formData.append('Negotiation', "");
      formData.append('Technical_conditions_terms', "");
      formData.append('Water_in_contract_max', "");
    }
    else{
      formData.append('HeatResource', this.state.heatResource);
      formData.append('HeatTransPressure', this.state.heatTransPressure);
      formData.append('HeatLoadContractNum', this.state.heatLoadContractNum);
      // formData.append('HeatMainInContract', this.state.heatMainInContract);
      // formData.append('HeatVenInContract', this.state.heatVenInContract);
      // formData.append('HeatWaterInContract', this.state.heatWaterInContract);

      // for (var i = 0; i < this.state.heatBlocks.length; i++) {
      //   formData.append('heatBlocks[' + i + ']', JSON.stringify(this.state.heatBlocks[i]));
      // }

      formData.append('heatBlocks', JSON.stringify(this.state.heatBlocks));
      formData.append('ConnectionPoint', this.state.connectionPoint);
      formData.append('Addition', this.state.addition);
      formData.append('Transporter', this.state.heatTransporter);
      formData.append('Two_pipe_pressure_in_tc', this.state.twoPipePressureInTc);
      formData.append('Two_pipe_pressure_in_sc', this.state.twoPipePressureInSc);
      formData.append('Two_pipe_pressure_in_rc', this.state.twoPipePressureInRc);
      formData.append('Heat_four_pipe_pressure_in_tc', this.state.fourHeatPipePressureInTc);
      formData.append('Heat_four_pipe_pressure_in_sc', this.state.fourHeatPipePressureInSc);
      formData.append('Heat_four_pipe_pressure_in_rc', this.state.fourHeatPipePressureInRc);
      formData.append('Water_four_pipe_pressure_in_tc', this.state.fourWaterPipePressureInTc);
      formData.append('Water_four_pipe_pressure_in_sc', this.state.fourWaterPipePressureInSc);
      formData.append('Water_four_pipe_pressure_in_rc', this.state.fourWaterPipePressureInRc);
      formData.append('Temperature_chart', this.state.temperatureChart);
      formData.append('Reconcile_connections_with', this.state.reconcileConnectionsWith);
      formData.append('Connection_terms', this.state.connectionTerms);
      formData.append('Heating_networks_design', this.state.heatingNetworksDesign);
      formData.append('Final_heat_loads', this.state.finalHeatLoads);
      formData.append('Heat_networks_relaying', this.state.heatNetworksRelaying);
      formData.append('Condensate_return', this.state.condensateReturn);
      formData.append('Thermal_energy_meters', this.state.thermalEnergyMeters);
      formData.append('Heat_supply_system', this.state.heatSupplySystem);
      formData.append('Heat_supply_system_note', this.state.heatSupplySystemNote);
      formData.append('Connection_scheme', this.state.connectionScheme);
      formData.append('Connection_scheme_note', this.state.connectionSchemeNote);
      formData.append('After_control_unit_installation', this.state.afterControlUnitInstallation);
      formData.append('Negotiation', this.state.negotiation);
      formData.append('Technical_conditions_terms', this.state.technicalConditionsTerms);
      formData.append('Water_in_contract_max', this.state.heatWaterMaxInContract);
    }
    formData.append('DocNumber', this.state.docNumber);
    formData.append('Name', "");
    formData.append('Area', "");

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/provider/heat/" + apzId + '/save', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        this.setState({responseId: data.id});
        this.setState({response: data.response});
        this.setState({accept: data.response});
        data.response_text ? this.setState({description: data.response_text}) : this.setState({description: ""});
        this.setState({responseFile: data.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
        data.connection_point ? this.setState({connectionPoint: data.connection_point}) : this.setState({connectionPoint: ""});
        data.resource ? this.setState({heatResource: data.resource}) : this.setState({heatResource: ""});
        data.trans_pressure ? this.setState({heatTransPressure: data.trans_pressure}) : this.setState({heatTransPressure: ""});
        data.load_contract_num ? this.setState({heatLoadContractNum: data.load_contract_num}) : this.setState({heatLoadContractNum: ""});
        data.main_in_contract ? this.setState({heatMainInContract: data.main_in_contract}) : this.setState({heatMainInContract: ""});
        data.ven_in_contract ? this.setState({heatVenInContract: data.ven_in_contract}) : this.setState({heatVenInContract: ""});
        data.water_in_contract ? this.setState({heatWaterInContract: data.water_in_contract}) : this.setState({heatWaterInContract: ""});
        data.water_in_contract_max ? this.setState({heatWaterMaxInContract: data.water_in_contract_max}) : this.setState({heatWaterMaxInContract: ""});
        data.addition ? this.setState({addition: data.addition}) : this.setState({addition: ""});
        data.transporter ? this.setState({heatTransporter: data.transporter}) : this.setState({heatTransporter: "2-трубной схеме"}); 
        data.two_pipe_pressure_in_tc ? this.setState({twoPipePressureInTc: data.two_pipe_pressure_in_tc}) : this.setState({twoPipePressureInTc: ""});
        data.two_pipe_pressure_in_sc ? this.setState({twoPipePressureInSc: data.two_pipe_pressure_in_sc}) : this.setState({twoPipePressureInSc: ""});
        data.two_pipe_pressure_in_rc ? this.setState({twoPipePressureInRc: data.two_pipe_pressure_in_rc}) : this.setState({twoPipePressureInRc: ""});
        data.heat_four_pipe_pressure_in_tc ? this.setState({ fourHeatPipePressureInTc: data.heat_four_pipe_pressure_in_tc}) : this.setState({ fourHeatPipePressureInTc: ""});
        data.heat_four_pipe_pressure_in_sc ? this.setState({ fourHeatPipePressureInSc: data.heat_four_pipe_pressure_in_sc}) : this.setState({ fourHeatPipePressureInSc: ""});
        data.heat_four_pipe_pressure_in_rc ? this.setState({ fourHeatPipePressureInRc: data.heat_four_pipe_pressure_in_rc}) : this.setState({ fourHeatPipePressureInRc: ""});
        data.water_four_pipe_pressure_in_tc ? this.setState({ fourWaterPipePressureInTc: data.water_four_pipe_pressure_in_tc}) : this.setState({ fourWaterPipePressureInTc: ""}); 
        data.water_four_pipe_pressure_in_sc ? this.setState({ fourWaterPipePressureInSc: data.water_four_pipe_pressure_in_sc}) : this.setState({ fourWaterPipePressureInSc: ""});
        data.water_four_pipe_pressure_in_rc ? this.setState({ fourWaterPipePressureInRc: data.water_four_pipe_pressure_in_rc}) : this.setState({ fourWaterPipePressureInRc: ""});
        data.temperature_chart ? this.setState({temperatureChart: data.temperature_chart}) : this.setState({temperatureChart: ""});
        data.reconcile_connections_with ? this.setState({reconcileConnectionsWith: data.reconcile_connections_with}) : this.setState({reconcileConnectionsWith: ""});
        data.connection_terms ? this.setState({connectionTerms: data.connection_terms}) : this.setState({connectionTerms: ""});
        data.heating_networks_design ? this.setState({heatingNetworksDesign: data.heating_networks_design}) : this.setState({heatingNetworksDesign: ""});
        data.final_heat_loads ? this.setState({finalHeatLoads: data.final_heat_loads}) : this.setState({finalHeatLoads: ""});
        data.heat_networks_relaying ? this.setState({heatNetworksRelaying: data.heat_networks_relaying}) : this.setState({heatNetworksRelaying: ""});
        data.condensate_return ? this.setState({condensateReturn: data.condensate_return}) : this.setState({condensateReturn: ""});
        data.thermal_energy_meters ? this.setState({thermalEnergyMeters: data.thermal_energy_meters}) : this.setState({thermalEnergyMeters: ""});
        data.heat_supply_system ? this.setState({heatSupplySystem: data.heat_supply_system}) : this.setState({heatSupplySystem: ""});
        data.heat_supply_system_note ? this.setState({heatSupplySystemNote: data.heat_supply_system_note}) : this.setState({heatSupplySystemNote: ""});
        data.connection_scheme ? this.setState({connectionScheme: data.connection_scheme}) : this.setState({connectionScheme: ""});
        data.connection_scheme_note ? this.setState({connectionSchemeNote: data.connection_scheme_note}) : this.setState({connectionSchemeNote: ""});
        data.after_control_unit_installation ? this.setState({afterControlUnitInstallation: data.after_control_unit_installation}) : this.setState({afterControlUnitInstallation: ""});
        data.negotiation ? this.setState({negotiation: data.negotiation}) : this.setState({negotiation: ""});
        data.technical_conditions_terms ? this.setState({technicalConditionsTerms: data.technical_conditions_terms}) : this.setState({technicalConditionsTerms: ""});
        this.setState({docNumber: data.doc_number});
        if(this.state.callSaveFromSend){
          this.setState({callSaveFromSend: false});
          this.sendHeatResponse(apzId, status, comment);
        }
        else{
          alert("Ответ сохранен!");

          this.setState({showSignButtons: true})
        }
      }
      else if(xhr.status === 401){
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData);
  }

  // this function is to send the final response
  sendHeatResponse(apzId, status, comment) {
    if(this.state.responseId <= 0){
      this.setState({callSaveFromSend: true});
      this.saveResponseForm(apzId, status, comment);
    }
    else{
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/provider/heat/" + apzId + '/update', true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);

          if(data.response === 1) {
            alert("Заявление принято!");
            this.setState({ showButtons: false });
            this.setState({ heatStatus: 1 });
            this.setState({showTechCon: true});
          } 
          else if(data.response === 0) {
            alert("Заявление отклонено!");
            this.setState({ showButtons: false });
            this.setState({ heatStatus: 0 })
          }
        }
        else if(xhr.status === 401){
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.send();
    } 
  }

  sendHeadResponse(apzId, status, comment) {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();

    var formData = new FormData();
    formData.append('status', status);
    formData.append('comment', comment);

    xhr.open("post", window.url + "api/apz/provider/headheat/" + apzId + '/response', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        alert('Ответ успешно отправлен');
        this.setState({head_accepted: true});
      }
      else if(xhr.status === 401){
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData);
  }

  // print technical condition
  printTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/heat/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } else {
            var data = JSON.parse(xhr.responseText);
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";

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

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Тепло-" + project + formated_date + ".pdf");
          }
        } else {
          alert('Не удалось скачать файл');
        }
      }
      xhr.send();
    } else {
      console.log('Время сессии истекло.');
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

printData()
{
   var divToPrint=document.getElementById("printTable");
   var divToPrints=document.getElementById("detail_table");
   var newWin= window.open("");
   newWin.document.write(divToPrint.outerHTML + divToPrints.outerHTML);
    var elements = newWin.document.getElementsByClassName('shukichi');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
   newWin.print();
   newWin.close();
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

    if (apz.length === 0) {
      return false;
    }


    return (
      <div className="row">
          <div className="col-sm-6">
            <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>
         
            <table className="table table-bordered table-striped" id="printTable">
              <tbody>
                <tr>
                  <td style={{width: '40%'}}><b>ИД заявки</b></td>
                  <td>{apz.id}</td>
                </tr>
                <tr>
                  <td><b>Заявитель</b></td>
                  <td>{apz.applicant}</td>
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
                  <td><b>Адрес проектируемого объекта</b></td>
                  <td>
                    {apz.project_address}

                    {apz.project_address_coordinates &&
                      <a className="ml-2 pointer text-info" onClick={this.toggleMap.bind(this, true)}>Показать на карте</a>
                    }
                  </td>
                </tr>
                <tr>
                  <td><b>Кадастровый номер</b></td>
                  <td>{apz.cadastral_number}</td>
                </tr>
                <tr>
                  <td><b>Этажность</b></td>
                  <td>{apz.object_level}</td>
                </tr>
                <tr>
                  <td><b>Общая площадь</b></td>
                  <td>{apz.object_area}</td>
                </tr>
                <tr>
                  <td><b>Отапливаемая площадь</b></td>
                  <td></td>{/*apz.apz_heat.area*/}
                </tr>
                <tr>
                  <td><b>Дата заявления</b></td>
                  <td>{apz.created_at && this.toDate(apz.created_at)}</td>
                </tr>
                
                {this.state.personalIdFile &&
                  <tr className="shukichi">
                    <td><b>Уд. лич./ Реквизиты</b></td>
                    <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id)}>Скачать</a></td>
                  </tr>
                }

                {this.state.confirmedTaskFile &&
                  <tr className="shukichi">
                    <td><b>Утвержденное задание</b></td>
                    <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.confirmedTaskFile.id)}>Скачать</a></td>
                  </tr>
                }

                {this.state.titleDocumentFile &&
                  <tr className="shukichi">
                    <td><b>Правоустанавл. документ</b></td>
                    <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.titleDocumentFile.id)}>Скачать</a></td>
                  </tr>
                }
              </tbody>
            </table>
        </div>

        <div className="col-sm-6">
          <h5 className="block-title-2 mt-3 mb-3">Детали</h5>

          <table className="table table-bordered table-striped" id="detail_table">
            <tbody>
              <tr>
                <td style={{width: '40%'}}>Общая нагрузка (Гкал/ч)</td> 
                <td>{apz.apz_heat.general}</td>
              </tr>
              <tr>
                <td>Энергосб. мероприятие</td>
                <td>{apz.apz_heat.saving}</td>
              </tr>
              <tr>
                <td>Технолог. нужды(пар) (Т/ч)</td>
                <td>{apz.apz_heat.tech}</td>
              </tr>
              <tr>
                <td>Разделить нагрузку</td>
                <td>{apz.apz_heat.distribution}</td>
              </tr>
            </tbody>
          </table>

          {apz.apz_heat.blocks &&
            <div>
              {apz.apz_heat.blocks.map(function(item, index) {
                return(
                  <div key={index}>
                    {apz.apz_heat.blocks.length > 1 &&
                      <h5 className="block-title-2 mt-4 mb-3">Здание №{index + 1}</h5>
                    }
                    
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <td style={{width: '40%'}}>Отопление (Гкал/ч)</td>
                          <td>{item.main}</td>
                        </tr>
                        <tr>
                          <td>Вентиляция (Гкал/ч)</td>
                          <td>{item.ventilation}</td>
                        </tr>
                        <tr>
                          <td>Горячее водоснаб. (ср/ч)</td>
                          <td>{item.water}</td>
                        </tr>
                        <tr>
                          <td>Горячее водоснаб. (макс/ч)</td>
                          <td>{item.water_max}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              }.bind(this))}
            </div>
          }

          <button className="btn btn-raised btn-success" onClick={this.printData}>Печать</button>
        </div>

        <div className="col-sm-12">
          <div className="row" style={{margin: '16px 0'}}>
            {(this.state.isPerformer === true || this.state.responseId != 0) &&
              <div className="col-sm-6">
                <h5 className="block-title-2 mt-3 mb-3" style={{display: 'inline'}}>Ответ</h5> 
              </div>
            }
            <div className="col-sm-6">
              {this.state.showButtons && !this.state.isSigned && this.state.isPerformer &&
                <div className="btn-group" style={{float: 'right', margin: '0'}}>
                  <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.toggleAcceptDecline.bind(this, true)}>
                    Одобрить
                  </button>
                  <button className="btn btn-raised btn-danger" onClick={this.toggleAcceptDecline.bind(this, false)}>
                    Отклонить
                  </button>
                </div>
              }
            </div>
          </div>

          {(this.state.accept === true || this.state.accept === 1) && this.state.heatStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <div className="row" style={{border: 'solid 3px #46A149', padding: '15px 5px', margin: '0'}}>
              <div className="col-sm-4">
                <div className="form-group">
                  <label>Номер документа</label>
                  <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                </div>
                <div className="form-group">
                  <label>Теплоснабжение осуществляется от источников</label>
                  <input type="text" className="form-control" placeholder="" value={this.state.heatResource} onChange={this.onHeatResourceChange} />
                </div>
                <div className="form-group">
                  <label>Точка подключения</label>
                  <input type="text" className="form-control" placeholder="" value={this.state.connectionPoint} onChange={this.onConnectionPointChange} />
                </div>
                <div className="form-group">
                  <label>Давление теплоносителя в тепловой камере {this.state.connectionPoint}</label>
                  <input type="text" className="form-control" placeholder="" value={this.state.heatTransPressure} onChange={this.onHeatTransPressureChange} />
                </div>
                <div className="form-group">
                  <label>Температурный график</label>
                  <input type="text" className="form-control" placeholder="" value={this.state.temperatureChart} onChange={this.onTemperatureChartChange} />
                </div>
                <div className="form-group">
                  <label>Дополнительные условия и место подключения согласовать с</label>
                  <input type="text" className="form-control" readOnly="readonly" placeholder="" value={this.state.reconcileConnectionsWith} />
                </div>
                <div className="form-group">
                  <label>Условия подключения:</label>
                  <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.connectionTerms} onChange={this.onConnectionTermsChange} />
                </div>
                <div className="form-group">
                  <label>Проектирование тепловых сетей:</label>
                  <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.heatingNetworksDesign} onChange={this.onHeatingNetworksDesignChange} />
                </div>
                <div className="form-group">
                  <label>Окончательные тепловые нагрузки:</label>
                  <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.finalHeatLoads} onChange={this.onFinalHeatLoadsChange} />
                </div> 
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <label>Тепловые нагрузки (Гкал/ч) по договору</label>
                  <input type="text" className="form-control" placeholder="Введите номер договора" value={this.state.heatLoadContractNum} onChange={this.onHeatLoadContractNumChange} />
                </div>
                <label>Транспортировка тепловой энергии осуществляется по:</label>
                <input type="radio" name="twoPipe" value="" 
                        checked={this.state.heatTransporter === "2-трубной схеме"} 
                        onChange={this.onHeatTransporterChange.bind(this, "2-трубной схеме")} />
                <label style={{marginRight: '10px'}}>2-трубной схеме</label>
                <input type="radio" name="fourPipe" value="" 
                        checked={this.state.heatTransporter === "4-трубной схеме"} 
                        onChange={this.onHeatTransporterChange.bind(this, "4-трубной схеме")} />
                <label>4-трубной схеме</label><br /> <br />
                {this.state.heatTransporter === '2-трубной схеме' &&
                  <div className="form-group">
                    <label>Давление теплоносителя в ТК:</label>
                    <input type="text" className="form-control" placeholder="" value={this.state.twoPipePressureInTc} onChange={this.onTwoPipePressureInTcChange} />
                    <label>В подающем водоводе:</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.twoPipePressureInSc} onChange={this.onTwoPipePressureInScChange} />
                    <label>В обратном водоводе:</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.twoPipePressureInRc} onChange={this.onTwoPipePressureInRcChange} />
                  </div>
                }
                {this.state.heatTransporter === '4-трубной схеме' &&
                  <div className="form-group">
                    <div className="row">
                      <div className="col-sm-6">
                        <label>Давление теплоносителя в ТК (отопление):</label>
                        <input type="text" className="form-control" placeholder="" value={this.state.fourHeatPipePressureInTc} onChange={this.onFourHeatPipePressureInTcChange} />
                        <label>В подающем водоводе:</label>
                        <input type="number" step="any" className="form-control" placeholder="" value={this.state.fourHeatPipePressureInSc} onChange={this.onFourHeatPipePressureInScChange} />
                        <label>В обратном водоводе:</label>
                        <input type="number" step="any" className="form-control" placeholder="" value={this.state.fourHeatPipePressureInRc} onChange={this.onFourHeatPipePressureInRcChange} />
                      </div>
                      <div className="col-sm-6">
                        <label>Давление теплоносителя в ТК (ГВС):</label>
                        <input type="text" className="form-control" placeholder="" value={this.state.fourWaterPipePressureInTc} onChange={this.onFourWaterPipePressureInTcChange} />
                        <label>В подающем водоводе:</label>
                        <input type="number" step="any" className="form-control" placeholder="" value={this.state.fourWaterPipePressureInSc} onChange={this.onFourWaterPipePressureInScChange} />
                        <label>В обратном водоводе:</label>
                        <input type="number" step="any" className="form-control" placeholder="" value={this.state.fourWaterPipePressureInRc} onChange={this.onFourWaterPipePressureInRcChange} />
                      </div>
                    </div>
                  </div>
                }
                <div className="form-group">
                  <label>Возврат конденсата</label>
                  <input type="text" className="form-control" readOnly="readonly" placeholder="" value={this.state.condensateReturn} />
                </div>
                <div className="form-group">
                  <label>Приборы учета тепловой энергии:</label>
                  <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.thermalEnergyMeters} onChange={this.onThermalEnergyMetersChange} />
                </div>
                <label style={{display: 'block'}}>Система теплоснабжения:</label>
                <input type="radio" value="" 
                        checked={this.state.heatSupplySystem === "Открытая"} 
                        onChange={this.onHeatSupplySystemChange.bind(this, "Открытая")} />
                <label style={{marginRight: '10px'}}>Открытая</label>
                <input type="radio" value="" 
                        checked={this.state.heatSupplySystem === "Закрытая"} 
                        onChange={this.onHeatSupplySystemChange.bind(this, "Закрытая")} />
                <label>Закрытая</label><br /> <br />
                <div className="form-group">
                  <label>Примечание к системе теплоснабжения:</label>
                  <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.heatSupplySystemNote} onChange={this.onHeatSupplySystemNoteChange} />
                </div>
                <div className="form-group">
                  <label>Перекладка тепловых сетей:</label>
                  <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.heatNetworksRelaying} onChange={this.onHeatNetworksRelayingChange} />
                </div>
              </div>
              <div className="col-sm-4">
                <label style={{display: 'block'}}>Схема подключения:</label>
                <input type="radio" value="" 
                        checked={this.state.connectionScheme === "по зависимой схеме"} 
                        onChange={this.onConnectionSchemeChange.bind(this, "по зависимой схеме")} />
                <label style={{marginRight: '10px'}}>по зависимой схеме</label><br />
                <input type="radio" value="" 
                        checked={this.state.connectionScheme === "по независимой схеме"} 
                        onChange={this.onConnectionSchemeChange.bind(this, "по независимой схеме")} />
                <label>по независимой схеме</label><br /> <br />
                <div className="form-group">
                  <label>Примечание к схеме подключения:</label>
                  <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.connectionSchemeNote} onChange={this.onConnectionSchemeNoteChange} />
                </div>
                <div className="form-group">
                  <label>По завершении монтажа узла управления:</label>
                  <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.afterControlUnitInstallation} onChange={this.onAfterControlUnitInstallationChange} />
                </div>
                <div className="form-group">
                  <label>Согласование:</label>
                  <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.negotiation} onChange={this.onNegotiationChange} />
                </div>
                <div className="form-group">
                  <label>Срок действия технических условий:</label>
                  <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.technicalConditionsTerms} onChange={this.onTechnicalConditionsTermsChange} />
                </div>
                <div className="form-group">
                  <label>Дополнительное</label>
                  <textarea style={{border: 'solid 1px black'}} rows="5" className="form-control" value={this.state.addition} onChange={this.onAdditionChange} placeholder="Описание"></textarea>
                </div>
                {(this.state.response === true || this.state.response === 1) && this.state.responseFile &&
                  <div className="form-group">
                    <label style={{display: 'block'}}>Прикрепленный файл</label>
                    <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                      Скачать 
                    </a>
                  </div>
                }
                <div className="form-group">
                  <label htmlFor="upload_file">Прикрепить файл</label>
                  <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
                </div>

                {!this.state.xmlFile && !this.state.showSignButtons &&
                  <div className="form-group">
                    <button type="button" className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, true, "")}>
                      Сохранить
                    </button>
                  </div>
                }
              </div>

              {this.state.heatBlocks.length > 0 &&
                <div className="col-sm-12">
                  <div className="block_list">
                    {this.state.heatBlocks.map(function(item, index) {
                      return(
                        <div key={index} className="row" style={{background: '#efefef', margin: '0 0 20px', padding: '20px 0 10px'}}>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="HeatMain">Отопление<br />(Гкал/ч)</label>
                              <input type="number" step="0.1" className="form-control" value={this.state.heatBlocks[index].main} onChange={this.onHeatMainChange.bind(this, index)} />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="HeatVentilation">Вентиляция<br />(Гкал/ч)</label>
                              <input type="number" step="0.1" className="form-control" value={this.state.heatBlocks[index].ven} onChange={this.onHeatVenChange.bind(this, index)} />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="HeatWater">Горячее водоснабжение<br />(макс/ч)</label>
                              <input type="number" step="0.1" className="form-control" value={this.state.heatBlocks[index].waterMax} onChange={this.onHeatWaterMaxChange.bind(this, index)} />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="HeatWater">Горячее водоснабжение<br />(ср/ч)</label>
                              <input type="number" step="0.1" className="form-control" value={this.state.heatBlocks[index].water} onChange={this.onHeatWaterChange.bind(this, index)} />
                            </div>
                          </div>

                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="HeatMain">Отопление по договору<br />(Гкал/ч)</label>
                              <input type="number" step="0.1" className="form-control" value={this.state.heatBlocks[index].main_in_contract} onChange={this.onHeatMainInContractChange.bind(this, index)} />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="HeatVentilation">Вентиляция по договору<br />(Гкал/ч)</label>
                              <input type="number" step="0.1" className="form-control" value={this.state.heatBlocks[index].ven_in_contract} onChange={this.onHeatVenInContractChange.bind(this, index)} />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="HeatWater">Горячее водоснабжение по договору (макс/ч)</label>
                              <input type="number" step="0.1" className="form-control" value={this.state.heatBlocks[index].water_max_in_contract} onChange={this.onHeatWaterMaxInContractChange.bind(this, index)} />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="HeatWater">Горячее водоснабжение по договору (ср/ч)</label>
                              <input type="number" step="0.1" className="form-control" value={this.state.heatBlocks[index].water_in_contract} onChange={this.onHeatWaterInContractChange.bind(this, index)} />
                            </div>
                          </div>
                        </div>
                      );
                    }.bind(this))}
                  </div>
                </div>
              }
            </div>
          }

          {(this.state.accept === 1 || this.state.accept === true) && this.state.responseId != 0 && (this.state.heatStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>Источник</td> 
                    <td>{this.state.heatResource}</td>
                  </tr>
                  <tr>
                    <td>Точка подключения</td> 
                    <td>{this.state.connectionPoint}</td>
                  </tr> 
                  <tr>
                    <td>Давление теплоносителя в тепловой камере {this.state.connectionPoint}</td>
                    <td>{this.state.heatTransPressure}</td>
                  </tr>
                  <tr>
                    <td>Тепловые нагрузки по договору</td>
                    <td>{this.state.heatLoadContractNum}</td>
                  </tr>
                  <tr>
                    <td>Отопление (Гкал/ч)</td>
                    <td>{this.state.heatMainInContract}</td>
                  </tr>
                  <tr>
                    <td>Вентиляция (Гкал/ч)</td>
                    <td>{this.state.heatVenInContract}</td>
                  </tr>
                  <tr>
                    <td>Горячее водоснабжение (Гкал/ч)</td>
                    <td>{this.state.heatWaterInContract}</td>
                  </tr>
                  <tr>
                    <td>Дополнительное</td>
                    <td>{this.state.addition}</td>
                  </tr>
                  <tr>
                    <td>Номер документа</td>
                    <td>{this.state.docNumber}</td>
                  </tr>
                  {this.state.responseFile &&
                    <tr>
                      <td>Прикрепленный файл</td>
                      <td>
                        <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                          Скачать 
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>

              {apz.commission.apz_heat_response.blocks &&
                <div>
                  {apz.commission.apz_heat_response.blocks.map(function(item, index) {
                    return(
                      <div key={index}>
                        {apz.commission.apz_heat_response.blocks.length > 1 &&
                          <h5 className="block-title-2 mt-4 mb-3">Здание №{index + 1}</h5>
                        }
                        
                        <table className="table table-bordered table-striped">
                          <tbody>
                            <tr>
                              <td style={{width: '40%'}}>Отопление (Гкал/ч)</td>
                              <td>{item.main}</td>
                            </tr>
                            <tr>
                              <td>Вентиляция (Гкал/ч)</td>
                              <td>{item.ven}</td>
                            </tr>
                            <tr>
                              <td>Горячее водоснаб. (ср/ч)</td>
                              <td>{item.water}</td>
                            </tr>
                            <tr>
                              <td>Горячее водоснаб. (макс/ч)</td>
                              <td>{item.water_max}</td>
                            </tr>
                          </tbody>
                        </table>

                        <table className="table table-bordered table-striped">
                          <tbody>
                            <tr>
                              <td style={{width: '40%'}}>Отопление по договору (Гкал/ч)</td>
                              <td>{item.main_in_contract}</td>
                            </tr>
                            <tr>
                              <td>Вентиляция по договору (Гкал/ч)</td>
                              <td>{item.ven_in_contract}</td>
                            </tr>
                            <tr>
                              <td>Горячее водоснабжение по договору (ср/ч)</td>
                              <td>{item.water_in_contract}</td>
                            </tr>
                            <tr>
                              <td>Горячее водоснабжение по договору (макс/ч)</td>
                              <td>{item.water_in_contract_max}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  }.bind(this))}
                </div>
              }

              {this.state.heads_responses.length > 0 &&
                <div>
                  <h5 className="block-title-2 mt-4 mb-3">Одобрили:</h5>

                  <table className="table table-bordered table-striped">
                    <tbody>
                      <tr>
                        <th>ФИО</th>
                        <th>Дата</th>
                      </tr>
                      {this.state.heads_responses.map(function(item, index) {
                        return(
                          <tr key={index}>
                            <td width="60%">
                              {item.user.name} 
                            </td>
                            <td>{this.toDate(item.created_at)}</td>
                          </tr>
                          );
                        }.bind(this))
                      }
                    </tbody>
                  </table>
                </div>
              }

              {!this.state.head_accepted &&
                <div className={this.state.showButtons ? '' : 'invisible'}>
                  <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                    <button className="btn btn-raised btn-success" onClick={this.sendHeadResponse.bind(this, apz.id, true, "")}>
                      Одобрить
                    </button>
                  </div>
                </div>
              }

              {this.state.isDirector &&
                <div>
                  {!this.state.xmlFile && !this.state.isSigned &&
                    <div style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                      <div className="row form-group">
                        <div className="col-sm-7">
                          <input className="form-control" placeholder="Путь к ключу" type="text" id="storagePath" />
                        </div>

                        <div className="col-sm-5 p-0">
                          <button className="btn btn-outline-secondary btn-sm" type="button" onClick={this.chooseFile.bind(this)}>Выбрать файл</button>
                        </div>
                      </div>

                      <div className="form-group">
                        <input className="form-control" placeholder="Пароль" id="inpPassword" type="password" />
                      </div>

                      <div className="form-group">
                        <button className="btn btn-secondary" type="button" onClick={this.signMessage.bind(this)}>Подписать</button>
                      </div>
                    </div>
                  }

                  {this.state.heatStatus === 2 && this.state.isSigned &&
                    <div className="form-group">
                      <button type="button" className="btn btn-primary" onClick={this.sendHeatResponse.bind(this, apz.id, true, "")}>
                        Отправить
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          }

          {(this.state.accept === false || this.state.accept === 0) && this.state.heatStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <form style={{border: 'solid 3px #F55549', padding: '5px'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
               <label>Причина отклонения</label>
                <textarea rows="5" className="form-control" value={this.state.description} onChange={this.onDescriptionChange} placeholder="Описание"></textarea>
              </div>
              {(this.state.response === false || this.state.response === 0) && this.state.responseFile &&
                <div className="form-group">
                  <label style={{display: 'block'}}>Прикрепленный файл</label>
                  <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                    Скачать 
                  </a>
                </div>
              }
              <div className="form-group">
                <label htmlFor="upload_file">Прикрепить файл</label>
                <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
              </div>

              <div className="form-group">
                <button type="button" className="btn btn-secondary" onClick={this.sendHeatResponse.bind(this, apz.id, false, this.state.description)}>
                  Вернуть архитектору
                </button>
              </div>
            </form>
          }

          {(this.state.accept === 0 || this.state.accept === false) && this.state.responseId != 0 && (this.state.heatStatus === 0 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>Причина отклонения</td> 
                    <td>{this.state.description}</td>
                  </tr>
                  <tr>
                    <td>Номер документа</td>
                    <td>{this.state.docNumber}</td>
                  </tr>
                  {this.state.responseFile &&
                    <tr>
                      <td>Прикрепленный файл</td>
                      <td>
                        <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                          Скачать 
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          <div className={this.state.showTechCon ? '' : 'invisible'}>
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td><b>Сформированный ТУ</b></td>  
                  <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-sm-12">
          {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />} 

          <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>
        </div>

        <div className="col-sm-12">
          <hr />
          <Link className="btn btn-outline-secondary pull-right" to={'/providerheat/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
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

    var coordinates = this.props.coordinates;

    return (
      <div>
        <h5 className="block-title-2 mt-5 mb-3">Карта</h5>
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
                portalItem: {
                  id: "a3b89fe64c0d4b06b0e55afad63a7ab8"
                }
              });

              /*
              var heatLineSafetyZone = new FeatureLayer({
                url: 'https://gis.uaig.kz/server/rest/services/Hosted/%D0%9E%D1%85%D1%80%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B7%D0%BE%D0%BD%D0%B0_%D1%82%D0%B5%D0%BF%D0%BB%D0%BE%D1%82%D1%80%D0%B0%D1%81%D1%81%D1%8B/FeatureServer',
                outFields: ["*"],
                title: "Охранная зона теплотрассы"
              });
              map.add(heatLineSafetyZone);

              var flGosAkts = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                outFields: ["*"],
                title: "Гос акты"
              });
              map.add(flGosAkts);
              */
              
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

