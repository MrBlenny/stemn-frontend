angular.module('modules.preview.embed', []);
angular.module('modules.preview.embed').
service('PreviewEmbedService', function ($mdDialog) {
    this.modal = function(event, fileMeta){
        return $mdDialog.show({
            template: require('./tpls/preview-embed-modal.html'),
            controller: function($scope, $mdDialog, SyncUrlService){
                $scope.fileMeta = fileMeta;
                $scope.version = 'latest'
                $scope.change = function(version){
                    $scope.src = 'http://embed.stemn.com/preview/' + fileMeta.parentProject + '/' + fileMeta.path + (version == 'specific' ? '@' + fileMeta.rev : '') + (fileMeta.virtualChildren ? '?children=' + SyncUrlService.getChildPath(fileMeta.virtualChildren, version == 'latest' ? true : false) : '') ;
                    $scope.code = '<iframe allowfullscreen width="100%" height="500" frameborder="0" src="'+$scope.src+'"><a href="'+$scope.src+'">Preview '+fileMeta.name+'</a></iframe>'
                }

                $scope.change($scope.version);
                $scope.cancel = $mdDialog.cancel; // function()
                $scope.save = function(){
                    $mdDialog.hide()
                }
            },
            targetEvent: event
        })
    }
});