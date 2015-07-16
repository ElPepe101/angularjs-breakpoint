var breakpointApp = angular.module('breakpointApp',[]);

breakpointApp.directive('breakpoint', ['$window', '$rootScope', function($window, $rootScope){
    return {
        restrict:"A",
        link:function(scope, element, attr){
            scope.breakpoint = {class:'', windowSize:$window.innerWidth }; // Initialise Values

            var breakpoints = (scope.$eval(attr.breakpoint));

            angular.element($window).bind('resize', setWindowSize);

            scope.$watch('breakpoint.windowSize', function(windowWidth, oldValue){
                setClass(windowWidth);
            });

            scope.$watch('breakpoint.class', function(newClass, oldClass) {
                if (newClass != oldClass) broadcastEvent(oldClass);
            });

            function broadcastEvent (oldClass) {
                $rootScope.$broadcast('breakpointChange', scope.breakpoint, oldClass);
            }

            function setWindowSize (){
                scope.breakpoint.windowSize = $window.innerWidth;
                if(!scope.$$phase) scope.$apply();
            }

            function setClass(windowWidth){
                var setClass = breakpoints[Object.keys(breakpoints)[0]];
                // divide the window width by the HTML font size to get the em value
                var fontsize = parseFloat(windowWidth / $window.getComputedStyle(document.getElementsByTagName('html')[0], null).getPropertyValue('font-size').replace(/px/g, ''));

                for (var breakpoint in breakpoints){
                    if(breakpoint.indexOf('em') != -1) windowWidth = fontsize;
                    if (parseFloat(breakpoint.replace(/em/g, '')) < windowWidth) setClass = breakpoints[breakpoint];
                    element.removeClass(breakpoints[breakpoint]);
                }
                element.addClass(setClass);
                scope.breakpoint.class  = setClass;
                if(!scope.$$phase) scope.$apply();
            }
        }
    };
}]);
