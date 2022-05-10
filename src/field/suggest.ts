import { Input, simple } from "./input";

export class Suggest extends Input {
  private _fetchUrl: string;

  fetchUrl(url: string) {
    this._fetchUrl = url;
    return this;
  }

  attrs() {
    return {
      fetchUrl: this._fetchUrl,
    };
  }
}

export const suggest = simple(Suggest);
