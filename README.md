# simpli masked input

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="dist/jquery.masked-input.min.js"></script>
	```

3. Call the plugin:

	```javascript
	$("#element").maskedInput({
	});
	```

## Structure

The basic structure of the project is given in the following way:

```
├── demo/
│   └── index.html
├── dist/
│   ├── jquery.masked-input.js
│   └── jquery.masked-input.min.js
├── src/
│   └── jquery.masked-input.js
├── .editorconfig
├── .gitignore
├── .jshintrc
├── .travis.yml
├── masked-input.jquery.json
├── Gruntfile.js
└── package.json
```

#### [demo/](https://github.com/simpli/masked-input/tree/master/demo)

Contains a simple HTML file to demonstrate your plugin.

#### [dist/](https://github.com/simpli-io/masked-input/tree/master/dist)

This is where the generated files are stored once Grunt runs.

#### [src/](https://github.com/simpli-io/masked-input/tree/master/src)

Contains the plugin's source files.

## Contributing

Check [CONTRIBUTING.md](https://github.com/simpli-io/masked-input/blob/master/CONTRIBUTING.md) for more information.

## History

Check [Releases](https://github.com/simpli-io/simpli-io/releases) for detailed changelog.

## License

[MIT License](https://github.com/simpli-io/masked-input/blob/master/LICENSE.md) © simpli-io
