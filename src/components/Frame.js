import React, { Component, } from 'react';
import {
  Col,
  Grid,
  Label,
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
  'Skills',
  'Goddesses',
  'Bread',
  'Berries',
  'About',
];

const gachaPages = [
  'Contract Pulling Simulator',
  'SBW Forging Simulator',
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
          <div style={{textAlign: 'center',}}>
            <a href='https://play.google.com/store/apps/details?id=com.nhnent.SKQUEST'>
              <Label>Android 3.9.5.KG</Label>
            </a>
            &nbsp;
            <a href='https://itunes.apple.com/app/id901858272?mt=8'>
              <Label>iOS 3.9.4</Label>
            </a>
            <p />
            <p>
              Made with ❤ by <a href='https://github.com/Johj'>Peter</a>.
            </p>
          </div>
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