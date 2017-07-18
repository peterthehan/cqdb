import React, { Component, } from 'react';
import ReactList from 'react-list';
import {
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

import { imagePath, } from '../util/imagePath';
import { resolve, } from '../util/resolve';
import { toTitleCase, } from '../util/toTitleCase';
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
    const filters = this.initializeFilters();
    const render = this.renderItems(items, filters);
    this.setState({ filters, items, render, });
  }

  componentDidMount = () => {
    //console.log('Bread', 'componentDidMount');
    //window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps = () => {
    //console.log('Bread', 'componentWillReceiveProps');
    const filters = this.initializeFilters();
    const render = this.renderItems(this.state.items, filters);
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
      const identifier = filters.slice(0, 2);
      const listItem = (
        <ListGroupItem key={identifier.join('')}>
          <Media>
            <Media.Left>
              <img alt='' src={imagePath('fergus', `assets/bread/${filters[filters.length - 1]}.png`)} />
            </Media.Left>
            <Media.Body>
              <Media.Heading>{`${filters[0]} (${filters[1]}★)`}</Media.Heading>
              <p>{filters.slice(2, filters.length - 1).join(' | ')}</p>
            </Media.Body>
          </Media>
        </ListGroupItem>
      );

      checkboxes['Rate'] = Object.keys(unique).sort();

      return [filters, listItem];
    });

    return processedData;
  }

  initializeFilters = () => {
    // initialize each filter category key with a filter-false value
    const filters = {};
    Object.keys(checkboxes).forEach(i => {
      filters[i] = {};
      checkboxes[i].forEach(j => filters[i][j] = false);
    });

    // if url contains querystring, parse and error-check it
    if (window.location.search.length) {
      decodeURIComponent(window.location.search.substring(1)).split('&').forEach(i => {
        const kv = i.split('=');
        const key = toTitleCase(kv[0]);
        if (filters[key]) {
          const keys = kv[1].toLowerCase().split(',');
          Object.keys(filters[key])
            .filter(j => keys.includes(j.toLowerCase()))
            .forEach(j => filters[key][j] = true);
        }
      });

      // update url
      window.history.replaceState('', '', `?${this.createFilterURL(filters)}`);
    }

    return filters;
  }

  renderItems = (data, filters) => {
    let filtered = data;
    Object.keys(filters).forEach(i => {
      const currentFilters = Object.keys(filters[i]).filter(j => filters[i][j]);
      if (currentFilters.length) {
        filtered = filtered
          .filter(([filters, _]) => filters.some(j => currentFilters.includes(j)));
      }
    });

    return filtered.map(([_, listItem]) => listItem);
  }

  createFilterURL = (filters) => {
    const filterURL = [];
    Object.keys(filters).forEach(i => {
      const trueKeys = Object.keys(filters[i]).filter(j => filters[i][j]);
      if (trueKeys.length) {
        filterURL.push(`${i}=${trueKeys.join(',')}`);
      }
    });

    return filterURL.join('&');
  }

  handleCheckbox = (e) => {
    const arr = e.target.name.split('&');
    const filters = this.state.filters;
    filters[arr[0]][arr[1]] = e.target.checked;

    this.setState({
      filters: filters,
      render: this.renderItems(this.state.items, filters),
    }, () => {
      window.history.replaceState('', '', `?${this.createFilterURL(this.state.filters)}`);
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

  // handleScroll = () => {
  //   if (!this.test) return;
  //   const [start, end] = this.test.getVisibleRange();
  //   console.log('visible', start);
  // }

  renderItem = (index) => {
    return this.state.render[index];
  }

  render = () => {
    //console.log('Bread', 'render');
    return (
      <Row>
        <Col md={12} sm={12} xs={12}>
          <Panel collapsible defaultExpanded header='Filters'>
            <Form horizontal>{this.renderCheckboxes()}</Form>
          </Panel>
          <Panel collapsible defaultExpanded header={`Bread (${this.state.render.length})`}>
            <ListGroup fill>
              <ReactList
                itemRenderer={this.renderItem}
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
