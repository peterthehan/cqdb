import React, { Component, } from 'react';
import {
  Col,
  ListGroup,
  ListGroupItem,
  Media,
  Pager,
  Panel,
  Row,
  Tab,
  Tabs,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { imagePath, } from '../util/imagePath';
import { resolve, } from '../util/resolve';
const heroData = require('../Decrypted/get_character_visual.json')
  .character_visual
  .filter(i => i.type === 'HERO');
const sbwData = require('../Decrypted/get_weapon.json')
  .weapon
  .filter(i => i.type === 'HERO' && i.reqhero && i.howtoget);
const skinData = require('../Decrypted/get_costume.json').costume;
const statData = require('../Decrypted/get_character_stat.json')
  .character_stat
  .filter(i => i.hero_type);

export default class HeroInformation extends Component {
  state = {
    hero: {},
    pager: [],
    render: [],
    skin: [],
    stat: {},
    weapon: [],
  }

  componentWillMount = () => {
    console.log('HeroInformation', 'componentWillMount');
    this.initializeData();
  }

  componentDidMount = () => {
    console.log('HeroInformation', 'componentDidMount');
  }

  componentWillReceiveProps = () => {
    console.log('HeroInformation', 'componentWillReceiveProps');
    this.initializeData();
  }

  componentWillUpdate = () => {
    console.log('HeroInformation', 'componentWillUpdate');
  }

  findTarget = () => {
    const target = window.location.pathname.split('/')[3].split('&');
    target[0] = decodeURIComponent(target[0]);
    return target;
  }

  findHero = (target, key) => {
    if (target.constructor === Array) {
      for (let i of heroData) {
        const name = resolve(i.name);
        const star = i.id.match(/_\d/)[0][1];
        const clas = resolve('TEXT_CLASS_' + i.classid.substring(4));

        if ([name, star, clas].every(j => target.indexOf(j) > -1)) {
          return i;
        }
      }
    } else {
      for (let i of heroData) {
        if (i[key] === target) {
          return i;
        }
      }
    }
    return null;
  }

  initializeData = () => {
    const hero = this.findHero(this.findTarget());
    const skin = skinData.filter(i => i.wearable_charid.includes(hero.id));
    const stat = statData.filter(i => i.id === hero.default_stat_id)[0];
    const weapon = [6, 5, 4]
      .filter(i => i <= stat.grade)
      .map(i => {
        return sbwData
          .filter(j => parseInt(j.grade, 10) === i && j.reqhero.includes(hero.id))[0];
      })
      .filter(i => i);

    const prevHero = this.findHero(hero.id, 'upgradetargethero');
    const nextHero = !hero.upgradetargethero ? null : this.findHero(hero.upgradetargethero, 'id');
    
    const pager = [];
    if (prevHero) {
      const name = resolve(prevHero.name);
      const star = prevHero.id.match(/_\d/)[0][1];
      const clas = resolve('TEXT_CLASS_' + prevHero.classid.substring(4));
      const image = prevHero.face_tex;

      pager.push([name, star, clas, image,]);
    }
    if (nextHero) {
      const name = resolve(nextHero.name);
      const star = nextHero.id.match(/_\d/)[0][1];
      const clas = resolve('TEXT_CLASS_' + nextHero.classid.substring(4));
      const image = nextHero.face_tex;

      pager.push([name, star, clas, image,]);
    }

    this.setState({
      hero: hero,
      pager: pager,
      skin: skin,
      stat: stat,
      weapon: weapon,
    }, () => this.renderInformation());
  }

  renderInformation = () => {
    const grid = (
      <Row key='grid'>
        <Col md={12} sm={12} xs={12}>
          {this.renderGeneral()}
        </Col>
        <Col md={6} sm={12} xs={12}>
          {this.renderBlock()}
        </Col>
        <Col md={6} sm={12} xs={12}>
          {this.renderSbws()}
        </Col>
        <Col md={6} sm={12} xs={12}>
          {this.renderSkins()}
        </Col>
      </Row>
    );

    const render = [
      grid,
      this.renderPagers(),
    ];
    this.setState({render});
  }

  renderGeneral = () => {
    return (
      <Panel collapsible defaultExpanded header={`${resolve(this.state.hero.name)} (${this.state.stat.grade}★) `} key={`hero${this.findTarget().join('')}`}>
        <Media>
          <Media.Body>
            <p>{resolve(this.state.hero.desc)}</p>
          </Media.Body>
          <Media.Right>
            <img alt='' src={imagePath('fergus', `assets/heroes/${this.state.hero.face_tex}.png`)} />
          </Media.Right>
          <Row>
            <Col md={3} sm={6} xs={6}>
              <Media.Heading>Class</Media.Heading>
              <p>{resolve('TEXT_CLASS_' + this.state.hero.classid.substring(4))}</p>
            </Col>
            <Col md={3} sm={6} xs={6}>
              <Media.Heading>Rarity</Media.Heading>
              <p>
                {
                  resolve(
                    'TEXT_CONFIRM_SELL_' +
                    (this.state.hero.rarity === 'LEGENDARY' 
                      ? this.state.hero.isgachagolden ? 'IN_GACHA' : 'LAGENDARY'
                      : this.state.hero.rarity
                    ) +
                    '_HERO'
                  )
                }
              </p>
            </Col>
            <Col md={3} sm={6} xs={6}>
              <Media.Heading>Faction</Media.Heading>
              <p>
                {
                  ['CHEN', 'GODDESS', 'MINO', 'NOS',].includes(this.state.hero.domain) || !this.state.hero.domain
                  ? 'Unknown' // remove unreleased domains
                  : resolve(this.state.hero.domain === 'NONEGROUP'
                      ? 'TEXT_CHAMP_DOMAIN_' + this.state.hero.domain + '_NAME'
                      : 'TEXT_CHAMPION_DOMAIN_' + this.state.hero.domain
                    )
                }
              </p>
            </Col>
            <Col md={3} sm={6} xs={6}>
              <Media.Heading>Gender</Media.Heading>
              <p>{resolve('TEXT_EXPLORE_TOOLTIP_GENDER_' + this.state.hero.gender)}</p>
            </Col>
          </Row>
        </Media>
      </Panel>
    );
  }

  renderBlock = () => {
    console.log('block');
    let passive = '';
    const skill_subname = resolve(this.state.stat.skill_subname);
    const skill_subdesc = resolve(this.state.stat.skill_subdesc);
    if (skill_subname && skill_subdesc) {
      // key does not resolve as-is, modification necessary
      passive = (
        <Row>
          <Col md={12} sm={12} xs={12}>
            <Media.Heading>
              {
                skill_subname + ' (' +
                resolve(
                  `TEXT_PASSIVE_SKILL_TOOLTIP_TYPE_${this.state.stat.hero_type}`
                ) + ')'
              }
            </Media.Heading>
            <p>{skill_subdesc.replace(/@|#|\$/g, '')}</p>
          </Col>
        </Row>
      );
    }

    const grade = [1, 1, 1, 2, 2, 3][this.state.stat.grade - 1];
    return (
      <Panel collapsible defaultExpanded header='Block Skill' key={`grade${grade}`}>
        <Media>
          <Media.Body>
            <Media.Heading>
              {
                resolve(this.state.stat.skill_name) +
                ` (Lv. ${grade})`
              }
            </Media.Heading>
            <p>
              {resolve(this.state.stat.skill_desc).replace(/@|#|\$/g, '')}
            </p>
          </Media.Body>
          <Media.Right>
            <img alt='' src={imagePath('fergus', `assets/blocks/${this.state.stat.skill_icon}.png`)} width={66} />
          </Media.Right>
          {passive}
        </Media>
      </Panel>
    );
  }

  renderSbw = (i, index) => {
    return (
      <Tab eventKey={index} key={i.grade} title={`${i.grade}★`}>
        <div style={{paddingTop: 15,}}>
          <Media>
            <Media.Body>
              <Media.Heading>
                {resolve(i.name)}
              </Media.Heading>
              <p>{resolve(i.desc)}</p>
            </Media.Body>
            <Media.Right>
              <img alt='' src={imagePath('fergus', `assets/sbws/${i.skin_tex}.png`)} />
            </Media.Right>
            <Row>
              <Col md={6} sm={6} xs={6}>
                <Media.Heading>Category</Media.Heading>
                <p>{resolve('TEXT_WEAPON_CATE_' + i.categoryid.substring(4))}</p>
              </Col>
              <Col md={6} sm={6} xs={6}>
                <Media.Heading>Range</Media.Heading>
                <p>{i.range}</p>
              </Col>
              <Col md={6} sm={6} xs={6}>
                <Media.Heading>Atk. Power</Media.Heading>
                <p>{i.attdmg}</p>
              </Col>
              <Col md={6} sm={6} xs={6}>
                <Media.Heading>Atk. Speed</Media.Heading>
                <p>{i.attspd}</p>
              </Col>
            </Row>
          </Media>
        </div>
      </Tab>
    );
  }

  renderSbws = () => {
    if (!this.state.weapon.length) {
      return;
    }
    return (
      <Panel collapsible defaultExpanded header='Soulbound Weapon' key={this.state.weapon.length}>
        <Tabs defaultActiveKey={0} id="soulbound-weapon">
          {this.state.weapon.map(this.renderSbw)}
        </Tabs>
      </Panel>
    )
  }

  renderSkin = (i, index) => {
    // modify 'Type' value for display
    const convert = {
      'AttackPower': 'Atk. Power',
      'CriticalDamage': 'Crit.Damage',
      'CriticalChance': 'Crit.Chance',
      'Dodge': 'Evasion',
      'All': 'Stats',
    };
    const stats = i.addstat_json.map(j => {
      const label = j.Type in convert ? convert[j.Type] : j.Type;
      const value = j.Value < 1 ? `${parseInt(j.Value * 100, 10)}%` : j.Value;
      return label + ': ' + value;
    });

    return (
      <ListGroupItem key={index}>
        <Media>
          <Media.Body>
            <Media.Heading>{resolve(i.costume_name)}</Media.Heading>
            <p>{stats.join(', ')}</p>
            <Row>
              <Col md={6} sm={6} xs={6}>
                <Media.Heading>Sell</Media.Heading>
                <p>{i.sell_price}</p>
              </Col>
            </Row>
          </Media.Body>
          <Media.Right>
            <img alt='' src={imagePath('fergus', `assets/skins/${i.face_tex}.png`)} />
          </Media.Right>
        </Media>
      </ListGroupItem>
    );
  }

  renderSkins = () => {
    if (!this.state.skin.length) {
      return;
    }
    return (
      <Panel collapsible defaultExpanded header='Skins' key={`skin${this.state.skin.length}`}>
        <ListGroup fill>
          {this.state.skin.map(this.renderSkin)}
        </ListGroup>
      </Panel>
    );
  }

  renderPager = (pager) => {
    const img = pager.pop();
    return (
      <LinkContainer key={pager.join('')} to={`/cqdb/heroes/${pager.join('&')}`}>
        <Pager.Item>
          <Media>
            <img alt='' src={imagePath('fergus', `assets/heroes/${img}.png`)} />
          </Media>
          {`${pager[0]} (${pager[1]}★)`}
        </Pager.Item>
      </LinkContainer>
      );
  }

  renderPagers = () => {
    if (!this.state.pager.length) {
      return;
    }
    const pagers = this.state.pager.map(this.renderPager);
    pagers.splice(1, 0, ' ');
    return (
      <Pager key='pager'>
        {pagers}
      </Pager>
    );
  }

  render = () => {
    console.log('HeroInformation', 'render');
    window.scrollTo(0, 0);
    return (
      <div>
        {this.state.render}
      </div>
    );
  }
}
