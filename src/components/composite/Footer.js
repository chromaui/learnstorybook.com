import React from 'react';
import { styled } from '@storybook/theming';
import PropTypes from 'prop-types';
import { Link as GatsbyLink, withPrefix } from 'gatsby';
import { Icon, Link, Subheading, styles } from '@storybook/design-system';
// eslint-disable-next-line
import siteMetadata from '../../../site-metadata';
import MailingListSignup from './MailingListSignup';

const { background, color, typography, pageMargins, pageMargin, spacing, breakpoint } = styles;

const Title = styled(Subheading)`
  display: block;
  font-size: ${typography.size.s1}px;
  margin-bottom: 1rem;
  color: ${color.mediumdark};
`;

const ResourceTitle = styled.div`
  font-weight: ${typography.weight.extrabold};
  margin-bottom: 0.25rem;
`;

const ResourceDesc = styled.div`
  margin-bottom: 0.25rem;
`;

const ResourceAction = styled(Link)`
  margin-right: 15px;
  text-transform: capitalize;
`;

const ResourceActions = styled.div``;

const Meta = styled.div`
  overflow: hidden;
`;

const Resource = styled.div`
  display: flex;
  align-items: start;

  &:not(:last-child) {
    margin-bottom: 2rem;
  }

  img {
    margin-right: 20px;
    display: block;
    width: 40px;
    height: auto;
  }

  @media (min-width: ${breakpoint * 1}px) {
    img {
      width: 48px;
    }
  }
`;

const Resources = styled.div``;

const UpperColumn = styled.div`
  flex: 1;

  padding-left: ${spacing.padding.medium}px;
  padding-right: ${spacing.padding.medium}px;
  padding-top: 3rem;
  padding-bottom: 3rem;

  &:last-child {
    border-top: 1px solid ${color.border};
  }

  @media (min-width: ${breakpoint * 1}px) {
    &:first-child {
      margin-left: ${pageMargin * 1}%;
      padding-right: 60px;
    }
    &:last-child {
      margin-right: ${pageMargin * 1}%;
      padding-left: 60px;
      border-top: none;
      border-left: 1px solid ${color.border};
    }
  }

  @media (min-width: ${breakpoint * 2}px) {
    &:first-child {
      margin-left: ${pageMargin * 2}%;
    }
    &:last-child {
      margin-right: ${pageMargin * 2}%;
    }
  }

  @media (min-width: ${breakpoint * 3}px) {
    &:first-child {
      margin-left: ${pageMargin * 3}%;
    }
    &:last-child {
      margin-right: ${pageMargin * 3}%;
    }
  }

  @media (min-width: ${breakpoint * 4}px) {
    &:first-child {
      margin-left: ${pageMargin * 4}%;
    }
    &:last-child {
      margin-right: ${pageMargin * 4}%;
    }
  }
`;

const Upper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  border-bottom: 1px solid ${color.border};

  @media (min-width: ${breakpoint}px) {
    flex-direction: row;
  }
`;

const LogotypeWrapper = styled(Link)`
  margin-bottom: 1rem;
  display: block;

  img {
    height: 28px;
    width: auto;
    display: block;

    transition: all 150ms ease-out;
    transform: translate3d(0, 0, 0);
    &:hover {
      transform: translate3d(0, -1px, 0);
    }
    &:active {
      transform: translate3d(0, 0, 0);
    }
  }
`;

const FooterLink = styled(Link)``;

const Text = styled.div`
  color: ${color.darker};
`;
const Colophon = styled.div`
  a {
    display: inline-block;
    vertical-align: top;
  }
`;

const Column = styled.div`
  > ${FooterLink} {
    display: block;
    margin-bottom: 0.75rem;
  }
`;

const Subscribe = styled.div`
  ${Text} {
    margin-bottom: 1rem;
  }
`;

const HrWrapper = styled.div`
  ${pageMargins};
  hr {
    margin: 0;
  }
`;

const Netlify = styled.img``;
const Chromatic = styled.img``;
const CircleCI = styled.img``;

const Service = styled.div`
  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  ${Text} {
    margin-bottom: 0.5rem;
    color: ${color.mediumdark};
  }
`;

const Services = styled.div`
  ${pageMargins};
  padding-top: 2rem;
  padding-bottom: 1rem;

  display: flex;
  flex-wrap: wrap;

  @media (min-width: ${breakpoint}px) {
    justify-content: space-around;
    text-align: center;
  }

  ${Service} {
    flex: 0 0 50%;
    @media (min-width: ${breakpoint}px) {
      flex: 1;
    }
  }

  a {
    display: inline-block;
    transition: all 150ms ease-out;
    transform: translate3d(0, 0, 0);

    &:hover {
      transform: translate3d(0, -2px, 0);
    }

    &:active {
      transform: translate3d(0, 0, 0);
    }
  }

  ${Netlify}, ${Chromatic}, ${CircleCI} {
    height: 22px;
    width: auto;
    display: inline-block;
    transition: all 150ms ease-out;
  }

  ${CircleCI} {
    /* Turn down the pure black of these logos */
    opacity: 0.75;
  }
`;

const Lower = styled.div`
  ${pageMargins};
  padding-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  ${Colophon} {
    width: 100%;
    margin-bottom: 3rem;
    display: block;

    @media (min-width: ${breakpoint * 1}px) {
      margin-bottom: 3rem;
      width: auto;
      max-width: 200px;
    }
  }

  ${Column} {
    width: 50%;
    margin-bottom: 2.25rem;

    @media (min-width: ${breakpoint}px) {
      padding-right: 20px;
      width: auto;
      margin-bottom: 2.25rem;
    }
  }

  ${Subscribe} {
    width: 100%;
    margin-bottom: 3rem;
    @media (min-width: ${breakpoint}px) {
      width: auto;
      margin-bottom: 3rem;
    }
  }
