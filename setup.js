/**
 * Created by qoder on 16-10-22.
 */
var jsdom = require('jsdom').jsdom;
global.document = jsdom('');
global.window = document.defaultView;
global.navigator = {
  userAgent: 'node.js'
};
documentRef = document;
