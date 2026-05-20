import { Component, inject, linkedSignal, signal } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {

  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);

  router = inject(Router)

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';

  query = linkedSignal(()=>this.queryParam);


 countryResource = rxResource({
    params: this.query,
    stream: ({ params }) => {
      if (!params) return of([])

      this.router.navigate(['/country/by-capital'],{
        queryParams:{
          query: params
        }
      })

      return this.countryService.searchByCapital(params)
    }
  })

  // countryResource = resource({
  //   params: () => ({query : this.query() }),
  //   loader: async({params}) =>{
  //     if(!params.query ) return [];

  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(params.query)
  //     );

  //   }
  // })

  // isLoading = signal(false);
  // isError = signal<string|null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query:string){
  //   if( this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   this.countryService.searchByCapital(query)
  //   .subscribe({
  //     next:(countries)=>{
  //     this.isLoading.set(false);
  //     this.countries.set(countries);
  //     },
  //     error:  (err) => {
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(err)
  //     },
  //   })

  // }

}
