import './checklist.scss';

angular.module('modules.checklist', []);
angular.module('modules.checklist').

directive('checklistItem', function () {
    return {
        restrict: 'E',
		transclude: true,
        scope: {
			itemComplete : '=',
			itemHref     : '=',
			itemClick    : '=',
        },
        template: require('./tpls/checklist-item.html'),
    };
});
