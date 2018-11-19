import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import '../assets/css/citizen.css';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import ReactHintFactory from 'react-hint'
import '../assets/css/reacthint.css';
const ReactHint = ReactHintFactory(React)

let e = new LocalizedStrings({ru,kk});

export default class Citizen extends React.Component {
  componentDidMount() {
    this.props.breadCrumbs();
  }
  render() {
    return (
      <div className="content container body-content citizen-apz-list-page">

        <div>
          <div>
            <Switch>
              <Route path="/panel/citizen/apz/status/:status/:page" exact render={(props) =>(
                <AllApzs {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/apz/add" exact render={(props) =>(
                <AddApz {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/apz/edit/:id" exact render={(props) =>(
                <AddApz {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/apz/show/:id" exact render={(props) =>(
                <ShowApz {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Redirect from="/panel/citizen/apz" to="/panel/citizen/apz/status/active/1" />
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
      loaderHidden: false,
      response: null,
      pageNumbers: [],
      applicant:''
    };

  }
  onRequestSubmission() {
    console.log(JSON.stringify(this.state.userData));
    var data = new Object();
    data.applicant=this.state.applicant;
  }
  componentDidMount() {
    this.props.breadCrumbs();
    this.getApzs();
  }

  componentWillReceiveProps(nextProps) {
    this.getApzs(nextProps.match.params.status, nextProps.match.params.page);
  }

  getApzs(status = null, page = null) {
    if (!status) {
      status = this.props.match.params.status;
    }

    if (!page) {
      page = this.props.match.params.page;
    }

    this.setState({ loaderHidden: false });

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/citizen/all/" + status + '?page=' + page, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var pageNumbers = [];
        var start = (response.current_page - 4) > 0 ? (response.current_page - 4) : 1;
        var end = (response.current_page + 4) < response.last_page ? (response.current_page + 4) : response.last_page;

        for (start; start <= end; start++) {
          pageNumbers.push(start);
        }

        this.setState({pageNumbers: pageNumbers});
        this.setState({response: response});
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }

      this.setState({ loaderHidden: true });
    }.bind(this)
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
    var status = this.props.match.params.status;
    var page = this.props.match.params.page;
    var apzs = this.state.response ? this.state.response.data : [];

    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <h4 className="mb-0 mt-2">Архитектурно-планировочное задание</h4>
            <div className="row">
              <div className="col-sm-7">
                <Link className="btn btn-outline-primary mb-3" to="/panel/citizen/apz/add">Создать заявление</Link>
              </div>
              <div className="col-sm-5 statusActive">
                <ul className="nav nav-tabs mb-2 pull-right">
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'active'} activeStyle={{color:"black"}} to="/panel/citizen/apz/status/active/1" replace>Активные</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'draft'} activeStyle={{color:"black"}} to="/panel/citizen/apz/status/draft/1" replace>Черновики</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'accepted'} activeStyle={{color:"black"}} to="/panel/citizen/apz/status/accepted/1" replace>Принятые</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'declined'} activeStyle={{color:"black"}} to="/panel/citizen/apz/status/declined/1" replace>Отказанные</NavLink></li>
                </ul>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '23%'}}>Название</th>
                  <th style={{width: '23%'}}>Заявитель</th>
                  <th style={{width: '20%'}}>Адрес</th>
                  <th style={{width: '20%'}}>Дата заявления</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {apzs.map(function(apz, index) {
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
                      <td>
                        <Link className="btn btn-outline-info" to={'/panel/citizen/apz/' + (apz.status_id === 8 ? 'edit/' : 'show/') + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                      </td>
                    </tr>
                    );
                  }.bind(this))
                }

                {apzs.length === 0 &&
                  <tr>
                    <td colSpan="5">Пусто</td>
                  </tr>
                }
              </tbody>
            </table>

            {this.state.response && this.state.response.last_page > 1 &&
              <nav className="pagination_block">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/citizen/apz/status/' + status + '/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                        <Link className="page-link" to={'/panel/citizen/apz/status/' + status + '/' + num}>{num}</Link>
                      </li>
                      );
                    }.bind(this))
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/panel/citizen/apz/status/' + status + '/' + this.state.response.last_page}>В конец</Link>
                  </li>
                </ul>
              </nav>
            }
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

