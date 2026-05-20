import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {

  placeholder = input.required<string>();
  value = output<string>();
  debounceTime =input(1000);

  inputValue = signal<string>('');

  debounceEffect = effect((onCleanup)=>{
    const value = this.inputValue();

    const timeout = setTimeout(()=>{
      this.value.emit(value);
    }, this.debounceTime());

    onCleanup(()=>{
      clearTimeout(timeout);
    })
  })
}
