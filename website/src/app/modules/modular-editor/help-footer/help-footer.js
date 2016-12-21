import './help-footer.scss';
angular.module('modules.modular-editor.help-footer', [
]);
angular.module('modules.modular-editor.help-footer').

directive('editorHelpFooter', function () {
	return {
		restrict: 'E',
		template: require('./help-footer.html'),
		controller: function($scope, TipService, Authentication){
			$scope.currentHelpSection = 0;
			$scope.next      = next;     // function()
			$scope.previous  = previous; // function()
			$scope.close     = close; //function()
            initialise();
            $scope.helpSections = [
				{
					html : '<div class="md-headline text-center">Add images and other media by starting a new line and clicking the <img src="/assets/images/editor/insert.png" alt="Insert Button"> or [Ctrl + I]</div>'+
							'<img src="/assets/images/editor/InsertTool.gif" alt="Insert Media">'
				},{
					html : '<div class="md-headline text-center">Want to change text formatting, add links or headings?</div>'+
							'<img src="/assets/images/editor/ChangeTextFormat.gif" alt="Change Text Formatting">'
				}
			]

			///////////////////////////////////////////////////////////
            var tipStatuses;
			function initialise(){
				if(Authentication.currentUser.isLoggedIn()){
                    TipService.getStatuses().then(function(statuses) {
                        tipStatuses = statuses;
                        // show the tip if we have not seen it and the editor is not minimal
//                        if(statuses.editorHelp && !$scope.editorOptions.minimal){
//                            $scope.editorOptions.showHelp = true
//                        }
//                        else{
//                            $scope.editorOptions.showHelp = false;
//                        }
                        $scope.editorOptions.showHelp = false;
                    });
				}
			}

			function close(){
                if(tipStatuses.editorHelp){
				    TipService.markAsRead('editorHelp')
                }
				$scope.editorOptions.showHelp = false;
			}

			var looper = 0;
			function next(){
				looper ++
				$scope.currentHelpSection = Math.abs(looper % $scope.helpSections.length);

			}
			function previous(){
				looper --
				$scope.currentHelpSection = Math.abs(looper % $scope.helpSections.length);
			}


		}
	};
});
