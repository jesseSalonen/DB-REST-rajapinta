import 'babel-polyfill';
import Koa from 'koa';
import Router from 'koa-router';
import mysql from 'mysql2/promise';
import KoaBody from 'koa-bodyparser';
import Url from 'url';

import { connectionSettings } from './settings';
import { databaseReady } from './helpers';
import { initDB } from './fixtures';

// Initialize DB
(async () => {
  await databaseReady();
  await initDB();
})();

// The port that this server will run on, defaults to 9000
const port = process.env.PORT || 9000;

// Instantiate a Koa server
const app = new Koa();
const koaBody = new KoaBody();

// Instantiate routers
const test = new Router();
const pelaajat = new Router();
const joukkueet = new Router();
const liigat = new Router();
const joukkuekohtaiset_tilastot = new Router();

// Define API path
const apiPath = '/api/v1';




test.get(`${apiPath}/test`, async (ctx) => {
  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
        SELECT *
        FROM test_table
      `);

    console.log('Data fetched:', data);

    // Tell the HTTP response that it contains JSON data encoded in UTF-8
    ctx.type = 'application/json; charset=utf-8';

    // Add stuff to response body
    ctx.body = { greeting: 'Hello world!', data };
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// Middleware for checking accept headers
const checkAccept = async (ctx, next) => {
  console.log('checkAccept');
  // If client does not accept 'application/json' as response type, throw '406 Not Acceptable'
  if (!ctx.accepts('application/json')) {
    ctx.throw(406);
  }
  // Set the response content type
  ctx.type = 'application/json; charset=utf-8';
  // Move to next middleware
  await next();
};

// Middleware for checking request body content
const checkContent = async (ctx, next) => {
  console.log('checkContent');
  // Check that the request content type is 'application/json'
  if (!ctx.is('application/json')) {
    ctx.throw(415, 'Request must be application/json');
  }
  // Move to next middleware
  await next();
};

const pelaajatPath = `${apiPath}/pelaajat`;
const pelaajaPath = `${pelaajatPath}/:id`;
const liigatPath = `${apiPath}/liigat`;
const liigaPath = `${liigatPath}/:id`;
const joukkueetPath = `${apiPath}/joukkueet`;
const joukkuePath = `${joukkueetPath}/:id`;
const joukkuekohtaiset_tilastotPath = `${apiPath}/joukkuekohtaiset_tilastot`;
const joukkuekohtainen_tilastoPath = `${joukkuekohtaiset_tilastotPath}/:id`;


// GET /resource
pelaajat.get(pelaajatPath, checkAccept, async (ctx) => {
  const url = Url.parse(ctx.url, true);
  const { sort } = url.query;

  const parseSortQuery = ({ urlSortQuery, whitelist }) => {
    let query = '';
    if (urlSortQuery) {
      const sortParams = urlSortQuery.split(',');

      query = 'ORDER BY ';
      sortParams.forEach((param, index) => {
        let trimmedParam = param;
        let desc = false;

        if (param[0] === '-') {
          // Remove the first character
          trimmedParam = param.slice(1);
          // Set descending to true
          desc = true;
        }

        // If parameter is not whitelisted, ignore it
        // This also prevents SQL injection even without statement preparation
        if (!whitelist.includes(trimmedParam)) return;

        // If this is not the first sort parameter, append ', '
        if (index > 0) query = query.concat(', ');

        // Append the name of the field
        query = query.concat(trimmedParam);

        if (desc) query = query.concat(' DESC');
      });
    }
    return query;
  };
  const orderBy = parseSortQuery({ urlSortQuery: sort, whitelist: ['pelaaja_id', 'etunimi', 'sukunimi', 'kansalaisuus'] });

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
        SELECT *
        FROM pelaajat
        ${orderBy}
      `);

    // Return all pelaajat
    ctx.body = data;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});

