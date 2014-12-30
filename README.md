tmsTable
========

tmsTable - небольшой плагин для удобного представления табличных данных на сайте.

##Зависимости##

*  [JQuery](http://jquery.com/)

tmsTable изначально задуман как удобный инструмент, который не должен требовать много усилий по настройке и интеграции в страницы сайта.
Как следствие зависит только от jQuery.

##Использование##

tmsTable может работать с 2 типами данных
* array - локальные данные в массиве объектов
* jsonp - данные на удаленном хосте. данные в формате json

Подключение требуемых файлов:

**Аскетично:**

    <link rel="stylesheet" href="css/tmsTable.css">
    <script src="js/jquery-1.10.2.min.js" type="application/x-javascript"></script>
    <script src="js/tmsTable.js" type="application/x-javascript"></script>


**С элементами bootstrap 3**

    <link rel="stylesheet" href="bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="bootstrap/dist/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="css/tmsTable.css">

    <script src="js/jquery-1.10.2.min.js" type="application/x-javascript"></script>
    <script src="bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="js/tmsTable.js" type="application/x-javascript"></script>

	
Для создания таблицы на странице сайта нужно определить контейнер, который будет содержать табличку

	<div id="json_ttt"></div>

Далее нужно понять с каким типом данных мы работаем. Для простоты буду рассматривать jsonp поскольку он будет нужен в подавляющем большинстве сллучаев.

	<script>
	json_params = {
	        id: 'json_ttt'
	        , class: 'table table-bordered table-striped table-hover'
	        , col_names: ['id', 'title', 'date']
	        , dataType: 'jsonp'
	        , url: 'data.json'
	        , order_direction: 'asc'
	        , order_by: 'title'
	        , cols: [
	            {index: 'id', name: 'id', width: 100}
	            , {index: 'title', name: 'title'}
	            , {index: 'date', name: 'date', width: 100}
	        ]
	//        , dblClick: function (rowId, rowData) {
	//            console.log(rowId, rowData);
	//        }
	//        , click: function (rowId, rowData) {
	//            console.log(rowId, rowData);
	//        }
	    };
	    
	var json_tbl = new tmsTable(json_params)
    json_tbl.render();
	</script>
	
###Опции###
**id** - идентификатор контейнера таблицы

**class** - дополнительные css-классы для стилизации таблички

**col_names** - наименования колонок таблицы

**dataType** - тип провайдера данных

**url** - источник данных *(только для jsonp)*

**order_direction** - тип упорядочивания выборки asc | desc

**order_by** - index по которому будет производиться упорядочивание (берется из блока cols. Если order_by не задан, то упорядочивание будет по первой колонке)

**cols** - Блок позволяющий задать отображение данных в таблице.

**dblClick** - определяет событие на событие doubleclick по строке таблицы 

**click** - определяет событие на событие clickпо строке таблицы 

####Опции cols####
**name** - уникальное имя колонки таблицы

**index** - id определяющий источник данных в приходящем json

**width** - рациональный параметр, задающий ширину колонки. Задавать можно с указанием размерности (px|%) или без. Если размерность не задана, то считается что размер указан в px
