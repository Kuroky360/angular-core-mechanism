/**
 * Created by kuroky360 on 16-1-25.
 */
!function(window,document,undefined){
    // initial variable
    var angular=window.angular||{},
        toString=Object.prototype.toString;
    // shadow & deep
    function copy(){

    }
    // shadow & deep
    function extend(){

    }

    ////////////////////////////////////
    // Error handler todo
    ////////////////////////////////////

    ////////////////////////////////////
    // Event handler todo
    ////////////////////////////////////


    ////////////////////////////////////
    // Http $q promise todo
    ////////////////////////////////////

    ////////////////////////////////////
    // dom selectors fn todo
    ////////////////////////////////////


    ////////////////////////////////////
    // fn utils
    ////////////////////////////////////
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

    function identity($){return $;}

    function toJson(value){
    }

    function valueFn(value){
        return function(){
            return value;
        }
    }

    function toInt(value){
        return parseInt(value,10);
    }

    function isArray(value){ return Array.isArray(value);}

    // module loader setup
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

    //bootstrap fn
    function bootstrap(element,modules,config){
        var modules=modules||[],
            instaneInjector;

        modules.unshift('ng');
        modules.push(['$provide',function($provide){
            $provide.value('$rootElement',element);
        }]);

        instaneInjector = createInjector(modules);
    }

    // annotate fn
    function annotate(fn){
        var $injectArray=[];
        return $injectArray;
    }

    //injector creator
    function createInjector(){
        var providerSufix='Provider',
            INSTANTING={},
            path=[],
            providerCache={
                $provide:{
                    provider:supportObject(provider),
                    factory:supportObject(factory),
                    service:supportObject(service),
                    value:supportObject(value)
                }
            },
            providerInjector=(providerCache.$injector=createInternalInjector(providerCache,function(seviceName,caller){
                throw new Error('can not found provider!');
            })),
            instanceCache={},
            instanceInjector=(instanceCache.$injector=createInternalInjector(instanceCache,function(serviceName,caller){
                var provider = providerInjector.get(serviceName+providerSufix,caller);
                instanceCache.invoke(provider.$get,provider,undefined,serviceName);
            }));

        //support object arg
        function supportObject(delegate){
            return function(key,value){
                if(isObject(key)){
                    /*forEach(name,function(value,index){
                        fn(index,value);
                    })*/
                }else{
                    return delegate(key,value);
                }
            }
        }
        //provider
        function provider(name,provider_){
            if(isFunciton(provider_)||isArray(provider_)){
                provider_ = providerInjector.instantiate(provider_);
            }
            if(!provider_.$get){
                throw new Error('do not have $get method!');
            }
            return  providerCache[name+providerSufix]=provider_;
        }

        function enForceReturnValue(factoryFn){
            return function(){
                var result=instanceCache.invoke(factoryFn);
                return result;
            };
        }

        //facotry
        function factory(name,factoryFn,enForce){
            return provider(name,{
                $get:enForce===false?enForceReturnValue(factoryFn):factoryFn
            });
        }

        //service
        function service(name,contructor){
            return factory(name,['$injector',function($injector){
                return $injector.instantiate(contructor);
            }]);
        }

        //value
        function value(name,value){
            return factory(name,valueFn(value),false);
        }


        ////////////////////////////////////
        // internal injector
        ////////////////////////////////////
        function createInternalInjector(cache,factory){

            // get service
            function getService(serviceName,caller){
                if(cache.hasOwnProperty(serviceName)){
                    if(cache[serviceName]===INSTANTING){
                        throw new Error('重复循环依赖！');
                    }
                    return cache[serviceName];
                }else{
                    cache[serviceName]=INSTANTING;
                    //path.push(serviceName);
                    return  cache[serviceName]=factory(serviceName,caller);
                }
            }

            //invoke fn
            function invoke(fn,self,locals,serviceName){
                var length,
                    args=[],
                    i,
                    item,
                    annotateArray=annotate(fn);
                for(i=0,length=annotateArray.length;i<length;i++){
                    item=annotateArray[i];
                    args.push(locals&&locals.hasOwnProperty(item)?locals[item]:getService(item,serviceName));
                }

                if(isArray(fn)){
                    fn=fn[fn.length-1];
                }

                return fn.call(self,args);
            }

            // intantiate instace
            function instantiate(type,locals,serviceName){
                var instance = Object.create((isArray(type)? type[type.length-1]:type).prototype||null);
                var returnValue = invoke(type,instance,locals,serviceName);

                return isObject(returnValue)|| isFunciton(returnValue)?returnValue:instance;
            }

            return {
                instantiate:instantiate,
                invoke:invoke,
                get:getService
            };
        }
    }


}(window,document);



