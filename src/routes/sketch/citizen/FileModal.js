import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import '../../../assets/css/welcomeText.css';

export default class FileModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: []
    }

    this.getFiles = this.getFiles.bind(this);
    this.selectFile = this.selectFile.bind(this);
  }

  componentDidMount() {
    this.getFiles();
  }

  getFiles() {
    $.ajax({
      type: 'GET',
      url: window.url + 'api/file/category/' + this.props.category,
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      success: function (data) {
        this.setState({ files: data });
      }.bind(this)
    });
  }

  selectFile(e) {
    var row = $(e.target).closest('tr');
    var id = row.attr('data-id');
    var fileName = $('td:first', row).html();
    var fileBlock = $('.file_block', $('input[data-type=' + this.props.type + ']').parent());
    var html = '<div id="file_' + this.props.type + '">' + fileName + '<input type="hidden" name="file_list[]" value="' + id + '"><a href="#" onClick="document.getElementById(\'file_' + this.props.type + '\').remove(); return false;">&times;</a></div>';
    fileBlock.html(html);
    $('#selectFileModal' + this.props.type).modal('hide');
  }

  render() {
      return (
        <div className="modal fade" id={'selectFileModal' + this.props.type} tabIndex="-1" role="dialog" aria-hidden="true">
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
                    {this.state.files.map(function(file, index){
                        return(
                          <tr key={index} data-id={file.id}>
                            <td>{file.name}</td>
                            <td>{file.extension}</td>
                            <td><button onClick={this.selectFile} className="btn btn-success">Выбрать</button></td>
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
      )
    }
}
