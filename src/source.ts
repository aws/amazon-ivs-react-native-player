import type { Source } from './types';

let sourceId = 0;

export const createSourceWrapper = (url: string): Source => {
  return new SourceWrapper(sourceId++, url);
};

class SourceWrapper implements Source {
  private _id: number;
  private _url: string;

  constructor(id: number, url: string) {
    this._id = id;
    this._url = url;
  }

  public getId() {
    return this._id;
  }

  public getUri() {
    return this._url;
  }
}
