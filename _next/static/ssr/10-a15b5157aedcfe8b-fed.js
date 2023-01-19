"use strict";
exports.id = 10;
exports.ids = [10,643];
exports.modules = {

/***/ 3250:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var e=__webpack_require__(9497);function h(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var k="function"===typeof Object.is?Object.is:h,l=e.useState,m=e.useEffect,n=e.useLayoutEffect,p=e.useDebugValue;function q(a,b){var d=b(),f=l({inst:{value:d,getSnapshot:b}}),c=f[0].inst,g=f[1];n(function(){c.value=d;c.getSnapshot=b;r(c)&&g({inst:c})},[a,d,b]);m(function(){r(c)&&g({inst:c});return a(function(){r(c)&&g({inst:c})})},[a]);p(d);return d}
function r(a){var b=a.getSnapshot;a=a.value;try{var d=b();return!k(a,d)}catch(f){return!0}}function t(a,b){return b()}var u="undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement?t:q;exports.useSyncExternalStore=void 0!==e.useSyncExternalStore?e.useSyncExternalStore:u;


/***/ }),

/***/ 1688:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



if (true) {
  module.exports = __webpack_require__(3250);
} else {}


/***/ }),

/***/ 5761:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "j": function() { return /* binding */ focusManager; }
/* harmony export */ });
/* unused harmony export FocusManager */
/* harmony import */ var _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3989);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2161);



class FocusManager extends _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor() {
    super();

    this.setup = onFocus => {
      // addEventListener does not exist in React Native, but window does
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk && window.addEventListener) {
        const listener = () => onFocus(); // Listen to visibillitychange and focus


        window.addEventListener('visibilitychange', listener, false);
        window.addEventListener('focus', listener, false);
        return () => {
          // Be sure to unsubscribe if a new handler is set
          window.removeEventListener('visibilitychange', listener);
          window.removeEventListener('focus', listener);
        };
      }

      return;
    };
  }

  onSubscribe() {
    if (!this.cleanup) {
      this.setEventListener(this.setup);
    }
  }

  onUnsubscribe() {
    if (!this.hasListeners()) {
      var _this$cleanup;

      (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
      this.cleanup = undefined;
    }
  }

  setEventListener(setup) {
    var _this$cleanup2;

    this.setup = setup;
    (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
    this.cleanup = setup(focused => {
      if (typeof focused === 'boolean') {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    });
  }

  setFocused(focused) {
    this.focused = focused;

    if (focused) {
      this.onFocus();
    }
  }

  onFocus() {
    this.listeners.forEach(listener => {
      listener();
    });
  }

  isFocused() {
    if (typeof this.focused === 'boolean') {
      return this.focused;
    } // document global can be unavailable in react native


    if (typeof document === 'undefined') {
      return true;
    }

    return [undefined, 'visible', 'prerender'].includes(document.visibilityState);
  }

}
const focusManager = new FocusManager();


//# sourceMappingURL=focusManager.mjs.map


/***/ }),

/***/ 5644:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": function() { return /* binding */ dehydrate; },
/* harmony export */   "ZB": function() { return /* binding */ hydrate; },
/* harmony export */   "d_": function() { return /* binding */ defaultShouldDehydrateQuery; },
/* harmony export */   "lr": function() { return /* binding */ defaultShouldDehydrateMutation; }
/* harmony export */ });
// TYPES
// FUNCTIONS
function dehydrateMutation(mutation) {
  return {
    mutationKey: mutation.options.mutationKey,
    state: mutation.state
  };
} // Most config is not dehydrated but instead meant to configure again when
// consuming the de/rehydrated data, typically with useQuery on the client.
// Sometimes it might make sense to prefetch data on the server and include
// in the html-payload, but not consume it on the initial render.


function dehydrateQuery(query) {
  return {
    state: query.state,
    queryKey: query.queryKey,
    queryHash: query.queryHash
  };
}

function defaultShouldDehydrateMutation(mutation) {
  return mutation.state.isPaused;
}
function defaultShouldDehydrateQuery(query) {
  return query.state.status === 'success';
}
function dehydrate(client, options = {}) {
  const mutations = [];
  const queries = [];

  if (options.dehydrateMutations !== false) {
    const shouldDehydrateMutation = options.shouldDehydrateMutation || defaultShouldDehydrateMutation;
    client.getMutationCache().getAll().forEach(mutation => {
      if (shouldDehydrateMutation(mutation)) {
        mutations.push(dehydrateMutation(mutation));
      }
    });
  }

  if (options.dehydrateQueries !== false) {
    const shouldDehydrateQuery = options.shouldDehydrateQuery || defaultShouldDehydrateQuery;
    client.getQueryCache().getAll().forEach(query => {
      if (shouldDehydrateQuery(query)) {
        queries.push(dehydrateQuery(query));
      }
    });
  }

  return {
    mutations,
    queries
  };
}
function hydrate(client, dehydratedState, options) {
  if (typeof dehydratedState !== 'object' || dehydratedState === null) {
    return;
  }

  const mutationCache = client.getMutationCache();
  const queryCache = client.getQueryCache(); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

  const mutations = dehydratedState.mutations || []; // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

  const queries = dehydratedState.queries || [];
  mutations.forEach(dehydratedMutation => {
    var _options$defaultOptio;

    mutationCache.build(client, { ...(options == null ? void 0 : (_options$defaultOptio = options.defaultOptions) == null ? void 0 : _options$defaultOptio.mutations),
      mutationKey: dehydratedMutation.mutationKey
    }, dehydratedMutation.state);
  });
  queries.forEach(dehydratedQuery => {
    var _options$defaultOptio2;

    const query = queryCache.get(dehydratedQuery.queryHash); // Do not hydrate if an existing query exists with newer data

    if (query) {
      if (query.state.dataUpdatedAt < dehydratedQuery.state.dataUpdatedAt) {
        query.setState(dehydratedQuery.state);
      }

      return;
    } // Restore query


    queryCache.build(client, { ...(options == null ? void 0 : (_options$defaultOptio2 = options.defaultOptions) == null ? void 0 : _options$defaultOptio2.queries),
      queryKey: dehydratedQuery.queryKey,
      queryHash: dehydratedQuery.queryHash
    }, dehydratedQuery.state);
  });
}


//# sourceMappingURL=hydration.mjs.map


/***/ }),

/***/ 2273:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CancelledError": function() { return /* reexport safe */ _retryer_mjs__WEBPACK_IMPORTED_MODULE_0__.p8; },
/* harmony export */   "InfiniteQueryObserver": function() { return /* reexport safe */ _infiniteQueryObserver_mjs__WEBPACK_IMPORTED_MODULE_5__.c; },
/* harmony export */   "MutationCache": function() { return /* reexport safe */ _mutationCache_mjs__WEBPACK_IMPORTED_MODULE_6__.L; },
/* harmony export */   "MutationObserver": function() { return /* reexport safe */ _mutationObserver_mjs__WEBPACK_IMPORTED_MODULE_7__.X; },
/* harmony export */   "QueriesObserver": function() { return /* reexport safe */ _queriesObserver_mjs__WEBPACK_IMPORTED_MODULE_4__.y; },
/* harmony export */   "QueryCache": function() { return /* reexport safe */ _queryCache_mjs__WEBPACK_IMPORTED_MODULE_1__.t; },
/* harmony export */   "QueryClient": function() { return /* reexport safe */ _queryClient_mjs__WEBPACK_IMPORTED_MODULE_2__.S; },
/* harmony export */   "QueryObserver": function() { return /* reexport safe */ _queryObserver_mjs__WEBPACK_IMPORTED_MODULE_3__.z; },
/* harmony export */   "defaultShouldDehydrateMutation": function() { return /* reexport safe */ _hydration_mjs__WEBPACK_IMPORTED_MODULE_12__.lr; },
/* harmony export */   "defaultShouldDehydrateQuery": function() { return /* reexport safe */ _hydration_mjs__WEBPACK_IMPORTED_MODULE_12__.d_; },
/* harmony export */   "dehydrate": function() { return /* reexport safe */ _hydration_mjs__WEBPACK_IMPORTED_MODULE_12__.D; },
/* harmony export */   "focusManager": function() { return /* reexport safe */ _focusManager_mjs__WEBPACK_IMPORTED_MODULE_9__.j; },
/* harmony export */   "hashQueryKey": function() { return /* reexport safe */ _utils_mjs__WEBPACK_IMPORTED_MODULE_11__.yF; },
/* harmony export */   "hydrate": function() { return /* reexport safe */ _hydration_mjs__WEBPACK_IMPORTED_MODULE_12__.ZB; },
/* harmony export */   "isCancelledError": function() { return /* reexport safe */ _retryer_mjs__WEBPACK_IMPORTED_MODULE_0__.DV; },
/* harmony export */   "isError": function() { return /* reexport safe */ _utils_mjs__WEBPACK_IMPORTED_MODULE_11__.VZ; },
/* harmony export */   "isServer": function() { return /* reexport safe */ _utils_mjs__WEBPACK_IMPORTED_MODULE_11__.sk; },
/* harmony export */   "notifyManager": function() { return /* reexport safe */ _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_8__.V; },
/* harmony export */   "onlineManager": function() { return /* reexport safe */ _onlineManager_mjs__WEBPACK_IMPORTED_MODULE_10__.N; },
/* harmony export */   "parseFilterArgs": function() { return /* reexport safe */ _utils_mjs__WEBPACK_IMPORTED_MODULE_11__.I6; },
/* harmony export */   "parseMutationArgs": function() { return /* reexport safe */ _utils_mjs__WEBPACK_IMPORTED_MODULE_11__.lV; },
/* harmony export */   "parseMutationFilterArgs": function() { return /* reexport safe */ _utils_mjs__WEBPACK_IMPORTED_MODULE_11__.cb; },
/* harmony export */   "parseQueryArgs": function() { return /* reexport safe */ _utils_mjs__WEBPACK_IMPORTED_MODULE_11__._v; },
/* harmony export */   "replaceEqualDeep": function() { return /* reexport safe */ _utils_mjs__WEBPACK_IMPORTED_MODULE_11__.Q$; }
/* harmony export */ });
/* harmony import */ var _retryer_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2379);
/* harmony import */ var _queryCache_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9069);
/* harmony import */ var _queryClient_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8758);
/* harmony import */ var _queryObserver_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2924);
/* harmony import */ var _queriesObserver_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4615);
/* harmony import */ var _infiniteQueryObserver_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4787);
/* harmony import */ var _mutationCache_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8593);
/* harmony import */ var _mutationObserver_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9999);
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(81);
/* harmony import */ var _focusManager_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5761);
/* harmony import */ var _onlineManager_mjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(6474);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(2161);
/* harmony import */ var _hydration_mjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(5644);













//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 9499:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Gm": function() { return /* binding */ infiniteQueryBehavior; },
/* harmony export */   "Qy": function() { return /* binding */ hasNextPage; },
/* harmony export */   "ZF": function() { return /* binding */ hasPreviousPage; }
/* harmony export */ });
/* unused harmony exports getNextPageParam, getPreviousPageParam */
function infiniteQueryBehavior() {
  return {
    onFetch: context => {
      context.fetchFn = () => {
        var _context$fetchOptions, _context$fetchOptions2, _context$fetchOptions3, _context$fetchOptions4, _context$state$data, _context$state$data2;

        const refetchPage = (_context$fetchOptions = context.fetchOptions) == null ? void 0 : (_context$fetchOptions2 = _context$fetchOptions.meta) == null ? void 0 : _context$fetchOptions2.refetchPage;
        const fetchMore = (_context$fetchOptions3 = context.fetchOptions) == null ? void 0 : (_context$fetchOptions4 = _context$fetchOptions3.meta) == null ? void 0 : _context$fetchOptions4.fetchMore;
        const pageParam = fetchMore == null ? void 0 : fetchMore.pageParam;
        const isFetchingNextPage = (fetchMore == null ? void 0 : fetchMore.direction) === 'forward';
        const isFetchingPreviousPage = (fetchMore == null ? void 0 : fetchMore.direction) === 'backward';
        const oldPages = ((_context$state$data = context.state.data) == null ? void 0 : _context$state$data.pages) || [];
        const oldPageParams = ((_context$state$data2 = context.state.data) == null ? void 0 : _context$state$data2.pageParams) || [];
        let newPageParams = oldPageParams;
        let cancelled = false;

        const addSignalProperty = object => {
          Object.defineProperty(object, 'signal', {
            enumerable: true,
            get: () => {
              var _context$signal;

              if ((_context$signal = context.signal) != null && _context$signal.aborted) {
                cancelled = true;
              } else {
                var _context$signal2;

                (_context$signal2 = context.signal) == null ? void 0 : _context$signal2.addEventListener('abort', () => {
                  cancelled = true;
                });
              }

              return context.signal;
            }
          });
        }; // Get query function


        const queryFn = context.options.queryFn || (() => Promise.reject('Missing queryFn'));

        const buildNewPages = (pages, param, page, previous) => {
          newPageParams = previous ? [param, ...newPageParams] : [...newPageParams, param];
          return previous ? [page, ...pages] : [...pages, page];
        }; // Create function to fetch a page


        const fetchPage = (pages, manual, param, previous) => {
          if (cancelled) {
            return Promise.reject('Cancelled');
          }

          if (typeof param === 'undefined' && !manual && pages.length) {
            return Promise.resolve(pages);
          }

          const queryFnContext = {
            queryKey: context.queryKey,
            pageParam: param,
            meta: context.options.meta
          };
          addSignalProperty(queryFnContext);
          const queryFnResult = queryFn(queryFnContext);
          const promise = Promise.resolve(queryFnResult).then(page => buildNewPages(pages, param, page, previous));
          return promise;
        };

        let promise; // Fetch first page?

        if (!oldPages.length) {
          promise = fetchPage([]);
        } // Fetch next page?
        else if (isFetchingNextPage) {
          const manual = typeof pageParam !== 'undefined';
          const param = manual ? pageParam : getNextPageParam(context.options, oldPages);
          promise = fetchPage(oldPages, manual, param);
        } // Fetch previous page?
        else if (isFetchingPreviousPage) {
          const manual = typeof pageParam !== 'undefined';
          const param = manual ? pageParam : getPreviousPageParam(context.options, oldPages);
          promise = fetchPage(oldPages, manual, param, true);
        } // Refetch pages
        else {
          newPageParams = [];
          const manual = typeof context.options.getNextPageParam === 'undefined';
          const shouldFetchFirstPage = refetchPage && oldPages[0] ? refetchPage(oldPages[0], 0, oldPages) : true; // Fetch first page

          promise = shouldFetchFirstPage ? fetchPage([], manual, oldPageParams[0]) : Promise.resolve(buildNewPages([], oldPageParams[0], oldPages[0])); // Fetch remaining pages

          for (let i = 1; i < oldPages.length; i++) {
            promise = promise.then(pages => {
              const shouldFetchNextPage = refetchPage && oldPages[i] ? refetchPage(oldPages[i], i, oldPages) : true;

              if (shouldFetchNextPage) {
                const param = manual ? oldPageParams[i] : getNextPageParam(context.options, pages);
                return fetchPage(pages, manual, param);
              }

              return Promise.resolve(buildNewPages(pages, oldPageParams[i], oldPages[i]));
            });
          }
        }

        const finalPromise = promise.then(pages => ({
          pages,
          pageParams: newPageParams
        }));
        return finalPromise;
      };
    }
  };
}
function getNextPageParam(options, pages) {
  return options.getNextPageParam == null ? void 0 : options.getNextPageParam(pages[pages.length - 1], pages);
}
function getPreviousPageParam(options, pages) {
  return options.getPreviousPageParam == null ? void 0 : options.getPreviousPageParam(pages[0], pages);
}
/**
 * Checks if there is a next page.
 * Returns `undefined` if it cannot be determined.
 */

