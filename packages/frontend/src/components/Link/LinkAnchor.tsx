import { Anchor, AnchorProps } from 'grommet';
import React, { FunctionComponent, MouseEventHandler } from 'react';
import { useHistory } from 'react-router-dom';

interface ILinkAnchorProps extends AnchorProps {
  href: string;
}

const LinkAnchor: FunctionComponent<ILinkAnchorProps> = props => {
  const history = useHistory();

  const overrideHref: MouseEventHandler = e => {
    e.preventDefault();
    history.push(props.href);
  };

  return <Anchor {...props} onClick={overrideHref} />;
};

export { LinkAnchor };
