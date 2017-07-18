import React, { Component, } from 'react';
import {
  Col,
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
    items: [],
    render: [],
  }

  componentWillMount = () => {
    //console.log('Goddesses', 'componentWillMount');
    const items = this.initializeItems();
    const render = this.renderItems(items);
    this.setState({ items, render, });
  }

  componentDidMount = () => {
    //console.log('Goddesses', 'componentDidMount');
    //window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps = () => {
    //console.log('Goddesses', 'componentWillReceiveProps');
    const render = this.renderItems(this.state.items);
    this.setState({ render, });
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
      const identifier = filters.slice(0, 1);
      const listItem = (
        <ListGroupItem key={identifier.join('')}>
          <Media>
            <Media.Left>
              <img alt='' src={imagePath('fergus', `assets/goddesses/${filters[filters.length - 1]}.png`)} />
            </Media.Left>
            <Media.Body>
              <Media.Heading>{`${filters[0]} - ${filters[1]}`}</Media.Heading>
              <p>{filters[2]}</p>
            </Media.Body>
          </Media>
        </ListGroupItem>
      );

      return [filters, listItem];
    });

    return processedData;
  }

  renderItems = (data) => {
    let filtered = data;
    return filtered.map(([_, listItem]) => listItem);
  }

  // handleScroll = () => {
  //   if (!this.test) return;
  //   const [start, end] = this.test.getVisibleRange();
  //   console.log('visible', start);
  // }

  renderItem = (index) => {
    return this.state.render[index];
  }

  render = () => {
    //console.log('Goddesses', 'render');
    return (
      <Row>
        <Col md={12} sm={12} xs={12}>
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
