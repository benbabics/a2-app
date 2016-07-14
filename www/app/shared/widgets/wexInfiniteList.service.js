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
          requestPromise = this.delegate.makeRequest( requestConfig );

      collection = collection || this.model.collection;

      return requestPromise
        .then(function(items) {
          var collectionSize, hasItems = !_.isEmpty( items );
          if ( hasItems ) {
            //add the fetched items to the collection
            Array.prototype.push.apply( collection, items );
            ++self.settings.currentPage;
          }

          collectionSize = _.size( self.model.collection );
          return checkIfIsLoadingComplete.call( self, collectionSize );
        })
        .catch(function() {
          return self.isLoadingComplete = true;
        });
    }

    function resetCollection() {
      var self = this,
          collectionBuffer = [];

      resetProperties.call( this );

      this.loadNextPage( collectionBuffer ).finally(function() {
        this.model.collection = collectionBuffer;
      });
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

    function registerDelegate(delegate) {
      // ensure delegate has expected method(s)
      if ( delegateHasMethods(delegate) ) {
        this.delegate = delegate;
      }
      else {
        Logger.error( "wexInfiniteListService expected delegate to have some methods." );
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

    /**
     * Expose Methods
    **/
    WexInfiniteListService.prototype = {
      loadNextPage:    loadNextPage,
      resetCollection: resetCollection
    };


    angular
      .module("app.shared.widgets")
      .factory("wexInfiniteListService", function() { return WexInfiniteListService; });
})();
