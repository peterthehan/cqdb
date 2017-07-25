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
import { LinkContainer, } from 'react-router-bootstrap';

import { calculateStat, } from '../util/calculateStat';
import { filterByText, filterByCheckbox, } from '../util/filters';
import { imagePath, } from '../util/imagePath';
import { range, } from '../util/range';
import { resolve, } from '../util/resolve';
import { sortBySelection, } from '../util/sortBySelection';
import { parseURL, updateURL, } from '../util/url';
const berryData = require('../Decrypted/get_character_addstatmax.json').character_addstatmax;
const heroData = require('../Decrypted/filtered_character_visual.json');
const sbwData = require('../Decrypted/filtered_weapon_sbw.json');
const skinData = require('../Decrypted/filtered_costume.json');
const statData = require('../Decrypted/filtered_character_stat.json');

const statLabels = [
  'HP',
  'Atk. Power',
  'Crit.Chance',
  'Crit.Damage',
  'Armor',
  'Resistance',
  'Accuracy',
  'Evasion',
];
const filterCategories = ['Star', 'Class', 'Rarity', 'Faction', 'Gender', 'Has Sbw', 'Has Skin',];
const sortCategories = ['By', 'Order',];

// parse data files
const data = heroData.reverse().map(hero => {
  // find hero's respective stat and berry data
  const stat = statData.filter(i => i.id === hero.default_stat_id)[0];
  const berry = stat.grade === 6 && hero.id !== 'CHA_WA_SUPPORT_6_1'
    ? berryData.filter(i => i.id === stat.addstat_max_id)[0]
    : {};

  const image = hero.face_tex;
  const name = resolve(hero.name);

  // make hero's filterable object
  const f = [
    stat.grade.toString(),
    `TEXT_CLASS_${hero.classid.substring(4)}`,
    `TEXT_CONFIRM_SELL_${hero.rarity === 'LEGENDARY' ? (hero.isgachagolden ? 'IN_GACHA' : 'LAGENDARY') : hero.rarity}_HERO`,
    !hero.domain || ['CHEN', 'MINO', 'NOS',].includes(hero.domain)
      ? 'Unknown' // remove unreleased domains
      : hero.domain === 'NONEGROUP' ? `TEXT_CHAMP_DOMAIN_${hero.domain}_NAME` : `TEXT_CHAMPION_DOMAIN_${hero.domain}`,
    `TEXT_EXPLORE_TOOLTIP_GENDER_${hero.gender}`,
    stat.grade < 4
      ? hero.rarity === 'DESTINY' ? 'Yes' : 'No'
      : sbwData.some(j => j.reqhero.includes(hero.id)) ? 'Yes' : 'No',
    skinData.some(i => i.wearable_charid.includes(hero.id)) ? 'Yes' : 'No',
  ].map(resolve);

  const filterable = {};
  filterCategories.forEach((i, index) => filterable[i] = f[index]);

  // make hero's sortable object
  const level = stat.grade * 10;
  const breadTraining = [stat.grade - 1];
  const baseStats = breadTraining.map(i => {
    const calculatedStats = [
      calculateStat(stat.initialhp, stat.growthhp, level, i),
      calculateStat(stat.initialattdmg, stat.growthattdmg, level, i),
      stat.critprob,
      stat.critpower,
      calculateStat(stat.defense, stat.growthdefense, level, i),
      calculateStat(stat.resist, stat.growthresist, level, i),
      stat.hitrate,
      stat.dodgerate,
    ];

    const b = {}
    statLabels.forEach((j, index) => b[j] = calculatedStats[index]);
    return b;
  });

  const sortable = baseStats[0];
  if (Object.keys(berry).length) {
    const berryStats = [
      berry.hp,
      berry.attack_power,
      berry.critical_chance,
      berry.critical_damage,
      berry.armor,
      berry.resistance,
      berry.accuracy,
      berry.dodge,
    ];

    statLabels.forEach((i, index) => sortable[i] += berryStats[index]);
  }

  // match game's decimal places
  const rounding = [1, 1, 2, 2, 1, 1, 2, 2,];
  statLabels.forEach((i, index) => {
    sortable[i] = parseFloat(sortable[i].toFixed(rounding[index]));
  });

  // add name as a sortable field
  sortable['Name'] = name;

  return {
    image: image,
    filterable: filterable,
    name: name,
    sortable: sortable,
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
      'Supply all forces',
      'Unknown',
    ],
    ['Male', 'Female',],
    ['Yes', 'No',],
    ['Yes', 'No',],
  ];

  const c = {};
  filterCategories.forEach((i, index) => c[i] = filterLabels[index]);
  return c;
})();

