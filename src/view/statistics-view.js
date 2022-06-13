import { Chart } from 'chart.js';
import SmartView from './smart-view';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';

const CreateStatisticTemplate = () => (
  `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>
  <div class="statistics__item">
    <canvas class="statistics__chart" id="money" width="900"></canvas>
  </div>
  <div class="statistics__item">
    <canvas class="statistics__chart" id="type" width="900"></canvas>
  </div>
  <div class="statistics__item">
    <canvas class="statistics__chart" id="time" width="900"></canvas>
  </div>
</section>`
);

const CountOfferPrice = (points) => {
  const offerPrices = {
    'taxi': 0,
    'bus': 0,
    'train': 0,
    'ship': 0,
    'drive': 0,
    'flight': 0,
    'check-in': 0,
    'sightseeing': 0,
    'restaurant': 0,
  };

  for (const offer in points) {
    if (points[offer].length !== 0) {
      for (const point of points[offer]) { offerPrices[offer] += Number(point.price); }
    }
  }
  return offerPrices;
};

const CountOfferTime = (points) => {
  const offerTimes = {
    'taxi': 0,
    'bus': 0,
    'train': 0,
    'ship': 0,
    'drive': 0,
    'flight': 0,
    'check-in': 0,
    'sightseeing': 0,
    'restaurant': 0,
  };
  let currentTime = 0;

  for (const offer in points) {
    if (points[offer].length !== 0) {
      for (const point of points[offer]) {
        const timeBetweenDateInMin = dayjs(point.endEventDate).diff(point.startEventDate, 'minute');
        currentTime += Number(timeBetweenDateInMin);
      }

      offerTimes[offer] = currentTime;
      currentTime = 0;
    }
  }
  return offerTimes;
};

const FormatDate = (date) => {
  const days = Math.floor(date / 1440) === 0 ? '' : `${Math.floor(date / 1440)}D `;
  const hours = Math.floor((date % 1440) / 60) === 0 ? '' : `${Math.floor((date % 1440) / 60)}H `;
  const minutes = `${Math.floor(Math.floor((date % 1440) % 60))}M`;

  return days + hours + minutes;
};
const CreateStatisticMoney = (container, points) => {
  const moneyCtx = container.querySelector('#money');
  const offerPrices = CountOfferPrice(points);
  const BAR_HEIGHT = 110;
  moneyCtx.height = BAR_HEIGHT * 5;

  const moneyChart = new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: ['TAXI', 'BUS', 'TRAIN', 'SHIP', 'FLIGHT', 'DRIVE', 'CHECK-IN', 'SIGHTSEEING', 'RESTAURANT'],
      datasets: [{
        data: [offerPrices['taxi'], offerPrices['bus'], offerPrices['train'],
          offerPrices['ship'], offerPrices['flight'], offerPrices['drive'],
          offerPrices['check-in'], offerPrices['sightseeing'], offerPrices['restaurant']],
        backgroundColor: '#67b7ef',
        hoverBackgroundColor: '#7bc8ff',
        anchor: 'start',
        barThickness: 48,
        minBarLength: 40,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return moneyChart;
};

const createStatisticType = (container, points) => {
  const typeCtx = container.querySelector('#type');

  const BAR_HEIGHT = 110;
  typeCtx.height = BAR_HEIGHT * 5;

  const typeChart = new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: ['TAXI', 'BUS', 'TRAIN', 'SHIP', 'FLIGHT', 'DRIVE', 'CHECK-IN', 'SIGHTSEEING', 'RESTAURANT'],
      datasets: [{
        data: [points['taxi'].length, points['bus'].length, points['train'].length,
          points['ship'].length, points['flight'].length, points['drive'].length,
          points['check-in'].length, points['sightseeing'].length, points['restaurant'].length],
        backgroundColor: '#7bef6d',
        hoverBackgroundColor: '#8afc8c',
        anchor: 'start',
        barThickness: 48,
        minBarLength: 40,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
  return typeChart;
};

const CreateStatisticTime = (container, points) => {
  const timeCtx = container.querySelector('#time');

  const offerTimes = CountOfferTime(points);
  const BAR_HEIGHT = 110;
  timeCtx.height = BAR_HEIGHT * 5;

  const typeChart = new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: ['TAXI', 'BUS', 'TRAIN', 'SHIP', 'FLIGHT', 'DRIVE', 'CHECK-IN', 'SIGHTSEEING', 'RESTAURANT'],
      datasets: [{
        data: [offerTimes['taxi'], offerTimes['bus'], offerTimes['train'],
          offerTimes['ship'], offerTimes['flight'], offerTimes['drive'],
          offerTimes['check-in'], offerTimes['sightseeing'], offerTimes['restaurant']],
        backgroundColor: '#f1e476',
        hoverBackgroundColor: '#faf092',
        anchor: 'start',
        barThickness: 48,
        minBarLength: 40,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => FormatDate(val),
        },
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
  return typeChart;
};

export default class StatisticView extends SmartView {
  #moneyStats = null;
  #typeStats = null;
  #timeStats = null;

  constructor(points) {
    super();

    this._data = points;
    this.#setCharts();
  }

  get template() {
    return CreateStatisticTemplate();
  }

  removeElement() {
    super.removeElement();

    if (this.#moneyStats) {
      this.#moneyStats.destroy();
      this.#moneyStats = null;
    }

    if (this.#typeStats) {
      this.#typeStats.destroy();
      this.#typeStats = null;
    }
    if (this.#timeStats) {
      this.#timeStats.destroy();
      this.#timeStats = null;
    }
  }

  #setCharts = () => {
    const points = {
      'taxi': this._data.filter((point) => point.pointType === 'taxi'),
      'bus': this._data.filter((point) => point.pointType === 'bus'),
      'train': this._data.filter((point) => point.pointType === 'train'),
      'ship': this._data.filter((point) => point.pointType === 'ship'),
      'drive': this._data.filter((point) => point.pointType === 'drive'),
      'flight': this._data.filter((point) => point.pointType === 'flight'),
      'check-in': this._data.filter((point) => point.pointType === 'check-in'),
      'sightseeing': this._data.filter((point) => point.pointType === 'sightseeing'),
      'restaurant': this._data.filter((point) => point.pointType === 'restaurant')
    };
    this.#moneyStats = CreateStatisticMoney(this.element, points);
    this.#typeStats = createStatisticType(this.element, points);
    this.#timeStats = CreateStatisticTime(this.element, points);
  }
}