function hasNextPage(options, pages) {
  if (options.getNextPageParam && Array.isArray(pages)) {
    const nextPageParam = getNextPageParam(options, pages);
    return typeof nextPageParam !== 'undefined' && nextPageParam !== null && nextPageParam !== false;
  }

  return;
}
/**
 * Checks if there is a previous page.
 * Returns `undefined` if it cannot be determined.
 */

function hasPreviousPage(options, pages) {
  if (options.getPreviousPageParam && Array.isArray(pages)) {
    const previousPageParam = getPreviousPageParam(options, pages);
    return typeof previousPageParam !== 'undefined' && previousPageParam !== null && previousPageParam !== false;
  }

  return;
}


//# sourceMappingURL=infiniteQueryBehavior.mjs.map


/***/ }),

/***/ 4787:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "c": function() { return /* binding */ InfiniteQueryObserver; }
/* harmony export */ });
/* harmony import */ var _queryObserver_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2924);
/* harmony import */ var _infiniteQueryBehavior_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9499);



class InfiniteQueryObserver extends _queryObserver_mjs__WEBPACK_IMPORTED_MODULE_0__/* .QueryObserver */ .z {
  // Type override
  // Type override
  // Type override
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(client, options) {
    super(client, options);
  }

  bindMethods() {
    super.bindMethods();
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
  }

  setOptions(options, notifyOptions) {
    super.setOptions({ ...options,
      behavior: (0,_infiniteQueryBehavior_mjs__WEBPACK_IMPORTED_MODULE_1__/* .infiniteQueryBehavior */ .Gm)()
    }, notifyOptions);
  }

  getOptimisticResult(options) {
    options.behavior = (0,_infiniteQueryBehavior_mjs__WEBPACK_IMPORTED_MODULE_1__/* .infiniteQueryBehavior */ .Gm)();
    return super.getOptimisticResult(options);
  }

  fetchNextPage({
    pageParam,
    ...options
  } = {}) {
    return this.fetch({ ...options,
      meta: {
        fetchMore: {
          direction: 'forward',
          pageParam
        }
      }
    });
  }

  fetchPreviousPage({
    pageParam,
    ...options
  } = {}) {
    return this.fetch({ ...options,
      meta: {
        fetchMore: {
          direction: 'backward',
          pageParam
        }
      }
    });
  }

  createResult(query, options) {
    var _state$fetchMeta, _state$fetchMeta$fetc, _state$fetchMeta2, _state$fetchMeta2$fet, _state$data, _state$data2;

    const {
      state
    } = query;
    const result = super.createResult(query, options);
    const {
      isFetching,
      isRefetching
    } = result;
    const isFetchingNextPage = isFetching && ((_state$fetchMeta = state.fetchMeta) == null ? void 0 : (_state$fetchMeta$fetc = _state$fetchMeta.fetchMore) == null ? void 0 : _state$fetchMeta$fetc.direction) === 'forward';
    const isFetchingPreviousPage = isFetching && ((_state$fetchMeta2 = state.fetchMeta) == null ? void 0 : (_state$fetchMeta2$fet = _state$fetchMeta2.fetchMore) == null ? void 0 : _state$fetchMeta2$fet.direction) === 'backward';
    return { ...result,
      fetchNextPage: this.fetchNextPage,
      fetchPreviousPage: this.fetchPreviousPage,
      hasNextPage: (0,_infiniteQueryBehavior_mjs__WEBPACK_IMPORTED_MODULE_1__/* .hasNextPage */ .Qy)(options, (_state$data = state.data) == null ? void 0 : _state$data.pages),
      hasPreviousPage: (0,_infiniteQueryBehavior_mjs__WEBPACK_IMPORTED_MODULE_1__/* .hasPreviousPage */ .ZF)(options, (_state$data2 = state.data) == null ? void 0 : _state$data2.pages),
      isFetchingNextPage,
      isFetchingPreviousPage,
      isRefetching: isRefetching && !isFetchingNextPage && !isFetchingPreviousPage
    };
  }

}


//# sourceMappingURL=infiniteQueryObserver.mjs.map


/***/ }),

/***/ 819:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": function() { return /* binding */ defaultLogger; }
/* harmony export */ });
const defaultLogger = console;


//# sourceMappingURL=logger.mjs.map


/***/ }),

/***/ 9886:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "R": function() { return /* binding */ getDefaultState; },
/* harmony export */   "m": function() { return /* binding */ Mutation; }
/* harmony export */ });
/* harmony import */ var _logger_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(819);
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(81);
/* harmony import */ var _removable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9643);
/* harmony import */ var _retryer_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2379);





// CLASS
class Mutation extends _removable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Removable */ .F {
  constructor(config) {
    super();
    this.options = { ...config.defaultOptions,
      ...config.options
    };
    this.mutationId = config.mutationId;
    this.mutationCache = config.mutationCache;
    this.logger = config.logger || _logger_mjs__WEBPACK_IMPORTED_MODULE_1__/* .defaultLogger */ ._;
    this.observers = [];
    this.state = config.state || getDefaultState();
    this.updateCacheTime(this.options.cacheTime);
    this.scheduleGc();
  }

  get meta() {
    return this.options.meta;
  }

  setState(state) {
    this.dispatch({
      type: 'setState',
      state
    });
  }

  addObserver(observer) {
    if (this.observers.indexOf(observer) === -1) {
      this.observers.push(observer); // Stop the mutation from being garbage collected

      this.clearGcTimeout();
      this.mutationCache.notify({
        type: 'observerAdded',
        mutation: this,
        observer
      });
    }
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(x => x !== observer);
    this.scheduleGc();
    this.mutationCache.notify({
      type: 'observerRemoved',
      mutation: this,
      observer
    });
  }

  optionalRemove() {
    if (!this.observers.length) {
      if (this.state.status === 'loading') {
        this.scheduleGc();
      } else {
        this.mutationCache.remove(this);
      }
    }
  }

  continue() {
    if (this.retryer) {
      this.retryer.continue();
      return this.retryer.promise;
    }

    return this.execute();
  }

  async execute() {
    const executeMutation = () => {
      var _this$options$retry;

      this.retryer = (0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_2__/* .createRetryer */ .Mz)({
        fn: () => {
          if (!this.options.mutationFn) {
            return Promise.reject('No mutationFn found');
          }

          return this.options.mutationFn(this.state.variables);
        },
        onFail: (failureCount, error) => {
          this.dispatch({
            type: 'failed',
            failureCount,
            error
          });
        },
        onPause: () => {
          this.dispatch({
            type: 'pause'
          });
        },
        onContinue: () => {
          this.dispatch({
            type: 'continue'
          });
        },
        retry: (_this$options$retry = this.options.retry) != null ? _this$options$retry : 0,
        retryDelay: this.options.retryDelay,
        networkMode: this.options.networkMode
      });
      return this.retryer.promise;
    };

    const restored = this.state.status === 'loading';

    try {
      var _this$mutationCache$c3, _this$mutationCache$c4, _this$options$onSucce, _this$options2, _this$options$onSettl, _this$options3;

      if (!restored) {
        var _this$mutationCache$c, _this$mutationCache$c2, _this$options$onMutat, _this$options;

        this.dispatch({
          type: 'loading',
          variables: this.options.variables
        }); // Notify cache callback

        await ((_this$mutationCache$c = (_this$mutationCache$c2 = this.mutationCache.config).onMutate) == null ? void 0 : _this$mutationCache$c.call(_this$mutationCache$c2, this.state.variables, this));
        const context = await ((_this$options$onMutat = (_this$options = this.options).onMutate) == null ? void 0 : _this$options$onMutat.call(_this$options, this.state.variables));

        if (context !== this.state.context) {
          this.dispatch({
            type: 'loading',
            context,
            variables: this.state.variables
          });
        }
      }

      const data = await executeMutation(); // Notify cache callback

      await ((_this$mutationCache$c3 = (_this$mutationCache$c4 = this.mutationCache.config).onSuccess) == null ? void 0 : _this$mutationCache$c3.call(_this$mutationCache$c4, data, this.state.variables, this.state.context, this));
      await ((_this$options$onSucce = (_this$options2 = this.options).onSuccess) == null ? void 0 : _this$options$onSucce.call(_this$options2, data, this.state.variables, this.state.context));
      await ((_this$options$onSettl = (_this$options3 = this.options).onSettled) == null ? void 0 : _this$options$onSettl.call(_this$options3, data, null, this.state.variables, this.state.context));
      this.dispatch({
        type: 'success',
        data
      });
      return data;
    } catch (error) {
      try {
        var _this$mutationCache$c5, _this$mutationCache$c6, _this$options$onError, _this$options4, _this$options$onSettl2, _this$options5;

        // Notify cache callback
        await ((_this$mutationCache$c5 = (_this$mutationCache$c6 = this.mutationCache.config).onError) == null ? void 0 : _this$mutationCache$c5.call(_this$mutationCache$c6, error, this.state.variables, this.state.context, this));

        if (false) {}

        await ((_this$options$onError = (_this$options4 = this.options).onError) == null ? void 0 : _this$options$onError.call(_this$options4, error, this.state.variables, this.state.context));
        await ((_this$options$onSettl2 = (_this$options5 = this.options).onSettled) == null ? void 0 : _this$options$onSettl2.call(_this$options5, undefined, error, this.state.variables, this.state.context));
        throw error;
      } finally {
        this.dispatch({
          type: 'error',
          error: error
        });
      }
    }
  }

  dispatch(action) {
    const reducer = state => {
      switch (action.type) {
        case 'failed':
          return { ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };

        case 'pause':
          return { ...state,
            isPaused: true
          };

        case 'continue':
          return { ...state,
            isPaused: false
          };

        case 'loading':
          return { ...state,
            context: action.context,
            data: undefined,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: !(0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_2__/* .canFetch */ .Kw)(this.options.networkMode),
            status: 'loading',
            variables: action.variables
          };

        case 'success':
          return { ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: 'success',
            isPaused: false
          };

        case 'error':
          return { ...state,
            data: undefined,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: 'error'
          };

        case 'setState':
          return { ...state,
            ...action.state
          };
      }
    };

    this.state = reducer(this.state);
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager.batch */ .V.batch(() => {
      this.observers.forEach(observer => {
        observer.onMutationUpdate(action);
      });
      this.mutationCache.notify({
        mutation: this,
        type: 'updated',
        action
      });
    });
  }

}
function getDefaultState() {
  return {
    context: undefined,
    data: undefined,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: 'idle',
    variables: undefined
  };
}


//# sourceMappingURL=mutation.mjs.map


/***/ }),

/***/ 8593:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": function() { return /* binding */ MutationCache; }
/* harmony export */ });
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(81);
/* harmony import */ var _mutation_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9886);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2161);
/* harmony import */ var _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3989);





// CLASS
class MutationCache extends _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor(config) {
    super();
    this.config = config || {};
    this.mutations = [];
    this.mutationId = 0;
  }

  build(client, options, state) {
    const mutation = new _mutation_mjs__WEBPACK_IMPORTED_MODULE_1__/* .Mutation */ .m({
      mutationCache: this,
      logger: client.getLogger(),
      mutationId: ++this.mutationId,
      options: client.defaultMutationOptions(options),
      state,
      defaultOptions: options.mutationKey ? client.getMutationDefaults(options.mutationKey) : undefined
    });
    this.add(mutation);
    return mutation;
  }

  add(mutation) {
    this.mutations.push(mutation);
    this.notify({
      type: 'added',
      mutation
    });
  }

  remove(mutation) {
    this.mutations = this.mutations.filter(x => x !== mutation);
    this.notify({
      type: 'removed',
      mutation
    });
  }

  clear() {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_2__/* .notifyManager.batch */ .V.batch(() => {
      this.mutations.forEach(mutation => {
        this.remove(mutation);
      });
    });
  }

  getAll() {
    return this.mutations;
  }

  find(filters) {
    if (typeof filters.exact === 'undefined') {
      filters.exact = true;
    }

    return this.mutations.find(mutation => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_3__/* .matchMutation */ .X7)(filters, mutation));
  }

  findAll(filters) {
    return this.mutations.filter(mutation => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_3__/* .matchMutation */ .X7)(filters, mutation));
  }

  notify(event) {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_2__/* .notifyManager.batch */ .V.batch(() => {
      this.listeners.forEach(listener => {
        listener(event);
      });
    });
  }

  resumePausedMutations() {
    const pausedMutations = this.mutations.filter(x => x.state.isPaused);
    return _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_2__/* .notifyManager.batch */ .V.batch(() => pausedMutations.reduce((promise, mutation) => promise.then(() => mutation.continue().catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_3__/* .noop */ .ZT)), Promise.resolve()));
  }

}


//# sourceMappingURL=mutationCache.mjs.map


/***/ }),

/***/ 9999:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "X": function() { return /* binding */ MutationObserver; }
/* harmony export */ });
/* harmony import */ var _mutation_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9886);
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(81);
/* harmony import */ var _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3989);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2161);





