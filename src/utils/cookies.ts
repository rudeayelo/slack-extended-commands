import { serialize } from "cookie";

const cookie = (res, name, value, options = {}) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  if ("maxAge" in options) {
    // @ts-ignore
    options.expires = new Date(Date.now() + options.maxAge);
    // @ts-ignore
    options.maxAge /= 1000;
  }

  res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));
};

export const cookies = (handler) => (req, res) => {
  res.cookie = (name, value, options) => cookie(res, name, value, options);

  return handler(req, res);
};
