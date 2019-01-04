import { Input } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
  @Input() context: { [key: string]: string };
  @Input() outputItemProperty: string;
}
