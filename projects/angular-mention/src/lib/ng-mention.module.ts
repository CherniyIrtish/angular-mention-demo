import { NgMentionDirective } from './ng-mention.directive';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { NgMentionService } from './ng-mention.service';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  providers: [NgMentionService],
  declarations: [ListItemComponent, ListComponent, NgMentionDirective],
  exports: [NgMentionDirective],
  entryComponents: [ListComponent],
})
export class NgMentionModule { }
