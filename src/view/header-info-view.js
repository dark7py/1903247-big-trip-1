import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import { sortPointsByDate } from '../utils/sort-functions.js';

const createHeaderInfoTemplate = (points) => {
  points.sort(sortPointsByDate);
  const destinationsNames = points.map((point) => point.destination.name);
  let totalPointsPrice = null;
  points.forEach((point) => {
    totalPointsPrice += Number(point.price);
  });

  const dateBegin = dayjs(points[0].startEventDate).format('DD MMM');
  const dateEnd = dayjs(points[points.length - 1].startEventDate).format('DD MMM');

  let tripDestinationTitles = '';

  if (destinationsNames.length <= 3) {
    destinationsNames.forEach((nameCity, index) => {
      if (index === destinationsNames.length - 1) {
        tripDestinationTitles += `${nameCity}`;
      }
      else {
        tripDestinationTitles += `${nameCity} &mdash; `;
      }
    });
  } else if (destinationsNames.length > 3) {
    tripDestinationTitles = `${destinationsNames[0]} &mdash; ... &mdash; ${destinationsNames[destinationsNames.length - 1]}`;
  }

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripDestinationTitles}</h1>

      <p class="trip-info__dates">${dateBegin}&nbsp;&mdash;&nbsp;${dateEnd}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPointsPrice}</span>
    </p>
  </section>`;
};
export default class HeaderInfoView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createHeaderInfoTemplate(this.#points);
  }
}
