import { MaybePromise } from '@full-circle/shared/lib/interfaces';
import React, { FunctionComponent, MouseEventHandler } from 'react';
import Spinner from 'react-loader-spinner';
import { useHistory } from 'react-router-dom';
import {
  ILoadingButtonProps,
  LoadingButton,
} from 'src/components/Button/LoadingButton';

interface ILinkButtonProps extends ILoadingButtonProps {
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

  return <LoadingButton {...props} onClick={overrideHref} />;
};

export { LinkButton };
