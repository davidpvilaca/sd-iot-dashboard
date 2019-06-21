import { Injectable } from '@angular/core';

interface IBase {
  data: string;
  id: string;
}

interface IUmidade extends IBase {
  umidade: number;
}

interface IPressao extends IBase {
  pressao: number;
}

interface ITemperatura extends IBase {
  temperatura: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataApiService {

  getUmidade(): Promise<IUmidade[]> {
    return this.normalizeFetch('umidade');
  }

  getPressao(): Promise<IPressao[]> {
    return this.normalizeFetch('pressao');
  }

  getTemperatura(): Promise<ITemperatura[]> {
    return this.normalizeFetch('temperatura');
  }

  private normalizeFetch(path: string) {
    return fetch(this.getUri(path))
      .then(
        res => res.json(),
      );
  }

  private getUri(path: string): string {
    return `https://filaiot.herokuapp.com/${path}`;
  }

}
