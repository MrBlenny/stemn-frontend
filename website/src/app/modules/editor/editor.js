angular.module('modules.editor', [
    'modules.uploads',
	'modules.edit-toolbar',
]);
angular.module('modules.editor').

service('EditorModalService', function ($mdDialog) {
    this.insertLink = function (event, link) {
        return $mdDialog.show({
            template: require('./tpls/insert-link-modal.html'),
            controller: function(link, $scope){
                $scope.link = angular.copy(link)
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.save = function () {
                    if($scope.LinkForm.$valid){
                        $mdDialog.hide($scope.link);
                    }
                };
            },
            locals: {
                link : link
            },
            targetEvent: event,
        })
    }
//    this.insertVideo = function (event, data) {
//        return $mdDialog.show({
//            template: require('./tpls/insert-video-modal.html'),
//            controller: function($scope){
//                $scope.cancel = function () {
//                    $mdDialog.cancel();
//                };
//                $scope.save = function () {
//                    if($scope.LinkForm.$valid){
//                        $mdDialog.hide($scope.link);
//                    }
//                };
//            },
//            targetEvent: event,
//        })
//    }
}).

directive('ctrlEnterSubmit', function () {
    // This will run the function when Ctrl+Enter is pressed on the element
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            element.bind('keydown', function (event) {
                var code = event.keyCode || event.which;
                if (code === 13) {
                    if (event.ctrlKey) {
                        scope.$apply(attrs.ctrlEnterSubmit);
                    }
                }
            });
        }
    };
}).

directive('replyEditor', function () {
    return {
        restrict: 'E',
        scope : {},
        template: require('./tpls/reply-editor.html'),
        controller : function ($scope, $rootScope, EditorService, Authentication, $element){

			$scope.editorOptions = {
				realtime  : false,
				contained : true,
				minimal   : true
			}

            // This editor is activated through the EditorService.
            $scope.editor      = EditorService.replyEditor;
            $scope.currentUser = Authentication.currentUser;

            $scope.submit = function(){
                $scope.editor.submit()
            }

            EditorService.replyEditor.element = $element;

            $scope.$watch('editor.model', function() {
                // If the model exists, lock the editor
                if ($scope.editor.model){
                    EditorService.replyEditor.locked  = true;
                }
            });

            // Minimise and Close functions
            $scope.closeFn = function () {
                $scope.editor.visible = false;
                $scope.editor.locked  = false;
            }

            // Watch the toggle - This will change when reply is denied due to lock
            $scope.$watch('editor.toggle', function(oldValue, newValue) {
                // If minimised, maximise
                if ($scope.editor.minimised === true){
                    $scope.maximise()
                }
                // Else, run the shake animation
                else{
                    $scope.animate = !$scope.animate;
                }
            });
        }
    };
}).

service('EditorService', function($timeout) {
    var lib = {
        zenMode: {
            visible : false, // Show or hide zen mode (activates ng-if)
            model   : '',    // The model the assigns data to and from zenmode
            save    : function () {
                // The function that assigns zen-mode back to standard editor
                console.error('No save function configured');
            }
        },
        replyEditor : {
            element     : '',    // The element is assigned here when inititated
            visible     : false, // Show or hide the editor
            model       : '',    // The model
            locked      : false, // Is the edit locked?
            toggle      : false,
            minimised   : false, // Minimises the reply editor
            submitText  : '',    // Text displayed on the submit button
            show        : function(){
                lib.replyEditor.visible     = true;
                lib.replyEditor.minimised   = false;
                lib.replyEditor.tooltip     = 'bottom';
                // Focus the editor
                $timeout(focusEditor,500)
            },
            minimise    : function(){
                lib.replyEditor.visible     = true;
                lib.replyEditor.minimised   = true;
            },
            reset        : function(){
                lib.replyEditor.visible     = false;
                lib.replyEditor.locked      = false;
                lib.replyEditor.model       = '';
            },
            submit      : function () {
                // The function that submits the editor
                console.error('No submit function configured');
            }
        }
    }
    return lib;

    function focusEditor(){
        lib.replyEditor.element[0].querySelector('[contenteditable]').focus()
    }
});
