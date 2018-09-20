<h1><a href="https://github.com/CherniyIrtish/ng-mention">Angular mentions</a></h1>  

An Angular 6 directive lets you mention people and add placeholder:
 - Mention people.
 - Add configurable placeholder.
 - Get value by formControl directive of Angular { ReactiveFormsModule }.

<h2>Getting Started</h2>
<h3>Install</h3>
<p>Install angular-mentions directive via npm:</p>
<div class="highlight"><pre>npm install angular-mention --save</pre></div>
<p>Import module to *.module.ts file</p>
<div class="highlight">
<p><pre>import { NgMentionModule } from 'angular-mention';
@NgModule({
imports: [NgMentionModule]
})</pre></p>
</div>

<h3>Example</h3>
<div class="highlight">
 <pre>
 &#60;form [formGroup]="mentionForm"&gt;
   &#60;div formControlName="mention"
        [ng-mention]="config"
        [list]='managerList'
        (onSelect)="onSelect($event)"
        (onSearch)="onSearch($event)"&gt;
   &#60;/div&gt;
&#60;form&gt;
 </pre>
</div>

<h3>API</h3>
<p>@Input your data list array of objects.</p>
<div class="highlight">
 <pre>[list]='managerList'</pre> 
</div>
<p>@Output triggers each time when item selected, bubbling value is a reference to item.</p>
<div class="highlight">
 <pre>(onSelect)="selectHandler($event)"</pre> 
</div>
<p>@Output triggers when list is open and you search value, bubbling value is string.</p>
<div class="highlight">
 <pre>(onSearch)="searchHandler($event)</pre> 
</div>
<p>Also you can follow for value in reach text area by formControl or formControlName. Each time when item selects in value of base element add innerHTML value with data-id of item like <strong> &#60;span data-id="item's id" class="mention"&gt; choosen value   &#60;/span&gt;</strong></p>

<h3>Configuration</h3>
<p>If it is need ng-mention can be configurable as @Input value to directive.</p>
<div class="highlight">
 <pre>[ng-mention]="config"</pre>
 <p>Possible options</p>
 <pre>
 public config = {
   outputItemProperty: string,
   baseComponentPlaceholderClass: string, 
   listClass: string, 
   listItemClass: string,
   baseComponentPlaceholder: string, 
   character: string,
   emptyListPlaceholder: string, 
   outputMentionProperty: string,
   listItemHoverClass: string,
   listEmptyClass: string, 
   mentionClass: string, 
   };
</pre>
 <p>
  <ul>
   <li>
     <strong>  outputItemProperty</strong>  - value shows as options of list(default ).
   </li>
   <li>
       <strong>baseComponentPlaceholderClass</strong>  - name of class styles placeholder of 	component on which uses directive.
   </li>
   <li>
       <strong>listClass</strong>  - class for styling list (setup default).
   </li>
   <li>
       <strong>listItemClass</strong>  - class for styling item of list (setup default).
   </li>
   <li>
       <strong>baseComponentPlaceholder</strong>  - value for component on which uses directive	.
   </li>
   <li>
       <strong>character</strong>  - character that will be use for show list (default  ).
   </li>
   <li>
       <strong>emptyListPlaceholder</strong>  - value for empty list (default: )
   </li>
   <li>
       <strong>outputMentionProperty</strong>  - value that will be display in future 'span' tag (default: 	).
   </li>
   <li>
       <strong>listItemHoverClass</strong>  - class for hover event on item list.
   </li>
   <li>
       <strong>listEmptyClass</strong>  - class for empty state of list.
   </li>
   <li>
       <strong>mentionClass</strong>  - class for mention.
   </li>
 </ul>
 </p>
</div>