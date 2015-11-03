/* globals $ */
/* eslint-env node, dirigible */

var entityLib = require('entity');
var entityJava2days_1 = require('java2days2015_1/test_lib');

handleRequest();

function handleRequest() {
	
	$.getResponse().setContentType("application/json; charset=UTF-8");
	$.getResponse().setCharacterEncoding("UTF-8");
	
	// get method type
	var method = $.getRequest().getMethod();
	method = method.toUpperCase();
	
	//get primary keys (one primary key is supported!)
	var idParameter = entityJava2days_1.getPrimaryKey();
	
	// retrieve the id as parameter if exist 
	var id = $.getXssUtils().escapeSql($.getRequest().getParameter(idParameter));
	var count = $.getXssUtils().escapeSql($.getRequest().getParameter('count'));
	var metadata = $.getXssUtils().escapeSql($.getRequest().getParameter('metadata'));
	var sort = $.getXssUtils().escapeSql($.getRequest().getParameter('sort'));
	var limit = $.getXssUtils().escapeSql($.getRequest().getParameter('limit'));
	var offset = $.getXssUtils().escapeSql($.getRequest().getParameter('offset'));
	var desc = $.getXssUtils().escapeSql($.getRequest().getParameter('desc'));
	
	if (limit === null) {
		limit = 100;
	}
	if (offset === null) {
		offset = 0;
	}
	
	if(!entityLib.hasConflictingParameters(id, count, metadata)) {
		// switch based on method type
		if ((method === 'POST')) {
			// create
			entityJava2days_1.createJava2days_1();
		} else if ((method === 'GET')) {
			// read
			if (id) {
				entityJava2days_1.readJava2days_1Entity(id);
			} else if (count !== null) {
				entityJava2days_1.countJava2days_1();
			} else if (metadata !== null) {
				entityJava2days_1.metadataJava2days_1();
			} else {
				entityJava2days_1.readJava2days_1List(limit, offset, sort, desc);
			}
		} else if ((method === 'PUT')) {
			// update
			entityJava2days_1.updateJava2days_1();    
		} else if ((method === 'DELETE')) {
			// delete
			if(entityLib.isInputParameterValid(idParameter)){
				entityJava2days_1.deleteJava2days_1(id);
			}
		} else {
			entityLib.printError($.getResponse().SC_BAD_REQUEST, 1, "Invalid HTTP Method");
		}
	}
	
	// flush and close the response
	$.getResponse().getWriter().flush();
	$.getResponse().getWriter().close();
}
