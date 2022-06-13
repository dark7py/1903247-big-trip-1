import dayjs from 'dayjs';
import { FilterType } from '../const';

const now = dayjs();

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.startEventDate).isAfter(now)),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.endEventDate).isBefore(now)),
};
