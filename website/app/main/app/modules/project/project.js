angular.module('modules.project', [
    'modules.project.project-create-modal'
]);
angular.module('modules.project').

directive('clickCreateProject', function (ProjectCreateModalService) {
    return {
        restrict: 'A',
        scope: {
            project: '=?'
        },
        link : function(scope, element, attrs){
            element.bind('click', function (event) {
                ProjectCreateModalService.newProject(event, scope.project);
            });
        }
    }
}).

directive('projectTypeRadios', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/project/tpls/project-type-radios.html'
    }
}).

directive('projectLicenses', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/project/tpls/project-licenses.html',
        controller: function($scope, LicenseData){
            $scope.licenses = LicenseData.licenses;
            $scope.$watch('project.license', function(){
                $scope.license = _.find($scope.licenses, { 'type' : $scope.project.license })
            });
        }
    }
}).

service('ProjectStatusData', function () {
    return [
        {
            value: '1',
            text: 'Planned'
        },
        {
            value: '2',
            text: 'Underway'
        },
        {
            value: '3',
            text: 'Postponed'
        },
        {
            value: '4',
            text: 'Complete'
        },
        {
            value: '5',
            text: 'Cancelled'
        }
    ];
}).

service('LicenseData', function () {
    // If Symbols is a blank array, the display will show the name.
    return {
        licenses: [{
            type: 'CC BY',
            name: 'Creative Commons - Attribution',
            url: 'http://creativecommons.org/licenses/by/4.0/',
            symbols: ['cc', 'cc-by'],
            description: 'This license lets others distribute, remix, tweak, and build upon your work, even commercially, as long as they credit you for the original creation.'
        }, {
            type: 'CC BY-SA',
            name: 'Creative Commons - Attribution - Share Alike',
            url: 'http://creativecommons.org/licenses/by-sa/4.0/',
            symbols: ['cc', 'cc-by', 'cc-sa'],
            description: 'This license lets others remix, tweak, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms.'
        }, {
            type: 'CC BY-ND',
            name: 'Creative Commons - Attribution - No Derivatives',
            url: 'http://creativecommons.org/licenses/by-nd/4.0/',
            symbols: ['cc', 'cc-by', 'cc-nd'],
            description: 'This license allows for redistribution, commercial and non-commercial, as long as it is passed along unchanged and in whole, with credit to you.'
        }, {
            type: 'CC BY-NC',
            name: 'Creative Commons - Attribution - Non-Commercial',
            url: 'http://creativecommons.org/licenses/by-nc/4.0/',
            symbols: ['cc', 'cc-by', 'cc-nc'],
            description: 'This license lets others remix, tweak, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.'
        }, {
            type: 'CC BY-NC-SA',
            name: 'Creative Commons - Attribution - Non-Commercial - Share Alike',
            url: 'http://creativecommons.org/licenses/by-nc-sa/4.0/',
            symbols: ['cc', 'cc-by', 'cc-nd', 'cc-sa'],
            description: 'This license lets others remix, tweak, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.'
        }, {
            type: 'CC BY-NC-ND',
            name: 'Creative Commons - Attribution - Non-Commercial - No Derivatives',
            url: 'http://creativecommons.org/licenses/by-nc-nd/4.0/',
            symbols: ['cc', 'cc-by', 'cc-nd', 'cc-nc'],
            description: 'This license is the most restrictive of the Creative Commons licenses, only allowing others to download your works and share them with others as long as they credit you, but they can’t change them in any way or use them commercially.'
        }, {
            type: 'MPL',
            name: 'Mozilla Public License',
            url: 'https://www.mozilla.org/MPL/2.0/',
            symbols: [],
            description: 'The MPL allows source code to be mixed with other files under a different, even proprietary license. However, code files licensed under the MPL must remain under the MPL and freely available in source form.'
        }, {
            type: 'Other',
            name: 'Other License',
            url: '',
            symbols: [],
            description: 'Other License'
        }],
        symbols: {
            'cc': {
                tooltip: 'Creative Commons'
            },
            'cc-by': {
                tooltip: 'Attribution'
            },
            'cc-sa': {
                tooltip: 'Share-alike'
            },
            'cc-nd': {
                tooltip: 'No Derivative Works'
            },
            'cc-nc': {
                tooltip: 'Non-commercial'
            },
            'mozilla': {
                tooltip: 'Non-commercial'
            }
        }
    }
});
