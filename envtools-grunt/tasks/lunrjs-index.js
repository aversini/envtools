var
  lunr = require('lunr');

module.exports = function (grunt) {
  grunt.registerTask('lunrjs-index', 'Generating lunr index', function () {
    var
      g = require('../globals'),
      questions,
      rawData,
      index,
      ids = [];

    index = lunr(function () {
      this.ref('id');
      this.field('title', {
        boost: 10
      });
      this.field('tags', {
        boost: 100
      });
      this.field('content');
    });

    rawData = grunt.file.readJSON(g.faqJsonDataFile);

    questions = rawData.map(function (q) {
      if (q.id) {
        if (ids.indexOf(q.id) < 0) {
          ids.push(q.id);
          return {
            id: q.id,
            title: q.title,
            content: q.content,
            tags: (q.tags) ? q.tags.join(' ') : null
          };
        } else {
          return grunt.fail.fatal('duplicate id found: ' + q.id);
        }
      } else {
        return grunt.fail.fatal('missing required id!');
      }
    });

    questions.forEach(function (question) {
      index.add(question);
    });
    grunt.file.write(g.faqJsonIndexFile, JSON.stringify(index));
  });
};
