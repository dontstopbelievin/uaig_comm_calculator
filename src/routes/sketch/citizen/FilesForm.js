import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import '../../../assets/css/welcomeText.css';


export default class FilesForm extends React.Component {
  constructor(props) {
    super(props);

    this.uploadFile = this.uploadFile.bind(this);
    this.selectFromList = this.selectFromList.bind(this);
  }

  uploadFile(e) {
    var file = e.target.files[0];
    var name = file.name.replace(/\.[^/.]+$/, "");
    var category = this.props.category;
    var progressbar = $('.progress[data-category=' + category + ']');
    var type = this.props.type;
    var row = $(e.target).closest('.list-group-item');
    var fileBlock = $('.file_block', row);

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
      success: function (data) {
        var html = '<div id="file_' + type + '">' + data.name + '<input type="hidden" name="file_list[]" value="' + data.id + '"><a href="#" onClick="document.getElementById(\'file_' + type + '\').remove(); return false;">&times;</a></div>';

        setTimeout(function() {
          progressbar.css('display', 'none');
          fileBlock.html(html);
          alert("Файл успешно загружен");
        }, '1000');
      },
      error: function (response) {
        progressbar.css('display', 'none');
        alert("Не удалось загрузить файл");
      }
    });
  }

  selectFromList() {
    $('#selectFileModal' + this.props.type).modal('show');
  }

  render() {
    return (
      <div className="row mt-3 buttons">
        <div className="mx-auto">
          <label htmlFor={'upload_file' + this.props.type} className="btn btn-success" style={{marginRight: '2px'}}>Загрузить</label>
          <input id={'upload_file' + this.props.type} onChange={this.uploadFile} type="file" style={{display: 'none'}} />
          <button type="button" onClick={this.selectFromList} className="btn btn-info">Выбрать из списка</button>
        </div>
      </div>
    )
  }
}
