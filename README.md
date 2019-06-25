# openshift-cartridge-node-nginx

A Node.js LTS cartridge for OpenShift using nginx as a reverse proxy. It's intended for small to middle-sized applications, reducing Node.js demand—less database queries, template rendering, etc. For more information about how nginx handle the requests, look at the `conf/nginx.conf.erb` file.

## Install

### Create a new application through web interface

[Node.js (nginx)](https://openshift.redhat.com/app/console/application_type/custom?cartridges%5B%5D=https%3A%2F%2Fraw.githubusercontent.com%2Fstldo%2Fopenshift-cartridge-node-nginx%2Fmaster%2Fmetadata%2Fmanifest.yml)

### Create a new application through `rhc`

```bash
rhc create-app {myAppName} https://raw.githubusercontent.com/stldo/openshift-cartridge-node-nginx/master/metadata/manifest.yml
```

## Use

Just push a Node.js application with an `index.js` file in the repository root—it'll be the entrypoint of your application. Your application must listen to `process.env.NODE_SOCKET` variable. If the application has a `package.json` file, the cartridge will automatically run `npm install` during the build phase.

```js
var express = require('express');
var app = express();

// ...

app.listen(process.env.NODE_SOCKET);
```

## Configure

You can edit the main configuration files in `$OPENSHIFT_NODE_DIR/conf` and then reload the cartridge with `rhc cartridge-reload node-nginx -a {myApplicationName}`. Alternatively, you can edit `$OPENSHIFT_NODE_DIR/usr/conf/nginx.conf` and `$PM2_HOME/process.yaml` directly—in this case, don't forget that you must call `rhc cartridge-restart [...]` instead of `rhc cartridge-reload [...]` for the changes to take effect.

### Using a TCP connection between nginx and Node.js

By default, nginx is configured to communicate with Node.js through `process.env.NODE_SOCKET`. To change this behaviour, change the `proxy_pass` option in `$OPENSHIFT_NODE_DIR\conf\nginx.conf.erb` file, from `http://unix:<%= ENV['NODE_SOCKET'] %>` to `http://<%= ENV['NODE_HOSTNAME'] %>:<%= ENV['NODE_PORT'] %>`, then reload using `rhc cartridge-reload node-nginx -a {myApplicationName}`. Your application will need to listen to both `process.env.NODE_PORT` and `process.env.NODE_HOSTNAME` variables, like below:

```js
var express = require('express');
var app = express();

// ...

app.listen(process.env.NODE_PORT, process.env.NODE_HOSTNAME);
```

## Troubleshooting

### Bad Gateway

If you're getting this message in your browser, most likely your application is not listening to `process.env.NODE_SOCKET`. Otherwise, your application is not currently running. Remember that the default configuration requires an `index.js` file in the repository root to start the application. If you're sure that everything is all right, please open an issue so we can work it out.

### Where is the nginx root?

The nginx root is located in `$OPENSHIFT_NODE_DIR/usr/html`. With the default configuration, its sole purpose is to store the 502 ("Bad Request") error page.

## License

[The MIT License](./LICENSE)
