import { renderPage, startMainBanerTimer, addEvent } from './controller.js';
import { INITIAL_PAGE } from './constant.js';

const init = () => {
  renderPage(INITIAL_PAGE).then(currentPageData => {
    startMainBanerTimer(currentPageData['mainBanner']);
    addEvent(currentPageData);
  });
};

init();
