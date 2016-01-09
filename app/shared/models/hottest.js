"use strict";
const http = require('fetch');
const Post = require('./postModel');
const observableArray = require('data/observable-array');

class Hottest {
  constructor() {
    this.url = 'https://lobste.rs/hottest.json';
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
      self.posts = [];

      self.load()
        .then(function(posts) {
          resolve(posts);
        });
    });
  }

}

module.exports = Hottest;
