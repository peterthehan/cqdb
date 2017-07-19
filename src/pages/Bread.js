import React, { Component, } from 'react';
import ReactList from 'react-list';
import {
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormGroup,
  Grid,
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

import { createFilterURL, } from '../util/createFilterURL';
import { filterItems, } from '../util/filterItems';
import { imagePath, } from '../util/imagePath';
import { initializeFilters, } from '../util/initializeFilters';
import { resolve, } from '../util/resolve';
const data = require('../Decrypted/get_bread.json').bread;

// for creating checkboxes
const checkboxes = {
  Star: Array.from({length: 7}, (v, i) => i).slice(1).map(i => i.toString()),
};

export default class Bread extends Component {
  state = {
    filters: {},
    items: [],
    render: [],
  }

  componentWillMount = () => {
    //console.log('Bread', 'componentWillMount');
    const items = this.initializeItems();
    const filters = initializeFilters(checkboxes);
    const render = filterItems(items, filters);
    this.setState({ filters, items, render, });
  }

  componentDidMount = () => {
    //console.log('Bread', 'componentDidMount');
    //window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps = () => {
    //console.log('Bread', 'componentWillReceiveProps');
    const filters = initializeFilters(checkboxes);
    const render = filterItems(this.state.items, filters);
    this.setState({ filters, render, });
  }

  componentWillUpdate = () => {
    //console.log('Bread', 'componentWillUpdate');
  }

  componentWillUnmount = () => {
    //console.log('Bread', 'componentDidUnmount');
    //window.removeEventListener('scroll', this.handleScroll);
  }

  initializeItems = () => {
    const unique = {};
    const processedData = data.map(i => {
      const name = resolve(i.name);
      const star = i.grade.toString();
      const value = i.trainpoint;
      const rate = `${parseInt(i.critprob * 100, 10)}%`;
      const sell = `${i.sellprice} gold`;
      const image = i.texture;

      unique[rate] = true;

      const filters = [name, star, value, rate, sell, image,];
      const listItem = (
        <ListGroupItem key={i.id}>
          <Media>
            <Grid fluid>
              <Row>
                <Col style={{padding: 0,}} lg={2} md={3} sm={4} xs={5}>
                <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                  <img alt='' src={imagePath('fergus', `assets/bread/${filters[filters.length - 1]}.png`)} />
                </Media.Left>
                </Col>
                <Col style={{padding: 0,}} lg={10} md={9} sm={8} xs={7}>
                <Media.Body>
                  <Media.Heading>{`${filters[0]} (${filters[1]}★)`}</Media.Heading>
                  <p>{filters.slice(2, 5).join(' | ')}</p>
                </Media.Body>
                </Col>
              </Row>
            </Grid>
          </Media>
        </ListGroupItem>
      );

      return [filters, listItem];
    });
    checkboxes['Rate'] = Object.keys(unique).sort();

    return processedData;
  }

  handleCheckbox = (e) => {
    const arr = e.target.name.split('&');
    const filters = this.state.filters;
    filters[arr[0]][arr[1]] = e.target.checked;

    this.setState({
      filters: filters,
      render: filterItems(this.state.items, filters),
    }, () => {
      window.history.replaceState('', '', `?${createFilterURL(this.state.filters)}`);
    });
  }

  renderCheckbox = (key, value) => {
    const isChecked = this.state.filters[key][value];
    return (
      <Checkbox defaultChecked={isChecked} inline key={`${value}${isChecked}`} name={`${key}&${value}`} onChange={this.handleCheckbox}>
        {value}
      </Checkbox>
    );
  }

  renderCheckboxes = () => {
    return (
      Object.keys(checkboxes).map(i => (
        <FormGroup key={i}>
          <Col componentClass={ControlLabel} lg={1} md={2} sm={2} xs={12}>{i}</Col>
          <Col lg={11} md={10} sm={10} xs={12}>
            {checkboxes[i].map(j => this.renderCheckbox(i, j))}
          </Col>
        </FormGroup> 
      ))
    );
  }

  render = () => {
    //console.log('Bread', 'render');
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel collapsible defaultExpanded header='Filters'>
            <Form horizontal>{this.renderCheckboxes()}</Form>
          </Panel>
          <Panel collapsible defaultExpanded header={`Bread (${this.state.render.length})`}>
            <ListGroup fill>
              <ReactList
                itemRenderer={i => this.state.render[i]}
                length={this.state.render.length}
                minSize={10}
              />
            </ListGroup>
          </Panel>
        </Col>
      </Row>
    );
  }
}
