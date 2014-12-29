/**
 *
 * @param params {Object}  keys: <br\>
 *    id: {string} Required - id of container
 *    col_names: {array} Required - array of column titles
 *    col: {array} Required - data model for data mapping
 */
tmsTable = function (params) {

    /**
     * table DOM id
     * @type {string}
     * @private
     */
    var _tbl_container_id = null

    /**
     * column titles
     * @type {Array}
     * @private
     */
    var _tbl_col_names = [];

    /**
     * identity map for columns and src data
     * @type {Array}
     * @private
     */
    var _tbl_cols = [];

    /**
     * data type array|jsonp
     * @type {string}
     * @private
     */
    var _tbl_dataType = null;

    /**
     * current page number
     * @type {number}
     * @private
     */
    var _tbl_page = 1;

    /**
     * total number of pages
     * @type {number}
     * @private
     */
    var _tbl_page_num = 1;

    /**
     * total rows number
     * @type {number}
     * @private
     */
    var _tbl_total = 0;

    /**
     * data rows
     * @type {Array}
     * @private
     */
    var _tbl_src = [];

    /**
     * result data to display
     * @type {Array}
     * @private
     */
    var _tbl_data = [];


    /**
     * CSS class
     * @type {string}
     * @private
     */
    var _tbl_class = '';


    tmsTable.instances = [];


    this.constructor = function (params) {
        //console.log( "I'm mad! " );
        if (params === undefined) {
            throw ('params are not defined');
        }

        // checking of id
        if (params.id === undefined) {
            this.errorWrongId();
        } else {
            this.setId(params.id);
        }

        // checking of column names
        if (params.col_names === undefined || params.col_names === null || !Array.isArray(params.col_names)) {
            this.errorWrongColNames();
        } else {
            this.setColNames(params.col_names);
        }

        // checking for dataType
        if (params.dataType === undefined || params.dataType === null || Array.isArray(params.dataType)) {
            this.errorWrongDataType(1);
        } else {
            if (params.dataType != 'array' && params.dataType != 'jsonp') {
                this.errorWrongDataType();
            }
            this.setDataType(params.dataType);
        }

        // checking data identity map
        if (params.cols === undefined || params.cols === null || !Array.isArray(params.cols)) {
            this.errorWrongCols();
        } else {
            this.setCols(params.cols);
        }

        // checking data src
        if (params.src === undefined || params.src === null || Array.isArray(params.src)) {
            this.errorWrongDataSrc(1);
        } else {
            this.setSrc(params.src);
        }

        if(params.class!==undefined && params.class !=''){
            this.setCssClassName(params.class);
        }


        // add instance to collection of same type objects
        tmsTable.instances.push(this);
        return this;

    }

    /**
     * Set css classes for table
     * @param class_name
     * @returns {boolean}
     */
    this.setCssClassName = function (class_name){
        if(class_name===undefined)this.errorWrongClass();

        if(class_name!==undefined && class_name!=''){
            _tbl_class = class_name;
            return true;
        }
        return false;
    }


    /**
     * set id of table container
     * @param id string
     * @returns {boolean}
     */
    this.setId = function (id) {
        if (id === undefined || id === null || id == '') {
            this.errorWrongId();
        }

        var table = $('#' + id);
        if (!table) {
            throw 'Table container with id #' + id + ' not found';
        }

        _tbl_container_id = id;
        return true;
    }


    /**
     * set table column titles
     * @param col_names array of strings
     * @returns {boolean}
     */
    this.setColNames = function (col_names) {
        if (col_names === undefined || col_names === null || !Array.isArray(col_names)) {
            this.errorWrongColNames();
        }

        _tbl_col_names = col_names;

        return true;
    }

    /**
     * Set src data type
     * @param dataType string  values:  array|jsonp
     * @returns {boolean}
     */
    this.setDataType = function (dataType) {
        if (dataType === undefined || dataType === null || Array.isArray(dataType)) {
            this.errorWrongDataType();
        } else {
            if (dataType != 'array' && dataType != 'jsonp') {
                this.errorWrongDataType();
            }
        }
        _tbl_dataType = dataType;
        return true;
    }

    this.setSrc = function (data) {
        if (data === undefined || data === null || Array.isArray(data)) {
            this.errorWrongDataSrc();
        } else {

            var r_num = /^[0-9]+$/;


            if (data.page === undefined || data.page === null || !r_num.test(data.page))this.errorWrongDataSrc('- page param');
            if (data.page_num === undefined || data.page_num === null || !r_num.test(data.page_num))this.errorWrongDataSrc('- page_num param');
            if (data.total === undefined || data.total === null || !r_num.test(data.total))this.errorWrongDataSrc('- total param');

            if (data.rows === undefined || data.rows === null || !Array.isArray(data.rows))this.errorWrongDataSrc('- rows param');

            _tbl_page = data.page;
            _tbl_page_num = data.page_num;
            _tbl_total = data.total;

            var rows = data.rows;
            rows_num = rows.length;


            cols_name_num = _tbl_col_names.length;
            if (!cols_name_num)this.errorWrongColNames(); // no column titles


            cols_num = _tbl_cols.length;
            if (!cols_num)this.errorWrongCols();

            if (cols_name_num != cols_num)this.errorWrongColsAndColsNamesNum()

            result = [];


            for (i = 0; i < rows_num; i++) {
                result_row = {};
                for (j = 0; j < cols_num; j++) {
                    var key = _tbl_cols[j].name;
                    if (rows[i][key] === undefined)this.errorUndefinedSrcIndex();
                    result_row[key] = rows[i][key];
                }
                result.push(result_row);
            }
            _tbl_data = null;
            _tbl_data = [];
            _tbl_data = result;
            return true;

        }
    }

    this.setCols = function (cols) {
        if (cols === undefined || cols === null || !Array.isArray(cols))this.errorWrongCols('- undefined | null | wrong type');
        var n = cols.length;
        if (!n)this.errorWrongCols('- zero length');
        for (i = 0; i < n; i++) {

            if (cols[i].index === undefined || cols[i].index === null || Array.isArray(cols[i].index) || cols[i].index == '')this.errorWrongCols('- index param');
            if (cols[i].name === undefined || cols[i].name === null || Array.isArray(cols[i].name) || cols[i].name == '')this.errorWrongCols('- name param');
        }
        _tbl_cols = cols;
        return true;
    }

    /**
     * render result table view
     */
    this.render = function () {
        if (_tbl_container_id === null)this.errorWrongId();

        var container = $('#' + _tbl_container_id);
        var table_id = this.getTableId();
        var table = $('<table/>').attr('id', table_id);

        if(_tbl_class!=''){
            table.addClass(_tbl_class);
        }

        var thead = $('<thead/>');
        table.append(thead);

        var h_row = $('<tr/>');
        var columns_number = _tbl_col_names.length;
        for (i = 0; i < columns_number; i++) {
            var h_td = $('<th/>').text(_tbl_col_names[i]);
            h_row.append(h_td);
        }
        thead.append(h_row);

        tbody = $('<tbody/>');

        n = _tbl_data.length;
        for(i=0;i<n;i++){
            body_row = $('<tr/>');

            for (var key in _tbl_data[i]) {
                td = $('<td/>');
                td.html(_tbl_data[i][key]);

                body_row.append(td);
            }

            tbody.append(body_row);
        }
        table.append(tbody)


        container.append(table);
    }


    /**
     * return name of table in selectcet container
     * @returns {string}
     */
    this.getTableId = function () {
        if (_tbl_container_id === null)this.errorWrongId();
        return 'tbl_' + _tbl_container_id;
    }


    /**
     * throw error ID is not defined
     */
    this.errorWrongId = function () {
        throw 'Error: Invalid table ID';
    }

    /**
     * throw error Wrong css class
     */
    this.errorWrongClass = function () {
        throw 'Error: Invalid css class';
    }

    /**
     * throw error Worong column names
     */
    this.errorWrongColNames = function () {
        throw 'Error: Invalid Column Names';
    }

    /**
     * throw error Wrong data src
     */
    this.errorWrongDataSrc = function (text) {
        throw 'Error: Wrong data srs '+(text===undefined?'':text);
    }

    /**
     * throw error Wrong src data type
     */
    this.errorWrongDataType = function (text) {
        throw 'Error: Wrong src Data type '+(text===undefined?'':text);
    }

    /**
     * throw error wrong column model
     */
    this.errorWrongCols = function (text) {
        throw 'Error: Wrong column model '+(text===undefined?'':text);
    }

    /**
     * throw error number of column names isn`t equal ti number of columns in identity map
     */
    this.errorWrongColsAndColsNamesNum = function () {
        throw 'Error: number of column names isn`t equal ti number of columns in identity map';
    }
    this.errorUndefinedSrcIndex = function () {
        throw 'Error: Undefined index in Src data';
    }

    this.constructor(params);


}