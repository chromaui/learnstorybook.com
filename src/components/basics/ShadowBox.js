import { styled } from '@storybook/theming';
import { styles } from '@storybook/design-system';

const ShadowBox = styled.div`
  background: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 5px 15px 0 rgba(0, 0, 0, 0.05);
  border-radius: ${styles.spacing.borderRadius.small}px;
`;

export default ShadowBox;
