"use strict";

var app = require('application');
var http = require('fetch');
var dialog = require("ui/dialogs");
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var moment = require('moment');

var view = require("ui/core/view");
var actionBarModule = require("ui/action-bar");
var listViewModule = require("ui/list-view");
var labelModule = require("ui/label");
var stackLayoutModule = require("ui/layouts/stack-layout");
var imageModule = require("ui/image");
// var borderModule = require("ui/border");
var buttonModule = require("ui/button");
var frameModule = require("ui/frame");

var enums = require("ui/enums");
var utilityModule = require("utils/utils");
var color = require('color');
var orientation = enums.Orientation;

var page;
var posts = [];
var lastPageId = '';
var loadMore;
var loading = false;

var Hottest = require('../../shared/models/hottest');
var Newest = require('../../shared/models/newest');

var hottest = new Hottest();
var newest = new Newest();

// var testData = require('../../data/front');

var pageData = new observable.Observable({
    hottest: hottest.posts,
    newest: newest.posts,
    currentTab: 'hottest'
});

exports.selectedIndexChanged = function(args) {
  switch (args.newIndex) {
    case 0:
      pageData.currentTab = 'hottest';
      break;
    case 1:
      pageData.currentTab = 'newest';
      break;
  }
};

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    hottest.load()
      .then(function() {
      });

    newest.load()
      .then(function() {
      });

      if (page.android) {
        let window = app.android.currentContext.getWindow();

        if (window && window.setStatusBarColor) {
          window.setStatusBarColor(
            new color.Color('#890f0a').android
          );
        }
      }

      if (page.ios) {
        let controller = frameModule.topmost().ios.controller;
        let navigationBar = controller.navigationBar;

        navigationBar.barStyle = 1;
      }
};

exports.openUrl = openUrl;

exports.listViewItemTap = listViewItemTap;

function buildPostData(raw, cat) {
  raw.map(function(rawPost) {
    rawPost.created = formatDate(rawPost.created_at);
    pageData[cat].push(rawPost);
  });
}

function formatDate(date) {
  return moment(date).fromNow();
}

function openUrl(event) {
  utilityModule.openUrl(event.object.text);
}

function listViewItemTap(args) {
  var index = args.index;
  
  var topmost = frameModule.topmost();

  var navigationEntry = {
    moduleName: './views/comment/comment',
    context: {
      post: pageData[pageData.currentTab].getItem(index)
    },
    animated: true
  };

  topmost.navigate(navigationEntry);
}
