import React, { Component, } from 'react';
import {
  Breadcrumb,
  Col,
  Nav,
  Navbar,
  NavItem,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

export default class Frame extends Component {
  navigationBar = () => {
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

  breadCrumb = (path) => {
    const pathArray = path.split('/').splice(1);
    const breadCrumbs = pathArray.map((currentValue, index) => {
      let label;
      if (currentValue.includes('&')) {
        const temp = currentValue.split('&');
        label = `${temp[0]} (${temp[1]}★)`;
      } else {
        label = currentValue;
      }
      label = decodeURIComponent(label);

      if (pathArray.length - 1 === index) {
        return (
          <Breadcrumb.Item key={index} active>
            {label}
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
    });

    return (
      <Breadcrumb>
        {breadCrumbs}
      </Breadcrumb>
    );
  }

  footer = () => {
    return (
      <Row>
        <Col md={12} sm={12} xs={12}>
          <hr />  
          <p style={{textAlign: 'center'}}>
            Made with ❤ by <a href='https://github.com/Johj'>Peter Han</a>.
          </p>
        </Col>
      </Row>
    );
  }

  render = () => {
    return (
      <div>
        {this.navigationBar()}
        <div className='content'>
          <br /><br /><br /><p />
          {this.breadCrumb(window.location.pathname)}
          {this.props.children}
          {this.footer()}
        </div>
      </div>
    );
  }
}