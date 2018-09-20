import { ListComponent } from './list/list.component';
import { NgMentionService } from './ng-mention.service';
import { IMentionConfig } from './ng-mention.models';
import { Directive, forwardRef, AfterContentInit, ComponentRef, OnInit, Output, EventEmitter, HostListener, Input, ElementRef, ViewContainerRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
  selector: "[ng-mention]",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgMentionDirective),
      multi: true
    }
  ]
})
export class NgMentionDirective implements AfterContentInit, ControlValueAccessor, OnInit {
  private _keyMapHandler = {
    8: (event: KeyboardEvent) => this._onBackspace(event),
    13: (event: KeyboardEvent) => this._onEnter(event),
    27: (event: KeyboardEvent) => this._onEscape(event),
    37: (event: KeyboardEvent) => this._arrowLeft(event),
    38: (event: KeyboardEvent) => this._arrowUp(event),
    40: (event: KeyboardEvent) => this._arrowDown(event),
    39: (event: KeyboardEvent) => this._arrowRight(event)
  };

  private _onChanged = (_: string) => {};
  private _selectObj: Selection = window.getSelection();
  private _rangeObj: Range = document.createRange();
  private _listComponent: ComponentRef<ListComponent>;
  private _placeholder: HTMLElement;
  private _tempNode: HTMLElement;
  private _mentionConfig: IMentionConfig;
  private _initPattern: RegExp;
  private _list = [];
  @Output() public onSelect: EventEmitter<any> = new EventEmitter();
  @Output() public onSearch: EventEmitter<string> = new EventEmitter();


  @HostListener("keyup", ["$event"]) onKeyUp(event: KeyboardEvent): void {
      if (this._selectObj.anchorNode.textContent.match(this._initPattern)) {

      if (!this._tempNode && !Boolean(event.which in this._keyMapHandler) && this._isChooseModeInvoked(event)) {
        this._switchChooseMode();
      }

      if (this._tempNode && event.which === 8 || this._tempNode && !Boolean(event.which in this._keyMapHandler)) {
        this._queryHandler(this._tempNode.children[0].textContent);
      }
    }

    this._onChanged(this._elRef.nativeElement.innerHTML);
  }

  @HostListener("keydown", ["$event"]) onKeyDown(event: KeyboardEvent): void {
    if (!this._tempNode && event.which === 13) {
      event.preventDefault();
      document.execCommand("insertHTML", false, "<br>\u200C");
    }

    if (this._tempNode && event.which in this._keyMapHandler) {
      this._keyMapHandler[event.which](event);
    }
  }

