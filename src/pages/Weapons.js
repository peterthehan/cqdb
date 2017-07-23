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

import { filterItems, filterNames, } from '../util/filters';
import { imagePath, } from '../util/imagePath';
import { initializeFilters, } from '../util/initializeFilters';
import { range, } from '../util/range';
import { resolve, } from '../util/resolve';
import { updateURL, } from '../util/updateURL';
const data = require('../Decrypted/filtered_weapon.json');

const checkboxes = {
  Star: range(6),
  Category: ['Sword', 'Hammer', 'Bow', 'Gun', 'Staff', 'Orb',],
  Conversion: ['Attack', 'Defense', 'Function', 'None',],
};

export default class Weapons extends Component {
  state = {
    filters: {},
    items: [],
    nameFilter: '',
    render: [],
  }

  componentWillMount = () => {
    const items = this.initializeItems();
    const [nameFilter, filters] = initializeFilters(checkboxes);
    const render = filterItems(filterNames(nameFilter, items), filters);
    this.setState({ filters, items, nameFilter, render, });
  }

  componentWillReceiveProps = () => {
    const [nameFilter, filters] = initializeFilters(checkboxes);
    const render = filterItems(filterNames(nameFilter, this.state.items), filters);
    this.setState({ filters, nameFilter, render, });
  }

  getConversion = (value) => {
    const prefix = 'TEXT_WEAPON_CONVERT_INFO_';
    if (value === 'ATTACK') {
      return prefix + 'ATK';
    } else if (value === 'DEFENSE') {
      return prefix + 'DEF';
    } else if (value === 'UTILITY') {
      return prefix + 'UTL';
    }
    return null;
  }

  initializeItems = () => {
    const processedData = data.map(i => {
      const name = resolve(i.name);
      const star = i.grade.toString();
      const weaponCategory = resolve(`TEXT_WEAPON_CATE_${i.categoryid.substring(4)}`);
      const range = i.range;
      const atkPower = i.attdmg;
      const atkSpeed = i.attspd;
      const conversions = [i.convert_slot_1, i.convert_slot_2, i.convert_slot_3,]
        .map((i, index) => {
          const key = this.getConversion(i);
          return !index && !key ? 'None' : resolve(key);
        })
        .filter(i => i);
      const image = i.skin_tex;

      const filters = [name, star, weaponCategory, ...[...new Set(conversions)],];
      const listItem = (
        <ListGroupItem key={name}>
          <Media>
            <Grid fluid>
              <Row>
                <Col style={{padding: 0,}} lg={2} md={3} sm={4} xs={5}>
                  <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                    <img alt='' src={imagePath('cq-assets', `weapons/${image}.png`)} />
                  </Media.Left>
                </Col>
                <Col style={{padding: 0,}} lg={10} md={9} sm={8} xs={7}>
                  <Media.Body>
                    <Media.Heading>{`${name} (${star}★)`}</Media.Heading>
                    <p>{`${weaponCategory} | Range: ${range} | Atk. Power: ${atkPower} | Atk. Speed: ${atkSpeed}`}</p>
                    <p>{conversions.join(', ')}</p>
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

  handleChange = (e) => {
    if (e.target.value.includes('\n')) {
      return;
    }

    this.setState({
      nameFilter: e.target.value,
      render: filterItems(filterNames(e.target.value, this.state.items), this.state.filters),
    }, () => updateURL(this.state.nameFilter, this.state.filters));
  }

  handleCheckbox = (e) => {
    const arr = e.target.name.split('&');
    const filters = this.state.filters;
    filters[arr[0]][arr[1]] = e.target.checked;

    this.setState({
      filters: filters,
      render: filterItems(filterNames(this.state.nameFilter, this.state.items), filters),
    }, () => updateURL(this.state.nameFilter, this.state.filters));
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
          <Col componentClass={ControlLabel} lg={2} md={3} sm={4} xs={12}>{i}</Col>
          <Col lg={10} md={9} sm={8} xs={12}>
            {checkboxes[i].map(j => this.renderCheckbox(i, j))}
          </Col>
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
                    onChange={this.handleChange}
                    style={{height: '34px', resize: 'none',}}
                    value={this.state.nameFilter}
                  />
                </Col>
              </FormGroup>
              {this.renderCheckboxes()}
            </Form>
          </Panel>
          <Panel collapsible defaultExpanded header={`Weapons (${this.state.render.length})`}>
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
