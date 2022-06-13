import AbstractView from './abstract-view';

const createNoPointsTemplate = () => (
  '<p class="trip-events__msg">Loading...</p>'
);

export default class LoadingView extends AbstractView {
  get template() {
    return createNoPointsTemplate();
  }
}
