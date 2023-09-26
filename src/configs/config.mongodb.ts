// Config level 0

// export const config = {
//   app: {
//     port: 3000,
//   },
//   db: {
//     host: "localhost",
//     port: 27017,
//     name: "db",
//   },
// };

// Config level 3

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 8080,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "shopDEV",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 8080,
  },
  db: {
    host: process.env.PRO_DB_HOST || "localhost",
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || "shopPRO",
  },
};

const config: { [id: string]: any } = { dev, pro };
const env = process.env.NODE_ENV || "dev";

export default config[env];