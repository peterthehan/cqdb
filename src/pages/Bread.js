import React, { Component, } from 'react';
import {
  Col,
  Grid,
  ListGroupItem,
  Media,
  Row,
} from 'react-bootstrap';

import { renderCheckboxes, } from '../components/renderCheckboxes';
import { renderResults, } from '../components/renderResults';
import { renderTextArea, } from '../components/renderTextArea';
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

  render = () => {
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          {renderTextArea(this.handleTextChange, this.state.textFilter)}
          {renderCheckboxes(this.handleCheckbox, this.state.checkboxFilters, checkboxes)}
          {renderResults('Bread', this.state.render)}
        </Col>
      </Row>
    );
  }
}
