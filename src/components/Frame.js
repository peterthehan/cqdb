import React, { Component, } from 'react';
import {
  Col,
  Grid,
  MenuItem,
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { imagePath, } from '../util/imagePath';

const navPages = [
  'Heroes',
  'Goddesses',
  'Bread',
  'Berries',
  'About',
];

const gachaPages = [
  'Premium Contracts',
  'Weapon Forging',
];

export default class Frame extends Component {
  renderItem = (i, isNavItem) => {
    return (
      <LinkContainer key={i} to={`/cqdb/${i.toLowerCase()}`}>
        {isNavItem ? <NavItem>{i}</NavItem> : <MenuItem>{i}</MenuItem>}
      </LinkContainer>
    );
  }

  renderNavDropdown = () => {
    return (
      <NavDropdown id='gacha' key='gacha' title='Gacha'>
        {gachaPages.map(i => this.renderItem(i, false))}
      </NavDropdown>
    );
  }

  renderNavbar = () => {
    const pages = navPages.map(i => this.renderItem(i, true));
    pages.splice(pages.length - 1, 0, this.renderNavDropdown());

    return (
      <Navbar collapseOnSelect fixedTop inverse>
        <Navbar.Header>
          <LinkContainer to='/cqdb'>
            <Navbar.Brand>
              <img alt='' src={imagePath('cqdb', 'public/favicon.png')} />
              cqdb
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>{pages}</Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  renderFooter = () => {
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <hr style={{borderColor: '#DDD',}} />  
          <p style={{textAlign: 'center',}}>
            Made with ❤ by <a href='https://github.com/Johj'>Peter</a>.
          </p>
        </Col>
      </Row>
    );
  }

  render = () => {
    return (
      <div>
        {this.renderNavbar()}
        <br /><br /><br /><p />
        <Grid fluid>
          <div className='content'>
            {this.props.children}
            {this.renderFooter()}
          </div>
        </Grid>
      </div>
    );
  }
}