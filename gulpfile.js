
// import dependencies
const gulp = require('gulp');
const fs = require('fs');
const del = require('del');
const merge = require('merge-stream');

// configuration files
const config = require("./config/project");

// globals
const PROJECT = config.projectName;
const VERSION = new Date().toISOString().replace(/[:.]/g, '-');
const DEPLOYPATH = './dist/Deployment/';


gulp.task("clean", clean);
gulp.task("copyToDist", copyToDist);
gulp.task('copy', gulp.series('clean', 'copyToDist'));
gulp.task("bundle", gulp.series('copy'));
gulp.task("setupFolders", setupFolders);
gulp.task("setup", gulp.series( 'setupFolders'));
gulp.task("default", gulp.series("bundle"));

function setupFolders(done) {

	// RENAME folder under Deployment
	try {
		fs.renameSync('src/Deployment/PENDING_RENAME', `src/Deployment/${PROJECT}`);
	} catch (ex) {}

	// Create folder structure and create gitkeep
	fs.mkdirSync(`src/SiteCollectionDefaults/Custom/${PROJECT}`, {recursive: true});
	fs.copyFileSync('util/.gitkeep', `src/SiteCollectionDefaults/Custom/${PROJECT}/.gitkeep`);

	fs.mkdirSync(`src/ListEventsConfiguration/Custom/${PROJECT}`, {recursive: true});
	fs.copyFileSync('util/.gitkeep', `src/ListEventsConfiguration/Custom/${PROJECT}/.gitkeep`);

	fs.mkdirSync(`src/Custom/${PROJECT}`, {recursive: true});
	fs.copyFileSync('util/.gitkeep', `src/Custom/${PROJECT}/.gitkeep`);
	
	fs.mkdirSync(`src/Deployment/${PROJECT}/SitePoolDefaults/Custom/${PROJECT}`, {recursive: true});
	fs.copyFileSync('util/.gitkeep', `src/Deployment/${PROJECT}/SitePoolDefaults/Custom/${PROJECT}/.gitkeep`);
	
	fs.mkdirSync(`src/Deployment/${PROJECT}/TimerJobsConfiguration/Custom/${PROJECT}`, {recursive: true});
	fs.copyFileSync('util/.gitkeep', `src/Deployment/${PROJECT}/TimerJobsConfiguration/Custom/${PROJECT}/.gitkeep`);
	
	return done();
}

function clean(done) {
	del.sync([DEPLOYPATH + '/' + PROJECT], {
		force: true,
	});
	return done();
}

function copyToDist() {
	try {
		fs.mkdirSync('./dist');
	} catch (ex) {}
	try {
		fs.mkdirSync('./dist/Deployment');
	} catch (ex) {}
	try {
		fs.mkdirSync(DEPLOYPATH + '/' + PROJECT);
	} catch (ex) {}
	try {
		fs.mkdirSync(DEPLOYPATH + '/' + PROJECT + '/_' + VERSION);
	} catch (ex) {}

	var paths = [
		{
			// Copy all from src to dest
			src: ['./src/**/*', '!./src/Deployment{,/**}'],
			dest: DEPLOYPATH + "/" + PROJECT
		},
		{
			// Copy all from src to dest, 
			src: ['./src/Deployment/' + PROJECT + '/**/*'],
			dest: DEPLOYPATH + "/" + PROJECT
		}
	];
	var tasks = paths.map(function (path) {
		return gulp.src(path.src).pipe(gulp.dest(path.dest));
	});

	return merge(tasks);
}
