
const axios = require("axios");
const getSysVersion = require('./setVersion.cjs');
async function promptForVersion(inquirer,currentVersion) {
	const questions = [
		{
			type: "input",
			name: "version",
			message: `是否通过接口更改版本号请输入新的版本号 (当前版本是 ${currentVersion}):`,
		},
	];

	const answers = await inquirer.prompt(questions);
	return answers.version;
}
const updateVersionApi = async (newVersion) => {
    let host = ''
    //   if(env === 'prod') host = ''
      try{
        await axios.post(
            `${host}/classroom-slides/manage/system/version/save-or-update`,{
                systemName: 'SLIDE_EDITOR',
                version: newVersion
            })
            console.log('%c 🍺 发布版本成功: ', 'font-size:20px;background-color: #465975;color:#fff;', newVersion)
      }catch(err) {
        console.log('%c 🍺 发布版本遇到错误: ', 'font-size:20px;background-color: #465975;color:#fff;', err)
      }
}
const updateVersion = async (inquirer) => {
    const currentVersion = await getSysVersion()
    const promptVersion = await promptForVersion(inquirer,currentVersion)
    const newVersion = promptVersion.trim()
    if(newVersion){
        updateVersionApi(newVersion)
    }else {
        const currentVersion = await getSysVersion()
        console.log('不用更改版本号,当前版本号是',currentVersion)
    }
}
// 是否接口更新版本
import("inquirer")
	.then((inquirer) => {
		// 这里写使用 inquirer 的代码
		updateVersion(inquirer.default);

	})
	.catch((error) => {
		console.error("加载 inquirer 模块时出错：", error);
	});