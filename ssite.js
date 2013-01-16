#!/usr/bin/env node

var fs = require('fs'),
	jade = require('jade'),
	marked = require('marked');


render([
	'index', 'contacts', 'schedule', 'about'
], 'default');


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
