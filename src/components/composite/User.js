import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Avatar, styles } from '@storybook/design-system';

const { color, typography } = styles;

const AvatarWrapper = styled(Avatar)`
  min-width: 40px;
`;

const UserWrapper = styled.div`
  display: flex;
`;

const Text = styled.div`
  margin-left: 15px;
`;

const Name = styled.div`
  color: ${color.darkest};
  font-size: ${typography.size.s3}px;
  font-weight: ${typography.weight.bold};
  line-height: 20px;
  hyphens: auto;
`;

const Detail = styled.div`
  color: #586368;
  font-size: ${typography.size.s2}px;
  line-height: 16px;
  margin-top: 3px;
  text-align: left;
`;

function User({ detail, name, src, ...rest }) {
  return (
    <UserWrapper {...rest}>
      <AvatarWrapper size="large" src={src} />

      <Text>
        <Name>{name}</Name>
        <Detail>{detail}</Detail>
      </Text>
    </UserWrapper>
  );
}

User.propTypes = {
  detail: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

export default User;
