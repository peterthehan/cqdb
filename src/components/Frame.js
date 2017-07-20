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

const pages = [
  'Heroes',
  'Goddesses',
  'Bread',
  'Berries',
  'About',
];

export default class Frame extends Component {
  renderNavItem = (i) => {
    return (
      <LinkContainer key={i} to={`/cqdb/${i.toLowerCase()}`}>
        <NavItem>{i}</NavItem>
      </LinkContainer>
    );
  }

  renderNavDropdown = () => {
    return (
      <NavDropdown id='gacha' key='gacha' title='Gacha'>
        <LinkContainer to={`/cqdb/gacha-premium contracts`}>
          <MenuItem>Premium Contracts</MenuItem>
        </LinkContainer>
        <LinkContainer to={`/cqdb/gacha-weapon forging`}>
          <MenuItem>Weapon Forging</MenuItem>
        </LinkContainer>
      </NavDropdown>
    );
  }

  renderNavbar = () => {
    const items = pages.map(this.renderNavItem);
    items.splice(items.length - 1, 0, this.renderNavDropdown());

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
          <Nav>{items}</Nav>
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
            Made with ❤ by <a href='https://github.com/Johj'>Peter Han</a>.
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