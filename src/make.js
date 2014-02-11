// Run this with node.js.
// $ nodejs make.js

var fs = require('fs');
var hogan = require(__dirname+"/hogan-2.0.0.js");
var languages = require(__dirname+"/languages.js");

// First delete HTML files in ../

var template = fs.readFileSync(__dirname+'/template.mustache').toString();
var template = hogan.compile(template);

for (var lang in languages) { // iterate languages
	// create path
	if (!fs.existsSync(__dirname+'/../'+lang)) {
		fs.mkdirSync(__dirname+'/../'+lang);
	}

	var content = require(__dirname+'/'+lang+'.content');
	var title = content.title;
	var indexPage = content.indexPage;
	content = content.content;

	for (var section in content) { // iterate sections (main navigation items)
		for (var page in content[section].pages) { // iterate pages
			var templateData = generateTemplateData();
			var html = template.render(templateData);

			fs.writeFileSync(__dirname+'/../'+lang+'/'+
				convertFilename(content[section].pages[page].name)+
				'.html',html);
		}
	}

	generateIndexPage();
}


function generateTemplateData() {
	var templateData = {
		// add i18n function to every page
		i18n: function(text) {
			return languages[lang][text];
		},
		exercises: content[section].pages[page].exercises,
		name: content[section].pages[page].name,
		title: title,
		introText: content[section].pages[page].introText,
		sections: []
	};
	for (var sectionName in content) templateData.sections.push({
		active: (sectionName==section),
		name: content[sectionName].name,
		href: convertFilename(content[sectionName].pages[0].name)+'.html'
	});
	// Section with more than one page need pagination
	if (content[section].pages.length > 1) {
		templateData.pagination = {};
		templateData.pagination.pages = [];

		var pageNumbers = [];
		// first
		pageNumbers.push(1);
		// last
		pageNumbers.push(content[section].pages.length);
		// 10, 20, 30 ...
		for (pageNum=10;pageNum<content[section].pages.length;pageNum+=10)
			pageNumbers.push(pageNum);
		// last two and next two
		if (page>1) pageNumbers.push(page*1);
		if (page>2) pageNumbers.push(page*1-1);
		pageNumbers.push(page*1+1); // current
		if (page<content[section].pages.length-2) pageNumbers.push(page*1+2);
		if (page<content[section].pages.length-3) pageNumbers.push(page*1+3);

		pageNumbers.sort(function(a,b){return a - b});
		// remove duplicates
		pageNumbers = pageNumbers.filter(function(elem, pos) {
			return pageNumbers.indexOf(elem) == pos;
		});
		for (pageNumber in pageNumbers) {
			templateData.pagination.pages.push({
				number: pageNumbers[pageNumber],
				href: convertFilename(content[section].pages[pageNumbers[pageNumber]-1].name)+'.html',
				active: (pageNumbers[pageNumber]-1 == page)
			});
		}
		// not first page
		if (page*1 != 0) {
			templateData.pagination.pages.unshift({
				number: "&laquo;",
				href: convertFilename(content[section].pages[page*1-1].name)+'.html',
				active: false
			});
		}
		// not last
		if (page*1 != content[section].pages.length-1) {
			templateData.pagination.pages.push({
				number: "&raquo;",
				href: convertFilename(content[section].pages[page*1+1].name)+'.html',
				active: false
			});
		}
	}

	return templateData;
}

function generateIndexPage() {
	var templateData = {
		// add i18n function to every page
		i18n: function(text) {
			return languages[lang][text];
		},
		exercises: [{plainHtml: indexPage.html}],
		name: title,
		title: title,
		introText: indexPage.introText,
		sections: []
	};
	for (var sectionName in content) templateData.sections.push({
		active: false,
		name: content[sectionName].name,
		href: convertFilename(content[sectionName].pages[0].name)+'.html'
	});

	var html = template.render(templateData);
	fs.writeFileSync(__dirname+'/../'+lang+'/index.html',html);
}

function convertFilename(name) {
	// converts a given name to an nice file name
	name = name
		.toLowerCase()
		.replace(/ /g,"_") // space to underscore
		.replace(/[áàâä]/g, 'a')
		.replace(/[úùûü]/g, 'u')
		.replace(/[ö]/g, 'o')
		.replace(/[éèê]/g, 'e')
		.replace(/[ç]/g, 'c')
		.replace(/[ß]/g, 'ss')
		.replace(/[^\w]/gi, '') // remove non alphanumeric and non underscore
	return name;
}


// ######## Cache manifest

function generateManifest() {
	var date = new Date();
	date = date.toString();
	var manifest =
		"CACHE MANIFEST\n"+
		"# "+date+"\n"+
		"\n"+
		"CACHE:\n"+
		"*\n"+
		"\n";

	fs.writeFileSync(__dirname+'/../cache.manifest',manifest);
}

generateManifest();

