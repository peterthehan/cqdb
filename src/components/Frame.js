import React, { Component, } from 'react';
import {
  Button,
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
  'Useful Links',
  'About',
];

const databasePages = [
  'Heroes',
  'Soulbound Weapons',
  'Weapons',
  'Skills',
  'Goddesses',
  'Bread',
  'Berries',
  'Interactions',
];

const toolsPages = [
  'Contract Pulling Simulator',
  'Sbw Forging Simulator',
  'Effective Attack Optimizer',
];

export default class Frame extends Component {
  renderItem = (i, isNavItem) => {
    return (
      <LinkContainer key={i} to={`/cqdb/${i.toLowerCase()}`}>
        {isNavItem ? <NavItem>{i}</NavItem> : <MenuItem>{i}</MenuItem>}
      </LinkContainer>
    );
  }

  renderNavDropdown = (pages, title) => {
    return (
      <NavDropdown id={title} key={title} title={title}>
        {pages.map(i => this.renderItem(i, false))}
      </NavDropdown>
    );
  }

  renderNavbar = () => {
    const pages = navPages.map(i => this.renderItem(i, true));
    pages.splice(0, 0, this.renderNavDropdown(toolsPages, 'Tools'));
    pages.splice(0, 0, this.renderNavDropdown(databasePages, 'Database'));

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
          <Navbar.Form pullRight style={{textAlign: 'center',}}>
            <Button bsStyle='primary' href='https://play.google.com/store/apps/details?id=com.nhnent.SKQUEST'>
              Android 3.10.6.KG
            </Button>
            &nbsp;
            <Button bsStyle='primary' href='https://itunes.apple.com/app/id901858272?mt=8'>
              iOS 3.10.5
            </Button>
          </Navbar.Form>
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
            Made with ❤ by <a href='https://github.com/Johj'>Peter</a>
          </p>
        </Col>
      </Row>
    );
  }

  render = () => {
    return (
      <div>
        {this.renderNavbar()}
        <div style={{marginBottom: 51,}}>&nbsp;</div>
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