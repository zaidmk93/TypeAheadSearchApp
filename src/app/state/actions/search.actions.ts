import { createAction, props } from '@ngrx/store';

export const resetResults = createAction('[Search] Reset Results');

export const search = createAction(
  '[Search] Search',
  props<{ query: string, page: number }>()
);

export const searchSuccess = createAction(
  '[Search] Search Success',
  props<{ results: any[] }>()
);

export const searchFailure = createAction(
  '[Search] Search Failure',
  props<{ error: any }>()
);

export const saveQuery = createAction(
  '[Search] Save Query',
  props<{ query: string }>()
);