  @HostListener("paste", ["$event"]) onPaste(clbEvent: ClipboardEvent): void {
    const pastedData: string = clbEvent.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, pastedData);
    clbEvent.preventDefault();
  }

  @HostListener("document:click", ["$event"]) onClick(event: MouseEvent): void {
    if (this._tempNode && !this._listComponent.location.nativeElement.contains(event.target)) {
      this._revertTempNode();
    }
  }

  @HostListener('focus') onFocus(): void {
    if (this._elRef.nativeElement.contains(this._placeholder) && this._mentionConfig.baseComponentPlaceholder) {
      this._hidePlaceholder();
    }
  }

  @HostListener('blur') onBlur(): void {
    if (!this._elRef.nativeElement.contains(this._placeholder) && this._elRef.nativeElement.textContent === '' && this._mentionConfig.baseComponentPlaceholder) {
      this._showPlaceholder();
    }
  }

  @Input("ng-mention") public set setMentionConfig(userConfig: IMentionConfig) {
    if (userConfig instanceof Object && !Array.isArray(userConfig) || typeof userConfig === 'undefined') {
      this._mentionConfig = this._mentionService.getCompletedConfig(userConfig);
    } else {
      throw new Error('Config isn\'t an object');
    }
  }

  @Input('list') public set setlist(list) {
    this._list = list;
    if (this._listComponent) {
      this._listComponent.instance.setList = list;
    }
  }

  public constructor(
    private _elRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _mentionService: NgMentionService,
  ) {}

  public ngOnInit(): void {
    this._initPattern = new RegExp(`(^|\\s)${this._mentionConfig && this._mentionConfig.character || '@' }(([A-za-z0-9\\s]*))$`);

    if (this._mentionConfig.baseComponentPlaceholder) {
      this._placeholder = this._mentionService.getPlaceholder(this._mentionConfig.baseComponentPlaceholder, this._mentionConfig.baseComponentPlaceholderClass);
    }
  }

  public ngAfterContentInit(): void {
    this._mentionService.prepareBaseElem(this._elRef.nativeElement);
  }

  private _onEnter(event: KeyboardEvent): void {
    if (this._tempNode) {
      event.preventDefault();
      this._listComponent.instance.onEnterSelect();
    }
  }

  private _onBackspace(event: KeyboardEvent): void {
    if (this._isRootCharacterBefore()) {
      this._removeTempNode();
    }
  } 

  private _arrowUp(event: KeyboardEvent) {
    event.preventDefault();
    this._mentionService.setFocusedItemIndexShift(-1);
  }

  private _arrowDown(event: KeyboardEvent) {
    event.preventDefault();
    this._mentionService.setFocusedItemIndexShift(1);
  }

  private _arrowLeft(event: KeyboardEvent) {
    if (this._isRootCharacterBefore()) {
      this._revertTempNode();
    }
  }

  private _arrowRight(event: KeyboardEvent) {
    event.preventDefault();
  }

  private _onEscape(event: KeyboardEvent) {
    if (this._isRootCharacterBefore()) {
      this._revertTempNode();
    }
  }

  public writeValue(formValue: string): void {
    if (this._mentionConfig.baseComponentPlaceholder) {
      formValue ? this._elRef.nativeElement.textContent = formValue : this._showPlaceholder();
    } else {
      this._elRef.nativeElement.textContent = formValue;
    }
  }

  public registerOnChange(fn: any): void {
    this._onChanged = fn;
  }

  public registerOnTouched(fn: any): void {}

  public setDisabledState(isDisabled: boolean): void {
    setTimeout(() => this._elRef.nativeElement.setAttribute("contenteditable", String(!isDisabled)), 0)
  }

  private _initList(): void {
    this._listComponent = this._mentionService.dynamicallyComponentHelper(
      ListComponent,
      this._viewContainerRef,
      {config: this._mentionConfig, list: this._list},
    );

    this._listComponent.instance.onSelect.subscribe((item) => {
      this.onSelect.emit(item);
      const mention: HTMLElement = this._mentionService.createMention(item, this._mentionConfig);
      this._tempNode.insertAdjacentElement('beforebegin', mention);
      mention.insertAdjacentHTML('afterend', '&#160;')
      this._removeTempNode();
      this._onChanged(this._elRef.nativeElement.innerHTML);
    });
  }

  private _showPlaceholder(): void {
    this._elRef.nativeElement.appendChild(this._placeholder);
  }

  private _hidePlaceholder(): void {
    this._elRef.nativeElement.removeChild(this._placeholder);
  }

  private _switchChooseMode(): void {
    this._tempNode = this._mentionService.getTempNode(this._mentionConfig && this._mentionConfig.character || '@');
    this._setNodeInside(this._tempNode);
    this._setCursorPosition(this._tempNode);
    this._initList();
    this._tempNode.appendChild(this._listComponent.location.nativeElement);
    this._setListCoordinates();
  }

  private _setCursorPosition(node, position: number = 1): void {
    this._rangeObj.setStart(node, position);
    this._selectObj.removeAllRanges();
    this._selectObj.addRange(this._rangeObj);
  }

  private _queryHandler(tempTextContent: string) {
    this.onSearch.emit(tempTextContent.slice(1, tempTextContent.length));
    this._setListCoordinates();
  }

  private _setNodeInside(inputNode: HTMLElement, offset: number = -1): void {
    const rightPiece = document.createTextNode(this._selectObj.anchorNode.textContent.slice(this._selectObj.anchorOffset, this._selectObj.anchorNode.textContent.length));
    this._selectObj.anchorNode.textContent = this._selectObj.anchorNode.textContent.slice(0, this._selectObj.anchorOffset + offset);

    if (this._selectObj.anchorNode.nextSibling) {
      this._selectObj.anchorNode.parentElement.insertBefore(rightPiece, this._selectObj.anchorNode.nextSibling);
      this._selectObj.anchorNode.parentElement.insertBefore(inputNode, rightPiece);
    } else {
      this._selectObj.anchorNode.parentNode.appendChild(inputNode);
      this._selectObj.anchorNode.parentNode.appendChild(rightPiece);
    }
  }

  private _revertTempNode(): void {
    this._tempNode.insertAdjacentText('beforebegin', this._tempNode.children[0].textContent);
    this._removeTempNode();
  }

  private _removeTempNode(): void {
    this._elRef.nativeElement.removeChild(this._tempNode);
    this._tempNode = null;
  }

  private _setListCoordinates() {
    const coordinates: ClientRect = this._tempNode.getClientRects()[this._tempNode.getClientRects().length - 1];
    this._listComponent.location.nativeElement.style.top = coordinates.top + coordinates.height + window.pageYOffset + 'px';
    this._listComponent.location.nativeElement.style.left = coordinates.left + coordinates.width + 'px';
  }

  private _isRootCharacterBefore(): boolean {
    return this._selectObj.anchorOffset === 1;
  }

  private _isChooseModeInvoked(event: KeyboardEvent): boolean {
    return event.key === (this._mentionConfig && this._mentionConfig.character);
  }
}