// GET /resource
liigat.get(liigatPath, checkAccept, async (ctx) => {
  const url = Url.parse(ctx.url, true);
  const { sort } = url.query;

  const parseSortQuery = ({ urlSortQuery, whitelist }) => {
    let query = '';
    if (urlSortQuery) {
      const sortParams = urlSortQuery.split(',');

      query = 'ORDER BY ';
      sortParams.forEach((param, index) => {
        let trimmedParam = param;
        let desc = false;

        if (param[0] === '-') {
          // Remove the first character
          trimmedParam = param.slice(1);
          // Set descending to true
          desc = true;
        }

        // If parameter is not whitelisted, ignore it
        // This also prevents SQL injection even without statement preparation
        if (!whitelist.includes(trimmedParam)) return;

        // If this is not the first sort parameter, append ', '
        if (index > 0) query = query.concat(', ');

        // Append the name of the field
        query = query.concat(trimmedParam);

        if (desc) query = query.concat(' DESC');
      });
    }
    return query;
  };
  const orderBy = parseSortQuery({ urlSortQuery: sort, whitelist: ['liiga_id', 'liigan_nimi', 'liigan_logo'] });

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
        SELECT *
        FROM liigat
        ${orderBy}
      `);

    // Return all liigat
    ctx.body = data;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});

// GET /resource
joukkuekohtaiset_tilastot.get(joukkuekohtaiset_tilastotPath, checkAccept, async (ctx) => {
  const url = Url.parse(ctx.url, true);
  const { sort } = url.query;

  const parseSortQuery = ({ urlSortQuery, whitelist }) => {
    let query = '';
    if (urlSortQuery) {
      const sortParams = urlSortQuery.split(',');

      query = 'ORDER BY ';
      sortParams.forEach((param, index) => {
        let trimmedParam = param;
        let desc = false;

        if (param[0] === '-') {
          // Remove the first character
          trimmedParam = param.slice(1);
          // Set descending to true
          desc = true;
        }

        // If parameter is not whitelisted, ignore it
        // This also prevents SQL injection even without statement preparation
        if (!whitelist.includes(trimmedParam)) return;

        // If this is not the first sort parameter, append ', '
        if (index > 0) query = query.concat(', ');

        // Append the name of the field
        query = query.concat(trimmedParam);

        if (desc) query = query.concat(' DESC');
      });
    }
    return query;
  };
  const orderBy = parseSortQuery({ urlSortQuery: sort, whitelist: ['pelaaja_id', 'joukkue_id', 'liigan_logo', 'pelinumero', 'pelipaikka', 'pelaajan_ottelut', 'pelaajan_pisteet', 'pelaajan_maalit', 'pelaajan_syotot'] });

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
        SELECT *
        FROM joukkuekohtaiset_tilastot
        ${orderBy}
      `);

    // Return all tilastot
    ctx.body = data;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});

