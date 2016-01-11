"use strict";
const moment = require('moment');
const http = require('fetch');
const observableArray = require('data/observable-array');
const striptags = require('striptags');
const Comment = require('./commentModel');

class Post {
  constructor(options) {
    this.title = options.title;
    this.url = options.url;
    this.tags = options.tags;
    this.score = options.score;
    this.author = options.submitter_user.username;
    this.created = moment(options.created_at).fromNow();
    this.commentCount = options.comment_count;
    this.commentsUrl = options.comments_url;
    this.description = options.description;
    this.sanitizedDescription = striptags(options.description);
    this.shortId = options.short_id;
    this.shortIdUrl = options.short_id_url;
    this.comments = new observableArray.ObservableArray([]);
  }

  getComments() {
    let self = this;
    return new Promise(function(resolve, reject) {
      http.fetch(self.commentsUrl + '.json')
       .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          let tempComments = self._processComments(data.comments);
          tempComments.forEach(function(v) {
            self.comments.push(v);
          });

          resolve();
        });
    });
  }

  _processComments(rawComments) {
    let tempComments = [];

    rawComments.forEach(function(v, i) {
      v.index = i;
      tempComments.push(new Comment(v));
    });

    return tempComments;
  }

  _unloadComments() {
    this.comments.forEach(function(v, i, a) {
      a.shift();
    });
  }
  
  reload(shouldReloadComments) {
    let self = this;
    return new Promise(function(resolve, reject) {
      http.fetch(self.shortIdUrl + '.json')
       .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          self.title = data.title;
          self.url = data.url;
          self.tags = data.tags;
          self.score = data.score;
          self.author = data.submitter_user.username;
          self.created = moment(data.created_at).fromNow();
          self.commentCount = data.comment_count;
          self.commentsUrl = data.comments_url;
          self.description = data.description;
          self.sanitizedDescription = striptags(data.description);
          self.shortId = data.short_id;
          self.shortIdUrl = data.short_id_url;

          if (shouldReloadComments) {
            self._unloadComments();

            self.getComments()
              .then(function() {
                resolve();
              });
          } else {
            resolve();
          }
        });
    });
  }

}

module.exports = Post;
