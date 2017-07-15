import React, { Component } from 'react';
import {
  Accordion,
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Panel,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { resolve, } from '../util/resolve';
const data = require('../Decrypted/get_character_visual.json')['character_visual'].filter(i => i.type === 'HERO');

// for creating checkboxes
const items = {
  Star: [1, 2, 3, 4, 5, 6,],
  Class: ['Warrior', 'Paladin', 'Archer', 'Hunter', 'Wizard', 'Priest',],
  Rarity: [
    'Legendary Hero',
    'Contract only Hero',
    'Promotion Hero',
    'Secret Hero',
    'Normal Hero',
  ],
  Faction: [
    'Grancia Empire',
    'Eastern Kingdom - Ryu',
    'Neth Empire',
    'Southwestern Alliance',
    'Eastern Kingdom - Han',
    'Roman Republic',
    'Heroes of Freedom',
    'Pumpkin City',
    'Supply all forces',
    'Unknown',
  ],
  Gender: ['Male', 'Female',],
};

export default class Heroes extends Component {
  state = {
    filters: {},
    heroes: [],
    render: [],
  }

  componentWillMount = () => {
    this.initializeFilters();
    this.initializeHeroes();
    this.renderHeroes();
  }

  initializeFilters = () => {
    const filters = this.state.filters;
    Object.keys(items).forEach(i => filters[i] = []);
    this.setState({filters});
  }

  initializeHeroes = () => (
    data.forEach(i => {
      const name = resolve(i.name);
      const star = i.id.match(/_\d/)[0][1];
      const clas = resolve('TEXT_CLASS_' + i.classid.substring(4));
      const rarity = resolve(
        'TEXT_CONFIRM_SELL_' +
        (i.rarity === 'LEGENDARY' 
          ? i.isgachagolden ? 'IN_GACHA' : 'LAGENDARY'
          : i.rarity
        ) +
        '_HERO'
      );
      const faction = ['CHEN', 'GODDESS', 'MINO', 'NOS',].includes(i.domain) || !i.domain
        ? 'Unknown' // remove unreleased domains
        : resolve(i.domain === 'NONEGROUP'
            ? 'TEXT_CHAMP_DOMAIN_' + i.domain + '_NAME'
            : 'TEXT_CHAMPION_DOMAIN_' + i.domain
          );
      const gender = resolve('TEXT_EXPLORE_TOOLTIP_GENDER_' + i.gender);
      this.state.heroes.push([name, star, clas, rarity, faction, gender]);
    })
  )

  handleCheckbox = (e) => {
    const arr = e.target.name.split('&');
    const filters = this.state.filters;
    if (e.target.checked) {
      filters[arr[0]].push(arr[1]);
    } else {
      filters[arr[0]] = filters[arr[0]].filter(i => i !== arr[1]);
    }
    this.setState({filters}, () => this.renderHeroes());
  }

  createCheckbox = (key, value) => (
    <Checkbox inline key={`${key}&${value}`} name={`${key}&${value}`} onChange={this.handleCheckbox}>
      {value}
    </Checkbox>
  )

  createCheckboxes = () => (
    Object.keys(items).map(i => (
      <FormGroup key={i}>
        <Col componentClass={ControlLabel} sm={1}>{i}</Col>
        <Col sm={10}>{items[i].map(j => this.createCheckbox(i, j))}</Col>
      </FormGroup> 
    ))
  )

  filterHeroes = () => {
    let filtered = this.state.heroes;
    for (let i of Object.keys(this.state.filters)) {
      if (!this.state.filters[i].length) {
        continue;
      }
      filtered = filtered.filter(j => (
        j.some(k => this.state.filters[i].includes(k))
      ));
    }
    return filtered;
  }

  renderHeroes = () => {
    const filtered = this.filterHeroes();
    this.setState({
      render: filtered.map(i => (
        <LinkContainer key={`${i[0]}${i[1]}${i[2]}`} to={`/cqdb/heroes/${i[0]}&${i[1]}&${i[2]}`}>
          <ListGroupItem>{`${i[0]} (${i[1]}★)`}</ListGroupItem>
        </LinkContainer>
      )),
    }); 
  }

  render = () => {
    return (
      <div>
        <Accordion>
          <Panel header='Filters'>
            <Form horizontal>{this.createCheckboxes()}</Form>
          </Panel>
        </Accordion>
        <Accordion>
          <Panel header={`Heroes (${this.state.render.length})`}>
            <ListGroup>{this.state.render}</ListGroup>
          </Panel>
        </Accordion>
      </div>
    );
  }
}