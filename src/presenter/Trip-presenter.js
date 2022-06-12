import SortView from '../view/sort-view';
import PointListView from '../view/point-list-view';
import MessageWithoutPointsView from '../view/empty-points-list';
import { remove, render, renderPosition } from '../render.js';
import PointPresenter, { State as PointPresenterViewState } from './Point-presenter';

import { SortType, sortPointsByPrice, sortPointsByTime } from '../utils/sort-functions';
import { FilterType, UpdateType, UserAction } from '../const';
import PointNewPresenter from './Point-new-presenter';
import { filter } from '../utils/filter';
import LoadingView from '../view/loading-view';
import { nanoid } from 'nanoid';
import StatisticView from '../view/statistics-view';
import HeaderInfoView from '../view/header-info-view';


export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #statisticComponent = null;
  #infoTripComponent = null;

  #noPointsComponent = null;
  #sortComponent = null;
  #pointListComponent = new PointListView();
  #loadingComponent = new LoadingView();

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  #renderedTotalPrice = 0;
  #destinations = null;
  #offers = null;
  #apiService = null;

  constructor(tripContainer, pointsModel, filterModel, apiService) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#apiService = apiService;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointListComponent, this.#handleViewAction);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE.text:
        return filteredPoints.sort(sortPointsByPrice);
      case SortType.TIME.text:
        return filteredPoints.sort(sortPointsByTime);
    }

    return filteredPoints;
  }

  init = async () => {
    try {
      this.#destinations = await this.#apiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    try {
      this.#offers = await this.#apiService.offers;
    } catch(err) {
      this.#offers = [];
    }

    render(this.#tripContainer, this.#pointListComponent, renderPosition.BEFOREEND);

    this.#pointsModel.addObserver(this.#handleModeEvent);
    this.#filterModel.addObserver(this.#handleModeEvent);

    this.#renderBoard();
  }

  createNewPoint = () => {
    remove(this.#statisticComponent);

    const point = this.#generatePoint();

    const createNewPointData = { ...point, isCreatePoint: true };
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#handleModeChange();
    this.#pointNewPresenter.init(createNewPointData);
  }

  createStatistic = () => {
    this.#statisticComponent = new StatisticView(this.#pointsModel.points);
    render(this.#tripContainer, this.#statisticComponent, renderPosition.BEFOREEND);
  }

  deleteStatistic = () =>{
    remove(this.#statisticComponent);
  }

  destroy = () => {
    this.#clearBoard({ resetRenderedTotalPrice: true, resetSortType: true });

    remove(this.#pointListComponent);

    this.#pointsModel.removeObserver(this.#handleModeEvent);
    this.#filterModel.removeObserver(this.#handleModeEvent);
  }

  #generatePoint = () => ({
    pointType: 'taxi',
    id: nanoid(),
    price: 0,
    offers: [],
    destination: {
      name: '',
      description: '',
      pictures: []
    },
    isFavorite: false,
    startEventDate: new Date(),
    endEventDate: new Date()
  });

  #handleModeEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetRenderedTotalPrice: true, resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);

        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
    }
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((element) => element.resetView());
  }

  #handlePointChange = (updatePoint) => {
    this.#pointPresenter.get(updatePoint.id).init(updatePoint);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  }

  // #sortPoints = (sortType) => {
  //   switch (sortType) {
  //     case SortType.PRICE.text:
  //       this.#boardPoints.sort(sortPointsByPrice);
  //       break;
  //     case SortType.TIME.text:
  //       this.#boardPoints.sort(sortPointsByTime);
  //       break;
  //     default:
  //       this.#boardPoints = [...this.#sourceBoardPoints];
  //   }

  //   this.#currentSortType = sortType;
  // }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handleViewAction, this.#handleModeChange, this.#destinations, this.#offers);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    render(this.#tripContainer, this.#sortComponent, renderPosition.AFTERBEGIN);
    this.#sortComponent.setSortChangeClickHandler(this.#handleSortTypeChange);
  }

  #renderLoading = () => {
    render(this.#pointListComponent, this.#loadingComponent, renderPosition.AFTERBEGIN);
  }

  #renderHeaderInfo = () => {
    const tripContainer = document.querySelector('.trip-main');
    if (this.points.length > 0) {
      remove(this.#infoTripComponent);
      this.#infoTripComponent = new HeaderInfoView(this.points);
      render(tripContainer, this.#infoTripComponent, renderPosition.AFTERBEGIN);
    }
  }

  #renderNoPoints = () => {
    this.#noPointsComponent = new MessageWithoutPointsView(this.#filterType);
    render(this.#tripContainer, this.#noPointsComponent, renderPosition.BEFOREEND);
  }

  #clearBoard = ({ resetRenderedTotalPrice = false, resetSortType = false } = {}) => {
    const totalPointsPrice = 0;
    //this.points.price.forEach((sum, price) => sum + price);

    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetRenderedTotalPrice) {
      this.#renderedTotalPrice = this.#renderedTotalPrice;
    } else {
      this.#renderedTotalPrice = Math.min(totalPointsPrice, this.#renderedTotalPrice);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderHeaderInfo();
    this.#renderSort();
    this.#renderPoints(this.points);
  }
}
