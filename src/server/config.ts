const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.JCORRY_PORT || '3000', 10);

export { isDev, isProduction, port };
