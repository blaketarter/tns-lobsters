"use strict";

class Tag {
  constructor(options) {
    this.id = options.id;
    this.tag = options.tag;
    this.description = options.description;
    this.privileged = options.privileged;
    this.is_media = options.is_media;
    this.inactive = options.inactive;
    this.hotness_mod = options.hotness_mod;
  }
}

module.exports = Tag;
