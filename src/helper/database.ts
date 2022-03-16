import sqlite3 from 'sqlite3';
import path from 'path';

import { ROOT_PATH } from './path';

type StockTuple = readonly [number, number, number, number, number];
const sqlite = sqlite3.verbose();

export class SqliteDatabase {
  db: sqlite3.Database;

  dbPath: string;

  constructor() {
    this.dbPath = path.join(ROOT_PATH, 'database', 'stock.db');
    this.db = new sqlite.Database(this.dbPath);
  }

  create(code: string) {
    this.db.run(`CREATE TABLE IF NOT EXISTS ${code} (
   date INTEGER NOT NULL PRIMARY KEY,
   open INTEGER NOT NULL,
   high INTEGER NOT NULL,
   low INTEGER NOT NULL,
   close INTEGER NOT NULL
)`);
  }

  insert(code: string, data: StockTuple) {
    this.db.run(
      `INSERT INTO ${code}(date, open, high, low, close) VALUES(${data.join(
        ', ',
      )})`,
    );
  }

  selectAll(code: string) {
    this.db.all(`SELECT * FROM ${code}`, (err, rows) => {
      console.log(rows);
    });
  }

  close() {
    this.db.close();
  }
}
