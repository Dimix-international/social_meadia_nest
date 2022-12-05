export const settings = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017',
  JWT_SECRET_ACCESS: process.env.JWT_SECRET || '123',
  JWT_SECRET_REFRESH: process.env.JWT_SECRET || '123',
};
