import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { ActivityIndicator, WebView } from 'react-native';
import { observe } from 'mobx';
import { inject, observer } from 'mobx-react';
import { extractBaseUrl } from '../utils/normalize-url';
import { webPageStore } from '../stores';
import { WebPageStore } from '../stores/WebPageStore';
import { AppStore } from '../stores/AppStore';

interface WebProps {
  loading: any;
  htmlHV: string;
  htmlOrig: string;
  onNavigationStateChange: (navState: object) => void;
  appStore: AppStore;
  webPageStore: WebPageStore;
}

const webView = React.createRef<WebView>();

// Using observe instead of autorun against the advise because
// autorun runs even when webView is not initialize yet. Mean while
// observe only run when value change, which ensure webView is already created.
// If you put an if before dereference, that autorun will not be run which cause
// some hair teaser.
observe(webPageStore, 'fontSize', () => {
  const script = `javascript:(function() {document.body.style.fontSize = "${webPageStore.fontSize}em";})()`; // eslint-disable-line quotes
  webView.current.injectJavaScript(script);
});

const WebWrapper = styled.View`
    flex: 6
    justify-content: center
`;

const Web: FunctionComponent<WebProps> = props => {
  const { fullSite, fontSize, isHV } = props.webPageStore;
  const { currentUrl } = props.appStore;
  const script = `javascript:(function() {document.body.style.fontSize = "${fontSize}em";})()`; // eslint-disable-line quotes

  return (
    <WebWrapper>
      {props.loading && (
        <ActivityIndicator animating={props.loading} color="rgba(0,0,0,0.2)" size="large" />
      )}

      {!props.loading && (
        <WebView
          ref={webView}
          source={{
            html: isHV ? props.htmlHV : props.htmlOrig,
            baseUrl: fullSite ? extractBaseUrl(currentUrl) : undefined
          }}
          style={{ flex: 1 }}
          mixedContentMode="compatibility"
          useWebKit={true}
          injectedJavaScript={script}
          //window.onscroll=function(){(if((document.documentElement.scrollTop > 50) || (document.body.scrollTop > 50)) {window.postMessage(document.documentElement.scrollTop||document.body.scrollTop);};};
          onNavigationStateChange={props.onNavigationStateChange}
          // onMessage={this.onMessageReceive}
        />
      )}
    </WebWrapper>
  );
};

export default inject('appStore', 'webPageStore')(observer(Web));
