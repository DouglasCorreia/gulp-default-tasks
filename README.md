# Gulp Workflow

The Gulp Workflow is an enviroment to improve your development while programming. It can save a lot of your time.

## Dev Enviromment

- Live reload browser with BrowserSync
- Hotloading styles with CSS Injection

## Styles

- Convert SASS to CSS
- Merging media queries
- Minification
- Reset CSS
- Grids

## Javascript

- Concatenation
- Minification/uglification

## Image Compress

- Minification/optimization of images
- File types: .png, .jpg, .jpeg, .gif, .svg

## Watch Files

- For changes in files to recompile
- File types: .css, .html, .php, .js

## Getting Started

Copy the files package.json, gulpfile.js and the folder developer.

```
npm install
```

### Command to compress the images

Create a subfolder "images" inside the developer folder, add your images and then run the following command:

```
gulp imageMinify
```

### Command to send to the production enviroment

After you finished the entire development, run the following command:

```
gulp build
```

This command will create a folder called "build" with only files that you need.

Have fun programming!
