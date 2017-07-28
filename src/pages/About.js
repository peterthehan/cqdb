import React, { Component, } from 'react';
import {
  Col,
  Image,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

export default class About extends Component {
  render = () => {
    return (
      <Row>
        <Col lg={6} md={6} sm={12} xs={12}>
          <Panel>
            <Media>
              <Media.Body>
                <Media.Heading>Contacts</Media.Heading>
                <p>Discord: Miku#0039<br />Crusaders Quest: Saarja</p>
              </Media.Body>
              <Media.Right>
                <Image alt='' rounded src='https://avatars6.githubusercontent.com/u/16639331' width='128' />
              </Media.Right>
            </Media>
          </Panel>
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
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