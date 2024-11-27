import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/search.reducer';

export const selectSearchState = createFeatureSelector<State>('search');
export const selectResults = createSelector(selectSearchState, (state) => state.results);
export const selectLoading = createSelector(selectSearchState, (state) => state.loading);
export const selectError = createSelector(selectSearchState, (state) => state.error);
export const selectQueryHistory = createSelector(selectSearchState, (state) => state.queryHistory);