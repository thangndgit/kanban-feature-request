import dayjs from 'dayjs';

export const formatDateTime = (date) => {
  if (!date) return '';
  return dayjs(date).format('D MMM YYYY, h:mm A');
};

