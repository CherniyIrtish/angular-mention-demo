import { IMentionConfig } from './ng-mention.models';
import { Injectable, ComponentFactoryResolver, ViewContainerRef, ComponentRef, ComponentFactory, Type } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class NgMentionService {
  private _focusedItemIndexShift: Subject<number> = new Subject();
  private _baseComponentPlaceholder: HTMLElement;

  public _defaultConfig: IMentionConfig = {
    outputItemProperty: 'name',
    character: '@',
    emptyListPlaceholder: 'Please, change your query, there isn\'t any data...',
    outputMentionProperty: 'name',
  };

  constructor(private _resolver: ComponentFactoryResolver) {}

  public getFocusedItemIndexShift(): Observable<number> {
    return this._focusedItemIndexShift.asObservable();
  }

  public setFocusedItemIndexShift(shift: number) {
    this._focusedItemIndexShift.next(shift);
  }

  public createMention(item, mentionConfig: IMentionConfig): HTMLElement {
    const mention: HTMLElement = document.createElement('span');
    mentionConfig.mentionClass ? mention.classList.add(mentionConfig.mentionClass) : mention.classList.add('mention');
    mention.style['user-select'] = 'none';
    mention.style['-webkit-touch-callout'] = 'none';
    mention.style['-moz-user-select'] = 'none';
    mention.style['-ms-user-select'] = 'none';
    mention.dataset.id = item.id;
    mention.textContent = `${mentionConfig.character}${item[mentionConfig.outputMentionProperty]} `;
    mention.setAttribute("contenteditable", 'false');
    return mention;
  }

  public getPlaceholder(phValue, phClass): HTMLElement {
    return this._baseComponentPlaceholder ? this._baseComponentPlaceholder : this._createBaseComponentPlaceholder(phValue, phClass);
  }

  public prepareBaseElem(baseElem: HTMLElement): void {
    baseElem.setAttribute("contenteditable", 'true');
    baseElem.style["outline"] = "none";
  }

  public dynamicallyComponentHelper(
    rawComponent: Type<any>,
    viewContainerRef: ViewContainerRef,
    inputData: {[key: string]: any}
    ): ComponentRef<any> {
    const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(rawComponent);
    const component: ComponentRef<any> = viewContainerRef.createComponent(factory);

    component.instance.config = {...inputData.config};
    component.instance.list = [...inputData.list];
    return component;
  }

  public getTempNode(character: string): HTMLElement {
    const container = document.createElement('span');
    container.setAttribute('class', 'container');
    
    const request = document.createElement('span');
    request.setAttribute('class', 'request');
    request.textContent = character;
    container.appendChild(request);

    return container;
  }

  public getCompletedConfig(userConfig = {}): IMentionConfig {
    Object.keys(this._defaultConfig).forEach((requiredProperty: string) => {
      if (!userConfig.hasOwnProperty(requiredProperty)) {
        userConfig[requiredProperty] = this._defaultConfig[requiredProperty];
      }
    });
    return (userConfig as IMentionConfig);
  }

  private _createBaseComponentPlaceholder(phValue, phClass): HTMLElement {
    const baseComponentPlaceholder: HTMLElement = document.createElement('div');
    baseComponentPlaceholder.setAttribute('class', phClass);
    baseComponentPlaceholder.textContent = phValue;
    return baseComponentPlaceholder;
  }
}