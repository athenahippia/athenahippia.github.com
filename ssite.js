#!/usr/bin/env node

var fs = require('fs'),
	jade = require('jade'),
	marked = require('marked'),
	program = require('commander'),
	spawn = require('child_process').spawn;

program
	.option('--build', 'Build site')
	.option('--watch', 'Watch for file changes')
	.parse(process.argv);


if (program.watch) {
	var watch = spawn(
		'supervisor',
		['-e', 'jade|md', '--no-restart-on', 'exit', 'ssite.js']
	);
	watch.stdout.on('data', function (data) {
		process.stdout.write('stdout: ' + data);
	});

	watch.stderr.on('data', function (data) {
		process.stderr.write('stderr: ' + data);
	});

	watch.on('exit', function (code) {
		process.stdout.write('child process exited with code ' + code);
	});
} else {
	render([
		'index', 'contacts', 'schedule', 'about'
	], 'default');
}


function render(pageNames, templateName) {
	pageNames.map(function(pageName) {
		var templatePath = getTemplatePath(pageName);
		if (!fs.existsSync(templatePath)) {
			templatePath = getTemplatePath('default');
		}
		var template = fs.readFileSync(templatePath),
			contentPath = './content/pages/' + pageName + '.md',
			content = marked(fs.readFileSync(contentPath).toString());
		console.log(
			'Render page `%s` using template `%s` and content `%s`',
			pageName, templatePath, contentPath
		);
		var html = jade.compile(template, {
			filename: templatePath,
			pretty: true
		})({
			page: pageName,
			content: content
		});
		fs.writeFileSync(pageName + '.html', html);
	});
}

function getTemplatePath(templateName) {
	return './templates/pages/' + templateName + '.jade';
}
