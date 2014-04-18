# htmldiff.js
### HTML Diffing in JavaScript

[![Build Status](https://travis-ci.org/inkling/htmldiff.js.svg?branch=master)](https://travis-ci.org/inkling/htmldiff.js)

`htmldiff.js` is a JavaScript port of [https://github.com/myobie/htmldiff](https://github.com/myobie/htmldiff) by
[Keanu Lee](http://keanulee.com) at [Inkling](https://www.inkling.com/).

This is diffing that understands HTML. Best suited for cases when you
want to show a diff of user-generated HTML (like from a wysiwyg editor).

##Usage
You use it like this:

```javascript

  diff = require('htmldiff.js');
  console.log(diff('<p>this is some text</p>', '<p>this is some more text</p>'));
```
And you get:

```html
<p>this is some <ins>more </ins>text</p>
```
##Module

It should be multi-module aware. ie. it should work as a node.js module
or an AMD (RequireJS) module, or even just as a script tag.


Licensed under the MIT License. See the `LICENSE` file for details.
