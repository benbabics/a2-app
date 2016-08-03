(function () {
    "use strict";

    var __store = {};

    /**
    * Constructor
    **/
    var WexInfiniteListService = function(delegate, options) {
      var collectionSize;

      options = options || {};
      this.model = getCachedModel( options.cacheKey );
      delete options.cacheKey;

      this.settings = angular.extend({
        pageSize:    25,
        currentPage: 0
      }, options || {});

      collectionSize = _.size( this.model.collection );
      if ( collectionSize ) {
        checkIfIsLoadingComplete.call( this, collectionSize );
      }

      registerDelegate.call( this, delegate );
    };

    /**
     * Privileged Methods
    **/
    function loadNextPage(collection) {
      var self = this,
          requestConfig  = _.clone( this.settings ),
          requestPromise = this.delegate.makeRequest( requestConfig ),
          greekingCollection;

      collection = collection || this.model.collection;

      // if enabled, greek the results while loading
      greekingCollection = greekResultsPre.call( this, collection ) || [];

      return requestPromise
        .then(function(items) {
          var collectionSize, hasItems = !_.isEmpty( items );
          if ( hasItems ) {
            //add the fetched items to the collection
            if ( !self.settings.isGreeking ) {
              Array.prototype.push.apply( collection, items );
            }

            ++self.settings.currentPage;
          }

          // if enabled, ungreek the results after loading
          greekResultsPost.call( self, collection, greekingCollection, items );

          collectionSize = _.size( items );
          return checkIfIsLoadingComplete.call( self, collectionSize );
        })
        .catch(function() {
          // if enabled, ungreek the results after loading
          greekResultsPost.call( self, collection, greekingCollection, [] );
          return self.isLoadingComplete = true;
        });
    }

    function resetCollection() {
      var self = this,
          collectionBuffer = [];

      resetProperties.call( this );

      // if greeking, assign buffer before request to render greeking state
      if ( this.settings.isGreeking ) {
        this.model.collection = collectionBuffer;
      }

      return this.loadNextPage( collectionBuffer ).finally(function() {
        self.model.collection = collectionBuffer;
      });
    }

    /**
     * Static Methods
    **/
    function emptyCache() {
        var keys = [].slice.call( arguments, 0 );
        keys.forEach( clearCachedModel );
    }

    /**
     * Private Methods
    **/
    function getCachedModel(key) {
      var emptyModel = { collection: [] };
      if ( !!key && !__store[ key ] ) {
        __store[ key ] = emptyModel;
      }
      return __store[ key ] || emptyModel;
    }

    function clearCachedModel(key) {
      if ( key && __store[ key ] ) {
          _.extend( __store[ key ], getCachedModel() );
      }
    }

    function registerDelegate(delegate) {
      // ensure delegate has expected method(s)
      if ( delegateHasMethods(delegate) ) {
        this.delegate = delegate;
      }
      else {
        throw new Error( "wexInfiniteListService expected delegate to have some methods." );
      }
    }

    function resetProperties() {
      this.settings.currentPage = 0;
      this.isLoadingComplete    = false;
    }

    function delegateHasMethods(delegate) {
      var hasMethodMakeRequest = _.isFunction( delegate.makeRequest );
      if ( delegate && hasMethodMakeRequest ) {
        return true;
      }

      return false;
    }

    function checkIfIsLoadingComplete(collectionSize) {
        collectionSize = collectionSize || 0;
        this.isLoadingComplete = collectionSize < this.settings.pageSize;
    }

    function greekResultsPre(collectionBuffer) {
        var collection = [];
        if ( !this.settings.isGreeking ) return;

        for( var i = 0; i < this.settings.pageSize; i++ ) {
          collection.push({ isGreekLoading: true });
        }

        Array.prototype.push.apply( collectionBuffer, collection );
        return collection;
    }

    function greekResultsPost(collectionBuffer, collectionGreeking, items) {
        if ( !this.settings.isGreeking ) return;

        for ( var i = 0; i < collectionGreeking.length; i++ ) {
          var item        = items[ i ],
              greekedItem = collectionGreeking[ i ],
              itemIndex   = collectionBuffer.indexOf( greekedItem );

          if ( item ) {
            _.extend( greekedItem, item, { isGreekLoading: false } );
          }
          else {
            collectionBuffer.splice( itemIndex, 1 );
          }
        }
    }

    /**
     * Expose Methods
    **/
    WexInfiniteListService.prototype = {
      loadNextPage:    loadNextPage,
      resetCollection: resetCollection
    };

    // Static Methods
    WexInfiniteListService.emptyCache = emptyCache;


    angular
      .module("app.shared.widgets")
      .factory("wexInfiniteListService", function() { return WexInfiniteListService; });
})();
