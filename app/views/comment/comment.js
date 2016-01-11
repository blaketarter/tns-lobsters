'use strict';

var app = require('application');
var http = require('fetch');
var observable = require('data/observable');
var observableArray = require('data/observable-array');
var frameModule = require("ui/frame");

var utilityModule = require('utils/utils');
var view = require('ui/core/view');

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

exports.longPressComment = function(args) {
  console.log('longpress');
  
  let object = args.object;
  let parent = object._parent;
  let domId = object._domId;
  let index = null;
  let comment = null;
  let childrenComments = [];

  for (let i = 0, ii = parent._subViews.length; i < ii; i++) {
    if (parent._subViews[i]._domId === domId) {
      index = 0;
    }
  }

  comment = pageData.comments.getItem(index);
  childrenComments = findChildrenComments(index, comment, pageData.comments);

  toggleComments(pageData.comments, comment, childrenComments, object);
};

function openUrl(event) {
  utilityModule.openUrl(event.object.text);
}

function findChildrenComments(startIndex, comment, comments) {
  let childrenComments = [];
  let indentLevel = comment.indentLevel;

  for (let i = startIndex + 1 , ii = comments.length; i < ii; i++) {
    if (comments.getItem(i).indentLevel > indentLevel) {
      childrenComments.push(comments.getItem(i));
    } else {
      break;
    }
  }

  return childrenComments;
}

function toggleComments(comments, target, children, view) {
  comments.getItem(target.index).collapse = !comments.getItem(target.index).collapse;

  console.log( comments.getItem(target.index).collapse );

  for (let i = 0, ii = children.length; i < ii; i++) {
    comments.getItem(children[i].index).commentCollapse = !comments.getItem(children[i].index).commentCollapse;

    // console.log(view._parent._subViews[i].refresh());

    console.log(comments.getItem(children[i].index).commentCollapse );
  }
}
