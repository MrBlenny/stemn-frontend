import './usersettings.scss';

angular.module('views.usersettings', ['modules.layout-options']);
angular.module('views.usersettings').

config(function ($stateProvider) {
    $stateProvider.
    state('app.usersettings', {
        url: '/settings?id?toggle',
        template: require('./usersettings.html'),
        resolve: {
            jwt: function(Authentication, $stateParams) {
                // login via the jwt
                if ($stateParams.id) {
                    return Authentication.setToken($stateParams.id, false);
                }
            },
            settings: function (jwt, SettingsService) {
                return SettingsService.getSettings();
            }
        },
        controller: 'UserSettingsViewCtrl',
        authLevel: 'user',
        layout: {
            size: 'md',
            footer: false,
            bgColor: 'rgba(0, 0, 0, 0.03)'
        },
        seo: function(resolve){
            return {
                title       : "User Settings - STEMN",
            }
        }
    }).
    state('app.usersettings.account', {
        url: '/account',
        template: require('./usersettings-account.html'),
    }).
    state('app.usersettings.email', {
        url: '/email',
        template: require('./usersettings-email.html'),
    }).
    state('app.usersettings.notifications', {
        url: '/notifications',
        template: require('./usersettings-notifications.html'),
    }).
    state('app.usersettings.profile', {
        url: '/profile',
        template: require('./usersettings-profile.html'),
    }).
    state('app.usersettings.feed', {
        url: '/feed',
        template: require('./usersettings-feed.html'),
    });
}).