// CLASS
class MutationObserver extends _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor(client, options) {
    super();
    this.client = client;
    this.setOptions(options);
    this.bindMethods();
    this.updateResult();
  }

  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }

  setOptions(options) {
    const prevOptions = this.options;
    this.options = this.client.defaultMutationOptions(options);

    if (!(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .shallowEqualObjects */ .VS)(prevOptions, this.options)) {
      this.client.getMutationCache().notify({
        type: 'observerOptionsUpdated',
        mutation: this.currentMutation,
        observer: this
      });
    }
  }

  onUnsubscribe() {
    if (!this.listeners.length) {
      var _this$currentMutation;

      (_this$currentMutation = this.currentMutation) == null ? void 0 : _this$currentMutation.removeObserver(this);
    }
  }

  onMutationUpdate(action) {
    this.updateResult(); // Determine which callbacks to trigger

    const notifyOptions = {
      listeners: true
    };

    if (action.type === 'success') {
      notifyOptions.onSuccess = true;
    } else if (action.type === 'error') {
      notifyOptions.onError = true;
    }

    this.notify(notifyOptions);
  }

  getCurrentResult() {
    return this.currentResult;
  }

  reset() {
    this.currentMutation = undefined;
    this.updateResult();
    this.notify({
      listeners: true
    });
  }

  mutate(variables, options) {
    this.mutateOptions = options;

    if (this.currentMutation) {
      this.currentMutation.removeObserver(this);
    }

    this.currentMutation = this.client.getMutationCache().build(this.client, { ...this.options,
      variables: typeof variables !== 'undefined' ? variables : this.options.variables
    });
    this.currentMutation.addObserver(this);
    return this.currentMutation.execute();
  }

  updateResult() {
    const state = this.currentMutation ? this.currentMutation.state : (0,_mutation_mjs__WEBPACK_IMPORTED_MODULE_2__/* .getDefaultState */ .R)();
    const result = { ...state,
      isLoading: state.status === 'loading',
      isSuccess: state.status === 'success',
      isError: state.status === 'error',
      isIdle: state.status === 'idle',
      mutate: this.mutate,
      reset: this.reset
    };
    this.currentResult = result;
  }

  notify(options) {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager.batch */ .V.batch(() => {
      // First trigger the mutate callbacks
      if (this.mutateOptions) {
        if (options.onSuccess) {
          var _this$mutateOptions$o, _this$mutateOptions, _this$mutateOptions$o2, _this$mutateOptions2;

          (_this$mutateOptions$o = (_this$mutateOptions = this.mutateOptions).onSuccess) == null ? void 0 : _this$mutateOptions$o.call(_this$mutateOptions, this.currentResult.data, this.currentResult.variables, this.currentResult.context);
          (_this$mutateOptions$o2 = (_this$mutateOptions2 = this.mutateOptions).onSettled) == null ? void 0 : _this$mutateOptions$o2.call(_this$mutateOptions2, this.currentResult.data, null, this.currentResult.variables, this.currentResult.context);
        } else if (options.onError) {
          var _this$mutateOptions$o3, _this$mutateOptions3, _this$mutateOptions$o4, _this$mutateOptions4;

          (_this$mutateOptions$o3 = (_this$mutateOptions3 = this.mutateOptions).onError) == null ? void 0 : _this$mutateOptions$o3.call(_this$mutateOptions3, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
          (_this$mutateOptions$o4 = (_this$mutateOptions4 = this.mutateOptions).onSettled) == null ? void 0 : _this$mutateOptions$o4.call(_this$mutateOptions4, undefined, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
        }
      } // Then trigger the listeners


      if (options.listeners) {
        this.listeners.forEach(listener => {
          listener(this.currentResult);
        });
      }
    });
  }

}


//# sourceMappingURL=mutationObserver.mjs.map


/***/ }),

/***/ 81:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "V": function() { return /* binding */ notifyManager; }
/* harmony export */ });
/* unused harmony export createNotifyManager */
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2161);


function createNotifyManager() {
  let queue = [];
  let transactions = 0;

  let notifyFn = callback => {
    callback();
  };

  let batchNotifyFn = callback => {
    callback();
  };

  const batch = callback => {
    let result;
    transactions++;

    try {
      result = callback();
    } finally {
      transactions--;

      if (!transactions) {
        flush();
      }
    }

    return result;
  };

  const schedule = callback => {
    if (transactions) {
      queue.push(callback);
    } else {
      (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .scheduleMicrotask */ .A4)(() => {
        notifyFn(callback);
      });
    }
  };
  /**
   * All calls to the wrapped function will be batched.
   */


  const batchCalls = callback => {
    return (...args) => {
      schedule(() => {
        callback(...args);
      });
    };
  };

  const flush = () => {
    const originalQueue = queue;
    queue = [];

    if (originalQueue.length) {
      (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .scheduleMicrotask */ .A4)(() => {
        batchNotifyFn(() => {
          originalQueue.forEach(callback => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  /**
   * Use this method to set a custom notify function.
   * This can be used to for example wrap notifications with `React.act` while running tests.
   */


  const setNotifyFunction = fn => {
    notifyFn = fn;
  };
  /**
   * Use this method to set a custom function to batch notifications together into a single tick.
   * By default React Query will use the batch function provided by ReactDOM or React Native.
   */


  const setBatchNotifyFunction = fn => {
    batchNotifyFn = fn;
  };

  return {
    batch,
    batchCalls,
    schedule,
    setNotifyFunction,
    setBatchNotifyFunction
  };
} // SINGLETON

const notifyManager = createNotifyManager();


//# sourceMappingURL=notifyManager.mjs.map


/***/ }),

/***/ 6474:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "N": function() { return /* binding */ onlineManager; }
/* harmony export */ });
/* unused harmony export OnlineManager */
/* harmony import */ var _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3989);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2161);



class OnlineManager extends _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor() {
    super();

    this.setup = onOnline => {
      // addEventListener does not exist in React Native, but window does
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk && window.addEventListener) {
        const listener = () => onOnline(); // Listen to online


        window.addEventListener('online', listener, false);
        window.addEventListener('offline', listener, false);
        return () => {
          // Be sure to unsubscribe if a new handler is set
          window.removeEventListener('online', listener);
          window.removeEventListener('offline', listener);
        };
      }

      return;
    };
  }

  onSubscribe() {
    if (!this.cleanup) {
      this.setEventListener(this.setup);
    }
  }

  onUnsubscribe() {
    if (!this.hasListeners()) {
      var _this$cleanup;

      (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
      this.cleanup = undefined;
    }
  }

  setEventListener(setup) {
    var _this$cleanup2;

    this.setup = setup;
    (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
    this.cleanup = setup(online => {
      if (typeof online === 'boolean') {
        this.setOnline(online);
      } else {
        this.onOnline();
      }
    });
  }

  setOnline(online) {
    this.online = online;

    if (online) {
      this.onOnline();
    }
  }

  onOnline() {
    this.listeners.forEach(listener => {
      listener();
    });
  }

  isOnline() {
    if (typeof this.online === 'boolean') {
      return this.online;
    }

    if (typeof navigator === 'undefined' || typeof navigator.onLine === 'undefined') {
      return true;
    }

    return navigator.onLine;
  }

}
const onlineManager = new OnlineManager();


//# sourceMappingURL=onlineManager.mjs.map


/***/ }),

/***/ 4615:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "y": function() { return /* binding */ QueriesObserver; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2161);
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(81);
/* harmony import */ var _queryObserver_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2924);
/* harmony import */ var _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3989);





class QueriesObserver extends _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor(client, queries) {
    super();
    this.client = client;
    this.queries = [];
    this.result = [];
    this.observers = [];
    this.observersMap = {};

    if (queries) {
      this.setQueries(queries);
    }
  }

  onSubscribe() {
    if (this.listeners.length === 1) {
      this.observers.forEach(observer => {
        observer.subscribe(result => {
          this.onUpdate(observer, result);
        });
      });
    }
  }

  onUnsubscribe() {
    if (!this.listeners.length) {
      this.destroy();
    }
  }

  destroy() {
    this.listeners = [];
    this.observers.forEach(observer => {
      observer.destroy();
    });
  }

  setQueries(queries, notifyOptions) {
    this.queries = queries;
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_1__/* .notifyManager.batch */ .V.batch(() => {
      const prevObservers = this.observers;
      const newObserverMatches = this.findMatchingObservers(this.queries); // set options for the new observers to notify of changes

      newObserverMatches.forEach(match => match.observer.setOptions(match.defaultedQueryOptions, notifyOptions));
      const newObservers = newObserverMatches.map(match => match.observer);
      const newObserversMap = Object.fromEntries(newObservers.map(observer => [observer.options.queryHash, observer]));
      const newResult = newObservers.map(observer => observer.getCurrentResult());
      const hasIndexChange = newObservers.some((observer, index) => observer !== prevObservers[index]);

      if (prevObservers.length === newObservers.length && !hasIndexChange) {
        return;
      }

      this.observers = newObservers;
      this.observersMap = newObserversMap;
      this.result = newResult;

      if (!this.hasListeners()) {
        return;
      }

      (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .difference */ .e5)(prevObservers, newObservers).forEach(observer => {
        observer.destroy();
      });
      (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .difference */ .e5)(newObservers, prevObservers).forEach(observer => {
        observer.subscribe(result => {
          this.onUpdate(observer, result);
        });
      });
      this.notify();
    });
  }

  getCurrentResult() {
    return this.result;
  }

  getQueries() {
    return this.observers.map(observer => observer.getCurrentQuery());
  }

  getObservers() {
    return this.observers;
  }

  getOptimisticResult(queries) {
    return this.findMatchingObservers(queries).map(match => match.observer.getOptimisticResult(match.defaultedQueryOptions));
  }

  findMatchingObservers(queries) {
    const prevObservers = this.observers;
    const defaultedQueryOptions = queries.map(options => this.client.defaultQueryOptions(options));
    const matchingObservers = defaultedQueryOptions.flatMap(defaultedOptions => {
      const match = prevObservers.find(observer => observer.options.queryHash === defaultedOptions.queryHash);

      if (match != null) {
        return [{
          defaultedQueryOptions: defaultedOptions,
          observer: match
        }];
      }

      return [];
    });
    const matchedQueryHashes = matchingObservers.map(match => match.defaultedQueryOptions.queryHash);
    const unmatchedQueries = defaultedQueryOptions.filter(defaultedOptions => !matchedQueryHashes.includes(defaultedOptions.queryHash));
    const unmatchedObservers = prevObservers.filter(prevObserver => !matchingObservers.some(match => match.observer === prevObserver));

    const getObserver = options => {
      const defaultedOptions = this.client.defaultQueryOptions(options);
      const currentObserver = this.observersMap[defaultedOptions.queryHash];
      return currentObserver != null ? currentObserver : new _queryObserver_mjs__WEBPACK_IMPORTED_MODULE_3__/* .QueryObserver */ .z(this.client, defaultedOptions);
    };

    const newOrReusedObservers = unmatchedQueries.map((options, index) => {
      if (options.keepPreviousData) {
        // return previous data from one of the observers that no longer match
        const previouslyUsedObserver = unmatchedObservers[index];

        if (previouslyUsedObserver !== undefined) {
          return {
            defaultedQueryOptions: options,
            observer: previouslyUsedObserver
          };
        }
      }

      return {
        defaultedQueryOptions: options,
        observer: getObserver(options)
      };
    });

    const sortMatchesByOrderOfQueries = (a, b) => defaultedQueryOptions.indexOf(a.defaultedQueryOptions) - defaultedQueryOptions.indexOf(b.defaultedQueryOptions);

    return matchingObservers.concat(newOrReusedObservers).sort(sortMatchesByOrderOfQueries);
  }

  onUpdate(observer, result) {
    const index = this.observers.indexOf(observer);

    if (index !== -1) {
      this.result = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .replaceAt */ .Rc)(this.result, index, result);
      this.notify();
    }
  }

  notify() {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_1__/* .notifyManager.batch */ .V.batch(() => {
      this.listeners.forEach(listener => {
        listener(this.result);
      });
    });
  }

}


//# sourceMappingURL=queriesObserver.mjs.map


/***/ }),

/***/ 9069:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "t": function() { return /* binding */ QueryCache; }
});

// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/utils.mjs
var utils = __webpack_require__(2161);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/logger.mjs
var logger = __webpack_require__(819);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/notifyManager.mjs
var notifyManager = __webpack_require__(81);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/retryer.mjs
var retryer = __webpack_require__(2379);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/removable.mjs
var removable = __webpack_require__(9643);
;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/lib/query.mjs






// CLASS
class Query extends removable/* Removable */.F {
  constructor(config) {
    super();
    this.abortSignalConsumed = false;
    this.defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.cache = config.cache;
    this.logger = config.logger || logger/* defaultLogger */._;
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.initialState = config.state || getDefaultState(this.options);
    this.state = this.initialState;
  }

  get meta() {
    return this.options.meta;
  }

