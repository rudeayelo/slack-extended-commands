import Cors from "cors";

const corsMiddleware = Cors({
  methods: ["GET", "POST", "HEAD"],
});

export function cors(req, res) {
  return new Promise((resolve, reject) => {
    corsMiddleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}
