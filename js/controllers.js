(function(module){
    'use strict';
    /**
     *  ページ全体の操作
     */
    module.controller('pageController',function($scope,$timeout,Items){

        //  表示する要素の管理
        $scope.show = {
            list : true,
            add  : false,
            info : false
        };

        //  ワーニング等のメッセージ表示
        $scope.message = {
            type : 'alert-info',
            text : '',
            show : false
        };

        //  表示する要素を変更する
        $scope.changePage = function(type){
            for(var name in $scope.show){
                if(name == type){
                    $scope.show[name] = true;
                }
                else{
                    $scope.show[name] = false;
                }
            }
            if(type == 'info'){
                var item = Items.getCurrentItem();
                $scope.active = item;
            }
        };

        $scope.deleteItem = function(){
            var item = Items.getCurrentItem();
            Items.remove(item,function(){
                $scope.changePage('list');
                $scope.showMessage({
                    type : 'alert-warning',
                    text : '削除しました',
                    show : true
                });
            });
        };

        $scope.showMessage = function(msg){
            $scope.message = msg;
            $timeout(function(){
                $scope.message.show = false;
            },3000);
        };
    });

    module.controller('listController',function($scope,Items){

        $scope.items = [];

        //  一覧データを取得する
        Items.list(function(list){
            $scope.items = list;
        });

        $scope.show = function(item){
            Items.setCurrentItem(item);
            $scope.$parent.changePage('info');
        };

        $scope.$on('changeItems',function(){
            Items.list(function(list){
                $scope.items = list;
            });
        });
    });

    /**
     *  タスクアイテムの作成（フォーム処理）
     */
    module.controller('addController',function($scope,Items){

        //  追加用のタスクViewモデル
        $scope.item = {
        };

        $scope.addItem = function(){
            if(!$scope.addItemForm.$valid) {
                alert('入力エラーです');
                return;
            }
            Items.add($scope.item,function(data){
                //   登録された場合には、一覧を表示する
                $scope.$parent.showMessage({
                    type : 'alert-info',
                    text : '追加しました',
                    show : true
                });
                $scope.$parent.changePage('list');
                $scope.item = {};

            });
        }
    });
}(TodoModule));