  setOptions(options) {
    this.options = { ...this.defaultOptions,
      ...options
    };
    this.updateCacheTime(this.options.cacheTime);
  }

  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === 'idle') {
      this.cache.remove(this);
    }
  }

  setData(newData, options) {
    const data = (0,utils/* replaceData */.oE)(this.state.data, newData, this.options); // Set data and mark it as cached

    this.dispatch({
      data,
      type: 'success',
      dataUpdatedAt: options == null ? void 0 : options.updatedAt,
      manual: options == null ? void 0 : options.manual
    });
    return data;
  }

  setState(state, setStateOptions) {
    this.dispatch({
      type: 'setState',
      state,
      setStateOptions
    });
  }

  cancel(options) {
    var _this$retryer;

    const promise = this.promise;
    (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.cancel(options);
    return promise ? promise.then(utils/* noop */.ZT).catch(utils/* noop */.ZT) : Promise.resolve();
  }

  destroy() {
    super.destroy();
    this.cancel({
      silent: true
    });
  }

  reset() {
    this.destroy();
    this.setState(this.initialState);
  }

  isActive() {
    return this.observers.some(observer => observer.options.enabled !== false);
  }

  isDisabled() {
    return this.getObserversCount() > 0 && !this.isActive();
  }

  isStale() {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || this.observers.some(observer => observer.getCurrentResult().isStale);
  }

  isStaleByTime(staleTime = 0) {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || !(0,utils/* timeUntilStale */.Kp)(this.state.dataUpdatedAt, staleTime);
  }

  onFocus() {
    var _this$retryer2;

    const observer = this.observers.find(x => x.shouldFetchOnWindowFocus());

    if (observer) {
      observer.refetch({
        cancelRefetch: false
      });
    } // Continue fetch if currently paused


    (_this$retryer2 = this.retryer) == null ? void 0 : _this$retryer2.continue();
  }

  onOnline() {
    var _this$retryer3;

    const observer = this.observers.find(x => x.shouldFetchOnReconnect());

    if (observer) {
      observer.refetch({
        cancelRefetch: false
      });
    } // Continue fetch if currently paused


    (_this$retryer3 = this.retryer) == null ? void 0 : _this$retryer3.continue();
  }

  addObserver(observer) {
    if (this.observers.indexOf(observer) === -1) {
      this.observers.push(observer); // Stop the query from being garbage collected

      this.clearGcTimeout();
      this.cache.notify({
        type: 'observerAdded',
        query: this,
        observer
      });
    }
  }

  removeObserver(observer) {
    if (this.observers.indexOf(observer) !== -1) {
      this.observers = this.observers.filter(x => x !== observer);

      if (!this.observers.length) {
        // If the transport layer does not support cancellation
        // we'll let the query continue so the result can be cached
        if (this.retryer) {
          if (this.abortSignalConsumed) {
            this.retryer.cancel({
              revert: true
            });
          } else {
            this.retryer.cancelRetry();
          }
        }

        this.scheduleGc();
      }

      this.cache.notify({
        type: 'observerRemoved',
        query: this,
        observer
      });
    }
  }

  getObserversCount() {
    return this.observers.length;
  }

  invalidate() {
    if (!this.state.isInvalidated) {
      this.dispatch({
        type: 'invalidate'
      });
    }
  }

  fetch(options, fetchOptions) {
    var _this$options$behavio, _context$fetchOptions;

    if (this.state.fetchStatus !== 'idle') {
      if (this.state.dataUpdatedAt && fetchOptions != null && fetchOptions.cancelRefetch) {
        // Silently cancel current fetch if the user wants to cancel refetches
        this.cancel({
          silent: true
        });
      } else if (this.promise) {
        var _this$retryer4;

        // make sure that retries that were potentially cancelled due to unmounts can continue
        (_this$retryer4 = this.retryer) == null ? void 0 : _this$retryer4.continueRetry(); // Return current promise if we are already fetching

        return this.promise;
      }
    } // Update config if passed, otherwise the config from the last execution is used


    if (options) {
      this.setOptions(options);
    } // Use the options from the first observer with a query function if no function is found.
    // This can happen when the query is hydrated or created with setQueryData.


    if (!this.options.queryFn) {
      const observer = this.observers.find(x => x.options.queryFn);

      if (observer) {
        this.setOptions(observer.options);
      }
    }

    if (!Array.isArray(this.options.queryKey)) {
      if (false) {}
    }

    const abortController = (0,utils/* getAbortController */.G9)(); // Create query function context

    const queryFnContext = {
      queryKey: this.queryKey,
      pageParam: undefined,
      meta: this.meta
    }; // Adds an enumerable signal property to the object that
    // which sets abortSignalConsumed to true when the signal
    // is read.

    const addSignalProperty = object => {
      Object.defineProperty(object, 'signal', {
        enumerable: true,
        get: () => {
          if (abortController) {
            this.abortSignalConsumed = true;
            return abortController.signal;
          }

          return undefined;
        }
      });
    };

    addSignalProperty(queryFnContext); // Create fetch function

    const fetchFn = () => {
      if (!this.options.queryFn) {
        return Promise.reject('Missing queryFn');
      }

      this.abortSignalConsumed = false;
      return this.options.queryFn(queryFnContext);
    }; // Trigger behavior hook


    const context = {
      fetchOptions,
      options: this.options,
      queryKey: this.queryKey,
      state: this.state,
      fetchFn
    };
    addSignalProperty(context);
    (_this$options$behavio = this.options.behavior) == null ? void 0 : _this$options$behavio.onFetch(context); // Store state in case the current fetch needs to be reverted

    this.revertState = this.state; // Set to fetching state if not already in it

    if (this.state.fetchStatus === 'idle' || this.state.fetchMeta !== ((_context$fetchOptions = context.fetchOptions) == null ? void 0 : _context$fetchOptions.meta)) {
      var _context$fetchOptions2;

      this.dispatch({
        type: 'fetch',
        meta: (_context$fetchOptions2 = context.fetchOptions) == null ? void 0 : _context$fetchOptions2.meta
      });
    }

    const onError = error => {
      // Optimistically update state if needed
      if (!((0,retryer/* isCancelledError */.DV)(error) && error.silent)) {
        this.dispatch({
          type: 'error',
          error: error
        });
      }

      if (!(0,retryer/* isCancelledError */.DV)(error)) {
        var _this$cache$config$on, _this$cache$config;

        // Notify cache callback
        (_this$cache$config$on = (_this$cache$config = this.cache.config).onError) == null ? void 0 : _this$cache$config$on.call(_this$cache$config, error, this);

        if (false) {}
      }

      if (!this.isFetchingOptimistic) {
        // Schedule query gc after fetching
        this.scheduleGc();
      }

      this.isFetchingOptimistic = false;
    }; // Try to fetch the data


    this.retryer = (0,retryer/* createRetryer */.Mz)({
      fn: context.fetchFn,
      abort: abortController == null ? void 0 : abortController.abort.bind(abortController),
      onSuccess: data => {
        var _this$cache$config$on2, _this$cache$config2;

        if (typeof data === 'undefined') {
          if (false) {}

          onError(new Error('undefined'));
          return;
        }

        this.setData(data); // Notify cache callback

        (_this$cache$config$on2 = (_this$cache$config2 = this.cache.config).onSuccess) == null ? void 0 : _this$cache$config$on2.call(_this$cache$config2, data, this);

        if (!this.isFetchingOptimistic) {
          // Schedule query gc after fetching
          this.scheduleGc();
        }

        this.isFetchingOptimistic = false;
      },
      onError,
      onFail: (failureCount, error) => {
        this.dispatch({
          type: 'failed',
          failureCount,
          error
        });
      },
      onPause: () => {
        this.dispatch({
          type: 'pause'
        });
      },
      onContinue: () => {
        this.dispatch({
          type: 'continue'
        });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode
    });
    this.promise = this.retryer.promise;
    return this.promise;
  }

  dispatch(action) {
    const reducer = state => {
      var _action$meta, _action$dataUpdatedAt;

      switch (action.type) {
        case 'failed':
          return { ...state,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };

        case 'pause':
          return { ...state,
            fetchStatus: 'paused'
          };

        case 'continue':
          return { ...state,
            fetchStatus: 'fetching'
          };

        case 'fetch':
          return { ...state,
            fetchFailureCount: 0,
            fetchFailureReason: null,
            fetchMeta: (_action$meta = action.meta) != null ? _action$meta : null,
            fetchStatus: (0,retryer/* canFetch */.Kw)(this.options.networkMode) ? 'fetching' : 'paused',
            ...(!state.dataUpdatedAt && {
              error: null,
              status: 'loading'
            })
          };

        case 'success':
          return { ...state,
            data: action.data,
            dataUpdateCount: state.dataUpdateCount + 1,
            dataUpdatedAt: (_action$dataUpdatedAt = action.dataUpdatedAt) != null ? _action$dataUpdatedAt : Date.now(),
            error: null,
            isInvalidated: false,
            status: 'success',
            ...(!action.manual && {
              fetchStatus: 'idle',
              fetchFailureCount: 0,
              fetchFailureReason: null
            })
          };

        case 'error':
          const error = action.error;

          if ((0,retryer/* isCancelledError */.DV)(error) && error.revert && this.revertState) {
            return { ...this.revertState
            };
          }

          return { ...state,
            error: error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: 'idle',
            status: 'error'
          };

        case 'invalidate':
          return { ...state,
            isInvalidated: true
          };

        case 'setState':
          return { ...state,
            ...action.state
          };
      }
    };

    this.state = reducer(this.state);
    notifyManager/* notifyManager.batch */.V.batch(() => {
      this.observers.forEach(observer => {
        observer.onQueryUpdate(action);
      });
      this.cache.notify({
        query: this,
        type: 'updated',
        action
      });
    });
  }

}

function getDefaultState(options) {
  const data = typeof options.initialData === 'function' ? options.initialData() : options.initialData;
  const hasData = typeof data !== 'undefined';
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === 'function' ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt != null ? initialDataUpdatedAt : Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? 'success' : 'loading',
    fetchStatus: 'idle'
  };
}


//# sourceMappingURL=query.mjs.map

// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/subscribable.mjs
var subscribable = __webpack_require__(3989);
;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/lib/queryCache.mjs





// CLASS
class QueryCache extends subscribable/* Subscribable */.l {
  constructor(config) {
    super();
    this.config = config || {};
    this.queries = [];
    this.queriesMap = {};
  }

  build(client, options, state) {
    var _options$queryHash;

    const queryKey = options.queryKey;
    const queryHash = (_options$queryHash = options.queryHash) != null ? _options$queryHash : (0,utils/* hashQueryKeyByOptions */.Rm)(queryKey, options);
    let query = this.get(queryHash);

    if (!query) {
      query = new Query({
        cache: this,
        logger: client.getLogger(),
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }

    return query;
  }

  add(query) {
    if (!this.queriesMap[query.queryHash]) {
      this.queriesMap[query.queryHash] = query;
      this.queries.push(query);
      this.notify({
        type: 'added',
        query
      });
    }
  }

  remove(query) {
    const queryInMap = this.queriesMap[query.queryHash];

    if (queryInMap) {
      query.destroy();
      this.queries = this.queries.filter(x => x !== query);

      if (queryInMap === query) {
        delete this.queriesMap[query.queryHash];
      }

      this.notify({
        type: 'removed',
        query
      });
    }
  }

  clear() {
    notifyManager/* notifyManager.batch */.V.batch(() => {
      this.queries.forEach(query => {
        this.remove(query);
      });
    });
  }

  get(queryHash) {
    return this.queriesMap[queryHash];
  }

  getAll() {
    return this.queries;
  }

  find(arg1, arg2) {
    const [filters] = (0,utils/* parseFilterArgs */.I6)(arg1, arg2);

    if (typeof filters.exact === 'undefined') {
      filters.exact = true;
    }

    return this.queries.find(query => (0,utils/* matchQuery */._x)(filters, query));
  }

  findAll(arg1, arg2) {
    const [filters] = (0,utils/* parseFilterArgs */.I6)(arg1, arg2);
    return Object.keys(filters).length > 0 ? this.queries.filter(query => (0,utils/* matchQuery */._x)(filters, query)) : this.queries;
  }

  notify(event) {
    notifyManager/* notifyManager.batch */.V.batch(() => {
      this.listeners.forEach(listener => {
        listener(event);
      });
    });
  }

  onFocus() {
    notifyManager/* notifyManager.batch */.V.batch(() => {
      this.queries.forEach(query => {
        query.onFocus();
      });
    });
  }

  onOnline() {
    notifyManager/* notifyManager.batch */.V.batch(() => {
      this.queries.forEach(query => {
        query.onOnline();
      });
    });
  }

}


//# sourceMappingURL=queryCache.mjs.map


/***/ }),

/***/ 8758:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S": function() { return /* binding */ QueryClient; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2161);
/* harmony import */ var _queryCache_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9069);
/* harmony import */ var _mutationCache_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8593);
/* harmony import */ var _focusManager_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5761);
/* harmony import */ var _onlineManager_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6474);
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(81);
/* harmony import */ var _infiniteQueryBehavior_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9499);
/* harmony import */ var _logger_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(819);









// CLASS
class QueryClient {
  constructor(config = {}) {
    this.queryCache = config.queryCache || new _queryCache_mjs__WEBPACK_IMPORTED_MODULE_0__/* .QueryCache */ .t();
    this.mutationCache = config.mutationCache || new _mutationCache_mjs__WEBPACK_IMPORTED_MODULE_1__/* .MutationCache */ .L();
    this.logger = config.logger || _logger_mjs__WEBPACK_IMPORTED_MODULE_2__/* .defaultLogger */ ._;
    this.defaultOptions = config.defaultOptions || {};
    this.queryDefaults = [];
    this.mutationDefaults = [];
    this.mountCount = 0;

    if (false) {}
  }

  mount() {
    this.mountCount++;
    if (this.mountCount !== 1) return;
    this.unsubscribeFocus = _focusManager_mjs__WEBPACK_IMPORTED_MODULE_3__/* .focusManager.subscribe */ .j.subscribe(() => {
      if (_focusManager_mjs__WEBPACK_IMPORTED_MODULE_3__/* .focusManager.isFocused */ .j.isFocused()) {
        this.resumePausedMutations();
        this.queryCache.onFocus();
      }
    });
    this.unsubscribeOnline = _onlineManager_mjs__WEBPACK_IMPORTED_MODULE_4__/* .onlineManager.subscribe */ .N.subscribe(() => {
      if (_onlineManager_mjs__WEBPACK_IMPORTED_MODULE_4__/* .onlineManager.isOnline */ .N.isOnline()) {
        this.resumePausedMutations();
        this.queryCache.onOnline();
      }
    });
  }

  unmount() {
    var _this$unsubscribeFocu, _this$unsubscribeOnli;

    this.mountCount--;
    if (this.mountCount !== 0) return;
    (_this$unsubscribeFocu = this.unsubscribeFocus) == null ? void 0 : _this$unsubscribeFocu.call(this);
    this.unsubscribeFocus = undefined;
    (_this$unsubscribeOnli = this.unsubscribeOnline) == null ? void 0 : _this$unsubscribeOnli.call(this);
    this.unsubscribeOnline = undefined;
  }

