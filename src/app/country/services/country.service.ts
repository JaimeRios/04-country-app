import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { map, Observable, catchError, throwError, delay, of } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = ' https://restcountries.com/v3.1'

@Injectable({
  providedIn: 'root',
})
export class CountryService {

  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]>{
    query = query.toLocaleLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
    .pipe(map((restCountries) => CountryMapper.mapRestCountryToCountryArray(restCountries)),
    catchError(error =>{
      console.log('Error fetching', error)
      return throwError(() => new Error(`No se encontraron datos asociados al valor ingresado ${query}`))
    })
    );
  }

  searchByCountry(query: string): Observable<Country[]>{
    query = query.toLocaleLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
    .pipe(map((restCountries) => CountryMapper.mapRestCountryToCountryArray(restCountries)),
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
        return throwError(() => new Error(`No se encontraron datos asociados al valor ingresado ${code}`))
      })
    );
  }
}
