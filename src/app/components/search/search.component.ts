import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, take, filter, defaultIfEmpty, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import * as SearchActions from '../../state/actions/search.actions';
import { selectResults, selectLoading, selectError, selectQueryHistory } from '../../state/selectors/search.selectors';

interface SearchResult {
  id: string;
  title: string;
  author_name?: string[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchQuery = new Subject<string>();
  results$: Observable<SearchResult[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  queryHistory$: Observable<string[]>;
  private currentPage = 1;                        // Track the current page for pagination
  private destroy$ = new Subject<void>();
  protected currentQuery = '';                    // Storing for the active query
  private lastPageLoadTime = 0;

  constructor(private store: Store) {
    this.results$ = this.store.select(selectResults).pipe(
      filter((results): results is SearchResult[] => Array.isArray(results)),
      defaultIfEmpty([]),                         // empty array is emitted if no results
      map((results) => results || []),            // it always returns an array
      takeUntil(this.destroy$)
    );
    
    
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.queryHistory$ = this.store.select(selectQueryHistory);
  }

  onSearch(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  const value = inputElement?.value.trim() || '';
  this.searchQuery.next(value);                   // emit the query to the subject
}


  // onSearchFromHistory(query: string): void {
  //   this.currentQuery = query;
  //   this.currentPage = 1; // Reset to the first page for a historical query
  //   this.store.dispatch(SearchActions.search({ query, page: this.currentPage }));
  // }

  loadMoreResults(): void {
    if (!this.currentQuery) return;
    const currentTime = Date.now();
    const timeDifference = currentTime - this.lastPageLoadTime;
    this.lastPageLoadTime = Date.now();

    if (timeDifference < 1000) {
      return;                                     // don't load the next page if it's been less than 1 second
    }
    this.loading$.pipe(take(1)).subscribe(loading => {
      if (loading) {
        return;
      }

      this.results$.pipe(
        debounceTime(300),
        take(1)
      ).subscribe((results) => {
        if (results.length < this.currentPage * 10) {
          return;                                 // stop further loading if no more results
        }
    
        this.currentPage++;
        this.store.dispatch(SearchActions.search({ query: this.currentQuery, page: this.currentPage }));
      });
    });
  }

  ngOnInit() {
    this.searchQuery
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),                    // Only proceed if the query has changed
        takeUntil(this.destroy$)
      )
      .subscribe((query) => {
        if (query.trim()) {
          this.currentQuery = query.trim();        // dispatch search action with the query
          this.currentPage = 1;
          this.store.dispatch(SearchActions.search({ query: this.currentQuery, page: this.currentPage }));
        } else {
          this.currentQuery = '';                   // reset the search state if the query is empty
          this.store.dispatch(SearchActions.resetResults());
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
