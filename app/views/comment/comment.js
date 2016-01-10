'use strict';

var app = require('application');
var http = require('fetch');
var observable = require('data/observable');
var observableArray = require('data/observable-array');
var frameModule = require("ui/frame");

var utilityModule = require('utils/utils');

var pageData = new observable.Observable({
    comments: new observableArray.ObservableArray([]),
    post: new observable.Observable(),
    isLoading: true
});

exports.pageNavigatedTo = function(args) {
  var page = args.object;
  page.bindingContext = pageData;
  
  pageData.post = page.navigationContext.post;
  pageData.comments = pageData.post.comments;

  pageData.post.reload(true)
    .then(function() {
      pageData.isLoading = false;
    });
};

exports.shownModally = function(args) {
  var page = args.object;
  page.bindingContext = pageData;
  let closeCallback = args.closeCallback;
  
  pageData.post = args.context;
  pageData.comments = pageData.post.comments;

  pageData.post.reload(true);
};

exports.openUrl = openUrl;

exports.navTap = function() {
  var topmost = frameModule.topmost();
  topmost.goBack();
};

function openUrl(event) {
  utilityModule.openUrl(event.object.text);
}
