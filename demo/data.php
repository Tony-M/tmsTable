<?php
header("Content-type: application/json; charset=utf-8");

$result = json_decode(file_get_contents('data.json'),true);

$result['success'] = true;


$data = $result['rows'];

$result ['total'] = count($result['rows']);
$result['rows'] = array();

$order_dir =strtolower( $_POST['order_dir']);
if(!in_array($order_dir, array('asc','desc')))$order_dir = 'asc';

$page = (int)$_POST['page'];
$result['page']= $page;

$row_num = abs((int)$_POST['row_num']);
$pages = ceil($result ['total']/$row_num);
$result['page_num'] = $pages;


if($order_dir=='asc'){

    for($i=($page-1)*$row_num;$i<$page*$row_num;$i++){
        if(isset($data[$i]))$result['rows'][] = $data[$i];
    }
}else{
    for($i=$result ['total']-$row_num*($page-1)-1; $i>= $result ['total']-$row_num*($page);$i--){
//        echo 'i='.$i.PHP_EOL;
        if(isset($data[$i]))$result['rows'][] = $data[$i];
    }

}

echo json_encode($result);

