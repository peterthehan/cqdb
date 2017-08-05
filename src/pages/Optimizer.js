import React, { Component, } from 'react';
import ReactList from 'react-list';
import {
  Col,
  FormControl,
  Panel,
  Row,
  Table,
} from 'react-bootstrap';

import { renderButton, } from '../components/renderButton';
import { renderModal, } from '../components/renderModal';
import { renderSelects, } from '../components/renderSelects';
import { calculateStat, } from '../util/calculateStat';
import { cartesian, combinationWithRepetition, range, } from '../util/combinatorics';
import { color, } from '../util/color';
import { resolve, } from '../util/resolve';
import { sortBySelection, } from '../util/sortBySelection';
import { mean, median, mode, standardDeviation, } from '../util/statistics';

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
const sortCategories = ['By', 'Order',];

// parse data files
const heroSelectData = heroData
  .filter(i => i.id.match(/_\d/)[0][1] === '6') // remove non-6 star heroes
  .map(hero => {
    // if -1, hero does not have an sbw
    const sbwIndex = sbwData.findIndex(i => i.grade === 6 && i.reqhero_ref === hero.id);
    if (sbwIndex === -1) {
      return null;
    }

    return {
      id: hero.id,
      image: hero.face_tex,
      name: resolve(hero.name),
      star: hero.id.match(/_\d/)[0][1],
      class: resolve(`TEXT_CLASS_${hero.classid.substring(4)}`),
    };
  })
  .filter(i => i); // remove null from the pool

// console.log(heroSelectData);

const translator = {
  '0.2875': 'Atk. Power Percent',
  '0.20125': 'Crit.Chance',
  '0.8625': 'Crit.Damage',
  '517': 'Penetration',
  '0': 'Penetration',

  '230': 'Atk. Power',
  '0.081': 'Crit.Chance',
  '0.13': 'Crit.Chance',
  '0.345': 'Crit.Damage',

  '171': 'Penetration',
  '0.126': 'Accuracy',
  '0.1': 'Damage Percent',
};

const weaponConversions = combinationWithRepetition([0.2875, 0.20125, 0.8625, 517,], 2);
const ringMainOptions = [230, 0.081, 0.13, 0.345,];
const ringSubOptions = [[171, 171, 171, 0.126, 0.126, 0.126], [0.1, 0.1, 0.1,], [0, 0, 0,],] // 120 pen
  .map(i => [...new Set(combinationWithRepetition(i, 3).map(j => j.join(',')))]
    .map(j => j.split(',').map(parseFloat))
  )
  .reduce((a, b) => a.concat(b), []);
// console.log(weaponConversions, ringMainOptions, ringSubOptions);

const combinations = cartesian(weaponConversions, ringMainOptions, ringSubOptions)
  .map(i => i.reduce((a, b) => a.concat(b), []))
  .filter(i => (i.includes(0) && i.includes(0.13)) || (!i.includes(0) && !i.includes(0.13))); // filter invalid ring combinations
// console.log(combinations, JSON.stringify(combinations));

const defenseIncrements = range(500, 2500, 250);
const evasionIncrements = range(15, 75, 10).map(i => i * 0.01);

// initialize sort's select labels and options
const selects = (() => {
  const sortOptions = [
    ['Default', 'Neutral', 'Mean', 'Median', 'Mode', 'Standard Deviation', 'Variability', 'Minimum', 'Maximum',],
    ['Descending', 'Ascending',],
  ];

  const s = {};
  sortCategories.forEach((i, index) => s[i] = sortOptions[index])
  return s;
})();

export default class Optimizer extends Component {
  state = {
    heroIndex: null,
    showSortModal: false,
    sortBy: '',
    sortOrder: '',
    render: [],
  }

  componentWillMount = () => {
    this.setState({ sortBy: selects.By[0], sortOrder: selects.Order[0], });
  }

