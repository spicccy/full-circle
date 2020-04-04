import { Colour } from '@full-circle/shared/lib/canvas';
import { Button, ButtonProps } from 'grommet';
import React, { FunctionComponent } from 'react';
import Spinner from 'react-loader-spinner';
export interface ILoadingButtonProps
  extends ButtonProps,
    Omit<JSX.IntrinsicElements['button'], 'color'> {
  loading?: boolean;
}

const LoadingButton: FunctionComponent<ILoadingButtonProps> = (props) => {
  const { icon, loading, ...rest } = props;

  return (
    <Button
      {...rest}
      icon={
        loading ? (
          <Spinner
            height={24}
            width={24}
            color={Colour.LIGHT_GRAY}
            type="Rings"
          />
        ) : (
          icon
        )
      }
    />
  );
};

export { LoadingButton };
