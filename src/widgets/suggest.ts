import { Widget, simple } from "./widget";

export class Suggest extends Widget {
  private _fetchUrl?: string;

  fetchUrl(url: string) {
    this._fetchUrl = url;
    return this;
  }

  extra() {
    return {
      fetchUrl: this._fetchUrl,
    };
  }
}

export const suggest = simple(Suggest);
