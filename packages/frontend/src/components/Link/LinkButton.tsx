import { MaybePromise } from '@full-circle/shared/lib/interfaces';
import { Button, ButtonProps } from 'grommet';
import React, { FunctionComponent, MouseEventHandler } from 'react';
import Spinner from 'react-loader-spinner';
import { useHistory } from 'react-router-dom';

interface ILinkButtonProps extends ButtonProps {
  href: string;
  onClick?(): MaybePromise<boolean | void>;
  loading?: boolean;
}

const LinkButton: FunctionComponent<ILinkButtonProps> = (props) => {
  const history = useHistory();

  const overrideHref: MouseEventHandler = async (e) => {
    e.preventDefault();
    const shouldNavigate = (await props.onClick?.()) !== false;
    if (shouldNavigate) {
      history.push(props.href);
    }
  };

  const { icon, loading, ...rest } = props;

  return (
    <Button
      {...rest}
      onClick={overrideHref}
      icon={loading ? <Spinner type="Rings" /> : icon}
    />
  );
};

export { LinkButton };
