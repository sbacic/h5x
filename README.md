## H5X - HTML Executable ##
H5X turns a regular HTML file into a shell script or tiny webapp with
all the power of NodeJS.

#### Say what? ####
Just install:
```
npm i -g sbacic/h5x
```
And run it:
```
h5x -g cli && h5x cli.html
```
Need a server? Just run:
```
h5x -g server && h5x server.html
```

#### Attributes ####
You can change how h5x treats your html by setting attributes on
your script tag. Here's a list:
- **server (boolean)**

Whether to run in server or CLI mode. If set to true, a simple
connect server is started before calling your code. You can access this
server via the `app` variable. You can generate an example/blueprint
by running `h5x -g server`.

- **browser (boolean)**

Opens the html file in your preferred browser.

- **port(string)**

A custom port for your tiny server. The default is set to 8000, so only change this if you have some other service already using that port.

- **dependencies (string)**

A string listing all the dependencies you want to load. These dependencies are loaded before your code is run. Example: `dependencies="marked,express@3.0.0"`.

#### How does it work? ####
H5x parses your HTML, looking for a script tag with a `text/h5x` type. Then it runs the code inside the tag. Only the first match is run, the rest are ignored.

#### Some help to get you started ####
H5x provides you with two variables to get you started: `app` for
servers and `cliargs` for command line arguments passed to your function.
