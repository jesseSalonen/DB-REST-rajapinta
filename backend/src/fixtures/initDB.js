import mysql from 'mysql2/promise';

import { connectionSettings } from '../settings';

export default async () => {
  const conn = await mysql.createConnection(connectionSettings);
  try {
    await conn.execute(`
        SELECT *
        FROM test_table
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: test_table');
      await conn.execute(`
        CREATE TABLE test_table (
          id int UNSIGNED NOT NULL AUTO_INCREMENT,
          field_1 varchar(255) NOT NULL,
          field_2 int,
          PRIMARY KEY (id)
        )
      `);
      console.log('...success!');
    }
  }
  try {
    await conn.execute(`
        SELECT *
        FROM todos
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: todos');
      await conn.execute(`
        CREATE TABLE todos (
          id int UNSIGNED AUTO_INCREMENT,
          text varchar(256) NOT NULL,
          done bool DEFAULT false,
          PRIMARY KEY (id)
        )
      `);
      console.log('...success!');
    }
  }
  try {
    await conn.execute(`
        SELECT *
        FROM pelaajat
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: pelaajat');
      await conn.execute(`
        CREATE TABLE pelaajat (
          pelaaja_id bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          etunimi varchar(50) DEFAULT null,
          sukunimi varchar(50) DEFAULT null,
          kansalaisuus varchar(50) DEFAULT null,
          PRIMARY KEY (pelaaja_id)
        )
      `);
      console.log('...success!');
    }
  }
  try {
    await conn.execute(`
        SELECT *
        FROM liigat
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: liigat');
      await conn.execute(`
        CREATE TABLE liigat (
          liiga_id bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          liigan_nimi varchar(255) DEFAULT null,
          liigan_logo text DEFAULT null,
          PRIMARY KEY (liiga_id)
        )
      `);
      console.log('...success!');
    }
  }
  try {
    await conn.execute(`
        SELECT *
        FROM joukkueet
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: joukkueet');
      await conn.execute(`
        CREATE TABLE joukkueet (
          joukkue_id bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          liiga_id int UNSIGNED NOT NULL,
          joukkueen_nimi varchar(50) DEFAULT null,
          kaupunki varchar(50) DEFAULT null,
          hallin_nimi varchar(255) DEFAULT null,
          joukkueen_pisteet int DEFAULT 0,
          joukkueen_ottelut int DEFAULT 0,
          joukkueen_logo text DEFAULT null,
          PRIMARY KEY (joukkue_id)
        )
      `);
      console.log('...success!');
    }
  }
  try {
    await conn.execute(`
        SELECT *
        FROM joukkuekohtaiset_tilastot
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: joukkuekohtaiset_tilastot');
      await conn.execute(`
        CREATE TABLE joukkuekohtaiset_tilastot (
          pelaaja_id int UNSIGNED NOT NULL,
          joukkue_id int UNSIGNED NOT NULL,
          pelinumero int DEFAULT 0,
          pelipaikka varchar(2) DEFAULT null,
          pelaajan_ottelut int DEFAULT 0,
          pelaajan_pisteet int DEFAULT 0,
          pelaajan_maalit int DEFAULT 0,
          pelaajan_syotot int DEFAULT 0
        )
      `);
      console.log('...success!');
    }
  }
};
