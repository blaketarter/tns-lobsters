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

var hottest = 'https://lobste.rs/hottest.json';
var newest = 'https://lobste.rs/newest.json';
var page;
var posts = [];
var lastPageId = '';
var loadMore;
var loading = false;

// var testData = require('../../data/front');

var pageData = new observable.Observable({
    hottest: new observableArray.ObservableArray([]),
    newest: new observableArray.ObservableArray([]),
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

    http.fetch(hottest)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        pageData.hottest = new observableArray.ObservableArray(posts);

        buildPostData(data, 'hottest');
       
        http.fetch(newest)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            pageData.newest = new observableArray.ObservableArray(posts);

            buildPostData(data, 'newest');
          });
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
  
  console.log(args);

  var topmost = frameModule.topmost();

  var navigationEntry = {
    moduleName: 'views/comment/comment',
    context: {
      post: pageData[pageData.currentTab].getItem(index)
    },
    animated: true
  };

  topmost.navigate(navigationEntry);
}
