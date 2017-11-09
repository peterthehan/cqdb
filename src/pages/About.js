import React, { Component, } from 'react';
import {
  Col,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

export default class About extends Component {
  render = () => {
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Disclaimer</Media.Heading>
            This site is not affiliated, associated, authorized by, endorsed by, or in any way officially connected with NHN Entertainment Corp., LoadComplete Inc., or any of their subsidiaries or their affiliates.
            <br /><br />
            For official game support, visit <a href='https://hangame.zendesk.com/hc/en-us/requests/new'>here</a>.
          </Panel>
        </Col>
      </Row>
    );
  }
}
