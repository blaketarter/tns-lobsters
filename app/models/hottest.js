const http = require('fetch');
const Post = require('./postModel.js');

module.exports = {
  url: 'https://lobste.rs/hottest.json',
  posts: [],
  get: function() {
    let self = this;
    return new Promise(function(resolve, reject) {
      http.fetch(self.url)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          data.forEach(function(v) {
            self.posts.push(new Post(data));
          });

          resolve(self.posts);
        });
    });
  },
  reload: function() {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.posts = [];

      self.get()
        .then(function(posts) {
          resolve(posts);
        });
    });
  }
};
