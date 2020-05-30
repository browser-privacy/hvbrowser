import { Text } from 'react-native';
import React, { FunctionComponent } from 'react';
import { inject, observer } from 'mobx-react';
import ToolbarButton from './ToolbarButton';
import { WebPageStore } from '../../stores/WebPageStore';
import { AppStore } from '../../stores/AppStore';
import { appStore } from '../../stores';

interface BookmarkToggleButtonProps {
  appStore: AppStore;
  webPageStore: WebPageStore;
}

const BookmarkToggleButton: FunctionComponent<BookmarkToggleButtonProps> = ({
  appStore,
  webPageStore
}) => {
  const { viewWebPage } = webPageStore;

  return (
    viewWebPage && (
      <ToolbarButton onPress={() => appStore.toggleBookmark()}>
        <Text>{appStore.bookmarkButtonText}</Text>
      </ToolbarButton>
    )
  );
};

export default inject('appStore', 'webPageStore')(observer(BookmarkToggleButton));
