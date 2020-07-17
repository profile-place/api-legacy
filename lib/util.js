const { readdir, lstat } = require('fs').promises;
const { join } = require('path').posix;

async function recurseDir(root, path) {
	if (!path) path = '.';
	let files = [];
	const fullPath = join(root, path);
	const filenames = await readdir(fullPath);

	for (const filename of filenames) {
		const curPath = join(fullPath, filename);
		const relativePath = join(path, filename);
		const stat = await lstat(curPath);
		if (stat.isDirectory()) {
			const subfiles = await recurseDir(root, relativePath);
			files = [...files, ...subfiles];
		} else {
			files.push(relativePath.replace('.js', ''));
		}
	}

	return files;
}

module.exports = {
	recurseDir
};