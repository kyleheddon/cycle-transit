import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { autoComplete, getPlaceDetails } from './services/google-maps';
import { reverseGeocode } from './services/route';
import { runtimeConfig } from './config';
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/locationAutoComplete', (req, res) => {
      const { str } = req.query;
      autoComplete(str).then((result) => {
         res.status(200).send(result); 
      })
  })
  .get('/reverseGeocode', (req, res) => {
      const { latitude, longitude } = req.query;
      reverseGeocode(latitude, longitude).then((result) => {
         res.status(200).send(result); 
     });
  })
  .get('/getPlaceDetails', (req, res) => {
      const { placeId } = req.query;
      getPlaceDetails(placeId).then((result) => {
          res.status(200).send(result);
      });
  })
  .get('/*', (req, res) => {
    const context = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
`<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Atl Bike + Transit</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <script>window.env = ${JSON.stringify(runtimeConfig)};</script>
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      );
    }
  });

export default server;
