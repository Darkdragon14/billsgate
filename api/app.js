const express = require('express');
const app = express();
const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '0.0.1',
    title: 'Bills Gate',
    license: {
      name: 'ISC',
    },
  },
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: './src/*.js',
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/api-docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/v3/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
};

expressJSDocSwagger(app)(options);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', require('./src/user'));
app.use('/bank', require('./src/bank'));
app.use('/invoice', require('./src/invoice'));

const port = 8000;

app.listen(port, () => {
  console.log('App is now running at port ', port);
  console.log(`The doc is available on http://localhost:${port}/api-docs`);
})