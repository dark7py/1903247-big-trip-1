import AbstractView from './abstract-view.js';

const createPointListTemplate = () => '<div class="trip-events__list"></div>';

export default class PointListView extends AbstractView {
  get template() {
    return createPointListTemplate();
  }
}
