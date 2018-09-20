import { NgMentionService } from './../ng-mention.service';
import { EventEmitter, Input, Output, OnInit, QueryList, Component, ViewChildren } from '@angular/core';
import { IMentionConfig } from './../ng-mention.models';
import { ListItemComponent } from './../list-item/list-item.component';

@Component({
  selector: "list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  host: { "[class]": '[this.config.listClass || "mention-list"]' },
})
export class ListComponent implements OnInit {
  @ViewChildren('listItem') items: QueryList<ListItemComponent>;
  public list = [];
  public selectedItemIndex: number = 0;

  @Output() onSelect = new EventEmitter();

  @Input('config') public config: IMentionConfig;

  @Input('list') public set setList(list) {
    this.list = list;
    setTimeout(_ => this.selectedItemIndex = 0, 0);
  };
  
  public selectItem(item): void {
    this.onSelect.emit(item);
  }

  public onEnterSelect(): void {
    this.list.length && this.selectItem(this.list[this.selectedItemIndex]);
  }

  public focusedItem(selectedItem) {
    this.items.forEach((listItem, index: number) => {
      if (listItem.context === selectedItem) {
        this.selectedItemIndex = index;
      }
    });
  }

  public constructor(private _mentionService: NgMentionService) {}

  public ngOnInit() {
    this._mentionService.getFocusedItemIndexShift().subscribe((shift: number) => {
      const index: number = this.selectedItemIndex + shift;

      if (index >= 0 && index <= this.list.length - 1) {
        this.items.forEach(_ => this.selectedItemIndex = index);
      }
    });
  }
}