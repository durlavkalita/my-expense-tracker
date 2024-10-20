export const getCurrentMonthYear = () => {
  const date = new Date();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()]; // getMonth returns 0-11, so we use it as an index
  const year = date.getFullYear(); // getFullYear returns the year

  return `${month}`;
};

export const getCurrentMonthForQuery = () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  return `${month < 10 ? `0${month}` : month}`;
};

export const humanReadableAmount = (amount: Number) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });
};

export const getCurrentDate = () => {
  const date = new Date();
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month = getCurrentMonthForQuery();
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export function convertToISOFormat(oldDate: string): string {
  const [day, month, year] = oldDate.split("-");
  return `${year}-${month}-${day}T00:00:00`;
}

export function formatDateToHumanReadable(dateString: string): string {
  const date = new Date(dateString);

  // Array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get components of the date
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM or PM suffix
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour to 12-hour format
  const formattedHours = hours % 12 || 12; // '0' becomes '12'

  // Pad minutes with leading zero if needed
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Construct the human-readable date string
  return `${day} ${month}, ${formattedHours}:${formattedMinutes} ${ampm}`;
}
