'use strict';

var exports = module.exports = {};
var h5x     = {};
var cli     = require('cli');
var cheerio = require('cheerio');
var fs      = require('fs');
var open    = require('open');
var connect = require('connect');
var cors    = require('cors');
var url     = require('url');
var proc    = require('child_process');

exports.main = function(){
  cli.main(h5x.main);
};

h5x.parse = function(args) {
  return cli.parse(JSON.parse(args));
}

h5x.readFile = function(path) {
  try {
    fs.statSync(path);
  } catch (e) {
    console.log('Error: ', e.message);
    return '';
  }
  return fs.readFileSync(path, "utf8");
}

h5x.getSettings = function(path) {
  var html    = h5x.readFile(path).trim();
  var $       = cheerio.load(html);
  var script  = $('script[type="text/h5x"]').first();
  var code    = script.text();
  var server  = script.attr('server') == 'true';
  var browser = script.attr('browser') == 'true';
  var port    = script.attr('port') ? script.attr('port') : 8000;
  var deps    = script.attr('dependencies') ? script.attr('dependencies').split(',') : [];
  var args    = script.attr('cli') ? h5x.parse(script.attr('cli')) : {};

  return {
    path         : path, //path to file being called
    code         : code, //code block from file
    startServer  : server, //bool, true to start server
    openBrowser  : browser, //bool, true to open in default browser
    port         : port, //integer, custom port (default is 8000)
    dependencies : deps, //string, list of dependencies that need to be installed
    args         : args //cli args, passed though parse
  };
}

h5x.generate = function(type) {
  var dir = __dirname.replace('lib', 'templates/');

  if (type == 'cli')
    return fs.writeFileSync('cli.html', fs.readFileSync(dir + 'cli.html'));

  if (type == 'server')
    return fs.writeFileSync('server.html', fs.readFileSync(dir + 'server.html'));
}

h5x.startServer = function(port) {
  try {
    var app = connect();
    app.use(cors({origin: 'null'}));
    app.listen(port, function() {
      console.log('Server running on '+port+'...');
    });
  } catch (e) {
    console.log('Error: ', e.message);
    return false;
  }

  return app;
}

h5x.installDependencies = function(deps){
  if (deps.length != 0) {
    console.log('Installing dependencies...');

    for (let i in deps)
      proc.execSync("npm i " + deps[i]);
  }

  return true;
}

h5x.runCode = function(code){
  if (code)
    eval(code);
}

h5x.main = function(args){
  //Generate a sample executable file and exit
  if (args[0] && args[0] == 'cli' || args[0] == 'server'){
    return h5x.generate(args[0]);
  }

  //Get settings
  var path     = args[0];
  var settings = h5x.getSettings(path);

  //Start server
  if (settings.startServer)
    var app = h5x.startServer(settings.port);

  //Pass CLI args
  var cli = settings.args;

  //Open the page
  if (settings.openBrowser)
    open(settings.path);

  //Install dependencies
  if (settings.dependencies)
    h5x.installDependencies(settings.dependencies);

  //Run the code
  if (settings.code)
    eval(settings.code);
}