  isFetching(arg1, arg2) {
    const [filters] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2);
    filters.fetchStatus = 'fetching';
    return this.queryCache.findAll(filters).length;
  }

  isMutating(filters) {
    return this.mutationCache.findAll({ ...filters,
      fetching: true
    }).length;
  }

  getQueryData(queryKey, filters) {
    var _this$queryCache$find;

    return (_this$queryCache$find = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find.state.data;
  }

  ensureQueryData(arg1, arg2, arg3) {
    const parsedOptions = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseQueryArgs */ ._v)(arg1, arg2, arg3);
    const cachedData = this.getQueryData(parsedOptions.queryKey);
    return cachedData ? Promise.resolve(cachedData) : this.fetchQuery(parsedOptions);
  }

  getQueriesData(queryKeyOrFilters) {
    return this.getQueryCache().findAll(queryKeyOrFilters).map(({
      queryKey,
      state
    }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }

  setQueryData(queryKey, updater, options) {
    const query = this.queryCache.find(queryKey);
    const prevData = query == null ? void 0 : query.state.data;
    const data = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .functionalUpdate */ .SE)(updater, prevData);

    if (typeof data === 'undefined') {
      return undefined;
    }

    const parsedOptions = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseQueryArgs */ ._v)(queryKey);
    const defaultedOptions = this.defaultQueryOptions(parsedOptions);
    return this.queryCache.build(this, defaultedOptions).setData(data, { ...options,
      manual: true
    });
  }

  setQueriesData(queryKeyOrFilters, updater, options) {
    return _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager.batch */ .V.batch(() => this.getQueryCache().findAll(queryKeyOrFilters).map(({
      queryKey
    }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
  }

  getQueryState(queryKey, filters) {
    var _this$queryCache$find2;

    return (_this$queryCache$find2 = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find2.state;
  }

  removeQueries(arg1, arg2) {
    const [filters] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2);
    const queryCache = this.queryCache;
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager.batch */ .V.batch(() => {
      queryCache.findAll(filters).forEach(query => {
        queryCache.remove(query);
      });
    });
  }

  resetQueries(arg1, arg2, arg3) {
    const [filters, options] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2, arg3);
    const queryCache = this.queryCache;
    const refetchFilters = {
      type: 'active',
      ...filters
    };
    return _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager.batch */ .V.batch(() => {
      queryCache.findAll(filters).forEach(query => {
        query.reset();
      });
      return this.refetchQueries(refetchFilters, options);
    });
  }

  cancelQueries(arg1, arg2, arg3) {
    const [filters, cancelOptions = {}] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2, arg3);

    if (typeof cancelOptions.revert === 'undefined') {
      cancelOptions.revert = true;
    }

    const promises = _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager.batch */ .V.batch(() => this.queryCache.findAll(filters).map(query => query.cancel(cancelOptions)));
    return Promise.all(promises).then(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT).catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT);
  }

  invalidateQueries(arg1, arg2, arg3) {
    const [filters, options] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2, arg3);
    return _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager.batch */ .V.batch(() => {
      var _ref, _filters$refetchType;

      this.queryCache.findAll(filters).forEach(query => {
        query.invalidate();
      });

      if (filters.refetchType === 'none') {
        return Promise.resolve();
      }

      const refetchFilters = { ...filters,
        type: (_ref = (_filters$refetchType = filters.refetchType) != null ? _filters$refetchType : filters.type) != null ? _ref : 'active'
      };
      return this.refetchQueries(refetchFilters, options);
    });
  }

  refetchQueries(arg1, arg2, arg3) {
    const [filters, options] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2, arg3);
    const promises = _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager.batch */ .V.batch(() => this.queryCache.findAll(filters).filter(query => !query.isDisabled()).map(query => {
      var _options$cancelRefetc;

      return query.fetch(undefined, { ...options,
        cancelRefetch: (_options$cancelRefetc = options == null ? void 0 : options.cancelRefetch) != null ? _options$cancelRefetc : true,
        meta: {
          refetchPage: filters.refetchPage
        }
      });
    }));
    let promise = Promise.all(promises).then(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT);

    if (!(options != null && options.throwOnError)) {
      promise = promise.catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT);
    }

    return promise;
  }

  fetchQuery(arg1, arg2, arg3) {
    const parsedOptions = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseQueryArgs */ ._v)(arg1, arg2, arg3);
    const defaultedOptions = this.defaultQueryOptions(parsedOptions); // https://github.com/tannerlinsley/react-query/issues/652

    if (typeof defaultedOptions.retry === 'undefined') {
      defaultedOptions.retry = false;
    }

    const query = this.queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(defaultedOptions.staleTime) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }

  prefetchQuery(arg1, arg2, arg3) {
    return this.fetchQuery(arg1, arg2, arg3).then(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT).catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT);
  }

  fetchInfiniteQuery(arg1, arg2, arg3) {
    const parsedOptions = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseQueryArgs */ ._v)(arg1, arg2, arg3);
    parsedOptions.behavior = (0,_infiniteQueryBehavior_mjs__WEBPACK_IMPORTED_MODULE_7__/* .infiniteQueryBehavior */ .Gm)();
    return this.fetchQuery(parsedOptions);
  }

  prefetchInfiniteQuery(arg1, arg2, arg3) {
    return this.fetchInfiniteQuery(arg1, arg2, arg3).then(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT).catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT);
  }

  resumePausedMutations() {
    return this.mutationCache.resumePausedMutations();
  }

  getQueryCache() {
    return this.queryCache;
  }

  getMutationCache() {
    return this.mutationCache;
  }

  getLogger() {
    return this.logger;
  }

  getDefaultOptions() {
    return this.defaultOptions;
  }

  setDefaultOptions(options) {
    this.defaultOptions = options;
  }

  setQueryDefaults(queryKey, options) {
    const result = this.queryDefaults.find(x => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .hashQueryKey */ .yF)(queryKey) === (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .hashQueryKey */ .yF)(x.queryKey));

    if (result) {
      result.defaultOptions = options;
    } else {
      this.queryDefaults.push({
        queryKey,
        defaultOptions: options
      });
    }
  }

  getQueryDefaults(queryKey) {
    if (!queryKey) {
      return undefined;
    } // Get the first matching defaults


    const firstMatchingDefaults = this.queryDefaults.find(x => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .partialMatchKey */ .to)(queryKey, x.queryKey)); // Additional checks and error in dev mode

    if (false) {}

    return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
  }

  setMutationDefaults(mutationKey, options) {
    const result = this.mutationDefaults.find(x => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .hashQueryKey */ .yF)(mutationKey) === (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .hashQueryKey */ .yF)(x.mutationKey));

    if (result) {
      result.defaultOptions = options;
    } else {
      this.mutationDefaults.push({
        mutationKey,
        defaultOptions: options
      });
    }
  }

  getMutationDefaults(mutationKey) {
    if (!mutationKey) {
      return undefined;
    } // Get the first matching defaults


    const firstMatchingDefaults = this.mutationDefaults.find(x => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .partialMatchKey */ .to)(mutationKey, x.mutationKey)); // Additional checks and error in dev mode

    if (false) {}

    return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
  }

  defaultQueryOptions(options) {
    if (options != null && options._defaulted) {
      return options;
    }

    const defaultedOptions = { ...this.defaultOptions.queries,
      ...this.getQueryDefaults(options == null ? void 0 : options.queryKey),
      ...options,
      _defaulted: true
    };

    if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
      defaultedOptions.queryHash = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .hashQueryKeyByOptions */ .Rm)(defaultedOptions.queryKey, defaultedOptions);
    } // dependent default values


    if (typeof defaultedOptions.refetchOnReconnect === 'undefined') {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== 'always';
    }

    if (typeof defaultedOptions.useErrorBoundary === 'undefined') {
      defaultedOptions.useErrorBoundary = !!defaultedOptions.suspense;
    }

    return defaultedOptions;
  }

  defaultMutationOptions(options) {
    if (options != null && options._defaulted) {
      return options;
    }

    return { ...this.defaultOptions.mutations,
      ...this.getMutationDefaults(options == null ? void 0 : options.mutationKey),
      ...options,
      _defaulted: true
    };
  }

  clear() {
    this.queryCache.clear();
    this.mutationCache.clear();
  }

}


//# sourceMappingURL=queryClient.mjs.map


/***/ }),

/***/ 2924:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "z": function() { return /* binding */ QueryObserver; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2161);
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(81);
/* harmony import */ var _focusManager_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5761);
/* harmony import */ var _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3989);
/* harmony import */ var _retryer_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2379);






class QueryObserver extends _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor(client, options) {
    super();
    this.client = client;
    this.options = options;
    this.trackedProps = new Set();
    this.selectError = null;
    this.bindMethods();
    this.setOptions(options);
  }

  bindMethods() {
    this.remove = this.remove.bind(this);
    this.refetch = this.refetch.bind(this);
  }

  onSubscribe() {
    if (this.listeners.length === 1) {
      this.currentQuery.addObserver(this);

      if (shouldFetchOnMount(this.currentQuery, this.options)) {
        this.executeFetch();
      }

      this.updateTimers();
    }
  }

  onUnsubscribe() {
    if (!this.listeners.length) {
      this.destroy();
    }
  }

  shouldFetchOnReconnect() {
    return shouldFetchOn(this.currentQuery, this.options, this.options.refetchOnReconnect);
  }

  shouldFetchOnWindowFocus() {
    return shouldFetchOn(this.currentQuery, this.options, this.options.refetchOnWindowFocus);
  }

  destroy() {
    this.listeners = [];
    this.clearStaleTimeout();
    this.clearRefetchInterval();
    this.currentQuery.removeObserver(this);
  }

  setOptions(options, notifyOptions) {
    const prevOptions = this.options;
    const prevQuery = this.currentQuery;
    this.options = this.client.defaultQueryOptions(options);

    if (false) {}

    if (!(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .shallowEqualObjects */ .VS)(prevOptions, this.options)) {
      this.client.getQueryCache().notify({
        type: 'observerOptionsUpdated',
        query: this.currentQuery,
        observer: this
      });
    }

    if (typeof this.options.enabled !== 'undefined' && typeof this.options.enabled !== 'boolean') {
      throw new Error('Expected enabled to be a boolean');
    } // Keep previous query key if the user does not supply one


    if (!this.options.queryKey) {
      this.options.queryKey = prevOptions.queryKey;
    }

    this.updateQuery();
    const mounted = this.hasListeners(); // Fetch if there are subscribers

    if (mounted && shouldFetchOptionally(this.currentQuery, prevQuery, this.options, prevOptions)) {
      this.executeFetch();
    } // Update result


    this.updateResult(notifyOptions); // Update stale interval if needed

    if (mounted && (this.currentQuery !== prevQuery || this.options.enabled !== prevOptions.enabled || this.options.staleTime !== prevOptions.staleTime)) {
      this.updateStaleTimeout();
    }

    const nextRefetchInterval = this.computeRefetchInterval(); // Update refetch interval if needed

    if (mounted && (this.currentQuery !== prevQuery || this.options.enabled !== prevOptions.enabled || nextRefetchInterval !== this.currentRefetchInterval)) {
      this.updateRefetchInterval(nextRefetchInterval);
    }
  }

  getOptimisticResult(options) {
    const query = this.client.getQueryCache().build(this.client, options);
    return this.createResult(query, options);
  }

  getCurrentResult() {
    return this.currentResult;
  }

  trackResult(result) {
    const trackedResult = {};
    Object.keys(result).forEach(key => {
      Object.defineProperty(trackedResult, key, {
        configurable: false,
        enumerable: true,
        get: () => {
          this.trackedProps.add(key);
          return result[key];
        }
      });
    });
    return trackedResult;
  }

  getCurrentQuery() {
    return this.currentQuery;
  }

  remove() {
    this.client.getQueryCache().remove(this.currentQuery);
  }

  refetch({
    refetchPage,
    ...options
  } = {}) {
    return this.fetch({ ...options,
      meta: {
        refetchPage
      }
    });
  }

  fetchOptimistic(options) {
    const defaultedOptions = this.client.defaultQueryOptions(options);
    const query = this.client.getQueryCache().build(this.client, defaultedOptions);
    query.isFetchingOptimistic = true;
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }

  fetch(fetchOptions) {
    var _fetchOptions$cancelR;

    return this.executeFetch({ ...fetchOptions,
      cancelRefetch: (_fetchOptions$cancelR = fetchOptions.cancelRefetch) != null ? _fetchOptions$cancelR : true
    }).then(() => {
      this.updateResult();
      return this.currentResult;
    });
  }

  executeFetch(fetchOptions) {
    // Make sure we reference the latest query as the current one might have been removed
    this.updateQuery(); // Fetch

    let promise = this.currentQuery.fetch(this.options, fetchOptions);

    if (!(fetchOptions != null && fetchOptions.throwOnError)) {
      promise = promise.catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .noop */ .ZT);
    }

    return promise;
  }

  updateStaleTimeout() {
    this.clearStaleTimeout();

    if (_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk || this.currentResult.isStale || !(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isValidTimeout */ .PN)(this.options.staleTime)) {
      return;
    }

    const time = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .timeUntilStale */ .Kp)(this.currentResult.dataUpdatedAt, this.options.staleTime); // The timeout is sometimes triggered 1 ms before the stale time expiration.
    // To mitigate this issue we always add 1 ms to the timeout.

    const timeout = time + 1;
    this.staleTimeoutId = setTimeout(() => {
      if (!this.currentResult.isStale) {
        this.updateResult();
      }
    }, timeout);
  }

  computeRefetchInterval() {
    var _this$options$refetch;

    return typeof this.options.refetchInterval === 'function' ? this.options.refetchInterval(this.currentResult.data, this.currentQuery) : (_this$options$refetch = this.options.refetchInterval) != null ? _this$options$refetch : false;
  }

  updateRefetchInterval(nextInterval) {
    this.clearRefetchInterval();
    this.currentRefetchInterval = nextInterval;

    if (_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk || this.options.enabled === false || !(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isValidTimeout */ .PN)(this.currentRefetchInterval) || this.currentRefetchInterval === 0) {
      return;
    }

    this.refetchIntervalId = setInterval(() => {
      if (this.options.refetchIntervalInBackground || _focusManager_mjs__WEBPACK_IMPORTED_MODULE_2__/* .focusManager.isFocused */ .j.isFocused()) {
        this.executeFetch();
      }
    }, this.currentRefetchInterval);
  }

  updateTimers() {
    this.updateStaleTimeout();
    this.updateRefetchInterval(this.computeRefetchInterval());
  }

  clearStaleTimeout() {
    if (this.staleTimeoutId) {
      clearTimeout(this.staleTimeoutId);
      this.staleTimeoutId = undefined;
    }
  }

  clearRefetchInterval() {
    if (this.refetchIntervalId) {
      clearInterval(this.refetchIntervalId);
      this.refetchIntervalId = undefined;
    }
  }

  createResult(query, options) {
    const prevQuery = this.currentQuery;
    const prevOptions = this.options;
    const prevResult = this.currentResult;
    const prevResultState = this.currentResultState;
    const prevResultOptions = this.currentResultOptions;
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : this.currentQueryInitialState;
    const prevQueryResult = queryChange ? this.currentResult : this.previousQueryResult;
    const {
      state
    } = query;
    let {
      dataUpdatedAt,
      error,
      errorUpdatedAt,
      fetchStatus,
      status
    } = state;
    let isPreviousData = false;
    let isPlaceholderData = false;
    let data; // Optimistically set result in fetching state if needed

    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);

      if (fetchOnMount || fetchOptionally) {
        fetchStatus = (0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_3__/* .canFetch */ .Kw)(query.options.networkMode) ? 'fetching' : 'paused';

        if (!dataUpdatedAt) {
          status = 'loading';
        }
      }

      if (options._optimisticResults === 'isRestoring') {
        fetchStatus = 'idle';
      }
    } // Keep previous data if needed


    if (options.keepPreviousData && !state.dataUpdatedAt && prevQueryResult != null && prevQueryResult.isSuccess && status !== 'error') {
      data = prevQueryResult.data;
      dataUpdatedAt = prevQueryResult.dataUpdatedAt;
      status = prevQueryResult.status;
      isPreviousData = true;
    } // Select data if needed
    else if (options.select && typeof state.data !== 'undefined') {
      // Memoize select result
      if (prevResult && state.data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === this.selectFn) {
        data = this.selectResult;
      } else {
        try {
          this.selectFn = options.select;
          data = options.select(state.data);
          data = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .replaceData */ .oE)(prevResult == null ? void 0 : prevResult.data, data, options);
          this.selectResult = data;
          this.selectError = null;
        } catch (selectError) {
          if (false) {}

          this.selectError = selectError;
        }
      }
    } // Use query data
    else {
      data = state.data;
    } // Show placeholder data if needed


    if (typeof options.placeholderData !== 'undefined' && typeof data === 'undefined' && status === 'loading') {
      let placeholderData; // Memoize placeholder data

      if (prevResult != null && prevResult.isPlaceholderData && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
      } else {
        placeholderData = typeof options.placeholderData === 'function' ? options.placeholderData() : options.placeholderData;

        if (options.select && typeof placeholderData !== 'undefined') {
          try {
            placeholderData = options.select(placeholderData);
            this.selectError = null;
          } catch (selectError) {
            if (false) {}

            this.selectError = selectError;
          }
        }
      }

      if (typeof placeholderData !== 'undefined') {
        status = 'success';
        data = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .replaceData */ .oE)(prevResult == null ? void 0 : prevResult.data, placeholderData, options);
        isPlaceholderData = true;
      }
    }

    if (this.selectError) {
      error = this.selectError;
      data = this.selectResult;
      errorUpdatedAt = Date.now();
      status = 'error';
    }

    const isFetching = fetchStatus === 'fetching';
    const isLoading = status === 'loading';
    const isError = status === 'error';
    const result = {
      status,
      fetchStatus,
      isLoading,
      isSuccess: status === 'success',
      isError,
      isInitialLoading: isLoading && isFetching,
      data,
      dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: state.fetchFailureCount,
      failureReason: state.fetchFailureReason,
      errorUpdateCount: state.errorUpdateCount,
      isFetched: state.dataUpdateCount > 0 || state.errorUpdateCount > 0,
      isFetchedAfterMount: state.dataUpdateCount > queryInitialState.dataUpdateCount || state.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isLoading,
      isLoadingError: isError && state.dataUpdatedAt === 0,
      isPaused: fetchStatus === 'paused',
      isPlaceholderData,
      isPreviousData,
      isRefetchError: isError && state.dataUpdatedAt !== 0,
      isStale: isStale(query, options),
      refetch: this.refetch,
      remove: this.remove
    };
    return result;
  }

  updateResult(notifyOptions) {
    const prevResult = this.currentResult;
    const nextResult = this.createResult(this.currentQuery, this.options);
    this.currentResultState = this.currentQuery.state;
    this.currentResultOptions = this.options; // Only notify and update result if something has changed

    if ((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .shallowEqualObjects */ .VS)(nextResult, prevResult)) {
      return;
    }

    this.currentResult = nextResult; // Determine which callbacks to trigger

    const defaultNotifyOptions = {
      cache: true
    };

    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }

      const {
        notifyOnChangeProps
      } = this.options;

      if (notifyOnChangeProps === 'all' || !notifyOnChangeProps && !this.trackedProps.size) {
        return true;
      }

      const includedProps = new Set(notifyOnChangeProps != null ? notifyOnChangeProps : this.trackedProps);

      if (this.options.useErrorBoundary) {
        includedProps.add('error');
      }

      return Object.keys(this.currentResult).some(key => {
        const typedKey = key;
        const changed = this.currentResult[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };

    if ((notifyOptions == null ? void 0 : notifyOptions.listeners) !== false && shouldNotifyListeners()) {
      defaultNotifyOptions.listeners = true;
    }

    this.notify({ ...defaultNotifyOptions,
      ...notifyOptions
    });
  }

  updateQuery() {
    const query = this.client.getQueryCache().build(this.client, this.options);

    if (query === this.currentQuery) {
      return;
    }

    const prevQuery = this.currentQuery;
    this.currentQuery = query;
    this.currentQueryInitialState = query.state;
    this.previousQueryResult = this.currentResult;

    if (this.hasListeners()) {
      prevQuery == null ? void 0 : prevQuery.removeObserver(this);
      query.addObserver(this);
    }
  }

  onQueryUpdate(action) {
    const notifyOptions = {};

    if (action.type === 'success') {
      notifyOptions.onSuccess = !action.manual;
    } else if (action.type === 'error' && !(0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_3__/* .isCancelledError */ .DV)(action.error)) {
      notifyOptions.onError = true;
    }

    this.updateResult(notifyOptions);

    if (this.hasListeners()) {
      this.updateTimers();
    }
  }

  notify(notifyOptions) {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager.batch */ .V.batch(() => {
      // First trigger the configuration callbacks
      if (notifyOptions.onSuccess) {
        var _this$options$onSucce, _this$options, _this$options$onSettl, _this$options2;

        (_this$options$onSucce = (_this$options = this.options).onSuccess) == null ? void 0 : _this$options$onSucce.call(_this$options, this.currentResult.data);
        (_this$options$onSettl = (_this$options2 = this.options).onSettled) == null ? void 0 : _this$options$onSettl.call(_this$options2, this.currentResult.data, null);
      } else if (notifyOptions.onError) {
        var _this$options$onError, _this$options3, _this$options$onSettl2, _this$options4;

        (_this$options$onError = (_this$options3 = this.options).onError) == null ? void 0 : _this$options$onError.call(_this$options3, this.currentResult.error);
        (_this$options$onSettl2 = (_this$options4 = this.options).onSettled) == null ? void 0 : _this$options$onSettl2.call(_this$options4, undefined, this.currentResult.error);
      } // Then trigger the listeners


      if (notifyOptions.listeners) {
        this.listeners.forEach(listener => {
          listener(this.currentResult);
        });
      } // Then the cache listeners


      if (notifyOptions.cache) {
        this.client.getQueryCache().notify({
          query: this.currentQuery,
          type: 'observerResultsUpdated'
        });
      }
    });
  }

}

