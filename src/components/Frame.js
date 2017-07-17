import React, { Component, } from 'react';
import {
  Breadcrumb,
  Col,
  Grid,
  Nav,
  Navbar,
  NavItem,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

export default class Frame extends Component {
  renderNavbar = () => {
    return (
      <Navbar collapseOnSelect fixedTop inverse>
        <Navbar.Header>
          <LinkContainer to='/cqdb'>
            <Navbar.Brand>
              cqdb
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to='/cqdb/heroes'>
              <NavItem eventKey={1}>
                Heroes
              </NavItem>
            </LinkContainer>
            <LinkContainer to='/cqdb/about'>
              <NavItem eventKey={2}>
                About
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  renderBreadCrumb = (i, index, pathArray) => {
    let label;
    if (i.includes('&')) {
      const temp = i.split('&');
      label = `${temp[0]} (${temp[1]}★)`;
    } else {
      label = i;
    }
    label = decodeURIComponent(label);

    if (pathArray.length - 1 === index) {
      return (
        <Breadcrumb.Item active key={index}>
          <strong>{label}</strong>
        </Breadcrumb.Item>
      );
    }

    return (
      <LinkContainer key={index} to={'/' + pathArray.slice(0, index + 1).join('/')}>
        <Breadcrumb.Item key={index}>
          {label}
        </Breadcrumb.Item>
      </LinkContainer>
    );
  }

  renderBreadCrumbs = () => {
    const path = window.location.pathname;
    const pathArray = path.split('/').splice(1);
    return (
      <Row>
        <Col md={12} sm={12} xs={12}>
          <Breadcrumb style={{backgroundColor: '#F5F5F5'}}>
            {pathArray.map((i, j) => this.renderBreadCrumb(i, j, pathArray))}
          </Breadcrumb>
        </Col>
      </Row>
    );
  }

  renderFooter = () => {
    return (
      <Row>
        <Col md={12} sm={12} xs={12}>
          <hr />  
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
        <div className='content'>
          <Grid fluid>
            {this.renderBreadCrumbs(window.location.pathname)}
            {this.props.children}
            {this.renderFooter()}
          </Grid>
        </div>
      </div>
    );
  }
}