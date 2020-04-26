import React, { FunctionComponent } from 'react';
import { LoadingButton } from 'src/components/Button/LoadingButton';
import { Card } from 'src/components/Card/Card';

interface ICuratorReconnectCardProps {
  isLoading: boolean;
  onCuratorReconnect(): void;
}

const CuratorReconnectCard: FunctionComponent<ICuratorReconnectCardProps> = ({
  isLoading,
  onCuratorReconnect,
}) => {
  return (
    <Card pad="large">
      <LoadingButton
        disabled={isLoading}
        loading={isLoading}
        label="Reconnect as curator"
        onClick={onCuratorReconnect}
      />
    </Card>
  );
};

export { CuratorReconnectCard };
