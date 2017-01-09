angular.module('views.onboarding.sync', [
]);
angular.module('views.onboarding.sync').

config(function ($stateProvider) {
    $stateProvider.
    state('app.onboarding.sync', {
        abstract: true,
        url: '/sync',
        template: require('./tpls/onboarding-sync.html'),
        controller: 'OnboardingSyncViewCtrl',
        resolve: {
            user : function(userdata, UserService, Authentication){
                return UserService.getUser(userdata._id, 'lg').then(function(user){
                    return user;
                })
            }
        },
    }).
    state('app.onboarding.sync.intro', {
        url: '',
        template: require('./tpls/onboarding-sync-intro.html'),
        controller: 'OnboardingSyncIntroViewCtrl'
    }).
    state('app.onboarding.sync.account', {
        url: '/account',
        template: require('./tpls/onboarding-sync-account.html'),
        controller: 'OnboardingSyncAccountViewCtrl'
    })
}).

controller('OnboardingSyncViewCtrl', function (user, userdata, $scope, $state, UserService, SettingsService, Authentication) {
    $scope.forms = {};
    $scope.user = user;
    $scope.currentUser = userdata;
    $scope.tabs = ['app.onboarding.sync.intro', 'app.onboarding.sync.account'];

    $scope.steps = {
        'app.onboarding.sync.intro' : {
            label: 'About You',
            sref: 'app.onboarding.sync.intro',
            nextText : 'Next: Sync Account',
            clickFn : function(){
                $state.go(this.sref)
            },
            nextFn : function(){
                $state.go('app.onboarding.sync.account');
            },
        },
        'app.onboarding.sync.account' : {
            label: 'Sync Account',
            sref: 'app.onboarding.sync.account',
            nextText : 'Go to Dashboard',
            clickFn : function(){
                $state.go(this.sref)
            },
            nextFn : function(){
                saveUser();
                SettingsService.getSettings().then(function(settings){
                    // Save that we have now done onboarding
                    settings.messages.userOnboarding = false;
                    settings.save();
                })
                $state.go('app.dashboard.projects')
            },
        },
    };

    /////////////////////////////

    function saveUser(){
        return UserService.updateUser($scope.user);
	}


}).
controller('OnboardingSyncIntroViewCtrl', function ($scope, Authentication, $mdToast, UserService, $state) {

    $scope.linkedinImport = linkedinImport;

    ///////////////////////////

    function linkedinImport(){
        $scope.linkedinLoading = true;
        Authentication.authenticate('linkedin').then(function(response) {
            $mdToast.show(
                $mdToast.simple().
                content('You accounts are linked and info imported')
            );
            $scope.linkedinImported  = true;
            $scope.linkedinLoading = false;
			getUserData();
        }).catch(function(response) {
            $mdToast.show(
                $mdToast.simple().
                theme('warn').
                content('Couldn\'t do it... '+response.data.message || response.data)
            );
            $scope.linkedinLoading = false;
        });
    }

    function getUserData(){
		UserService.getUser(Authentication.currentUser._id, 'lg').then(function(user){
			$scope.user = user;
		})
	}
}).
controller('OnboardingSyncAccountViewCtrl', function ($scope, SyncService) {
    $scope.syncAuthorize = syncAuthorize; //function()

    function syncAuthorize(provider){
        $scope.syncAuthLoading = true;
        SyncService.authorize(provider).then(function(response){
            $scope.syncAuthLoading = false;
        }).catch(function(){$scope.syncAuthLoading = false;})
    }
});