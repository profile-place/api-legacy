const { readdir, lstat } = require('fs').promises;
const { join } = require('path').posix;
const { randomBytes } = require('crypto');
const { decode } = require('actual-urlsafe-base64');

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

const constants = {
	epoch: 1577836800
};

const generateSecret = () => randomBytes(32).toString('hex');

const getTokenOwner = token => decode(token.split('.')[0]);

module.exports = {
	recurseDir,
	constants,
	generateSecret,
	getTokenOwner
};
