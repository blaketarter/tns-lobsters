const moment = require('moment');
const striptags = require('striptags');

class Comment {
  constructor(options) {
    this.indentLevel = options.indent_level;
    this.score = options.score;
    this.author = options.commenting_user.username;
    this.created = moment(options.created_at).fromNow();
    this.comment = options.comment;
    this.sanitizedComment = striptags(options.comment);
  }

  formatComment() {
    //not implemented
  }
}

module.exports = Comment;
