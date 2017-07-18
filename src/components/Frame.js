import React, { Component, } from 'react';
import {
  Col,
  Grid,
  Nav,
  Navbar,
  NavItem,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

const pages = [
  'Heroes',
  'Goddesses',
  'Bread',
  'About',
];

export default class Frame extends Component {
  renderNavItem = (i, index) => {
    return (
      <LinkContainer key={i} to={`/cqdb/${i}`}>
        <NavItem eventKey={index}>{i}</NavItem>
      </LinkContainer>
    );
  }

  renderNavbar = () => {
    return (
      <Navbar collapseOnSelect fixedTop inverse>
        <Navbar.Header>
          <LinkContainer to='/cqdb'>
            <Navbar.Brand>cqdb</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>{pages.map(this.renderNavItem)}</Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  renderFooter = () => {
    return (
      <Row>
        <Col md={12} sm={12} xs={12}>
          <hr style={{borderColor: '#DDD'}} />  
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
            {this.props.children}
            {this.renderFooter()}
          </Grid>
        </div>
      </div>
    );
  }
}