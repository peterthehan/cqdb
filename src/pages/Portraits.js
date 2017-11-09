import React, { Component, } from 'react';
import ReactList from 'react-list';
import {
  Col,
  Panel,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { renderButton, } from '../components/renderButton';
import { renderCheckboxes, } from '../components/renderCheckboxes';
import { renderModal, } from '../components/renderModal';
import { renderTextArea, } from '../components/renderTextArea';
import { filterByText, filterByCheckbox, } from '../util/filters';
import { imagePath, } from '../util/imagePath';
import { range, } from '../util/range';
import { resolve, } from '../util/resolve';
import { parseURL, updateURL, } from '../util/url';

const heroData = require('../Decrypted/filtered_character_visual.json')
  // .concat(frivHeroData);
const statData = require('../Decrypted/filtered_character_stat.json')
  // .concat(frivStatData);

const filterCategories = ['Star', 'Class', 'Rarity', 'Faction', 'Gender',];

// parse data files
const data = heroData
  .filter(i => i.portrait !== null) // remove heroes without portraits
  .map(hero => {
    const stat = statData[statData.findIndex(i => i.id === hero.default_stat_id)];

    const image = hero.portrait;
    const name = resolve(hero.name);

    // make hero's filterable object
    const f = [
      stat.grade.toString(),
      `TEXT_CLASS_${hero.classid.substring(4)}`,
      `TEXT_CONFIRM_SELL_${hero.rarity === 'LEGENDARY' ? (hero.isgachagolden ? 'IN_GACHA' : 'LAGENDARY') : hero.rarity}_HERO`,
      !hero.domain || ['CHEN',].includes(hero.domain)
        ? 'Unknown' // remove unreleased domains
        : hero.domain === 'NONEGROUP' ? `TEXT_CHAMP_DOMAIN_${hero.domain}_NAME` : `TEXT_CHAMPION_DOMAIN_${hero.domain}`,
      `TEXT_EXPLORE_TOOLTIP_GENDER_${hero.gender}`,
    ].map(resolve);

    const filterable = {};
    filterCategories.forEach((i, index) => filterable[i] = f[index]);

    return {
      image: image,
      filterable: filterable,
      name: name,
    };
  });

// initialize checkboxes
const checkboxes = (() => {
  const filterLabels = [
    range(6).map(i => i.toString()),
    ['Warrior', 'Paladin', 'Archer', 'Hunter', 'Wizard', 'Priest',],
    [
      'Legendary Hero',
      'Contract only Hero',
      'Promotion Hero',
      'Secret Hero',
      'Normal Hero',
      'Supply Hero',
    ],
    [
      'Grancia Empire',
      'Eastern Kingdom - Ryu',
      'Neth Empire',
      'Southwestern Alliance',
      'Eastern Kingdom - Han',
      'Roman Republic',
      'Heroes of Freedom',
      'Pumpkin City',
      'Order of the Goddess',
      'Nosgard',
      'Minor Tribes\' Confederation',
      'Supply all forces',
      'Unknown',
    ],
    ['Male', 'Female',],
  ];

  const c = {};
  filterCategories.forEach((i, index) => c[i] = filterLabels[index]);
  return c;
})();

// console.log(data, checkboxes);

export default class Portraits extends Component {
  state = {
    textFilter: '',
    showFilterModal: false,
    checkboxFilters: {},
    render: [],
  }

  componentWillMount = () => {
    this.timer = null;
    const [
      textFilter,
      checkboxFilters,
    ] = parseURL(checkboxes);

    // update url since querystring may have contained bad values
    updateURL(textFilter, checkboxFilters);

    const processed = filterByCheckbox(filterByText(data, textFilter), checkboxFilters);
    const render = processed.map(i => this.renderListGroupItem(i));

    this.setState({textFilter, checkboxFilters, render,});
  }

  componentWillReceiveProps = () => {
    this.componentWillMount();
  }

  renderListGroupItem = (hero) => {
    const id = [hero.name, hero.filterable.Star, hero.filterable.Class,];
    return (
      <LinkContainer key={id.join('')} to={`/cqdb/heroes/${id.join('&')}`}>
        <Col lg={6} md={6} sm={12} xs={12}>
          <h5 style={{textAlign: 'center',}}>{`${hero.name} (${hero.filterable.Star}★)`}</h5>
          <img alt='' src={imagePath(`portraits/${hero.image}`)} width='100%' />
        </Col>
      </LinkContainer>
    );
  }

  update = () => {
    updateURL(this.state.textFilter, this.state.checkboxFilters);
    const processed = filterByCheckbox(filterByText(data, this.state.textFilter), this.state.checkboxFilters);

    this.setState({ render: processed.map(i => this.renderListGroupItem(i)), });
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
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel style={{marginTop: 15,}} collapsible defaultExpanded header={`Portraits (${this.state.render.length})`}>
            <ReactList
              itemRenderer={i => this.state.render[i]}
              length={this.state.render.length}
            />
          </Panel>
        </Col>
      </Row>
    );
  }
}
