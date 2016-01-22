'use strict';

var app = require('application');
var http = require('fetch');
var observable = require('data/observable');
var observableArray = require('data/observable-array');
var frameModule = require("ui/frame");
var vibrator = require("nativescript-vibrate");

var utilityModule = require('utils/utils');
require('../../shared/utils/utils');
var view = require('ui/core/view');

var socialShare = require("nativescript-social-share");

var pageData = new observable.Observable({
    comments: new observableArray.ObservableArray([]),
    post: new observable.Observable(),
    isLoading: true
});

exports.pageNavigatedTo = function(args) {
  var page = args.object;
  page.bindingContext = pageData;
  pageData.isLoading = true;
  
  pageData.post = page.navigationContext.post;
  pageData.comments = pageData.post.comments;

  pageData.post.reload(true)
    .then(function() {
      pageData.isLoading = false;

      if (!pageData.post.sanitizedDescription.trim().length) {
        global.getElementsByClassName('post-description')[0].setInlineStyle(
          'height: 0; margin-top: 0; margin-bottom: 0;'
        );
      } else {
        global.getElementsByClassName('post-description')[0].setInlineStyle(
          ''
        );
      }
    });
};

exports.openUrl = openUrl;

exports.navTap = function() {
  var topmost = frameModule.topmost();
  topmost.goBack();
};

exports.reload = function() {
  if (!pageData.isLoading) {
    pageData.isLoading = true;
    pageData.post.reload(true)
      .then(function() {
        pageData.isLoading = false;
      });
  }
};

exports.share = function(args) {
  let url = args.object.classList[0];

  socialShare.shareText(url, 'Share');
};

exports.longPressComment = function(args) {
  let object = args.object;
  let parent = object._parent;
  let domId = object._domId;
  let index = null;
  let comment = null;
  let childrenComments = [];

  vibrator.vibration(15);

  for (let i = 0, ii = parent._subViews.length; i < ii; i++) {
    if (parent._subViews[i]._domId === domId) {
      index = i;
    }
  }

  comment = pageData.comments.getItem(index);
  childrenComments = findChildrenComments(index, comment, pageData.comments);

  toggleComments(pageData.comments, comment, childrenComments, object, object._parent);
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

function toggleComments(comments, target, children, view, parent) {
  comments.getItem(target.index).collapse = !comments.getItem(target.index).collapse;

  if (!target.originalHeight) {
    target.originalHeight = view.getMeasuredHeight();
  }

  view.setInlineStyle(
    (target.collapse) ? 'height: 32; background-color: #efefef;' : 'height: initial; background-color: white;'
  );

  view.getElementsByClassName('comment-inner')[0].setInlineStyle(
    (target.collapse) ? 'background-color: #efefef;' : 'background-color: white;'
  );

  for (let i = 0, ii = children.length; i < ii; i++) {
    let child = comments.getItem(children[i].index);
    child.commentCollapse = !child.commentCollapse;
    
    if (!child.originalHeight) {
      child.originalHeight = parent._subViews[child.index].getMeasuredHeight();
    }

    parent._subViews[child.index].setInlineStyle(
      (child.commentCollapse) ? 'height: 0;' : 'height: initial;'
    );
  }
}
