"use strict";

var app = require('application');
var observable = require("data/observable");

var view = require("ui/core/view");
var frameModule = require("ui/frame");

var utilityModule = require("utils/utils");
var color = require('color');

var page;
var loading = false;

var Hottest = require('../../shared/models/hottest');
var Newest = require('../../shared/models/newest');

var hottest = new Hottest();
var newest = new Newest();

var pageData = new observable.Observable({
    hottest: hottest.posts,
    newest: newest.posts,
    currentTab: 'hottest',
    isLoading: true,
    hottestClass: hottest,
    newestClass: newest
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
    pageData.isLoading = true;

    hottest.reload()
      .then(function() {
        pageData.isLoading = false;
      });

    newest.reload()
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

exports.reload = function() {
  if (!pageData.isLoading) {
    pageData.isLoading = true;
    pageData[pageData.currentTab + 'Class'].reload()
      .then(function() {
        pageData.isLoading = false;
      });
  }
};

function showModal(post) {
    page.showModal('./views/comment/comment', post, function() {
      console.log('hide modal');
    }, false);
}

exports.onCloseModal = function(args) {
    page.closeModal();
};

function openUrl(event) {
  utilityModule.openUrl(event.object.text);
}

function listViewItemTap(args) {
  var index = args.index;
  
  var topmost = frameModule.topmost();
  
  // showModal(pageData[pageData.currentTab].getItem(index));

  var navigationEntry = {
    moduleName: './views/comment/comment',
    context: {
      post: pageData[pageData.currentTab].getItem(index)
    },
    animated: true
  };

  topmost.navigate(navigationEntry);
}
