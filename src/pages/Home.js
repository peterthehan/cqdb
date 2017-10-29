import React, { Component, } from 'react';
import {
  Col,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

import { imagePath, } from '../util/imagePath';

export default class Home extends Component {
  render = () => {
    return (
      <Row>
        <Col
          style={{alignItems: 'center', display: 'flex', justifyContent: 'center',}}
          lg={12} md={12} sm={12} xs={12}
        >
          <img alt='' src={imagePath('src/assets/banner', 'cqdb')} style={{maxWidth: '100%',}} />
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Hello!</Media.Heading>
            Welcome to the Crusaders Quest Database.
          </Panel>
        </Col>
      </Row>
    );
  }
}
