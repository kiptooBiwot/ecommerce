const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("./redis.init");

module.exports = {
  signAccessToken: (user) => {
    return new Promise((resolve, reject) => {
      (payload = {
        id: user.id,
        role: user.role,
        email: user.email,
      }),
        (secret = process.env.ACCESS_TOKEN_SECRET),
        (options = {
          expiresIn: "1h",
        });
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err);
          return reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: async (req, res, next) => {
    if (!req.headers["authorization"]) throw next(createError.Unauthorized());

    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      console.log(`REQ.User: ${req.user}`);
      next();
    } catch (err) {
      if (err.name === "JsonwebTokenError") {
        createError.Unauthorized();
      } else {
        next(createError.Unauthorized(err.message));
      }
    }
  },
  signRefreshToken: (user) => {
    return new Promise((resolve, reject) => {
      (payload = {
        id: user.id,
        role: user.role,
        email: user.email,
      }),
        (secret = process.env.REFRESH_TOKEN_SECRET);
      options = {
        expiresIn: "1y",
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err);
          return reject(createError.InternalServerError());
        }

        // Store the refresh token in Redis server
        client.SET(user.id, token, "EX", 365 * 24 * 60 * 60, (err, reply) => {
          if (err) {
            console.log(err);
            reject(createError.InternalServerError());
            return;
          }
          resolve(token);
        });
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      if (!refreshToken) throw next(createError.Unauthorized());

      const token = refreshToken.split(" ")[1];
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) return reject(createError.Unauthorized());
        const userId = payload.id;

        // Check the token from Redis server if it exists
        client.GET(userId, (err, reply) => {
          if (err) {
            console.log(err);
            reject(createError.InternalServerError());
            return;
          }
          console.log(`REDIS REPLY: ${reply}`);
          // Check if the token matches the redis-stored token
          if (token === reply) return resolve(userId);
          // If tokens did not match
          reject(createError.Unauthorized());
        });

        resolve(userId);
      });
    });
  },
};
