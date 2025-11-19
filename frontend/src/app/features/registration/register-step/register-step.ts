import { Component, ViewEncapsulation } from '@angular/core';
import {FormsModule} from '@angular/forms';


interface Food{
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-register-step',
  imports: [ FormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './register-step.html',
  styleUrl: './register-step.css',
})
export class RegisterStep {
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
}
