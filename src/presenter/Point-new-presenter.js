import OfferFormView from '../view/offer-form-view';
import { remove, render, renderPosition } from '../render';
import { UpdateType, UserAction } from '../const';

export default class PointNewPresenter {
  #pointContainer = null;

  #point = null;
  #pointEditComponent = null;
  #changeData = null;

  #newPoint = null;
  #destroyCallback = null;
  #destinations = null;
  #allOffers = null;

  constructor(pointContainer, changeData) {
    this.#pointContainer = pointContainer;
    this.#changeData = changeData;
  }

  init = (newPoint, destinations, allOffers) => {
    this.#newPoint = newPoint;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#destinations = destinations;
    this.#allOffers = allOffers;

    this.#pointEditComponent = new OfferFormView(this.#newPoint, this.#destinations, this.#allOffers);

    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    render(this.#pointContainer, this.#pointEditComponent, renderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeydowm);
  }

  destroy = () => {
    this.#destroyCallback?.();
    remove(this.#point);
    remove(this.#pointEditComponent);

    document.removeEventListener('keydown', this.#onEscKeydowm);
  }

  #onEscKeydowm = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  setSaving = () => {
    this.#pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #handleDeleteClick = () => {
    this.destroy();
  }
}
