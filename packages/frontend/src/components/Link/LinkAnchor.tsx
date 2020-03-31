import { MaybePromise } from '@full-circle/shared/lib/interfaces';
import { Anchor, AnchorProps } from 'grommet';
import React, { FunctionComponent, MouseEventHandler } from 'react';
import { useHistory } from 'react-router-dom';

interface ILinkAnchorProps extends AnchorProps {
  href: string;
  onClick?(): MaybePromise<boolean | void>;
}

const LinkAnchor: FunctionComponent<ILinkAnchorProps> = (props) => {
  const history = useHistory();

  const overrideHref: MouseEventHandler = async (e) => {
    e.preventDefault();
    const shouldNavigate = (await props.onClick?.()) !== false;
    if (shouldNavigate) {
      history.push(props.href);
    }
  };

  return <Anchor {...props} onClick={overrideHref} />;
};

export { LinkAnchor };
