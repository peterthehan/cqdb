import React, { Component, } from 'react';
import {
  Col,
  Grid,
  ListGroupItem,
  Media,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { renderButton, } from '../components/renderButton';
import { renderCheckboxes, } from '../components/renderCheckboxes';
import { renderModal, } from '../components/renderModal';
import { renderResults, } from '../components/renderResults';
import { renderTextArea, } from '../components/renderTextArea';
import { filterByText, filterByCheckbox, } from '../util/filters';
import { imagePath, } from '../util/imagePath';
import { resolve, } from '../util/resolve';
import { parseURL, updateURL, } from '../util/url';

const sbwData = require('../Decrypted/filtered_weapon_sbw.json');

const filterCategories = ['Star', 'Category',];

const data = sbwData.reverse().map(i => {
  const dict = {
    'Sword': 'Warrior',
    'Hammer': 'Paladin',
    'Bow': 'Archer',
    'Gun': 'Hunter',
    'Staff': 'Wizard',
    'Orb': 'Priest',
  };

  let heroName = i.grade === 5 ? i.reqhero[1] : i.reqhero_ref;
  if (heroName.includes('LIMITED_RB') || heroName.includes('KOF')) {
    heroName = heroName.replace(/_\d/, '');
  } else if (heroName.includes('DEEMO')) {
    heroName = heroName.replace(/_\d/, '') + heroName.match(/_\d/)[0];
  }
  heroName = resolve(`TEXT_${heroName}_NAME`);

  // make weapon's filterable object
  const f = [
    i.grade.toString(),
    resolve(`TEXT_WEAPON_CATE_${i.categoryid.substring(4)}`),
  ];

  const filterable = {};
  filterCategories.forEach((i, index) => filterable[i] = f[index]);

  return {
    image: i.image,
    filterable: filterable,
    name: resolve(i.name),
    description: resolve(i.desc),
    range: i.range,
    atkPower: i.attdmg,
    atkSpeed: i.attspd,
    heroName: heroName,
    class: dict[filterable['Category']],
  };
});

const checkboxes = {
  Star: ['4', '5', '6',],
  Category: ['Sword', 'Hammer', 'Bow', 'Gun', 'Staff', 'Orb',],
};

// console.log(data, checkboxes);

export default class Soulbound extends Component {
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
      <LinkContainer
        key={`${weapon.image}${weapon.filterable.Star}`}
        to={`/cqdb/heroes/${weapon.heroName}&${weapon.filterable.Star}&${weapon.class}`}
      >
        <ListGroupItem>
          <Media>
            <Grid fluid>
              <Row>
                <Col style={{padding: 0,}} lg={3} md={3} sm={4} xs={5}>
                  <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                    <img alt='' src={imagePath('cq-assets', `sbws/${weapon.image}.png`)} />
                  </Media.Left>
                </Col>
                <Col style={{padding: 0,}} lg={9} md={9} sm={8} xs={7}>
                  <Media.Body>
                    <Media.Heading>{`${weapon.name} (${weapon.filterable.Star}★) / ${weapon.heroName}`}</Media.Heading>
                    <p>{`${weapon.filterable.Category} | Range: ${weapon.range} | Atk. Power: ${weapon.atkPower} | Atk. Speed: ${weapon.atkSpeed}`}</p>
                    <p>{weapon.description}</p>
                  </Media.Body>
                </Col>
              </Row>
            </Grid>
          </Media>
        </ListGroupItem>
      </LinkContainer>
    );
  }

  update = () => {
    updateURL(
      this.state.textFilter,
      this.state.checkboxFilters,
    );
    const processed = filterByCheckbox(filterByText(data, this.state.textFilter), this.state.checkboxFilters);

    this.setState({ render: processed.map(this.renderListGroupItem), });
  }

  handleTextChange = (e) => {
    if (e.target.value.includes('\n')) { return; }

    clearTimeout(this.timer);
    this.setState({ textFilter: e.target.value, }, () => {
      this.timer = setTimeout(() => this.update(), 300);
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
        {renderButton(this.handleFilterButton, 'Filter', this.state.checkboxFilters)}
        {renderModal(
          this.handleFilterButton,
          this.state.showFilterModal,
          'Filters',
          renderCheckboxes(this.handleCheckbox, this.state.checkboxFilters, checkboxes)
        )}
        {renderResults('Soulbound Weapons', this.state.render)}
      </Row>
    );
  }
}
