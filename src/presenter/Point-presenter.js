import PointView from '../view/point-view';
import OfferFormView from '../view/offer-form-view';
import { remove, render, renderPosition, replace } from '../render.js';
import { UpdateType, UserAction } from '../const';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  CREATION: 'CREATION'
};

export default class PointPresenter {
  #pointContainer = null;

  #point = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  constructor(pointContainer, changeData, changeMode) {
    this.#pointContainer = pointContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(point);
    this.#pointEditComponent = new OfferFormView(point);

    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);


    this.#pointComponent.setEditClickHandler(() => {
      this.#replacePointToForm();
      document.addEventListener('keydown', this.#onEscKeydowm);
    });
    this.#pointEditComponent.setFormSubmitHandler(() => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeydowm);
    });
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavorite);

    render(this.#pointContainer, this.#pointComponent, renderPosition.BEFOREEND);

    if (this.#mode === Mode.DEFAULT && prevPointComponent) {
      replace(this.#pointComponent, prevPointComponent);
    }
    if (this.#mode === Mode.EDITING && prevEditPointComponent) {
      replace(this.#pointEditComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
  }

  #onArrowClick = () => {
    if (this.#point.querySelector('.event__rollup-btn')) {
      this.#replaceFormToPoint();
    }
  }

  #onEscKeydowm = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeydowm);
    }
  }

  #handleFavorite = () => {
    this.#changeData({ ...this.#point, isFavorite: !this.#point.isFavorite });
  }

  #handleFormSubmit = (update) => {
    const isMinorUpdate = 1;

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR: UpdateType.PATCH,
      update
    );
    this.#replaceFormToPoint();
  }

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #handleNewPointClick = () => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR
    );
  }
}
