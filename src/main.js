import SiteMenuView from './view/site-menu-view';
import StatisticView from './view/statistics-view';
import TripPresenter from './presenter/Trip-presenter';
import FilterPresenter from './presenter/Filter-presenter';
import PointsModels from './model/points-model';
import FilterModel from './model/filter-model';
import ApiService from './api-service';
import { render, renderPosition, remove } from './render';
import { MenuItem } from './const';


const AUTHORIAZATION = 'Basic sdjfrjdr3d43fjwkw34';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';


const tripBody = document.querySelector('.page-body');
const siteMenuElement = tripBody.querySelector('.trip-controls__navigation');
const mainContainer = tripBody.querySelector('.trip-events');
const buttonAddNewPoint = document.querySelector('.trip-main__event-add-btn');
const siteMenuComponent = new SiteMenuView();

const pointsModel = new PointsModels(new ApiService(END_POINT, AUTHORIAZATION));

const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(mainContainer, pointsModel, filterModel, new ApiService(END_POINT, AUTHORIAZATION));
const filterPresenter = new FilterPresenter(siteMenuElement, filterModel, pointsModel);

const handlePointNewFormClose = () => {
  siteMenuComponent.element.querySelector(`[value=${MenuItem.TABLE}]`).disabled = false;
  siteMenuComponent.element.querySelector(`[value=${MenuItem.STATS}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

let statisticsCOmponent = null;
let currentMenuItem = 'table';

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      remove(statisticsCOmponent);
      filterPresenter.destroy();
      filterPresenter.init();
      tripPresenter.destroy();
      tripPresenter.init();
      tripPresenter.createNewPoint(handlePointNewFormClose);
      siteMenuComponent.element.querySelector(`[value=${MenuItem.TABLE}]`).disabled = true;
      siteMenuComponent.element.querySelector(`[value=${MenuItem.STATS}]`).disabled = true;
      break;
    case MenuItem.TABLE:
      filterPresenter.init(pointsModel.points);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      if (currentMenuItem !== 'table') {
        tripPresenter.init();
        currentMenuItem = 'table';
      }
      remove(statisticsCOmponent);
      break;
    case MenuItem.STATS:
      filterPresenter.destroy();
      tripPresenter.destroy();
      if (currentMenuItem !== 'stats') {
        statisticsCOmponent = new StatisticView(pointsModel.points);
        render(mainContainer, statisticsCOmponent, renderPosition.BEFOREEND);
        siteMenuComponent.setMenuItem(MenuItem.STATS);
        currentMenuItem = 'stats';
      }
      break;
  }
};

buttonAddNewPoint.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createNewPoint();
  handlePointNewFormClose();
});

tripPresenter.init();

pointsModel.init().finally(() => {
  filterPresenter.init(pointsModel.points);
  render(siteMenuElement, siteMenuComponent, renderPosition.AFTERBEGIN);
  buttonAddNewPoint.disabled = false;
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
});
