import React, { Component, } from 'react';
import ReactList from 'react-list';
import {
  Accordion,
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { resolve, } from '../util/resolve';
const data = require('../Decrypted/get_character_visual.json')['character_visual'].filter(i => i.type === 'HERO');

// for creating checkboxes
const items = {
  Star: ['1', '2', '3', '4', '5', '6',],
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
    // console.log('componentWillMount');
    this.initializeFilters();
    this.initializeHeroes();
  }

  componentWillReceiveProps = () => {
    // console.log('componentWillReceiveProps');
    this.initializeFilters();
  }

  initializeFilters = () => {
    // initialize each filter category key with a filter-false value
    const filters = {};
    Object.keys(items).forEach(i => {
      filters[i] = {};
      items[i].forEach(j => filters[i][j] = false);
    });

    // if url contains querystring, parse and error-check it
    if (window.location.search.length) {
      decodeURIComponent(window.location.search.substring(1)).split('&').forEach(i => {
        const kv = i.split('=');
        kv[1].split(',').forEach(j => {
          if (j in filters[kv[0]]) {
            filters[kv[0]][j] = true;
          }
        });
      });
    }

    this.setState({filters}, () => this.renderHeroes());
  }

  initializeHeroes = () => {
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
      const image = i.face_tex;
      this.state.heroes.push([name, star, clas, rarity, faction, gender, image,]);
    });
  }

  createFilterURL = () => {
    const params = [];
    for (let i of Object.keys(this.state.filters)) {
      const arr = Object.keys(this.state.filters[i]).filter(j => {
        return this.state.filters[i][j]
      })

      if (!arr.length) {
        continue;
      }

      params.push(`${i}=${arr.join(',')}`);
    }
    return params.join('&');
  }

  handleCheckbox = (e) => {
    const arr = e.target.name.split('&');
    const filters = this.state.filters;
    filters[arr[0]][arr[1]] = e.target.checked;
    this.setState({filters}, () => {
      window.history.pushState('', '', `?${this.createFilterURL()}`);
      this.renderHeroes();
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
      Object.keys(items).map(i => (
        <FormGroup key={i}>
          <Col componentClass={ControlLabel} md={1} sm={2} xs={12}>{i}</Col>
          <Col md={11} sm={10} xs={12}>
            {items[i].map(j => this.renderCheckbox(i, j))}
          </Col>
        </FormGroup> 
      ))
    );
  }

  filterHeroes = () => {
    let filtered = this.state.heroes;
    for (let i of Object.keys(this.state.filters)) {
      const currentFilters = Object.keys(this.state.filters[i]).filter(j => {
        return this.state.filters[i][j];
      });

      if (!currentFilters.length) {
        continue;
      }

      filtered = filtered.filter(j => j.some(k => currentFilters.includes(k)));
    }

    return filtered;
  }

  renderHeroes = () => {
    const filtered = this.filterHeroes();
    this.setState({
      render: filtered.map(i => {
        const identifier = i.slice(0, i.length - 4);
        return (
          <LinkContainer key={identifier.join('')} to={`/cqdb/heroes/${identifier.join('&')}`}>
            <ListGroupItem>
              <Media>
                <Media.Left>
                  <img src={`https://raw.githubusercontent.com/Johj/fergus/master/assets/heroes/${i[6]}.png`} alt='' />
                </Media.Left>
                <Media.Body>
                  <Media.Heading>{`${i[0]} (${i[1]}★)`}</Media.Heading>
                  <p>{i.slice(2, i.length - 1).join(' | ')}</p>
                </Media.Body>
              </Media>
            </ListGroupItem>
          </LinkContainer>
        );
      }),
    }); 
  }

  renderHero = (index) => {
    return this.state.render[index];
  }

  render = () => {
    // console.log('render');
    return (
      <div>
        <Accordion>
          <Panel header='Filters'>
            <Form horizontal>{this.renderCheckboxes()}</Form>
          </Panel>
        </Accordion>
        <Accordion>
          <Panel header={`Heroes (${this.state.render.length})`}>
            <ListGroup>
              <ReactList itemRenderer={this.renderHero} length={this.state.render.length} minSize={10} />
            </ListGroup>
          </Panel>
        </Accordion>
      </div>
    );
  }
}
