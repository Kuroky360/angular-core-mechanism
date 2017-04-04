'use strict';

// framework

    // scope
    var Scope=function(){

        this.$$watchers=[];

        this.$watch=function(watcherFn,listenerFn){
            this.$$watchers.push({
                watchFn:watcherFn,
                listenerFn:listenerFn
            })
        };

        this.digest=function(){
            this.$$watchers.forEach(function(watcher){
                var newValue = watcher.watchFn();
                var oldValue = watcher.last;
                if(newValue !== oldValue){
                    watcher.listenerFn(newValue,oldValue);
                    watcher.last = newValue;
                }
            });
        };

        this.$apply = function(exprFn){
            try{
                exprFn();
            }finally{
                this.digest();
            }
        }
    };

    var $scope=new Scope();

    //compiler
    var $$directives= {
        'ng-bind': function ($scope, $element, $attributes) {
            $scope.$watch(function () {
                return $scope[$attributes['ng-bind'].value];
            }, function (newValue) {
                $element.innerHTML = newValue;
            });
        },
        'ng-model': function ($scope, $element, $attributes) {
            $scope.$watch(function () {
                return $scope[$attributes['ng-model'].value];
            }, function (newValue) {
                $element.value = newValue;
            });
            
            $element.addEventListener('keyup', function () {
                $scope.$apply(function(){
                    $scope[$attributes['ng-model'].value]= $element.value;
                });
            });
        }
    };

    var $compile = function(element,$scope){
        console.log('$compile',element);
        Array.prototype.forEach.call(element.children,function(child){
            $compile(child,$scope);
        });

        Array.prototype.forEach.call(element.attributes,function(attribute){
            var directive = $$directives[attribute.name];
            if(directive){
                directive($scope,element,element.attributes);
            }
        });
    };

    $compile(document.body,$scope);

// test & logs
