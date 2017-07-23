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
import { resolve, } from '../util/resolve';
import { toTitleCase, } from '../util/toTitleCase';
import { updateURL, } from '../util/updateURL';
const data = require('../Decrypted/filtered_spskill.json');
const heroData = require('../Decrypted/filtered_character_visual.json');

// for creating checkboxes
const checkboxes = {
  Level: ['Max',],
  Class: ['Warrior', 'Paladin', 'Archer', 'Hunter', 'Wizard', 'Priest', 'KOF',],
};

export default class Skills extends Component {
  state = {
    filters: {},
    items: [],
    nameFilter: '',
    render: [],
  }

  componentWillMount = () => {
    this.timer = null;
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

  unlockCondition = (data) => {
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

  initializeItems = () => {
    const processedData = data.map(i => {
      const name = resolve(i.name);
      const level = i.level;
      const description = resolve(i.desc).replace(/@|#|\$/g, '');
      const className = i.class === 'KOF' ? i.class : resolve('TEXT_CLASS_' + i.class.substring(4));
      const type = resolve(i.simpledesc);
      const cost = i.cost.map(j => `${toTitleCase(j.type)}: ${j.value}`).join(', ');
      const rate = i.huge === -1 ? '-' : `${parseInt(i.huge * 100, 10)}%`;
      const unlockCondition = this.unlockCondition(i.unlockcond);
      const isMaxed = i.unlockcond.next_id === 'MAX' ? 'Max' : '';
      const image = i.icon;

      const filters = [name, className, isMaxed,];
      const listItem = (
        <ListGroupItem key={i.id}>
          <Media>
            <Grid fluid>
              <Row>
                <Col style={{padding: 0,}} lg={2} md={3} sm={4} xs={5}>
                  <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                    <img width={'50%'} height={'50%'} alt='' src={imagePath('cq-assets', `skills/${image}.png`)} />
                  </Media.Left>
                </Col>
                <Col style={{padding: 0,}} lg={10} md={9} sm={8} xs={7}>
                  <Media.Body>
                    <Media.Heading>{`${name} (Lv. ${level}${!isMaxed ? '' : ', '}${isMaxed})`}</Media.Heading>
                    <p>{`${className} | ${type} | ${cost} | Rate: ${rate} | ${unlockCondition}`}</p>
                    <p>{description}</p>
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

    clearTimeout(this.timer);
    this.setState({
      nameFilter: e.target.value,
    }, () => {
      this.timer = setTimeout(() => {
        this.setState({
          render: filterItems(filterNames(this.state.nameFilter, this.state.items), this.state.filters),
        }, () => updateURL(this.state.nameFilter, this.state.filters));
      }, 500);
    });
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
          <Panel collapsible defaultExpanded header={`Skills (${this.state.render.length})`}>
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