class AddApz extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      personalIdFile: null,
      confirmedTaskFile: null,
      titleDocumentFile: null,
      additionalFile: null,
      paymentPhotoFile: null,
      survey: null,
      claimedCapacityJustification: null,

      applicant: '',
      type: 1,
      phone: '',
      region: 'Наурызбай',
      designer: '',
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
      electricSafetyCategory: 5,
      peopleCount: 0,
      waterRequirement: '',
      waterSewage: '',
      waterProduction: '',
      waterDrinking: '',
      waterFireFighting: 10,
      waterFireFightingIn: 10,
      sewageAmount: '',
      sewageFeksal: '',
      sewageProduction: '',
      sewageToCity: '',
      heatGeneral: '',
      heatTech: '',
      heatDistribution: '',
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
      heatMainInContract: '',
      heatVenInContract: '',
      heatWaterInContract: '',
      heatWaterMaxInContract: '',
      hasHeatContract: false,

      showMap: false,
      hasCoordinates: false,
      loaderHidden: true,
      blocks: [{num: 1, heatMain: '', heatVentilation: '', heatWater: '', heatWaterMax: ''}],
      companyList: [],
      categoryFiles: [],
      first_name: '',
      last_name:'',
      middle_name:'',
      company_name:'',
    };

    this.saveApz = this.saveApz.bind(this);
    this.hasCoordinates = this.hasCoordinates.bind(this);
    this.toggleMap = this.toggleMap.bind(this);
    this.deleteBlock = this.deleteBlock.bind(this);
    this.companySearch = this.companySearch.bind(this);
    this.onApplicantChange = this.onApplicantChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onBlockChange = this.onBlockChange.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.selectFromList = this.selectFromList.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.onNameChange=this.onNameChange.bind(this);
    this.onCustomerChange=this.onCustomerChange.bind(this);
  }
  onCustomerChange(e){
      this.setState({customer:e.target.value});
  }
  onNameChange(e){
      this.setState({applicant:e.target.value});
  }
  onApplicantChange(e) {
    $('.customer_field').val(e.target.value);
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

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getApzInfo();
    }
  }

  getApzInfo() {
    this.setState({loaderHidden: false});

    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/citizen/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var apz = JSON.parse(xhr.responseText);

        this.setState({applicant: apz.applicant ? apz.applicant : '' });
        this.setState({phone: apz.phone ? apz.phone : '' });
        this.setState({region: apz.region ? apz.region : '' });
        this.setState({designer: apz.designer ? apz.designer : '' });
        this.setState({type: apz.type ? apz.type : '' });
        this.setState({projectName: apz.project_name ? apz.project_name : '' });
        this.setState({projectAddress: apz.project_address ? apz.project_address : '' });
        this.setState({projectAddressCoordinates: apz.project_address_coordinates ? apz.project_address_coordinates : '' });
        this.setState({hasCoordinates: apz.project_address_coordinates ? true : false });

        this.setState({personalIdFile: apz.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: apz.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: apz.files.filter(function(obj) { return obj.category_id === 10 })[0]});
        this.setState({additionalFile: apz.files.filter(function(obj) { return obj.category_id === 27 })[0]});
        this.setState({paymentPhotoFile: apz.files.filter(function(obj) { return obj.category_id === 20 })[0]});
        this.setState({survey: apz.files.filter(function(obj) { return obj.category_id === 22 })[0]});
        this.setState({claimedCapacityJustification: apz.files.filter(function(obj) { return obj.category_id === 24 })[0]});

        this.setState({objectType: apz.object_type ? apz.object_type : '' });
        this.setState({customer: apz.customer ? apz.customer : '' });
        this.setState({cadastralNumber: apz.cadastral_number ? apz.cadastral_number : '' });
        this.setState({objectTerm: apz.object_term ? apz.object_term : '' });
        this.setState({objectLevel: apz.object_level ? apz.object_level : '' });
        this.setState({objectArea: apz.object_area ? apz.object_area : '' });
        this.setState({objectRooms: apz.object_rooms ? apz.object_rooms : '' });

        if (apz.apz_electricity) {
          this.setState({electricAllowedPower: apz.apz_electricity.allowed_power ? apz.apz_electricity.allowed_power : '' });
          this.setState({electricRequiredPower: apz.apz_electricity.required_power ? apz.apz_electricity.required_power : '' });
          this.setState({electricityPhase: apz.apz_electricity.phase ? apz.apz_electricity.phase : '' });
          this.setState({electricSafetyCategory: apz.apz_electricity.safety_category ? apz.apz_electricity.safety_category : '' });
        }

        if (apz.apz_water) {
          this.setState({peopleCount: apz.apz_water.people_count ? apz.apz_water.people_count : '' });
          this.setState({waterRequirement: apz.apz_water.requirement ? apz.apz_water.requirement : '' });
          this.setState({waterSewage: apz.apz_water.sewage ? apz.apz_water.sewage : '' });
          this.setState({waterProduction: apz.apz_water.production ? apz.apz_water.production : '' });
          this.setState({waterDrinking: apz.apz_water.drinking ? apz.apz_water.drinking : '' });
          this.setState({waterFireFighting: apz.apz_water.fire_fighting ? apz.apz_water.fire_fighting : '' });
          this.setState({waterFireFightingIn: apz.apz_water.fire_fighting_in ? apz.apz_water.fire_fighting_in : '' });
        }

        if (apz.apz_sewage) {
          this.setState({sewageAmount: apz.apz_sewage.amount ? apz.apz_sewage.amount : '' });
          this.setState({sewageFeksal: apz.apz_sewage.feksal ? apz.apz_sewage.feksal : '' });
          this.setState({sewageProduction: apz.apz_sewage.production ? apz.apz_sewage.production : '' });
          this.setState({sewageToCity: apz.apz_sewage.to_city ? apz.apz_sewage.to_city : '' });
          this.setState({sewageClientWishes: apz.apz_sewage.client_wishes ? apz.apz_sewage.client_wishes : '' });
        }

        if (apz.apz_heat) {
          this.setState({heatGeneral: apz.apz_heat.general ? apz.apz_heat.general : '' });
          this.setState({heatTech: apz.apz_heat.tech ? apz.apz_heat.tech : '' });
          this.setState({heatDistribution: apz.apz_heat.distribution ? apz.apz_heat.distribution : '' });
          this.setState({heatSaving: apz.apz_heat.saving ? apz.apz_heat.saving : '' });

          this.setState({contractNum: apz.apz_heat.contract_num ? apz.apz_heat.contract_num : '' });
          this.setState({heatMainInContract: apz.apz_heat.main_in_contract ? apz.apz_heat.main_in_contract : '' });
          this.setState({heatVenInContract: apz.apz_heat.ven_in_contract ? apz.apz_heat.ven_in_contract : '' });
          this.setState({heatWaterInContract: apz.apz_heat.water_in_contract ? apz.apz_heat.water_in_contract : '' });
          this.setState({heatWaterMaxInContract: apz.apz_heat.water_in_contract_max ? apz.apz_heat.water_in_contract_max : '' });

          if (apz.apz_heat.blocks) {
            for (var i = 0; i < apz.apz_heat.blocks.length; i++) {
              var blocks = this.state.blocks;

              blocks[i] = {
                num: i+1,
                heatMain: apz.apz_heat.blocks[i].main,
                heatVentilation: apz.apz_heat.blocks[i].ventilation,
                heatWater: apz.apz_heat.blocks[i].water,
                heatWaterMax: apz.apz_heat.blocks[i].water_max
              };

              this.setState({blocks: blocks});
            }
          }

          if (this.state.heatMainInContract || this.state.heatVenInContract || this.state.heatWaterInContract || this.state.heatWaterMaxInContract) {
            this.setState({ hasHeatContract: true });
          }
        }

        if (apz.apz_phone) {
          this.setState({phoneServiceNum: apz.apz_phone.service_num ? apz.apz_phone.service_num : '' });
          this.setState({phoneCapacity: apz.apz_phone.capacity ? apz.apz_phone.capacity : '' });
          this.setState({phoneSewage: apz.apz_phone.sewage ? apz.apz_phone.sewage : '' });
          this.setState({phoneClientWishes: apz.apz_phone.client_wishes ? apz.apz_phone.client_wishes : '' });
        }

        if (apz.apz_gas) {
          this.setState({gasGeneral: apz.apz_gas.general ? apz.apz_gas.general : '' });
          this.setState({gasCooking: apz.apz_gas.cooking ? apz.apz_gas.cooking : '' });
          this.setState({gasHeat: apz.apz_gas.heat ? apz.apz_gas.heat : '' });
          this.setState({gasVentilation: apz.apz_gas.ventilation ? apz.apz_gas.ventilation : '' });
          this.setState({gasConditioner: apz.apz_gas.conditioner ? apz.apz_gas.conditioner : '' });
          this.setState({gasWater: apz.apz_gas.water ? apz.apz_gas.water : '' });
        }
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
      $('#tab0-form').slideUp();
    } else {
      $('#tab0-form').slideDown();
    }
  }

  saveApz(publish, elem) {
    elem.preventDefault();

    if (publish) {
      var requiredFields = {
        applicant: 'Заявитель',
        personalIdFile: 'Уд.личности/Реквизиты',
        projectName: 'Наименование проектируемого объекта',
        projectAddress: 'Адрес проектируемого объекта',
        projectAddressCoordinates: 'Отметить на карте',
        confirmedTaskFile: 'Утвержденное задание на проектирование',
        titleDocumentFile: 'Госакт и правоустанавливающий документ на земельный участок, договор о купли-продажи',
        objectType: 'Тип объекта',
        customer: 'Заказчик'
      };

      if (this.state.phoneServiceNum) {
        requiredFields['paymentPhotoFile'] = 'Сканированный файл оплаты';
      }

      var errors = 0;

      Object.keys(requiredFields).forEach(function(key){
        if (!this.state[key]) {
          alert('Заполните поле "' + requiredFields[key] + '"');
          errors++;
          return false;
        }
      }.bind(this));

      if (errors > 0) {
        return false;
      }
    }

    var apzId = this.props.match.params.id;
    var link = apzId > 0 ? ("api/apz/citizen/save/" + apzId) : "api/apz/citizen/save";

    var data = {
      publish: publish ? true : false,
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
          this.props.history.replace('/panel/citizen/apz');
        } else {
          alert('Заявка успешно сохранена');

          if (!apzId) {
            this.props.history.push('/panel/citizen/apz/edit/' + data.id);
          }
        }
      } else {
        alert("При сохранении заявки произошла ошибка!");
      }
    }.bind(this);
    xhr.send(JSON.stringify(data));
  }

  addBlock() {
    var num = parseInt($('.block_list .col-md-12:last .block_num').html()) + 1;

    this.setState({blocks: this.state.blocks.concat([{num: num, heatMain: '', heatVentilation: '', heatWater: '', heatWaterMax: ''}])});
  }

  onBlockChange(e, num) {
    var blocks = this.state.blocks;
    var index = blocks.map(function(obj) { return obj.num; }).indexOf(num);

    if (index === -1) {
      return false;
    }

    const { value, name } = e.target
    blocks[index][name] = value;
    this.setState({blocks: blocks});
  }

  onHeatContractChange(value) {
    if (!value) {
      this.setState({
        heatMainInContract: '',
        heatVenInContract: '',
        heatWaterInContract: '',
        heatWaterMaxInContract: '',
        contractNum: ''
      })
    }

    this.setState({ hasHeatContract: value })
  }

  deleteBlock(num) {
    var blocks = this.state.blocks;
    var index = blocks.map(function(obj) { return obj.num; }).indexOf(num);

    if (index === -1) {
      return false;
    }

    blocks.splice(index, 1);
    this.setState({blocks: blocks});

    $('#heatBlock_' + (num - 1) + ' .block_delete').css('display', 'block');
  }

  companySearch() {
    var token = sessionStorage.getItem('tokenInfo');
    var bin = sessionStorage.getItem('userBin');
    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/citizen/company_search", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        if (!xhr.responseText) {
          alert('Поиск не дал результатов');
          return false;
        }

        var data = JSON.parse(xhr.responseText);
        this.setState({companyList: data.list});
      }
    }.bind(this)
    xhr.send(JSON.stringify({bin: bin}));
  }

  //правила вкладки Объект/Газоснабжение
  ObjectType(e) {
    // document.getElementsByName('ObjectArea')[0].disabled = false;
  }

  ObjectArea(e) {
    if(e.target.name === 'objectArea') {
      this.setState({objectArea: e.target.value});
    }

    if(e.target.name === 'electricAllowedPower') {
      this.setState({electricAllowedPower: e.target.value});
    }

    if(e.target.name === 'electricRequiredPower') {
      this.setState({electricRequiredPower: e.target.value});
    }

    //ИЖС if selected
    if(document.getElementById('ObjectType').value === 'ИЖС')
    {
      if(document.getElementsByName('objectArea')[0].value !== '')
      {
        var ObjectArea = parseInt(document.getElementsByName('objectArea')[0].value, 3);
        switch (true)
        {
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

      if(document.getElementsByName('electricAllowedPower')[0].value !== '')
      {
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
    if(document.getElementById('ObjectType').value === 'МЖК') //МЖК
    {
      //rules
    }
    if(document.getElementById('ObjectType').value === 'КомБыт')
    {
      //rules
    }
    if(document.getElementById('ObjectType').value === 'ПромПред')
    {
      //rules
    }
  }

  //правила вкладки Водоснабжение
  PeopleCount(e) {
    this.setState({waterRequirement: parseFloat( "0.19" * e.target.value)});
    this.setState({peopleCount: e.target.value});
    this.setState({waterSewage: this.state.waterRequirement});
    //document.getElementsByName('WaterRequirement')[0].value = parseFloat( "0.19" * document.getElementsByName('PeopleCount')[0].value);
    //document.getElementsByName('WaterSewage')[0].value = document.getElementsByName('WaterRequirement')[0].value;
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
              setTimeout(function() {window.URL.revokeObjectURL(url);},0);
            };

          }());

          saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
        } else {
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

            case 9:
              this.setState({confirmedTaskFile: data});
              break;

            case 10:
              this.setState({titleDocumentFile: data});
              break;

            case 27:
              this.setState({additionalFile: data});
              break;

            case 20:
              this.setState({paymentPhotoFile: data});
              break;

            case 22:
              this.setState({survey: data});
              break;

            case 24:
              this.setState({claimedCapacityJustification: data});
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

      case '9':
        this.setState({confirmedTaskFile: data});
        break;

      case '10':
        this.setState({titleDocumentFile: data});
        break;

      case '27':
        this.setState({additionalFile: data});
        break;

      case '20':
        this.setState({paymentPhotoFile: data});
        break;

      case '22':
        this.setState({survey: data});
        break;

      case '24':
        this.setState({claimedCapacityJustification: data});
        break;
    }

    $('#selectFileModal').modal('hide');
  }

  onRenderContent = (target, content) => {
          const {catId} = target.dataset
          const width = 240
          const url = `https://images.pexels.com/photos/${catId}/pexels-photo-${catId}.jpeg?w=${width}`

          return <div className="custom-hint__content">
              <img src={url} width={width} />
              <button ref={(ref) => ref && ref.focus()}
                  onClick={() => this.instance.toggleHint()}>Ok</button>
          </div>
  }
  render() {
    var bin = sessionStorage.getItem('userBin');

    return (
      <div className="container" id="apzFormDiv">
      <ReactHint autoPosition events delay={100} />
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
                                     checked={this.state.type == 1 ? true : false} onChange={this.onInputChange} />
                              <label htmlFor={"apztype1"} className="custom-control-label" style={{cursor:"pointer"}}>Пакет 1
                              <br/>
                              <span className="help-block text-muted">(архитектурно-планировочное задание, технические условия)</span></label>
                            </div>
                            <hr/>
                            <div className="custom-control custom-radio">
                              <input type="radio" className="custom-control-input" name="type" value="2" id={'apztype2'}
                                     checked={this.state.type == 2 ? true : false} onChange={this.onInputChange} />
                              <label for="apztype2" className="custom-control-label" style={{cursor:"pointer"}}>Пакет 2
                              <br/>
                              <span className="help-block text-muted">(архитектурно-планировочное задание, вертикальные планировочные отметки,
                                выкопировку из проекта детальной планировки, типовые поперечные
                                профили дорог и улиц, технические условия, схемы трасс наружных инженерных
                                сетей)</span></label>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="Applicant">Заявитель:</label>
                            <input data-rh="Заявитель" data-rh-at="right" type="text" className="form-control" onChange={this.onNameChange} name="applicant" value={this.state.applicant=this.state.company_name==' ' ?this.state.last_name+" "+this.state.first_name+" "+this.state.middle_name:this.state.company_name } required />
                            {/*<span className="help-block"></span>*/}
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
                            <div className="row coordinates_block pt-0">
                              <div className="col-sm-7">
                                <input data-rh="Адрес проектируемого объекта" data-rh-at="right" type="text" required className="form-control" onChange={this.onInputChange} value={this.state.projectAddress} name="projectAddress" />
                                <input type="hidden" onChange={this.onInputChange} value={this.state.projectAddressCoordinates} id="ProjectAddressCoordinates" name="projectAddressCoordinates" />
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
                            <label>Утвержденное задание на проектирование</label>
                            <div className="file_container">
                              <div className="progress mb-2" data-category="9" style={{height: '20px', display: 'none'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>

                              {this.state.confirmedTaskFile &&
                                <div className="file_block mb-2">
                                  <div>
                                    {this.state.confirmedTaskFile.name}
                                    <a className="pointer" onClick={(e) => this.setState({confirmedTaskFile: false}) }>×</a>
                                  </div>
                                </div>
                              }

                              <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                <label htmlFor="ConfirmedTaskFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                <input type="file" id="ConfirmedTaskFile" name="ConfirmedTaskFile" className="form-control" onChange={this.uploadFile.bind(this, 9)} style={{display: 'none'}} />
                                <label onClick={this.selectFromList.bind(this, 9)} className="btn btn-info btn-sm">Выбрать из списка</label>
                              </div>
                              <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Госакт и правоустанавливающий документ на земельный участок, договор о купли-продажи</label>
                            <div className="file_container">
                              <div className="progress mb-2" data-category="10" style={{height: '20px', display: 'none'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>

                              {this.state.titleDocumentFile &&
                                <div className="file_block mb-2">
                                  <div>
                                    {this.state.titleDocumentFile.name}
                                    <a className="pointer" onClick={(e) => this.setState({titleDocumentFile: false}) }>×</a>
                                  </div>
                                </div>
                              }

                              <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                <label htmlFor="TitleDocumentFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                <input type="file" id="TitleDocumentFile" name="TitleDocumentFile" className="form-control" onChange={this.uploadFile.bind(this, 10)} style={{display: 'none'}} />
                                <label onClick={this.selectFromList.bind(this, 10)} className="btn btn-info btn-sm">Выбрать из списка</label>
                              </div>
                              <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Дополнительно (нотариальное согласие долевика, распоряжение с акимата на временное пользование)</label>
                            <div className="file_container">
                              <div className="progress mb-2" data-category="27" style={{height: '20px', display: 'none'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>

                              {this.state.additionalFile &&
                                <div className="file_block mb-2">
                                  <div>
                                    {this.state.additionalFile.name}
                                    <a className="pointer" onClick={(e) => this.setState({additionalFile: false}) }>×</a>
                                  </div>
                                </div>
                              }

                              <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                <label htmlFor="AdditionalFile" className="btn btn-success btn-sm" style={{marginRight: '2px'}}>Загрузить</label>
                                <input type="file" id="AdditionalFile" name="AdditionalFile" className="form-control" onChange={this.uploadFile.bind(this, 27)} style={{display: 'none'}} />
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
                            <label htmlFor="ObjectType">Тип объекта</label>
                            <select required className="form-control" name="objectType" id="ObjectType" onChange={this.onInputChange} value={this.state.objectType}>
                              <option value="null" disabled>Выберите тип объекта</option>
                              <option>ИЖС</option>
                              <option>МЖК</option>
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
                            <input data-rh="Заказчик" data-rh-at="right" type="text" required onChange={this.onCustomerChange} value={this.state.customer=this.state.company_name==' ' ?this.state.last_name+" "+this.state.first_name+" "+this.state.middle_name:this.state.company_name} className="form-control customer_field" name="customer" placeholder="ФИО / Наименование компании" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="CadastralNumber">Кадастровый номер:</label>
                            <input data-rh="Кадастровый номер:" data-rh-at="right" type="text" className="form-control" onChange={this.onInputChange} value={this.state.cadastralNumber} name="cadastralNumber" placeholder="" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="ObjectTerm">Срок строительства по нормам</label>
                            <input data-rh="Срок строительства по нормам" data-rh-at="right" type="text" name="objectTerm" onChange={this.onInputChange} value={this.state.objectTerm} className="form-control" id="ObjectTerm" placeholder="" />
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
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="ElectricAllowedPower">Разрешенная по договору мощность трансформаторов (кВА) (Лицевой счет)</label>
                            <input data-rh="Разрешенная по договору мощность трансформаторов (кВА) (Лицевой счет)" data-rh-at="right" type="number" step="any" name="electricAllowedPower" onChange={this.ObjectArea.bind(this)} value={this.state.electricAllowedPower} className="form-control" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="ElectricRequiredPower">Требуемая мощность (кВт)</label>
                            <input data-rh="Требуемая мощность (кВт)" data-rh-at="right" type="number" step="any" className="form-control" onChange={this.ObjectArea.bind(this)} value={this.state.electricRequiredPower} name="electricRequiredPower" placeholder="" />
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
                            <label htmlFor="ElectricSafetyCategory">Категория по надежности (кВт)</label>
                            <select required className="form-control" onChange={this.onInputChange} value={this.state.electricSafetyCategory} name="electricSafetyCategory">
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Расчет-обоснование заявленной мощности</label>
                            <div className="file_container">
                              <div className="progress mb-2" data-category="24" style={{height: '20px', display: 'none'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>

                              {this.state.claimedCapacityJustification &&
                                <div className="file_block mb-2">
                                  <div>
                                    {this.state.claimedCapacityJustification.name}
                                    <a className="pointer" onClick={(e) => this.setState({claimedCapacityJustification: false}) }>×</a>
                                  </div>
                                </div>
                              }

                              <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                <label htmlFor="ClaimedCapacityJustification" className="btn btn-success" style={{marginRight: '2px'}}>Загрузить</label>
                                <input type="file" id="ClaimedCapacityJustification" name="ClaimedCapacityJustification" className="form-control" onChange={this.uploadFile.bind(this, 24)} style={{display: 'none'}} />
                                <label onClick={this.selectFromList.bind(this, 24)} className="btn btn-info">Выбрать из списка</label>
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
                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                  </div>
                  <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-link">
                    <form id="tab3-form" data-tab="3" onSubmit={this.saveApz.bind(this, false)}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Количество людей</label>
                            <input data-rh="Количество людей" data-rh-at="right" type="number" step="any" className="form-control" name="PeopleCount" onChange={this.PeopleCount.bind(this)} value={this.state.peopleCount} placeholder="" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="WaterRequirement">Общая потребность в воде (м<sup>3</sup>/сутки)</label>
                            <input type="number" step="any" className="form-control" onChange={this.onInputChange} value={this.state.waterRequirement} name="WaterRequirement" placeholder="" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="WaterFireFighting">Потребные расходы наружного пожаротушения (л/сек)</label>
                            <input type="number" onChange={this.onInputChange} value={this.state.waterFireFighting} min="10" className="form-control" name="WaterFireFighting" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="WaterProduction">На производственные нужды (м<sup>3</sup>/сутки)</label>
                            <input data-rh="На производственные нужды (м3/сутки)" data-rh-at="right" type="number" onChange={this.onInputChange} step="any" className="form-control" name="waterProduction" value={this.state.waterProduction} placeholder="" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="WaterDrinking">На хозпитьевые нужды (м<sup>3</sup>/сутки)</label>
                            <input data-rh="На хозпитьевые нужды (м3/сутки)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.waterDrinking} step="any" className="form-control" name="WaterDrinking" placeholder="" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="WaterSewage">Канализация (м<sup>3</sup>/сутки)</label>
                            <input type="number" readOnly="readonly" className="form-control" onChange={this.onInputChange} value={this.state.waterSewage} name="WaterSewage" />
                          </div>
                          <div className="form-group">
                            <label>Потребные расходы внутреннего пожаротушения (л/сек)</label>
                            <input type="number" className="form-control" onChange={this.onInputChange} value={this.state.waterFireFightingIn}/>
                          </div>
                          <div className="form-group">
                            <label>Топографическая съемка</label>
                            <div className="file_container">
                              <div className="progress mb-2" data-category="22" style={{height: '20px', display: 'none'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>

                              {this.state.survey &&
                                <div className="file_block mb-2">
                                  <div>
                                    {this.state.survey.name}
                                    <a className="pointer" onClick={(e) => this.setState({survey: false}) }>×</a>
                                  </div>
                                </div>
                              }

                              <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                <label htmlFor="Survey" className="btn btn-success" style={{marginRight: '2px'}}>Загрузить</label>
                                <input type="file" id="Survey" name="Survey" className="form-control" onChange={this.uploadFile.bind(this, 22)} style={{display: 'none'}} />
                                <label onClick={this.selectFromList.bind(this, 22)} className="btn btn-info">Выбрать из списка</label>
                              </div>
                              <span className="help-block text-muted">документ в формате pdf, doc, docx</span>
                            </div>
                          </div>
                        </div>
                      </div>
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
                      <div>
                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                      </div>
                    </form>
                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                  </div>
                  <div className="tab-pane fade" id="tab5" role="tabpanel" aria-labelledby="tab5-link">
                    <form id="tab5-form" data-tab="5" onSubmit={this.saveApz.bind(this, false)}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="HeatGeneral">Общая тепловая нагрузка (Гкал/ч)<br /><br /></label>
                            <input data-rh="Общая тепловая нагрузка (Гкал/ч)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.heatGeneral} step="any" className="form-control" name="heatGeneral" placeholder="" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="HeatTech">Технологические нужды(пар) (Т/ч)</label>
                            <input data-rh="Технологические нужды(пар) (Т/ч)" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.heatTech} step="any" className="form-control" name="heatTech" placeholder="" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="HeatDistribution">Разделить нагрузку по жилью и по встроенным помещениям</label>
                            <input data-rh="Разделить нагрузку по жилью и по встроенным помещениям" data-rh-at="right" type="text" onChange={this.onInputChange} value={this.state.heatDistribution} className="form-control" name="heatDistribution" />
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
                        </div>
                      </div>

                      {this.state.hasHeatContract &&
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="form-group">
                              <label htmlFor="HeatMain">Отопление по договору<br />(Гкал/ч)</label>
                              <input data-rh="Отопление по договору (Гкал/ч)" data-rh-at="right" type="number" step="any" className="form-control" name="heatMainInContract" value={this.state.heatMainInContract} onChange={this.onInputChange} />
                            </div>
                            <div className="form-group">
                              <label htmlFor="HeatWater">Горячее водоснабжение по договору<br />(ср/ч)</label>
                              <input data-rh="Горячее водоснабжение по договору (ср/ч)" data-rh-at="right" type="number" step="any" className="form-control" name="heatWaterInContract" value={this.state.heatWaterInContract} onChange={this.onInputChange} />
                            </div>
                            <div className="form-group">
                              <label>Номер договора</label>
                              <input data-rh="Номер договора" data-rh-at="right" type="number" step="any" className="form-control" name="contractNum" value={this.state.contractNum} onChange={this.onInputChange} />
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="form-group">
                              <label htmlFor="HeatVentilation">Вентиляция по договору<br />(Гкал/ч)</label>
                              <input data-rh="Вентиляция по договору (Гкал/ч)" data-rh-at="right" type="number" step="any" className="form-control" name="heatVenInContract" value={this.state.heatVenInContract} onChange={this.onInputChange} />
                            </div>
                            <div className="form-group">
                              <label htmlFor="HeatWater">Горячее водоснабжение по договору<br />(макс/ч)</label>
                              <input data-rh="Горячее водоснабжение по договору (макс/ч)" data-rh-at="right" type="number" step="any" className="form-control" name="heatWaterMaxInContract" value={this.state.heatWaterMaxInContract} onChange={this.onInputChange} />
                            </div>
                          </div>
                        </div>
                      }

                      <div className="block_list">
                        {this.state.blocks.map(function(item, index) {
                          return(
                            <div id={'heatBlock_' + item.num} className="row" key={index}><AddHeatBlock item={item} deleteBlock={this.deleteBlock} num={item.num} onBlockChange={this.onBlockChange} /></div>
                          );
                        }.bind(this))}
                      </div>
                      <div style={{display: 'table', width: '100%'}}>
                        <button type="button" className="btn btn-outline-info pull-right" onClick={this.addBlock.bind(this)}>Добавить здания</button>
                      </div>
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
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="PhoneServiceNum">Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</label>
                            <input data-rh="Количество ОТА и услуг в разбивке физ.лиц и юр.лиц" data-rh-at="right" type="number" onChange={this.onInputChange} value={this.state.phoneServiceNum} step="any" className="form-control" name="phoneServiceNum" placeholder="" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="PhoneCapacity">Телефонная емкость</label>
                            <input data-rh="Телефонная емкость" data-rh-at="right" type="text" onChange={this.onInputChange} value={this.state.phoneCapacity} className="form-control" name="phoneCapacity" placeholder="" />
                          </div>
                          <div className="form-group">
                            <label>Сканированный файл оплаты</label>
                            <div className="file_container">
                              <div className="progress mb-2" data-category="20" style={{height: '20px', display: 'none'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>

                              {this.state.paymentPhotoFile &&
                                <div className="file_block mb-2">
                                  <div>
                                    {this.state.paymentPhotoFile.name}
                                    <a className="pointer" onClick={(e) => this.setState({paymentPhotoFile: false}) }>×</a>
                                  </div>
                                </div>
                              }

                              <div className="file_buttons btn-group btn-group-justified d-table mt-0">
                                <label htmlFor="paymentPhotoFile" className="btn btn-success" style={{marginRight: '2px'}}>Загрузить</label>
                                <input type="file" id="paymentPhotoFile" name="paymentPhotoFile" className="form-control" onChange={this.uploadFile.bind(this, 20)} style={{display: 'none'}} />
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
                      </div>
                      <div>
                        <input type="submit" value="Сохранить" className="btn btn-outline-secondary" />
                      </div>
                    </form>
                    <button onClick={this.saveApz.bind(this, true)} className="btn btn-outline-success">Отправить заявку</button>
                  </div>
                  <div className="tab-pane fade" id="tab8" role="tabpanel" aria-labelledby="tab8-link">
                    <form id="tab8-form" data-tab="8" onSubmit={this.saveApz.bind(this, false)}>
                      <div className="row">
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
                      </div>
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
          <Link className="btn btn-outline-secondary pull-right" to={'/panel/citizen/apz'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
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
      waterCustomTcFile: null,
      phoneCustomTcFile: null,
      electroCustomTcFile: null,
      heatCustomTcFile: null,
      pack2IdFile: null,
      gasCustomTcFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
      additionalFile: false,
      paymentPhotoFile: false,
      loaderHidden: false
    };
  }

  componentDidMount() {
    this.props.breadCrumbs();
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');

    this.setState({ loaderHidden: false });

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/citizen/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var apz = JSON.parse(xhr.responseText);
        var commission = apz.commission;
console.log(apz.files);
        this.setState({apz: apz});
        this.setState({personalIdFile: apz.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: apz.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: apz.files.filter(function(obj) { return obj.category_id === 10 })[0]});
        this.setState({additionalFile: apz.files.filter(function(obj) { return obj.category_id === 27 })[0]});
        this.setState({paymentPhotoFile: apz.files.filter(function(obj) { return obj.category_id === 20 })[0]});
        var pack2IdFile = apz.files.filter(function(obj) { return obj.category_id === 25 }) ?
          apz.files.filter(function(obj) { return obj.category_id === 25 }) : [];
        if ( pack2IdFile.length > 0 ) {
          this.setState({pack2IdFile: pack2IdFile[0]});
        }

        if (apz.status_id === 1 || apz.status_id === 2) {

          if (commission) {
            if (commission.apz_water_response && commission.apz_water_response.files) {
              this.setState({waterResponseFile: commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
              this.setState({waterCustomTcFile: commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
            }

            if (commission.apz_electricity_response && commission.apz_electricity_response.files) {
              this.setState({electroResponseFile: commission.apz_electricity_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
              this.setState({electroCustomTcFile: commission.apz_electricity_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
            }

            if (commission.apz_phone_response && commission.apz_phone_response.files) {
              this.setState({phoneResponseFile: commission.apz_phone_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
              this.setState({phoneCustomTcFile: commission.apz_phone_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
            }

            if (commission.apz_heat_response && commission.apz_heat_response.files) {
              this.setState({heatResponseFile: commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
              this.setState({heatCustomTcFile: commission.apz_heat_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
            }

            if (commission.apz_gas_response && commission.apz_gas_response.files) {
              this.setState({gasResponseFile: commission.apz_gas_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
              this.setState({gasCustomTcFile: commission.apz_gas_response.files.filter(function(obj) { return obj.category_id === 23 })[0]});
            }
          }

          if (apz.apz_head_response && apz.apz_head_response.files) {
            this.setState({headResponseFile: apz.apz_head_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
          }
        }

        this.setState({loaderHidden: true});
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
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
              setTimeout(function() {window.URL.revokeObjectURL(url);},0);
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
      xhr.open("get", window.url + "api/print/apz/" + apzId, true);
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

            saveByteArray([base64ToArrayBuffer(data.file)], "апз-" + project + formated_date + ".pdf");
          }
        } else {
          alert('Не удалось скачать файл');
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

  printRegionAnswer(apzId) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/region/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "МО.pdf");
          } else {
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
                setTimeout(function() {window.URL.revokeObjectURL(url);},0);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], "МО.pdf");
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

  // print technical condition of waterProvider
  printWaterTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/water/" + apzId, true);
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

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Вода-" + project + formated_date + ".pdf");
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

  // print technical condition of gasProvider
  printGasTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/gas/" + apzId, true);
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

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Газ-" + project + formated_date + ".pdf");
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

  // print technical condition of electroProvider
  printElectroTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/electro/" + apzId, true);
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

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Электр-" + project + formated_date + ".pdf");
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

  // print technical condition of heatProvider
  printHeatTechCon(apzId, project) {
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

  // print technical condition of phoneProvider
  printPhoneTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/phone/" + apzId, true);
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

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Телефон-" + project + formated_date + ".pdf");
          }
        } else {
          alert('Не удалось скачать файл');
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
      return (
        <div>
          {!this.state.loaderHidden &&
            <div style={{textAlign: 'center'}}>
              <Loader type="Oval" color="#46B3F2" height="200" width="200" />
            </div>
          }
        </div>
      );
    }

    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td style={{width: '22%'}}><b>ИД заявки</b></td>
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

                {this.state.additionalFile &&
                  <tr>
                    <td><b>Дополнительно</b></td>
                    <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.additionalFile.id)}>Скачать</a></td>
                  </tr>
                }

                {this.state.paymentPhotoFile &&
                  <tr>
                    <td><b>Сканированный файл оплаты</b></td>
                    <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.paymentPhotoFile.id)}>Скачать</a></td>
                  </tr>
                }

                {this.state.pack2IdFile &&
                  <tr>
                    <td>
                      <b>Пакет 2</b>
                      <br />
                      <span className={'help-block text-muted'}>архитектурно-планировочное задание, вертикальные планировочные
                      отметки, выкопировку из проекта детальной планировки, типовые поперечные
                      профили дорог и улиц, технические условия, схемы трасс наружных инженерных
                      сетей</span>
                    </td>
                    <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.pack2IdFile.id)}>Скачать</a></td>
                  </tr>
                }
              </tbody>
            </table>

            {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}

            <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
              {this.state.showMapText}
            </button>

            {(apz.status_id === 1 || apz.status_id === 2) &&
              <div>
                <h5 className="block-title-2 mt-5 mb-3">Результат</h5>

                {apz.status_id === 2 &&
                  <table className="table table-bordered table-striped">
                    <tbody>
                      {this.state.headResponseFile &&
                        <tr>
                          <td style={{width: '22%'}}><b>Загруженный АПЗ</b></td>
                          <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.headResponseFile.id)}>Скачать</a></td>
                        </tr>
                      }

                      <tr>
                        <td style={{width: '22%'}}><b>Сформированный АПЗ</b></td>
                        <td><a className="text-info pointer" onClick={this.printApz.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                      </tr>
                    </tbody>
                  </table>
                }

                {apz.status_id === 1 &&
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                          {this.state.headResponseFile ?
                            <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.headResponseFile.id)}>Скачать</a></td>
                          :
                            <td><a className="text-info pointer" onClick={this.printRegionAnswer.bind(this, apz.id)}>Скачать</a></td>
                          }
                      </tr>
                    </tbody>
                  </table>
                }

                {apz.commission &&
                  <div>
                    <table className="table table-bordered table-striped">
                      <tbody>
                        {apz.commission.apz_water_response &&
                          <tr>
                            <td style={{width: '22%'}}>
                              <b>Водоснабжение</b>
                            </td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#water_provider_modal">Просмотр</a></td>
                          </tr>
                        }

                        {apz.commission.apz_heat_response &&
                          <tr>
                            <td>
                              <b>Теплоснабжение</b>
                            </td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#heat_provider_modal">Просмотр</a></td>
                          </tr>
                        }

                        {apz.commission.apz_electricity_response &&
                          <tr>
                            <td>
                              <b>Электроснабжение</b>
                            </td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#electricity_provider_modal">Просмотр</a></td>
                          </tr>
                        }

                        {apz.commission.apz_gas_response &&
                          <tr>
                            <td>
                              <b>Газоснабжение</b>
                            </td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#gas_provider_modal">Просмотр</a></td>
                          </tr>
                        }

                        {apz.commission.apz_phone_response &&
                          <tr>
                            <td>
                              <b>Телефонизация</b>
                            </td>
                            <td><a className="text-info pointer" data-toggle="modal" data-target="#phone_provider_modal">Просмотр</a></td>
                          </tr>
                        }
                      </tbody>
                    </table>

                    {apz.commission &&  apz.commission.apz_water_response &&
                      <div className="modal fade" id="water_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                {this.state.waterCustomTcFile && apz.commission.apz_water_response.response &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.waterCustomTcFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!this.state.waterCustomTcFile && apz.commission.apz_water_response.response &&
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

                                    {this.state.waterResponseFile &&
                                      <tr>
                                        <td><b>Загруженный ТУ</b></td>
                                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.waterResponseFile.id)}>Скачать</a></td>
                                      </tr>
                                    }

                                    <tr>
                                      <td><b>Сформированный ТУ</b></td>
                                      <td><a className="text-info pointer" onClick={this.printWaterTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!apz.commission.apz_water_response.response && this.state.waterResponseFile &&
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

                    {apz.commission && apz.commission.apz_heat_response &&
                      <div className="modal fade" id="heat_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                {this.state.heatCustomTcFile && apz.commission.apz_heat_response.response &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.heatCustomTcFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!this.state.heatCustomTcFile && apz.commission.apz_heat_response.response &&
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
                                      <td><b>Тепловые нагрузки по договору</b></td>
                                      <td>{apz.commission.apz_heat_response.load_contract_num}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Отопление по договору</b></td>
                                      <td>{apz.commission.apz_heat_response.main_in_contract}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Вентиляция по договору</b></td>
                                      <td>{apz.commission.apz_heat_response.ven_in_contract}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Горячее водоснабжение по договору (ср/ч)</b></td>
                                      <td>{apz.commission.apz_heat_response.water_in_contract}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Горячее водоснабжение по договору (макс/ч)</b></td>
                                      <td>{apz.commission.apz_heat_response.water_in_contract_max}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Дополнительное</b></td>
                                      <td>{apz.commission.apz_heat_response.addition}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Номер документа</b></td>
                                      <td>{apz.commission.apz_heat_response.doc_number}</td>
                                    </tr>

                                    {this.state.heatResponseFile &&
                                      <tr>
                                        <td><b>Загруженный ТУ</b>:</td>
                                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id)}>Скачать</a></td>
                                      </tr>
                                    }

                                    <tr>
                                      <td><b>Сформированный ТУ</b></td>
                                      <td><a className="text-info pointer" onClick={this.printHeatTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!apz.commission.apz_heat_response.response && this.state.heatResponseFile &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>МО Тепло</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.heatResponseFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }
                              </table>

                              {!this.state.heatCustomTcFile && apz.commission.apz_heat_response.response && apz.commission.apz_heat_response.blocks &&
                                <div>
                                  {apz.commission.apz_heat_response.blocks.map(function(item, index) {
                                    return(
                                      <div key={index}>
                                        {apz.commission.apz_heat_response.blocks.length > 1 &&
                                          <h5>Здание №{index + 1}</h5>
                                        }

                                        <table className="table table-bordered table-striped">
                                          <tbody>
                                            <tr>
                                              <td style={{width: '50%'}}><b>Отопление (Гкал/ч)</b></td>
                                              <td>{item.main}</td>
                                            </tr>
                                            <tr>
                                              <td><b>Вентиляция (Гкал/ч)</b></td>
                                              <td>{item.ven}</td>
                                            </tr>
                                            <tr>
                                              <td><b>Горячее водоснабжение (ср/ч)</b></td>
                                              <td>{item.water}</td>
                                            </tr>
                                            <tr>
                                              <td><b>Горячее водоснабжение (макс/ч)</b></td>
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
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    }

                    {apz.commission && apz.commission.apz_electricity_response &&
                      <div className="modal fade" id="electricity_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                {this.state.electroCustomTcFile && apz.commission.apz_electricity_response.response &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.electroCustomTcFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!this.state.electroCustomTcFile && apz.commission.apz_electricity_response.response &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>Требуемая мощность (кВт)</b></td>
                                      <td>{apz.commission.apz_electricity_response.req_power}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Характер нагрузки (фаза)</b></td>
                                      <td>{apz.commission.apz_electricity_response.phase}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Категория по надежности (кВт)</b></td>
                                      <td>{apz.commission.apz_electricity_response.safe_category}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Точка подключения</b></td>
                                      <td>{apz.commission.apz_electricity_response.connection_point}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Рекомендация</b></td>
                                      <td>{apz.commission.apz_electricity_response.recommendation}</td>
                                    </tr>
                                    <tr>
                                      <td><b>Номер документа</b></td>
                                      <td>{apz.commission.apz_electricity_response.doc_number}</td>
                                    </tr>

                                    {this.state.electroResponseFile &&
                                      <tr>
                                        <td><b>Загруженный ТУ</b>:</td>
                                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.electroResponseFile.id)}>Скачать</a></td>
                                      </tr>
                                    }

                                    <tr>
                                      <td><b>Сформированный ТУ</b></td>
                                      <td><a className="text-info pointer" onClick={this.printElectroTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!apz.commission.apz_electricity_response.response && this.state.electroResponseFile &&
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

                    {apz.commission && apz.commission.apz_gas_response &&
                      <div className="modal fade" id="gas_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                {this.state.gasCustomTcFile && apz.commission.apz_gas_response.response &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.gasCustomTcFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!this.state.gasCustomTcFile && apz.commission.apz_gas_response.response &&
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

                                    {this.state.gasResponseFile &&
                                      <tr>
                                        <td><b>Загруженный ТУ</b></td>
                                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.gasResponseFile.id)}>Скачать</a></td>
                                      </tr>
                                    }

                                    <tr>
                                      <td><b>Сформированный ТУ</b></td>
                                      <td><a className="text-info pointer" onClick={this.printGasTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!apz.commission.apz_gas_response.response && this.state.gasResponseFile &&
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

                    {apz.commission && apz.commission.apz_phone_response &&
                      <div className="modal fade" id="phone_provider_modal" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                {this.state.phoneCustomTcFile && apz.commission.apz_phone_response.response &&
                                  <tbody>
                                    <tr>
                                      <td style={{width: '50%'}}><b>Техническое условие</b></td>
                                      <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.phoneCustomTcFile.id)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!this.state.phoneCustomTcFile && apz.commission.apz_phone_response.response &&
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

                                    {this.state.phoneResponseFile &&
                                      <tr>
                                        <td><b>Загруженный ТУ</b></td>
                                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.phoneResponseFile.id)}>Скачать</a></td>
                                      </tr>
                                    }

                                    <tr>
                                      <td><b>Сформированный ТУ</b></td>
                                      <td><a className="text-info pointer" onClick={this.printPhoneTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                                    </tr>
                                  </tbody>
                                }

                                {!apz.commission.apz_phone_response.response && this.state.phoneResponseFile &&
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
              </div>
            }

            {apz.state_history.length > 0 &&
              <div>
                <h5 className="block-title-2 mb-3 mt-3">Логи</h5>
                <div className="border px-3 py-2">
                  {apz.state_history.map(function(state, index) {
                    return(
                      <div key={index}>
                        <p className="mb-0">{state.created_at}&emsp;{state.state.name}</p>
                      </div>
                    );
                  }.bind(this))}
                </div>
              </div>
            }

            {/*<h5 className="block-title-2 mt-5 mb-3">Статус</h5>
            <ShowStatusBar apz={this.state.apz} />*/}

            <div className="col-sm-12">
              <hr />
              <Link className="btn btn-outline-secondary pull-right" to={'/panel/citizen/apz/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
            </div>
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

class ShowMap extends React.Component {
  constructor(props) {
    super(props);

    this.toggleMap = this.toggleMap.bind(this);
  }

  toggleMap(value) {
    this.props.mapFunction(value);
  }

  changeState(name, value) {
    var data = {
      target: {name: name, value: value}
    };

    this.props.changeFunction(data);
  }

  saveCoordinates() {
    this.changeState('projectAddressCoordinates', $('#coordinates').html());

    this.props.hasCoordinates(true);

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
                <button type="button" className="btn btn-outline-secondary" onClick={this.toggleMap.bind(this, false)}>Закрыть карту</button>
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
              "esri/Map",
              "esri/layers/MapImageLayer",
              'esri/Graphic',
              'esri/config',
              'dojo/domReady!'
            ]}

            onReady={({loadedModules: [MapView, LayerList, WebScene, FeatureLayer, TileLayer, Search, WebMap, webMercatorUtils, dom, Map,
              MapImageLayer, Graphic, esriConfig], containerNode}) => {
              esriConfig.portalUrl = "https://gis.uaig.kz/arcgis";
              var map = new WebMap({
                basemap: "streets",
                portalItem: {
                  id: "0e8ae8f43ea94d358673e749f9a5e147"
                }
              });

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
                    //url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                    url: "https://gis.uaig.kz/server/rest/services/Map2d/объекты_города/MapServer/20",
                    popupTemplate: { // autocasts as new PopupTemplate()
                      title: `<table>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Кадастровый номер:</td>  <td class="attrValue">`+"{kad_n}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Код района:</td>  <td class="attrValue">`+"{coder}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Адрес:</td>  <td class="attrValue">`+"{adress}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Целевое назначение</td>  <td class="attrValue">`+"{funk}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Площадь зу:</td>  <td class="attrValue">`+"{s}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Право:</td>  <td class="attrValue">`+"{right_}"+`</td></tr>
                      </table>`
                    }
                  }),
                  searchFields: ["kad_n"],
                  displayField: "kad_n",
                  exactMatch: false,
                  outFields: ["*"],
                  name: "Кадастровый номер",
                  placeholder: "введите кадастровый номер",
                  maxResults: 6,
                  maxSuggestions: 6,
                  enableSuggestions: true,
                  minCharacters: 0
                },
                {
                  featureLayer: new FeatureLayer({
                    url: "https://gis.uaig.kz/server/rest/services/Map2d/Базовая_карта_MIL1/MapServer/16",
                    popupTemplate: {
                      title: `<table>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);width:100%"><td class="attrName">Адресный массив:</td>  <td class="attrValue">`+"{id_adr_massive}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Количество этажей:</td>  <td class="attrValue">`+"{floor}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Год постройки:</td>  <td class="attrValue">`+"{year_of_foundation}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Общая площадь:</td>  <td class="attrValue">`+"{obsch_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Объем здания, м3:</td>  <td class="attrValue">`+"{volume_build}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Площадь жил. помещения:</td>  <td class="attrValue">`+"{zhil_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Площадь застройки, м2:</td>  <td class="attrValue">`+"{zastr_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Наименование первичной улицы:</td>  <td class="attrValue">`+"{street_name_1}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Основной номер дома:</td>  <td class="attrValue">`+"{number_1}"+`</td></tr>
                      </table>`
                    }
                  }),
                  searchFields: ["street_name_1"],
                  displayField: "street_name_1",
                  exactMatch: false,
                  outFields: ["*"],
                  name: "Здания и сооружения",
                  placeholder: "введите адрес",
                  maxResults: 6,
                  maxSuggestions: 6,
                  enableSuggestions: true,
                  minCharacters: 0
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

class AddHeatBlock extends React.Component {
  deleteBlock(num) {
    this.props.deleteBlock(num)
  }

  componentWillMount() {
    $('.block_delete').css('display', 'none');
  }

  onBlockChange(e) {
    this.props.onBlockChange(e, this.props.num);
  }

  render() {
    return (
      <div className="col-md-12">
        <p style={{textTransform: 'uppercase', margin: '10px 0 5px'}}>
          Здание №<span className="block_num">{this.props.num}</span>

          {this.props.num != 1 &&
            <span style={{cursor: 'pointer', userSelect: 'none'}} className="block_delete pull-right text-secondary" onClick={this.deleteBlock.bind(this, this.props.num)}>Удалить</span>
          }
        </p>

        <div className="row" style={{background: '#efefef', margin: '0 0 20px', padding: '20px 0 10px'}}>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatMain">Отопление<br />(Гкал/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatMain} onChange={this.onBlockChange.bind(this)} name="heatMain" placeholder="" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatVentilation">Вентиляция<br />(Гкал/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatVentilation} onChange={this.onBlockChange.bind(this)} name="heatVentilation" placeholder="" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatWater">Горячее водоснабжение<br />(ср/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatWater} onChange={this.onBlockChange.bind(this)} name="heatWater" placeholder="" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatWaterMax">Горячее водоснабжение<br />(макс/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatWaterMax} onChange={this.onBlockChange.bind(this)} name="heatWaterMax" placeholder="" />
            </div>
          </div>
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
          <div className="progressBar container">
            <ul className="timeline">
              <li>
                <div className="timestamp">
                  <span>
                    <p>Районный архитектор</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Инженер</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Коммунальные службы</p>
                    <div className="status">
                      <div className="komStatus">
                                <ul>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">Алматы Су</span>
                                        </div>
                                    </li>
                                    <li className=" li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">Алматы Телеком</span>
                                        </div>
                                    </li>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/error.png" alt="error"/>
                                          <span className="author">Алатау Жарык Компаниясы</span>
                                        </div>
                                    </li>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">КазТрансГаз</span>
                                        </div>
                                    </li>
                                    <li className="li complete">
                                        <div className="timestamp">
                                          <img src="./images/success.png" alt="success"/>
                                          <span className="author">Тепловые сети Алматы</span>
                                        </div>
                                    </li>
                                </ul>
                      </div>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Инженер</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Отдел АПЗ</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
              <li>
                <div className="timestamp">
                  <span>
                    <p>Главный архитектор</p>
                    <div className="status">
                      <p>Одобрено</p>
                    </div>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <br />
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
