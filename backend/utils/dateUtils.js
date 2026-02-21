// Utility functions for date and time operations

// Format date to YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

// Get available time slots for a given day
const getAvailableTimeSlots = () => {
  return [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00'
  ];
};

// Validate date format (YYYY-MM-DD)
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && dateString === formatDate(date);
};

// Validate time format (HH:MM)
const isValidTime = (timeString) => {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(timeString);
};

// Check if a time slot is in the future
const isFutureTime = (dateString, timeString) => {
  const now = new Date();
  const appointmentDateTime = new Date(`${dateString}T${timeString}:00`);
  return appointmentDateTime > now;
};

// Calculate time difference in minutes
const timeDifferenceInMinutes = (time1, time2) => {
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);
  
  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;
  
  return Math.abs(totalMinutes1 - totalMinutes2);
};

module.exports = {
  formatDate,
  getAvailableTimeSlots,
  isValidDate,
  isValidTime,
  isFutureTime,
  timeDifferenceInMinutes
};