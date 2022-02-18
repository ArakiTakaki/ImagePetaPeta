import Nedb from "@seald-io/nedb";

export default class DB<T> {
  nedb: Nedb<T> | null = null;
  loaded = false;
  constructor(private path: string) {
  }
  init() {
    this.loaded = false;
    return new Promise<boolean>((res, rej) => {
      this.nedb = new Nedb<T>({
        filename: this.path,
        autoload: true,
        onload: (error) => {
          if (error) {
            rej(`Database file is broken.\n"${this.path}"`);
            return;
          }
          this.loaded = true;
          res(true);
        }
      });
      this.nedb.persistence.setAutocompactionInterval(5000);
    })
  }
  find(query: any = {}): Promise<T[]> {
    return new Promise((res, rej) => {
      if (!this.nedb || !this.loaded) {
        rej("DB is not initialized");
        return;
      }
      this.nedb.find(query).exec(async (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        res(data);
      });
    });
  }
  remove(query: Partial<T>): Promise<boolean> {
    return new Promise((res, rej) => {
      if (!this.nedb || !this.loaded) {
        rej("DB is not initialized");
        return;
      }
      this.nedb.remove(query, {}, (err) => {
        if (err) {
          rej(err);
          return;
        }
        res(true);
      });
    });
  }
  update(query: Partial<T>, data: T, upsert: boolean = false): Promise<boolean> {
    return new Promise((res, rej) => {
      if (!this.nedb || !this.loaded) {
        rej("DB is not initialized");
        return;
      }
      this.nedb.update(query, data, { upsert }, (err) => {
        if (err) {
          rej(err);
          return;
        }
        res(true);
      });
    });
  }
}