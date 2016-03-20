"use strict";
var http = require('fetch');
var Tag = require('./tagModel.js');
var observableArray = require('data/observable-array');

class Tags {
  constructor() {
    this.url = 'https://lobste.rs/tags.json';
    this.list = new observableArray.ObservableArray([]);
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
            self.list.push(new Tag(v));
          });

          resolve(self.list);
        });
    });
  }

  reload() {
    let self = this;
    return new Promise(function(resolve, reject) {
      while (self.list.length) {
        self.list.pop();
      }

      self.load()
        .then(function(list) {
          resolve(list);
        });
    });
  }

}

module.exports = Tags;
