/*
 * geradorPython
 * https://github.com/luizpcf@gmail.com/geradorpython
 *
 * Copyright (c) 2014 Luiz Ferreira
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');

var path = '../../../../Dropbox/Mestrado/crawler';

var getFiles = function() {
	var files;
	files = fs.readdirSync(path);

	var missions = [];
	var solutions = {};

	files.forEach(function(element){
		var splitted = element.split('_');

		if(element.indexOf(".")!=0 && splitted.length > 8){
			

			var metadata = {file: element,
							user: splitted[5]};

			var i = 6;
			while( splitted[i].indexOf('python') !=0 ){
				metadata.user = metadata.user + "_" + splitted[i];
				i++;
			}
			metadata.version = splitted[i];

			if(solutions[splitted[3]] == undefined){
				missions.push(splitted[3]);
				solutions[splitted[3]] = [];
			}

			solutions[splitted[3]].push(metadata);
		}
	});
	
	return {missions: missions, solutions: solutions};
};

var openFiles = function(){
	var files = getFiles();
	console.log("Começando a ler arquivos")

	files.missions.forEach(function(element){
		files.solutions[element].forEach(function(metadata, index){
			console.log("Lendo arquivo " + metadata.file);
			var content = fs.readFileSync(path + '/' + metadata.file).toString();

			var search = content.indexOf('<span class=3D"profile__level__num">');
			var lvl = content.substring(search + 36, content.indexOf('<', search + 1));
			files.solutions[element][index].level = lvl;

			search = content.indexOf('<div class=3D"voting__result__score" rv-text=3D"model:votes">');
			var votes = content.substring(search + 61, content.indexOf('<', search + 1));
			files.solutions[element][index].votes = votes;

			search = content.indexOf('<textarea data-code=3D"python" style=3D"display: none;">');
			var code = content.substring(search + 56, content.indexOf('<', search + 1));
			//files.solutions[element][index].code = code;
		});
	});

	console.log(files.solutions);
}

openFiles();