  findHero = () => {
    const hero = heroData[heroData.findIndex(i => i.id === heroSelectData[this.state.heroIndex].id)];

    // find hero's respective stat, berry, sbw, and skin data
    const stat = statData[statData.findIndex(i => i.id === hero.default_stat_id)];
    const berry = stat.grade === 6 && hero.id !== 'CHA_WA_SUPPORT_6_1'
      ? berryData[berryData.findIndex(i => i.id === stat.addstat_max_id)]
      : {};
    const sbw = {
      'Atk. Power': sbwData[sbwData.findIndex(i => i.grade === 6 && i.reqhero.includes(hero.id))].attdmg,
    };
    const skin = skinData.filter(i => i.wearable_charid.includes(hero.id));

    // find hero's metadata
    const image = hero.face_tex;
    const name = resolve(hero.name);
    const star = stat.grade.toString();
    const className = resolve(`TEXT_CLASS_${hero.classid.substring(4)}`);

    // find hero's base stats
    const level = stat.grade * 10;
    const breadTraining = [stat.grade - 1];

    const baseStats = {};
    breadTraining.forEach(i => {
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

      statLabels.forEach((j, index) => baseStats[j] = calculatedStats[index]);
    });

    // find hero's berry stats
    const berryStats = {};
    if (Object.keys(berry).length) {
      const berries = [
        berry.hp,
        berry.attack_power,
        berry.critical_chance,
        berry.critical_damage,
        berry.armor,
        berry.resistance,
        berry.accuracy,
        berry.dodge,
      ];

      statLabels.forEach((i, index) => berryStats[i] = berries[index]);
    }

    const convert = {
      'AttackPower': 'Atk. Power',
      'CriticalDamage': 'Crit.Damage',
      'CriticalChance': 'Crit.Chance',
      'Dodge': 'Evasion',
      'All': 'Stats',
    };
    const skinProcessed = skin.map(i => {
      const skinStats = {};
      i.addstat_json.forEach(j => {
        const label = j.Type in convert ? convert[j.Type] : j.Type;
        skinStats[label] = j.Value;
      });

      return {
        image: i.face_tex,
        name: resolve(i.costume_name),
        stats: skinStats,
      };
    });

    return {
      image: image,
      name: name,
      star: star,
      class: className,
      baseStats: baseStats,
      berryStats: berryStats,
      sbw: sbw,
      skin: skinProcessed,
    };
  }

  accumulateStats = (hero, combo) => {
    const loadout = combo[0];

    // aggregate loadout
    const accumulator = {
      'Atk. Power Percent': 0,
      'Atk. Power': 0,
      'Crit.Chance': 0,
      'Crit.Damage': 0,
      'Accuracy': 0,
      'Penetration': 0,
      'Damage Percent': 0,
    };
    loadout.forEach(i => accumulator[translator[i]] += parseFloat(i));

    // initialize hero base stats
    const heroAccumulator = {
      'Atk. Power': 0,
      'Crit.Chance': 0,
      'Crit.Damage': 0,
      'Accuracy':  0,
      'Penetration': 0,
    };
    Object.keys(heroAccumulator).forEach(i => heroAccumulator[i] += i in hero.baseStats ? hero.baseStats[i] : 0);

    // calculate atk. power percent edge case
    heroAccumulator['Atk. Power'] *= (1 + accumulator['Atk. Power Percent']);

    // add hero sbw
    heroAccumulator['Atk. Power'] += hero.sbw['Atk. Power'];

    // add loadout + hero berry stats
    Object.keys(heroAccumulator).forEach(i => heroAccumulator[i] += accumulator[i] + (i in hero.berryStats ? hero.berryStats[i] : 0));

    // add skin stats
    const skin = combo[1];
    if (skin) {
      Object.keys(skin.stats).forEach(i => {
        if (i in heroAccumulator) {
          heroAccumulator[i] += skin.stats[i];
        }
      });
    }

    heroAccumulator['Damage Percent'] = accumulator['Damage Percent'];

    // for printing purposes
    heroAccumulator['Loadout'] = loadout;
    heroAccumulator['Skin'] = skin;
    heroAccumulator['Hero'] = hero;

    return heroAccumulator;
  }

