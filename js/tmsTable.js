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
     * columns data - array of rows
     * @type {Array}
     * @private
     */
    var _tbl_col = [];


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

        tmsTable.instances.push(this);
        return this;

    }


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


    this.setColNames = function (col_names) {
        if (col_names === undefined || col_names === null || !Array.isArray(col_names)) {
            this.errorWrongColNames();
        }

        _tbl_col_names = col_names;

        return true;
    }


    this.render = function () {
        if (_tbl_container_id === null)this.errorWrongId();

        var container = $('#' + _tbl_container_id);
        var table_id = this.getTableId();
        var table = $('<table/>').attr('id', table_id);


        var thead = $('<thead/>');
        table.append(thead);

        var h_row = $('<tr/>');
        var n = _tbl_col_names.length;
        for (i = 0; i < n; i++) {
            var h_td = $('<td/>').text(_tbl_col_names[i]);
            h_row.append(h_td);
        }
        thead.append(h_row);


        container.append(table);
    }


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

    this.errorWrongColNames = function () {
        throw 'Error: Invalid Column Names';
    }

    this.constructor(params);


}