import SmartView from './smart-view';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';


const createPointEditOffersTemplate = (offer, isDisabled, selectedOffers) => (
  `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden"  type="checkbox" name="event-offer-luggage" value="${offer.title}" id="${offer.id}" ${isDisabled ? 'disabled' : ''} ${!selectedOffers || !selectedOffers.includes(offer.title) ? '' : 'checked'}>
  <label class="event__offer-label" for="${offer.id}">
    <span class="event__offer-title" data-title="${offer.title}">${offer.title}</span>
    &plus; <span class="event__offer-price" data-title="${offer.title}">${offer.price}</span>&euro;&nbsp;
  </label>
</div>`
);

const createDestinationPicturesTemplate = (picture) => (
  `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
);

const createDesinationsDataList = (city) => (
  `<option value="${city}"></option>`
);

const createOfferForm = (data = {}, destinations, allOffers) => {
  const { pointType = 'taxi', destination, price = 0, offers, startEventDate, endEventDate, id, isDisabled, isSaving, isDeleting, selectedOffers } = data;

  let offersList = '';
  let pictureList = '';
  let dataList = '';

  allOffers.find((item) => item.type === pointType).offers.forEach((offer) => {
    const offerCurrent = createPointEditOffersTemplate(offer, isDisabled, selectedOffers);
    offersList += offerCurrent;
  });

  destinations.find((item) => item.name === destination.name).pictures.forEach((picture) => {
    const pictureCurrent = createDestinationPicturesTemplate(picture);
    pictureList += pictureCurrent;
  });

  destinations.forEach((elem) => {
    dataList += createDesinationsDataList(elem.name);
  });

  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                <div class="event__type-item">
                  <input ${pointType === 'taxi' ? 'checked' : ''} id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" >
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input ${pointType === 'bus' ? 'checked' : ''} id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input ${pointType === 'train' ? 'checked' : ''} id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input ${pointType === 'ship' ? 'checked' : ''} id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input ${pointType === 'drive' ? 'checked' : ''} id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input ${pointType === 'flight' ? 'checked' : ''} id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight">
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>

                <div class="event__type-item">
                  <input ${pointType === 'check in' ? 'checked' : ''} id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input ${pointType === 'sightseeing' ? 'checked' : ''} id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input ${pointType === 'restaraunt' ? 'checked' : ''} id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${pointType}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${dataList}

            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(startEventDate).format('DD/MM/YY H:m')}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(endEventDate).format('DD/MM/YY H:m')}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>

          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
        </header>
        <section class="event__details">

          <section class="event__section  event__section--offers">
          ${offers.length !== 0 ? '<h3 class="event__section-title  event__section-title--offers">Offers</h3>' : ''}
            <div class="event__available-offers">
              ${offersList}
            </div>
          </section>

          ${destination.name !== '' ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${pictureList}
              </div>
            </div>
          </section>` : ''}


        </section>
      </form>
    </li>`;
};

export default class OfferFormView extends SmartView {
  #datepicker = null;
  #destinations = null;
  #allOffers = null;

  constructor(point, destinations, allOffers) {
    super();
    this._data = { ...point };
    this.#destinations = destinations;
    this.#allOffers = allOffers;
    this.#setInnerHandlers();
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  get template() {
    return createOfferForm(this._data, this.#destinations, this.#allOffers);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset = (point) => {
    this.updateData(OfferFormView.parsePointToData(point));
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setcloseClickHandler(this._callback.closeClick);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputHandler);
    this.element.querySelectorAll('.event__type-input').forEach((element) => {
      element.addEventListener('click', this.#pointTypeHandler);
    });
  }

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const newDescription = this.#destinations.find((item) => item.name === evt.target.value).description;
    const newPictures = this.#destinations.find((item) => item.name === evt.target.value).pictures;

    this._data.destination = { name: evt.target.value, description: newDescription, pictures: newPictures };
  }

  #pointTypeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      pointType: evt.target.value
    });
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  setcloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
  }

  #setDatepickerStart = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._data.startEventDate,
        onChange: this.#startDueDateChangeHander,
      }
    );
  }

  #setDatepickerEnd = () => {
    const minDate = this._data.startEventDate;
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        minDate: minDate,
        onChange: this.#endDueDateChangeHandler
      }
    );
  }

  #startDueDateChangeHander = ([userDate]) => {
    this.updateData({
      startEventDate: userDate
    });
  }

  #endDueDateChangeHandler = ([userDate]) => {
    this.updateData({ endEventDate: userDate });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._data.isDisabled = false;
    this._data.isSaving = false;
    this._data.isDeleting = false;
    const priceValue = this.element.querySelector('.event__input--price').value;
    this._data.price = Number(priceValue);

    const offersTemplate = document.querySelectorAll('.event__offer-checkbox');
    const filteredOffersCheked = Array.from(offersTemplate).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value.split('-').join(' '));
    this._data.selectedOffers = filteredOffersCheked;

    this._callback.formSubmit(this._data);
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(OfferFormView.parseDataToPoint(this._data));
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._data.isDisabled = false;
    this._data.isSaving = false;
    this._data.isDeleting = false;
    this._callback.closeClick();
  }

  static parsePointToData = (point) => ({
    ...point,
    isDisabled: false,
    isDeleting: false,
    isSaving: false,
  });

  static parseDataToPoint = (data) => {
    const point = { ...data };

    delete point.isDeleting;
    delete point.isDisabled;
    delete point.isSaving;

    return point;
  }
}
