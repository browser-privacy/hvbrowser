import { action, autorun, computed, observable, observe } from 'mobx';
import { AsyncStorage } from 'react-native';

const TITLE_LENGTH = 150;
const BOOKMARK_STORAGE_KEY = 'HV_BROWSER_BOOKMARK_STORAGE_KEY';
const LASTVIEW_STORAGE_KEY = 'HV_BROWSER_LASTVIEW_STORAGE_KEY';

class BookMark {
  public url: string;
  public desc: string;
}

export class AppStore {
  // Screen switching
  @observable
  public isHome: boolean = true;

  @computed
  get isWeb() {
    return !this.isHome;
  }

  @action.bound
  toggleHome() {
    this.isHome = !this.isHome;
  }

  @action.bound
  showWeb() {
    this.isHome = false;
  }

  @observable
  public loading: boolean = false;

  @observable
  public error: boolean = false;

  @observable
  public htmlOrig: string = '';

  @observable
  public htmlHV: string = '';

  @observable
  public currentUrl: string = '';

  @observable
  public hideSearch: boolean = false;

  @observable
  public backButtonEnabled: boolean = false;

  @observable
  public dictionary: object = {};

  @observable
  public history: [] = [];

  @observable
  public lastViewUrl: string = '';

  @observable
  public webPageTitle: string = '';

  @observable.shallow
  public bookmarkStore: Array<BookMark> = [];

  @computed
  get bookmarkButtonText() {
    return this.isCurrentBookmarked ? '📑' : '🔖'
  }

  @computed
  get isCurrentBookmarked() {
    return this.hasWebPage && this.bookmarkStore.findIndex(bookmark => bookmark.url === this.currentUrl) != -1;
  }

  @computed
  get currentUrlIdx() {
    return this.bookmarkStore.findIndex(bookmark => bookmark.url === this.currentUrl);
  }

  @computed
  get hasWebPage() {
    return this.currentUrl && this.webPageTitle;
  }

  @action.bound
  toggleBookmark() {
    if (!this.hasWebPage) {
      return;
    }

    if (this.isCurrentBookmarked) {
      // Already bookmark, remove it.
      console.debug(`Remove bookmark ${this.currentUrl} with ${this.currentUrlIdx}`);

      // @ts-ignore
      this.bookmarkStore.remove(this.bookmarkStore[this.currentUrlIdx]);
    } else {
      console.debug(`Add bookmark ${this.currentUrl}`);
      const desc = this.webPageTitle.slice(0, TITLE_LENGTH) + '...';
      // Store book url
      const newBookmark = { url: this.currentUrl, desc };
      this.bookmarkStore.push(newBookmark);
    }
  }

  @action.bound
  async initializeFromAsyncStorage() {
    try {
      const bookmarkStoreResult = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (!!bookmarkStoreResult) {
        this.bookmarkStore = await JSON.parse(bookmarkStoreResult);
      }

      const lastViewUrlResult = await AsyncStorage.getItem(LASTVIEW_STORAGE_KEY);
      if (!!lastViewUrlResult) {
        this.lastViewUrl = lastViewUrlResult;
      }
    } catch (e) {
      console.log('Failed to load bookmarks');
    }
  }
}

export const appStore = new AppStore();
appStore.initializeFromAsyncStorage().then(() => {
  console.debug('Loaded stored data');
});

autorun(async () => {
  if(!appStore.hasWebPage){
    return;
  }

  try {
    let bookmarkStoreJson = JSON.stringify(appStore.bookmarkStore);
    console.debug("Bookmark before storing: " + bookmarkStoreJson);
    await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, bookmarkStoreJson);
  } catch (e) {
    console.debug('Failed to save bookmark into AsyncStorage');
  }
});

observe(appStore, 'lastViewUrl', change => {
  if (!change.newValue) {
    return;
  }

  try {
    AsyncStorage.setItem(LASTVIEW_STORAGE_KEY, change.newValue).then(() => {
      console.debug(`Last url visited: ${change.newValue}`);
    });
  } catch (e) {
    console.log('Failed to save last url ', appStore.lastViewUrl);
  }
});