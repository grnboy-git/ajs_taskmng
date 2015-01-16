<?php
session_start();
$controller = new ItemRestController();

//	JSON形式のPOSTの場合には強制的に配列に変換する
if(isset($_SERVER['CONTENT_TYPE'])){
$content_type_json = "application/json";
	$type = strtolower($_SERVER['CONTENT_TYPE']);
	if(substr($type,0,strlen($content_type_json)) == $content_type_json){
		$postdata = file_get_contents("php://input");
		$json = json_decode($postdata,true);
		$_REQUEST = $json;
	}
}

if(isset($_REQUEST['method'])){
	$method = $_REQUEST['method']."Action";
	if(method_exists($controller,$method)){
		$ret = call_user_func(array($controller,$method));
		if($ret !== null){
			header("Content-Type : application/json; charset=UTF-8");
			$data = array(
				'data' => $ret
			);
			print(json_encode($data));
		}
	}
	else{
		header("HTTP/1.0 404 Not Found");
		
	}
}
else{
	header("HTTP/1.0 403 Forbidden Request");
	
}

class ItemRestController{
	
	private $list = array();
	
	function ItemRestController(){
		
		if(isset($_SESSION['list'])){
			$this->list = $_SESSION['list'];
		}
		else{
			$this->list = array();
		}
	}
	
	function request($key){
		if(isset($_REQUEST[$key])){
			return $_REQUEST[$key];
		}
		else{
			return null;
		}
	}
	
	function listAction(){
		return $this->list;
	}
	
	function addAction(){
		$title = $this->request("title");
		$memo  = $this->request("memo");
		if($title && $memo){
			$item = array(
				'id'	=> md5(microtime(true)),
				'title' => $title,
				'memo'	=> $memo
			);
			$this->list[] = $item;
			$_SESSION["list"] = $this->list;
			return $item;
		}
		else{
			header("HTTP/1.0 400 Invalid Input");
		}
	}
	
	function deleteAction(){
		$id = $this->request("id");
		$new_list = array();
		$ret = null;
		foreach($this->list as $item){
			if($item['id'] != $id){
				$new_list[] = $item;
			}
			else{
				$ret = $item;
			}
		}
		$_SESSION["list"] = $new_list;
		return $ret;
		
	}
	
	
}
?>