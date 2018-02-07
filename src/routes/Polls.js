import React from 'react';
//import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';

export default class Polls extends React.Component {
  
  render() {
    return (
      <div className="content container project-page">
        <div className="card">
          <div className="card-header"><h4 className="mb-0">Реконструкция пешеходных улиц</h4></div>
          <div className="card-body">
            <div className="modal-body">
              <ul className="nav nav-tabs">
                <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#menu1">пр. Абая</a></li>
                <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#menu2">ул. Толе би</a></li>
                <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#menu3">пр. Абылайхана</a></li>
                <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#menu4">пр. Назарбаева</a></li>
              </ul>
              <br/>

              <div className="tab-content">
                <div id="menu1" className="tab-pane fade active show">
                  <p>Разработка проекта преобразования жилищно-гражданских объектов по проспекту Абая (от пр.Достык до р.Есентай)</p>
                  <a href="/docs/abay.pdf" className="btn btn-outline-primary" target="_blank">
                    Календарный график
                  </a>&nbsp;
                  <a href="/docs/genplanAbay.pdf" className="btn btn-outline-primary" target="_blank">
                    Генеральный план
                  </a>&nbsp;
                  <a href="/docs/oporAbay.pdf" className="btn btn-outline-primary" target="_blank">
                    Опорный план
                  </a>&nbsp;
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLScj6irispAI_eZL_zbnw7H5XDUFDYKx7JWbHZXk9j3rdvL3tw/viewanalytics" className="btn btn-outline-danger" target="_blank">
                    Результаты опроса
                  </a>
                  <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScj6irispAI_eZL_zbnw7H5XDUFDYKx7JWbHZXk9j3rdvL3tw/viewform?embedded=true" width="100%" height="1300"  scrolling="no" frameborder="0" marginheight="0" marginwidth="0">Загрузка...</iframe>
                </div>
                <div id="menu2" className="tab-pane fade">
                  <p>Разработка проекта преобразования жилищно-гражданских объектов по улице Толе би ()</p>
                  <a href="/docs/tolebi.pdf" className="btn btn-outline-primary" target="_blank">
                    Календарный график
                  </a>
                </div>
                <div id="menu3" className="tab-pane fade">
                  <p>Разработка проекта преобразования жилищно-гражданских объектов по проспекту Абылайхана (восточная сторона)</p>
                  <a href="/docs/abylaikhan.pdf" className="btn btn-outline-primary" target="_blank">
                    Календарный график
                  </a>&nbsp;
                  <a href="/docs/genplanAbylaikhan.pdf" className="btn btn-outline-primary" target="_blank">
                    Генеральный план
                  </a>&nbsp;
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLSd7736i1Yl1kq5F5CzrRiwSL12_M4Ki-XUMAtXQZ-e4ACN1dw/viewanalytics" className="btn btn-outline-danger" target="_blank">
                    Результаты опроса
                  </a>
                  <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSd7736i1Yl1kq5F5CzrRiwSL12_M4Ki-XUMAtXQZ-e4ACN1dw/viewform?embedded=true" width="100%" height="1800" frameborder="0" marginheight="0" marginwidth="0">Загрузка...</iframe>
                </div>
                <div id="menu4" className="tab-pane fade">
                  <p>Разработка проекта преобразования жилищно-гражданских объектов по проспекту Назарбаева</p>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLSewysngv_cSWrkyFkuXGlD59FPolXQneLZb4uXB4AE2SEtWGQ/viewanalytics" className="btn btn-outline-danger" target="_blank">
                    Результаты опроса
                  </a>
                  <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSewysngv_cSWrkyFkuXGlD59FPolXQneLZb4uXB4AE2SEtWGQ/viewform?embedded=true" width="100%" height="1800" frameborder="0" marginheight="0" marginwidth="0">Загрузка...</iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}