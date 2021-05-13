import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';

export default class AddHeatBlock extends React.Component {
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

          {this.props.num !== 1 &&
            <span style={{cursor: 'pointer', userSelect: 'none'}} className="block_delete pull-right text-secondary" onClick={this.deleteBlock.bind(this, this.props.num)}>Удалить</span>
          }
        </p>

        <div className="row" style={{background: '#efefef', margin: '0 0 20px', padding: '20px 0 10px'}}>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatMain">Отопление (Гкал/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatMain} onChange={this.onBlockChange.bind(this)} name="heatMain" placeholder="" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatVentilation">Вентиляция (Гкал/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatVentilation} onChange={this.onBlockChange.bind(this)} name="heatVentilation" placeholder="" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatWater">Горячее водоснабжение, ср (Гкал/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatWater} onChange={this.onBlockChange.bind(this)} name="heatWater" placeholder="" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="HeatWaterMax">Горячее водоснабжение, макс (Гкал/ч)</label>
              <input type="number" step="any" className="form-control" value={this.props.item.heatWaterMax} onChange={this.onBlockChange.bind(this)} name="heatWaterMax" placeholder="" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
