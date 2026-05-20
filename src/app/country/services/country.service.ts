import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { map, Observable, catchError, throwError, delay, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { Region } from '../interfaces/region.type';

const API_URL = ' https://restcountries.com/v3.1'

@Injectable({
  providedIn: 'root',
})
export class CountryService {

  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<string, Country[]>();

  searchByCapital(query: string): Observable<Country[]>{
    query = query.toLocaleLowerCase();

    if(this.queryCacheCapital.has(query)){
      return of(this.queryCacheCapital.get(query)!);
    }

    console.log(`Llegando al servidor por ${query}`);

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((restCountries) => CountryMapper.mapRestCountryToCountryArray(restCountries)),
      tap(countries => this.queryCacheCapital.set(query, countries)),
      catchError(error =>{
        console.log('Error fetching', error)
        return throwError(() => new Error(`No se encontraron datos asociados al valor ingresado ${query}`))
    })
    );
  }

  searchByCountry(query: string): Observable<Country[]>{
    query = query.toLocaleLowerCase();

    if(this.queryCacheCountry.has(query)){
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    console.log(`Llegando al servidor para countrie por ${query}`);

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
    .pipe(map((restCountries) => CountryMapper.mapRestCountryToCountryArray(restCountries)),
    tap(countries => this.queryCacheCountry.set(query, countries)),
    //delay(3000),
    catchError(error =>{
      console.log('Error fetching', error)
      return throwError(() => new Error(`No se encontraron datos asociados al valor ingresado ${query}`))
    })
    );
  }

  searchByAlphaCode(code: string) {

    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`).pipe(
      map((restCountries) => CountryMapper.mapRestCountryToCountryArray(restCountries)),
      map(countries => countries.at(0)),
      catchError(error =>{
        console.log('Error fetching', error)
        return throwError(() => new Error(`No se encontraron datos asociados al codigo ${code}`))
      })
    );
  }

  searchByRegion(region: Region) {

    if(this.queryCacheRegion.has(region)){
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${region}`).pipe(
      map((restCountries) => CountryMapper.mapRestCountryToCountryArray(restCountries)),
      tap(countries => this.queryCacheRegion.set(region, countries)),
      catchError(error =>{
        console.log('Error fetching', error)
        return throwError(() => new Error(`No se encontraron datos asociados a la region:  ${region}`))
      })
    );
  }
}
