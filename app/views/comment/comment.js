"use strict";

var app = require('application');
var http = require('fetch');
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var moment = require('moment');
var striptags = require('striptags');

var view = require("ui/core/view");
var frameModule = require("ui/frame");

var utilityModule = require("utils/utils");
var color = require('color');

var pageData = new observable.Observable({
    comments: new observableArray.ObservableArray([]),
    post: new observable.Observable()
});

exports.pageNavigatedTo = function(args) {
  var page = args.object;
  page.bindingContext = pageData;
  
  pageData.post = formatPost(page.navigationContext.post);
  pageData.comments = new observableArray.ObservableArray([]);

  getComments(pageData.post.comments_url);
};

exports.openUrl = openUrl;

function buildCommentData(raw) {
  raw.map(function(rawComment) {
    rawComment.created = formatDate(rawComment.created_at);
    rawComment.sanitized_comment = striptags(rawComment.comment);
    pageData.comments.push(rawComment);
  });
}

function formatDate(date) {
  return moment(date).fromNow();
}

function formatPost(post) {
  var returnVal = post;

  if (post && post.description && post.description.length) {
    returnVal.description = striptags(returnVal.description);
  }

  return returnVal;
}

function openUrl(event) {
  utilityModule.openUrl(event.object.text);
}

function getComments(commentUrl) {
  http.fetch(commentUrl + '.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      buildCommentData(data.comments);
    });
}
