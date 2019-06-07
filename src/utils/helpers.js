import moment from 'moment';

export const isInPeriod = (startDate, endDate, date) => {
  const isSameOrAfterStartDate = startDate
    ? moment(date).isSameOrAfter(startDate)
    : true;
  const isSameOrBeforeEndDate = endDate
    ? moment(date).isSameOrBefore(endDate)
    : true;
  return isSameOrAfterStartDate && isSameOrBeforeEndDate;
};
