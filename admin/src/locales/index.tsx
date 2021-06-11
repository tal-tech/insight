import React, { FC } from 'react';

import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';
import zh_CN from './zh-CN';

export const lacaleConfig = {
  zh_CN: zh_CN
};

export const LocaleFormatter: FC<MessageDescriptor> = ({ ...props }) => {
  const notChildProps = { ...props, children: undefined };
  return <FormattedMessage {...notChildProps} id={props.id} />;
};

type FormatMessageProps = (descriptor: MessageDescriptor) => string;

export const useLocale = () => {
  const { formatMessage: _formatMessage, ...rest } = useIntl();
  const formatMessage: FormatMessageProps = _formatMessage;
  return {
    ...rest,
    formatMessage
  };
};
