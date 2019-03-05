import React from 'react';
import EsriLoaderReact from 'esri-loader-react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import { Route, Link, NavLink, Switch } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactHintFactory from "react-hint";
import '../../../assets/css/welcomeText.css';
import AddSketch from './AddSketch';
import AllSketch from './AllSketch';
import FileModal from './FileModal';
import FilesForm from './FilesForm';
import ShowMap from './ShowMap';
import ShowSketch from './ShowSketch';

const ReactHint = ReactHintFactory(React)

export default class SketchCitizen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      welcome_text: true,
      left_tabs: true,
      active: false
    };
  }
  componentWillMount(){
    if(this.props.history.location.pathname !== "/panel/citizen/sketch"){
      this.setState({welcome_text:false,left_tabs: false});
    }
  }

  hide_text(){
    this.setState({welcome_text:false, left_tabs: false});
    this.props.history.push("/panel/citizen/sketch/status/active/1");
  }

  toggle(){
    this.setState({active: true})
  }


  render() {
    return (
      <div className="content container body-content citizen-sketch-list-page">

        <div>
        <div className="left-tabs">
        {this.state.left_tabs &&
          <div className="buttons">
              <Link to="/panel/citizen/apz"><button className="tab1">Выдача архитектурно-планировочного задания</button></Link>
              <Link to="/panel/citizen/sketch"><button onClick="toggle()" className={this.state.active === false ? 'isactive2' : 'tab2'}>Выдача решения на эскизный проект</button></Link>
              <Link to="/panel/citizen/photoreports"><button className="tab3">Выдача решения на фотоотчет</button></Link>
              <Link to="/"><button className="tab4">Выдача справки по определению адреса объектов недвижимости</button></Link>
              <Link to="/"><button className="tab5">Выдача решения о строительстве культовых зданий (сооружений), определении их месторасположения</button></Link>
              <Link to="/"><button className="tab6">Выдача решения о перепрофилировании (изменении функционального назначения) зданий (сооружений) в культовые здания (сооружения)</button></Link>
              <Link to="/"><button className="tab7">Предоставление земельного участка для строительства объекта в черте населенного пункта</button></Link>
          </div>
        }
        </div>
        <div className="right-side">
        {this.state.welcome_text &&
          <div className="apzinfo">
            <div class = "time">
               <p><strong>Эскизный проект</strong> – это набор документов, схем и чертежей, который содержит данные о разрабатываемом объекте, его назначении, основные технические, архитектурные и конструктивные параметры. Это упрощенный вид проектного решения, объясняющий его замысел и позволяющий составить представление о дальнейших работах.</p>
            </div>
            <div className="packages">
               <p><strong>Срок рассмотрения заявления:</strong></p>
               <li>1.	Срок рассмотрения заявления и согласования эскиза (эскизного проекта) технически и (или) технологически несложных объектов – 10 (десять) рабочих дней.</li>
               <li>2.	Срок рассмотрения заявления и согласования эскиза (эскизного проекта) технически и (или) технологически сложных объектов – 15 (пятнадцать) рабочих дней.</li>
               <li>3.	Срок рассмотрения заявления и согласования эскиза (эскизного проекта) при изменении внешнего облика (фасадов) существующего объекта – 15 (пятнадцать) рабочих дней.</li>
               <div>Мотивированный отказ – 5 (пять) рабочих дней</div>
               <br></br>
               <p><strong>Необходимый перечень документов для получения услуги:</strong></p>
               <li>1.	заявление о предоставлении государственной услуги (заполняется онлайн);</li>
               <li>2.	электронная копия документа удостоверяющего личность;</li>
               <li>3.	электронная копия эскиза (эскизный проект);</li>
               <li>4.	копия архитектурно-планировочного задания;</li>
            </div>
            <div className="apzinfo-bottom">
              <button className="btn btn-raised btn-success" onClick={this.hide_text.bind(this)}>Перейти к заявкам</button>
            </div>
          </div>
        }
        </div>

          <div className="card-body">

            <Switch>
                <Route path="/panel/citizen/sketch/status/:status/:page" exact render={(props) =>(
                <AllSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/sketch/add" exact render={(props) =>(
                <AddSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/sketch/edit/:id" exact render={(props) =>(
                <AddSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/citizen/sketch/show/:id" exact render={(props) =>(
                <ShowSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              {/*<Redirect from="/panel/citizen/sketch" to="/panel/citizen/sketch/status/active/1" />*/}
            </Switch>

          </div>


        </div>

      </div>
    )
  }
}
