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
  const day = date.getDate();
  const month = getCurrentMonthForQuery();
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
