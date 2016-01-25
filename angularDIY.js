/**
 * Created by kuroky360 on 16-1-25.
 */
!function(window,document,undefined){
    var angular=window.angular||{};
    //todo fns
    function extend(){

    }

    function isFunciton(value){
        return typeof value ==='function';
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



