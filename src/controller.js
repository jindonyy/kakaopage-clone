import { $, $$, removeAndInsertHTML, getToday } from "./utility.js";
import { getPageData } from "./data.js";
import { getPageTemp, getDayTopContentTemp, getMainBannerTemp } from "./view.js";
import { addClickEvent } from "./eventListener.js";

const activateDayTopTabButton = (gnbTarget, today) => {
    if(gnbTarget !== '웹툰' && gnbTarget !== '웹소설') return;
    $$('.day-top-tab__button')[today].classList.add('day-top-tab__button--active');
}

export const renderPage = async (gnbTarget) => {
    const today = getToday();
    const dataUrl = getPageData(gnbTarget);
    const response = await fetch(dataUrl);
    const currentPageData = await response.json();
    const PageTemp = getPageTemp(gnbTarget, currentPageData, today);
    removeAndInsertHTML('.contents', 'afterbegin', PageTemp);
    activateDayTopTabButton(gnbTarget, today);
    return currentPageData;
}

export const renderDayTop = (dayTopData, currentTabIdx) => {
    const newDayTopContentTemp = getDayTopContentTemp(dayTopData, currentTabIdx);
    const newDayTopContent = newDayTopContentTemp.rankList + newDayTopContentTemp.gradeList;
    removeAndInsertHTML('.day-top-conntent', 'afterbegin', newDayTopContent);
}

const renderMainBanner = (newMainBannerData, [className, insertPosition]) => {
    const newMainBannerTemp = getMainBannerTemp(newMainBannerData, className);
    $('.main-banners__contents').insertAdjacentHTML(insertPosition, newMainBannerTemp);
}

const moveSlide = (slideName, [oldSlide, newSlide]) => {
    $(`.${slideName} .${oldSlide}`).remove();
    $(`.${slideName} .current-slide`).classList.add(oldSlide);
    $(`.${slideName} .current-slide`).classList.remove('current-slide')
    $(`.${slideName} .${newSlide}`).classList.add('current-slide');
    $(`.${slideName} .${newSlide}`).classList.remove(newSlide)
}

const updateMainBannerIdx = (currentIdx) => {
    $('.main-banners .slide-paging-number__current').textContent = currentIdx;
}

export const MAIN_BANNER_INFO = {
    mainBannerTimer: function() {},
    currentIdx: 1,
    viewIdx: 1,
    subtractIdx: function(slideLength) {
        this.currentIdx--;
        this.viewIdx--;
        if(this.currentIdx <= 0) this.currentIdx = slideLength;
        if(this.viewIdx <= 0) this.viewIdx = slideLength;
    },
    addIdx: function(slideLength) {
        this.currentIdx++;
        this.viewIdx++;
        if(this.currentIdx >= slideLength - 1) this.currentIdx = -1;
        if(this.viewIdx > slideLength) this.viewIdx = 1;
    },
    slideTime: 3000,
    throttling: null
};

export const moveMainBanner = (newMainBannerData, parmToMoveMainBanner) => {
    MAIN_BANNER_INFO[parmToMoveMainBanner['idxFun']](parmToMoveMainBanner.slideLength);
    moveSlide('main-banners', parmToMoveMainBanner['moveSlide']);
    renderMainBanner(newMainBannerData, parmToMoveMainBanner['parmToRenderFun']);
    updateMainBannerIdx(MAIN_BANNER_INFO.viewIdx);
}

export const startMainBanerTimer = (mainBannersData) => {
    const parmToMoveMainBanner = {
        idxFun: 'addIdx',
        moveSlide: ['prev-slide', 'next-slide'],
        parmToRenderFun: ['next-slide', 'beforeend'],
        slideLength: mainBannersData.length
    };

    MAIN_BANNER_INFO.mainBannerTimer = setInterval(() => {
        moveMainBanner(mainBannersData[MAIN_BANNER_INFO.currentIdx + 1], parmToMoveMainBanner);
    }, MAIN_BANNER_INFO.slideTime);
}

export const addEvent = (currentPageData) => {
    addClickEvent(currentPageData);
}