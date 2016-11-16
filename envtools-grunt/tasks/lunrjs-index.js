var
  lunr = require('lunr');

module.exports = function (grunt) {
  grunt.registerTask('lunrjs-index', 'Generating lunr index', function () {
    var
      g = require('../globals'),
      questions,
      rawData,
      index;

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
      return {
        id: q.id,
        title: q.title,
        content: q.content,
        tags: q.tags.join(' ')
      };
    });

    questions.forEach(function (question) {
      index.add(question);
    });
    grunt.file.write(g.faqJsonIndexFile, JSON.stringify(index));
  });
};
