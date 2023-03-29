export const API_URL = "http://localhost:5000/api/";

export const colorsObj = {
  a: "#FF0000",
  b: "#00FF00",
  c: "#0000FF",
  d: "#FFFF00",
  e: "#800080",
  f: "#FFA500",
  g: "#7FFFD4",
  h: "#D7D7D7",
  i: "#008000",
  j: "#4B0082",
  k: "#FFD700",
  l: "#00FFFF",
  m: "#FF69B4",
  n: "#FFE4E1",
  o: "#6A5ACD",
  p: "#FF4500",
  q: "#9932CC",
  r: "#DC143C",
  s: "#00FF7F",
  t: "#D8BFD8",
  u: "#FF6347",
  v: "#00CED1",
  w: "#BA55D3",
  x: "#9ACD32",
  y: "#2E8B57",
  z: "#8B0000"
};

export function transformDate(serverDate) {
  let newDate = new Date(serverDate);
  let date = new Date(serverDate);
  const timezoneOffset = date.getTimezoneOffset();
  const localTimestamp = newDate.getTime() - (timezoneOffset * 60 * 1000);
  const localDate = new Date(localTimestamp);
  date = localDate.toISOString()
  date = date.replace("T", " ").slice(0, 19)
  return date
}