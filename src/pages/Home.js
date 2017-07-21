import React, { Component, } from 'react';
import {
  Carousel,
  Col,
  Image,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

import { imagePath, } from '../util/imagePath';
import { range, } from '../util/range';

export default class Home extends Component {
  renderCarouselItem = (i) => {
    return (
      <Carousel.Item key={i}>
        <img alt='' src={imagePath('cqdb', `src/assets/carousel_${i}.png`)} />
      </Carousel.Item>
    )
  }

  render = () => {
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center',}}>
            <Image alt='' responsive src={imagePath('cqdb', 'src/assets/banner.png')} />
          </div>
          <Panel>
            <Media.Heading>Hello!</Media.Heading>
            <p>
              Welcome to the <a href='https://play.google.com/store/apps/details?id=com.nhnent.SKQUEST'>Crusaders Quest</a> Database (cqdb)!
            </p>
            <p>
              The database is currently on game version: <b>3.9.5.KG</b>.
              Feel free to report bugs or suggest features <a href='https://github.com/Johj/cqdb/issues'>here</a>.
            </p>
          </Panel>
        </Col>
        <Col lg={8} md={12} sm={12} xs={12}>
          <Panel>
            <Carousel>
              {range(5).map(this.renderCarouselItem)}
            </Carousel>
          </Panel>
        </Col>
        <Col lg={4} md={6} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Join the Discussion!</Media.Heading>
            <a href='https://discord.gg/WjEFnzC'>
              <Image alt='' responsive src='https://discordapp.com/api/guilds/258167954913361930/embed.png?style=banner2' />
            </a>
            <p />
            <a href='https://discord.gg/6TRnyhj'>
              <Image alt='' responsive src='https://discordapp.com/api/guilds/206599473282023424/embed.png?style=banner2' />
            </a>
          </Panel>
        </Col>
        <Col lg={4} md={6} sm={12} xs={12}>
          <Panel>
            <Media.Heading>
              Add <a href='https://github.com/Johj/fergus'>Fergus</a> to your Discord Server!
            </Media.Heading>
            <p>
              Have all the features of cqdb available inside your Discord server.
              Bot invitation link can be found <a href='https://goo.gl/nDluCQ'>here</a>.
            </p>
          </Panel>
        </Col>
      </Row>
    );
  }
}