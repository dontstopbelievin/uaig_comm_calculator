import React from 'react';

export default class Project extends React.Component {
  
  render() {
    return (
      <div className="container">
        <form>
          <h3 style={{textAlign: 'center', padding: '15px'}}>Заявление эскизного проекта</h3>
          <div className="row">
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="Applicant">Наименование заявителя:</label>
                <input type="text" className="form-control" required name="Applicant" placeholder="Наименование" />
                <span className="help-block">Ф.И.О. (при его наличии) физического лица <br />или наименование юридического лица</span>
              </div>
              <div className="form-group">
                <label htmlFor="Address">Адрес:</label>
                <input type="text" className="form-control" required id="PhotoRepAddressForm" name="Address" placeholder="Адрес" />
              </div>
              <div className="form-group">
                <label htmlFor="Phone">Телефон</label>
                <input type="tel" className="form-control" required id="PhotoRepPhone" name="Phone" placeholder="Телефон" />
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="Customer">Заказчик</label>
                <input type="text" className="form-control" name="Customer" placeholder="Заказчик" />
              </div>
              <div className="form-group">
                <label htmlFor="Designer">Проектировщик №ГСЛ, категория</label>
                <input type="text" className="form-control" name="Designer" />
              </div>
              <div className="form-group">
                <label htmlFor="ProjectName">Наименование проектируемого объекта</label>
                <input type="text" className="form-control" id="ProjectName" name="ProjectName" />
              </div>
              <div className="form-group">
                <label htmlFor="ProjectAddress">Адрес проектируемого объекта</label>
                <input type="text" className="form-control" name="ProjectAddress" />
              </div>
            </div>
            <div className="col-4">
              <p>Прилагается:</p>
              <div className="form-group">
                <label><input type="checkbox" value="" />   Эскиз (эскизный проект)</label>
              </div>
              <div className="form-group">
                <label><input type="checkbox" value="" />   Архитектурно-планировочное задание (копия)</label>
              </div>
              <div className="form-group">
                <label><input type="checkbox" value="" />   Удостверение личности (копия)</label>
              </div>
              <div className="form-group">
                <label><input type="checkbox" value="" />   Удостверение личности поверенного (копия)</label>
              </div>
              <div className="form-group">
                <label><input type="checkbox" value="" />   Доверенность (копия)</label>
              </div>
              <div className="form-group">
                <label>Дата</label>
                <input type="date" className="form-control" required />
                <label htmlFor="Duration">до</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4" />
            <div className="col-4">
              <button type="button" className="btn btn-outline-secondary" style={{marginRight: '2px'}}>Отмена</button>
              <button type="button" className="btn btn-outline-success">Отправить заявку</button>
            </div>
            <div className="col-4" />
          </div>
        </form>
      </div>
    )
  }
}