(function(module){
    'use strict';
    module.service('Items',function($rootScope,$http){
        //return new app.AjaxItems($rootScope,$http);
        return new app.ArrayItems($rootScope);
    });
}(TodoModule));