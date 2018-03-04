'use strict';

// Modules
var path   = require('path');
var chai   = require('chai');
var expect = chai.expect;
var Raneto = require('../app/core/raneto.js');
const raneto = new Raneto();

chai.should();
chai.config.truncateThreshold = 0;

describe('#cleanString()', function () {

  it('converts "Hello World" into "hello-world"', function () {
    raneto.cleanString('Hello World').should.equal('hello-world');
  });

  it('converts "/some/directory-example/hello/" into "some-directory-example-hello"', function () {
    raneto.cleanString('/some/directory-example/hello/').should.equal('some-directory-example-hello');
  });

  it('converts "with trailing space " into "with-trailing-space"', function () {
    raneto.cleanString('with trailing space ').should.equal('with-trailing-space');
  });

  it('converts "also does underscores" into "also_does_underscores"', function () {
    raneto.cleanString('also does underscores', true).should.equal('also_does_underscores');
  });

  it('converts "/some/directory-example/underscores/" into "some_directory_example_underscores"', function () {
    raneto.cleanString('/some/directory-example/underscores/', true).should.equal('some_directory_example_underscores');
  });

});

describe('#slugToTitle()', function () {

  it('converts "hello-world" into "Hello World"', function () {
    raneto.slugToTitle('hello-world').should.equal('Hello World');
  });

  it('converts "dir/some-example-file.md" into "Some Example File"', function () {
    raneto.slugToTitle('dir/some-example-file.md').should.equal('Some Example File');
  });
});

describe('#processVars()', function () {

  it('replaces config vars in Markdown content', function () {
    raneto.config.base_url = '/base/url';
    raneto
      .processVars('This is some Markdown with a %base_url%.')
      .should.equal('This is some Markdown with a /base/url.');
  });

  it('replaces custom vars in Markdown content', function () {
    var variables = [
      {
        name: 'test_variable',
        content: 'Test Variable'
      }
    ];
    raneto.config.variables = variables;
    raneto
      .processVars('This is some Markdown with a %test_variable%.')
      .should.equal('This is some Markdown with a Test Variable.');
  });

});

describe('#getPage()', function () {

  it('returns an array of values for a given page', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var result = raneto.getPage(raneto.config.content_dir + 'example-page.md');
    expect(result).to.have.property('slug', 'example-page');
    expect(result).to.have.property('title', 'Example Page');
    expect(result).to.have.property('body');
    expect(result).to.have.property('excerpt');
  });

  it('returns null if no page found', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var result = raneto.getPage(raneto.config.content_dir + 'nonexistent-page.md');
    /* eslint-disable no-unused-expressions */
    expect(result).to.be.null;
  });

});

describe('#getPages()', function () {

  it('returns an array of categories and pages', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var result = raneto.getPages();
    expect(result[0]).to.have.property('is_index', true);
    expect(result[0].files[0]).to.have.property('title', 'Example Page');
    expect(result[1]).to.have.property('slug', 'sub');
    expect(result[1].files[0]).to.have.property('title', 'Example Sub Page');
  });

  it('marks activePageSlug as active', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var result = raneto.getPages('/example-page');
    expect(result[0]).to.have.property('active', true);
    expect(result[0].files[0]).to.have.property('active', true);
    expect(result[1]).to.have.property('active', false);
    expect(result[1].files[0]).to.have.property('active', false);
  });

  it('adds showOnHome property to directory', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var result = raneto.getPages();
    expect(result[0]).to.have.property('showOnHome', true);
  });

  it('adds showOnHome property to files', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var result = raneto.getPages();
    expect(result[0].files[0]).to.have.property('showOnHome', true);
  });

  it('loads meta showOnHome value from directory', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var result = raneto.getPages();
    expect(result[3]).to.have.property('showOnHome', false);
  });

  it('loads meta showOnHome value from file', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var result = raneto.getPages();
    console.log(result[0])
    expect(result[0].files[4]).to.have.property('showOnHome', false);
  });

  it('applies showOnHome in absence of meta for directories', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    raneto.config.showOnHome = false;
    var result = raneto.getPages();
    expect(result[1]).to.have.property('showOnHome', false);
  });

  it('applies showOnHome in absence of meta for files', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    raneto.config.showOnHome = false;
    var result = raneto.getPages();
    expect(result[1].files[0]).to.have.property('showOnHome', false);
  });

  it('category index always shows on home', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    raneto.config.showOnHome = false;
    var result = raneto.getPages();
    expect(result[0]).to.have.property('showOnHome', true);
  });

});

describe('#doSearch()', function () {

  it('returns an array of search results', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var result = raneto.doSearch('example');
    expect(result).to.have.length(5);
  });

  it('returns an empty array if nothing found', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var result = raneto.doSearch('asdasdasd');
    /* eslint-disable no-unused-expressions */
    expect(result).to.be.empty;
  });

  it('returns an array if search has special characters', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var result = raneto.doSearch('with "special');
    expect(result[0].title).to.be.deep.equals('Special Characters Page');
  });

});
