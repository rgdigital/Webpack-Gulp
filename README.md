# Gulp + Webpack

## A build system by Gulp, with bundles by Webpack

### Setup

1. Clone it `git clone git@github.com:rgdigital/Webpack-Gulp.git`
2. Install it `npm install`
3. Run it `gulp`

### Folder struture

```
.
├── dist
├── src
│   ├── _partials           <- HTML partials
│   ├── css
│   │   └── scss
│   │       └── style.scss  <- CSS compiled to dist/
│   ├── public
│   │   ├── fonts
│   │   └── img
│   └── js
│       └── Index.js        <- Webpack entrypoint
│       └── Preloader.js    <- Preloader entrypoint (default = inline in index.html)
└── index.html              <- Default HTML
```

### Features

- Preloader added inline, runs before before bundle runtime
- ES6 JS bundled (so works with React, VueJS, etc.)
- Stylesheet loaded separately from bundle
- Optimised app builds with minified JS, CSS, HTML
- Super-quick compilation

### Contact
[rick@rgdigital.io](mailto:rick@rgdigital.io)