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
import { resolve, } from '../util/resolve';
import { toTitleCase, } from '../util/toTitleCase';
import { parseURL, updateURL, } from '../util/url';

const skillData = require('../Decrypted/filtered_spskill.json');
const heroData = require('../Decrypted/filtered_character_visual.json');

function unlockCondition(data) {
  if (data.type === 'NONE') {
    return 'None';
  } else if (data.type === 'SPECIFIC') {
    let hero;
    if ('type_target' in data) { // acquire specific hero
      hero = resolve(heroData.filter(i => i.id === data.type_target)[0].name);
    } else if ('type_target_list' in data) { // acquire list of specific heroes
      hero = heroData
        .filter(i => data.type_target_list.includes(i.id))
        .map(i => resolve(i.name))
        .join(', ');
    }
    return resolve(data.type_text)
      .replace(/Acquired/, 'Acquire')
      .replace(/\{0\}/, hero);
  } else if (data.type === 'SEPARATE') { // acquire x amount of class heroes
    return resolve(data.type_text)
      .replace(/Acquired/, 'Acquire')
      .replace(/\{1\}/, data.type_value)
      .replace(/\{0\}/, resolve(`TEXT_CLASS_${data.type_target.substring(4)}`).toLowerCase() + 's');
  } else if (data.type === 'ONLY_HUGE') {
    return `Get 'Great Success!'`;
  }
  return 'null'; // should never reach here
}

const filterCategories = ['Level', 'Class',];

const data = skillData.map(i => {
  // make skill's filterable object

  // edge case with skill classes
  let className;
  if (i.class === 'KOF') {
    className = i.class;
  } else if (i.class === 'CLA_OBJECT') {
    className = 'Unique';
  } else {
    className = resolve('TEXT_CLASS_' + i.class.substring(4));
  }
  const f = [
    i.unlockcond.next_id === 'MAX' ? 'Max' : '',
    className,
  ];

  const filterable = {};
  filterCategories.forEach((i, index) => filterable[i] = f[index]);

  // edge case with captain skill
  const cost = i.name === 'TEXT_SKILL_PA_CAPTAIN_NAME'
    ? i.cost_json.map(j => `${toTitleCase(j.type)}: ${j.value}`).join(', ')
    : i.cost_json.map(j => `${toTitleCase(j.Cost_Type.replace('ITEM_', ''))}: ${j.Cost_Amount}`).join(', ');

  return {
    image: i.icon,
    filterable: filterable,
    name: resolve(i.name),
    level: i.level,
    description: resolve(i.desc).replace(/@|#|\$/g, ''),
    type: resolve(i.simpledesc),
    cost: cost,
    rate: i.huge === -1 ? '-' : `${parseInt(i.huge * 100, 10)}%`,
    unlockCondition: unlockCondition(i.unlockcond),
  };
});

const checkboxes = {
  Level: ['Max',],
  Class: ['Warrior', 'Paladin', 'Archer', 'Hunter', 'Wizard', 'Priest', 'KOF', 'Unique',],
};

//console.log(data, checkboxes);

export default class Skills extends Component {
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

  renderListGroupItem = (skill) => {
    return (
      <ListGroupItem key={`${skill.name}${skill.level}`}>
        <Media>
          <Grid fluid>
            <Row>
              <Col style={{padding: 0,}} lg={3} md={3} sm={4} xs={5}>
                <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                  <img alt='' src={imagePath('cq-assets', `skills/${skill.image}.png`)} />
                </Media.Left>
              </Col>
              <Col style={{padding: 0,}} lg={9} md={9} sm={8} xs={7}>
                <Media.Body>
                  <Media.Heading>{`${skill.name} (Lv. ${skill.level}${!skill.filterable.Level ? '' : ', '}${skill.filterable.Level})`}</Media.Heading>
                  <p>{`${skill.filterable.Class} | ${skill.type} | ${skill.cost} | Rate: ${skill.rate} | ${skill.unlockCondition}`}</p>
                  <p>{skill.description}</p>
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
        {renderResults('Skills', this.state.render)}
      </Row>
    );
  }
}
