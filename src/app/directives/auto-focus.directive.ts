import { AfterContentInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterContentInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterContentInit() {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 100);
  }
}
