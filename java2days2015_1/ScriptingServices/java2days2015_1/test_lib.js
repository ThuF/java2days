/* globals $ */
/* eslint-env node, dirigible */

var ioLib = require('io');
var entityLib = require('entity');

// create entity by parsing JSON object from request body
exports.createJava2days_1 = function() {
    var input = ioLib.read($.getRequest().getInputStream());
    var requestBody = JSON.parse(input);
    var connection = $.getDatasource().getConnection();
    try {
        var sql = "INSERT INTO JAVA2DAYS_1 (";
        sql += "ID";
        sql += ",";
        sql += "NAME";
        sql += ") VALUES ("; 
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ")";

        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = $.getDatabaseUtils().getNext('JAVA2DAYS_1_ID');
        statement.setInt(++i, id);
        statement.setString(++i, requestBody.name);
        statement.executeUpdate();
		$.getResponse().getWriter().println(id);
        return id;
    } catch(e) {
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
    return -1;
};

// read single entity by id and print as JSON object to response
exports.readJava2days_1Entity = function(id) {
    var connection = $.getDatasource().getConnection();
    try {
        var result;
        var statement = connection.prepareStatement("SELECT * FROM JAVA2DAYS_1 WHERE " + exports.pkToSQL());
        statement.setInt(1, id);
        
        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            result = createEntity(resultSet);
        } else {
        	entityLib.printError($.getResponse().SC_NOT_FOUND, 1, "Record with id: " + id + " does not exist.");
        }
        var jsonResponse = JSON.stringify(result, null, 2);
        $.getResponse().getWriter().println(jsonResponse);
    } catch(e){
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

// read all entities and print them as JSON array to response
exports.readJava2days_1List = function(limit, offset, sort, desc) {
    var connection = $.getDatasource().getConnection();
    try {
        var result = [];
        var sql = "SELECT ";
        if (limit !== null && offset !== null) {
            sql += " " + $.getDatabaseUtils().createTopAndStart(limit, offset);
        }
        sql += " * FROM JAVA2DAYS_1";
        if (sort !== null) {
            sql += " ORDER BY " + sort;
        }
        if (sort !== null && desc !== null) {
            sql += " DESC ";
        }
        if (limit !== null && offset !== null) {
            sql += " " + $.getDatabaseUtils().createLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
        var jsonResponse = JSON.stringify(result, null, 2);
        $.getResponse().getWriter().println(jsonResponse);
    } catch(e){
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

//create entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.id = resultSet.getInt("ID");
    result.name = resultSet.getString("NAME");
    return result;
}

function convertToDateString(date) {
    var fullYear = date.getFullYear();
    var month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
    var dateOfMonth = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return fullYear + "/" + month + "/" + dateOfMonth;
}

// update entity by id
exports.updateJava2days_1 = function() {
    var input = ioLib.read($.getRequest().getInputStream());
    var responseBody = JSON.parse(input);
    var connection = $.getDatasource().getConnection();
    try {
        var sql = "UPDATE JAVA2DAYS_1 SET ";
        sql += "NAME = ?";
        sql += " WHERE ID = ?";
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, responseBody.name);
        var id = responseBody.id;
        statement.setInt(++i, id);
        statement.executeUpdate();
		$.getResponse().getWriter().println(id);
    } catch(e){
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

// delete entity
exports.deleteJava2days_1 = function(id) {
    var connection = $.getDatasource().getConnection();
    try {
        var statement = connection.prepareStatement("DELETE FROM JAVA2DAYS_1 WHERE " + exports.pkToSQL());
        statement.setString(1, id);
        statement.executeUpdate();
        $.getResponse().getWriter().println(id);
    } catch(e){
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

exports.countJava2days_1 = function() {
    var count = 0;
    var connection = $.getDatasource().getConnection();
    try {
        var statement = connection.createStatement();
        var rs = statement.executeQuery('SELECT COUNT(*) FROM JAVA2DAYS_1');
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } catch(e){
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
    $.getResponse().getWriter().println(count);
};

exports.metadataJava2days_1 = function() {
	var entityMetadata = {
		name: 'java2days_1',
		type: 'object',
		properties: []
	};
	
	var propertyid = {
		name: 'id',
		type: 'integer',
	key: 'true',
	required: 'true'
	};
    entityMetadata.properties.push(propertyid);

	var propertyname = {
		name: 'name',
		type: 'string'
	};
    entityMetadata.properties.push(propertyname);


	$.getResponse().getWriter().println(JSON.stringify(entityMetadata));
};

exports.getPrimaryKeys = function() {
    var result = [];
    var i = 0;
    result[i++] = 'ID';
    if (result === 0) {
        throw $.getExceptionUtils().createException("There is no primary key");
    } else if(result.length > 1) {
        throw $.getExceptionUtils().createException("More than one Primary Key is not supported.");
    }
    return result;
};

exports.getPrimaryKey = function() {
	return exports.getPrimaryKeys()[0].toLowerCase();
};

exports.pkToSQL = function() {
    var pks = exports.getPrimaryKeys();
    return pks[0] + " = ?";
};