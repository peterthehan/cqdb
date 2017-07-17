import React, { Component, } from 'react';
import {
  Col,
  Image,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

// for creating list
const dep = [
  'bootstrap: 3.3.7',
  'react: 15.6.1',
  'react-bootstrap: 0.31.0',
  'react-dom: 15.6.1',
  'react-list: 0.8.6',
  'react-router-bootstrap: 0.24.2',
  'react-router-dom: 4.1.1',
];
const npm = [
  'https://www.npmjs.com/package/bootstrap',
  'https://www.npmjs.com/package/react',
  'https://www.npmjs.com/package/react-bootstrap',
  'https://www.npmjs.com/package/react-dom',
  'https://www.npmjs.com/package/react-list',
  'https://www.npmjs.com/package/react-router-bootstrap',
  'https://www.npmjs.com/package/react-router-dom',
];

export default class About extends Component {
  renderDependencies = (i, index) => {
    return (
      <a href={npm[index]} key={index}>{i}<br /></a>
    );
  }

  render = () => {
    return (
      <Row>
        <Col md={6} sm={12} xs={12}>
          <Panel>
            <Media>
              <Media.Body>
                <Media.Heading>Contacts</Media.Heading>
                <p>Discord: Miku#0039<br />Crusaders Quest: Saarja</p>
              </Media.Body>
              <Media.Right>
                <Image alt='' rounded src='https://avatars6.githubusercontent.com/u/16639331?v=4&s=460' width='128' />
              </Media.Right>
            </Media>
          </Panel>
        </Col>
        <Col md={6} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Dependencies</Media.Heading>
            {dep.map(this.renderDependencies)}
          </Panel>
        </Col>
        <Col md={12} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Disclaimer</Media.Heading>
            <p>
              This site is not affiliated, associated, authorized by, endorsed by, or in any way officially connected with NHN Entertainment Corp., or LoadComplete Inc., or any of their subsidiaries or their affiliates.
            </p>
          </Panel>
        </Col>
      </Row>
    );
  }
}