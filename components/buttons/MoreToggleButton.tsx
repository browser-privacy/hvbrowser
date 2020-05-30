import { Text } from 'react-native';
import React, { FunctionComponent } from 'react';
import { inject } from 'mobx-react';
import ToolbarButton from './ToolbarButton';
import { WebPageStore } from '../../stores/WebPageStore';

interface MoreToggleButtonProps {
  webPageStore: WebPageStore
}

const MoreToggleButton: FunctionComponent<MoreToggleButtonProps> = ({ webPageStore }) => {
  const { viewWebPage } = webPageStore;

  return viewWebPage && (
    <ToolbarButton onPress={() => webPageStore.toggleWebMoreMenu()}>
      <Text>{'...'}</Text>
    </ToolbarButton>
  );
};

export default inject('webPageStore')(MoreToggleButton);