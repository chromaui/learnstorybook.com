import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import { styles } from '@storybook/design-system';
import Contributors from './Contributors';
import MadeByChroma from './MadeByChroma';
import MeetTheTeam from './MeetTheTeam';
import Sponsors from './Sponsors';

const { typography } = styles;

const TeamWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 160px 20px 90px;
`;

const Content = styled.div`
  font-size: ${typography.size.s3}px;
  line-height: 28px;
`;

const Section = styled.div`
  margin-top: ${props => (props.isFirst ? 0 : 80)}px;
`;

const description = 'Meet the team behind learnstorybook.com';
const title = 'Team';

const PureTeamScreen = ({
  data: {
    site: { siteMetadata },
  },
}) => (
  <TeamWrapper>
    <Helmet>
      <title>{`${title} | ${siteMetadata.title}`}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${siteMetadata.permalink}/team`} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>

    <Content>
      <Section isFirst>
        <MeetTheTeam />
      </Section>

      <Section>
        <Contributors />
      </Section>

      <Section>
        <MadeByChroma />
      </Section>

      <Section>
        <Sponsors />
      </Section>
    </Content>
  </TeamWrapper>
);

PureTeamScreen.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        permalink: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

const TeamScreen = props => (
  <StaticQuery
    query={graphql`
      query TeamQuery {
        site {
          siteMetadata {
            permalink
            title
          }
        }
      }
    `}
    render={data => <PureTeamScreen data={data} {...props} />}
  />
);

export default TeamScreen;
