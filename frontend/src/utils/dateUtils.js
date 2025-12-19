export const formatDateTimeRange = (start, end) => {
  if (!start) return 'Date TBD';
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  
  const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };

  const startDateStr = s.toLocaleDateString('en-US', dateOptions);
  const startTimeStr = s.toLocaleTimeString('en-US', timeOptions);

  if (e) {
    const isSameDay = s.toDateString() === e.toDateString();
    if (isSameDay) {
      const endTimeStr = e.toLocaleTimeString('en-US', timeOptions);
      return `${startDateStr} • ${startTimeStr} - ${endTimeStr}`;
    } else {
      const endDateStr = e.toLocaleDateString('en-US', dateOptions);
      const endTimeStr = e.toLocaleTimeString('en-US', timeOptions);
      return `${startDateStr} (${startTimeStr}) - ${endDateStr} (${endTimeStr})`;
    }
  }
  return `${startDateStr} • ${startTimeStr}`;
};