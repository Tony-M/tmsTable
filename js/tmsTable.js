/**
 *
 * @param params {Object}  keys: <br\>
 *    id: {string} Required - id of container
 *    col_names: {array} Required - array of column titles
 *    col: {array} Required - data model for data mapping
 */
tmsTable = function (params) {

    var VERSION = '15.05.19';
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

    /**
     * data url
     * @type {string}
     * @private
     */
    var _tbl_url = '';

    /**
     * Order direction asc|desc
     * @type {string}
     * @private
     */
    var _tbl_order_direction = 'asc';

    /**
     * Order by cell
     * @type {string}
     * @private
     */
    var _tbl_order_by = '';

    /**
     * are rows selectable or not
     * @type {boolean}
     * @private
     */
    var _tbl_selectable = false;

    /**
     * array of selected indexes. -1 = all
     * @type {Array}
     * @private
     */
    var _tbl_selected_rows = [];

    /**
     * selected rows per page. Default 10
     * @type integer
     * @private
     */
    var _tbl_rowNum = 10;

    /**
     * avaliable rowNum values
     * @type array
     * @private
     */
    var _tbl_rowNums = [];


    /**
     * show or hide table header
     * @type boolean
     * @privete
     */
    var _tbl_show_table_header = true;

    /**
     * show or hide table footer
     * @type boolean
     * @privete
     */
    var _tbl_show_table_footer = true;
    /**
     * default doubleclick event
     * @param rowId
     * @param rowData
     * @private
     */
    var _tbl_row_dblClick = function (rowId, rowData) {

    }
    /**
     * default click event
     * @param rowId
     * @param rowData
     * @private
     */
    var _tbl_row_click = function (rowId, rowData) {

    }

    /**
     * post vars key-value pairs
     * @type Object
     * @private
     */
    var _tbl_post_vars = {}


    /**
     *
     * @param rowId - row index
     * @param rowData - row object data
     * @param rowObject row object
     * @param cellValue value for current cell
     * @returns {*}
     * @private
     */
    var _tbl_cell_decorator = function (rowId, rowData, rowObject, cellValue) {
        return cellValue;
    }

    var _tbl_after_row_insert = function (rowId, rowData, rowObject) {

        return;
    }

    var __table = null;
    var __thead = null;
    var __tbody = null;
    var __tfoot = null;
    var __ajax_indicator = null;
    var __select_page = null;
    var __span_pages = null;
    var __span_total = null;


    /**
     * index of last selected tbody row
     * @type integer default null
     * @private
     */
    var __last_selected_row_index = null;
    /**
     * array of lables
     * @type {{reload: string, first_page: string, last_page: string, previous_page: string, next_page: string, current_page: string, rows: string, total_rows: string, asc: string, desc: string, of: string, ajax_indicator: string}}
     * @private
     */
    var _tbl_LABLES = {
        reload: 'Reload'
        , first_page: 'First page'
        , last_page: 'Last page'
        , previous_page: 'Previous page'
        , next_page: 'Next page'
        , current_page: 'Current page'
        , rows: 'Rows'
        , total_rows: 'Total records'
        , asc: 'Sort by ASC'
        , desc: 'Sort by DESC'
        , of: 'of'
        , ajax_indicator: 'Waiting for server response'
    }

    /**
     * List of instanses
     * @type {Array}
     */
    tmsTable.instances = [];

    this.in_array = function (needle, haystack, strict) {	// Checks if a value exists in an array
        var found = false, key, strict = !!strict;

        for (key in haystack) {
            if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
                found = true;
                break;
            }
        }

        return found;
    }

    this.merge_options = function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    }

    this.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    }

    this.isFloat = function (n) {
        return n === Number(n) && n % 1 !== 0
    }


    /**
     * Constructor
     * @param params
     * @returns {tmsTable}
     */
    this.constructor = function (params) {

        if (tmsTable.LOCALE !== undefined && typeof (tmsTable.LOCALE) === 'object') {
            _tbl_LABLES = this.merge_options(_tbl_LABLES, tmsTable.LOCALE);
        }

        if (params === undefined) {
            throw ('params are not defined');
        }

        // checking of id
        if (params.id === undefined) {
            this.errorWrongId();
        } else {
            this.setId(params.id);
        }

        if (params.selectable !== undefined && params.selectable) {
            _tbl_selectable = true;
        }
        else {
            _tbl_selectable = false;

        }


        if (params.postVars !== undefined && typeof params.postVars === 'object') {
            for (var k in params.postVars) {
                if (params.postVars.hasOwnProperty(k)) {
                    _tbl_post_vars[k] = params.postVars[k];
                }
            }
        } else {
            if (params.postVars !== undefined && typeof params.postVars !== 'object') {
                this.errorWrongPostVars();
            }
        }

        if (params.show_table_header !== undefined && params.show_table_header !== true && params.show_table_header !== false) {
            this.errorWrongIsNotBoolean();
        } else {
            if (params.show_table_header !== undefined) {
                _tbl_show_table_header = params.show_table_header;
            }
        }

        if (params.show_table_footer !== undefined && params.show_table_footer !== true && params.show_table_footer !== false) {
            this.errorWrongIsNotBoolean();
        } else {
            if (params.show_table_footer !== undefined) {
                _tbl_show_table_footer = params.show_table_footer;
            }
        }

        if (params.rowNums !== undefined) {
            if (!Array.isArray(params.rowNums)) {
                this.errorWrongRowNumsType();
            }

            var n = params.rowNums.length;
            for (var i = 0; i < n; i++) {
                if (!this.in_array(params.rowNums[i]), _tbl_rowNums) {
                    if (this.isInt(params.rowNums[i]) && params.rowNums[i] >= 0) {
                        _tbl_rowNums.push(params.rowNums[i]);
                    }
                }
            }
        }


        if (params.rowNum !== undefined) {
            if (!this.isInt(params.rowNum) || params.rowNum < 0) {
                this.errorWrongRowNumType();
            }

            if (_tbl_rowNums.length > 0 && !this.in_array(params.rowNum, _tbl_rowNums)) {
                this.errorWrongRowNum();
            }

            _tbl_rowNum = params.rowNum;
        } else {
            if (_tbl_rowNums.length > 0) {
                _tbl_rowNum = _tbl_rowNums[0];
            }
        }


        // checking of column names
        if (params.col_names === undefined || params.col_names === null || !Array.isArray(params.col_names)) {
            this.errorWrongColNames();
        } else {
            this.setColNames(params.col_names);
        }

        // checking data identity map
        if (params.cols === undefined || params.cols === null || !Array.isArray(params.cols)) {
            this.errorWrongCols();
        } else {
            this.setCols(params.cols);
        }

        if (params.order_by === undefined || params.order_by === null) {
            _tbl_order_by = _tbl_cols[0].index;
        } else {
            for (i = 0; i < _tbl_cols.length; i++) {
                if (params.order_by == _tbl_cols[i].index) {
                    _tbl_order_by = params.order_by;
                    break;
                }
            }
            if (_tbl_order_by == '')
                _tbl_order_by = _tbl_cols[0].index;


        }

        if (params.order_direction === undefined || params.order_direction === null) {
            _tbl_order_direction = 'asc';
        } else {
            if (params.order_direction == '')params.order_direction = 'asc';
            params.order_direction = params.order_direction.toLowerCase();
            if (params.order_direction != 'asc' && params.order_direction != 'desc') this.errorWrongOrderDirection();

            _tbl_order_direction = params.order_direction;
        }

        // checking for dataType
        if (params.dataType === undefined || params.dataType === null || Array.isArray(params.dataType)) {
            this.errorWrongDataType(1);
        } else {
            if (params.dataType != 'array' && params.dataType != 'jsonp') {
                this.errorWrongDataType();
            }
            this.setDataType(params.dataType);

            if (params.dataType == 'array') {
                // checking data src
                if (params.src === undefined || params.src === null || Array.isArray(params.src)) {
                    this.errorWrongDataSrc(1);
                } else {
                    this.setSrc(params.src);
                }
            }
            if (params.dataType == 'jsonp') {

                if (params.url === undefined || params.url == '') {
                    this.errorWrongUrl();
                }
                else {
                    this.setUrl(params.url);
                    this.loadRows();
                }

            }
        }


        if (params.class !== undefined && params.class != '') {
            this.setCssClassName(params.class);
        }

        if (params.click !== undefined) {
            _tbl_row_click = params.click;
        }
        if (params.dblClick !== undefined) {
            _tbl_row_dblClick = params.dblClick;
        }
        if (params.afterInsertRow !== undefined) {
            _tbl_after_row_insert = params.afterInsertRow;
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
    this.setCssClassName = function (class_name) {
        if (class_name === undefined)this.errorWrongClass();

        if (class_name !== undefined && class_name != '') {
            _tbl_class = class_name;
            return true;
        }
        return false;
    }
    /**
     * Set url to remote server data provider
     * @param url
     * @returns {boolean}
     */
    this.setUrl = function (url) {
        if (url === undefined)this.errorWrongUrl();

        if (url !== undefined && url != '') {
            _tbl_url = url;
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

    /**
     * Set data from remote response or local array
     * @param data
     * @returns {boolean}
     */
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

            //result = [];


            for (i = 0; i < rows_num; i++) {
                //result_row = {};
                for (j = 0; j < cols_num; j++) {
                    var key = _tbl_cols[j].name;
                    if (rows[i][key] === undefined)this.errorUndefinedSrcIndex();
                    //result_row[key] = rows[i][key];
                }
                //result.push(result_row);
            }
            _tbl_data = null;
            _tbl_data = [];
            _tbl_data = rows;
            return true;

        }
    }

    /**
     * Reload table rows - refreshing table
     * @returns {boolean}
     */
    this.reloadRows = function () {
        if (_tbl_dataType == 'array') {
            __tbody.empty();
            this.reloadTBODY(__tbody);
            return true;
        }
        if (_tbl_dataType == 'jsonp') {

            this.loadRows();
            __tbody.empty();
            this.reloadTBODY(__tbody);

            __span_pages.text(_tbl_page_num);
            __span_total.text(_tbl_total);
            __select_page.val(_tbl_page);
            return true;
        }
        this.errorWrongDataType(_tbl_dataType);
        return false;
    }


    /**
     * set data mapping scheme
     * @param cols
     * @returns {boolean}
     */
    this.setCols = function (cols) {
        if (cols === undefined || cols === null || !Array.isArray(cols))this.errorWrongCols('- undefined | null | wrong type');
        var n = cols.length;
        if (!n)this.errorWrongCols('- zero length');
        for (i = 0; i < n; i++) {

            if (cols[i].index === undefined || cols[i].index === null || Array.isArray(cols[i].index) || cols[i].index == '')this.errorWrongCols('- index param');
            if (cols[i].name === undefined || cols[i].name === null || Array.isArray(cols[i].name) || cols[i].name == '')this.errorWrongCols('- name param');
            var width = null;
            if (cols[i].width !== undefined && cols[i].width !== null) {
                var r_num = /^[0-9]+$/;
                if (r_num.test(cols[i].width))
                    width = cols[i].width + 'px';
            }
            if (cols[i].sortable === undefined || typeof(cols[i].sortable) != "boolean") {
                cols[i].sortable = 11;
            }

            if (cols[i].decorator === undefined) {
                cols[i].decorator = _tbl_cell_decorator
            }

            cols[i].width = width;

        }
        _tbl_cols = cols;
        return true;
    }

    /**
     * render result table view
     */
    this.render = function () {
        var this_object = this;
        if (_tbl_container_id === null)this.errorWrongId();

        __ajax_indicator = $('<div/>').addClass('tmsTable_ajax_indicator').addClass('hidden').append($('<div/>').text(_tbl_LABLES.ajax_indicator));
        $('body').append(__ajax_indicator);

        var container = $('#' + _tbl_container_id);

        container.addClass('tmsTable tmsTable_container')
        var table_id = this.getTableId();
        __table = $('<table/>').attr('id', table_id);
        __table.addClass('tmsTable');
        if (_tbl_class != '') {
            __table.addClass(_tbl_class);
        }

        __thead = $('<thead/>');
        if (_tbl_show_table_header === false)__thead.css('display', 'none');
        __table.append(__thead);

        var h_row = $('<tr/>');

        if (_tbl_selectable) {
            var td_select = $('<th/>').css('width', '20px');
            var chbx = $('<input/>').attr('type', 'checkbox').change(function () {
                this_object.setSelected(-1)
            });
            td_select.append(chbx);
            h_row.append(td_select);
        }

        var columns_number = _tbl_col_names.length;
        for (i = 0; i < columns_number; i++) {
            var h_td = $('<th/>').text(_tbl_col_names[i]);

            if (_tbl_cols[i].width !== null) {
                h_td.css('width', _tbl_cols[i].width)
            }

            if (_tbl_cols[i].sortable) {
                var sort = $('<span/>');
                var sort_asc = $('<span/>').addClass('orderasc').html('&#9651;').attr('title', _tbl_LABLES.asc);
                var sort_desc = $('<span/>').addClass('orderdesc').html('&#9661;').attr('title', _tbl_LABLES.desc);
                if (_tbl_order_by == _tbl_cols[i].index) {
                    if (_tbl_order_direction == 'asc')
                        sort_desc.addClass('hidden');
                    else
                        sort_asc.addClass('hidden');
                } else {
                    sort_desc.addClass('hidden');
                    sort_asc.addClass('hidden');
                }
                sort.append(sort_asc).append(sort_desc);

                h_td.attr('sidx', _tbl_cols[i].index).append(sort);
                h_td.bind('click', function () {
                    this_object.orderBy($(this).attr('sidx'));
                    h_row.find('.orderasc, .orderdesc').each(function () {
                        if (!$(this).hasClass('hidden'))$(this).addClass('hidden');
                    });
                    $(this).find('.order' + _tbl_order_direction + ':first').removeClass('hidden');
                })
            }

            h_row.append(h_td);
        }
        __thead.append(h_row);

        __tbody = $('<tbody/>');

        this.reloadTBODY(__tbody);

        __table.append(__tbody)


        __tfoot = $('<tfoot/>');
        if (_tbl_show_table_footer === false)__tfoot.css('display', 'none');
        var tfoot_tr = $('<tr/>');
        var tfoot_td = $('<td/>').attr('colspan', (_tbl_selectable ? columns_number + 1 : columns_number));
        tfoot_tr.append(tfoot_td);
        __tfoot.append(tfoot_tr);

        __select_page = $('<input/>').val(_tbl_page).attr('type', 'text');
        __select_page.addClass('page_select');


        var a_refresh = $('<a/>').attr('class', 'table_refresh').text(_tbl_LABLES.reload);
        tfoot_td.append(a_refresh);

        var a_gofirts = $('<a/>').addClass('gofirts').attr('title', _tbl_LABLES.first_page);
        tfoot_td.append(a_gofirts);

        var a_goprevious = $('<a/>').addClass('goprevious').attr('title', _tbl_LABLES.previous_page);
        tfoot_td.append(a_goprevious);


        tfoot_td.append($('<label/>').text(_tbl_LABLES.current_page + ':'));
        tfoot_td.append(__select_page);
        var label_pages = $('<label/>').html(' ' + _tbl_LABLES.of + ': <span>' + _tbl_page_num + '</span>; ');
        __span_pages = label_pages.find('span:first');
        tfoot_td.append(label_pages);

        __span_total = $('<span/>').text(_tbl_total);
        tfoot_td.append($('<label/>').text(' ' + _tbl_LABLES.total_rows + ': ').append(__span_total));


        var a_gonext = $('<a/>').addClass('gonext').attr('title', _tbl_LABLES.next_page);
        tfoot_td.append(a_gonext);

        var a_golast = $('<a/>').addClass('golast').attr('title', _tbl_LABLES.last_page);
        tfoot_td.append(a_golast);

        if (_tbl_rowNums.length > 0) {
            select_rowNums = $('<select/>').addClass('row_on_page');
            for (var ri = 0; ri < _tbl_rowNums.length; ri++) {
                var ri_opt = $('<option/>').attr('value', _tbl_rowNums[ri]).text(_tbl_rowNums[ri]);
                select_rowNums.append(ri_opt);
            }
            tfoot_td.append($('<label/>').text(' ' + _tbl_LABLES.rows + ': '));
            tfoot_td.append(select_rowNums);


            select_rowNums.val(_tbl_rowNum);
            select_rowNums.bind('change', function () {
                this_object.unselectAllRows();
                _tbl_rowNum = select_rowNums.val();

                this_object.reloadRows()
            })
        }

        __select_page.bind('change', function () {
            this_object.unselectAllRows();

            this_object.reloadRows()
        })
        a_refresh.bind('click', function () {
            this_object.reloadRows()
        })

        a_gofirts.bind('click', function () {
            this_object.goToPage(1);
        })
        a_golast.bind('click', function () {
            this_object.goToPage(_tbl_page_num);
        })
        a_gonext.bind('click', function () {
            this_object.goToPage(parseInt(_tbl_page) + 1);
        })
        a_goprevious.bind('click', function () {
            this_object.goToPage(parseInt(_tbl_page) - 1);
        })


        __table.append(__tfoot);
        container.append(__table);
    }

    /**
     * Load data for selected page and refresh table
     * @param page
     */
    this.goToPage = function (page) {
        this.unselectAllRows();

        if (page < 1)page = 1;
        if (page > _tbl_page_num)page = _tbl_page_num;

        __select_page.val(page);
        __select_page.change();
    }

    /**
     * select row or all rows by index
     * @param row_index int
     * @param tbody
     * @returns {boolean}
     */
    this.setSelected = function (row_index, tbody) {
        var this_obj = this;

        if (row_index == -1) {
            if (_tbl_selected_rows == -1) {
                _tbl_selected_rows = null;
                __thead.find('tr').find('th:first').find('input').prop('checked', false);
                __tbody.find('tr').find('td:first').find('input').prop('checked', false);
            } else {
                _tbl_selected_rows = -1;
                __thead.find('tr').find('th:first').find('input').prop('checked', true);
                __tbody.find('tr').find('td:first').find('input').prop('checked', true);
            }
            __tbody.find('tr').each(function () {
                this_obj.SelectDeselectRow($(this), true)
            })
            __last_selected_row_index = null;
            return true;
        } else {

            var last_selected_row_index = __last_selected_row_index; // id последней выбранной строки
            var is_last_selected_row_really_selected = false; // былали последняя кликнутая строке выбранной?

            if (last_selected_row_index !== null) {
                var is_last_selected_row_really_selected = __tbody.find('tr:eq(' + last_selected_row_index + ')').hasClass('selected');
            }

            var current_row = __tbody.find('tr:eq(' + row_index + ')');
            var is_current_row_selected = current_row.hasClass('selected');

            // если клавиша не зажата то тупо снять выделение со всего и выделить только одну запись
            if (!window.event.ctrlKey && !window.event.shiftKey) {
                _tbl_selected_rows = null;
                __thead.find('tr').find('th:first').find('input').prop('checked', false);
                __tbody.find('tr').find('td:first').find('input').prop('checked', false);
                __tbody.find('tr').each(function () {
                    this_obj.SelectDeselectRow($(this), true);
                })


                __tbody.find('tr').eq(row_index).find('td:first').find('input').prop('checked', true);
                this_obj.SelectDeselectRow(current_row, true);
                __last_selected_row_index = row_index;
                return true;
            }

            if (window.event.ctrlKey) {

                // уже выбрано все
                if (_tbl_selected_rows == -1) {
                    _tbl_selected_rows = null;
                    __thead.find('tr').find('th:first').find('input').prop('checked', false);

                    current_row.prop('checked', false);
                    this_obj.SelectDeselectRow(current_row, true)
                    __last_selected_row_index = row_index;
                    return true;
                } else {
                    _tbl_selected_rows = null;
                    if (is_current_row_selected) {
                        current_row.prop('checked', false);
                        this_obj.SelectDeselectRow(current_row, true);
                        __last_selected_row_index = row_index; //----------------------- null
                        return true;
                    } else {
                        current_row.prop('checked', true);
                        this_obj.SelectDeselectRow(current_row, true);
                        __last_selected_row_index = row_index;
                        return true;
                    }

                }

            }


            if (window.event.shiftKey && __last_selected_row_index !== null) {
                if (is_last_selected_row_really_selected) {
                    //SELECT
                    if (last_selected_row_index <= row_index - 1) {
                        for (var ri = last_selected_row_index + 1; ri <= row_index; ri++) {
                            if (!__tbody.find('tr').eq(ri).find('td:first').find('input').prop('checked')) {
                                __tbody.find('tr').eq(ri).find('td:first').find('input').prop('checked', true);
                                _tbl_selected_rows = null;
                                this_obj.SelectDeselectRow(__tbody.find('tr').eq(ri), true)
                            }
                        }
                        _tbl_selected_rows = null;
                    }
                    if (last_selected_row_index >= row_index + 1) {
                        for (ri = row_index + 1; ri <= last_selected_row_index; ri++) {
                            if (!__tbody.find('tr').eq(ri).find('td:first').find('input').prop('checked')) {
                                __tbody.find('tr').eq(ri).find('td:first').find('input').prop('checked', true);
                                _tbl_selected_rows = null;
                                this_obj.SelectDeselectRow(__tbody.find('tr').eq(ri), true)
                            }
                        }
                        _tbl_selected_rows = null;
                    }
                } else {
                    //DESELECT
                    if (last_selected_row_index <= row_index - 1) {
                        for (var ri = last_selected_row_index + 1; ri <= row_index; ri++) {
                            __tbody.find('tr').eq(ri).find('td:first').find('input').prop('checked', false);
                            this_obj.SelectDeselectRow(__tbody.find('tr').eq(ri), true)
                        }
                    }

                    if (last_selected_row_index >= row_index + 1) {
                        for (ri = row_index; ri <= last_selected_row_index; ri++) {
                                    __tbody.find('tr').eq(ri).find('td:first').find('input').prop('checked', false);
                                    this_obj.SelectDeselectRow(__tbody.find('tr').eq(ri), true)
                        }
                    }
                    return true;
                }
            } else {
                _tbl_selected_rows = null;
                __thead.find('tr').find('th:first').find('input').prop('checked', false);
                __tbody.find('tr').find('td:first').find('input').prop('checked', false);
                __tbody.find('tr').each(function () {
                    this_obj.SelectDeselectRow($(this), true);
                })

                __tbody.find('tr').eq(row_index).find('td:first').find('input').prop('checked', true);
                this_obj.SelectDeselectRow(current_row, true);
                __last_selected_row_index = row_index;
                return true;
            }


        }


        return true;

    }

    /**
     * return array of selected indexes. If all rows (of the table) must be selected, then returns [-1]
     * @returns {Array}
     */
    this.getSelectedIndexes = function () {
        var result = [];

        __tbody.find('tr.selected').each(function () {
            result.push($(this).index())
        });
        return result;
    }

    /**
     * return rowdata by row index
     * @param index int
     * @returns {*}
     */
    this.getRowData = function (index) {
        var re = /^[0-9]+$/;
        if (index == -1) {
            return _tbl_data;
        }

        if (re.test(index)) {
            if (_tbl_data[index] !== undefined)return _tbl_data[index];
        }
        return false;
    }

    /**
     * reRender body part of table
     * @param tbody
     */
    this.reloadTBODY = function (tbody) {
        var this_object = this;
        n = _tbl_data.length;
        for (var i = 0; i < n; i++) {
            var body_row = $('<tr/>');

            if (_tbl_row_dblClick !== null) {
                body_row.bind('dblclick', function () {
                    var rowId = $(this).index();
                    _tbl_row_dblClick(rowId, _tbl_data[rowId])
                });
            }
            if (_tbl_row_click !== null) {
                body_row.bind('click', function () {
                    var rowId = $(this).index();
                    if (_tbl_selectable) {
                        if (!$(this).find('td:first input').prop('checked')) {
                            $(this).find('td:first input').prop('checked', true);
                        }
                        else {
                            $(this).find('td:first input').prop('checked', false);
                        }
                        this_object.SelectDeselectRow($(this));
                    }
                    _tbl_row_click(rowId, _tbl_data[rowId])
                });
            }

            var col_num = _tbl_cols.length;
            var row_num = _tbl_data.length;

            if (_tbl_selectable) {
                var td_select = $('<td/>');

                var chbx = $('<input/>').attr('type', 'checkbox').change(function () {
                    var my_tr = $(this).closest('tr');
                    //my_tr.click();

                    $(this).prop('checked', $(this).prop('checked') ? false : true);

                    //this_object.setSelected(my_tr.index())
                    //this_object.SelectDeselectRow(my_tr);
                });
                td_select.append(chbx);
                body_row.append(td_select);
            }

            for (ci = 0; ci < col_num; ci++) {
                td = $('<td/>');
                if (_tbl_data[i][_tbl_cols[ci].index] !== undefined) {
                    //td.html(_tbl_data[i][_tbl_cols[ci].index]);

                    td.html(_tbl_cols[ci].decorator(i, _tbl_data[i], body_row, _tbl_data[i][_tbl_cols[ci].index]))

                    body_row.append(td);
                }
            }
            //for (var key in _tbl_data[i]) {
            //    td = $('<td/>');
            //    td.html(_tbl_data[i][key]);
            //
            //    //_tbl_cols[ridx].decorator()
            //
            //    body_row.append(td);
            //    ridx++;
            //}

            tbody.append(body_row);

            _tbl_after_row_insert(i, _tbl_data[i], body_row);
        }
    }

    this.SelectDeselectRow = function (row_obj, only_css) {
        if (only_css === undefined)only_css = false;
        if (!only_css) {
            this.setSelected(row_obj.index());
        }
        if (!row_obj.hasClass('selected') && row_obj.find('td:first').find('input:first').prop('checked')) {
            row_obj.addClass('selected');
        } else {
            if (row_obj.hasClass('selected') && !row_obj.find('td:first').find('input:first').prop('checked')) {
                row_obj.removeClass('selected')
            }
        }
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
     * ajax load data from remote data provider
     */
    this.loadRows = function () {
        if (_tbl_url == '')this.errorWrongUrl();

        thisobj = this;

        post_data = {};

        post_data = _tbl_post_vars;

        post_data.order_by = _tbl_order_by;
        post_data.order_dir = _tbl_order_direction;
        post_data.page = (__select_page === null ? 1 : __select_page.val());
        post_data.row_num = _tbl_rowNum;

        var ajax_indicator = __ajax_indicator;

        $.ajax({
            type: "POST",
            url: _tbl_url,
            dataType: 'json',
            data: post_data,
            async: false,
            statusCode: {
                404: function () {
                    throw 'page 404';
                }
                , 500: function () {
                    throw  'page 500';
                }
            }
            , beforeSend: function () {
                var t = thisobj.getTableId();
                var t = $('#' + t).find('tbody:first');
                var height = t.height();
                var width = t.width();
                var position = t.position();

                if (width !== null && height !== null && position !== undefined) {

                    ajax_indicator.css('top', position.top).css('left', position.left).height(height).width(width);
                    ajax_indicator.find('div:first').css('margin-top', height / 2);
                    if (ajax_indicator.hasClass('hidden')) {
                        ajax_indicator.removeClass('hidden');
                    }
                }

            }
            , success: function (response) {
                if (response.success != undefined && response.success) {
                    thisobj.setSrc(response);
                }
                else {
                    if (response.msg !== undefined) {
                        throw response.msg;
                    }
                }
            }
            , complete: function () {
                if (!$(ajax_indicator).hasClass('hidden'))$(ajax_indicator).addClass('hidden');
            }
        });
    }

    /**
     * change ordering of rows
     * @param order_by
     * @param direction
     */
    this.orderBy = function (order_by) {
        if (_tbl_order_by == order_by) {
            _tbl_order_direction = (_tbl_order_direction == 'asc' ? 'desc' : 'asc');
        } else {
            _tbl_order_by = order_by;
            _tbl_order_direction = 'asc';
        }
        this.unselectAllRows();
        this.reloadRows();
    }


    this.unselectAllRows = function () {
        _tbl_selected_rows = [];
        __tbody.find('tr').find('td:first').find('input').prop('checked', false);
        __thead.find('tr').find('th:first').find('input').prop('checked', false);

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
        throw 'Error: Wrong data srs ' + (text === undefined ? '' : text);
    }

    /**
     * throw error Wrong src data type
     */
    this.errorWrongDataType = function (text) {
        throw 'Error: Wrong src Data type ' + (text === undefined ? '' : text);
    }

    /**
     * throw error wrong column model
     */
    this.errorWrongCols = function (text) {
        throw 'Error: Wrong column model ' + (text === undefined ? '' : text);
    }

    /**
     * throw error wrong url
     */
    this.errorWrongUrl = function () {
        throw 'Error: Wrong url';
    }

    /**
     * throw error number of column names isn`t equal ti number of columns in identity map
     */
    this.errorWrongColsAndColsNamesNum = function () {
        throw 'Error: number of column names isn`t equal ti number of columns in identity map';
    }

    /**
     * throw error in src data does not exists current index from cols model
     */
    this.errorUndefinedSrcIndex = function () {
        throw 'Error: Undefined index in Src data';
    }

    /**
     * throw error wrong order diraction (asc|desc)
     */
    this.errorWrongOrderDirection = function () {
        throw 'Error: Wrong sort order';
    }

    this.errorWrongRowNumsType = function () {
        throw 'Error: wrong type of rowNums. Must be Array.';
    }

    this.errorWrongRowNumType = function () {
        throw 'Error: wrong type of rowNum. Must be Int.';
    }

    this.errorWrongRowNum = function () {
        throw 'Error: wrong rowNum. Must be one of defined rowNums values.';
    }

    this.errorWrongIsNotBoolean = function () {
        throw 'Error: wrong type of boolean parametr.';
    }

    this.errorWrongPostVars = function () {
        throw 'Error: post vars error.';
    }

    this.constructor(params);


}
