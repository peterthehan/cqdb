import React, { Component, } from 'react';
import {
  Col,
  Grid,
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

import { countInstances, } from '../util/countInstances';
import { imagePath, } from '../util/imagePath';
import { resolve, } from '../util/resolve';
const data = require('../Decrypted/get_sister.json')
  .sister
  .filter(i => countInstances(i.id, '_') === 1);

export default class Goddesses extends Component {
  state = {
    render: [],
  }

  componentWillMount = () => {
    const render = this.initializeItems();
    this.setState({ render, });
  }

  initializeItems = () => {
    const processedData = data.map(i => {
      const name = resolve(i.name);
      const skillName = resolve(i.skillname);
      const skillDescription = resolve(i.skilldesc);
      const image = i.id;

      const listItem = (
        <ListGroupItem key={i.id}>
          <Media>
            <Grid fluid>
              <Row>
                <Col style={{padding: 0,}} lg={2} md={3} sm={4} xs={5}>
                  <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                    <img alt='' src={imagePath('cq-assets', `goddesses/${image}.png`)} />
                  </Media.Left>
                </Col>
                <Col style={{padding: 0,}} lg={10} md={9} sm={8} xs={7}>
                  <Media.Body>
                    <Media.Heading>{`${name} - ${skillName}`}</Media.Heading>
                    <p>{skillDescription}</p>
                  </Media.Body>
                </Col>
              </Row>
            </Grid>
          </Media>
        </ListGroupItem>
      );

      return listItem;
    });

    return processedData;
  }

  render = () => {
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel collapsible defaultExpanded header={`Goddesses (${this.state.render.length})`}>
            <ListGroup fill>
              {this.state.render}
            </ListGroup>
          </Panel>
        </Col>
      </Row>
    );
  }
}
