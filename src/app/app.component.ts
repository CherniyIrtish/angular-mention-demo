import { IMentionConfig } from './../../projects/angular-mention/src/lib/ng-mention.models';
import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
const managers = [
  {
    id: 1,
    name: 'John',
    position: 'user'
  },
  {
    id: 1754,
    name: 'Mary',
    position: 'manager'
  },
  {
    id: 65,
    name: 'Clara',
    position: 'user'
  },
  {
    id: 187,
    name: 'Nill',
    position: 'owner'
  },
  {
    id: 84,
    name: 'Devid',
    position: 'admin'
  },
  {
    id: 16,
    name: 'Kristofer',
    position: 'manager'
  },
  {
    id: 157,
    name: 'Devid',
    position: 'manager'
  },
  {
    id: 81579,
    name: 'Lisa',
    position: 'owner'
  },
  {
    id: 16,
    name: 'Ann',
    position: 'admin'
  },
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-mention-demo';
  public managerList = managers;
  public mentionForm;
  public config = {};

  public constructor(private _formBuilder: FormBuilder) {
    this.mentionForm = this._formBuilder.group({
      mention: new FormControl({ value: "", disabled: false })
    });

    this.mentionForm.valueChanges.subscribe((value: string) => {
      console.log(value)
      //your code here
    });
  }

  public onSelect(selectedItem) {
    this.managerList = this.managerList.filter((manager) => manager !== selectedItem)
  }

  public onSearch(query: string) {
    this.managerList = managers.filter((manager) => manager.name.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1);
  }

  public onSubmit(): void {
    console.log(this.mentionForm.controls['mention'].value);
    }
  }