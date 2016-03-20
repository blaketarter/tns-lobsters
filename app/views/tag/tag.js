"use strict";

var app = require('application');
var observable = require("data/observable");
var view = require("ui/core/view");
var frameModule = require("ui/frame");
var utilityModule = require("utils/utils");
var color = require('color');
var socialShare = require("nativescript-social-share");
var http = require('fetch');
var observableArray = require('data/observable-array');
var TagPage = require('../../shared/models/tagPage');

require('../../shared/utils/utils.js');

var page;
var loading = false;

var pageData = new observable.Observable({
  isLoading: true,
  posts: new observableArray.ObservableArray([]),
  tagName: '',
});

exports.pageNavigatedTo = function(args) {
  page = args.object;
  page.bindingContext = pageData;
  pageData.isLoading = true;

  page.tag = page.navigationContext.tag;

  var tagPage = new TagPage(page.tag);
  pageData.posts = tagPage.posts;
  tagPage.reload(true)
    .then(function() {
      pageData.isLoading = false;
    });

  pageData.tagName = page.navigationContext.tag.tag;
};

exports.openUrl = openUrl;

exports.listViewItemTap = listViewItemTap;

exports.navTap = function() {
  var topmost = frameModule.topmost();
  topmost.goBack();
};

exports.share = function(args) {
  var url = args.object.classList[0];

  socialShare.shareText(url, 'Share');
};

exports.reload = function() {
  if (!pageData.isLoading) {
    pageData.isLoading = true;
    TagPage.reload()
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
      post: pageData.posts.getItem(index)
    },
  };

  topmost.navigate(navigationEntry);
}
