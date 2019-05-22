import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import Loader from 'react-loader-spinner';
import '../../../assets/css/welcomeText.css';
import ShowMap from '../components/ShowMap';
import Logs from "../../apz/components/Logs";
import AllInfo from '../components/AllInfo';
import Answers from '../components/Answers';

export default class ShowSketch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sketch: [],
      showMap: false,
      showMapText: 'Показать карту',
      loaderHidden: false,
      responseFile: false,
      personalIdFile:false,
      apzFile:false,
      sketchFilePDF: false,
      sketchFile:false,
      apzReturnedState: false,
      engineerReturnedState: false,
      lastDecisionIsMO:false
    };
  }

  componentDidMount() {
    this.props.breadCrumbs();
  }

  componentWillMount() {
    this.getSketchInfo();
  }

  getSketchInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');

    this.setState({ loaderHidden: false });

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/sketch/citizen/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var sketch = JSON.parse(xhr.responseText);
        //console.log(sketch);
        this.setState({sketch: sketch});
        this.setState({loaderHidden: true});

        this.setState({personalIdFile: sketch.files.filter(function(obj) {return obj.category_id === 3 })[0]});
        this.setState({apzFile: sketch.files.filter(function(obj) { return obj.category_id === 2 })[0]});
        this.setState({sketchFile: sketch.files.filter(function(obj) { return obj.category_id === 1 })[0]});
        this.setState({sketchFilePDF: sketch.files.filter(function(obj) { return obj.category_id === 40 })[0]});
        this.setState({engineerReturnedState: sketch.state_history.filter(function(obj) { return obj.state_id === 6})[0]});
        this.setState({apzReturnedState: sketch.state_history.filter(function(obj) { return obj.state_id === 17})[0]});

        for(var data_index = sketch.state_history.length-1; data_index >= 0; data_index--){
            switch (sketch.state_history[data_index].state_id) {
                case 2:
                    break;
                case 3:
                    this.setState({lastDecisionIsMO: true});
                    break;
                default:
                    continue;
            }
            break;
        }

        if (sketch.apz_department_response && sketch.apz_department_response.files) {
          this.setState({responseFile: sketch.apz_department_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
        }
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this)
    xhr.send();
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

  render() {
    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <AllInfo toggleMap={this.toggleMap.bind(this, true)} sketch={this.state.sketch} personalIdFile={this.state.personalIdFile}
              sketchFile={this.state.sketchFile} sketchFilePDF={this.state.sketchFilePDF} apzFile={this.state.apzFile}/>

            {this.state.showMap && <ShowMap mapId={"b5a3c97bd18442c1949ba5aefc4c1835"}/>}

            <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
              {this.state.showMapText}
            </button>

            <Answers  isSent={this.state.isSent} engineerReturnedState={this.state.engineerReturnedState} apzReturnedState={this.state.apzReturnedState}
            sketch_id={this.state.sketch.id} urban_response={this.state.sketch.urban_response} lastDecisionIsMO = {this.state.lastDecisionIsMO} />

            <Logs state_history={this.state.sketch.state_history} />

            <div className="col-sm-12">
              <hr />
              <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
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
