import React from 'react';
import $ from 'jquery';
import Loader from 'react-loader-spinner';
import saveAs from 'file-saver';
import ShowMap from "../components/ShowMap";
import EcpSign from "../components/EcpSign";
import AllInfo from "../components/AllInfo";
import Logs from "../components/Logs";

export default class ShowApz extends React.Component {
  constructor(props) {
    super(props);

    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    this.state = {
      apz: [],
      showMap: false,
      showButtons: false,
      showSignButtons: false,
      showTechCon: false,
      file: false,
      heatResource: "",
      heatSecondResource: "",
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
      additionalFile: false,
      showMapText: 'Показать карту',
      accept: 'accept',
      callSaveFromSend: false,
      heatStatus: 2,
      xmlFile: false,
      isSigned: false,
      reconcileConnectionsWith: "ЦЭР ТОО «АлТС» (тел. 274-04-47).",
      heatTransporter: '2-трубной схеме',
      twoPipeTcName: "",
      twoPipePressureInTc: "",
      twoPipePressureInSc: "",
      twoPipePressureInRc: "",
      fourHeatPipeTcName: "",
      fourHeatPipeScName: "",
      fourHeatPipePressureInTc: "",
      fourWaterPipePressureInTc: "",
      fourHeatPipePressureInSc: "",
      fourWaterPipePressureInSc: "",
      fourHeatPipePressureInRc: "",
      fourWaterPipePressureInRc: "",
      temperatureChart: "",
      connectionTerms: "– Подключение выполнить по технологии присоединения к предызолированным трубопроводам. \n\n– Размещение зданий и сооружений Вашего объекта предусмотреть на расстоянии с учетом соблюдения охранной зоны тепловых сетей 2dy_____ мм, проложенных __________ Вашего объекта. В противном случае выполнить их вынос из-под пятна застройки с переключением существующих потребителей. Проект выноса тепловых сетей согласовать с ТОО «АлТС»",
      heatingNetworksDesign: "– Тепловые сети рекомендуем запроектировать с применением предварительно изолированных трубопроводов с устройством системы оперативного дистанционного контроля. Способ прокладки тепловых сетей определить проектом с учетом требований МСН 4.02-02-2004 «Тепловые сети». \n\n– После выполнения работ комплект исполнительной документации на бумажном носителе и в электронном исполнении, зарегистрированный в КГУ «Управление архитектуры и градостроительства г. Алматы», передать в ТОО «АлТС».",
      finalHeatLoads: "Окончательные тепловые нагрузки уточнить проектом. Договор на оказание услуг по передаче и распределению тепловой энергии будет заключен на уточненную тепловую нагрузку, соответствующую требованиям СП РК 2.04-01-2017 «Строительная климатология».",
      energyEfficiency: "В соответствии с разделом 9 СН РК 4.02-01-2011 «Отопление, вентиляция и кондиционирование» предусмотреть мероприятия для повышения энергоэффективности здания (й).",
      heatNetworksRelaying: "В связи с увеличением циркуляционного расхода выполнить перекладку тепловых сетей от ТК ___ до ТК ___ с увеличением диаметра с 2Dу___ мм на 2Dу___ мм. Реконструируемые тепловые сети в установленном порядке передать на баланс ТОО «АлТС» (если сети на балансе ТОО «АлТС»). \n\n- Выполнить поверочный расчет диаметров трубопроводов внутриплощадочных тепловых сетей с учетом дополнительно подключаемой нагрузки. В случае необходимости – выполнить их замену.",
      condensateReturn: "Возврат конденсата не предусмотрен (в случае подключения от СВК).",
      thermalEnergyMeters: "На вводе для каждой категории абонентов установить прибор учета тепловой энергии, оборудованный модемной связью. Системы отопления и горячего водоснабжения каждой квартиры оборудовать индивидуальными приборами учета расхода теплоты и горячей воды с возможностью дистанционного снятия показаний. Проект на установку системы учета, схему организации учета, место установки приборов учета предоставить в Службу контроля приборов учета тепловой энергии ТОО «АлТС» (тел.: 341-07-77, вн. 2171, 2156).",
      heatSupplySystem: "Открытая",
      heatSupplySystemNote: "- Предусмотреть догрев ГВС в межотопительный период",
      mainIncrease: '',
      mainPercentageIncrease: '',
      venIncrease: '',
      venPercentageIncrease: '',
      waterMaxIncrease: '',
      waterMaxPercentageIncrease: '',
      finalIncrease: '',
      finalPercentageIncrease: '',
      connectionScheme: "а) узел управления с автоматическим регулированием теплопотребления по зависимой схеме.\nб) узел управления с автоматическим регулированием теплопотребления по независимой схеме.",
      connectionSchemeNote: "В случае применения в системе отопления трубопроводов из полимерных материалов – проектирование вести с учетом требований п. 7.1.3 СНиП РК 4.02-42-2006 «Отопление, вентиляция и кондиционирование». По завершении монтажа узла управления выполнить пуско-наладочные работы по автоматизации теплового пункта.",
      negotiation: "После предварительного согласования с ЦЭР/СВЭР/ЮЭР ТОО «АлТС» проектную документацию (чертежи марки ОВ, ТС, сводный план инженерных сетей) согласовать с Техническим отделом ТОО «АлТС» (тел.: 378-07-00, вн. 1023). \n\nСогласованный проект на бумажном и электронном носителях предоставить в ТОО «АлТС».",
      technicalConditionsTerms: "нормативный период проектирования и строительства, предусмотренный в проектно-сметной документации.",
      isPerformer: (roles.indexOf('PerformerHeat') != -1),
      isHead: (roles.indexOf('HeadHeat') != -1),
      isDirector: (roles.indexOf('DirectorHeat') != -1),
      heads_responses: [],
      head_accepted: true,
      headComment: "",
      ty_director_id: "",
      fileDescription: "",
      heat_directors_id: [],
      customTcFile: null,
      loaderHidden:true
    };

    this.onHeatResourceChange = this.onHeatResourceChange.bind(this);
    this.onHeatSecondResourceChange = this.onHeatSecondResourceChange.bind(this);
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
    this.onCustomTcFileChange = this.onCustomTcFileChange.bind(this);
    this.saveResponseForm = this.saveResponseForm.bind(this);
    this.sendHeatResponse = this.sendHeatResponse.bind(this);
    this.onTwoPipeTcNameChange = this.onTwoPipeTcNameChange.bind(this);
    this.onTwoPipePressureInTcChange = this.onTwoPipePressureInTcChange.bind(this);
    this.onTwoPipePressureInScChange = this.onTwoPipePressureInScChange.bind(this);
    this.onTwoPipePressureInRcChange = this.onTwoPipePressureInRcChange.bind(this);
    this.onFourHeatPipeTcNameChange = this.onFourHeatPipeTcNameChange.bind(this);
    this.onFourHeatPipeScNameChange = this.onFourHeatPipeScNameChange.bind(this);
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
    this.onEnergyEfficiencyChange = this.onEnergyEfficiencyChange.bind(this);
    this.onHeatNetworksRelayingChange = this.onHeatNetworksRelayingChange.bind(this);
    this.onThermalEnergyMetersChange = this.onThermalEnergyMetersChange.bind(this);
    this.onHeatSupplySystemNoteChange = this.onHeatSupplySystemNoteChange.bind(this);
    this.onConnectionSchemeNoteChange = this.onConnectionSchemeNoteChange.bind(this);
    this.onNegotiationChange = this.onNegotiationChange.bind(this);
    this.onTechnicalConditionsTermsChange = this.onTechnicalConditionsTermsChange.bind(this);
    this.onConnectionSchemeChange = this.onConnectionSchemeChange.bind(this);
    this.onReconcileConnectionsWithChange = this.onReconcileConnectionsWithChange.bind(this);
    this.onHeadCommentChange = this.onHeadCommentChange.bind(this);
    this.onCondensateReturnChange = this.onCondensateReturnChange.bind(this);
    this.onMainIncreaseChange = this.onMainIncreaseChange.bind(this);
    this.onMainPercentageIncreaseChange = this.onMainPercentageIncreaseChange.bind(this);
    this.onVenIncreaseChange = this.onVenIncreaseChange.bind(this);
    this.onVenPercentageIncreaseChange = this.onVenPercentageIncreaseChange.bind(this);
    this.onWaterMaxIncreaseChange = this.onWaterMaxIncreaseChange.bind(this);
    this.onWaterMaxPercentageIncreaseChange = this.onWaterMaxPercentageIncreaseChange.bind(this);
    this.onFinalIncreaseChange = this.onFinalIncreaseChange.bind(this);
    this.onFinalPercentageIncreaseChange = this.onFinalPercentageIncreaseChange.bind(this);
    this.calculateIncrease = this.calculateIncrease.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onMainIncreaseChange(e) {
    this.setState({ mainIncrease: e.target.value });
  }

  onMainPercentageIncreaseChange(e) {
    this.setState({ mainPercentageIncrease: e.target.value });
  }

  onVenIncreaseChange(e) {
    this.setState({ venIncrease: e.target.value });
  }

  onVenPercentageIncreaseChange(e) {
    this.setState({ venPercentageIncrease: e.target.value });
  }

  onWaterMaxIncreaseChange(e) {
    this.setState({ waterMaxIncrease: e.target.value });
  }

  onWaterMaxPercentageIncreaseChange(e) {
    this.setState({ waterMaxPercentageIncrease: e.target.value });
  }

  onFinalIncreaseChange(e) {
    this.setState({ finalIncrease: e.target.value });
  }

  onFinalPercentageIncreaseChange(e) {
    this.setState({ finalPercentageIncrease: e.target.value });
  }

  calculateIncrease() {
    var blocks = this.state.heatBlocks;
    var main = 0;
    var ven = 0;
    var waterMax = 0;
    var total = 0;
    var contractTotal = parseInt(this.state.heatMainInContract) + parseInt(this.state.heatVenInContract) + parseInt(this.state.heatWaterMaxInContract);

    for (var i = 0; i < blocks.length; i++) {
      main += parseInt(blocks[i].main);
      ven += parseInt(blocks[i].ven);
      waterMax += parseInt(blocks[i].waterMax);
      total += parseInt(main) + parseInt(ven) + parseInt(waterMax);
    }

    this.setState({
      mainIncrease: this.state.heatMainInContract ? (parseInt(this.state.heatMainInContract) - main) : main,
      mainPercentageIncrease: this.state.heatMainInContract ? Math.floor(((parseInt(this.state.heatMainInContract) - main) / parseInt(this.state.heatMainInContract)) * 100) : 100,
      venIncrease: this.state.heatVenInContract ? (parseInt(this.state.heatVenInContract) - ven) : ven,
      venPercentageIncrease: this.state.heatVenInContract ? Math.floor(((parseInt(this.state.heatVenInContract) - ven) / parseInt(this.state.heatVenInContract)) * 100) : 100,
      waterMaxIncrease: this.state.heatWaterMaxInContract ? (parseInt(this.state.heatWaterMaxInContract) - waterMax) : waterMax,
      waterMaxPercentageIncrease: this.state.heatWaterMaxInContract ? Math.floor(((parseInt(this.state.heatWaterMaxInContract) - waterMax) / parseInt(this.state.heatWaterMaxInContract)) * 100) : 100,
      finalIncrease: parseInt(contractTotal) === 0 ? total : contractTotal - total,
      finalPercentageIncrease: Math.floor(((parseInt(contractTotal) - total) / total) * 100),
    });
  }

  componentDidMount() {
    this.props.breadCrumbs();
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    if(roles[2] == 'PerformerHeat'){
      this.getDirectors();
    }
  }

  onInputChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name] : value });
  }

  onHeatResourceChange(e) {
    this.setState({ heatResource: e.target.value });
  }

  onHeatSecondResourceChange(e) {
    this.setState({ heatSecondResource: e.target.value });
  }

  onHeatLoadContractNumChange(e) {
    this.setState({ heatLoadContractNum: e.target.value });
  }

  onHeatMainChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["main"] = e.target.value;

    this.setState({ heatBlocks: blocks }, () => {
      this.calculateIncrease();
    });
  }

  onHeatVenChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["ven"] = e.target.value;

    this.setState({ heatBlocks: blocks }, () => {
      this.calculateIncrease();
    });
  }

  onHeatWaterChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["water"] = e.target.value;

    this.setState({ heatBlocks: blocks });
  }

  onHeatWaterMaxChange(key, e) {
    var blocks = this.state.heatBlocks;
    blocks[key]["waterMax"] = e.target.value;

    this.setState({ heatBlocks: blocks }, () => {
      this.calculateIncrease();
    });
  }

  onHeatMainInContractChange(e) {
    this.setState({ heatMainInContract: e.target.value }, () => {
      this.calculateIncrease();
    });
  }

  onHeatVenInContractChange(e) {
    this.setState({ heatVenInContract: e.target.value }, () => {
      this.calculateIncrease();
    });
  }

  onHeatWaterInContractChange(e) {
    this.setState({ heatWaterInContract: e.target.value });
  }

  onHeatWaterMaxInContractChange(e) {
    this.setState({ heatWaterMaxInContract: e.target.value }, () => {
      this.calculateIncrease();
    });
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

  onTwoPipeTcNameChange(e) {
    this.setState({ twoPipeTcName: e.target.value });
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

  onFourHeatPipeTcNameChange(e) {
    this.setState({ fourHeatPipeTcName: e.target.value });
  }

  onFourHeatPipeScNameChange(e) {
    this.setState({ fourHeatPipeScName: e.target.value });
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

  onEnergyEfficiencyChange(e) {
    this.setState({ energyEfficiency: e.target.value });
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

  onConnectionSchemeChange(e) {
    this.setState({ connectionScheme: e.target.value });
  }

  onConnectionSchemeNoteChange(e) {
    this.setState({ connectionSchemeNote: e.target.value });
  }

  onNegotiationChange(e) {
    this.setState({ negotiation: e.target.value });
  }

  onTechnicalConditionsTermsChange(e) {
    this.setState({ technicalConditionsTerms: e.target.value });
  }

  onReconcileConnectionsWithChange(e) {
    this.setState({ reconcileConnectionsWith: e.target.value });
  }

  onHeadCommentChange(e) {
    this.setState({ headComment: e.target.value });
  }

  onCondensateReturnChange(e) {
    this.setState({ condensateReturn: e.target.value });
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  onCustomTcFileChange(e) {
    this.setState({ customTcFile: e.target.files[0] });
  }

  toggleAcceptDecline(value) {
    this.setState({accept: value});
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getDirectors(){
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/getheatdirectors", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        var select_directors = [];
        for (var i = 0; i < data.length; i++) {
          select_directors.push(<option value={data[i].user_id}> {data[i].last_name +' ' + data[i].first_name+' '+data[i].middle_name} </option>);
        }
        this.setState({heat_directors_id: select_directors});
        if(this.state.ty_director_id == "" || this.state.ty_director_id == " "){
            this.setState({ty_director_id: data[0].user_id});
        }
      }
    }.bind(this);
    xhr.send();
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
        this.setState({additionalFile: data.files.filter(function(obj) { return obj.category_id === 27 })[0]});

        if (data.commission.apz_heat_response) {
          data.commission.apz_heat_response.response_text ? this.setState({description: data.commission.apz_heat_response.response_text}) : this.setState({description: ""});
          data.commission.apz_heat_response.connection_point ? this.setState({connectionPoint: data.commission.apz_heat_response.connection_point}) : this.setState({connectionPoint: ""});
          data.commission.apz_heat_response.resource ? this.setState({heatResource: data.commission.apz_heat_response.resource}) : this.setState({heatResource: ""});
          data.commission.apz_heat_response.second_resource ? this.setState({heatSecondResource: data.commission.apz_heat_response.second_resource}) : this.setState({heatSecondResource: ""});
          data.commission.apz_heat_response.load_contract_num ? this.setState({heatLoadContractNum: data.commission.apz_heat_response.load_contract_num}) : this.setState({heatLoadContractNum: ""});

          data.commission.apz_heat_response.main_in_contract ? this.setState({heatMainInContract: data.commission.apz_heat_response.main_in_contract}) : this.setState({heatMainInContract: data.apz_heat.main_in_contract});
          data.commission.apz_heat_response.ven_in_contract ? this.setState({heatVenInContract: data.commission.apz_heat_response.ven_in_contract}) : this.setState({heatVenInContract: data.apz_heat.ven_in_contract});
          data.commission.apz_heat_response.water_in_contract ? this.setState({heatWaterInContract: data.commission.apz_heat_response.water_in_contract}) : this.setState({heatWaterInContract: data.apz_heat.water_in_contract});
          data.commission.apz_heat_response.water_in_contract_max ? this.setState({heatWaterMaxInContract: data.commission.apz_heat_response.water_in_contract_max}) : this.setState({heatWaterMaxInContract: data.apz_heat.water_in_contract_max});

          data.commission.apz_heat_response.main_increase ? this.setState({mainIncrease: data.commission.apz_heat_response.main_increase}) : this.setState({mainIncrease: ""});
          data.commission.apz_heat_response.main_percentage_increase ? this.setState({mainPercentageIncrease: data.commission.apz_heat_response.main_percentage_increase}) : this.setState({mainPercentageIncrease: ""});
          data.commission.apz_heat_response.ven_increase ? this.setState({venIncrease: data.commission.apz_heat_response.ven_increase}) : this.setState({venIncrease: ""});
          data.commission.apz_heat_response.ven_percentage_increase ? this.setState({venPercentageIncrease: data.commission.apz_heat_response.ven_percentage_increase}) : this.setState({venPercentageIncrease: ""});
          data.commission.apz_heat_response.water_max_increase ? this.setState({waterMaxIncrease: data.commission.apz_heat_response.water_max_increase}) : this.setState({waterMaxIncrease: ""});
          data.commission.apz_heat_response.water_max_percentage_increase ? this.setState({waterMaxPercentageIncrease: data.commission.apz_heat_response.water_max_percentage_increase}) : this.setState({waterMaxPercentageIncrease: ""});

          data.commission.apz_heat_response.final_increase ? this.setState({finalIncrease: data.commission.apz_heat_response.final_increase}) : this.setState({finalIncrease: ""});
          data.commission.apz_heat_response.final_percentage_increase ? this.setState({finalPercentageIncrease: data.commission.apz_heat_response.final_percentage_increase}) : this.setState({finalPercentageIncrease: ""});

          data.commission.apz_heat_response.addition ? this.setState({addition: data.commission.apz_heat_response.addition}) : this.setState({addition: ""});
          data.commission.apz_heat_response.transporter ? this.setState({heatTransporter: data.commission.apz_heat_response.transporter}) : this.setState({heatTransporter: "2-трубной схеме"});
          data.commission.apz_heat_response.two_pipe_pressure_in_tc ? this.setState({twoPipeTcName: data.commission.apz_heat_response.two_pipe_tc_name}) : this.setState({twoPipeTcName: ""});
          data.commission.apz_heat_response.two_pipe_pressure_in_tc ? this.setState({twoPipePressureInTc: data.commission.apz_heat_response.two_pipe_pressure_in_tc}) : this.setState({twoPipePressureInTc: ""});
          data.commission.apz_heat_response.two_pipe_pressure_in_sc ? this.setState({twoPipePressureInSc: data.commission.apz_heat_response.two_pipe_pressure_in_sc}) : this.setState({twoPipePressureInSc: ""});
          data.commission.apz_heat_response.two_pipe_pressure_in_rc ? this.setState({twoPipePressureInRc: data.commission.apz_heat_response.two_pipe_pressure_in_rc}) : this.setState({twoPipePressureInRc: ""});
          data.commission.apz_heat_response.heat_four_pipe_tc_name ? this.setState({ fourHeatPipeTcName: data.commission.apz_heat_response.heat_four_pipe_tc_name}) : this.setState({ fourHeatPipeTcName: ""});
          data.commission.apz_heat_response.heat_four_pipe_sc_name ? this.setState({ fourHeatPipeScName: data.commission.apz_heat_response.heat_four_pipe_sc_name}) : this.setState({ fourHeatPipeScName: ""});
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
          data.commission.apz_heat_response.energy_efficiency ? this.setState({energyEfficiency: data.commission.apz_heat_response.energy_efficiency}) : this.setState({energyEfficiency: ""});
          data.commission.apz_heat_response.heat_networks_relaying ? this.setState({heatNetworksRelaying: data.commission.apz_heat_response.heat_networks_relaying}) : this.setState({heatNetworksRelaying: ""});
          data.commission.apz_heat_response.condensate_return ? this.setState({condensateReturn: data.commission.apz_heat_response.condensate_return}) : this.setState({condensateReturn: ""});
          data.commission.apz_heat_response.thermal_energy_meters ? this.setState({thermalEnergyMeters: data.commission.apz_heat_response.thermal_energy_meters}) : this.setState({thermalEnergyMeters: ""});
          data.commission.apz_heat_response.heat_supply_system ? this.setState({heatSupplySystem: data.commission.apz_heat_response.heat_supply_system}) : this.setState({heatSupplySystem: ""});
          data.commission.apz_heat_response.heat_supply_system_note ? this.setState({heatSupplySystemNote: data.commission.apz_heat_response.heat_supply_system_note}) : this.setState({heatSupplySystemNote: ""});
          data.commission.apz_heat_response.connection_scheme ? this.setState({connectionScheme: data.commission.apz_heat_response.connection_scheme}) : this.setState({connectionScheme: ""});
          data.commission.apz_heat_response.connection_scheme_note ? this.setState({connectionSchemeNote: data.commission.apz_heat_response.connection_scheme_note}) : this.setState({connectionSchemeNote: ""});
          data.commission.apz_heat_response.negotiation ? this.setState({negotiation: data.commission.apz_heat_response.negotiation}) : this.setState({negotiation: ""});
          data.commission.apz_heat_response.technical_conditions_terms ? this.setState({technicalConditionsTerms: data.commission.apz_heat_response.technical_conditions_terms}) : this.setState({technicalConditionsTerms: ""});
          data.commission.apz_heat_response.heat_director_id ? this.setState({ty_director_id: data.commission.apz_heat_response.heat_director_id}) : this.setState({ty_director_id: "" });
          this.setState({docNumber: data.commission.apz_heat_response.doc_number});
          this.setState({responseId: data.commission.apz_heat_response.id});
          this.setState({response: data.commission.apz_heat_response.response});
          this.setState({responseFile: data.commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12})[0]});
          this.setState({xmlFile: data.commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 16})[0]});
          this.setState({customTcFile: data.commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 23})[0]});
          this.setState({fileDescription: data.commission.apz_heat_response.fileDescription});
          this.setState({accept: this.state.customTcFile ? 'answer' : data.commission.apz_heat_response.response ? 'accept' : 'decline'});
        } else {
          this.setState({heatMainInContract: data.apz_heat.main_in_contract ? data.apz_heat.main_in_contract : ''});
          this.setState({heatVenInContract: data.apz_heat.ven_in_contract ? data.apz_heat.ven_in_contract : ''});
          this.setState({heatWaterInContract: data.apz_heat.water_in_contract ? data.apz_heat.water_in_contract : ''});
          this.setState({heatWaterMaxInContract: data.apz_heat.water_in_contract_max ? data.apz_heat.water_in_contract_max : ''});
        }

        if (data.commission.apz_heat_response && data.commission.apz_heat_response.blocks && data.commission.apz_heat_response.blocks.length > 0) {
          var response_blocks = data.commission.apz_heat_response.blocks;

          for (var i = 0; i < response_blocks.length; i++) {
            var blocks = this.state.heatBlocks;

            blocks[i] = {
              id: response_blocks[i].block_id,
              main: response_blocks[i].main,
              ven: response_blocks[i].ven,
              water: response_blocks[i].water,
              waterMax: response_blocks[i].water_max
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

  saveResponseForm(apzId, status, comment){
    var token = sessionStorage.getItem('tokenInfo');
    var file = this.state.file;
    var customTcFile = this.state.customTcFile;

    var formData = new FormData();
    formData.append('file', file);
    formData.append('customTcFile', customTcFile);
    formData.append('fileDescription', this.state.fileDescription);
    formData.append('Response', status);
    formData.append('Message', comment);
    if(status === 0){
      formData.append('HeatResource', "");
      formData.append('HeatSecondResource', "");
      formData.append('HeatLoadContractNum', "");
      formData.append('HeatMainInContract', "");
      formData.append('HeatVenInContract', "");
      formData.append('HeatWaterInContract', "");
      formData.append('ConnectionPoint', "");
      formData.append('Addition', "");
      formData.append('Transporter', "");
      formData.append('Two_pipe_tc_name', "");
      formData.append('Two_pipe_pressure_in_tc', "");
      formData.append('Two_pipe_pressure_in_sc', "");
      formData.append('Two_pipe_pressure_in_rc', "");
      formData.append('Heat_four_pipe_tc_name', "");
      formData.append('Heat_four_pipe_sc_name', "");
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
      formData.append('Negotiation', "");
      formData.append('Technical_conditions_terms', "");
      formData.append('Water_in_contract_max', "");
    }
    else{
      formData.append('HeatResource', this.state.heatResource);
      formData.append('HeatSecondResource', this.state.heatSecondResource);
      formData.append('HeatLoadContractNum', this.state.heatLoadContractNum);
      formData.append('HeatMainInContract', this.state.heatMainInContract);
      formData.append('HeatVenInContract', this.state.heatVenInContract);
      formData.append('HeatWaterInContract', this.state.heatWaterInContract);
      formData.append('HeatWaterMaxInContract', this.state.heatWaterMaxInContract);
      formData.append('heatBlocks', JSON.stringify(this.state.heatBlocks));
      formData.append('ConnectionPoint', this.state.connectionPoint);
      formData.append('Addition', this.state.addition);
      formData.append('Transporter', this.state.heatTransporter);
      formData.append('Two_pipe_tc_name', this.state.twoPipeTcName);
      formData.append('Two_pipe_pressure_in_tc', this.state.twoPipePressureInTc);
      formData.append('Two_pipe_pressure_in_sc', this.state.twoPipePressureInSc);
      formData.append('Two_pipe_pressure_in_rc', this.state.twoPipePressureInRc);
      formData.append('Heat_four_pipe_tc_name', this.state.fourHeatPipeTcName);
      formData.append('Heat_four_pipe_sc_name', this.state.fourHeatPipeScName);
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
      formData.append('Energy_efficiency', this.state.energyEfficiency);
      formData.append('Main_increase', this.state.mainIncrease ? this.state.mainIncrease : '');
      formData.append('Main_percentage_increase', this.state.mainPercentageIncrease ? this.state.mainPercentageIncrease : '');
      formData.append('Ven_increase', this.state.venIncrease ? this.state.venIncrease : '');
      formData.append('Ven_percentage_increase', this.state.venPercentageIncrease ? this.state.venPercentageIncrease : '');
      formData.append('Water_max_increase', this.state.waterMaxIncrease ? this.state.waterMaxIncrease : '');
      formData.append('Water_max_percentage_increase', this.state.waterMaxPercentageIncrease ? this.state.waterMaxPercentageIncrease : '');
      formData.append('Final_increase', this.state.finalIncrease ? this.state.finalIncrease : '');
      formData.append('Final_percentage_increase', this.state.finalPercentageIncrease ? this.state.finalPercentageIncrease : '');
      formData.append('Heat_networks_relaying', this.state.heatNetworksRelaying);
      formData.append('Condensate_return', this.state.condensateReturn);
      formData.append('Thermal_energy_meters', this.state.thermalEnergyMeters);
      formData.append('Heat_supply_system', this.state.heatSupplySystem);
      formData.append('Heat_supply_system_note', this.state.heatSupplySystemNote);
      formData.append('Connection_scheme', this.state.connectionScheme);
      formData.append('Connection_scheme_note', this.state.connectionSchemeNote);
      formData.append('Negotiation', this.state.negotiation);
      formData.append('Technical_conditions_terms', this.state.technicalConditionsTerms);
    }
    formData.append('DocNumber', this.state.docNumber);
    formData.append('Name', "");
    formData.append('Area', "");
    formData.append('ty_director_id', this.state.ty_director_id);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/provider/heat/" + apzId + '/save', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        this.setState({responseId: data.id});
        this.setState({response: data.response});
        data.files ? this.setState({customTcFile: data.files.filter(function(obj) { return obj.category_id === 23})[0]}) : this.setState({customTcFile: null});;
        this.setState({accept: this.state.customTcFile ? 'answer' : data.response ? 'accept' : 'decline'});
        data.response_text ? this.setState({description: data.response_text}) : this.setState({description: ""});
        data.files ? this.setState({responseFile: data.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]}) : this.setState({responseFile: null});
        data.connection_point ? this.setState({connectionPoint: data.connection_point}) : this.setState({connectionPoint: ""});
        data.resource ? this.setState({heatResource: data.resource}) : this.setState({heatResource: ""});
        data.load_contract_num ? this.setState({heatLoadContractNum: data.load_contract_num}) : this.setState({heatLoadContractNum: ""});
        data.main_in_contract ? this.setState({heatMainInContract: data.main_in_contract}) : this.setState({heatMainInContract: ""});
        data.ven_in_contract ? this.setState({heatVenInContract: data.ven_in_contract}) : this.setState({heatVenInContract: ""});
        data.water_in_contract ? this.setState({heatWaterInContract: data.water_in_contract}) : this.setState({heatWaterInContract: ""});
        data.water_in_contract_max ? this.setState({heatWaterMaxInContract: data.water_in_contract_max}) : this.setState({heatWaterMaxInContract: ""});
        data.addition ? this.setState({addition: data.addition}) : this.setState({addition: ""});
        data.transporter ? this.setState({heatTransporter: data.transporter}) : this.setState({heatTransporter: "2-трубной схеме"});
        data.two_pipe_tc_name ? this.setState({twoPipeTcName: data.two_pipe_tc_name}) : this.setState({twoPipeTcName: ""});
        data.two_pipe_pressure_in_tc ? this.setState({twoPipePressureInTc: data.two_pipe_pressure_in_tc}) : this.setState({twoPipePressureInTc: ""});
        data.two_pipe_pressure_in_sc ? this.setState({twoPipePressureInSc: data.two_pipe_pressure_in_sc}) : this.setState({twoPipePressureInSc: ""});
        data.two_pipe_pressure_in_rc ? this.setState({twoPipePressureInRc: data.two_pipe_pressure_in_rc}) : this.setState({twoPipePressureInRc: ""});
        data.heat_four_pipe_tc_name ? this.setState({ fourHeatPipeTcName: data.heat_four_pipe_tc_name}) : this.setState({ fourHeatPipeTcName: ""});
        data.heat_four_pipe_sc_name ? this.setState({ fourHeatPipeScName: data.heat_four_pipe_sc_name}) : this.setState({ fourHeatPipeScName: ""});
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
        data.energy_efficiency ? this.setState({energyEfficiency: data.energy_efficiency}) : this.setState({energyEfficiency: ""});
        data.main_increase ? this.setState({mainIncrease: data.main_increase}) : this.setState({mainIncrease: ""});
        data.main_percentage_increase ? this.setState({mainPercentageIncrease: data.main_percentage_increase}) : this.setState({mainPercentageIncrease: ""});
        data.ven_increase ? this.setState({venIncrease: data.ven_increase}) : this.setState({venIncrease: ""});
        data.ven_percentage_increase ? this.setState({venPercentageIncrease: data.ven_percentage_increase}) : this.setState({venPercentageIncrease: ""});
        data.water_max_increase ? this.setState({waterMaxIncrease: data.water_max_increase}) : this.setState({waterMaxIncrease: ""});
        data.water_max_percentage_increase ? this.setState({waterMaxPercentageIncrease: data.water_max_percentage_increase}) : this.setState({waterMaxPercentageIncrease: ""});
        data.final_increase ? this.setState({finalIncrease: data.final_increase}) : this.setState({finalIncrease: ""});
        data.final_percentage_increase ? this.setState({finalPercentageIncrease: data.final_percentage_increase}) : this.setState({finalPercentageIncrease: ""});
        data.heat_networks_relaying ? this.setState({heatNetworksRelaying: data.heat_networks_relaying}) : this.setState({heatNetworksRelaying: ""});
        data.condensate_return ? this.setState({condensateReturn: data.condensate_return}) : this.setState({condensateReturn: ""});
        data.thermal_energy_meters ? this.setState({thermalEnergyMeters: data.thermal_energy_meters}) : this.setState({thermalEnergyMeters: ""});
        data.heat_supply_system ? this.setState({heatSupplySystem: data.heat_supply_system}) : this.setState({heatSupplySystem: ""});
        data.heat_supply_system_note ? this.setState({heatSupplySystemNote: data.heat_supply_system_note}) : this.setState({heatSupplySystemNote: ""});
        data.connection_scheme ? this.setState({connectionScheme: data.connection_scheme}) : this.setState({connectionScheme: ""});
        data.connection_scheme_note ? this.setState({connectionSchemeNote: data.connection_scheme_note}) : this.setState({connectionSchemeNote: ""});
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

  sendHeatResponse(apzId, status, comment) {
    if(this.state.responseId <= 0 || this.state.responseId > 0 && this.state.response != status){
      this.setState({callSaveFromSend: true});
      this.saveResponseForm(apzId, status, comment);
    }
    else{
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/provider/heat/" + apzId + '/update', true);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);

          if(data.response === 1) {
            alert("Заявление принято!");
          }
          else if(data.response === 0) {
            alert("Заявление отклонено!");
          }
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        }

        window.location.reload();
      }.bind(this);
      xhr.send(JSON.stringify({docNumber: this.state.docNumber}));
    }
  }

  sendHeadResponse(apzId, status, comment) {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();

    if (!comment) {
      alert('Заполните поле "Комментарий"');
      return false;
    }

    var formData = new FormData();
    formData.append('status', status);
    formData.append('comment', comment);

    xhr.open("post", window.url + "api/apz/provider/headheat/" + apzId + '/response', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        alert('Комментарий успешно добавлен');
        this.setState({head_accepted: true});
        this.setState({heads_responses: data.head_responses});
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
        alert(JSON.parse(xhr.responseText).message);
      }
    }.bind(this);
    xhr.send(formData);
  }

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
                setTimeout(function() {window.URL.revokeObjectURL(url);},0);
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

  handleDirectorIDChange(event){
    this.setState({ty_director_id: event.target.value});
  }

  ecpSignSuccess(){
    this.setState({ xmlFile: true });
  }

  hideSignBtns() {
    this.setState({needSign: false });
  }

  render() {
    var apz = this.state.apz;

    if (!apz || apz.length === 0) {
      return false;
    }


    return (
      <div className="row">
          <div className="col-sm-12">
            <AllInfo toggleMap={this.toggleMap.bind(this, true)} apz={this.state.apz} personalIdFile={this.state.personalIdFile} confirmedTaskFile={this.state.confirmedTaskFile} titleDocumentFile={this.state.titleDocumentFile}
            additionalFile={this.state.additionalFile} claimedCapacityJustification={this.state.claimedCapacityJustification}/>
            {apz.apz_heat.heatDistribution && apz.apz_heat.blocks &&
            <div>
              <div>Разделение нагрузки</div>
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
        </div>

        <div className="col-sm-12">
          {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} mapId={"457e32ec280d44fca272e7f8ea471bb5"} />}

          <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>
        </div>

        <div className="col-sm-12">
          {apz.commission && apz.commission.comment &&
            <div className="alert alert-info mt-3">
              {apz.commission.comment}
            </div>
          }

          {(!this.state.isHead && !this.state.isDirector) && this.state.heads_responses.length > 0 &&
            <div style={{marginBottom: '50px'}}>
              <h5 className="block-title-2 mt-4 mb-3">Комментарии:</h5>

              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <th>ФИО</th>
                    <th>Комментарий</th>
                    <th>Дата</th>
                  </tr>
                  {this.state.heads_responses.map(function(item, index) {
                    return(
                      <tr key={index}>
                        <td width="40%">
                          {item.user.name}
                        </td>
                        <td width="40%">{item.comments}</td>
                        <td>{this.toDate(item.created_at)}</td>
                      </tr>
                      );
                    }.bind(this))
                  }
                </tbody>
              </table>
            </div>
          }

          <div className="row provider_answer_top" style={{margin: '16px 0 0'}}>
            {(this.state.isPerformer === true || this.state.responseId != 0) &&
              <div className="col-sm-6 pl-0">
                <h5 className="block-title-2 mt-3 mb-3" style={{display: 'inline'}}>Ответ</h5>
              </div>
            }
            <div className="col-sm-6 pr-0">
              {this.state.showButtons && !this.state.isSigned && this.state.isPerformer &&
                <div className="btn-group" style={{float: 'right', margin: '0'}}>
                  <button className={'btn btn-raised ' + (this.state.accept === 'accept' ? 'btn-success' : 'btn-secondary')} style={{marginRight: '5px'}} onClick={this.toggleAcceptDecline.bind(this, 'accept')}>
                    Одобрить
                  </button>
                  <button className={'btn btn-raised ' + (this.state.accept === 'answer' ? 'btn-success' : 'btn-secondary')} style={{marginRight: '5px'}} onClick={this.toggleAcceptDecline.bind(this, 'answer')}>
                    Ответ
                  </button>
                  <button className={'btn btn-raised ' + (this.state.accept === 'decline' ? 'btn-danger' : 'btn-secondary')} onClick={this.toggleAcceptDecline.bind(this, 'decline')}>
                    Отклонить
                  </button>
                </div>
              }
            </div>
          </div>

          {this.state.accept === 'accept' && this.state.heatStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <div className="provider_answer_body" style={{border: 'solid 1px #46A149', padding: '20px'}}>
              <div className="row pt-0">
                <div className="col-sm-4">
                  <div className="form-group">
                    <label>Номер документа</label>
                    <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                  </div>
                  <div className="form-group">
                    <label>Теплоснабжение осуществляется от источников</label>
                    <input type="text" className="form-control" placeholder="" value={this.state.heatResource} onChange={this.onHeatResourceChange} />
                    <input type="text" className="form-control" placeholder="" value={this.state.heatSecondResource} onChange={this.onHeatSecondResourceChange} />
                  </div>
                  <div className="form-group">
                    <label>Точка подключения</label>
                    <input type="text" className="form-control" placeholder="" value={this.state.connectionPoint} onChange={this.onConnectionPointChange} />
                  </div>
                  <div className="form-group">
                    <label>Температурный график</label>
                    <input type="text" className="form-control" placeholder="" value={this.state.temperatureChart} onChange={this.onTemperatureChartChange} />
                  </div>
                  <div className="form-group">
                    <label>Дополнительные условия и место подключения согласовать с</label>
                    <select className="form-control" value={this.state.reconcileConnectionsWith} onChange={this.onReconcileConnectionsWithChange}>
                      <option>ВЭР ТОО «АлТС» (тел. 271-15-58).</option>
                      <option>ЗЭР ТОО «АлТС» (тел. 243-00-49).</option>
                      <option>ЦЭР ТОО «АлТС» (тел. 274-04-47).</option>
                      <option>СЗЭР ТОО «АлТС» (тел. 393-41-45).</option>
                      <option>СВЭР ТОО «АлТС» (тел. 252-83-70).</option>
                      <option>СЭК ТОО «АлТС» (тел. 397-38-24).</option>
                      <option>ЮЭР ТОО «АлТС» (тел. 382-54-32).</option>
                    </select>
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
                  <div className="form-group">
                    <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.energyEfficiency} onChange={this.onEnergyEfficiencyChange} />
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
                      <label>Название ТК:</label>
                      <input type="text" className="form-control" placeholder="" value={this.state.twoPipeTcName} onChange={this.onTwoPipeTcNameChange} />
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
                          <label>Название ТК:</label>
                          <input type="text" className="form-control" placeholder="" value={this.state.fourHeatPipeTcName} onChange={this.onFourHeatPipeTcNameChange} />
                          <label>В подающем водоводе:</label>
                          <input type="number" step="any" className="form-control" placeholder="" value={this.state.fourHeatPipePressureInSc} onChange={this.onFourHeatPipePressureInScChange} />
                          <label>В обратном водоводе:</label>
                          <input type="number" step="any" className="form-control" placeholder="" value={this.state.fourHeatPipePressureInRc} onChange={this.onFourHeatPipePressureInRcChange} />
                        </div>
                        <div className="col-sm-6">
                          <label>Давление теплоносителя в ТК (ГВС):</label>
                          <input type="text" className="form-control" placeholder="" value={this.state.fourWaterPipePressureInTc} onChange={this.onFourWaterPipePressureInTcChange} />
                          <label>Название ТК:</label>
                          <input type="text" className="form-control" placeholder="" value={this.state.fourHeatPipeScName} onChange={this.onFourHeatPipeScNameChange} />
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
                    <input type="text" className="form-control" placeholder="" onChange={this.onCondensateReturnChange} value={this.state.condensateReturn} />
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

                  <div className="form-group">
                    <label htmlFor="HeatMain">Отопление по договору<br />(Гкал/ч)</label>
                    <input type="number" step="any" className="form-control" value={this.state.heatMainInContract} onChange={this.onHeatMainInContractChange} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="HeatVentilation">Вентиляция по договору<br />(Гкал/ч)</label>
                    <input type="number" step="any" className="form-control" value={this.state.heatVenInContract} onChange={this.onHeatVenInContractChange} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="HeatWater">Горячее водоснабжение по договору (макс/ч)</label>
                    <input type="number" step="any" className="form-control" value={this.state.heatWaterMaxInContract} onChange={this.onHeatWaterMaxInContractChange} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="HeatWater">Горячее водоснабжение по договору (ср/ч)</label>
                    <input type="number" step="any" className="form-control" value={this.state.heatWaterInContract} onChange={this.onHeatWaterInContractChange} />
                  </div>

                  <label style={{display: 'block'}}>Схема подключения:</label>
                  <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" value={this.state.connectionScheme} onChange={this.onConnectionSchemeChange}></textarea>
                  <div className="form-group">
                    <label>Примечание к схеме подключения:</label>
                    <textarea style={{border: 'solid 1px black'}} rows='5' className="form-control" placeholder="" value={this.state.connectionSchemeNote} onChange={this.onConnectionSchemeNoteChange} />
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
                      <a className="pointer text-info" title="Скачать" data-category="6" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 6)}>
                        Скачать
                      </a>
                      <div className="progress mb-2" data-category="6" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  }
                  <div className="form-group">
                    <label htmlFor="upload_file">Прикрепить файл</label>
                    <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
                  </div>
                </div>

                <div className="col-sm-12">
                  <div style={{background: '#efefef', margin: '0 0 20px', padding: '20px 0 10px'}}>
                    <h5 className="px-3 mb-3 block-title-3">Прирост</h5>
                    <div className="row m-0 p-0">
                      <div className="col-md-4">
                        <div className="row pt-0">
                          <div className="col-sm-8 pr-0">
                            <div className="form-group">
                              <label htmlFor="HeatMain">Отопление (Гкал/ч)</label>
                              <input type="number" step="any" className="form-control" value={this.state.mainIncrease} onChange={this.onMainIncreaseChange} />
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group">
                              <label htmlFor="HeatMain">(%)</label>
                              <input type="number" step="any" className="form-control" value={this.state.mainPercentageIncrease} onChange={this.onMainPercentageIncreaseChange} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="row pt-0">
                          <div className="col-sm-8 pr-0">
                            <div className="form-group">
                              <label htmlFor="HeatMain">Вентиляция (Гкал/ч)</label>
                              <input type="number" step="any" className="form-control" value={this.state.venIncrease} onChange={this.onVenIncreaseChange} />
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group">
                              <label htmlFor="HeatMain">(%)</label>
                              <input type="number" step="any" className="form-control" value={this.state.venPercentageIncrease} onChange={this.onVenPercentageIncreaseChange} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="row pt-0">
                          <div className="col-sm-8 pr-0">
                            <div className="form-group">
                              <label htmlFor="HeatMain">ГВС макс/ч (Гкал/ч)</label>
                              <input type="number" step="any" className="form-control" value={this.state.waterMaxIncrease} onChange={this.onWaterMaxIncreaseChange} />
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group">
                              <label htmlFor="HeatMain">(%)</label>
                              <input type="number" step="any" className="form-control" value={this.state.waterMaxPercentageIncrease} onChange={this.onWaterMaxPercentageIncreaseChange} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4"></div>
                      <div className="col-sm-4">
                        <div className="row pt-0">
                          <div className="col-sm-8 pr-0">
                            <div className="form-group">
                              <label>Итоговый прирост (Гкалл/ч)</label>
                              <input type="number" step="any" className="form-control" value={this.state.finalIncrease} onChange={this.onFinalIncreaseChange} />
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="form-group">
                              <label>(%)</label>
                              <input type="number" step="any" className="form-control" value={this.state.finalPercentageIncrease} onChange={this.onFinalPercentageIncreaseChange} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4"></div>
                    </div>
                  </div>
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
                          </div>
                        );
                      }.bind(this))}
                    </div>
                  </div>
                }

                {!this.state.xmlFile &&
                  <div className="col-sm-12">
                    <div className="form-group">
                      <div style={{paddingLeft:'5px', fontSize: '18px', margin: '10px 0px'}}>
                        <b>Выберите директора:</b>
                        <select id="heat_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.ty_director_id} onChange={this.handleDirectorIDChange.bind(this)}>
                          {this.state.heat_directors_id}
                        </select>
                      </div>
                      <button type="button" style={{ marginRight: '5px' }} className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, true, "")}>
                        Сохранить
                      </button>

                      {/*<button type="button" style={{ marginRight: '5px' }} className="btn btn-secondary" onClick={this.sendHeatResponse.bind(this, apz.id, true, "")}>
                        Отправить без ЭЦП
                      </button>*/}

                      {this.state.response &&
                        <button type="button" className="btn btn-secondary" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>
                          Предварительный просмотр
                        </button>
                      }
                      <p style={{color:'#777777'}}>Сохранение перезаписывает предыдущий вариант.</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          {this.state.accept === 'accept' && this.state.responseId != 0 && (this.state.heatStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
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
                        <a className="pointer text-info" title="Скачать" data-category="7" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 7)}>
                          Скачать
                        </a>
                        <div className="progress mb-2" data-category="7" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.state.showTechCon === false && (this.state.isDirector || this.state.isHead) &&
                    <tr>
                      <td>Ответ в PDF</td>
                      <td>
                        <a className="pointer text-info" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>
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
                      </div>
                    );
                  }.bind(this))}
                </div>
              }
            </div>
          }

          {this.state.accept === 'answer' && this.state.heatStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <div className="provider_answer_body" style={{border: 'solid 1px #46A149', padding: '20px'}}>
              <div className="form-group">
                <label htmlFor="custom_tc_file">
                  Прикрепить файл

                  {this.state.customTcFile &&
                    <span style={{paddingLeft: '5px'}}>
                      (текущий файл: <a className="pointer text-info" title="Скачать" data-category="8" onClick={this.downloadFile.bind(this, this.state.customTcFile.id, 8)}>{this.state.customTcFile.name}</a>)
                      <div className="progress mb-2" data-category="8" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </span>
                  }
                </label>
                <input type="file" id="custom_tc_file" className="form-control" onChange={this.onCustomTcFileChange} />
              </div>
              <div className="form-group">
                <label htmlFor="fileDescription">Описание файла:</label>
                <input data-rh="Описание файла" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} name="fileDescription" value={this.state.fileDescription} required />
              </div>

              <div style={{paddingLeft:'5px', fontSize: '18px', margin: '10px 0px'}}>
                <b>Выберите директора:</b>
                <select id="heat_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.ty_director_id} onChange={this.handleDirectorIDChange.bind(this)}>
                  {this.state.heat_directors_id}
                </select>
              </div>
              <div className="form-group" style={{marginBottom:'5px'}}>
                {!this.state.xmlFile &&
                    <button type="button" className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, "answer", "")}>
                      Сохранить
                    </button>
                }
                <button type="button" style={{ marginLeft: '5px' }} className="btn btn-secondary" onClick={this.sendHeatResponse.bind(this, apz.id, true, "")}>
                  Отправить без ЭЦП
                </button>
              </div>
              <p style={{color:'#777777', marginBottom:'0px'}}>Если есть сканированное техническое условие. Сканированный ТУ заменяет ТУ созданный сайтом.</p>
              <p style={{color:'#777777'}}>Сохранение перезаписывает предыдущий файл.</p>
            </div>
          }

          {this.state.accept === 'answer' && this.state.responseId != 0 && (this.state.heatStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td style={{width: '20%'}}>Технические условия</td>
                  <td><a className="pointer text-info" title="Скачать" data-category="9" onClick={this.downloadFile.bind(this, this.state.customTcFile.id, 9)}>Скачать</a>
                  <div className="progress mb-2" data-category="9" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  </td>
                </tr>
                <tr><td>Описание технического условия</td><td>{this.state.fileDescription}</td></tr>
              </tbody>
            </table>
          }

          {this.state.heads_responses.length > 0 &&
            <div>
              <h5 className="block-title-2 mt-4 mb-3">Комментарии:</h5>

              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <th>ФИО</th>
                    <th>Комментарий</th>
                    <th>Дата</th>
                  </tr>
                  {this.state.heads_responses.map(function(item, index) {
                    return(
                      <tr key={index}>
                        <td width="40%">
                          {item.user.name}
                        </td>
                        <td width="40%">{item.comments}</td>
                        <td>{this.toDate(item.created_at)}</td>
                      </tr>
                      );
                    }.bind(this))
                  }
                </tbody>
              </table>
            </div>
          }

          {this.state.isHead &&
            <div className={this.state.showButtons ? '' : 'invisible'}>
              <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                <textarea style={{marginBottom: '10px'}} placeholder="Комментарий" rows="7" cols="50" className="form-control" value={this.state.headComment} onChange={this.onHeadCommentChange}></textarea>
                <button className="btn btn-raised btn-success" onClick={this.sendHeadResponse.bind(this, apz.id, true, this.state.headComment)}>
                  Отправить
                </button>
              </div>
            </div>
          }

          {this.state.isDirector && this.state.heatStatus == 2 &&
            <div>
              {!this.state.xmlFile && !this.state.isSigned && apz.status_id === 5 &&
                <EcpSign ecpSignSuccess={this.ecpSignSuccess.bind(this)} hideSignBtns={this.hideSignBtns.bind(this)} rolename="heat" apz_id={apz.id}/>
              }
            </div>
          }

          {this.state.heatStatus === 2 && this.state.isSigned && this.state.isPerformer &&
            <div style={{margin: 'auto', marginTop: '20px', display: 'table', width: '30%'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={this.sendHeatResponse.bind(this, apz.id, true, "")}>
                  Отправить инженеру
                </button>
              </div>
            </div>
          }

          {this.state.accept === 'decline' && this.state.heatStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <div className="provider_answer_body" style={{border: 'solid 1px #f44336', padding: '20px'}}>
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
                  <a className="pointer text-info" title="Скачать" data-category="10" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 10)}>
                    Скачать
                  </a>
                  <div className="progress mb-2" data-category="10" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              }
              <div className="form-group">
                <label htmlFor="upload_file">Прикрепить файл</label>
                <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
              </div>

              <div className="form-group">
                <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm">Отклонить</button>
              </div>
            </div>
          }
          <div className="modal fade" id="ReturnApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Вы уверены что хотите отколнить заявление?</h5>
                  <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-footer" style={{margin:'auto'}}>
                  <button type="button" className="btn btn-secondary" onClick={this.sendHeatResponse.bind(this, apz.id, false, this.state.description)}>
                    Да
                  </button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal" style={{marginLeft:'5px'}}>Нет</button>
                </div>
              </div>
            </div>
          </div>

          {this.state.accept === 'decline' && this.state.responseId != 0 && (this.state.heatStatus === 0 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
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
                        <a className="pointer text-info" title="Скачать" data-category="11" onClick={this.downloadFile.bind(this, this.state.responseFile.id, 11)}>
                          Скачать
                        </a>
                        <div className="progress mb-2" data-category="11" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          {!this.state.customTcFile && <div className={this.state.showTechCon ? '' : 'invisible'}>
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td style={{width: '40%'}}><b>Сформированный ТУ</b></td>
                  <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                </tr>
              </tbody>
            </table>
          </div>}
        </div>

        <Logs state_history={this.state.apz.state_history} />

        <div className="col-sm-12">
          <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
        </div>
      </div>
    )
  }
}
