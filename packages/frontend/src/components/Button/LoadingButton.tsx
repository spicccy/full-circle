import { Button, ButtonProps } from 'grommet';
import React, { FunctionComponent } from 'react';

import { LoadingIndicator } from './LoadingIndicator';
export interface ILoadingButtonProps
  extends ButtonProps,
    Omit<JSX.IntrinsicElements['button'], 'color'> {
  loading?: boolean;
}

const LoadingButton: FunctionComponent<ILoadingButtonProps> = (props) => {
  const { icon, loading, ...rest } = props;

  return <Button {...rest} icon={loading ? <LoadingIndicator /> : icon} />;
};

export { LoadingButton };
