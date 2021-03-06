import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import Loader from 'react-loader-spinner';
import AddHeatBlock from './AddHeatBlock';
import ReactHintFactory from 'react-hint'
const ReactHint = ReactHintFactory(React)

class AddApz extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      personalIdFile: null,
      survey: null,
      claimedCapacityJustification: null,
      applicant: '',
      applicantAddress: '',
      type: 1,
      phone: '',
      region: 'Наурызбай',
      //designer: '',
      projectName: '',
      projectAddress: '',
      projectAddressCoordinates: '',
      confirmedTaskFile: '',
      titleDocumentFile: '',
      additionalFile: '',
      objectType: 'ИЖС',
      customer: '',
      cadastralNumber: '',
      objectTerm: '',
      objectLevel: '',
      objectArea: '',
      objectRooms: '',
      electricAllowedPower: '',
      electricRequiredPower: '',
      electricityPhase: 'Однофазная',
      electricSafetyCategory: 3,
      peopleCount: 0,
      waterRequirement: '',
      waterProduction: '',
      waterDrinking: '',
      waterFireFighting: '',
      waterFireFightingIn: '',
      sewageAmount: '',
      sewageFeksal: '',
      sewageProduction: '',
      sewageToCity: '',
      heatGeneral: '',
      heatTech: '',
      heatDistribution: false,
      heatSaving: '',
      sewageClientWishes: '',
      phoneServiceNum: '',
      phoneCapacity: '',
      paymentPhotoFile: '',
      phoneSewage: '',
      phoneClientWishes: '',
      gasGeneral: '',
      gasCooking: '',
      gasHeat: '',
      gasVentilation: '',
      gasConditioner: '',
      gasWater: '',
      contractNum: '',
      heatGeneralInContract: '',
      heatTechInContract: '',
      heatMainInContract: '',
      heatVenInContract: '',
      heatWaterInContract: '',
      heatWaterMaxInContract: '',
      mainHeatMain: '',
      mainHeatVen: '',
      mainHeatWater: '',
      mainHeatWaterMax: '',
      hasHeatContract: false,
      need_electro_provider: false,
      need_water_provider: false,
      need_phone_provider: false,
      need_heat_provider: false,
      need_gas_provider: false,

      hasCoordinates: false,
      loaderHidden: true,
      blocks: [{ num: 1, heatMain: '', heatVentilation: '', heatWater: '', heatWaterMax: '' }],
      companyList: [],
      categoryFiles: [],
      first_name: '',
      last_name: '',
      middle_name: '',
      company_name: '',
      n_lamp: '',
      n_rozetka: '',
      udelnayaNorma: '',
      tempVnutri: '',
      obshayaPloshad: '',
      hasTCNumber: false,
      TCNumber: '',
      status: '',
    };

    this.saveApz = this.saveApz.bind(this);
    this.hasCoordinates = this.hasCoordinates.bind(this);
    this.deleteBlock = this.deleteBlock.bind(this);
    this.companySearch = this.companySearch.bind(this);
    this.onApplicantChange = this.onApplicantChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputChange2 = this.onInputChange2.bind(this);
    this.Calculate_teplo = this.Calculate_teplo.bind(this);
    this.onBlockChange = this.onBlockChange.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.selectFromList = this.selectFromList.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onCustomerChange = this.onCustomerChange.bind(this);
  }
  onCustomerChange(e) {
    this.setState({ customer: e.target.value });
  }
  onNameChange(e) {
    this.setState({ applicant: e.target.value });
  }
  onApplicantChange(e) {
    $('.customer_field').val(e.target.value);
  }

  onInputChange(e) {
    if (e.target.name === 'objectType') {
      this.setState({ waterFireFighting: '' });
      this.setState({ waterProduction: '' });
      this.setState({ waterDrinking: '' });
      this.setState({ waterFireFightingIn: '' });
      this.setState({ sewageAmount: '' });
      this.setState({ sewageFeksal: '' });
      this.setState({ sewageProduction: '' });
      this.setState({ sewageToCity: '' });
    }
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  }
  onInputChange2(e) {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  }

  componentDidMount() {
  }

  componentWillMount() {
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

  saveApz(publish, elem) {
    elem.preventDefault();
    alert('Успешно отправлено!')
  }

  addBlock() {
    var num = parseInt($('.block_list .col-md-12:last .block_num').html(), 10) + 1;

    this.setState({ blocks: this.state.blocks.concat([{ num: num, heatMain: '', heatVentilation: '', heatWater: '', heatWaterMax: '' }]) });
  }

  onBlockChange(e, num) {
    var blocks = this.state.blocks;
    var index = blocks.map(function (obj) { return obj.num; }).indexOf(num);

    if (index === -1) {
      return false;
    }

    const { value, name } = e.target
    blocks[index][name] = value;
    this.setState({ blocks: blocks });
  }

  onHeatContractChange(value) {
    if (!value) {
      this.setState({
        heatGeneralInContract: '',
        heatTechInContract: '',
        heatMainInContract: '',
        heatVenInContract: '',
        heatWaterInContract: '',
        heatWaterMaxInContract: '',
        contractNum: ''
      })
    }

    this.setState({ hasHeatContract: value })
  }

  onTCChange(value) {
    if (!value) {
      this.setState(
        {
          TCNumber: ''
        }
      )
    }

    this.setState({ hasTCNumber: value })
  }

  deleteBlock(num) {
    var blocks = this.state.blocks;
    var index = blocks.map(function (obj) { return obj.num; }).indexOf(num);

    if (index === -1) {
      return false;
    }

    blocks.splice(index, 1);
    this.setState({ blocks: blocks });

    $('#heatBlock_' + (num - 1) + ' .block_delete').css('display', 'block');
  }

  companySearch() {
  }

  //правила вкладки Объект/Газоснабжение
  ObjectType(e) {
    // document.getElementsByName('ObjectArea')[0].disabled = false;
  }

  ObjectArea(e) {
    if (e.target.name === 'objectArea') {
      this.setState({ objectArea: e.target.value });
    }

    if (e.target.name === 'electricAllowedPower') {
      this.setState({ electricAllowedPower: e.target.value });
    }

    if (e.target.name === 'electricRequiredPower') {
      this.setState({ electricRequiredPower: e.target.value });
    }

    //ИЖС if selected
    if (document.getElementById('ObjectType').value === 'ИЖС') {
      if (document.getElementsByName('objectArea')[0].value !== '') {
        var ObjectArea = parseInt(document.getElementsByName('objectArea')[0].value, 3);
        switch (true) {
          case (ObjectArea <= 100):
            document.getElementsByName('gasGeneral')[0].max = 6;
            break;
          case (ObjectArea >= 101) && (ObjectArea <= 500):
            document.getElementsByName('gasGeneral')[0].max = 15;
            break;
          default:
            document.getElementsByName('gasGeneral')[0].removeAttribute("max");
        }
      }

      if (document.getElementsByName('electricAllowedPower')[0].value !== '') {
        //console.log(1);
        document.getElementsByName("electricRequiredPower")[0].required = false;
        document.getElementsByName("electricityPhase")[0].required = false;
        document.getElementsByName("electricSafetyCategory")[0].required = false;
      }

      // if(document.getElementsByName('ElectricRequiredPower')[0].value !== '')
      // {
      //   var ElectricRequiredPower = parseInt(document.getElementsByName('ElectricRequiredPower')[0].value, 3);
      //   var select = document.getElementsByName('ElectricityPhase')[0];
      //   switch (true)
      //   {
      //     case (ElectricRequiredPower <= 5):
      //       document.getElementsByName('ElectricityPhase')[0].options.length = 0; //очищаем список
      //       select.options[select.options.length] = new Option('Однофазная', 'Однофазная');
      //       select.options[select.options.length] = new Option('Двухфазная', 'Двухфазная');
      //       break;
      //     case (ElectricRequiredPower >= 6):
      //       document.getElementsByName('ElectricityPhase')[0].options.length = 0;
      //       select.options[select.options.length] = new Option('Трехфазная', 'Трехфазная');
      //       select.options[select.options.length] = new Option('Постоянная', 'Постоянная');
      //       select.options[select.options.length] = new Option('Временная', 'Временная');
      //       select.options[select.options.length] = new Option('Сезонная', 'Сезонная');
      //       break;
      //     default:
      //       break;
      //   }
      // }

    }
    if (document.getElementById('ObjectType').value === 'МЖК') //МЖК
    {
      //rules
    }
    if (document.getElementById('ObjectType').value === 'Общественное задание') //Общественное задание
    {
      //rules
    }
    if (document.getElementById('ObjectType').value === 'Производственное задание') //Производственное задание
    {
      //rules
    }
    if (document.getElementById('ObjectType').value === 'Реконструкция ') //Реконструкция
    {
      //rules
    }
    if (document.getElementById('ObjectType').value === 'КомБыт') {
      //rules
    }
    if (document.getElementById('ObjectType').value === 'ПромПред') {
      //rules
    }
  }

  //правила вкладки Водоснабжение
  PeopleCount(e) {
    this.setState({ waterRequirement: parseFloat("0.19" * e.target.value) });
    this.setState({ peopleCount: e.target.value });
  }

  downloadFile(id, progbarId = null) {
    alert('Сервис не доступен.')
  }

  uploadFile(category, e) {
    alert('Сервис не доступен.')
  }

  selectFromList(category, e) {
    alert('Сервис не доступен.')
  }

  selectFile(e) {
    alert('Сервис не доступен.')
  }

  Calculate_lamp(e) {
    console.log(this.state.n_rozetka);
    this.setState({ n_lamp: e.target.value });
    if (this.state.n_rozetka !== '' && this.state.n_rozetka !== ' ') {
      var srp = e.target.value * 0.06 + this.state.n_rozetka * 0.6
      this.setState({ electricRequiredPower: srp });
    }
  }
  Calculate_rozetka(e) {
    this.setState({ n_rozetka: e.target.value });
    if (this.state.n_lamp !== '' && this.state.n_lamp !== ' ') {
      var srp = e.target.value * 0.6 + this.state.n_lamp * 0.06
      this.setState({ electricRequiredPower: srp });
    }
  }
  Calculate_teplo(e) {
    const { value, name } = e.target;
    this.setState({ [name]: value });
    var heatGeneral
    switch (name) {
      case 'udelnayaNorma':
        if (this.state.tempVnutri !== '' && this.state.tempVnutri !== ' ' && this.state.obshayaPloshad !== '' && this.state.obshayaPloshad !== ' ') {
          heatGeneral = value * this.state.obshayaPloshad / 1.163 * (this.state.tempVnutri + 25) / (this.state.tempVnutri + 20.1) / 1000000;
          this.setState({ heatGeneral: Math.round(heatGeneral * 1000) / 1000 });
        }
        break;
      case 'tempVnutri':
        if (this.state.udelnayaNorma !== '' && this.state.udelnayaNorma !== ' ' && this.state.obshayaPloshad !== '' && this.state.obshayaPloshad !== ' ') {
          heatGeneral = this.state.udelnayaNorma * this.state.obshayaPloshad / 1.163 * (value + 25) / (value + 20.1) / 1000000;
          this.setState({ heatGeneral: Math.round(heatGeneral * 1000) / 1000 });
        }
        break;
      case 'obshayaPloshad':
        if (this.state.tempVnutri !== '' && this.state.tempVnutri !== ' ' && this.state.udelnayaNorma !== '' && this.state.udelnayaNorma !== ' ') {
          heatGeneral = this.state.udelnayaNorma * value / 1.163 * (this.state.tempVnutri + 25) / (this.state.tempVnutri + 20.1) / 1000000;
          this.setState({ heatGeneral: Math.round(heatGeneral * 1000) / 1000 });
        }
        break;
      default:
    }
  }

  onRenderContent = (target, content) => {
    const { customId } = target.dataset;
    if (customId === 1) {
      return <div className="react-hint__content">
        <table><thead><tr><td>Жилище</td><td>Количество ламп</td></tr></thead><tbody>
          <tr><td>Общежитие 1 комн.</td><td>1 лампа</td></tr>
          <tr><td>1-комнатное</td><td>4 лампа</td></tr>
          <tr><td>2-комнатное</td><td>6 лампы</td></tr>
          <tr><td>3-комнатное</td><td>7 ламп</td></tr>
          <tr><td>4-комнатное</td><td>8 ламп</td></tr>
          <tr><td>5-комнатное</td><td>9 ламп</td></tr>
          <tr><td>6-комнатное</td><td>11 ламп</td></tr>
          <tr><td>x комнат</td><td>x+5</td></tr></tbody></table>
      </div>
    } else {
      return <div className="react-hint__content">
        <div className="row">
          <div className="col-md-12">
            <table style={{ border: '1px solid #ced4da', borderRadius: '5px', display: 'inline-block' }}><tbody>
              <tr style={{ background: 'rgba(0, 0, 255, 0.05)', borderBottom: '1pt solid #ced4da' }}><td colSpan={2}>Для зданий строительства после 2015 г.</td></tr>
              <tr style={{ background: 'rgba(0, 255, 0, 0.05)', borderBottom: '1pt solid #ced4da' }}><td>Этажность жилой<br />постройки</td><td>Вт в час на 1 м<sup>2</sup><br /> общей площади(q<sub>уд</sub>)</td></tr>
              <tr style={{ background: 'rgba(0, 0, 255, 0.05)' }}><td>1-3 этажные одноквартирные<br />отдельностоящие</td><td>67</td></tr>
              <tr style={{ background: 'rgba(0, 255, 0, 0.05)' }}><td>2-3 этажные одноквартирные<br />облокированные</td><td>55</td></tr>
              <tr style={{ background: 'rgba(0, 0, 255, 0.05)' }}><td>4-6 этажные кирпичные</td><td>45</td></tr>
              <tr style={{ background: 'rgba(0, 255, 0, 0.05)' }}><td>7-10 этажные</td><td>40</td></tr>
              <tr style={{ background: 'rgba(0, 0, 255, 0.05)' }}><td>11-14 этажные</td><td>37</td></tr>
              <tr style={{ background: 'rgba(0, 255, 0, 0.05)' }}><td>Более 15 этажей</td><td>36</td></tr></tbody></table>
          </div>
        </div>
      </div>
    }
  }

  render() {
    return (
      <div className="container" id="apzFormDiv">
        <ReactHint autoPosition events delay={100} />
        <ReactHint attribute="data-custom" events onRenderContent={this.onRenderContent} ref={(ref) => this.instance = ref} delay={100} />
        {this.state.loaderHidden &&
          <div className="tab-pane">
            <div className="row">
              <div className="col-4">
                <div className="nav flex-column nav-pills container-fluid" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <a className="nav-link" style={{ cursor: "pointer", color: "#007bff" }} data-toggle="modal" data-target=".documents-modal-lg" role="tab" aria-selected="false">Примечание<span id="tabIcon"></span></a>
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
                    <form id="tab0-form" data-tab="0" onSubmit={this.saveApz.bind(this, false)}>
                      <div className="row">
                        <div className="col-md-7">
                          <div className="form-group">
                            <label htmlFor="Region">Вид пакета:</label>
                            <div className="custom-control custom-radio">
                              <input type="radio" className="custom-control-input" name="type" value="1" id={'apztype1'}
                                checked={this.state.type == 1 ? true : false} onChange={this.onInputChange2} />
                              <label htmlFor={"apztype1"} className="custom-control-label" style={{ cursor: "pointer" }}>Пакет 1
                                <br />
                                <span className="help-block text-muted">(архитектурно-планировочное задание, технические условия)</span></label>
                            </div>
                            <hr />
                            <div className="custom-control custom-radio">
                              <input type="radio" className="custom-control-input" name="type" value="2" id={'apztype2'}
                                checked={this.state.type == 2 ? true : false} onChange={this.onInputChange2} />
                              <label htmlFor="apztype2" className="custom-control-label" style={{ cursor: "pointer" }}>Пакет 2
                                <br />
                                <span className="help-block text-muted">(архитектурно-планировочное задание, вертикальные планировочные отметки,
                                  выкопировку из проекта детальной планировки, типовые поперечные
                                  профили дорог и улиц, технические условия, схемы трасс наружных инженерных
                                  сетей)</span></label>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="Applicant">Заявитель:</label>
                            <input data-rh="Заявитель" data-rh-at="right" type="text" className="form-control" onChange={this.onNameChange} name="applicant" value={this.state.applicant = this.state.company_name === ' ' ? this.state.last_name + " " + this.state.first_name + " " + this.state.middle_name : this.state.company_name} required />
                            {/*<span className="help-block"></span>*/}
                          </div>
                          <div className="form-group">
                            <label htmlFor="applicantAddress">Адрес жительства:</label>
                            <input data-rh="Адрес жительства" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} name="applicantAddress" value={this.state.applicantAddress} required />
                          </div>
                          <div className="form-group">
                            <label htmlFor="Phone">Телефон</label>
                            <input data-rh="Телефон" data-rh-at="right" type="tel" className="form-control" onChange={this.onInputChange} value={this.state.phone} name="phone" placeholder="8 (7xx) xxx xx xx" />
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
                          {/*<div className="form-group">
                              <label htmlFor="Address">Адрес:</label>
                              <input type="text" className="form-control" required id="ApzAddressForm" name="Address" placeholder="ул. Абая, д.25" />
                            </div>*/}
                          {/*<div className="form-group">
                              <label htmlFor="Designer">Проектировщик №ГСЛ, категория</label>
                              <input data-rh="Проектировщик №ГСЛ, категория" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.designer} name="designer" />
                            </div>*/}
                          <div className="form-group">
                            <label htmlFor="ProjectName">Наименование проектируемого объекта</label>
                            <input data-rh="Наименование проектируемого объекта" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.projectName} id="ProjectName" name="projectName" />
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="form-group">
                            <label>Утвержденное задание на проектирование</label>
                            <div className="file_container">
                              <div className="progress mb-2" data-category="9" style={{ height: '20px', display: 'none' }}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '0%' }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>

                              {this.state.confirmedTaskFile &&
                                <div className="file_block mb-2">
                                  <div>
                                    {this.state.confirmedTaskFile.name}
                                    <a className="pointer" onClick={(e) => this.setState({ confirmedTaskFile: false })}>×</a>
                                  </div>
                                </div>
                              }

                              <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                <label htmlFor="ConfirmedTaskFile" className="btn btn-success btn-sm" style={{ marginRight: '2px' }}>Загрузить</label>
                                <input type="file" id="ConfirmedTaskFile" name="ConfirmedTaskFile" className="form-control" onChange={this.uploadFile.bind(this, 9)} style={{ display: 'none' }} />
                                <label onClick={this.selectFromList.bind(this, 9)} className="btn btn-info btn-sm">Выбрать из списка</label>
                              </div>
                              <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Госакт и правоустанавливающий документ на земельный участок, договор о купли-продажи</label>
                            <div className="file_container">
                              <div className="progress mb-2" data-category="10" style={{ height: '20px', display: 'none' }}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '0%' }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>

                              {this.state.titleDocumentFile &&
                                <div className="file_block mb-2">
                                  <div>
                                    {this.state.titleDocumentFile.name}
                                    <a className="pointer" onClick={(e) => this.setState({ titleDocumentFile: false })}>×</a>
                                  </div>
                                </div>
                              }

                              <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                <label htmlFor="TitleDocumentFile" className="btn btn-success btn-sm" style={{ marginRight: '2px' }}>Загрузить</label>
                                <input type="file" id="TitleDocumentFile" name="TitleDocumentFile" className="form-control" onChange={this.uploadFile.bind(this, 10)} style={{ display: 'none' }} />
                                <label onClick={this.selectFromList.bind(this, 10)} className="btn btn-info btn-sm">Выбрать из списка</label>
                              </div>
                              <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Дополнительно (нотариальное согласие долевика, распоряжение с акимата на временное пользование)</label>
                            <div className="file_container">
                              <div className="progress mb-2" data-category="27" style={{ height: '20px', display: 'none' }}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '0%' }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>

                              {this.state.additionalFile &&
                                <div className="file_block mb-2">
                                  <div>
                                    {this.state.additionalFile.name}
                                    <a className="pointer" onClick={(e) => this.setState({ additionalFile: false })}>×</a>
                                  </div>
                                </div>
                              }

                              <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                <label htmlFor="AdditionalFile" className="btn btn-success btn-sm" style={{ marginRight: '2px' }}>Загрузить</label>
                                <input type="file" id="AdditionalFile" name="AdditionalFile" className="form-control" onChange={this.uploadFile.bind(this, 27)} style={{ display: 'none' }} />
                                <label onClick={this.selectFromList.bind(this, 27)} className="btn btn-info btn-sm">Выбрать из списка</label>
                              </div>
                              <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                            </div>
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

                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                  </div>
                  <div className="tab-pane fade" id="tab1" role="tabpanel" aria-labelledby="tab1-link">
                    <form id="tab1-form" data-tab="1" onSubmit={this.saveApz.bind(this, false)}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="ObjectType">Тип объекта</label>
                            <select required className="form-control" name="objectType" id="ObjectType" onChange={this.onInputChange} value={this.state.objectType}>
                              <option value="null" disabled>Выберите тип объекта</option>
                              <option>ИЖС</option>
                              <option>МЖК</option>
                              <option>ЛПХ</option>
                              <option>КомБыт</option>
                              <option>ПромПред</option>
                            </select>
                          </div>
                          {/*<div className="form-group">
                              <label htmlFor="ObjectClient">Заказчик</label>
                              <input type="text" required className="form-control" name="ObjectClient" placeholder="" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="ObjectName">Наименование объекта:</label>
                              <input type="text" required className="form-control" name="ObjectName" placeholder="наименование" />
                            </div>*/}
                          <div className="form-group">
                            <label htmlFor="Customer">Заказчик</label>
                            <input data-rh="Заказчик" data-rh-at="right" type="text" required onChange={this.onCustomerChange} value={this.state.customer = this.state.company_name === ' ' ? this.state.last_name + " " + this.state.first_name + " " + this.state.middle_name : this.state.company_name} className="form-control customer_field" name="customer" placeholder="ФИО / Наименование компании" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="CadastralNumber">Кадастровый номер:</label>
                            <div className="row coordinates_block pt-0">
                              <div className="col-sm-7">
                                <input data-rh="Кадастровый номер:" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.cadastralNumber} name="cadastralNumber" placeholder="" />
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="ProjectAddress">Адрес проектируемого объекта</label>
                            <input data-rh="Адрес проектируемого объекта" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.projectAddress} name="projectAddress" />
                            <input type="hidden" onChange={this.onInputChange} value={this.state.projectAddressCoordinates} id="ProjectAddressCoordinates" name="projectAddressCoordinates" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="ObjectTerm">Срок строительства по нормам</label>
                            <input data-rh="Срок строительства по нормам" data-rh-at="right" type="text" name="objectTerm" onChange={this.onInputChange} value={this.state.objectTerm} className="form-control" id="ObjectTerm" placeholder="" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="ObjectLevel">Этажность</label>
                            <input data-rh="Этажность" data-rh-at="right" type="number" className="form-control" onChange={this.onInputChange} value={this.state.objectLevel} name="objectLevel" placeholder="" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="ObjectArea">Площадь здания (кв.м)</label>
                            <input data-rh="Площадь здания (кв.м)" data-rh-at="right" type="number" step="any" className="form-control" name="objectArea" onChange={this.ObjectArea.bind(this)} value={this.state.objectArea} />
                          </div>
                          <div className="form-group">
                            <label htmlFor="ObjectRooms">Количество квартир (номеров, кабинетов)</label>
                            <input data-rh="Количество квартир (номеров, кабинетов)" data-rh-at="right" type="number" className="form-control" onChange={this.onInputChange} value={this.state.objectRooms} name="objectRooms" />
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
                      <div className="col-md-12">
                        <div style={{ color: '#D8A82D !important' }}>
                          <label><input type="checkbox" onChange={this.onInputChange} checked={this.state.need_electro_provider} name="need_electro_provider" /> Подать заявление на выдачу технического условия электроснабжения</label>
                        </div>
                        <hr style={{ marginTop: '5px' }} />
                      </div>
                      {this.state.need_electro_provider &&
                        <div className="row">
                          <div className="col-md-6 offset-6">
                            <div className="form-group">
                              <label>Уд.личности/Реквизиты</label>
                              <div className="file_container">
                                <div className="progress mb-2" data-category="3" style={{ height: '20px', display: 'none' }}>
                                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '0%' }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>

                                {this.state.personalIdFile &&
                                  <div className="file_block mb-2">
                                    <div>
                                      {this.state.personalIdFile.name}
                                      <a className="pointer" onClick={(e) => this.setState({ personalIdFile: false })}>×</a>
                                    </div>
                                  </div>
                                }

                                <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                  <label htmlFor="PersonalIdFile" className="btn btn-success btn-sm" style={{ marginRight: '2px' }}>Загрузить</label>
                                  <input type="file" id="PersonalIdFile" name="PersonalIdFile" className="form-control" onChange={this.uploadFile.bind(this, 3)} style={{ display: 'none' }} />
                                  <label onClick={this.selectFromList.bind(this, 3)} className="btn btn-info btn-sm">Выбрать из списка</label>
                                </div>
                                <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div style={{ borderRadius: '10px', background: 'rgb(239, 239, 239)', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px' }}>
                              <div className="text-center" style={{ fontSize: '15px' }}>
                                <p>Расчет по типовым правилам расчета норм потребления коммунальных услуг по электроснабжению(<a rel="noopener noreferrer" target="_blank" href="http://online.zakon.kz/m/Document/?doc_id=31676321">см. Приказ</a>)</p>
                              </div><hr />
                              <div className="form-group">
                                <label>Количество ламп <img data-custom data-custom-at="bottom" data-custom-id="1" src="./images/info.png" width="20px"
                                  style={{ borderRadius: '10px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }} alt="" /></label>
                                <input data-rh="Количество ламп" data-rh-at="right" type="number" step="any" className="form-control" onChange={this.Calculate_lamp.bind(this)} value={this.state.n_lamp} name="electricRequiredPower" placeholder="" />
                              </div>
                              <div className="form-group">
                                <label>Количество розеток</label>
                                <input data-rh="Количество розеток" data-rh-at="right" type="number" step="any" className="form-control" onChange={this.Calculate_rozetka.bind(this)} value={this.state.n_rozetka} name="electricRequiredPower" placeholder="" />
                              </div><hr />
                              <div className="form-group">
                                <label htmlFor="ElectricRequiredPower">Требуемая мощность (кВт)</label>
                                {/*<input data-rh="Требуемая мощность (кВт)" data-rh-at="right" type="number" step="any" className="form-control" onChange={this.ObjectArea.bind(this)} value={this.state.electricRequiredPower} name="electricRequiredPower" placeholder="" />*/}
                                <input data-rh="Требуемая мощность (кВт)" data-rh-at="right" type="number" step="any" className="form-control" onChange={this.ObjectArea.bind(this)} value={this.state.electricRequiredPower} name="electricRequiredPower" placeholder="" />
                              </div>
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
                            </div>
                            <div className="form-group">
                              <label htmlFor="ElectricMaxLoadDevice">Из указанной макс. нагрузки относятся к электроприемникам (кВА):</label>
                              <input type="number" className="form-control" name="ElectricMaxLoadDevice" placeholder="" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="ElectricMaxLoad">Существующая максимальная нагрузка (кВА)</label>
                              <input type="number" className="form-control" name="ElectricMaxLoad" />
                            </div>*/}
                            <div className="form-group">
                              <label htmlFor="ElectricAllowedPower">Разрешенная по договору мощность трансформаторов (кВА) (Лицевой счет)</label>
                              <input data-rh="Разрешенная по договору мощность трансформаторов (кВА) (Лицевой счет)" data-rh-at="right" type="number" step="any" name="electricAllowedPower" onChange={this.ObjectArea.bind(this)} value={this.state.electricAllowedPower} className="form-control" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="ElectricityPhase">Характер нагрузки (фаза)</label>
                              <select className="form-control" onChange={this.onInputChange} value={this.state.electricityPhase} name="electricityPhase">
                                <option>Однофазная</option>
                                <option>Двухфазная</option>
                                <option>Трехфазная</option>
                                <option>Постоянная</option>
                                <option>Временная</option>
                                <option>Сезонная</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label htmlFor="ElectricSafetyCategory">Категория по надежности (кВт)</label>
                              <select required className="form-control" onChange={this.onInputChange} value={this.state.electricSafetyCategory} name="electricSafetyCategory">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>Расчет-обоснование заявленной мощности</label>
                              <div className="file_container">
                                <div className="progress mb-2" data-category="24" style={{ height: '20px', display: 'none' }}>
                                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '0%' }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>

                                {this.state.claimedCapacityJustification &&
                                  <div className="file_block mb-2">
                                    <div>
                                      {this.state.claimedCapacityJustification.name}
                                      <a className="pointer" onClick={(e) => this.setState({ claimedCapacityJustification: false })}>×</a>
                                    </div>
                                  </div>
                                }

                                <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                  <label htmlFor="ClaimedCapacityJustification" className="btn btn-success" style={{ marginRight: '2px' }}>Загрузить</label>
                                  <input type="file" id="ClaimedCapacityJustification" name="ClaimedCapacityJustification" className="form-control" onChange={this.uploadFile.bind(this, 24)} style={{ display: 'none' }} />
                                  <label onClick={this.selectFromList.bind(this, 24)} className="btn btn-info">Выбрать из списка</label>
                                </div>
                                <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                              </div>
                            </div>
                          </div>
                        </div>}
                      <div>
                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                      </div>
                    </form>
                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                  </div>
                  <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-link">
                    <form id="tab3-form" data-tab="3" onSubmit={this.saveApz.bind(this, false)}>
                      <div className="col-md-12">
                        <div style={{ color: '#D8A82D !important' }}>
                          <label><input type="checkbox" onChange={this.onInputChange} checked={this.state.need_water_provider} name="need_water_provider" /> Подать заявление на выдачу технического условия водоснабжения</label>
                        </div>
                        <hr style={{ marginTop: '5px' }} />
                      </div>
                      {this.state.need_water_provider &&
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Количество людей</label>
                              <input data-rh="Количество людей" data-rh-at="right" type="number" step="any" className="form-control" name="PeopleCount" onChange={this.PeopleCount.bind(this)} value={this.state.peopleCount} placeholder="" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="WaterRequirement">Общая потребность в воде (м<sup>3</sup>/сутки)</label>
                              <input type="number" onChange={this.onInputChange} step="any" className="form-control" name="waterRequirement" value={this.state.waterRequirement} />
                            </div>
                            {this.state.objectType !== 'ИЖС' &&
                              <div className="form-group">
                                <label htmlFor="WaterFireFighting">Потребные расходы наружного пожаротушения (л/сек)</label>
                                <input data-rh="Потребные расходы наружного пожаротушения (л/сек)" data-rh-at="right" type="number" onChange={this.onInputChange} step="any" min="10" className="form-control" name="waterFireFighting" value={this.state.waterFireFighting} />
                              </div>
                            }
                          </div>
                          <div className="col-md-6">
                            {this.state.objectType !== 'ИЖС' && <span>
                              <div className="form-group">
                                <label htmlFor="WaterProduction">На производственные нужды (м<sup>3</sup>/сутки)</label>
                                <input data-rh="На производственные нужды (м3/сутки)" data-rh-at="right" type="number" onChange={this.onInputChange} step="any" className="form-control" name="waterProduction" value={this.state.waterProduction} placeholder="" />
                              </div>
                              <div className="form-group">
                                <label htmlFor="WaterDrinking">На хозпитьевые нужды (м<sup>3</sup>/сутки)</label>
                                <input data-rh="На хозпитьевые нужды (м3/сутки)" data-rh-at="right" type="number" onChange={this.onInputChange} step="any" className="form-control" name="waterDrinking" value={this.state.waterDrinking} placeholder="" />
                              </div>
                              <div className="form-group">
                                <label>Потребные расходы внутреннего пожаротушения (л/сек)</label>
                                <input data-rh="Потребные расходы внутреннего пожаротушения (л/сек)" data-rh-at="right" type="number" className="form-control" onChange={this.onInputChange} name="waterFireFightingIn" value={this.state.waterFireFightingIn} />
                              </div></span>
                            }
                            <div className="form-group">
                              <label>Топографическая съемка</label>
                              <div className="file_container">
                                <div className="progress mb-2" data-category="22" style={{ height: '20px', display: 'none' }}>
                                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '0%' }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>

                                {this.state.survey &&
                                  <div className="file_block mb-2">
                                    <div>
                                      {this.state.survey.name}
                                      <a className="pointer" onClick={(e) => this.setState({ survey: false })}>×</a>
                                    </div>
                                  </div>
                                }

                                <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                  <label htmlFor="Survey" className="btn btn-success" style={{ marginRight: '2px' }}>Загрузить</label>
                                  <input type="file" id="Survey" name="Survey" className="form-control" onChange={this.uploadFile.bind(this, 22)} style={{ display: 'none' }} />
                                  <label onClick={this.selectFromList.bind(this, 22)} className="btn btn-info">Выбрать из списка</label>
                                </div>
                                <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                              </div>
                            </div>
                          </div>
                        </div>}
                      <div>
                        <div className="form-group">
                          <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                        </div>
                      </div>
                    </form>
                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                  </div>
                  <div className="tab-pane fade" id="tab4" role="tabpanel" aria-labelledby="tab4-link">
                    <form id="tab4-form" data-tab="4" onSubmit={this.saveApz.bind(this, false)}>
                      {this.state.objectType !== 'ИЖС' &&
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="SewageAmount">Общее количество сточных вод  (м<sup>3</sup>/сутки)</label>
                              <input data-rh="Общее количество сточных вод  (м3/сутки)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.sewageAmount} step="any" className="form-control" name="sewageAmount" placeholder="" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="SewageFeksal">Фекальных (м<sup>3</sup>/сутки)</label>
                              <input data-rh="Фекальных (м3/сутки)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.sewageFeksal} step="any" className="form-control" name="sewageFeksal" placeholder="" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="SewageProduction">Производственно-загрязненных (м<sup>3</sup>/сутки)</label>
                              <input data-rh="Производственно-загрязненных (м3/сутки)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.sewageProduction} step="any" className="form-control" name="sewageProduction" placeholder="" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="SewageToCity">Условно-чистых сбрасываемых на городскую канализацию (м<sup>3</sup>/сутки)</label>
                              <input data-rh="Условно-чистых сбрасываемых на городскую канализацию (м3/сутки)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.sewageToCity} step="any" className="form-control" name="sewageToCity" />
                            </div>
                          </div>
                        </div>
                      }
                      <div>
                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                      </div>
                    </form>
                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                  </div>
                  <div className="tab-pane fade" id="tab5" role="tabpanel" aria-labelledby="tab5-link">
                    <form id="tab5-form" data-tab="5" onSubmit={this.saveApz.bind(this, false)}>
                      <div className="col-md-12">
                        <div style={{ color: '#D8A82D !important' }}>
                          <label><input type="checkbox" onChange={this.onInputChange} checked={this.state.need_heat_provider} name="need_heat_provider" /> Подать заявление на выдачу технического условия теплоснабжения</label>
                        </div>
                        <hr style={{ marginTop: '5px' }} />
                      </div>
                      {this.state.need_heat_provider &&
                        <div>
                          <div className="row">
                            <div className="col-md-6" style={{ padding: '0px' }}>
                              <div style={{ borderRadius: '10px', background: 'rgb(239, 239, 239)', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px' }}>
                                <div className="text-center" style={{ fontSize: '15px' }}>
                                  <p>Расчет по типовым правилам расчета норм потребления коммунальных услуг по теплоснабжению(<a target="_blank" rel="noopener noreferrer" href="http://online.zakon.kz/m/Document/?doc_id=31676321">см. Приказ</a> и <br /> <a rel="noopener noreferrer" target="_blank" href="https://online.zakon.kz/Document/?doc_id=35945475">СП РК 4.02-104-2013</a>)</p>
                                </div><hr />
                                <div className="form-group">
                                  <label>q<sub>уд</sub> <img data-custom data-custom-at="bottom" data-custom-id="2" src="./images/info.png" width="20px"
                                    style={{ borderRadius: '10px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }} alt="" /></label>
                                  <select className="form-control" onChange={this.Calculate_teplo} value={this.state.udelnayaNorma} name="udelnayaNorma" data-rh="Нормируемый удельный расход тепловой энергии на отопление многоквартирного или индивидуального жилого дома на 1 м2 общей площади" data-rh-at="right">
                                    <option></option>
                                    <option>67</option>
                                    <option>55</option>
                                    <option>45</option>
                                    <option>40</option>
                                    <option>37</option>
                                    <option>36</option>
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label>Температура внутреннего воздуха</label>
                                  <input data-rh="Температура внутреннего воздуха: +18, +20, +22 °С" data-rh-at="right" type="number" onChange={this.Calculate_teplo} value={this.state.tempVnutri} step="any" className="form-control" name="tempVnutri" placeholder="" />
                                </div>
                                <div className="form-group">
                                  <label>Общая площадь (кв. м)</label>
                                  <input data-rh="Общая площадь жилых и нежилых помещений многоквартирного или индивидуального жилого дома (кв. м)" data-rh-at="right" type="number" onChange={this.Calculate_teplo} value={this.state.obshayaPloshad} step="any" className="form-control" name="obshayaPloshad" placeholder="" />
                                </div><hr />
                                <div className="form-group">
                                  <label htmlFor="HeatGeneral">Тепловая нагрузка (Гкал/ч)</label>
                                  <input data-rh="Тепловая нагрузка (Гкал/ч)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.heatGeneral} step="any" className="form-control" name="heatGeneral" placeholder="" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="HeatTech">Отопление (Гкал/ч)</label>
                                <input data-rh="Отопление (Гкал/ч)" data-rh-at="right" type="number" step="any" className="form-control" onChange={this.onInputChange} value={this.state.mainHeatMain} name="mainHeatMain" placeholder="" />
                              </div>
                              <div className="form-group">
                                <label htmlFor="HeatTech">Вентиляция (Гкал/ч)</label>
                                <input data-rh="Вентиляция (Гкал/ч)" data-rh-at="right" type="number" step="any" className="form-control" onChange={this.onInputChange} value={this.state.mainHeatVen} name="mainHeatVen" placeholder="" />
                              </div>
                              <div className="form-group">
                                <label htmlFor="HeatDistribution">Горячее водоснабжение, ср (Гкал/ч)</label>
                                <input data-rh="Горячее водоснабжение, ср (Гкал/ч)" data-rh-at="right" type="number" className="form-control" onChange={this.onInputChange} value={this.state.mainHeatWater} name="mainHeatWater" />
                              </div>
                              <div className="form-group">
                                <label htmlFor="mainHeatWaterMax">Горячее водоснабжение, макс (Гкал/ч)</label>
                                <input data-rh="Горячее водоснабжение, макс (Гкал/ч)" data-rh-at="right" type="number" className="form-control" onChange={this.onInputChange} value={this.state.mainHeatWaterMax} name="mainHeatWaterMax" />
                              </div>
                              <div className="form-group">
                                <label htmlFor="HeatTech">Технологическая нагрузка(пар) (Т/ч)</label>
                                <input data-rh="Технологическая нагрузка(пар) (Т/ч)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.heatTech} step="any" className="form-control" name="heatTech" placeholder="" />
                              </div>
                              <div className="form-group">
                                <label htmlFor="HeatSaving">Энергосберегающее мероприятие</label>
                                <input data-rh="Энергосберегающее мероприятие" data-rh-at="right" type="text" onChange={this.onInputChange} value={this.state.heatSaving} className="form-control" name="heatSaving" />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-12">
                              <label><input type="checkbox" onChange={this.onHeatContractChange.bind(this, !this.state.hasHeatContract)} checked={this.state.hasHeatContract} /> Имеется договор</label>
                              <br />
                              <label><input type="checkbox" onChange={this.onTCChange.bind(this, !this.state.hasTCNumber)} checked={this.state.hasTCNumber} /> Имеется ТУ</label>
                            </div>
                          </div>

                          {this.state.hasHeatContract &&
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label htmlFor="HeatGeneral">Тепловая нагрузка по договору(Гкал/ч)</label>
                                  <input data-rh="Тепловая нагрузка (Гкал/ч)" data-rh-at="right" type="number" step="any" className="form-control" value={this.state.heatGeneralInContract} onChange={this.onInputChange} name="heatGeneralInContract" placeholder="" />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="HeatMain">Отопление по договору (Гкал/ч)</label>
                                  <input data-rh="Отопление по договору (Гкал/ч)" data-rh-at="right" type="number" step="any" className="form-control" name="heatMainInContract" value={this.state.heatMainInContract} onChange={this.onInputChange} />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="HeatWater">Горячее водоснабжение по договору, ср (Гкал/ч)</label>
                                  <input data-rh="Горячее водоснабжение по договору (ср/ч)" data-rh-at="right" type="number" step="any" className="form-control" name="heatWaterInContract" value={this.state.heatWaterInContract} onChange={this.onInputChange} />
                                </div>
                                <div className="form-group">
                                  <label>Номер договора</label>
                                  <input data-rh="Номер договора" data-rh-at="right" type="number" step="any" className="form-control" name="contractNum" value={this.state.contractNum} onChange={this.onInputChange} />
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label htmlFor="HeatVentilation">Вентиляция по договору (Гкал/ч)</label>
                                  <input data-rh="Вентиляция по договору (Гкал/ч)" data-rh-at="right" type="number" step="any" className="form-control" name="heatVenInContract" value={this.state.heatVenInContract} onChange={this.onInputChange} />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="HeatTech">Технологическая нагрузка(пар) по договору (Т/ч)</label>
                                  <input data-rh="Технологическая нагрузка(пар) (Т/ч)" data-rh-at="right" type="number" step="any" className="form-control" value={this.state.heatTechInContract} onChange={this.onInputChange} name="heatTechInContract" placeholder="" />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="HeatWater">Горячее водоснабжение по договору, макс (Гкал/ч)</label>
                                  <input data-rh="Горячее водоснабжение по договору (макс/ч)" data-rh-at="right" type="number" step="any" className="form-control" name="heatWaterMaxInContract" value={this.state.heatWaterMaxInContract} onChange={this.onInputChange} />
                                </div>
                              </div>
                            </div>
                          }

                          {this.state.hasTCNumber &&
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label htmlFor="TCNumber">Номер ТУ</label>
                                  <input data-rh="ТУ" data-rh-at="right" type="text" className="form-control" value={this.state.TCNumber} onChange={this.onInputChange} name="TCNumber" placeholder="" />
                                </div>
                              </div>
                            </div>
                          }
                          <div style={{ color: '#D8A82D !important' }}>
                            <label><input type="checkbox" onChange={this.onInputChange} checked={this.state.heatDistribution} name="heatDistribution" /> Разделить нагрузку по жилью и по встроенным помещениям</label>
                          </div>
                          {this.state.heatDistribution !== 0 &&
                            <div>
                              <div className="block_list">
                                {this.state.blocks.map(function (item, index) {
                                  return (
                                    <div id={'heatBlock_' + item.num} className="row" key={index}><AddHeatBlock item={item} deleteBlock={this.deleteBlock} num={item.num} onBlockChange={this.onBlockChange} /></div>
                                  );
                                }.bind(this))}
                              </div>
                              <div style={{ display: 'table', width: '100%' }}>
                                <button type="button" className="btn btn-outline-info pull-right" onClick={this.addBlock.bind(this)}>Добавить здания</button>
                              </div>
                            </div>
                          }
                        </div>}
                      <div>
                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                      </div>
                    </form>
                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                  </div>
                  <div className="tab-pane fade" id="tab6" role="tabpanel" aria-labelledby="tab6-link">
                    <form id="tab6-form" data-tab="6" onSubmit={this.saveApz.bind(this, false)}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="SewageClientWishes">Пожелание заказчика</label>
                            <input data-rh="Пожелание заказчика" data-rh-at="right" type="text" onChange={this.onInputChange} value={this.state.sewageClientWishes} className="form-control" name="sewageClientWishes" placeholder="" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                      </div>
                    </form>
                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                  </div>
                  <div className="tab-pane fade" id="tab7" role="tabpanel" aria-labelledby="tab7-link">
                    <form id="tab7-form" data-tab="7" onSubmit={this.saveApz.bind(this, false)}>
                      <div className="col-md-12">
                        <div style={{ color: '#D8A82D !important' }}>
                          <label><input type="checkbox" onChange={this.onInputChange} checked={this.state.need_phone_provider} name="need_phone_provider" /> Подать заявление на выдачу технического условия телефонизации</label>
                        </div>
                        <hr style={{ marginTop: '5px' }} />
                      </div>
                      {this.state.need_phone_provider &&
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="PhoneServiceNum">Количество телефонных аппаратов и услуг в разбивке физ.лиц и юр.лиц</label>
                              <input data-rh="Количество телефонных аппаратов и услуг в разбивке физ.лиц и юр.лиц" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.phoneServiceNum} step="any" className="form-control" name="phoneServiceNum" placeholder="" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="PhoneCapacity">Телефонная емкость</label>
                              <input data-rh="Телефонная емкость" data-rh-at="right" type="text" onChange={this.onInputChange} value={this.state.phoneCapacity} className="form-control" name="phoneCapacity" placeholder="" />
                            </div>
                            <div className="form-group">
                              <label>Сканированный файл оплаты</label>
                              <div className="file_container">
                                <div className="progress mb-2" data-category="20" style={{ height: '20px', display: 'none' }}>
                                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '0%' }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>

                                {this.state.paymentPhotoFile &&
                                  <div className="file_block mb-2">
                                    <div>
                                      {this.state.paymentPhotoFile.name}
                                      <a className="pointer" onClick={(e) => this.setState({ paymentPhotoFile: false })}>×</a>
                                    </div>
                                  </div>
                                }

                                <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                  <label htmlFor="paymentPhotoFile" className="btn btn-success" style={{ marginRight: '2px' }}>Загрузить</label>
                                  <input type="file" id="paymentPhotoFile" name="paymentPhotoFile" className="form-control" onChange={this.uploadFile.bind(this, 20)} style={{ display: 'none' }} />
                                  <label onClick={this.selectFromList.bind(this, 20)} className="btn btn-info">Выбрать из списка</label>
                                </div>
                                <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="PhoneSewage">Планируемая телефонная канализация</label>
                              <input data-rh="Планируемая телефонная канализация" data-rh-at="right" type="text" onChange={this.onInputChange} value={this.state.phoneSewage} className="form-control" name="phoneSewage" placeholder="" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="PhoneClientWishes">Пожелания заказчика</label>
                              <input data-rh="Пожелания заказчика" data-rh-at="right" type="text" onChange={this.onInputChange} value={this.state.phoneClientWishes} className="form-control" name="phoneClientWishes" placeholder="Тип оборудования, тип кабеля и др." />
                            </div>
                          </div>
                        </div>}
                      <div>
                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                      </div>
                    </form>
                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                  </div>
                  <div className="tab-pane fade" id="tab8" role="tabpanel" aria-labelledby="tab8-link">
                    <form id="tab8-form" data-tab="8" onSubmit={this.saveApz.bind(this, false)}>
                      <div className="col-md-12">
                        <div style={{ color: '#D8A82D !important' }}>
                          <label><input type="checkbox" onChange={this.onInputChange} checked={this.state.need_gas_provider} name="need_gas_provider" /> Подать заявление на выдачу технического условия газоснабжения</label>
                        </div>
                        <hr style={{ marginTop: '5px' }} />
                      </div>
                      {this.state.need_gas_provider &&
                        <div className="row">
                          <div className="col-md-12" style={{ fontSize: '15px' }}>
                            {/*<p>Расчета и утверждения норм потребления газа на отопление(<a target="_blank" href="http://online.zakon.kz/Document/?doc_id=32782895">см. Приказ</a>)</p>*/}
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="GasGeneral">Общая потребность (м<sup>3</sup>/час)</label>
                              <input data-rh="Общая потребность (м3/час)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.gasGeneral} step="any" className="form-control" name="gasGeneral" placeholder="" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="GasCooking">На приготовление пищи (м<sup>3</sup>/час)</label>
                              <input data-rh="На приготовление пищи (м3/час)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.gasCooking} step="any" className="form-control" name="gasCooking" placeholder="" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="GasHeat">Отопление (м<sup>3</sup>/час)</label>
                              <input data-rh="Отопление (м3/час)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.gasHeat} step="any" className="form-control" name="gasHeat" placeholder="" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="GasVentilation">Вентиляция (м<sup>3</sup>/час)</label>
                              <input data-rh="Вентиляция (м3/час)" data-rh-at="right" type="number" step="any" onChange={this.onInputChange} value={this.state.gasVentilation} className="form-control" name="gasVentilation" placeholder="" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="GasConditioner">Кондиционирование (м<sup>3</sup>/час)</label>
                              <input data-rh="Кондиционирование (м3/час)" data-rh-at="right" type="number" step="any" onChange={this.onInputChange} value={this.state.gasConditioner} className="form-control" name="gasConditioner" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="GasWater">Горячее водоснабжение при газификации многоэтажных домов (м<sup>3</sup>/час)</label>
                              <input data-rh="Горячее водоснабжение при газификации многоэтажных домов (м3/час)" data-rh-at="right" type="number" step="any" onChange={this.onInputChange} value={this.state.gasWater} className="form-control" name="gasWater" />
                            </div>
                          </div>
                        </div>}
                      <div>
                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                      </div>
                    </form>
                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
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
                          <th style={{ width: '80%' }}>Название</th>
                          <th style={{ width: '10%' }}>Формат</th>
                          <th style={{ width: '10%' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.categoryFiles.map(function (file, index) {
                          return (
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
          <div style={{ textAlign: 'center' }}>
            <Loader type="Oval" color="#46B3F2" height="200" width="200" />
          </div>
        }

        <div>
          <hr />
        </div>
      </div>
    )
  }
};

export { AddApz }
