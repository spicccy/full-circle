import { MaybePromise } from '@full-circle/shared/lib/interfaces';
import { Button, ButtonProps } from 'grommet';
import React, { FunctionComponent, MouseEventHandler } from 'react';
import { useHistory } from 'react-router-dom';

interface ILinkButtonProps extends ButtonProps {
  href: string;
  onClick?(): MaybePromise<boolean | void>;
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

  return <Button {...props} onClick={overrideHref} />;
};

export { LinkButton };