// GET /resource
joukkueet.get(joukkueetPath, checkAccept, async (ctx) => {
  const url = Url.parse(ctx.url, true);
  const { sort } = url.query;

  const parseSortQuery = ({ urlSortQuery, whitelist }) => {
    let query = '';
    if (urlSortQuery) {
      const sortParams = urlSortQuery.split(',');

      query = 'ORDER BY ';
      sortParams.forEach((param, index) => {
        let trimmedParam = param;
        let desc = false;

        if (param[0] === '-') {
          // Remove the first character
          trimmedParam = param.slice(1);
          // Set descending to true
          desc = true;
        }

        // If parameter is not whitelisted, ignore it
        // This also prevents SQL injection even without statement preparation
        if (!whitelist.includes(trimmedParam)) return;

        // If this is not the first sort parameter, append ', '
        if (index > 0) query = query.concat(', ');

        // Append the name of the field
        query = query.concat(trimmedParam);

        if (desc) query = query.concat(' DESC');
      });
    }
    return query;
  };
  const orderBy = parseSortQuery({ urlSortQuery: sort, whitelist: ['joukkue_id', 'liiga_id', 'joukkueen_nimi', 'kaupunki', 'hallin_nimi', 'joukkueen_pisteet', 'joukkueen_ottelut', 'joukkueen_logo'] });

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
        SELECT *
        FROM joukkueet
        ${orderBy}
      `);

    // Return all joukkueet
    ctx.body = data;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});

// GET /resource/:id
pelaajat.get(pelaajaPath, checkAccept, async (ctx) => {
  const { id } = ctx.params;
 console.log('.get id contains:', id);

 if (isNaN(id) || id.includes('.')) {
   ctx.throw(400, 'id must be an integer');
 }

 try {
   const conn = await mysql.createConnection(connectionSettings);
   const [data] = await conn.execute(`
         SELECT *
         FROM pelaajat
         WHERE pelaaja_id = :id;
       `, { id });

   // Return the resource
   ctx.body = data[0];
 } catch (error) {
   console.error('Error occurred:', error);
   ctx.throw(500, error);
 }

});

// GET /resource/:id
liigat.get(liigaPath, checkAccept, async (ctx) => {
  const { id } = ctx.params;
 console.log('.get id contains:', id);

 if (isNaN(id) || id.includes('.')) {
   ctx.throw(400, 'id must be an integer');
 }

 try {
   const conn = await mysql.createConnection(connectionSettings);
   const [data] = await conn.execute(`
         SELECT *
         FROM liigat
         WHERE liiga_id = :id;
       `, { id });

   // Return the resource
   ctx.body = data[0];
 } catch (error) {
   console.error('Error occurred:', error);
   ctx.throw(500, error);
 }

});

// GET /resource/:id
joukkueet.get(joukkuePath, checkAccept, async (ctx) => {
  const { id } = ctx.params;
 console.log('.get id contains:', id);

 if (isNaN(id) || id.includes('.')) {
   ctx.throw(400, 'id must be an integer');
 }

 try {
   const conn = await mysql.createConnection(connectionSettings);
   const [data] = await conn.execute(`
         SELECT *
         FROM joukkueet
         WHERE joukkue_id = :id;
       `, { id });

   // Return the resource
   ctx.body = data[0];
 } catch (error) {
   console.error('Error occurred:', error);
   ctx.throw(500, error);
 }

});

// GET /resource/:id
joukkuekohtaiset_tilastot.get(joukkuekohtainen_tilastoPath, checkAccept, async (ctx) => {
  const { id } = ctx.params;
 console.log('.get id contains:', id);

 if (isNaN(id) || id.includes('.')) {
   ctx.throw(400, 'id must be an integer');
 }

 try {
   const conn = await mysql.createConnection(connectionSettings);
   const [data] = await conn.execute(`
         SELECT *
         FROM joukkuekohtaiset_tilastot
         WHERE pelaaja_id = :id;
       `, { id });

   // Return the resource
   ctx.body = data[0];
 } catch (error) {
   console.error('Error occurred:', error);
   ctx.throw(500, error);
 }

});

// POST /resource
pelaajat.post(pelaajatPath, checkAccept, checkContent, koaBody, async (ctx) => {
  let { etunimi, sukunimi, kansalaisuus } = ctx.request.body;
  console.log('.post etunimi contains:', etunimi);
  console.log('.post sukunimi contains:', sukunimi);
  console.log('.post kansalaisuus contains:', kansalaisuus);


  if (typeof etunimi !== 'string') {
    etunimi = null;
  } if (typeof sukunimi !== 'string') {
    sukunimi = null;
  } if (typeof kansalaisuus !== 'string') {
    kansalaisuus = null;
  }


  try {
    const conn = await mysql.createConnection(connectionSettings);

    // Insert a new pelaaja
    const [status] = await conn.execute(`
          INSERT INTO pelaajat (etunimi, sukunimi, kansalaisuus)
          VALUES (:etunimi, :sukunimi, :kansalaisuus);
        `, { etunimi, sukunimi, kansalaisuus });
    const { insertId } = status;

    // Get the new pelaaja
    const [data] = await conn.execute(`
          SELECT *
          FROM pelaajat
          WHERE pelaaja_id = :id;
        `, { id: insertId });

    // Set the response header to 201 Created
    ctx.status = 201;

    // Set the Location header to point to the new resource
    const newUrl = `${ctx.host}${Router.url(pelaajaPath, { id: insertId })}`;
    ctx.set('Location', newUrl);

    // Return the new pelaaja
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});

// POST /resource
liigat.post(liigatPath, checkAccept, checkContent, koaBody, async (ctx) => {
  let { liigan_nimi, liigan_logo } = ctx.request.body;
  console.log('.post liigan_nimi contains:', liigan_nimi);
  console.log('.post liigan_logo contains:', liigan_logo);


  if (typeof liigan_nimi !== 'string') {
    liigan_nimi = null;
  } if (typeof liigan_logo !== 'string') {
    liigan_logo = null;
  }


  try {
    const conn = await mysql.createConnection(connectionSettings);

    // Insert a new liiga
    const [status] = await conn.execute(`
          INSERT INTO liigat (liigan_nimi, liigan_logo)
          VALUES (:liigan_nimi, :liigan_logo);
        `, { liigan_nimi, liigan_logo});
    const { insertId } = status;

    // Get the new liiga
    const [data] = await conn.execute(`
          SELECT *
          FROM liigat
          WHERE liiga_id = :id;
        `, { id: insertId });

    // Set the response header to 201 Created
    ctx.status = 201;

    // Set the Location header to point to the new resource
    const newUrl = `${ctx.host}${Router.url(liigaPath, { id: insertId })}`;
    ctx.set('Location', newUrl);

    // Return the new liiga
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});

// POST /resource
joukkueet.post(joukkueetPath, checkAccept, checkContent, koaBody, async (ctx) => {
  let { liiga_id, joukkueen_nimi, kaupunki, hallin_nimi, joukkueen_pisteet, joukkueen_ottelut, joukkueen_logo } = ctx.request.body;
  console.log('.post liiga_id contains:', liiga_id);
  console.log('.post joukkueen_nimi contains:', joukkueen_nimi);
  console.log('.post kaupunki contains:', kaupunki);
  console.log('.post hallin_nimi contains:', hallin_nimi);
  console.log('.post joukkueen_pisteet contains:', joukkueen_pisteet);
  console.log('.post joukkueen_ottelut contains:', joukkueen_ottelut);
  console.log('.post joukkueen_logo contains:', joukkueen_logo);


  if (typeof liiga_id !== 'string') {
    liiga_id = null;
  } if (typeof joukkueen_nimi !== 'string') {
    joukkueen_nimi = null;
  } if (typeof kaupunki !== 'string') {
    kaupunki = null;
  } if (typeof hallin_nimi !== 'string') {
    hallin_nimi = null;
  } if (typeof joukkueen_pisteet !== 'string') {
    joukkueen_pisteet = 0;
  } if (typeof joukkueen_ottelut !== 'string') {
    joukkueen_ottelut = 0;
  } if (typeof joukkueen_logo !== 'string') {
    joukkueen_logo = null;
  }


  try {
    const conn = await mysql.createConnection(connectionSettings);

    // Insert a new joukkue
    const [status] = await conn.execute(`
          INSERT INTO joukkueet (liiga_id, joukkueen_nimi, kaupunki, hallin_nimi, joukkueen_pisteet, joukkueen_ottelut, joukkueen_logo)
          VALUES (:liiga_id, :joukkueen_nimi, :kaupunki, :hallin_nimi, :joukkueen_pisteet, :joukkueen_ottelut, :joukkueen_logo);
        `, { liiga_id, joukkueen_nimi, kaupunki, hallin_nimi, joukkueen_pisteet, joukkueen_ottelut, joukkueen_logo });
    const { insertId } = status;

    // Get the new joukkue
    const [data] = await conn.execute(`
          SELECT *
          FROM joukkueet
          WHERE joukkue_id = :id;
        `, { id: insertId });

    // Set the response header to 201 Created
    ctx.status = 201;

    // Set the Location header to point to the new resource
    const newUrl = `${ctx.host}${Router.url(joukkuePath, { id: insertId })}`;
    ctx.set('Location', newUrl);

    // Return the new joukkue
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});

// POST /resource
joukkuekohtaiset_tilastot.post(joukkuekohtaiset_tilastotPath, checkAccept, checkContent, koaBody, async (ctx) => {
  let { pelaaja_id, joukkue_id, pelinumero, pelipaikka, pelaajan_ottelut, pelaajan_pisteet, pelaajan_maalit, pelaajan_syotot } = ctx.request.body;
  console.log('.post pelaaja_id contains:', pelaaja_id);
  console.log('.post joukkue_id contains:', joukkue_id);
  console.log('.post pelinumero contains:', pelinumero);
  console.log('.post pelipaikka contains:', pelipaikka);
  console.log('.post pelaajan_ottelut contains:', pelaajan_ottelut);
  console.log('.post pelaajan_pisteet contains:', pelaajan_pisteet);
  console.log('.post pelaajan_maalit contains:', pelaajan_maalit);
  console.log('.post pelaajan_syotot contains:', pelaajan_syotot);


  if (typeof pelaaja_id !== 'string') {
    pelaaja_id = null;
  } if (typeof joukkue_id !== 'string') {
    joukkue_id = null;
  } if (typeof pelinumero !== 'string') {
    pelinumero = null;
  } if (typeof pelipaikka !== 'string') {
    pelipaikka = null;
  } if (typeof pelaajan_ottelut !== 'string') {
    pelaajan_ottelut = 0;
  } if (typeof pelaajan_pisteet !== 'string') {
    pelaajan_pisteet = 0;
  } if (typeof pelaajan_maalit !== 'string') {
    pelaajan_maalit = 0;
  } if (typeof pelaajan_syotot !== 'string') {
    pelaajan_syotot = 0;
  }


  try {
    const conn = await mysql.createConnection(connectionSettings);

    // Insert a new tilasto
    const [status] = await conn.execute(`
          INSERT INTO joukkuekohtaiset_tilastot (pelaaja_id, joukkue_id, pelinumero, pelipaikka, pelaajan_ottelut, pelaajan_pisteet, pelaajan_maalit, pelaajan_syotot)
          VALUES (:pelaaja_id, :joukkue_id, :pelinumero, :pelipaikka, :pelaajan_ottelut, :pelaajan_pisteet, :pelaajan_maalit, :pelaajan_syotot);
        `, { pelaaja_id, joukkue_id, pelinumero, pelipaikka, pelaajan_ottelut, pelaajan_pisteet, pelaajan_maalit, pelaajan_syotot });
    const { insertId } = status;

    // Get the new tilasto
    const [data] = await conn.execute(`
          SELECT *
          FROM joukkuekohtaiset_tilastot
          WHERE pelaaja_id = :id;
        `, { id: insertId });

    // Set the response header to 201 Created
    ctx.status = 201;

    // Set the Location header to point to the new resource
    const newUrl = `${ctx.host}${Router.url(joukkuekohtainen_tilastoPath, { id: insertId })}`;
    ctx.set('Location', newUrl);

    // Return the new tilasto
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});

// PUT /resource/:id
pelaajat.put(pelaajaPath, checkAccept, checkContent, koaBody, async (ctx) => {
const { id } = ctx.params;
let { etunimi, sukunimi, kansalaisuus } = ctx.request.body;
console.log('.put pelaaja_id contains:', id);
console.log('.put etunimi contains:', etunimi);
console.log('.put sukunimi contains:', sukunimi);
console.log('.put kansalaisuus contains:', kansalaisuus);

if (isNaN(id) || id.includes('.')) {
  ctx.throw(400, 'pelaaja_id must be an integer');
} if (typeof etunimi === 'undefined') {
  ctx.throw(400, 'body.etunimi is required');
} if (typeof sukunimi === 'undefined') {
  ctx.throw(400, 'body.sukunimi is required');
} if (typeof kansalaisuus === 'undefined') {
  ctx.throw(400, 'body.kansalaisuus is required');
}

try {
  const conn = await mysql.createConnection(connectionSettings);

  // Update the pelaaja
  const [status] = await conn.execute(`
         UPDATE pelaajat
         SET etunimi = :etunimi, sukunimi = :sukunimi, kansalaisuus = :kansalaisuus
         WHERE pelaaja_id = :id;
       `, { id, etunimi, sukunimi, kansalaisuus });

  if (status.affectedRows === 0) {
    // If the resource does not already exist, create it
    await conn.execute(`
        INSERT INTO pelaajat (pelaaja_id, etunimi, sukunimi, kansalaisuus)
        VALUES (:id, :etunimi, :sukunimi, :kansalaisuus);
      `, { id, etunimi, sukunimi, kansalaisuus });
  }

  // Get the pelaaja
  const [data] = await conn.execute(`
         SELECT *
         FROM pelaajat
         WHERE pelaaja_id = :id;
       `, { id });

  // Return the resource
  ctx.body = data[0];
} catch (error) {
  console.error('Error occurred:', error);
  ctx.throw(500, error);
}

});

// PUT /resource/:id
liigat.put(liigaPath, checkAccept, checkContent, koaBody, async (ctx) => {
const { id } = ctx.params;
let { liigan_nimi, liigan_logo } = ctx.request.body;
console.log('.put liiga_id contains:', id);
console.log('.put liigan_nimi contains:', liigan_nimi);
console.log('.put liigan_logo contains:', liigan_logo);

if (isNaN(id) || id.includes('.')) {
  ctx.throw(400, 'pelaaja_id must be an integer');
} if (typeof liigan_nimi === 'undefined') {
  ctx.throw(400, 'body.liigan_nimi is required');
} if (typeof liigan_logo === 'undefined') {
  ctx.throw(400, 'body.liigan_logo is required');
}

try {
  const conn = await mysql.createConnection(connectionSettings);

  // Update the liiga
  const [status] = await conn.execute(`
         UPDATE liigat
         SET liigan_nimi = :liigan_nimi, liigan_logo = :liigan_logo
         WHERE liiga_id = :id;
       `, { id, liigan_nimi, liigan_logo });

  if (status.affectedRows === 0) {
    // If the resource does not already exist, create it
    await conn.execute(`
        INSERT INTO liigat (liiga_id, liigan_nimi, liigan_logo)
        VALUES (:id, :liigan_nimi, :liigan_logo);
      `, { id, liigan_nimi, liigan_logo });
  }

  // Get the liiga
  const [data] = await conn.execute(`
         SELECT *
         FROM liigat
         WHERE liiga_id = :id;
       `, { id });

  // Return the resource
  ctx.body = data[0];
} catch (error) {
  console.error('Error occurred:', error);
  ctx.throw(500, error);
}

});

// PUT /resource/:id
joukkueet.put(joukkuePath, checkAccept, checkContent, koaBody, async (ctx) => {
const { id } = ctx.params;
let { liiga_id, joukkueen_nimi, kaupunki, hallin_nimi, joukkueen_pisteet, joukkueen_ottelut, joukkueen_logo } = ctx.request.body;
console.log('.put joukkue_id contains:', id);
console.log('.put liiga_id contains:', liiga_id);
console.log('.put joukkueen_nimi contains:', joukkueen_nimi);
console.log('.put kaupunki contains:', kaupunki);
console.log('.put hallin_nimi contains:', hallin_nimi);
console.log('.put joukkueen_pisteet contains:', joukkueen_pisteet);
console.log('.put joukkueen_ottelut contains:', joukkueen_ottelut);
console.log('.put joukkueen_logo contains:', joukkueen_logo);

if (isNaN(id) || id.includes('.')) {
  ctx.throw(400, 'joukkue_id must be an integer');
} if (typeof liiga_id === 'undefined') {
  ctx.throw(400, 'body.liiga_id is required');
} if (typeof joukkueen_nimi === 'undefined') {
  ctx.throw(400, 'body.joukkueen_nimi is required');
} if (typeof kaupunki === 'undefined') {
  ctx.throw(400, 'body.kaupunki is required');;
} if (typeof hallin_nimi === 'undefined') {
  ctx.throw(400, 'body.hallin_nimi is required');
} if (typeof joukkueen_pisteet === 'undefined') {
  ctx.throw(400, 'body.joukkueen_pisteet is required');
} if (typeof joukkueen_ottelut === 'undefined') {
  ctx.throw(400, 'body.joukkueen_ottelut is required');
} if (typeof joukkueen_logo === 'undefined') {
  ctx.throw(400, 'body.joukkueen_logo is required');
}

try {
  const conn = await mysql.createConnection(connectionSettings);

  // Update the joukkue
  const [status] = await conn.execute(`
         UPDATE joukkueet
         SET liiga_id = :liiga_id, joukkueen_nimi = :joukkueen_nimi, kaupunki = :kaupunki, hallin_nimi = :hallin_nimi, joukkueen_pisteet = :joukkueen_pisteet, joukkueen_ottelut = :joukkueen_ottelut, joukkueen_logo = :joukkueen_logo
         WHERE joukkue_id = :id;
       `, { id, liiga_id, joukkueen_nimi, kaupunki, hallin_nimi, joukkueen_pisteet, joukkueen_ottelut, joukkueen_logo });

  if (status.affectedRows === 0) {
    // If the resource does not already exist, create it
    await conn.execute(`
        INSERT INTO joukkueet (joukkue_id, liiga_id, joukkueen_nimi, kaupunki, hallin_nimi, joukkueen_pisteet, joukkueen_ottelut, joukkueen_logo)
        VALUES (:id, :liiga_id, :joukkueen_nimi, :kaupunki, :hallin_nimi, :joukkueen_pisteet, :joukkueen_ottelut, :joukkueen_logo);
      `, { id, liiga_id, joukkueen_nimi, kaupunki, hallin_nimi, joukkueen_pisteet, joukkueen_ottelut, joukkueen_logo });
  }

  // Get the joukkue
  const [data] = await conn.execute(`
         SELECT *
         FROM joukkueet
         WHERE joukkue_id = :id;
       `, { id });

  // Return the resource
  ctx.body = data[0];
} catch (error) {
  console.error('Error occurred:', error);
  ctx.throw(500, error);
}

});

// PUT /resource/:id
joukkuekohtaiset_tilastot.put(joukkuekohtainen_tilastoPath, checkAccept, checkContent, koaBody, async (ctx) => {
const { id } = ctx.params;
let { joukkue_id, pelinumero, pelipaikka, pelaajan_ottelut, pelaajan_pisteet, pelaajan_maalit, pelaajan_syotot } = ctx.request.body;
console.log('.post pelaaja_id contains:', id);
console.log('.post joukkue_id contains:', joukkue_id);
console.log('.post pelinumero contains:', pelinumero);
console.log('.post pelipaikka contains:', pelipaikka);
console.log('.post pelaajan_ottelut contains:', pelaajan_ottelut);
console.log('.post pelaajan_pisteet contains:', pelaajan_pisteet);
console.log('.post pelaajan_maalit contains:', pelaajan_maalit);
console.log('.post pelaajan_syotot contains:', pelaajan_syotot);

if (isNaN(id) || id.includes('.')) {
  ctx.throw(400, 'pelaaja_id must be an integer');
} if (typeof joukkue_id === 'undefined') {
  ctx.throw(400, 'body.joukkue_id is required');
} if (typeof pelinumero === 'undefined') {
  ctx.throw(400, 'body.pelinumero is required');
} if (typeof pelipaikka === 'undefined') {
  ctx.throw(400, 'body.pelipaikka is required');
} if (typeof pelaajan_ottelut === 'undefined') {
  ctx.throw(400, 'body.pelaajan_ottelut is required');
} if (typeof pelaajan_pisteet === 'undefined') {
  ctx.throw(400, 'body.pelaajan_pisteet is required');
} if (typeof pelaajan_maalit === 'undefined') {
  ctx.throw(400, 'body.pelaajan_maalit is required');
} if (typeof pelaajan_syotot === 'undefined') {
  ctx.throw(400, 'body.pelaajan_syotot is required');
}

try {
  const conn = await mysql.createConnection(connectionSettings);

  // Update the tilasto
  const [status] = await conn.execute(`
         UPDATE joukkuekohtaiset_tilastot
         SET joukkue_id = :joukkue_id, pelinumero = :pelinumero, pelipaikka = :pelipaikka, pelaajan_ottelut = :pelaajan_ottelut, pelaajan_pisteet = :pelaajan_pisteet, pelaajan_maalit = :pelaajan_maalit, pelaajan_syotot = :pelaajan_syotot
         WHERE pelaaja_id = :id;
       `, { id, joukkue_id, pelinumero, pelipaikka, pelaajan_ottelut, pelaajan_pisteet, pelaajan_maalit, pelaajan_syotot });

  if (status.affectedRows === 0) {
    // If the resource does not already exist, create it
    await conn.execute(`
        INSERT INTO joukkuekohtaiset_tilastot (pelaaja_id, joukkue_id, pelinumero, pelipaikka, pelaajan_ottelut, pelaajan_pisteet, pelaajan_maalit, pelaajan_syotot)
        VALUES (:id, :joukkue_id, :pelinumero, :pelipaikka, :pelaajan_ottelut, :pelaajan_pisteet, :pelaajan_maalit, :pelaajan_syotot);
      `, { id, joukkue_id, pelinumero, pelipaikka, pelaajan_ottelut, pelaajan_pisteet, pelaajan_maalit, pelaajan_syotot });
  }

  // Get the tilasto
  const [data] = await conn.execute(`
         SELECT *
         FROM joukkuekohtaiset_tilastot
         WHERE pelaaja_id = :id;
       `, { id });

  // Return the resource
  ctx.body = data[0];
} catch (error) {
  console.error('Error occurred:', error);
  ctx.throw(500, error);
}

});

// DELETE /resource/:id
pelaajat.del(pelaajaPath, async (ctx) => {
  const { id } = ctx.params;
  console.log('.del id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [status] = await conn.execute(`
          DELETE FROM pelaajat
          WHERE pelaaja_id = :id;
        `, { id });

    if (status.affectedRows === 0) {
      // The row did not exist, return '404 Not found'
      ctx.status = 404;
    } else {
      // Return '204 No Content' status code for successful delete
      ctx.status = 204;
    }
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});

// DELETE /resource/:id
liigat.del(liigaPath, async (ctx) => {
  const { id } = ctx.params;
  console.log('.del id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [status] = await conn.execute(`
          DELETE FROM liigat
          WHERE liiga_id = :id;
        `, { id });

    if (status.affectedRows === 0) {
      // The row did not exist, return '404 Not found'
      ctx.status = 404;
    } else {
      // Return '204 No Content' status code for successful delete
      ctx.status = 204;
    }
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});

// DELETE /resource/:id
joukkueet.del(joukkuePath, async (ctx) => {
  const { id } = ctx.params;
  console.log('.del id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [status] = await conn.execute(`
          DELETE FROM joukkueet
          WHERE joukkue_id = :id;
        `, { id });

    if (status.affectedRows === 0) {
      // The row did not exist, return '404 Not found'
      ctx.status = 404;
    } else {
      // Return '204 No Content' status code for successful delete
      ctx.status = 204;
    }
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});

// DELETE /resource/:id
joukkuekohtaiset_tilastot.del(joukkuekohtainen_tilastoPath, async (ctx) => {
  const { id } = ctx.params;
  console.log('.del id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [status] = await conn.execute(`
          DELETE FROM joukkuekohtaiset_tilastot
          WHERE pelaaja_id = :id;
        `, { id });

    if (status.affectedRows === 0) {
      // The row did not exist, return '404 Not found'
      ctx.status = 404;
    } else {
      // Return '204 No Content' status code for successful delete
      ctx.status = 204;
    }
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }

});




app.use(test.routes());
app.use(test.allowedMethods());
app.use(pelaajat.routes());
app.use(pelaajat.allowedMethods());
app.use(joukkueet.routes());
app.use(joukkueet.allowedMethods());
app.use(liigat.routes());
app.use(liigat.allowedMethods());
app.use(joukkuekohtaiset_tilastot.routes());
app.use(joukkuekohtaiset_tilastot.allowedMethods());

// Start the server and keep listening on port until stopped
app.listen(port);

console.log(`App listening on port ${port}`);
