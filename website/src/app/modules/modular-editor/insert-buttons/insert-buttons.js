import './insert-buttons.scss';

angular.module('modules.modular-editor.insert-buttons', [
]);
angular.module('modules.modular-editor.insert-buttons').
directive('editorInsertButtons', function (ModularEditorService, UploadsModalService, RealtimeEditorService, MediumEditorModalService, $timeout) {
	return {
		restrict: 'E',
		replace: true,
		template: require('./insert-buttons.html'),
		link: function(scope, element, attrs, ctrl){
			ctrl         = scope.ctrl;     // Pass Ctrl through scope
			var iElement = scope.iElement; // Pass iElement through scope

			// Tool buttons
			scope.toggleInsertTools = function () {
				scope.showInsertTools = !scope.showInsertTools;
			}
			scope.insertTextSection = function () {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				ModularEditorService.addNewSections({
					editorSections : scope.editorSections,
					editorOrder    : scope.editorOrder,
					sections       : [getNewTextSection()],
					location       : scope.editorSectionIndex
				});
				focusNewSection();
				var modifiedSections = getModifiedSections(2, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
				if(scope.editorOptions.realtime){RealtimeEditorService.addSections(modifiedSections, scope.editorOrder)}
			}
			scope.insertImage = function (event) {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				var selection = saveSelection();
				UploadsModalService.uploadImageNewModal(event).then(function (result) {
					restoreSelection(selection)
					ModularEditorService.addNewSections({
						editorSections : scope.editorSections,
						editorOrder    : scope.editorOrder,
						sections       : [ModularEditorService.getImageSection(result), getNewTextSection()],
						location       : scope.editorSectionIndex
					});
					focusNewSection();
					var modifiedSections = getModifiedSections(3, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
					if(scope.editorOptions.realtime){RealtimeEditorService.addSections(modifiedSections, scope.editorOrder)}
				});
			}
			scope.insertFiles = function (event) {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				var selection = saveSelection();
				UploadsModalService.uploadFiles(event).then(function (result) {
					restoreSelection(selection)
					ModularEditorService.addNewSections({
						editorSections : scope.editorSections,
						editorOrder    : scope.editorOrder,
						sections       : [ModularEditorService.getFileSection(result), getNewTextSection()],
						location       : scope.editorSectionIndex
					});
					var modifiedSections = getModifiedSections(3, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
					if(scope.editorOptions.realtime){RealtimeEditorService.addSections(modifiedSections, scope.editorOrder)}
				});
			}
			scope.insertVideo = function (event) {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				var selection = saveSelection();
				MediumEditorModalService.insertVideo(event).then(function (result) {
					restoreSelection(selection)
					ModularEditorService.addNewSections({
						editorSections : scope.editorSections,
						editorOrder    : scope.editorOrder,
						sections       : [ModularEditorService.getVideoSection(result), getNewTextSection()],
						location       : scope.editorSectionIndex
					});
					focusNewSection();
					var modifiedSections = getModifiedSections(3, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
					if(scope.editorOptions.realtime){RealtimeEditorService.addSections(modifiedSections, scope.editorOrder)}
				});
			}
			scope.insertMath = function (event) {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				ModularEditorService.addNewSections({
					editorSections : scope.editorSections,
					editorOrder    : scope.editorOrder,
					sections       : [ModularEditorService.getMathSection(), getNewTextSection()],
					location       : scope.editorSectionIndex
				});
				focusNewSection();
				var modifiedSections = getModifiedSections(3, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
				if(scope.editorOptions.realtime){RealtimeEditorService.addSections(modifiedSections, scope.editorOrder)}
			}
            scope.insertCode = function (event) {
				scope.showInsertButtons = false;
				scope.showInsertTools = false;
				ModularEditorService.addNewSections({
					editorSections : scope.editorSections,
					editorOrder    : scope.editorOrder,
					sections       : [ModularEditorService.getCodeSection(), getNewTextSection()],
					location       : scope.editorSectionIndex
				});
				focusNewSection();
				var modifiedSections = getModifiedSections(3, scope.editorSections, scope.editorOrder, scope.editorSectionIndex);
				if(scope.editorOptions.realtime){RealtimeEditorService.addSections(modifiedSections, scope.editorOrder)}
			}

			///////////////////////////////////////////////////////////////////////////////////////

			function getModifiedSections (number, editorSections, editorOrder, editorSectionIndex){
				// number is the number of fields modified
				var modifiedSections = {};
				if(number >= 1) modifiedSections[editorOrder[editorSectionIndex]]     = editorSections[editorOrder[editorSectionIndex]]
				if(number >= 2) modifiedSections[editorOrder[editorSectionIndex + 1]] = editorSections[editorOrder[editorSectionIndex + 1]]
				if(number >= 3) modifiedSections[editorOrder[editorSectionIndex + 2]] = editorSections[editorOrder[editorSectionIndex + 2]]
				return modifiedSections
			}
			function focusNewSection() {
				$timeout(function () {
					(scope.editorSections[scope.editorOrder[scope.editorSectionIndex + 1]].contentElement ||
					 scope.editorSections[scope.editorOrder[scope.editorSectionIndex + 1]].captionElement).focus();
				}, 100)
                // We update the model using the view
                ctrl.$setViewValue(iElement.html());
			}

			// Functions for extracting content after caret ---------------------------------------
			// http://stackoverflow.com/questions/5740640/contenteditable-extract-text-from-caret-to-end-of-element
			function getNewTextSection() {
				var newSectionContent = extractSectionContents();
				// Set newsectionContent to <p><br></p> if empty
				if(!newSectionContent
				   || newSectionContent == '<p class=""></p>' || newSectionContent == '<p></p>'
				   || newSectionContent == '<br>' || newSectionContent == '</br>'
				   || newSectionContent == '<h1></h1>' || newSectionContent == '<h2></h2>'){
					newSectionContent = ''
				}
				return 	ModularEditorService.getTextSection(newSectionContent);
			}

			function extractSectionContents() {
				var sel = window.getSelection();
				if (sel.rangeCount) {
					var selRange = sel.getRangeAt(0);
					var blockEl = getBlockContainer(selRange.endContainer);
					if (blockEl) {
						var range = selRange.cloneRange();
						range.selectNodeContents(blockEl);
						range.setStart(selRange.endContainer, selRange.endOffset);

						// Outputting the fragment content using a throwaway intermediary DOM element (div):
						var fragment = range.extractContents();
						var body = angular.element(document.body);
						var tempDiv = angular.element('<div class="hidden"></div>')
						body.append(tempDiv) // Append to body
						tempDiv.append(fragment); // Append fragment
						var innerHtml = tempDiv[0].innerHTML; // Get inner html
						tempDiv.remove(); // Remove temp div
						return innerHtml
					}
				}
			}

			function getBlockContainer(node) {
				while (node) {
					// Example block elements below, you may want to add more
					if (node.nodeType == 1 && node.hasAttribute('medium-editor')) {
						return node;
					}
					node = node.parentNode;
				}
			}

			// Functions for saving and restoring range -------------------------------------------
			// http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
			function saveSelection() {
				var savedRange
					// non IE Browsers
				if (window.getSelection) {
					savedRange = window.getSelection().getRangeAt(0);
				}
				// IE
				else if (document.selection) {
					savedRange = document.selection.createRange();
				}
				return savedRange
			}

			function restoreSelection(savedRange) {
				iElement.focus();
				if (savedRange !== null) {
					//non IE and there is already a selection
					if (window.getSelection) {
						var s = window.getSelection();
						if (s.rangeCount > 0)
							s.removeAllRanges();
						s.addRange(savedRange);
					}
					//non IE and no selection
					else if (document.createRange) {
						window.getSelection().addRange(savedRange);
					}
					//IE
					else if (document.selection) {
						savedRange.select();
					}
				}
			}
		}
	};
});
