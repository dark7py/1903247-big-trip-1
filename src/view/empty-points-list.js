import { FilterType } from '../const.js';
import AbstractView from './abstract-view.js';


const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

const createEmptyListTemplate = (filterType) => {
  const noPointsTextType = NoPointsTextType[filterType];

  return `<p class="trip-events__msg">${noPointsTextType}</p>`;
};

export default class MessageWithoutPointsView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createEmptyListTemplate(this._data);
  }
}
