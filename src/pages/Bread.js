import React, { Component, } from 'react';
import ReactList from 'react-list';
import {
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Grid,
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

import { filterByText, filterByCheckbox, } from '../util/filters';
import { imagePath, } from '../util/imagePath';
import { resolve, } from '../util/resolve';
import { parseURL, updateURL, } from '../util/url';
const breadData = require('../Decrypted/filtered_bread.json');

const unique = {};
const filterCategories = ['Star', 'Rate',];
filterCategories.forEach(i => unique[i] = {});

const data = breadData.map(i => {
  // make bread's filterable object
  const f = [
    i.grade.toString(),
    `${parseInt(i.critprob * 100, 10)}%`,
  ];

  const filterable = {};
  filterCategories.forEach((i, index) => {
    filterable[i] = f[index];
    unique[i][f[index]] = true;
  });

  return {
    image: i.texture,
    filterable: filterable,
    name: resolve(i.name),
    value: i.trainpoint,
    sell: i.sellprice,
  };
});

const checkboxes = (() => {
  const c = {};
  filterCategories.forEach((i, index) => c[i] = Object.keys(unique[i]).sort());
  return c;
})();

//console.log(data, checkboxes);

export default class Bread extends Component {
  state = {
    textFilter: '',
    checkboxFilters: {},
    render: [],
  }

  componentWillMount = () => {
    this.timer = null;
    const [textFilter, checkboxFilters] = parseURL(checkboxes);
    const processed = filterByCheckbox(filterByText(data, textFilter), checkboxFilters);
    const render = processed.map(this.renderListGroupItem);

    this.setState({textFilter, checkboxFilters, render,});
  }

  componentWillReceiveProps = () => {
    this.componentWillMount();
  }

  renderListGroupItem = (bread) => {
    return (
      <ListGroupItem key={bread.image}>
        <Media>
          <Grid fluid>
            <Row>
              <Col style={{padding: 0,}} lg={2} md={3} sm={4} xs={5}>
                <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                  <img alt='' src={imagePath('cq-assets', `bread/${bread.image}.png`)} />
                </Media.Left>
              </Col>
              <Col style={{padding: 0,}} lg={10} md={9} sm={8} xs={7}>
                <Media.Body>
                  <Media.Heading>{`${bread.name} (${bread.filterable.Star}★)`}</Media.Heading>
                  <p>{`${bread.value} | ${bread.filterable.Rate} | Sell: ${bread.sell} gold`}</p>
                </Media.Body>
              </Col>
            </Row>
          </Grid>
        </Media>
      </ListGroupItem>
    );
  }

  changeView = () => {
    updateURL(
      this.state.textFilter,
      this.state.checkboxFilters,
    );
    const processed = filterByCheckbox(filterByText(data, this.state.textFilter), this.state.checkboxFilters)

    this.setState({ render: processed.map(this.renderListGroupItem), });
  }

  handleTextChange = (e) => {
    if (e.target.value.includes('\n')) { return; }

    clearTimeout(this.timer);
    this.setState({ textFilter: e.target.value, }, () => {
      this.timer = setTimeout(() => this.changeView(), 500);
    });
  }

  handleCheckbox = (e) => {
    const [key, value] = e.target.name.split('&');
    const checkboxFilters = this.state.checkboxFilters;
    checkboxFilters[key][value] = e.target.checked;

    this.setState({ checkboxFilters: checkboxFilters,}, () => this.changeView());
  }

  renderCheckbox = (category, label) => {
    const isChecked = this.state.checkboxFilters[category][label];
    return (
      <Checkbox defaultChecked={isChecked} inline key={`${label}${isChecked}`} name={`${category}&${label}`} onChange={this.handleCheckbox}>
        {label}
      </Checkbox>
    );
  }

  renderCheckboxes = () => {
    return (
      Object.keys(checkboxes).map(i => (
        <FormGroup key={i}>
          <Col componentClass={ControlLabel} lg={2} md={3} sm={4} xs={12}>{i}</Col>
          <Col lg={10} md={9} sm={8} xs={12}>{checkboxes[i].map(j => this.renderCheckbox(i, j))}</Col>
        </FormGroup>
      ))
    );
  }

  render = () => {
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel collapsible defaultExpanded header='Filters'>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} lg={2} md={3} sm={4} xs={12}>Name</Col>
                <Col lg={10} md={9} sm={8} xs={12}>
                  <FormControl
                    componentClass='textarea'
                    onChange={this.handleTextChange}
                    style={{height: '34px', resize: 'none',}}
                    value={this.state.textFilter}
                  />
                </Col>
              </FormGroup>
              {this.renderCheckboxes()}
            </Form>
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
