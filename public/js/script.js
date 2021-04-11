"use strict";

var age;
age = prompt('your age?');
var grovCondition = age >= 18;

if (grovCondition) {
  var message = "access.permited";
  console.log(message);
} else {
  var _message = "access.denied";
  console.log(_message);
}