controller('UserSettingsViewCtrl', function ($scope, $timeout, $rootScope, Authentication, $state, $stateParams, SettingsService, settings, SyncService, $mdToast, LayoutOptions, CoreLibrary, HighlightElement, AuthenticationModalService) {

    $timeout(highlightToggle, 1000)

	// Tabs ------------------------------------------------------
	$scope.tabs = [
		{
            label: 'Account',
            sref: 'app.usersettings.account'
        },{
            label: 'Emails',
            sref: 'app.usersettings.email'
        },{
            label: 'Notifications',
            sref: 'app.usersettings.notifications'
        },{
            label: 'News Feed',
            sref: 'app.usersettings.feed'
        }
	];
	$scope.currentTab = CoreLibrary.getCurrentTab($scope.tabs);

	// Other -----------------------------------------------------
    $scope.password = {};
    $scope.updatePassword = function() {
        if ($scope.password.newPassword !== $scope.password.confirmPassword) {
            $mdToast.show(
                $mdToast.simple().
                theme('warn').
                content('The passwords you entered don\'t match!')
            );
        } else {
            SettingsService.updatePassword($scope.password.oldPassword, $scope.password.newPassword).then(function() {
                $mdToast.show(
                    $mdToast.simple().
                    content('Great, your password has been updated.')
                );
                $scope.password.oldPassword = '';
                $scope.password.newPassword = '';
                $scope.password.confirmPassword = '';
				$scope.UpdatePasswordForm.$setPristine();
            })
        }
    }
    $scope.updateEmail = function() {
        SettingsService.updateEmail($scope.user.email).then(function() {
            Authentication.loadUserData().then(function() {
                $mdToast.show(
                    $mdToast.simple().
                    content('Your email has been updated.')
                );
            });
        });
    }

    $scope.linkedinImport = function(event){
        AuthenticationModalService.linkedinWarn(event);
    };

    $scope.authenticate = function(provider) {
        Authentication.authenticate(provider).then(function(response) {
            $mdToast.show(
                $mdToast.simple().
                content('You can now log in to this account using ' + provider + '!')
            );
        }).catch(function(response) {
            $mdToast.show(
                $mdToast.simple().
                theme('warn').
                content('Oops... '+response.data.message || response.data)
            );
        });
    }
    $scope.syncAuthorize = syncAuthorize;

    $scope.user = Authentication.currentUser;
    $scope.settings = settings;

    // Toggles ------------------------------------------------------------
    $scope.toggleData  = SettingsService.toggleData;
    $scope.toggleGroup = toggleGroup; // function(groupsModel, toggleNames)

    // Notification Toggles -------------------
    $scope.notificationToggles     = SettingsService.notificationToggles;
    $scope.notificationGroupStates = getGroupToggleStates($scope.settings.notifications, $scope.notificationToggles);
    // $scope functions
    $scope.toggleNotification      = function(){
        $scope.notificationGroupStates = getGroupToggleStates($scope.settings.notifications, $scope.notificationToggles);
        settings.save();
    }
    // Email Toggles -------------------
    $scope.emailsToggles     = SettingsService.emailsToggles;
    $scope.emailsGroupStates = getGroupToggleStates($scope.settings.emails, $scope.emailsToggles);
    // $scope functions
    $scope.toggleEmails      = function(){
        $scope.emailsGroupStates = getGroupToggleStates($scope.settings.emails, $scope.emailsToggles);
        settings.save();
    }
    // Feed Toggles -------------------
    $scope.feedToggles     = SettingsService.feedToggles;
    $scope.feedGroupStates = getGroupToggleStates($scope.settings.feed, $scope.feedToggles);
    // $scope functions
    $scope.toggleFeed      = function(){
        $scope.feedGroupStates = getGroupToggleStates($scope.settings.feed, $scope.feedToggles);
        settings.save();
    }

    // Hoisted functions ------------------------------------

    function syncAuthorize(provider){
        $scope.syncAuthLoading = true;
        SyncService.authorize(provider).then(function(response){
            $scope.syncAuthLoading = false;
        }).catch(function(){$scope.syncAuthLoading = false;})
    }

    function toggleGroup(groupsModel, toggleNames, toggleModel){
        // Change all the values for the toggles in the group to
        // match the state of the toggleModel
        _(toggleNames).forEach(function(toggle) {
            groupsModel[toggle] = toggleModel;
        }).value();
        // Then save
        settings.save()
    }

    function getGroupToggleStates(groupsModel, groupInfo){
        // Check the state of all the toggles in the groups.
        // Set the group to true of all the kids are true,
        // false if all the kids are false
        // or undefiend if they are mixed (advanced edit)
        var groupStates = {};
        _.each(groupInfo, function(group) {
            groupStates[group.name] = {states:[]};
            _.each(group.toggles, function(toggle) {
                groupStates[group.name].states.push(groupsModel[toggle]);
            });
        });
        // for each of the settings groups
        _.each(groupStates, function(__, state) {
            // get the on/off array
            _.each(groupStates[state], function(toggleStates, key) {
                // if there are two unique values in the array, this means
                // there was at least one on and at least one off toggle,
                // therefore return the 'undefined' state as they're hetrogenius
                if (_.uniq(toggleStates).length === 1) {
                    // only one result, therefore element 0 is a true indicator of all toggle states (true || false)
                    groupStates[state] = toggleStates[0];
                } else {
                    groupStates[state] = undefined;
                }
            });
        });
        return groupStates;
    }

    function highlightToggle(){
        if($stateParams.toggle){
            // Get parent toggle
            var parentToggle = getParentToggle();
            // If the toggle has a parent - expand the parent group
            if(parentToggle){
                var parentToggleEl = angular.element(document.getElementById(parentToggle));
                if(parentToggleEl){
                    parentToggleEl.scope().showPanel = true;
                }
            }
            // Else - the $stateParam is for a toggle group (not a sub toggle)

            // Highlight the toggle
            HighlightElement.scrollHighlightElement($stateParams.toggle, {offset: 100})
        }
    }

    function getStateToggles(){
        var toggles
        if($state.is('app.usersettings.email')){
            toggles = SettingsService.emailsToggles;
        }
        else if($state.is('app.usersettings.notifications')){
            toggles = SettingsService.notificationToggles;
        }
        else if($state.is('app.usersettings.feed')){
            toggles = SettingsService.feedToggles;
        }
        return toggles
    }

    function getParentToggle(){
        var parent
        var toggles = getStateToggles();
        _.forEach(toggles, function(toggleGroup){
            // If the toggleGroup contains the $stateParam
            if(toggleGroup.toggles.indexOf($stateParams.toggle) != -1){
                parent = toggleGroup.name
            }
        })
        return parent
    }
});











