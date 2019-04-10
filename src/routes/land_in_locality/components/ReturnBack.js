import React from 'react';

export default class ReturnBack extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
              <div className="modal fade" id="ReturnApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document">
                      <div className="modal-content">
                          <div className="modal-header">
                              <h5 className="modal-title">Вернуть заявку на доработку</h5>
                              <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                              </button>
                          </div>
                          <div className="modal-body">
                              <div className="form-group">
                                  <label htmlFor="docNumber">Комментарий</label>
                                  <input type="text" className="form-control" id="docNumber" placeholder="" value={this.props.description} onChange={this.props.onDescriptionChange} />
                              </div>
                          </div>
                          <div className="modal-footer">
                              <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.props.acceptDeclineApzForm}>Отправить</button>
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                          </div>
                      </div>
                  </div>
              </div>
      )
    }
  }
