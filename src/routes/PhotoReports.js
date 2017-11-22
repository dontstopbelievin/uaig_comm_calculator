import React from 'react';
import { Route, NavLink, Switch, Redirect} from 'react-router-dom';

class PhotoReportForm extends React.Component {
  constructor() {
    super();
    this.state = {
      cname: "",
      address: "",
      dfrom: "",
      dto: ""
    }
    
    this.sendForm = this.sendForm.bind(this);
    this.onCompanyNameChange = this.onCompanyNameChange.bind(this);
    this.onAddressChange = this.onAddressChange.bind(this);
    this.onDurFromChange = this.onDurFromChange.bind(this);
    this.onDurToChange = this.onDurToChange.bind(this);
  }

  onCompanyNameChange(e) {
    this.setState({cname: e.target.value});
  }

  onAddressChange(e) {
    this.setState({address: e.target.value});
  }

  onDurFromChange(e) {
    this.setState({dfrom: e.target.value});
    
  }

  onDurToChange(e) {
    this.setState({dto: e.target.value});
  }

  sendForm() {
    console.log(this.props);
    this.props.history.push('/photoreports/consideration');
    window.changeComName(this.state.cname);
    window.changeDurFrom(this.state.dfrom);
    window.changeDurTo(this.state.dto);
    window.changeAddress(this.state.address);
  }
  
  render() {
    return (
      <div>
        <form>
          <h3 style={{textAlign: 'center', padding: '15px'}}>Заявление для получения фотоотчета</h3>
          <div className="row">
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="Company">От ТОО/ИП</label>
                <input type="text" className="form-control" required placeholder="Компания" value={this.state.cname} onChange={this.onCompanyNameChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="Address">Адрес: г.Алматы , уг., уг.</label>
                <input type="text" className="form-control" required placeholder="Адрес" value={this.state.address} onChange={this.onAddressChange} />
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="Region">Район</label>
                <input type="text" className="form-control" required id="PhotoRepRegion" name="Region" placeholder="Регион" />
              </div>
              <div className="form-group">
                <label htmlFor="Id">ИИН/БИН</label>
                <input type="number" className="form-control" required id="PhotoRepId" name="Id" placeholder="ИИН/БИН" />
              </div>
              <div className="form-group">
                <label htmlFor="Phone">Телефон</label>
                <input type="tel" className="form-control" required id="PhotoRepPhone" name="Phone" placeholder="Телефон" />
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="Duration">Период с</label>
                <input type="date" className="form-control" required placeholder="Период" value={this.state.dfrom} onChange={this.onDurFromChange} />
                <label htmlFor="Duration">до</label>
                <input type="date" className="form-control" required placeholder="Период" value={this.state.dto} onChange={this.onDurToChange} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4" />
            <div className="col-4">
              <button type="button" className="btn btn-outline-secondary" style={{marginRight: '2px'}}>Отмена</button>
              <button type="button" className="btn btn-outline-success" onClick={this.sendForm}>Отправить заявку</button>
            </div>
            <div className="col-4" />
          </div>
        </form>
      </div>
    )
  }
}

class Consideration extends React.Component {
  constructor() {
    super();
    
    this.sendConsideration = this.sendConsideration.bind(this);
  }

  sendConsideration() {
    console.log(this.props);
    this.props.router.push('/photoReports/answer');
  }

  render() {
    return (
      <div>
        <form>
          <div className="row">
            <div className="col-2" />
            <div className="col-8">
              <div className="form-group">
                <label htmlFor="Consideration"></label>
                <input type="text" className="form-control" required id="PhotoRepConsideration" name="Consideration" placeholder="Текст на рассмотрение" />
              </div>
              <div className="form-group">
                <label htmlFor="PhotoFile">Прикрепить файл</label>
                <input type="file" className="form-control" required id="PhotoRepAttachedFile" name="PhotoFile" />
              </div>
            </div>
            <div className="col-2" />
          </div>
          <div className="row">
            <div className="col-4" />
            <div className="col-4">
              <button type="button" className="btn btn-outline-danger" style={{marginRight: '2px'}}>Отмена</button>
              <button type="button" className="btn btn-outline-success" onClick={this.sendConsideration}>Отправить</button>
            </div>
            <div className="col-4" />
          </div>
        </form>
      </div>
    )
  }
}

class Answer extends React.Component {
  render() {
    return (
      <div className="container">
        <div style={{textAlign: 'center', marginTop: '15px'}}>
          <h5>{window.companyName}</h5>
          <span className="help-block">г. Алматы, {window.address}</span>
        </div><br />
        <p style={{fontSize: '18px'}}>Управление архитектуры и градостроительства города Алматы,
          рассмотрев Ваше обращение от <strong>{window.durFrom}</strong> № ЖТ-Ц- 856 направляет
          Вам фотографии объектов наружной (визуальной) рекламы.
          Вместе с тем, сообщаем, что сведения в органы государственных доходов
          Управлением подаются без указания наименования и ИИН (БИН)
          налогоплательщика.
          В соответствии с п. 6 ст. 14 Закона Республики Казахстан «О порядке
          рассмотрения обращений физических и юридических лиц» Вы имеете право
          обжаловать действие (бездействие) должностных лиц либо решение, принятое
          по обращению.
        </p>
      </div>
    )
  }
}

export default class PhotoReport extends React.Component {
  constructor() {
    super();
    this.state = {
      companyName: "",
      add: "",
      durFrom: "",
      durTo: ""
    }
    
    this.updateCompanyName = this.updateCompanyName.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.updateDurFrom = this.updateDurFrom.bind(this);
    this.updateDurTo = this.updateDurTo.bind(this);
  }

  updateCompanyName(compName) {
    this.setState({companyName: compName})
  }

  updateAddress(address) {
    this.setState({add: address})
  }

  updateDurFrom(dFrom) {
    this.setState({durFrom: dFrom})
  }

  updateDurTo(dTo) {
    this.setState({durTo: dTo})
  }

  componentWillMount() {
    //console.log("PhotoReport will mount");
  }

  componentDidMount() {
    //console.log("PhotoReport did mount");
  }

  componentWillUnmount() {
    //console.log("PhotoReport will unmount");
  }

  render() {
    //console.log("rendering the PhotoReport");
    window.companyName = this.state.companyName;
    window.address = this.state.add;
    window.durFrom = this.state.durFrom;
    window.durTo = this.state.durTo;
    window.changeComName = this.updateCompanyName;
    window.changeAddress = this.updateAddress;
    window.changeDurFrom = this.updateDurFrom;
    window.changeDurTo = this.updateDurTo;
    return (
      <div className="container">
        <ul className="header">
          <li><NavLink exact activeClassName="active" activeStyle={{color:"black"}} to="/photoReports/form" replace>Заявление</NavLink></li>
          <li><NavLink activeClassName="active" activeStyle={{color:"black"}} to="/photoReports/consideration" replace>Рассмотрение</NavLink></li>
          <li><NavLink activeClassName="active" activeStyle={{color:"black"}} to="/photoReports/answer" replace>Ответ</NavLink></li>
        </ul>
        <Switch>
          <Route path="/photoreports/form" component={PhotoReportForm} />
          <Route path="/photoreports/consideration" component={Consideration} />
          <Route path="/photoreports/answer" component={Answer} />
          <Redirect from="/photoReports" to="/photoReports/form" />
        </Switch>
      </div>
    )
  }
}