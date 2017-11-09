import React, { Component, } from 'react';
import {
  Col,
  Grid,
  Image,
  Panel,
  Row,
} from 'react-bootstrap';
 
import { imagePath, } from '../util/imagePath';

export default class NoMatch extends Component {
  render = () => {
    return (
      <Panel>
        <Grid fluid>
          <Row style={{display: 'flex', alignItems: 'center',}}>
            <Col lg={2} md={2} smHidden xsHidden></Col>
            <Col lg={4} md={4} sm={12} xs={12}>
              <img alt='' src={imagePath('public/favicon', 'cqdb')} />
              <p />
              <p>
                <b>404.</b>
                <text style={{color: '#777'}}> Oops! My hands slipped!</text>
              </p>
              <p />
              <p style={{wordWrap: 'break-word'}}>
                {`The requested URL ${window.location.pathname.replace(/\/404$/, '')} was not found on this server.`}
                <text style={{color: '#777'}}> That's all we know.</text>
              </p>
            </Col>
            <Col lg={4} md={4} smHidden xsHidden>
              <Image alt='' responsive src={imagePath('src/assets/fergus_cutout', 'cqdb')} />
            </Col>
            <Col lg={2} md={2} smHidden xsHidden></Col>
          </Row>
        </Grid>
      </Panel>
    );
  }
}
