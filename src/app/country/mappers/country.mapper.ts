import type { Country } from "../interfaces/country.interface";
import type { RESTCountry } from "../interfaces/rest-countries.interface";

export class CountryMapper {
  //static  RestCountry => Country

  static mapRestCountryToCountry(restCountry: RESTCountry): Country{
    return{
      cca2: restCountry.cca2,
      flag: restCountry.flag,
      flagsvg: restCountry.flags.svg,
      name: restCountry.translations['spa']['common'],//restCountry.name.common,
      capital: restCountry.capital?.join(','),
      population: restCountry.population,
      coatOfArms: restCountry.coatOfArms.svg,
      region: restCountry.region,
      subRegion: restCountry.subregion,
    }
  }

  //Static RestCountry[] => Country[]
  static mapRestCountryToCountryArray(restCountries: RESTCountry[]): Country[]{
    return restCountries.map(this.mapRestCountryToCountry);
  }
}
