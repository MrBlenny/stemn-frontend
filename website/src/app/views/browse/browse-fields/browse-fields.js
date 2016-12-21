angular.module('views.browse.fields', [

]);
angular.module('views.browse.fields').

config(function ($stateProvider) {
    $stateProvider.
    state('app.browse.fields', {
        url: '/fields?sort&order&q',
        template: require('./browse-fields.html'),
        layout: {
            size: 'lg',
            footer: true
        },
        seo: function(resolve){
            return {
                title : "Browse Engineering and Space Fields - STEMN",
            }
        },
        controller: 'BrowseFieldsViewCtrl',
        data: {
            name: 'Fields'
        }
    })
}).

controller('BrowseFieldsViewCtrl', function ($scope, $state, $location, HttpQuery, $stateParams, SearchService, FieldModalService) {

    // Defaults
    $stateParams.sort  = $stateParams.sort  || 'numProjects';
    $stateParams.order = $stateParams.order || 'dsc';

    // Scoped data
    $scope.newField    = newField; // function(event)
    $scope.clearFilter = clearFilter; //function()

    // Query
    $scope.query = HttpQuery({
        url       : 'api/v1/search',
        params    : {
            type     : 'field',
            select   : ['name', 'stub', 'numProjects', 'numJobs', 'picture', 'followers'],
            size     : 24,
            order    : 'dsc',
            sort     : $stateParams.sort,
            criteria : {},
        }
    });

    // Filters
    $scope.orderFilter = {
        model:   $stateParams.sort,
        reverse: $stateParams.order == 'asc' ? true : false
    };
    $scope.searchFilter = {
        model: '',
        onChange: function(){
            $scope.query.params.criteria.name = $scope.searchFilter.model ? '/'+$scope.searchFilter.model+'/i' : '';
            $scope.query.refresh();
        }
    }

    // Watchers
    $scope.$watch('orderFilter', watchOrderFilter, true);

    // Init
    $scope.query.more();


    //////////////////////////////////////////////

    function newField(event) {
        FieldModalService.fieldNewModal(event).then(function (result) {
            $state.go('app.field.top', {
                stub: result.stub
            })
        });
    }

    function watchOrderFilter(){
        if($scope.orderFilter.model){
            $scope.query.params.sort  = $scope.orderFilter.model;
            $scope.query.params.order = $scope.orderFilter.reverse ? 'asc' : 'dsc';
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    }

    function clearFilter() {
        $scope.searchFilter.model = '';

        $scope.query.params.criteria = {};
        $scope.query.refresh();
    }
});