function shouldLoadOnMount(query, options) {
  return options.enabled !== false && !query.state.dataUpdatedAt && !(query.state.status === 'error' && options.retryOnMount === false);
}

function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.dataUpdatedAt > 0 && shouldFetchOn(query, options, options.refetchOnMount);
}

function shouldFetchOn(query, options, field) {
  if (options.enabled !== false) {
    const value = typeof field === 'function' ? field(query) : field;
    return value === 'always' || value !== false && isStale(query, options);
  }

  return false;
}

function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return options.enabled !== false && (query !== prevQuery || prevOptions.enabled === false) && (!options.suspense || query.state.status !== 'error') && isStale(query, options);
}

function isStale(query, options) {
  return query.isStaleByTime(options.staleTime);
}


//# sourceMappingURL=queryObserver.mjs.map


/***/ }),

/***/ 9643:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "F": function() { return /* binding */ Removable; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2161);


class Removable {
  destroy() {
    this.clearGcTimeout();
  }

  scheduleGc() {
    this.clearGcTimeout();

    if ((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isValidTimeout */ .PN)(this.cacheTime)) {
      this.gcTimeout = setTimeout(() => {
        this.optionalRemove();
      }, this.cacheTime);
    }
  }

  updateCacheTime(newCacheTime) {
    // Default to 5 minutes (Infinity for server-side) if no cache time is set
    this.cacheTime = Math.max(this.cacheTime || 0, newCacheTime != null ? newCacheTime : _utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isServer */ .sk ? Infinity : 5 * 60 * 1000);
  }

  clearGcTimeout() {
    if (this.gcTimeout) {
      clearTimeout(this.gcTimeout);
      this.gcTimeout = undefined;
    }
  }

}


//# sourceMappingURL=removable.mjs.map


/***/ }),

/***/ 2379:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DV": function() { return /* binding */ isCancelledError; },
/* harmony export */   "Kw": function() { return /* binding */ canFetch; },
/* harmony export */   "Mz": function() { return /* binding */ createRetryer; },
/* harmony export */   "p8": function() { return /* binding */ CancelledError; }
/* harmony export */ });
/* harmony import */ var _focusManager_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5761);
/* harmony import */ var _onlineManager_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6474);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2161);




function defaultRetryDelay(failureCount) {
  return Math.min(1000 * 2 ** failureCount, 30000);
}

function canFetch(networkMode) {
  return (networkMode != null ? networkMode : 'online') === 'online' ? _onlineManager_mjs__WEBPACK_IMPORTED_MODULE_0__/* .onlineManager.isOnline */ .N.isOnline() : true;
}
class CancelledError {
  constructor(options) {
    this.revert = options == null ? void 0 : options.revert;
    this.silent = options == null ? void 0 : options.silent;
  }

}
function isCancelledError(value) {
  return value instanceof CancelledError;
}
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let isResolved = false;
  let continueFn;
  let promiseResolve;
  let promiseReject;
  const promise = new Promise((outerResolve, outerReject) => {
    promiseResolve = outerResolve;
    promiseReject = outerReject;
  });

  const cancel = cancelOptions => {
    if (!isResolved) {
      reject(new CancelledError(cancelOptions));
      config.abort == null ? void 0 : config.abort();
    }
  };

  const cancelRetry = () => {
    isRetryCancelled = true;
  };

  const continueRetry = () => {
    isRetryCancelled = false;
  };

  const shouldPause = () => !_focusManager_mjs__WEBPACK_IMPORTED_MODULE_1__/* .focusManager.isFocused */ .j.isFocused() || config.networkMode !== 'always' && !_onlineManager_mjs__WEBPACK_IMPORTED_MODULE_0__/* .onlineManager.isOnline */ .N.isOnline();

  const resolve = value => {
    if (!isResolved) {
      isResolved = true;
      config.onSuccess == null ? void 0 : config.onSuccess(value);
      continueFn == null ? void 0 : continueFn();
      promiseResolve(value);
    }
  };

  const reject = value => {
    if (!isResolved) {
      isResolved = true;
      config.onError == null ? void 0 : config.onError(value);
      continueFn == null ? void 0 : continueFn();
      promiseReject(value);
    }
  };

  const pause = () => {
    return new Promise(continueResolve => {
      continueFn = value => {
        if (isResolved || !shouldPause()) {
          return continueResolve(value);
        }
      };

      config.onPause == null ? void 0 : config.onPause();
    }).then(() => {
      continueFn = undefined;

      if (!isResolved) {
        config.onContinue == null ? void 0 : config.onContinue();
      }
    });
  }; // Create loop function


  const run = () => {
    // Do nothing if already resolved
    if (isResolved) {
      return;
    }

    let promiseOrValue; // Execute query

    try {
      promiseOrValue = config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }

    Promise.resolve(promiseOrValue).then(resolve).catch(error => {
      var _config$retry, _config$retryDelay;

      // Stop if the fetch is already resolved
      if (isResolved) {
        return;
      } // Do we need to retry the request?


      const retry = (_config$retry = config.retry) != null ? _config$retry : 3;
      const retryDelay = (_config$retryDelay = config.retryDelay) != null ? _config$retryDelay : defaultRetryDelay;
      const delay = typeof retryDelay === 'function' ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === 'number' && failureCount < retry || typeof retry === 'function' && retry(failureCount, error);

      if (isRetryCancelled || !shouldRetry) {
        // We are done if the query does not need to be retried
        reject(error);
        return;
      }

      failureCount++; // Notify on fail

      config.onFail == null ? void 0 : config.onFail(failureCount, error); // Delay

      (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .sleep */ .Gh)(delay) // Pause if the document is not visible or when the device is offline
      .then(() => {
        if (shouldPause()) {
          return pause();
        }

        return;
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  }; // Start loop


  if (canFetch(config.networkMode)) {
    run();
  } else {
    pause().then(run);
  }

  return {
    promise,
    cancel,
    continue: () => {
      continueFn == null ? void 0 : continueFn();
    },
    cancelRetry,
    continueRetry
  };
}


//# sourceMappingURL=retryer.mjs.map


/***/ }),

/***/ 3989:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "l": function() { return /* binding */ Subscribable; }
/* harmony export */ });
class Subscribable {
  constructor() {
    this.listeners = [];
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    this.onSubscribe();
    return () => {
      this.listeners = this.listeners.filter(x => x !== listener);
      this.onUnsubscribe();
    };
  }

  hasListeners() {
    return this.listeners.length > 0;
  }

  onSubscribe() {// Do nothing
  }

  onUnsubscribe() {// Do nothing
  }

}


//# sourceMappingURL=subscribable.mjs.map


/***/ }),

