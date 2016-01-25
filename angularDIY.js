/**
 * Created by kuroky360 on 16-1-25.
 */
!function(window,document,undefined){

    var angular=window.angular||{},
        toString=Object.prototype.toString;
    //todo fns
    function copy(){

    }

    function extend(){

    }

    function isFunciton(value){return typeof value ==='function';}

    function noop(){}

    function isUndefined(value){return typeof value ==='undefined';}

    function isDefined(value){return typeof value !=='undefined';}

    function isString(value){return typeof value==='string';}

    function isObject(value){return value!==null&&typeof value==='object'}

    function isNumber(value){return typeof value === 'number'}

    function isDate(value){ toString.call(value)==='[object Date]'}

    function lowercase(value){return isString(value)?value.toLowerCase():value}

    function uppercase(value){return isString(value)?value.toUpperCase():value}

    function fromJson(value){
        return isString(value)?JSON.parse(value):value;
    }

    function toJson(value){
    }

    function setupModuleLoader(window) {

        function ensure(obj, child, factory) {
            return obj[child] || (obj[child] = factory());
        }

        var angular = ensure(window, angular, Object);

        return ensure(angular, 'module', function () {
            var modules = {};

            return function module(name, require, config) {
                if (require && modules.hasOwnProperty(name)) {
                    modules[name] = null;
                }
                return ensure(modules, name, function () {
                    var invokeQueue=[];
                    var configBlocks=[];
                    var runBlocks=[];
                    var moduleInstance={
                        _invokeQueue:invokeQueue,
                        _configBlock:configBlocks,
                        _runBlocks:runBlocks,
                        _require:require,
                        _name:name
                    };

                    function invokeLater(provider,method,insertMethod,queue){
                        if(!queue) queue=invokeQueue;
                        return function(){
                            queue[insertMethod||'push']([provider,method,arguments]);
                            return moduleInstance;
                        }
                    }

                    function invokeLaterAndSetModuleName(provider,method){
                        if(isFunciton(method)) method.$$moduleName=name;
                        return function(recipeName,factoryName){
                            invokeQueue.push([provider,method,arguments]);
                            return moduleInstance;
                        };
                    }
                });
            };
        });
    }


}(window,document);



