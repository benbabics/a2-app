(function () {
    "use strict";

    var _$q;

    /**
    * Constructor
    **/
    var WexInfiniteListService = function(delegate, options) {
      var collectionSize;

      options = options || {};
      this.model = {collection: []};
      delete options.cacheKey;

      this.isPending = false;

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
          requestConfig = _.clone( this.settings ),
          requestPromise,
          greekingCollection;

      // cancel request, if greeking and currently pending
      if ( this.settings.isGreeking && this.isPending ) {
          return _$q.reject(); // not a fan of this approach ಠ_ಠ
      }

      this.isPending = true;
      requestPromise = this.delegate.makeRequest( requestConfig ),
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
        })
        .finally(function() {
            self.isPending = false;
        });
    }

    function resetCollection(options) {
      var self = this,
          collectionBuffer = [];

      resetProperties.call( this );

      // if greeking, assign buffer before request to render greeking state
      options = options || {};
      if ( this.settings.isGreeking && !options.skipGreeking ) {
        this.model.collection = collectionBuffer;
      }

      return this.loadNextPage( collectionBuffer ).finally(function() {
        self.model.collection = collectionBuffer;
      });
    }

    function removeItem(item) {
        var collection = this.model.collection,
            index      = collection.indexOf( item );

        return this.delegate.removeItem( item )
            .then(function() {
                collection.splice( index, 1 );
            });
    }

    /**
     * Private Methods
    **/

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
      resetCollection: resetCollection,
      removeItem:      removeItem
    };


    angular
      .module("app.shared.widgets")
      .factory("wexInfiniteListService", function($q) {
          _$q = $q;
          return WexInfiniteListService;
      });
})();