/***/ 2161:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A4": function() { return /* binding */ scheduleMicrotask; },
/* harmony export */   "G9": function() { return /* binding */ getAbortController; },
/* harmony export */   "Gh": function() { return /* binding */ sleep; },
/* harmony export */   "I6": function() { return /* binding */ parseFilterArgs; },
/* harmony export */   "Kp": function() { return /* binding */ timeUntilStale; },
/* harmony export */   "PN": function() { return /* binding */ isValidTimeout; },
/* harmony export */   "Q$": function() { return /* binding */ replaceEqualDeep; },
/* harmony export */   "Rc": function() { return /* binding */ replaceAt; },
/* harmony export */   "Rm": function() { return /* binding */ hashQueryKeyByOptions; },
/* harmony export */   "SE": function() { return /* binding */ functionalUpdate; },
/* harmony export */   "VS": function() { return /* binding */ shallowEqualObjects; },
/* harmony export */   "VZ": function() { return /* binding */ isError; },
/* harmony export */   "X7": function() { return /* binding */ matchMutation; },
/* harmony export */   "ZT": function() { return /* binding */ noop; },
/* harmony export */   "_v": function() { return /* binding */ parseQueryArgs; },
/* harmony export */   "_x": function() { return /* binding */ matchQuery; },
/* harmony export */   "cb": function() { return /* binding */ parseMutationFilterArgs; },
/* harmony export */   "e5": function() { return /* binding */ difference; },
/* harmony export */   "lV": function() { return /* binding */ parseMutationArgs; },
/* harmony export */   "oE": function() { return /* binding */ replaceData; },
/* harmony export */   "sk": function() { return /* binding */ isServer; },
/* harmony export */   "to": function() { return /* binding */ partialMatchKey; },
/* harmony export */   "yF": function() { return /* binding */ hashQueryKey; }
/* harmony export */ });
/* unused harmony exports isPlainArray, isPlainObject, isQueryKey, partialDeepEqual */
// TYPES
// UTILS
const isServer = typeof window === 'undefined' || 'Deno' in window;
function noop() {
  return undefined;
}
function functionalUpdate(updater, input) {
  return typeof updater === 'function' ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === 'number' && value >= 0 && value !== Infinity;
}
function difference(array1, array2) {
  return array1.filter(x => array2.indexOf(x) === -1);
}
function replaceAt(array, index, value) {
  const copy = array.slice(0);
  copy[index] = value;
  return copy;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function parseQueryArgs(arg1, arg2, arg3) {
  if (!isQueryKey(arg1)) {
    return arg1;
  }

  if (typeof arg2 === 'function') {
    return { ...arg3,
      queryKey: arg1,
      queryFn: arg2
    };
  }

  return { ...arg2,
    queryKey: arg1
  };
}
function parseMutationArgs(arg1, arg2, arg3) {
  if (isQueryKey(arg1)) {
    if (typeof arg2 === 'function') {
      return { ...arg3,
        mutationKey: arg1,
        mutationFn: arg2
      };
    }

    return { ...arg2,
      mutationKey: arg1
    };
  }

  if (typeof arg1 === 'function') {
    return { ...arg2,
      mutationFn: arg1
    };
  }

  return { ...arg1
  };
}
function parseFilterArgs(arg1, arg2, arg3) {
  return isQueryKey(arg1) ? [{ ...arg2,
    queryKey: arg1
  }, arg3] : [arg1 || {}, arg2];
}
function parseMutationFilterArgs(arg1, arg2, arg3) {
  return isQueryKey(arg1) ? [{ ...arg2,
    mutationKey: arg1
  }, arg3] : [arg1 || {}, arg2];
}
function matchQuery(filters, query) {
  const {
    type = 'all',
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;

  if (isQueryKey(queryKey)) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }

  if (type !== 'all') {
    const isActive = query.isActive();

    if (type === 'active' && !isActive) {
      return false;
    }

    if (type === 'inactive' && isActive) {
      return false;
    }
  }

  if (typeof stale === 'boolean' && query.isStale() !== stale) {
    return false;
  }

  if (typeof fetchStatus !== 'undefined' && fetchStatus !== query.state.fetchStatus) {
    return false;
  }

  if (predicate && !predicate(query)) {
    return false;
  }

  return true;
}
function matchMutation(filters, mutation) {
  const {
    exact,
    fetching,
    predicate,
    mutationKey
  } = filters;

  if (isQueryKey(mutationKey)) {
    if (!mutation.options.mutationKey) {
      return false;
    }

    if (exact) {
      if (hashQueryKey(mutation.options.mutationKey) !== hashQueryKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }

  if (typeof fetching === 'boolean' && mutation.state.status === 'loading' !== fetching) {
    return false;
  }

  if (predicate && !predicate(mutation)) {
    return false;
  }

  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = (options == null ? void 0 : options.queryKeyHashFn) || hashQueryKey;
  return hashFn(queryKey);
}
/**
 * Default query keys hash function.
 * Hashes the value into a stable hash.
 */

function hashQueryKey(queryKey) {
  return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
    result[key] = val[key];
    return result;
  }, {}) : val);
}
/**
 * Checks if key `b` partially matches with key `a`.
 */

function partialMatchKey(a, b) {
  return partialDeepEqual(a, b);
}
/**
 * Checks if `b` partially matches with `a`.
 */

function partialDeepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return !Object.keys(b).some(key => !partialDeepEqual(a[key], b[key]));
  }

  return false;
}
/**
 * This function returns `a` if `b` is deeply equal.
 * If not, it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between JSON values for example.
 */

function replaceEqualDeep(a, b) {
  if (a === b) {
    return a;
  }

  const array = isPlainArray(a) && isPlainArray(b);

  if (array || isPlainObject(a) && isPlainObject(b)) {
    const aSize = array ? a.length : Object.keys(a).length;
    const bItems = array ? b : Object.keys(b);
    const bSize = bItems.length;
    const copy = array ? [] : {};
    let equalItems = 0;

    for (let i = 0; i < bSize; i++) {
      const key = array ? i : bItems[i];
      copy[key] = replaceEqualDeep(a[key], b[key]);

      if (copy[key] === a[key]) {
        equalItems++;
      }
    }

    return aSize === bSize && equalItems === aSize ? a : copy;
  }

  return b;
}
/**
 * Shallow compare objects. Only works with objects that always have the same properties.
 */

function shallowEqualObjects(a, b) {
  if (a && !b || b && !a) {
    return false;
  }

  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
} // Copied from: https://github.com/jonschlinkert/is-plain-object

function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  } // If has modified constructor


  const ctor = o.constructor;

  if (typeof ctor === 'undefined') {
    return true;
  } // If has modified prototype


  const prot = ctor.prototype;

  if (!hasObjectPrototype(prot)) {
    return false;
  } // If constructor does not have an Object-specific method


  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  } // Most likely a plain Object


  return true;
}

function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isQueryKey(value) {
  return Array.isArray(value);
}
function isError(value) {
  return value instanceof Error;
}
function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
/**
 * Schedules a microtask.
 * This can be useful to schedule state updates after rendering.
 */

function scheduleMicrotask(callback) {
  sleep(0).then(callback);
}
function getAbortController() {
  if (typeof AbortController === 'function') {
    return new AbortController();
  }

  return;
}
function replaceData(prevData, data, options) {
  // Use prev data if an isDataEqual function is defined and returns `true`
  if (options.isDataEqual != null && options.isDataEqual(prevData, data)) {
    return prevData;
  } else if (typeof options.structuralSharing === 'function') {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    // Structurally share data between prev and new data if needed
    return replaceEqualDeep(prevData, data);
  }

  return data;
}


//# sourceMappingURL=utils.mjs.map


/***/ }),

/***/ 5945:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NL": function() { return /* binding */ useQueryClient; },
/* harmony export */   "Of": function() { return /* binding */ defaultContext; },
/* harmony export */   "aH": function() { return /* binding */ QueryClientProvider; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


const defaultContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(undefined);
const QueryClientSharingContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(false); // If we are given a context, we will use it.
// Otherwise, if contextSharing is on, we share the first and at least one
// instance of the context across the window
// to ensure that if React Query is used across
// different bundles or microfrontends they will
// all use the same **instance** of context, regardless
// of module scoping.

function getQueryClientContext(context, contextSharing) {
  if (context) {
    return context;
  }

  if (contextSharing && typeof window !== 'undefined') {
    if (!window.ReactQueryClientContext) {
      window.ReactQueryClientContext = defaultContext;
    }

    return window.ReactQueryClientContext;
  }

  return defaultContext;
}

const useQueryClient = ({
  context
} = {}) => {
  const queryClient = react__WEBPACK_IMPORTED_MODULE_0__.useContext(getQueryClientContext(context, react__WEBPACK_IMPORTED_MODULE_0__.useContext(QueryClientSharingContext)));

  if (!queryClient) {
    throw new Error('No QueryClient set, use QueryClientProvider to set one');
  }

  return queryClient;
};
const QueryClientProvider = ({
  client,
  children,
  context,
  contextSharing = false
}) => {
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);

  if (false) {}

  const Context = getQueryClientContext(context, contextSharing);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(QueryClientSharingContext.Provider, {
    value: !context && contextSharing
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Context.Provider, {
    value: client
  }, children));
};


//# sourceMappingURL=QueryClientProvider.mjs.map


/***/ }),

/***/ 1784:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": function() { return /* binding */ useQueryErrorResetBoundary; },
/* harmony export */   "k": function() { return /* binding */ QueryErrorResetBoundary; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}

const QueryErrorResetBoundaryContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(createValue()); // HOOK

const useQueryErrorResetBoundary = () => react__WEBPACK_IMPORTED_MODULE_0__.useContext(QueryErrorResetBoundaryContext); // COMPONENT

const QueryErrorResetBoundary = ({
  children
}) => {
  const [value] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => createValue());
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(QueryErrorResetBoundaryContext.Provider, {
    value: value
  }, typeof children === 'function' ? children(value) : children);
};


//# sourceMappingURL=QueryErrorResetBoundary.mjs.map


/***/ }),

/***/ 1670:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JN": function() { return /* binding */ useClearResetErrorBoundary; },
/* harmony export */   "KJ": function() { return /* binding */ getHasError; },
/* harmony export */   "pf": function() { return /* binding */ ensurePreventErrorBoundaryRetry; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4798);



const ensurePreventErrorBoundaryRetry = (options, errorResetBoundary) => {
  if (options.suspense || options.useErrorBoundary) {
    // Prevent retrying failed query if the error boundary has not been reset yet
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
const useClearResetErrorBoundary = errorResetBoundary => {
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
const getHasError = ({
  result,
  errorResetBoundary,
  useErrorBoundary,
  query
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .shouldThrowError */ .L)(useErrorBoundary, [result.error, query]);
};


//# sourceMappingURL=errorBoundaryUtils.mjs.map


/***/ }),

/***/ 5010:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "CancelledError": function() { return /* reexport */ lib.CancelledError; },
  "Hydrate": function() { return /* reexport */ Hydrate; },
  "InfiniteQueryObserver": function() { return /* reexport */ lib.InfiniteQueryObserver; },
  "IsRestoringProvider": function() { return /* reexport */ lib_isRestoring/* IsRestoringProvider */.u; },
  "MutationCache": function() { return /* reexport */ lib.MutationCache; },
  "MutationObserver": function() { return /* reexport */ lib.MutationObserver; },
  "QueriesObserver": function() { return /* reexport */ lib.QueriesObserver; },
  "QueryCache": function() { return /* reexport */ lib.QueryCache; },
  "QueryClient": function() { return /* reexport */ lib.QueryClient; },
  "QueryClientProvider": function() { return /* reexport */ QueryClientProvider/* QueryClientProvider */.aH; },
  "QueryErrorResetBoundary": function() { return /* reexport */ QueryErrorResetBoundary/* QueryErrorResetBoundary */.k; },
  "QueryObserver": function() { return /* reexport */ lib.QueryObserver; },
  "defaultContext": function() { return /* reexport */ QueryClientProvider/* defaultContext */.Of; },
  "defaultShouldDehydrateMutation": function() { return /* reexport */ lib.defaultShouldDehydrateMutation; },
  "defaultShouldDehydrateQuery": function() { return /* reexport */ lib.defaultShouldDehydrateQuery; },
  "dehydrate": function() { return /* reexport */ lib.dehydrate; },
  "focusManager": function() { return /* reexport */ lib.focusManager; },
  "hashQueryKey": function() { return /* reexport */ lib.hashQueryKey; },
  "hydrate": function() { return /* reexport */ lib.hydrate; },
  "isCancelledError": function() { return /* reexport */ lib.isCancelledError; },
  "isError": function() { return /* reexport */ lib.isError; },
  "isServer": function() { return /* reexport */ lib.isServer; },
  "notifyManager": function() { return /* reexport */ lib.notifyManager; },
  "onlineManager": function() { return /* reexport */ lib.onlineManager; },
  "parseFilterArgs": function() { return /* reexport */ lib.parseFilterArgs; },
  "parseMutationArgs": function() { return /* reexport */ lib.parseMutationArgs; },
  "parseMutationFilterArgs": function() { return /* reexport */ lib.parseMutationFilterArgs; },
  "parseQueryArgs": function() { return /* reexport */ lib.parseQueryArgs; },
  "replaceEqualDeep": function() { return /* reexport */ lib.replaceEqualDeep; },
  "useHydrate": function() { return /* reexport */ useHydrate; },
  "useInfiniteQuery": function() { return /* reexport */ useInfiniteQuery; },
  "useIsFetching": function() { return /* reexport */ useIsFetching; },
  "useIsMutating": function() { return /* reexport */ useIsMutating; },
  "useIsRestoring": function() { return /* reexport */ lib_isRestoring/* useIsRestoring */.S; },
  "useMutation": function() { return /* reexport */ useMutation/* useMutation */.D; },
  "useQueries": function() { return /* reexport */ useQueries; },
  "useQuery": function() { return /* reexport */ useQuery/* useQuery */.a; },
  "useQueryClient": function() { return /* reexport */ QueryClientProvider/* useQueryClient */.NL; },
  "useQueryErrorResetBoundary": function() { return /* reexport */ QueryErrorResetBoundary/* useQueryErrorResetBoundary */._; }
});

// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/index.mjs
var lib = __webpack_require__(2273);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9497);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/useSyncExternalStore.mjs
var useSyncExternalStore = __webpack_require__(464);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/queriesObserver.mjs
var queriesObserver = __webpack_require__(4615);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/notifyManager.mjs
var notifyManager = __webpack_require__(81);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/QueryClientProvider.mjs
var QueryClientProvider = __webpack_require__(5945);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/isRestoring.mjs
var lib_isRestoring = __webpack_require__(7122);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/QueryErrorResetBoundary.mjs
var QueryErrorResetBoundary = __webpack_require__(1784);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/errorBoundaryUtils.mjs
var errorBoundaryUtils = __webpack_require__(1670);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/suspense.mjs
var suspense = __webpack_require__(8381);
;// CONCATENATED MODULE: ./node_modules/@tanstack/react-query/build/lib/useQueries.mjs









// - `context` is omitted as it is passed as a root-level option to `useQueries` instead.

