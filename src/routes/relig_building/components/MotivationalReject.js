import React from 'react';
import ReactQuill from 'react-quill';

export default class ReturnBack extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
            <div className="modal fade" id="ReturnForm" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Мотивированный отказ</h5>
                    <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <b>Выберите главного архитектора:</b>
                    <select id="gas_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.props.head_id} onChange={this.props.handleHeadIDChange}>
                      {this.props.head_ids}
                    </select>
                    {this.props.templates && this.props.templates.length > 0 &&
                      <div className="form-group">
                        <select className="form-control" defaultValue="" id="templateList" onChange={this.props.onTemplateListChange}>
                          <option value="">Выберите шаблон</option>
                          {this.props.templates.map(function(template, index) {
                            return(
                              <option key={index} value={template.id}>{template.title}</option>
                              );
                            })
                          }
                        </select>
                      </div>
                    }
                    <div className="form-group">
                      <label>Тема(краткое описание)</label>
                      <div>
                        <input value={this.props.theme} onChange={this.props.onThemeChange} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Причина отказа</label>
                      <ReactQuill value={this.props.comment || ''} onChange={this.props.onCommentChange} formats={['formats/em','formats/hr', 'em', 'hr']} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-raised btn-success" style={{marginRight:'5px'}} onClick={this.props.acceptDeclineForm}>Отправить главному архитектору</button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
      )
    }
  }
