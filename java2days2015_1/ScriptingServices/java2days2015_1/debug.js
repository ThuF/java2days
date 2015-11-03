/* globals $ */
/* eslint-env node, dirigible */

var a = 1;
var b = 3;
var c = 5;

var sum = a + b + c;

var message = "Hello " + sum;

$.getResponse().getWriter().print(message);