function useQueries({
  queries,
  context
}) {
  const queryClient = (0,QueryClientProvider/* useQueryClient */.NL)({
    context
  });
  const isRestoring = (0,lib_isRestoring/* useIsRestoring */.S)();
  const defaultedQueries = external_react_.useMemo(() => queries.map(options => {
    const defaultedOptions = queryClient.defaultQueryOptions(options); // Make sure the results are already in fetching state before subscribing or updating options

    defaultedOptions._optimisticResults = isRestoring ? 'isRestoring' : 'optimistic';
    return defaultedOptions;
  }), [queries, queryClient, isRestoring]);
  const [observer] = external_react_.useState(() => new queriesObserver/* QueriesObserver */.y(queryClient, defaultedQueries));
  const optimisticResult = observer.getOptimisticResult(defaultedQueries);
  (0,useSyncExternalStore/* useSyncExternalStore */.$)(external_react_.useCallback(onStoreChange => isRestoring ? () => undefined : observer.subscribe(notifyManager/* notifyManager.batchCalls */.V.batchCalls(onStoreChange)), [observer, isRestoring]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
  external_react_.useEffect(() => {
    // Do not notify on updates because of changes in the options because
    // these changes should already be reflected in the optimistic result.
    observer.setQueries(defaultedQueries, {
      listeners: false
    });
  }, [defaultedQueries, observer]);
  const errorResetBoundary = (0,QueryErrorResetBoundary/* useQueryErrorResetBoundary */._)();
  defaultedQueries.forEach(query => {
    (0,errorBoundaryUtils/* ensurePreventErrorBoundaryRetry */.pf)(query, errorResetBoundary);
    (0,suspense/* ensureStaleTime */.Fb)(query);
  });
  (0,errorBoundaryUtils/* useClearResetErrorBoundary */.JN)(errorResetBoundary);
  const shouldAtLeastOneSuspend = optimisticResult.some((result, index) => (0,suspense/* shouldSuspend */.SB)(defaultedQueries[index], result, isRestoring));
  const suspensePromises = shouldAtLeastOneSuspend ? optimisticResult.flatMap((result, index) => {
    const options = defaultedQueries[index];
    const queryObserver = observer.getObservers()[index];

    if (options && queryObserver) {
      if ((0,suspense/* shouldSuspend */.SB)(options, result, isRestoring)) {
        return (0,suspense/* fetchOptimistic */.j8)(options, queryObserver, errorResetBoundary);
      } else if ((0,suspense/* willFetch */.Z$)(result, isRestoring)) {
        void (0,suspense/* fetchOptimistic */.j8)(options, queryObserver, errorResetBoundary);
      }
    }

    return [];
  }) : [];

  if (suspensePromises.length > 0) {
    throw Promise.all(suspensePromises);
  }

  const firstSingleResultWhichShouldThrow = optimisticResult.find((result, index) => {
    var _defaultedQueries$ind, _defaultedQueries$ind2;

    return (0,errorBoundaryUtils/* getHasError */.KJ)({
      result,
      errorResetBoundary,
      useErrorBoundary: (_defaultedQueries$ind = (_defaultedQueries$ind2 = defaultedQueries[index]) == null ? void 0 : _defaultedQueries$ind2.useErrorBoundary) != null ? _defaultedQueries$ind : false,
      query: observer.getQueries()[index]
    });
  });

  if (firstSingleResultWhichShouldThrow != null && firstSingleResultWhichShouldThrow.error) {
    throw firstSingleResultWhichShouldThrow.error;
  }

  return optimisticResult;
}


//# sourceMappingURL=useQueries.mjs.map

// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/useQuery.mjs
var useQuery = __webpack_require__(6492);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/hydration.mjs
var hydration = __webpack_require__(5644);
;// CONCATENATED MODULE: ./node_modules/@tanstack/react-query/build/lib/Hydrate.mjs




function useHydrate(state, options = {}) {
  const queryClient = (0,QueryClientProvider/* useQueryClient */.NL)({
    context: options.context
  });
  const optionsRef = external_react_.useRef(options);
  optionsRef.current = options; // Running hydrate again with the same queries is safe,
  // it wont overwrite or initialize existing queries,
  // relying on useMemo here is only a performance optimization.
  // hydrate can and should be run *during* render here for SSR to work properly

  external_react_.useMemo(() => {
    if (state) {
      (0,hydration/* hydrate */.ZB)(queryClient, state, optionsRef.current);
    }
  }, [queryClient, state]);
}
const Hydrate = ({
  children,
  options,
  state
}) => {
  useHydrate(state, options);
  return children;
};


//# sourceMappingURL=Hydrate.mjs.map

// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/utils.mjs
var utils = __webpack_require__(2161);
;// CONCATENATED MODULE: ./node_modules/@tanstack/react-query/build/lib/useIsFetching.mjs





function useIsFetching(arg1, arg2, arg3) {
  const [filters, options = {}] = (0,utils/* parseFilterArgs */.I6)(arg1, arg2, arg3);
  const queryClient = (0,QueryClientProvider/* useQueryClient */.NL)({
    context: options.context
  });
  const queryCache = queryClient.getQueryCache();
  return (0,useSyncExternalStore/* useSyncExternalStore */.$)(external_react_.useCallback(onStoreChange => queryCache.subscribe(notifyManager/* notifyManager.batchCalls */.V.batchCalls(onStoreChange)), [queryCache]), () => queryClient.isFetching(filters), () => queryClient.isFetching(filters));
}


//# sourceMappingURL=useIsFetching.mjs.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/react-query/build/lib/useIsMutating.mjs





function useIsMutating(arg1, arg2, arg3) {
  const [filters, options = {}] = (0,utils/* parseMutationFilterArgs */.cb)(arg1, arg2, arg3);
  const queryClient = (0,QueryClientProvider/* useQueryClient */.NL)({
    context: options.context
  });
  const mutationCache = queryClient.getMutationCache();
  return (0,useSyncExternalStore/* useSyncExternalStore */.$)(external_react_.useCallback(onStoreChange => mutationCache.subscribe(notifyManager/* notifyManager.batchCalls */.V.batchCalls(onStoreChange)), [mutationCache]), () => queryClient.isMutating(filters), () => queryClient.isMutating(filters));
}


//# sourceMappingURL=useIsMutating.mjs.map

// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/useMutation.mjs
var useMutation = __webpack_require__(4846);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/lib/infiniteQueryObserver.mjs
var infiniteQueryObserver = __webpack_require__(4787);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/useBaseQuery.mjs
var useBaseQuery = __webpack_require__(7687);
;// CONCATENATED MODULE: ./node_modules/@tanstack/react-query/build/lib/useInfiniteQuery.mjs



function useInfiniteQuery(arg1, arg2, arg3) {
  const options = (0,utils/* parseQueryArgs */._v)(arg1, arg2, arg3);
  return (0,useBaseQuery/* useBaseQuery */.r)(options, infiniteQueryObserver/* InfiniteQueryObserver */.c);
}


//# sourceMappingURL=useInfiniteQuery.mjs.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/react-query/build/lib/index.mjs












//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 7122:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S": function() { return /* binding */ useIsRestoring; },
/* harmony export */   "u": function() { return /* binding */ IsRestoringProvider; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


const IsRestoringContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(false);
const useIsRestoring = () => react__WEBPACK_IMPORTED_MODULE_0__.useContext(IsRestoringContext);
const IsRestoringProvider = IsRestoringContext.Provider;


//# sourceMappingURL=isRestoring.mjs.map


/***/ }),

/***/ 8381:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fb": function() { return /* binding */ ensureStaleTime; },
/* harmony export */   "SB": function() { return /* binding */ shouldSuspend; },
/* harmony export */   "Z$": function() { return /* binding */ willFetch; },
/* harmony export */   "j8": function() { return /* binding */ fetchOptimistic; }
/* harmony export */ });
const ensureStaleTime = defaultedOptions => {
  if (defaultedOptions.suspense) {
    // Always set stale time when using suspense to prevent
    // fetching again when directly mounting after suspending
    if (typeof defaultedOptions.staleTime !== 'number') {
      defaultedOptions.staleTime = 1000;
    }
  }
};
const willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
const shouldSuspend = (defaultedOptions, result, isRestoring) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && willFetch(result, isRestoring);
const fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).then(({
  data
}) => {
  defaultedOptions.onSuccess == null ? void 0 : defaultedOptions.onSuccess(data);
  defaultedOptions.onSettled == null ? void 0 : defaultedOptions.onSettled(data, null);
}).catch(error => {
  errorResetBoundary.clearReset();
  defaultedOptions.onError == null ? void 0 : defaultedOptions.onError(error);
  defaultedOptions.onSettled == null ? void 0 : defaultedOptions.onSettled(undefined, error);
});


//# sourceMappingURL=suspense.mjs.map


/***/ }),

/***/ 7687:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "r": function() { return /* binding */ useBaseQuery; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);
/* harmony import */ var _useSyncExternalStore_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(464);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(81);
/* harmony import */ var _QueryErrorResetBoundary_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1784);
/* harmony import */ var _QueryClientProvider_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5945);
/* harmony import */ var _isRestoring_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7122);
/* harmony import */ var _errorBoundaryUtils_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1670);
/* harmony import */ var _suspense_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8381);









function useBaseQuery(options, Observer) {
  const queryClient = (0,_QueryClientProvider_mjs__WEBPACK_IMPORTED_MODULE_1__/* .useQueryClient */ .NL)({
    context: options.context
  });
  const isRestoring = (0,_isRestoring_mjs__WEBPACK_IMPORTED_MODULE_2__/* .useIsRestoring */ .S)();
  const errorResetBoundary = (0,_QueryErrorResetBoundary_mjs__WEBPACK_IMPORTED_MODULE_3__/* .useQueryErrorResetBoundary */ ._)();
  const defaultedOptions = queryClient.defaultQueryOptions(options); // Make sure results are optimistically set in fetching state before subscribing or updating options

  defaultedOptions._optimisticResults = isRestoring ? 'isRestoring' : 'optimistic'; // Include callbacks in batch renders

  if (defaultedOptions.onError) {
    defaultedOptions.onError = _tanstack_query_core__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager.batchCalls */ .V.batchCalls(defaultedOptions.onError);
  }

  if (defaultedOptions.onSuccess) {
    defaultedOptions.onSuccess = _tanstack_query_core__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager.batchCalls */ .V.batchCalls(defaultedOptions.onSuccess);
  }

  if (defaultedOptions.onSettled) {
    defaultedOptions.onSettled = _tanstack_query_core__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager.batchCalls */ .V.batchCalls(defaultedOptions.onSettled);
  }

  (0,_suspense_mjs__WEBPACK_IMPORTED_MODULE_5__/* .ensureStaleTime */ .Fb)(defaultedOptions);
  (0,_errorBoundaryUtils_mjs__WEBPACK_IMPORTED_MODULE_6__/* .ensurePreventErrorBoundaryRetry */ .pf)(defaultedOptions, errorResetBoundary);
  (0,_errorBoundaryUtils_mjs__WEBPACK_IMPORTED_MODULE_6__/* .useClearResetErrorBoundary */ .JN)(errorResetBoundary);
  const [observer] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => new Observer(queryClient, defaultedOptions));
  const result = observer.getOptimisticResult(defaultedOptions);
  (0,_useSyncExternalStore_mjs__WEBPACK_IMPORTED_MODULE_7__/* .useSyncExternalStore */ .$)(react__WEBPACK_IMPORTED_MODULE_0__.useCallback(onStoreChange => isRestoring ? () => undefined : observer.subscribe(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager.batchCalls */ .V.batchCalls(onStoreChange)), [observer, isRestoring]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    // Do not notify on updates because of changes in the options because
    // these changes should already be reflected in the optimistic result.
    observer.setOptions(defaultedOptions, {
      listeners: false
    });
  }, [defaultedOptions, observer]); // Handle suspense

  if ((0,_suspense_mjs__WEBPACK_IMPORTED_MODULE_5__/* .shouldSuspend */ .SB)(defaultedOptions, result, isRestoring)) {
    throw (0,_suspense_mjs__WEBPACK_IMPORTED_MODULE_5__/* .fetchOptimistic */ .j8)(defaultedOptions, observer, errorResetBoundary);
  } // Handle error boundary


  if ((0,_errorBoundaryUtils_mjs__WEBPACK_IMPORTED_MODULE_6__/* .getHasError */ .KJ)({
    result,
    errorResetBoundary,
    useErrorBoundary: defaultedOptions.useErrorBoundary,
    query: observer.getCurrentQuery()
  })) {
    throw result.error;
  } // Handle result property usage tracking


  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}


//# sourceMappingURL=useBaseQuery.mjs.map


/***/ }),

/***/ 4846:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": function() { return /* binding */ useMutation; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);
/* harmony import */ var _useSyncExternalStore_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(464);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2161);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9999);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(81);
/* harmony import */ var _QueryClientProvider_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5945);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4798);






function useMutation(arg1, arg2, arg3) {
  const options = (0,_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__/* .parseMutationArgs */ .lV)(arg1, arg2, arg3);
  const queryClient = (0,_QueryClientProvider_mjs__WEBPACK_IMPORTED_MODULE_2__/* .useQueryClient */ .NL)({
    context: options.context
  });
  const [observer] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => new _tanstack_query_core__WEBPACK_IMPORTED_MODULE_3__/* .MutationObserver */ .X(queryClient, options));
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = (0,_useSyncExternalStore_mjs__WEBPACK_IMPORTED_MODULE_4__/* .useSyncExternalStore */ .$)(react__WEBPACK_IMPORTED_MODULE_0__.useCallback(onStoreChange => observer.subscribe(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_5__/* .notifyManager.batchCalls */ .V.batchCalls(onStoreChange)), [observer]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
  const mutate = react__WEBPACK_IMPORTED_MODULE_0__.useCallback((variables, mutateOptions) => {
    observer.mutate(variables, mutateOptions).catch(noop);
  }, [observer]);

  if (result.error && (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_6__/* .shouldThrowError */ .L)(observer.options.useErrorBoundary, [result.error])) {
    throw result.error;
  }

  return { ...result,
    mutate,
    mutateAsync: result.mutate
  };
} // eslint-disable-next-line @typescript-eslint/no-empty-function

function noop() {}


//# sourceMappingURL=useMutation.mjs.map


/***/ }),

/***/ 6492:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": function() { return /* binding */ useQuery; }
/* harmony export */ });
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2161);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2924);
/* harmony import */ var _useBaseQuery_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7687);



function useQuery(arg1, arg2, arg3) {
  const parsedOptions = (0,_tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__/* .parseQueryArgs */ ._v)(arg1, arg2, arg3);
  return (0,_useBaseQuery_mjs__WEBPACK_IMPORTED_MODULE_1__/* .useBaseQuery */ .r)(parsedOptions, _tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__/* .QueryObserver */ .z);
}


//# sourceMappingURL=useQuery.mjs.map


/***/ }),

/***/ 464:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": function() { return /* binding */ useSyncExternalStore; }
/* harmony export */ });
/* harmony import */ var use_sync_external_store_shim_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1688);


// Temporary workaround due to an issue with react-native uSES - https://github.com/TanStack/query/pull/3601
const useSyncExternalStore = use_sync_external_store_shim_index_js__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore;


//# sourceMappingURL=useSyncExternalStore.mjs.map


/***/ }),

/***/ 4798:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": function() { return /* binding */ shouldThrowError; }
/* harmony export */ });
function shouldThrowError(_useErrorBoundary, params) {
  // Allow useErrorBoundary function to override throwing behavior on a per-error basis
  if (typeof _useErrorBoundary === 'function') {
    return _useErrorBoundary(...params);
  }

  return !!_useErrorBoundary;
}


//# sourceMappingURL=utils.mjs.map


/***/ })

};
;