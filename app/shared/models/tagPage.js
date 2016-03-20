"use strict";
const http = require('fetch');
const Post = require('./postModel');
const observableArray = require('data/observable-array');

class TagPage {
  constructor(opts) {
    this.url = 'https://lobste.rs/t/' + opts.tag + '.json';
    this.posts = new observableArray.ObservableArray([]);
  }

  load() {
    let self = this;
    return new Promise(function(resolve, reject) {
      http.fetch(self.url)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          data.forEach(function(v) {
            self.posts.push(new Post(v));
          });
          resolve(self.posts);
        });
    });
  }

  reload() {
    let self = this;
    return new Promise(function(resolve, reject) {
      while(self.posts.length) {
        self.posts.pop();
      }

      self.load()
        .then(function(posts) {
          resolve(posts);
        });
    });
  }

}

module.exports = TagPage;
