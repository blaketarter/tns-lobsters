'use strict';

var app = require('application');
var http = require('fetch');
var observable = require('data/observable');
var observableArray = require('data/observable-array');

var utilityModule = require('utils/utils');

var pageData = new observable.Observable({
    comments: new observableArray.ObservableArray([]),
    post: new observable.Observable()
});

exports.pageNavigatedTo = function(args) {
  var page = args.object;
  page.bindingContext = pageData;
  
  pageData.post = page.navigationContext.post;
  pageData.comments = pageData.post.comments;

  pageData.post.reload(true);
};

exports.openUrl = openUrl;

function openUrl(event) {
  utilityModule.openUrl(event.object.text);
}
