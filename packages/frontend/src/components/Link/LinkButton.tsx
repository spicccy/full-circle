import { Button, ButtonProps } from 'grommet';
import React, { FunctionComponent, MouseEventHandler } from 'react';
import { useHistory } from 'react-router-dom';

interface ILinkButtonProps extends ButtonProps {
  href: string;
}

const LinkButton: FunctionComponent<ILinkButtonProps> = (props) => {
  const history = useHistory();

  const overrideHref: MouseEventHandler = (e) => {
    e.preventDefault();
    history.push(props.href);
  };

  return <Button {...props} onClick={overrideHref} />;
};

export { LinkButton };
