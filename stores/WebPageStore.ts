import { action, computed, observable } from 'mobx';
import { appStore, AppStore } from './AppStore';

export class WebPageStore {
  private appStore: AppStore;

  constructor(appStore: AppStore) {
    this.appStore = appStore;
  }

  @computed
  get viewWebPage() {
    return this.appStore.isWeb && !this.urlInputFocus;
  }

  @computed
  get showMoreMenu() {
    return this.moreMenu && this.viewWebPage;
  }

  @observable
  public urlInputFocus: boolean = false;

  @observable
  public moreMenu: boolean = true;

  @action.bound
  toggleWebMoreMenu() {
    this.moreMenu = !this.moreMenu;
  }

  @observable
  public fullSite: boolean = true;

  @action.bound
  toggleCss() {
    this.fullSite = !this.fullSite
  }

  @observable
  public fontSize: number = 1;

  @action.bound
  increaseFont() {
    if (this.fontSize === 4) {
      return;
    }

    this.fontSize += 0.25;
  };

  @action.bound
  decreaseFont() {
    if (this.fontSize === 1) {
      return;
    }

    this.fontSize -= 0.25;
  };

  @action.bound
  resetFont() {
    this.fontSize = 1;
  };

  @observable
  public isHV: boolean = true;

  @action.bound
  toggleHV() {
    this.isHV = !this.isHV;
  }

  @computed
  get languageButtonText() {
    return this.isHV ? 'HV' : '汉';
  }
}

export const webPageStore = new WebPageStore(appStore);