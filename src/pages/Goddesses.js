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
import { filterItems, } from '../util/filterItems';
import { imagePath, } from '../util/imagePath';
import { resolve, } from '../util/resolve';
const data = require('../Decrypted/get_sister.json')
  .sister
  .filter(i => countInstances(i.id, '_') === 1);

export default class Goddesses extends Component {
  state = {
    items: [],
    render: [],
  }

  componentWillMount = () => {
    //console.log('Goddesses', 'componentWillMount');
    const items = this.initializeItems();
    const render = filterItems(items);
    this.setState({ items, render, });
  }

  componentDidMount = () => {
    //console.log('Goddesses', 'componentDidMount');
    //window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps = () => {
    //console.log('Goddesses', 'componentWillReceiveProps');
  }

  componentWillUpdate = () => {
    //console.log('Goddesses', 'componentWillUpdate');
  }

  componentWillUnmount = () => {
    //console.log('Goddesses', 'componentDidUnmount');
    //window.removeEventListener('scroll', this.handleScroll);
  }

  initializeItems = () => {
    const processedData = data.map(i => {
      const name = resolve(i.name);
      const skillName = resolve(i.skillname);
      const skillDescription = resolve(i.skilldesc);
      const image = i.id;

      const filters = [name, skillName, skillDescription, image,];
      const listItem = (
        <ListGroupItem key={i.id}>
          <Media>
            <Grid fluid>
              <Row>
                <Col style={{padding: 0,}} lg={2} md={3} sm={4} xs={5}>
                <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                  <img alt='' src={imagePath('fergus', `assets/goddesses/${filters[filters.length - 1]}.png`)} />
                </Media.Left>
                </Col>
                <Col style={{padding: 0,}} lg={10} md={9} sm={8} xs={7}>
                <Media.Body>
                  <Media.Heading>{`${filters[0]} - ${filters[1]}`}</Media.Heading>
                  <p>{filters[2]}</p>
                </Media.Body>
                </Col>
              </Row>
            </Grid>
          </Media>
        </ListGroupItem>
      );

      return [filters, listItem];
    });

    return processedData;
  }

  render = () => {
    //console.log('Goddesses', 'render');
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
