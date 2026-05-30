const axios = require("axios");
const fs = require("fs");
const path = require("path");
function updateVersion(version) {
	// 读取 package.json
	const packageJsonPath = path.resolve(process.cwd(), "package.json");
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
	// 修改版本号
	packageJson.version = version;

	// 将结果写回 package.json
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
async function promptForVersion(inquirer, currentVersion) {
	const questions = [
		{
			type: "input",
			name: "version",
			message: `请输入新的版本号 (当前版本是 ${currentVersion}):`,
		},
	];

	const answers = await inquirer.prompt(questions);
	return answers.version;
}
const getSysVersion = async () => {
	const env = process.env.NODE_ENV;
	let host = "https://test-class-api-online.saasp.vdyoo.com";
	if (env === "prod")
		host = "https://classroom-api-online.saasp.vdyoo.com";
		const getSysVersion = systemName => {
			return axios.get(`${host}/classroom-slides/manage/${systemName}/current-version`,{
			  headers:{
				token:'f47ac10b-58cc-4372-a567-0e02b2c3d479'
			  }
			})
		  }
	const res = await getSysVersion("SLIDE_EDITOR");
	return res.data.data.currentVersion;
};
async function build(inquirer) {
	const currentVersion = await getSysVersion();
	const version = await promptForVersion(inquirer, currentVersion);
	// 修改本地的 package.json
	// 使用新的版本号
	updateVersion(version);
}

import("inquirer")
	.then((inquirer) => {
		// 这里写使用 inquirer 的代码
		build(inquirer.default);
	})
	.catch((error) => {
		console.error("加载 inquirer 模块时出错：", error);
	});
module.exports = getSysVersion;