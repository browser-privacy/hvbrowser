import { Text } from 'react-native';
import React, { FunctionComponent } from 'react';
import { inject, observer } from 'mobx-react';
import ToolbarButton from './ToolbarButton';
import { WebPageStore } from '../../stores/WebPageStore';

interface HVToggleButtonProps {
  webPageStore: WebPageStore
}

const HVToggleButton: FunctionComponent<HVToggleButtonProps> = ({ webPageStore }) => {
  const { languageButtonText, viewWebPage } = webPageStore;

  return viewWebPage && (
    <ToolbarButton onPress={() => webPageStore.toggleHV()}>
      <Text>{languageButtonText}</Text>
    </ToolbarButton>
  );
};

export default inject('webPageStore')(observer(HVToggleButton));