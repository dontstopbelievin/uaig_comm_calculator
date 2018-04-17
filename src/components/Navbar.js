import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <Navbar color="light" light expand="md" className="navStyle">
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink to={"/"} exact tag={RRNavLink} activeClassName="active" replace>ГЛАВНАЯ</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Деятельность управления
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Об Управлении
                </DropdownItem>
                <DropdownItem>
                  Государственные символы
                </DropdownItem>
                <DropdownItem>
                  Государственные закупки
                </DropdownItem>
                <DropdownItem>
                  Гражданское общество
                </DropdownItem>
                <DropdownItem>
                  Противодействие коррупции
                </DropdownItem>
                <DropdownItem>
                  Бюджетное планирование
                </DropdownItem>
                <DropdownItem>
                  Конституционные документы
                </DropdownItem>
                <DropdownItem>
                  Конституция РК
                </DropdownItem>
                <DropdownItem>
                  Стратегии и государственные программы РК
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Государственные услуги
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Согласование эскиза (эскизного проекта)
                </DropdownItem>
                <DropdownItem>
                  Отчет за 2017 год
                </DropdownItem>
                <DropdownItem>
                  Статистика выданных АПЗ в текущий <br />период времени
                </DropdownItem>
                <DropdownItem>
                  Виды государственных услуг
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Нормативно-правовая база
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Законы
                </DropdownItem>
                <DropdownItem>
                  Правила
                </DropdownItem>
                <DropdownItem>
                  Отчеты и обсуждения
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Опрос
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Реконструкция пешеходных улиц 2018
                </DropdownItem>
                <DropdownItem>
                  Дизайн код
                </DropdownItem>
                <DropdownItem>
                  Материалы градостроительного совета
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href="/map">Карта: 3D | 2D</NavLink>
            </NavItem>
            <NavItem>
              <NavLink exact to={"/doingBusiness"} tag={RRNavLink} activeClassName="active" replace>Doing business</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

/*import React from 'react';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <a className="navbar-brand" href="#">Navbar</a>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Pricing</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown link
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a className="dropdown-item" href="#">Action</a>
                <a className="dropdown-item" href="#">Another action</a>
                <a className="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}*/

/*import React from 'react';
import { Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink } from 'reactstrap';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <div>
        <Nav pills>
          <NavItem>
            <NavLink href="#" active>Link</NavLink>
          </NavItem>
          <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle nav caret>
              Dropdown
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavItem>
            <NavLink href="#">Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Another Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#">Disabled Link</NavLink>
          </NavItem>
        </Nav>
      </div>
    );
  }
}*/