const React = require('react');
const ReactDOMServer = require('react-dom/server');

console.error = function(...args) {
  console.log('INTERCEPTED:', args);
};

const el = React.createElement('div', null, [
  React.createElement('span', { key: '' }, 'A'),
  React.createElement('span', { key: '' }, 'B')
]);

ReactDOMServer.renderToString(el);