  calculateOutput = (hero) => {
    // calculate all multipliers
    const rawMult = 1 + hero['Damage Percent'];
    const critMult = 1 + hero['Crit.Chance'] * hero['Crit.Damage'];
    const penMultArray = defenseIncrements.map(i => 1 / (1 + 0.0034 * Math.max(i - hero['Penetration'], 0)));
    const accMultArray = evasionIncrements.map(i => 1 - Math.max(i - hero['Accuracy'], 0));

    // calculate effective atk. power
    const effAtkPower = [];
    for (let accMult of accMultArray) {
      const row = [];
      for (let penMult of penMultArray) {
        row.push(hero['Atk. Power'] * rawMult * critMult * penMult * accMult);
      }
      effAtkPower.push(row);
    }

    // flatten to find statistical values
    const flattened = effAtkPower.reduce((a, b) => a.concat(b), []);

    const meanAtkPower = mean(flattened);
    const stddev = standardDeviation(flattened);

    return {
      'sortable': {
        'Default': effAtkPower[0][2], // defense 1000, evasion 0.15
        'Neutral': hero['Atk. Power'] * rawMult * critMult,
        'Mean': meanAtkPower,
        'Median': median(flattened),
        'Mode': mode(flattened),
        'Standard Deviation': stddev,
        'Variability': stddev / meanAtkPower, // coefficient of variation
        'Minimum': Math.min(...flattened),
        'Maximum': Math.max(...flattened),
      },
      'atkPower': hero['Atk. Power'],
      'rawMult': rawMult,
      'critMult': critMult,
      'penMult': penMultArray,
      'accMult': accMultArray,
      'effective': effAtkPower,
      'skin': hero.Skin,
      'loadout': hero.Loadout,
    };
  }

  update = () => {
    if (!this.state.heroIndex) {
      return;
    }

    const hero = this.findHero();
    const fullCombinations = cartesian(combinations, !hero.skin.length ? [null] : hero.skin);

    const calculated = fullCombinations
      .map(i => this.accumulateStats(hero, i))
      .map(this.calculateOutput)
      .sort((a, b) => b.sortable[this.state.sortBy] - a.sortable[this.state.sortBy]);

    const eff = calculated.map(i => i.effective).reduce((a, b) => a.concat(b), []).reduce((a, b) => a.concat(b), []);
    const globalMin = Math.min(...eff);
    const globalMax = Math.max(...eff);

    calculated.forEach(loadout => {
      // create table cell object with effective atk. power and relative color
      const effAtkPowerAndColor = [];
      for (let i = 0; i < loadout.effective.length; ++i) {
        const row = [];
        for (let j = 0; j < loadout.effective[i].length; ++j) {
          row.push({ atkPower: loadout.effective[i][j], color: color(globalMin, globalMax, loadout.effective[i][j]), });
        }
        effAtkPowerAndColor.push(row);
      }

      loadout['effective'] = effAtkPowerAndColor;
    });

    const sorted = sortBySelection(
      calculated,
      this.state.sortBy,
      selects[sortCategories[1]][0] === this.state.sortOrder,
      selects[sortCategories[0]][0]
    );

    this.setState({ render: sorted.map(this.renderPanel), });
  }

  handleHeroSelect = (e) => {
    this.setState({ heroIndex: e.target.value, }, () => this.update());
  }

  handleSortButton = () => {
    this.setState({ showSortModal: !this.state.showSortModal, });
  }

  handleSortByChange = (e) => {
    this.setState({ sortBy: e.target.value, }, () => this.update());
  }

  handleSortOrderChange = (e) => {
    this.setState({ sortOrder: e.target.value, }, () => this.update());
  }

  renderOptions = (i, index) => {
    return (
      <option key={index} value={index}>
        {`${i.name} (${i.star}★)`}
      </option>
    );
  }

