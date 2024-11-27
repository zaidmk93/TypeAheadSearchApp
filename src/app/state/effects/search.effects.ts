import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../services/api.service';
import * as SearchActions from '../actions/search.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class SearchEffects {
  constructor(private actions$: Actions, private apiService: ApiService) {}

  
  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.search),
      switchMap(action =>
        this.apiService.search(action.query, action.page).pipe(
          map(results => SearchActions.searchSuccess({ results })),
          catchError(error => of(SearchActions.searchFailure({ error })))
        )
      )
    )
  );
}
