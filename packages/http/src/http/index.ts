import http from 'http';
import https from 'https';

export * from './httpServerFactory';
export * from './httpsServerFactory';

export type Server = http.Server | https.Server;
export type ServerFactory = (handler: http.RequestListener, options?: https.ServerOptions) => Server;
