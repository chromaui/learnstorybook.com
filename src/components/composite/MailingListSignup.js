import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Formik } from 'formik';
import { Button, Input, styles } from '@storybook/design-system';

const MailingListFormUIWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const EmailInput = styled(Input)`
  flex: 1;
  && input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: ${styles.spacing.borderRadius.small}px;
    border-bottom-left-radius: ${styles.spacing.borderRadius.small}px;
  }
`;

const SendButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: ${styles.spacing.borderRadius.small}px;
  border-bottom-right-radius: ${styles.spacing.borderRadius.small}px;
`;

function MailingListFormUI({ handleBlur, handleChange, isSubmitting, value, ...rest }) {
  return (
    <MailingListFormUIWrapper {...rest}>
      <EmailInput
        id="email"
        icon="email"
        type="email"
        name="email"
        value={value}
        placeholder="Your email"
        onChange={handleChange}
        onBlur={handleBlur}
        autoCapitalize="off"
        autoCorrect="off"
        label="Your email"
        hideLabel
      />

      <SendButton appearance="secondary" type="submit" isUnclickable={isSubmitting}>
        Send
      </SendButton>
    </MailingListFormUIWrapper>
  );
}

MailingListFormUI.propTypes = {
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  value: PropTypes.string,
};

MailingListFormUI.defaultProps = {
  value: '',
};

const MailingListConfirm = styled.div`
  font-size: ${styles.typography.size.s2}px;
  background: ${styles.background.positive};
  line-height: 20px;
  padding: 10px;
  text-align: center;
  border-radius: ${styles.spacing.borderRadius.small}px;
`;

const FormWrapper = styled.form`
  max-width: 300px;
`;

const validateForm = (values) => {
  if (!values.email) {
    return { email: 'Required' };
  }

  return {};
};

const listUrl = 'https://storybook.us18.list-manage.com/subscribe/post';

function MailingListSignup(props) {
  const [hasSubmitted, setSubmitStatus] = useState(false);
  const onSubmitForm = async (values) => {
    const data = new FormData();
    const fullFields = {
      u: '06a6fce3ab1327784d4342396',
      id: '18b5cea6e6',
      MERGE3: 'learn-storybook',
      MERGE0: values.email,
    };

    Object.keys(fullFields).forEach((key) => data.append(key, fullFields[key]));

    await fetch(listUrl, {
      method: 'POST',
      body: data,
      mode: 'no-cors',
    });

    setSubmitStatus(true);
  };

  if (hasSubmitted) {
    return (
      <MailingListConfirm {...props}>
        <b>
          <span role="img" aria-label="thumbs up">
            👍
          </span>{' '}
          Thanks, you&rsquo;re all signed up!
        </b>
      </MailingListConfirm>
    );
  }

  return (
    <Formik validate={validateForm} onSubmit={onSubmitForm}>
      {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <FormWrapper onSubmit={handleSubmit}>
          <MailingListFormUI
            value={values && values.email}
            handleChange={handleChange}
            handleBlur={handleBlur}
            isSubmitting={isSubmitting}
            {...props}
          />
        </FormWrapper>
      )}
    </Formik>
  );
}

export default MailingListSignup;
