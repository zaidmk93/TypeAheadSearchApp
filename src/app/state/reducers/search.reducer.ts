import { createReducer, on } from '@ngrx/store';
import * as SearchActions from '../actions/search.actions';

export interface State {
  results: any[];
  loading: boolean;
  error: any;
  queryHistory: string[];
  currentQuery: string | null; // track the active query
}

const initialState: State = {
  results: [],
  loading: false,
  error: null,
  queryHistory: [],
  currentQuery: null,
};

export const searchReducer = createReducer(
  initialState,
  // Handle new search or continued search for the same query
  on(SearchActions.search, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    results: query === state.currentQuery ? state.results : [], // clear only for new queries
    currentQuery: query,                                        // Update the current query
  })),
  on(SearchActions.resetResults, (state) => ({
    ...state,
    results: [],
    loading: false,
    error: null,
    currentQuery: null,
  })),
  on(SearchActions.searchSuccess, (state, { results }) => ({
    ...state,
    loading: false,
    results: [...state.results, ...results],                    // append results for pagination
  })),
  on(SearchActions.searchFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(SearchActions.saveQuery, (state, { query }) => ({
    ...state,
    queryHistory: [...new Set([query, ...state.queryHistory])],
  }))
);
