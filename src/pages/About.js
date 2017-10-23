import React, { Component, } from 'react';
import {
  Col,
  Image,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { imagePath, } from '../util/imagePath';

export default class About extends Component {
  renderFavoriteHeroes = (i) => {
    return (
      <LinkContainer key={i.path} to={`/cqdb/heroes/${i.path}`}>
        <img alt='' src={imagePath(i.image)} width='33%' />
      </LinkContainer>
    );
  }

  renderSocialMediaButton = (i) => {
    return (
      <a className={`btn btn-social-icon btn-${i.service}`} href={i.url} key={i.service}>
        <span className={`fa fa-${i.service}`}></span>
      </a>
    );
  }

  render = () => {
    const favoriteHeroes = [
      { path: 'Principal%20Dancer%20Lee&6&Archer', image: '/skins/cos_ar_15_8', },
      { path: 'Devil%20Bullet%20No.%209&6&Hunter', image: '/skins/cos_hu_7_1', },
      { path: 'Vesper,%20Witch%20of%20Water&6&Wizard', image: '/skins/cos_wi_16_14', },
    ];
    const socialMedia = [
      { url: 'https://github.com/Johj', service: 'github', },
      { url: 'https://twitter.com/Johj_', service: 'twitter', },
      { url: 'https://www.reddit.com/user/w336', service: 'reddit', },
    ];

    return (
      <Row>
        <Col lg={6} md={12} sm={12} xs={12}>
          <Panel>
            <Media.Heading>My Stats</Media.Heading>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
              <text>My IGN is Saarja.</text>
              <text>I started on October 3, 2016.</text>
              <text>I'm currently at about 75000 fame and</text>
              <text>my go-to room number is 3939.</text>
              <br />
              My favorite heroes are:
              <div>{favoriteHeroes.map(this.renderFavoriteHeroes)}</div>
            </div>
          </Panel>
        </Col>
        <Col lg={6} md={12} sm={12} xs={12}>
          <Panel>
            <Media>
              <Media.Body>
                <Media.Heading>Contacts</Media.Heading>
                <p>Feel free to suggest features or report issues through any of my contacts listed below.</p>
                Discord: Miku#0039
                <p>{socialMedia.map(i => [this.renderSocialMediaButton(i), '\xa0',])}</p>
                For official game support, visit <a href='https://hangame.zendesk.com/hc/en-us/requests/new'>here</a>.
              </Media.Body>
              <Media.Right>
                <Image alt='' rounded src='https://avatars6.githubusercontent.com/u/16639331' width='128' />
              </Media.Right>
            </Media>
          </Panel>
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Disclaimer</Media.Heading>
            This site is not affiliated, associated, authorized by, endorsed by, or in any way officially connected with NHN Entertainment Corp., or LoadComplete Inc., or any of their subsidiaries or their affiliates.
          </Panel>
        </Col>
      </Row>
    );
  }
}