// initialize sort's select labels and options
const selects = (() => {
  const sortOptions = [
    ['Default', 'Name',].concat(statLabels),
    ['Descending', 'Ascending',],
  ];

  const s = {};
  sortCategories.forEach((i, index) => s[i] = sortOptions[index])
  return s;
})();

//console.log(data, checkboxes, selects);

export default class Heroes extends Component {
  state = {
    textFilter: '',
    checkboxFilters: {},
    sortBy: '',
    sortOrder: '',
    render: [],
  }

  componentWillMount = () => {
    this.timer = null;
    const [
      textFilter,
      checkboxFilters,
      sortBy,
      sortOrder,
    ] = parseURL(checkboxes, selects[sortCategories[0]], selects[sortCategories[1]]);
    const processed = sortBySelection(
      filterByCheckbox(filterByText(data, textFilter), checkboxFilters),
      sortBy,
      selects[sortCategories[1]][0] === sortOrder,
      selects[sortCategories[0]][0]
    );
    const render = processed.map(i => this.renderListGroupItem(i, sortBy));

    this.setState({textFilter, checkboxFilters, sortBy, sortOrder, render,});
  }

  componentWillReceiveProps = () => {
    this.componentWillMount();
  }

  renderListGroupItem = (hero, sortBy) => {
    const id = [hero.name, hero.filterable.Star, hero.filterable.Class,];
    return (
      <LinkContainer key={id.join('')} to={`/cqdb/heroes/${id.join('&')}`}>
        <ListGroupItem>
          <Media>
            <Grid fluid>
              <Row>
                <Col style={{padding: 0,}} lg={2} md={3} sm={4} xs={5}>
                  <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                    <img alt='' src={imagePath('cq-assets', `heroes/${hero.image}.png`)} />
                  </Media.Left>
                </Col>
                <Col style={{padding: 0,}} lg={10} md={9} sm={8} xs={7}>
                  <Media.Body>
                    <Media.Heading>{`${hero.name} (${hero.filterable.Star}★)`}</Media.Heading>
                    <p>{Object.values(hero.filterable).slice(1, 5).join(' | ')}</p>
                    {statLabels.includes(sortBy) ? <p>{`${sortBy}: ${hero.sortable[sortBy]}`}</p> : ''}
                  </Media.Body>
                </Col>
              </Row>
            </Grid>
          </Media>
        </ListGroupItem>
      </LinkContainer>
    );
  }

  changeView = () => {
    updateURL(
      this.state.textFilter,
      this.state.checkboxFilters,
      this.state.sortBy,
      this.state.sortOrder,
      selects[sortCategories[0]],
      selects[sortCategories[1]]
    );
    const processed = sortBySelection(
      filterByCheckbox(filterByText(data, this.state.textFilter), this.state.checkboxFilters),
      this.state.sortBy,
      selects[sortCategories[1]][0] === this.state.sortOrder,
      selects[sortCategories[0]][0]
    );

    this.setState({ render: processed.map(i => this.renderListGroupItem(i, this.state.sortBy)), });
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

  handleByChange = (e) => {
    this.setState({ sortBy: e.target.value, }, () => this.changeView());
  }

  handleOrderChange = (e) => {
    this.setState({ sortOrder: e.target.value, }, () => this.changeView());
  }

  renderSelect = (category, label) => {
    return <option key={label} value={label}>{label}</option>;
  }

  renderSelects = (defaultValues, handlers) => {
    return (
      Object.keys(selects).map((i, index) => (
        <FormGroup key={i}>
          <Col componentClass={ControlLabel} lg={2} md={3} sm={4} xs={12}>{i}</Col>
          <Col lg={10} md={9} sm={8} xs={12}>
            <FormControl componentClass="select" defaultValue={defaultValues[index]} onChange={handlers[index]}>
              {selects[i].map(j => this.renderSelect(i, j))}
            </FormControl>
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
                    onChange={this.handleTextChange}
                    style={{height: '34px', resize: 'none',}}
                    value={this.state.textFilter}
                  />
                </Col>
              </FormGroup>
              {this.renderCheckboxes()}
            </Form>
          </Panel>
          <Panel collapsible defaultExpanded header='Sort'>
            <Form horizontal>
              {this.renderSelects([this.state.sortBy, this.state.sortOrder,], [this.handleByChange, this.handleOrderChange,])}
            </Form>
          </Panel>
          <Panel collapsible defaultExpanded header={`Heroes (${this.state.render.length})`}>
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