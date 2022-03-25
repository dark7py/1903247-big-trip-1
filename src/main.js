import HeaderInfoView from './view/header-info-view';
import SiteMenuView from './view/site-menu-view';
import FilterView from './view/filter-view';
import SortView from './view/sort-view';
import PointView from './view/point-view';
import OfferFormView from './view/offer-form-view';
import PointListView from './view/point-list-view';
import MessageWithoutPoints from './view/empty-points-list';

import { render, renderPosition } from './render.js';
import { generatePoint } from './mock/point';


const POINT_COUNT = 4;
const points = Array.from({ length: POINT_COUNT }, generatePoint);

const tripBody = document.querySelector('.page-body');
const headerMenu = tripBody.querySelector('.trip-main');
const siteMenuElement = tripBody.querySelector('.trip-controls__navigation');
const filtersElement = tripBody.querySelector('.trip-controls__filters');
const mainContainer = tripBody.querySelector('.trip-events');

const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new OfferFormView(point);

  const replacePointToForm = () => {
    pointListElement.replaceChild(pointEditComponent.element, pointComponent.element);
  };

  const replaceFormToPoint = () => {
    pointListElement.replaceChild(pointComponent.element, pointEditComponent.element);
  };

  const onEscKeydowm = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeydowm);
    }
  };

  pointComponent.setEditClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeydowm);
  });

  pointEditComponent.setFormSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeydowm);
  });

  render(pointListElement, pointComponent, renderPosition.BEFOREEND);
};

const pointListComponent = new PointListView();
render(mainContainer, pointListComponent, renderPosition.BEFOREEND);


render(siteMenuElement, new SiteMenuView(), renderPosition.BEFOREEND);
render(filtersElement, new FilterView(), renderPosition.BEFOREEND);


if (points.length === 0) {
  render(pointListComponent, new MessageWithoutPoints(), renderPosition.BEFOREEND);
} else {
  render(headerMenu, new HeaderInfoView(points[0]).element, renderPosition.AFTERBEGIN);
  render(mainContainer, new SortView(), renderPosition.AFTERBEGIN);

  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(pointListComponent.element, points[i]);
  }
}
