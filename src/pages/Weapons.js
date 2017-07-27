import React, { Component, } from 'react';
import {
  Col,
  Grid,
  ListGroupItem,
  Media,
  Row,
} from 'react-bootstrap';

import { renderButton, } from '../components/renderButton';
import { renderCheckboxes, } from '../components/renderCheckboxes';
import { renderModal, } from '../components/renderModal';
import { renderResults, } from '../components/renderResults';
import { renderTextArea, } from '../components/renderTextArea';
import { filterByText, filterByCheckbox, } from '../util/filters';
import { imagePath, } from '../util/imagePath';
import { range, } from '../util/range';
import { resolve, } from '../util/resolve';
import { parseURL, updateURL, } from '../util/url';

const weaponData = require('../Decrypted/filtered_weapon.json');

function getConversion(value) {
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

const filterCategories = ['Star', 'Category',];

const data = weaponData.map(i => {
  const conversions = [i.convert_slot_1, i.convert_slot_2, i.convert_slot_3,]
    .map((i, index) => {
      const key = getConversion(i);
      return !index && !key ? 'None' : resolve(key);
    })
    .filter(i => i);

  // make weapon's filterable object
  const f = [
    i.grade.toString(),
    resolve(`TEXT_WEAPON_CATE_${i.categoryid.substring(4)}`),
  ];

  const filterable = {};
  filterCategories.forEach((i, index) => filterable[i] = f[index]);

  return {
    image: i.skin_tex,
    filterable: filterable,
    name: resolve(i.name),
    range: i.range,
    atkPower: i.attdmg,
    atkSpeed: i.attspd,
    conversions: conversions,
  };
});

const checkboxes = {
  Star: range(6),
  Category: ['Sword', 'Hammer', 'Bow', 'Gun', 'Staff', 'Orb',],
};

//console.log(data, checkboxes);

export default class Weapons extends Component {
  state = {
    textFilter: '',
    showFilterModal: false,
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

  renderListGroupItem = (weapon) => {
    return (
      <ListGroupItem key={weapon.name}>
        <Media>
          <Grid fluid>
            <Row>
              <Col style={{padding: 0,}} lg={2} md={3} sm={4} xs={5}>
                <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                  <img alt='' src={imagePath('cq-assets', `weapons/${weapon.image}.png`)} />
                </Media.Left>
              </Col>
              <Col style={{padding: 0,}} lg={10} md={9} sm={8} xs={7}>
                <Media.Body>
                  <Media.Heading>{`${weapon.name} (${weapon.filterable.Star}★)`}</Media.Heading>
                  <p>{`${weapon.filterable.Category} | Range: ${weapon.range} | Atk. Power: ${weapon.atkPower} | Atk. Speed: ${weapon.atkSpeed}`}</p>
                  <p>{weapon.conversions.join(', ')}</p>
                </Media.Body>
              </Col>
            </Row>
          </Grid>
        </Media>
      </ListGroupItem>
    );
  }
  
  update = () => {
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
      this.timer = setTimeout(() => this.update(), 500);
    });
  }

  handleCheckbox = (e) => {
    const [key, value] = e.target.name.split('&');
    const checkboxFilters = this.state.checkboxFilters;
    checkboxFilters[key][value] = e.target.checked;

    this.setState({ checkboxFilters: checkboxFilters,}, () => this.update());
  }

  handleFilterButton = () => {
    this.setState({ showFilterModal: !this.state.showFilterModal, });
  }

  render = () => {
    return (
      <Row>
        {renderTextArea(this.handleTextChange, this.state.textFilter)}
        {renderButton(this.handleFilterButton, 'Filter')}
        {renderModal(
          this.handleFilterButton,
          this.state.showFilterModal,
          'Filters',
          renderCheckboxes(this.handleCheckbox, this.state.checkboxFilters, checkboxes)
        )}
        {renderResults('Weapons', this.state.render)}
      </Row>
    );
  }
}
