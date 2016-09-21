var assert = require('assert');
var rewire = require('rewire');
var sinon  = require('sinon');
var spy    = sinon.spy();
var h5x    = rewire('../lib/h5x.js');
var log    = h5x.__set__('console', {log:()=>{}}); //Comment out to view errors

describe('H5X', function() {
  describe('cli mode', function() {

    it('should try to copy "templates/cli.html"', function() {
      var main = h5x.__get__('h5x').main;
      var fs   = {readFileSync:()=>{},writeFileSync:()=>{},statSync:()=>{}};
      var revert        = h5x.__set__('fs', fs);
      var readFileSync  = sinon.spy(fs, "readFileSync");
      var writeFileSync = sinon.spy(fs, "writeFileSync");
      var dir           = __dirname.replace('tests', 'templates/');

      main(['cli']);
      revert();
      
      assert.equal(readFileSync.withArgs(dir + 'cli.html').calledOnce, true);
      assert.equal(writeFileSync.calledOnce, true);
    });

    it('should try to copy "templates/server.html"', function() {
      var main = h5x.__get__('h5x').main;
      var fs   = {readFileSync:()=>{},writeFileSync:()=>{},statSync:()=>{}};
      var revert        = h5x.__set__('fs', fs);
      var readFileSync  = sinon.spy(fs, "readFileSync");
      var writeFileSync = sinon.spy(fs, "writeFileSync");
      var dir           = __dirname.replace('tests', 'templates/');

      main(['server']);
      revert();

      assert.equal(readFileSync.withArgs(dir + 'server.html').calledOnce, true);
      assert.equal(writeFileSync.calledOnce, true);
    });

    it('should parse options properly', function() {
      var parse   = h5x.__get__('h5x').parse;
      var actual  = parse('{"generate":["g","Generate example HTML5 file with h5x support","string"],"arguments":["a","A list of arguments to pass on to the html executable","string"]}');
      var expected = {generate: null, arguments: null};

      assert.deepEqual(actual, expected);
    });

    it('should read files', function() {
      var readFile = h5x.__get__('h5x').readFile;

      var actual    = readFile('tests/dummy');
      var expected  = 'this is an empty dummy used by tests\n';
      assert.equal(expected, actual);

      var actual    = readFile('tests/doesntexist');
      var expected  = '';
      assert.equal(expected, actual);
    });

    it('should start server when told to', function() {
      var startServer = h5x.__get__('h5x').startServer;
      var mock        = {use:()=>{}, listen:()=>{}};
      var revert      = h5x.__set__('connect', ()=>{return mock;});
      var spy         = sinon.spy(mock, "listen");

      startServer(8000);
      startServer(6000);
      revert();

      assert.equal(spy.calledWith(8000), true, 'failed with port 8000');
      assert.equal(spy.calledWith(6000), true, 'failed with port 6000');
    });

    it('should install dependencies', function() {
      var installDependencies = h5x.__get__('h5x').installDependencies;
      var proc    = {execSync : ()=>{}};
      var revert  = h5x.__set__('proc', proc);
      var spy     = sinon.spy(proc, 'execSync');

      installDependencies(['marked', 'bar', 'foo']);
      revert();

      assert.equal(spy.calledWith('npm i marked'), true);
      assert.equal(spy.calledWith('npm i bar'), true);
      assert.equal(spy.calledWith('npm i foo'), true);
      assert.equal(spy.calledThrice, true);

    });

    it('should read settings', function(){
        var getSettings = h5x.__get__('h5x').getSettings;
        var path        = 'tests/dummy.html';
        var settings    = getSettings(path);

        assert.equal(settings.path, path);
        assert.equal(settings.code, "console.log('Hello world!');");
        assert.equal(settings.startServer, true);
        assert.equal(settings.openBrowser, false);
        assert.equal(settings.port, 1234);
        assert.deepEqual(settings.dependencies, []);
        assert.deepEqual(settings.args, []);
    });

  });
});
