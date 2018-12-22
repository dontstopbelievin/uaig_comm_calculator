import React from 'react';

export default class CommissionAnswersList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apz: this.props.apz,
      waterResponseFile: null,
      phoneResponseFile: null,
      electroResponseFile: null,
      heatResponseFile: null,
      gasResponseFile: null,
      waterCustomTcFile: null,
      phoneCustomTcFile: null,
      electroCustomTcFile: null,
      heatCustomTcFile: null,
      gasCustomTcFile: null,
    };
  }

  componentWillMount() {
    this.getResponseFiles();
  }

  getResponseFiles() {
    var commission = this.state.apz.commission;

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
  }

  downloadFile(id) {
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/file/download/' + id, true);
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

    return (
      <div>
        <table className="table table-bordered table-striped">
          <tbody>
            {apz.commission.apz_water_response &&
              <tr>
                <td style={{width: '40%'}}>
                  <b>Водоснабжение</b>
                </td>
                <td><a className="text-info pointer" data-toggle="modal" data-target="#water_provider_modal">Просмотр</a></td>
              </tr>
            }

            {apz.commission.apz_heat_response &&
              <tr>
                <td style={{width: '40%'}}>
                  <b>Теплоснабжение</b>
                </td>
                <td><a className="text-info pointer" data-toggle="modal" data-target="#heat_provider_modal">Просмотр</a></td>
              </tr>
            }

            {apz.commission.apz_electricity_response &&
              <tr>
                <td style={{width: '40%'}}>
                  <b>Электроснабжение</b>
                </td>
                <td><a className="text-info pointer" data-toggle="modal" data-target="#electricity_provider_modal">Просмотр</a></td>
              </tr>
            }

            {apz.commission.apz_gas_response &&
               <tr>
                <td style={{width: '40%'}}>
                  <b>Газоснабжение</b>
                </td>
                <td><a className="text-info pointer" data-toggle="modal" data-target="#gas_provider_modal">Просмотр</a></td>
              </tr>
            }

            {apz.commission.apz_phone_response &&
              <tr>
                <td style={{width: '40%'}}>
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

                    {Boolean(!this.state.waterCustomTcFile) && Boolean(apz.commission.apz_water_response.response) &&
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
                    {!apz.commission.apz_water_response.response && !this.state.waterResponseFile &&
                      <tbody>
                        <tr>
                          <td style={{width: '50%'}}><b>Причина отказа</b></td>
                          <td>{apz.commission.apz_water_response.response_text}</td>
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

                    {Boolean(!this.state.heatCustomTcFile) && Boolean(apz.commission.apz_heat_response.response) &&
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
                    {!apz.commission.apz_heat_response.response && !this.state.heatResponseFile &&
                      <tbody>
                        <tr>
                          <td style={{width: '50%'}}><b>Причина отказа</b></td>
                          <td>{apz.commission.apz_heat_response.response_text}</td>
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

                  {Boolean(!this.state.heatCustomTcFile) && Boolean(apz.commission.apz_heat_response.response) && Boolean(apz.commission.apz_heat_response.blocks) &&
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
                          <td><b>Номер документа</b></td>
                          <td>{apz.commission.apz_electricity_response.doc_number}</td>
                        </tr>
                        <tr>
                          <td><b>Рекомендация</b></td>
                          <td>{apz.commission.apz_electricity_response.recommendation}</td>
                        </tr>
                        <tr>
                          <td style={{width: '50%'}}><b>Техническое условие</b></td>
                          <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.electroCustomTcFile.id)}>Скачать</a></td>
                        </tr>
                      </tbody>
                    }

                    {Boolean(!this.state.electroCustomTcFile) && Boolean(apz.commission.apz_electricity_response.response) &&
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
                    {!apz.commission.apz_electricity_response.response && !this.state.electroResponseFile &&
                      <tbody>
                        <tr>
                          <td style={{width: '50%'}}><b>Причина отказа</b></td>
                          <td>{apz.commission.apz_electricity_response.response_text}</td>
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
                          <td><b>Номер документа</b></td>
                          <td>{apz.commission.apz_gas_response.doc_number}</td>
                        </tr>
                        <tr>
                          <td><b>Предусмотрение</b></td>
                          <td>{apz.commission.apz_gas_response.reconsideration}</td>
                        </tr>
                        <tr>
                          <td style={{width: '50%'}}><b>Техническое условие</b></td>
                          <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.gasCustomTcFile.id)}>Скачать</a></td>
                        </tr>
                      </tbody>
                    }

                    {Boolean(!this.state.gasCustomTcFile) && Boolean(apz.commission.apz_gas_response.response) &&
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
                    {!apz.commission.apz_gas_response.response && !this.state.gasResponseFile &&
                      <tbody>
                        <tr>
                          <td style={{width: '50%'}}><b>Причина отказа</b></td>
                          <td>{apz.commission.apz_gas_response.response_text}</td>
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
                          <td><b>Номер документа</b></td>
                          <td>{apz.commission.apz_phone_response.doc_number}</td>
                        </tr>
                        <tr>
                          <td><b>Пожелания заказчика (тип оборудования, тип кабеля и др.)</b></td>
                          <td>{apz.commission.apz_phone_response.client_wishes}</td>
                        </tr>
                        <tr>
                          <td style={{width: '50%'}}><b>Техническое условие</b></td>
                          <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.phoneCustomTcFile.id)}>Скачать</a></td>
                        </tr>
                      </tbody>
                    }

                    {Boolean(!this.state.phoneCustomTcFile) && Boolean(apz.commission.apz_phone_response.response) &&
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
                    {!apz.commission.apz_phone_response.response && !this.state.phoneResponseFile &&
                      <tbody>
                        <tr>
                          <td style={{width: '50%'}}><b>Причина отказа</b></td>
                          <td>{apz.commission.apz_phone_response.response_text}</td>
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
    )
  }
}

