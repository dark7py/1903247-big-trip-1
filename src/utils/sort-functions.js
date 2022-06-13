import dayjs from 'dayjs';

export const SortType = {
  DAY: { text: 'day', checked: true },
  TIME: { text: 'time', checked: false },
  PRICE: { text: 'price', checked: false }
};

export const sortPointsByDate = (pointA, pointB) => dayjs(pointA.startEventDate).diff(pointB.startEventDate);

export const sortPointsByTime = (pointA, pointB) => dayjs(pointB.endEventDate).diff(pointB.startEventDate) - dayjs(pointA.endEventDate).diff(pointA.startEventDate);

export const sortPointsByPrice = (pointA, pointB) => pointB.price - pointA.price;