`;

const FooterWrapper = styled.div`
  background-color: ${background.app};
  border-top: 1px solid ${color.border};
  font-size: ${typography.size.s2}px;
  line-height: 20px;
  margin-top: 80px;
`;

function LinkWrapper({ href, isGatsby, ...props }) {
  if (isGatsby) {
    return <GatsbyLink to={href} {...props} />;
  }

  // eslint-disable-next-line
  return <a href={href} {...props} />;
}

LinkWrapper.propTypes = {
  href: PropTypes.string.isRequired,
  isGatsby: PropTypes.bool.isRequired,
};

const { urls = {}, coreFrameworks } = siteMetadata;
const { twitter, chat, youtube, navLinks: _navLinks = {}, gitHub = {} } = urls;

// Insert the Telemetry link immediately following Support
const navLinks = _navLinks.slice();
const insertIndex = navLinks.findIndex(({ title }) => title === 'Support');
navLinks.splice(insertIndex + 1, 0, { title: 'Telemetry', href: urls.telemetry, isGatsby: true });

const frontpageUrl = 'https://storybook.js.org';

const absoluteNavLinks = navLinks.map((link) => ({
  title: link.title,
  href: link.isGatsby ? `${frontpageUrl}${link.href}` : link.href,
  isGatsby: false,
}));

function Footer({ ...props }) {
  return (
    <FooterWrapper {...props}>
      <Upper>
        <UpperColumn>
          <Resources>
            <Resource>
              <img src={withPrefix('/repo.svg')} alt="Docs" />
              <Meta>
                <ResourceTitle>Documentation</ResourceTitle>
                <ResourceDesc>
                  Add Storybook to your project in less than a minute to build components faster and
                  easier.
                </ResourceDesc>
                <ResourceActions>
                  {coreFrameworks.map((framework) => (
                    <ResourceAction
                      withArrow
                      key={framework}
                      href={`${frontpageUrl}/docs/${framework}/get-started/introduction`}
                    >
                      {framework}
                    </ResourceAction>
                  ))}
                </ResourceActions>
              </Meta>
            </Resource>
          </Resources>
        </UpperColumn>
        <UpperColumn>
          <Resources>
            <Resource>
              <img src={withPrefix('/direction.svg')} alt="Tutorial" />
              <Meta>
                <ResourceTitle>Tutorials</ResourceTitle>
                <ResourceDesc>
                  Learn Storybook with in-depth tutorials that teaches Storybook best practices.
                  Follow along with code samples.
                </ResourceDesc>
                <ResourceActions>
                  <Link withArrow isGatsby LinkWrapper={LinkWrapper} href="/">
                    Learn Storybook now
                  </Link>
                </ResourceActions>
              </Meta>
            </Resource>
          </Resources>
        </UpperColumn>
      </Upper>
      <Lower>
        <Colophon>
          <LogotypeWrapper isGatsby to="/">
            <img src={withPrefix('/storybook-logo.svg')} alt="Storybook" />
          </LogotypeWrapper>
          <Text>
            The MIT License (MIT). Website design by{' '}
            <Link tertiary href="https://twitter.com/domyen" target="_blank">
              <b>@domyen</b>
            </Link>{' '}
            and the awesome Storybook community.
          </Text>
        </Colophon>
        <Column>
          <Title>Storybook</Title>
          {absoluteNavLinks.map(({ title, href, isGatsby }) => (
            <FooterLink
              tertiary
              key={title}
              href={href}
              isGatsby={isGatsby}
              LinkWrapper={LinkWrapper}
            >
              {title}
            </FooterLink>
          ))}
        </Column>
        <Column>
          <Title>Community</Title>
          <FooterLink tertiary href={gitHub.repo}>
            <Icon icon="github" /> GitHub
          </FooterLink>
          <FooterLink tertiary href={twitter}>
            <Icon icon="twitter" /> Twitter
          </FooterLink>
          <FooterLink tertiary href={chat}>
            <Icon icon="discord" /> Discord chat
          </FooterLink>
          <FooterLink tertiary href={youtube}>
            <Icon icon="youtube" /> Youtube
          </FooterLink>
          <FooterLink tertiary href="https://componentdriven.org/">
            <Icon icon="componentdriven" /> Component Driven UIs
          </FooterLink>
        </Column>
        <Subscribe>
          <Title>Subscribe</Title>
          <Text>Get news, free tutorials, and Storybook tips emailed to you.</Text>
          <MailingListSignup />
        </Subscribe>
      </Lower>
      <HrWrapper>
        <hr />
      </HrWrapper>
      <Services>
        <Service>
          <Text>Maintained by</Text>
          <a href="https://www.chromatic.com/">
            <Chromatic src={withPrefix('/logo-chromatic.svg')} alt="Chromatic" />
          </a>
        </Service>
        <Service>
          <Text>Continuous integration by</Text>
          <a href="https://circleci.com/">
            <CircleCI src={withPrefix('/logo-circleci.svg')} alt="CircleCI" />
          </a>
        </Service>
        <Service>
          <Text>Hosting by</Text>
          <a href="https://netlify.com">
            <Netlify src={withPrefix('/logo-netlify.svg')} alt="Netlify" />
          </a>
        </Service>
      </Services>
    </FooterWrapper>
  );
}

export default Footer;
