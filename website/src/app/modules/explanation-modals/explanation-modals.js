angular.module('modules.explanation-modals', []);
angular.module('modules.explanation-modals').

directive('showExplanationModal', function ($mdDialog) {
    return {
        restrict: 'A',
        // attrs
        // showExplanationModal = 'modal path'
        link : function(scope, element, attrs){
            element.bind('click', function (event) {
                var validModals = ['project', 'field', 'thread', 'ambassador', 'job']
                if(validModals.indexOf(attrs.showExplanationModal) != -1){
                    $mdDialog.show({
                        template: require('./tpls/explanation-modal.html'),
                        controller: function($scope, $mdDialog){
                            $scope.modal = modalInfo[attrs.showExplanationModal];
                            $scope.cancel = $mdDialog.cancel; // function()
                        },
                        clickOutsideToClose: true,
                        targetEvent: event,
                    })
                }
                else{
                    console.error('Modal not found');
                }
            });

            var modalInfo = {
                project : {
                    title      : 'What is a project?',
                    body       : '<p>If it follows the scientific method, it can be a project on STEMN. Projects here are often experiments, research, and theses. If your idea helps unlock new knowledge, then we can help.</p>',
                    image      : 'assets/images/explanation-modals/droid.svg',
                    buttonText : 'Back to projects',
                },
                field : {
                    title      : 'What is a field?',
                    body       :
                        '<p>Fields are short for “scientific fields”, “scientific disciplines”, or “sciences”.</p>' +
                        '<p>Be sure to tag your projects and questions with appropriate fields so it is easy to find.</p>',
                    image      : 'assets/images/explanation-modals/rover.svg',
                    buttonText : 'Great, thanks!',
                },
                thread : {
                    title      : 'What is a thread?',
                    body       :
                        '<p>Threads can be anything you want to discuss:</p>'+
                        '<ul>'+
                            '<li>Technical questions</li>'+
                            '<li>Asking for feedback</li>'+
                            '<li>Recruiting new members to your team. </li>'+
                        '</ul>'+
                        '<p>How can the STEMN community help? Science is more fun with friends.</p>',
                    image      : 'assets/images/explanation-modals/telescope.svg',
                    buttonText : 'Back to threads',
                },
                ambassador : {
                    title      : 'Become an ambassador',
                    body       :
                        '<p>STEMN ambassadors get paid real $$$$ for everyone they signup at their company or university.</p>'+
                        '<p>Interested? Email <a class="text-green" href="mailto:ambassador@stemn.com">ambassador@stemn.com</a> to find out more.</p>',
                    image      : 'assets/images/explanation-modals/deal.svg',
                    buttonText : 'Back to referrals',
                },
                job : {
                    title      : 'How do STEMN jobs work?',
                    body       :
                        '<p>Once you have created a profile and added some projects to your portfolio you can apply for jobs.</p>'+
                        '<p>When you apply for a position, we\'ll pair you with a member of our Talent Team. They\'ll polish your application and prepare you for each company.</p>'+
                        '<p>You\'ll be introduced to our partner companies. Over <b>64% of applicants</b> via STEMN land interviews!</p>',
                    image      : 'assets/images/explanation-modals/moon-landing.svg',
                    buttonText : 'Back to jobs',
                },
            }
        }
    }
});