  renderPanel = (i, index) => {
    const loadout = i.loadout.map(i => `${translator[i]}: ${i}`);

    return (
      <Col key={index} lg={12} md={12} sm={12} xs={12}>
        <Panel collapsible defaultExpanded header={`#${index + 1}`} style={{marginBottom: 5, marginTop: 15,}}>
          <Row>
            <Col lg={6} md={6} sm={12} xs={12}>
              <Panel header='Loadout'>
                <p>
                  <text><b>Weapon</b>: {loadout.slice(0, 2).join(', ')}<br /></text>
                  <text><b>Ring</b>: {loadout.slice(2).join(', ')}<br /></text>
                  {
                    i.skin
                      ? <text><b>Skin</b>: {i.skin.name}: {Object.keys(i.skin.stats).map(j => `${j}: ${i.skin.stats[j]}`).join(', ')}</text>
                      : ''
                  }
                </p>
              </Panel>
            </Col>
            <Col lg={6} md={6} sm={12} xs={12}>
              <Panel header='Statistics'>
                <p>
                  {Object.keys(i.sortable).slice(2).map(j => <text key={j}><b>{j}</b>{`: ${i.sortable[j].toFixed(2)}`}<br /></text>)}
                </p>
              </Panel>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Panel header={`Effective Atk. Power`}>
                <Table condensed responsive>
                  <thead>
                    <tr>
                      <td></td>
                      <td><b>Atk. Power</b></td>
                      <td>{i.atkPower.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><b>Neutral</b></td>
                      <td>{i.sortable.Neutral.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><b>Raw Multiplier</b></td>
                      <td>{i.rawMult.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><b>Crit. Multiplier</b></td>
                      <td>{i.critMult.toFixed(2)}</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td><b>Pen. Multiplier</b></td>
                      {i.penMult.map((j, index) => <td key={index}>{j.toFixed(2)}</td>)}
                    </tr>
                    <tr>
                      <td><b>Acc. Multiplier</b></td>
                      <td><b>Evasion/Defense</b></td>
                      {defenseIncrements.map((j, index) => <td key={index}>{j}</td>)}
                    </tr>
                    {evasionIncrements.map((j, index) => this.renderTableRows(i.accMult[index], j, i.effective[index]))}
                  </tbody>
                </Table>
              </Panel>
            </Col>
          </Row>
        </Panel>
      </Col>
    );
  }

  renderTableRows = (accMult, evasion, effective) => {
    return (
      <tr key={evasion}>
        <td>{accMult.toFixed(2)}</td>
        <td>{evasion.toFixed(2)}</td>
        {effective.map((i, index) => <td key={index} style={{backgroundColor: i.color,}}>{i.atkPower.toFixed(2)}</td>)}
      </tr>
    );
  }

  render = () => {
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel collapsible header='Methodology'>
          <ol style={{paddingLeft: 15,}}>
            <li>
              <p>
                Calculations assume the hero is max bread and berry trained and has their sbw equipped.
                Skin stats are considered if they exist for the selected hero.
              </p>
            </li>
            <li>
              Every possible equipment combination is generated in considering the optimal loadout.
              <sup><a href='https://github.com/Johj/cqdb/blob/master/src/pages/Optimizer.js#L78-L90'>[1]</a></sup>
            </li>
            <Table condensed responsive>
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Stats</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Weapon Conversions</td>
                  <td>0.2875 Atk. Power Percent, 0.20125 Crit.Chance, 0.8625 Crit.Damage, 517 Penetration</td>
                </tr>
                <tr>
                  <td>Ring Main Options</td>
                  <td>230 Atk. Power, 0.081 Crit.Chance, 0.13 Crit.Chance, 0.345 Crit.Damage</td>
                </tr>
                <tr>
                  <td>Ring Sub Options</td>
                  <td>171 Penetration, 0.126 Accuracy, 0.1 Damage Percent</td>
                </tr>
              </tbody>
            </Table>
            <li>
              Effective Atk. Power = Atk. Power * Raw * Crit. * Pen. * Acc.
              <sup><a href='https://github.com/Johj/cqdb/blob/master/src/pages/Optimizer.js#L270-L278'>[2]</a></sup>&nbsp;
              The heatmaps generated use a global scale that takes into account all loadouts, not a relative scale per loadout;
              green is set to the highest Effective Atk. Power considering all loadouts, red to the lowest.
            </li>
            <Table condensed responsive>
              <thead>
                <tr>
                  <th>Multiplier</th>
                  <th>Formula<sup><a href='https://github.com/Johj/cqdb/blob/master/src/pages/Optimizer.js#L264-L268'>[3]</a></sup></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Raw</td>
                  <td>1 + Damage Percent</td>
                </tr>
                <tr>
                  <td>Crit.</td>
                  <td>1 + Crit.Chance * Crit.Damage</td>
                </tr>
                <tr>
                  <td>Pen.</td>
                  <td>1 / (1 + 0.0034 * max(Defense - Penetration, 0))</td>
                </tr>
                <tr>
                  <td>Acc.</td>
                  <td>1 - max(Evasion - Accuracy, 0)</td>
                </tr>
              </tbody>
            </Table>
            <li>
              <p>
                Keep in mind the yield of the Acc. and Crit. Multipliers are the result of probabilities converging over many repeated events.
                Crusaders Quest PvP generally occurs within the realms of 10-20 seconds over a dozen or so blocks (not many opportunities to "roll the dice").
                The resulting small sample size will generally skew the effects of chance-based damage multipliers.
              </p>
            </li>
            <li>
              Sort by Default compares loadouts using the Effective Atk. Power that results from 1000 Defense and 0.15 Evasion.
              Warriors and Paladins are commonly seen with an additional 460 armor/resistance due to a Defense weapon conversion.
              While this would put them at roughly 1250 armor/resistance using either the mean or median listed below,
              sorting by this metric seems to emphasize penetration-heavy loadouts (which the other types of sorts already do).
              Using 1000 Defense yields a more meaningful sort that allows a comparison of a larger variety of equipment combinations.
            </li>
            <Table condensed responsive>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Mean Defense</th>
                  <th>Median Defense</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Warrior</td>
                  <td>722.70</td>
                  <td>703.30</td>
                </tr>
                <tr>
                  <td>Paladin</td>
                  <td>811.66</td>
                  <td>763.45</td>
                </tr>
              </tbody>
            </Table>
            <li>
              <p>
                Sort by Neutral compares loadouts using Effective Atk. Power = Atk. Power * Raw * Crit.
                This is useful for heroes that deal neutral damage and to some degree, those that have innate penetration.
              </p>
            </li>
            <li>
              <p>
                This tool is not conclusive for "tricky" heroes whose damage scale off non-attack stats or complicated passive procs
                (i.e. Ocean King Koxinga, Berserk - V, Devil Bullet No. 9, etc).
              </p>
            </li>
            </ol>
          </Panel>
        </Col>
        <Col lg={8} md={6} sm={12} xs={12}>
          <FormControl componentClass='select' defaultValue='' onChange={this.handleHeroSelect} style={{marginBottom: 5,}}>
            {
              [<option disabled key='null' value=''>Select a hero...</option>].concat(
                heroSelectData.map((i, index) => this.renderOptions(i, index))
              )
            }
          </FormControl>
        </Col>
        {renderButton(this.handleSortButton, 'Sort')}
        {renderModal(
          this.handleSortButton,
          this.state.showSortModal,
          'Sort',
          renderSelects([this.handleSortByChange, this.handleSortOrderChange,], [this.state.sortBy, this.state.sortOrder,], selects)
        )}
        <ReactList
          itemRenderer={i => this.state.render[i]}
          length={this.state.render.length}
          minSize={10}
        />
      </Row>
    );
  }
}