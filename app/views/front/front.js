"use strict";

var app = require('application');
var observable = require("data/observable");

var view = require("ui/core/view");
var frameModule = require("ui/frame");

var utilityModule = require("utils/utils");
var color = require('color');

var socialShare = require("nativescript-social-share");

require('../../shared/utils/utils.js');

var page;
var loading = false;

var Hottest = require('../../shared/models/hottest');
var Newest = require('../../shared/models/newest');
var Tags = require('../../shared/models/tags');
var Search = require('../../shared/models/search');

var hottest = new Hottest();
var newest = new Newest();
var tags = new Tags();
var search = new Search();

var pageData = new observable.Observable({
  hottest: hottest.posts,
  newest: newest.posts,
  tags: tags.list,
  search: search.text,
  currentTab: 'hottest',
  isLoading: true,
  hottestClass: hottest,
  newestClass: newest,
  tagsClass: tags,
  searchClass: search
});

exports.selectedIndexChanged = function(args) {
  switch (args.newIndex) {
    case 0:
      pageData.currentTab = 'hottest';
      break;
    case 1:
      pageData.currentTab = 'newest';
      break;
    case 2:
      pageData.currentTab = 'tags';
      break;
    case 3:
      pageData.currentTab = 'search';
      break
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

  newest.reload();

  tags.reload();
    
  if (page.android) {
    var window = app.android.currentContext.getWindow();

    if (window && window.setStatusBarColor) {
      window.setStatusBarColor(
        new color.Color('#890f0a').android
      );
    }
  }

  if (page.ios) {
    var controller = frameModule.topmost().ios.controller;
    var navigationBar = controller.navigationBar;

    navigationBar.barStyle = 1;
  }
};

exports.openUrl = openUrl;

exports.listViewItemTap = listViewItemTap;

exports.tagTap = tagTap;

exports.share = function(args) {
  var url = args.object.classList[0];

  socialShare.shareText(url, 'Share');
};

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
  };

  topmost.navigate(navigationEntry);
}

function tagTap(args) {
  var index = args.index;
  
  var topmost = frameModule.topmost();
  
  // showModal(pageData[pageData.currentTab].getItem(index));

  var navigationEntry = {
    moduleName: './views/tag/tag',
    context: {
      tag: pageData[pageData.currentTab].getItem(index)
    },
  };

  topmost.navigate(navigationEntry);

}
