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

var frontPage = 'https://lobste.rs/hottest.json';
var page;
var posts = [];
var lastPageId = '';
var loadMore;
var loading = false;

// var testData = require('../../data/front');

var pageData = new observable.Observable({
    posts: new observableArray.ObservableArray([
    ])
});

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    http.fetch(frontPage)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        pageData.posts = new observableArray.ObservableArray(posts);

        buildPostData(data);
      });
      
      if (page.android) {
        let window = app.android.currentContext.getWindow();
        window.setStatusBarColor(
          new color.Color('#890f0a').android
        );
      }

      if (page.ios) {
        let controller = frameModule.topmost().ios.controller;
        let navigationBar = controller.navigationBar;

        navigationBar.barStyle = 1;
      }
};

exports.openUrl = openUrl;

function buildPostData(raw) {
  raw.map(function(rawPost) {
    rawPost.created = formatDate(rawPost.created_at);
    pageData.posts.push(rawPost);
  });
}

function formatDate(date) {
  return moment(date).fromNow();
}

function openUrl(event) {
  console.log(event.object.text);
  utilityModule.openUrl(event.object.text);
}
