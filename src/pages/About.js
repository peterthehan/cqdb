import React, { Component, } from 'react';
import {
  Col,
  Image,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

export default class About extends Component {
  render = () => {
    return (
      <Row>
        <Col lg={6} md={12} sm={12} xs={12}>
          <Panel>
            <Media.Heading>About Me</Media.Heading>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
              <text>I started on October 3, 2016.</text>
              <text>I'm currently at ~75000 fame.</text>
              <text>My go-to room number is 3939.</text>
              <br />
              <text>
                My favorite heroes are
              </text>
              <div>
                <LinkContainer to={`/cqdb/heroes/Principal%20Dancer%20Lee&6&Archer`}>
                  <img alt='' src='https://raw.githubusercontent.com/Johj/cq-assets/master/skins/cos_ar_15_8.png' width='33%' />
                </LinkContainer>
                <LinkContainer to={`/cqdb/heroes/Devil%20Bullet%20No.%209&6&Hunter`}>
                  <img alt='' src='https://raw.githubusercontent.com/Johj/cq-assets/master/skins/cos_hu_7_1.png' width='33%' />
                </LinkContainer>
                <LinkContainer to={`/cqdb/heroes/Vesper,%20Witch%20of%20Water&6&Wizard`}>
                  <img alt='' src='https://raw.githubusercontent.com/Johj/cq-assets/master/skins/cos_wi_16_14.png' width='33%' />
                </LinkContainer>
              </div>
            </div>
          </Panel>
        </Col>
        <Col lg={6} md={12} sm={12} xs={12}>
          <Panel>
            <Media>
              <Media.Body>
                <Media.Heading>Contacts</Media.Heading>
                <p>Discord: Miku#0039<br />Crusaders Quest: Saarja</p>
                <div>
                <a href="https://github.com/Johj" className="btn btn-social-icon btn-github">
                  <span className="fa fa-github"></span>
                </a>
                &nbsp;
                <a href="https://twitter.com/Johj_" className="btn btn-social-icon btn-twitter">
                  <span className="fa fa-twitter"></span>
                </a>
              </div>
              </Media.Body>
              <Media.Right>
                <Image alt='' rounded src='https://avatars6.githubusercontent.com/u/16639331' width='128' />
              </Media.Right>
            </Media>
          </Panel>
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
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