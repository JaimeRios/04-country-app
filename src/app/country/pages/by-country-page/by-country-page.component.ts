import { Component, inject, resource, signal } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {

  countryService = inject(CountryService);

  query = signal('');

  countryResource = rxResource({
    params: this.query,
    stream: ({ params }) => {
      if (!params) return of([])
      return this.countryService.searchByCountry(params)
    }
  })

  // countryResource = resource({
  //   params: () => ({query : this.query() }),
  //   loader: async({params}) =>{
  //     if(!params.query ) return [];

  //     return await firstValueFrom(
  //       this.countryService.searchByCountry(params.query)
  //     );
  //   }
  // })

}
