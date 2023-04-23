import { TypeKeys } from "typecasts";
import { Field, simple } from '../field';

export class Suggest<T extends TypeKeys> extends Field<T> {
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
