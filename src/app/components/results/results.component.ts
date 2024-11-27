import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  @Input() results: any[] = [];
  @Output() loadMoreResults = new EventEmitter<void>();

  onScroll(index: number) {
    // Emit `loadMoreResults` when scrolling near the end
    if (index >= this.results.length - 5) {
      this.loadMoreResults.emit();
    }
  }
}
