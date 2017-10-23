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

import { imagePath, } from '../util/imagePath';
import { resolve, } from '../util/resolve';

const goddessData = require('../Decrypted/filtered_sister.json');

const data = goddessData.map(i => {
  return {
    image: i.id,
    name: resolve(i.name),
    skillName: resolve(i.skillname),
    skillDescription: resolve(i.skilldesc),
  };
});

export default class Goddesses extends Component {
  state = {
    render: [],
  }

  componentWillMount = () => {
    const render = data.map(this.renderListGroupItem);

    this.setState({render,});
  }

  renderListGroupItem = (goddess) => {
    return (
      <ListGroupItem key={goddess.image}>
        <Media>
          <Grid fluid>
            <Row>
              <Col style={{padding: 0,}} lg={3} md={3} sm={4} xs={5}>
                <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                  <img alt='' src={imagePath(`goddesses/${goddess.image}`)} />
                </Media.Left>
              </Col>
              <Col style={{padding: 0,}} lg={9} md={9} sm={8} xs={7}>
                <Media.Body>
                  <Media.Heading>{`${goddess.name} / ${goddess.skillName}`}</Media.Heading>
                  {goddess.skillDescription}
                </Media.Body>
              </Col>
            </Row>
          </Grid>
        </Media>
      </ListGroupItem>
    );
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
