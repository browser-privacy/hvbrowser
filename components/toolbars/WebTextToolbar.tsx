import { Text } from 'react-native';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import ToolbarButton from '../buttons/ToolbarButton';
import { inject, observer } from 'mobx-react';
import { WebPageStore } from '../../stores/WebPageStore';

const ViewBar = styled.View`
  height: 30px;
  margin-top: 3px;
  flex-direction: row;
  justify-content: flex-end;
`;

interface WebTextToolbarProps {
  webPageStore: WebPageStore;
  reloadPage: () => void;
}

const WebTextToolbar: FunctionComponent<WebTextToolbarProps> = ({ webPageStore, reloadPage }) => {
  return (
    <ViewBar>
      <ToolbarButton onPress={() => webPageStore.toggleCss()}>
        <Text>{webPageStore.fullSite ? '1' : '½'}</Text>
      </ToolbarButton>
      <ToolbarButton onPress={reloadPage}>
        <Text>{'↻'}</Text>
      </ToolbarButton>
      <ToolbarButton onPress={() => webPageStore.decreaseFont()}>
        <Text>{'a⁻'}</Text>
      </ToolbarButton>
      <ToolbarButton onPress={() => webPageStore.resetFont()}>
        <Text>{'1:1'}</Text>
      </ToolbarButton>
      <ToolbarButton onPress={() => webPageStore.increaseFont()}>
        <Text>{'A⁺'}</Text>
      </ToolbarButton>
    </ViewBar>
  );
};

export default inject('webPageStore')(observer(WebTextToolbar));
