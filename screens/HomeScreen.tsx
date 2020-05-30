import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import ImageGrid from '../components/ImageGrid';
import { inject, observer } from 'mobx-react';
import { AppStore } from '../stores/AppStore';

type UpdateUrlFunction = (url: string) => void;

interface HomeProps {
  appStore: AppStore;
  onPressImage: UpdateUrlFunction;
}

const HomeWrapper = styled.View`
  flex: 6
  justify-content: center
`;

const Instruction = styled.Text`
  margin: 10px 10px;
`;

const Home: FunctionComponent<HomeProps> = props => {
  return (
    <HomeWrapper>
      <Instruction>
        Please click on 🏠 button for switching between Home and Browse mode or click on any icon
        below to go to the site.
      </Instruction>
      <ImageGrid
        onPressImage={props.onPressImage}
        bookmarkStore={props.appStore.bookmarkStore || []}
        lastViewUrl={props.appStore.lastViewUrl}
      />
    </HomeWrapper>
  );
};

export default inject('appStore')(observer(Home));
