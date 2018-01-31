import React from 'react';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';

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
                </ul>
                <br/>

                <div className="tab-content">
                  <div id="menu1" className="tab-pane fade active show">
                    <p>Разработка проекта преобразования жилищно-гражданских объектов по проспекту Абая (от пр.Достык до р.Есентай)</p>
                    <a href="/docs/abay.pdf" className="btn btn-outline-primary" target="_blank">
                      Открыть календарный график
                    </a>
                    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScj6irispAI_eZL_zbnw7H5XDUFDYKx7JWbHZXk9j3rdvL3tw/viewform?embedded=true" width="100%" height="1300"  scrolling="no" frameborder="0" marginheight="0" marginwidth="0">Загрузка...</iframe>
                  </div>
                  <div id="menu2" className="tab-pane fade">
                    <p>Разработка проекта преобразования жилищно-гражданских объектов по улице Толе би ()</p>
                    <a href="/docs/tolebi.pdf" className="btn btn-outline-primary" target="_blank">
                      Открыть календарный график
                    </a>
                    
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    )
  }
}