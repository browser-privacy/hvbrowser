import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MessageBar } from 'react-native-messages';

import SearchInput from './components/SearchInput';
import { downloadHtmlPage, convertHtmlPageToHV } from './utils/downloader';
import { cleanupHtml, updateRelativeUrl } from './utils/cleanup';
import { fixUrl, extractBaseUrl } from './utils/normalize-url';
import Home from './screens/HomeScreen';
import Web from './screens/WebScreen';
import { observer, inject } from 'mobx-react';
import HomeToggleButton from './components/buttons/HomeToggleButton';
import MoreToggleButton from './components/buttons/MoreToggleButton';
import WebTextToolbar from './components/toolbars/WebTextToolbar';
import HVToggleButton from './components/buttons/HVToggleButton';
import BookmarkToggleButton from './components/buttons/BookmarkToggleButton';

class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      htmlOrig: '',
      htmlHV: '',
      hideSearch: false,
      backButtonEnabled: false,
      dictionary: {},
      history: []
    };
  }

  async componentDidMount() {
    this.setState({
      dictionary: require('./data/DataHanVietUni.json')
    });
  }

  updateHistory = urlNew => {
    const { currentUrl } = this.props.appStore;
    const { history } = this.state;
    // console.log("Before update: " + history + " with current url: " + currentUrl + " with urlNew: " + urlNew);

    if (currentUrl === urlNew) {
      return history; // No change
    }

    const historiesItem = [...history, urlNew];
    if (historiesItem.length > 50) {
      historiesItem.shift();
    }

    // console.log("After updating history: " + historiesItem);
    return historiesItem;
  };

  handleUpdateUrl = async url => {
    const { webPageStore, appStore } = this.props;
    const { currentUrl } = this.props.appStore;

    if (!url) {
      return;
    }

    if (
      !url ||
      url.indexOf('about') !== -1 ||
      url.indexOf('Bundle/Application') !== -1 ||
      url.indexOf('postMessage') !== -1
    ) {
      return;
    }

    url = fixUrl(currentUrl, url);

    // console.log(`CurrentUrl: ${currentUrl} and url after fixing: ${url}`);

    // Update history
    var historiesItem = this.updateHistory(url); // It can be a problem when user not enter the full but go back with full

    webPageStore.urlInputFocus = false;
    appStore.currentUrl = url;
    this.setState(
      {
        loading: true,
        backButtonEnabled: !!this.history && this.history.length >= 1,
        history: historiesItem
      },
      async () => {
        try {
          const htmlContent = await downloadHtmlPage(url);
          const htmlClean = await cleanupHtml(htmlContent);
          const htmlNormalize = await updateRelativeUrl(htmlClean, url);
          const htmlConvert = await convertHtmlPageToHV(htmlNormalize, this.state.dictionary);
          appStore.webPageTitle = htmlConvert.match(/<title>([^<]+)<\/title>/)[1];
          appStore.lastViewUrl = url;

          // console.log('Text: ', htmlConvert);
          this.setState({
            loading: false,
            error: false,
            htmlOrig: '\ufeff' + htmlNormalize,
            htmlHV: '\ufeff' + htmlConvert
          });
        } catch (e) {
          this.setState({
            loading: false,
            error: true
          });
        }
      }
    );
  };

  /**
   * Preventing return to home page when switching between HV/Han or 1 and 1/2
   * @param navState
   * @return {Promise<void>}
   */
  onFollowLink = async navState => {
    // console.log(" Change link? " + JSON.stringify(navState));
    const { currentUrl } = this.props.appStore;
    const { title, jsEvaluationValue, url, navigationType } = navState;

    if (!url) {
      return;
    }

    if (url === currentUrl) {
      // No change
      return;
    }

    if (jsEvaluationValue !== undefined) {
      //JS
      return;
    }

    if (!title) {
      // Kind of not html page
      return;
    }

    if (
      !url ||
      url.indexOf('about') !== -1 ||
      url.match(/data:/) ||
      (url === extractBaseUrl(url) + '/' && navigationType !== 'click') ||
      url.indexOf('postMessage') !== -1
    ) {
      // console.log("Skip");
      return;
    }

    this.setState({
      // Prevent webview to show chinese text before converting.
      htmlOrig: '',
      htmlHV: ''
    });

    await this.handleUpdateUrl(url);
  };

  goBack = () => {
    const { currentUrl } = this.props.appStore;
    var { history } = this.state;
    var oldUrl;

    if (!!history && history.length >= 1) {
      oldUrl = history.pop();
      if (oldUrl === currentUrl) {
        // store current, need to skip back one more time
        oldUrl = history.pop();
      }
    }

    if (!!oldUrl) {
      this.setState({
        history
      });
      this.handleUpdateUrl(oldUrl);
    }
  };

  // onMessageReceive = (event) => {
  // console.log("Message: " + JSON.stringify(event.nativeEvent));
  // if(event.nativeEvent.data > 60) {
  // this.setState({hideSearch: true});
  // } else {
  // this.setState({hideSearch: false});
  // }
  // }

  handlePressImage = url => {
    const { appStore } = this.props;
    appStore.showWeb();
    this.handleUpdateUrl(url);
  };

  reloadPage = () => {
    const { currentUrl } = this.props.appStore;
    this.handleUpdateUrl(currentUrl);
  };

  render() {
    const { appStore, webPageStore } = this.props;
    const { htmlOrig, htmlHV, backButtonEnabled, loading } = this.state;

    const { isHome, isWeb, currentUrl } = appStore;
    const { showMoreMenu } = webPageStore;
    return (
      <View style={styles.container}>
        <View style={styles.controlBar}>
          {!isHome && (
            <View style={styles.urlInput}>
              <SearchInput
                placeholder="Input chinese website url"
                url={currentUrl.indexOf('Bundle/Application') === -1 ? currentUrl : ''}
                onSubmit={this.handleUpdateUrl}
                onFocus={isFocus => (webPageStore.urlInputFocus = isFocus)}
                backButtonEnabled={backButtonEnabled}
                style={styles.inputSearch}
                onBack={this.goBack}
              />
            </View>
          )}
          <BookmarkToggleButton />
          <HVToggleButton />
          <MoreToggleButton />
          <HomeToggleButton />
        </View>
        {showMoreMenu && !loading && <WebTextToolbar reloadPage={this.reloadPage} />}
        {isWeb && (
          <Web
            loading={loading}
            htmlHV={htmlHV}
            htmlOrig={htmlOrig}
            onNavigationStateChange={this.onFollowLink}
          />
        )}
        {isHome && <Home onPressImage={this.handlePressImage} />}
        <MessageBar style={styles.messageBar} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    bottom: 0
  },
  controlBar: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  urlInput: {
    flex: 1,
    flexDirection: 'row'
  },
  inputSearch: {
    flex: 1
  }
});

export default inject('appStore', 'webPageStore')(observer(MainApp));
