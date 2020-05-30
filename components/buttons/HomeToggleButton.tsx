import { Text } from 'react-native';
import React, { FunctionComponent } from 'react';
import ToolbarButton from './ToolbarButton';
import { inject } from 'mobx-react';
import { AppStore } from '../../stores/AppStore';

interface HomeToggleButtonProps {
  appStore: AppStore
}

const HomeToggleButton: FunctionComponent<HomeToggleButtonProps> = ({ appStore }) => {
  return (
    <ToolbarButton onPress={() => appStore.toggleHome()}>
      <Text>{'🏠'}</Text>
    </ToolbarButton>
  );
};

export default inject('appStore')(HomeToggleButton);