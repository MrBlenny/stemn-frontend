import './top-banner.scss';

angular.module('modules.top-banner', []);
angular.module('modules.top-banner').

directive('topBanner', function(){
    return {
        restrict:'E',
		replace: true,
		template: require('./tpls/top-banner.html'),
		scope:{},
        controller: function ($rootScope, $stateParams, $scope, $timeout, TopBannerService, AuthenticationModalService, Authentication, $state, $http, $mdToast, OnboardingService){
			$scope.TopBannerService = TopBannerService;
			$scope.currentUser      = Authentication.currentUser;

			$scope.$on("authentication.logIn",  $scope.TopBannerService.hideBanner);
            $scope.$on("authentication.logOut", $scope.TopBannerService.showBanner);

            // Email validation banner
            $scope.resendVerification = resendVerification;
			$scope.resendVerificationDisabled = false;
			$scope.resendVerificationCount = 0;

            // Signup Banner
			$scope.signup    = AuthenticationModalService.login; // function()
            $scope.learnMore = OnboardingService.goToLanding   ; // function()

			///////////////////////////////////////////



            function resendVerification() {
                $http.get('/api/v1/account/reverify');
				$scope.resendVerificationDisabled = true;
				$scope.resendVerificationCount ++;
				$timeout(function(){
					$scope.resendVerificationDisabled = false;
				},5000)
				$mdToast.show({
					controller: function($scope, $mdToast){
						$scope.closeToast = function() {
							$mdToast.hide();
						};
						$scope.currentUser = Authentication.currentUser;
					},
					template:
					'<md-toast>'+
						'<span flex>Email sent to {{currentUser.email}}</span>'+
						'<md-button ui-sref="app.usersettings.account" ng-click="closeToast()">'+
							'Change Email'+
						'</md-button>'+
					'</md-toast>',
					hideDelay: 8000,
					position: 'bottom left'
				});
            }
        }
    }
}).

service('TopBannerService', function(){
	// Intialise
	var self = this;
	var body = angular.element(document.body);

	// Accessible
	this.banner = {
//		message: 'New to STEMN?',
		open     : false,
		closed   : false, // Banner has been force closed
	}
    this.showBanner  = showBanner;  //function()
    this.hideBanner  = hideBanner;  //function()
    this.closeBanner = closeBanner; //function()

	///////////////////////////////////

	function showBanner(){
		self.banner.open = true;
		body.addClass('top-banner-open');
	}
	function hideBanner(){
		self.banner.open = false;
		body.removeClass('top-banner-open');
	}
	function closeBanner(){
		self.banner.open   = false;
		self.banner.closed = true;
		body.removeClass('top-banner-open');
	}
});
