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

  renderButton = (button) => {
    return (
      <Button bsStyle='primary' href={button.url} key={button.version}>
        {button.version}
      </Button>
    );
  }

  renderNavbar = () => {
    const databasePages = [
      'Heroes',
      'Portraits',
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
    const navPages = [
      'Useful Links',
      'About',
    ];
    const buttons = [
      { url: 'https://play.google.com/store/apps/details?id=com.nhnent.SKQUEST', version: 'Android 3.13.7.KG', },
      { url: 'https://itunes.apple.com/app/id901858272?mt=8', version: 'iOS 3.14.4', },
    ];

    return (
      <Navbar collapseOnSelect fixedTop inverse>
        <Navbar.Header>
          <LinkContainer to='/cqdb'>
            <Navbar.Brand>
              <img alt='' src={imagePath('public/favicon', 'cqdb')} />
              cqdb
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            {[
              this.renderNavDropdown(databasePages, 'Database'),
              this.renderNavDropdown(toolsPages, 'Tools'),
              navPages.map(i => this.renderItem(i, true)),
            ]}
          </Nav>
          <Navbar.Form pullRight style={{textAlign: 'center',}}>
            {buttons.map(i => [this.renderButton(i), '\xa0',])}
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
