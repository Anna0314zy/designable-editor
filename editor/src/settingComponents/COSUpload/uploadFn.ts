import { getCosCredential, IUploadFile } from "../../api/upload";
import FileUpload, { IAuthInfo, ICOSInfo, IUploadInput } from "../../../node_modules/@ld/file-upload/dist";
import { uploadpath,imageWH,uploadAccept } from "../../components/Img/type";
import { md5Hash } from "../../utils/md5";
import { TreeNode, Workspace } from "@editor/core/src/models";
import { RcFile } from "antd/es/upload";
import { UploadStatus } from "./type";
import { message } from "antd";
interface IUploadOptions{
	node:TreeNode,
	currentWorkspace:Workspace
	fileData:IUploadFile
}
export interface IUploadProps {
	CdnHost: string;
	file: RcFile;
	type: keyof typeof uploadAccept;
	pathConfigList: Array<{
		name: string;
		path: string;
		type: string;
	}>;
	onProgress?: IUploadInput<File,IUploadOptions>["onProgress"];
	onFinish?: IUploadInput<File,IUploadOptions>["onFinish"];
	onError?: IUploadInput<File,IUploadOptions>["onError"];
	options:{
		node:TreeNode,
		currentWorkspace:Workspace
		fileData:IUploadFile
	},
}
export const uploadFn = async ({
	CdnHost,
	type,
	pathConfigList,
	file,
	onProgress,
	onFinish,
	onError,
	options,
}: IUploadProps) => {
	try{
		const credentialData = await getCosCredential();
	const Bucket = import.meta.env.VITE_EDITOR_BUCKET;
	const Region = import.meta.env.VITE_EDITOR_REGION;
	const cosInfo: ICOSInfo = {
		Bucket,
		Region,
		Folder: uploadpath(pathConfigList, type) || "",
		Secure: true, // 开启https
		CdnHost,
	};
	const authInfo: IAuthInfo = {
		TmpSecretId: credentialData?.credentials?.tmpSecretId || "",
		TmpSecretKey: credentialData?.credentials?.tmpSecretKey || "",
		SecurityToken: credentialData?.credentials?.sessionToken || "",
		StartTime: credentialData?.startTime || 0,
		ExpiredTime: credentialData?.expiredTime || 0,
	};
	// 实例化cos
	const cos = new FileUpload(authInfo, cosInfo);
	const suffix = file.name.split(".").pop().toLocaleLowerCase()
	const {md5:Md5,base64Hash} = await md5Hash(file);
	//上传
	const fileData = {
		...options.fileData,
		fileMd5: Md5,
		fileName: file.name,
		cosFullPath: cosInfo.Folder + "/" + Md5 + "." + suffix,
	}
	cos.upload<File,IUploadOptions>({
		file: file,
		onProgress,
		onFinish,
		onError,
		Md5:Md5,
		base64Hash,
		cosFullPath:fileData.cosFullPath,
		uploadOptions:{
			...options,
			fileData
		}
	});
	}catch(e){
		return Promise.reject(e)
	}
};
export const getLocalUrl = (file) => {
	const url = URL.createObjectURL(file);
	return {
		cancel: () => {
			URL.revokeObjectURL(url);
		},
		url,
	};
};

export const beforeGetFileData = ({type,file}):IUploadFile => {
	const parts = file.name.split(".");
	const extension = parts.pop().toLocaleLowerCase();
	const newFilename = parts.join(".") + "." + extension;
	const fileData:IUploadFile = {
		fileName: newFilename,
		fileMd5: "",
		fileSize: file.size,
		fileType: file.type,
		id: file.uid,
		percent: 0,
		status: UploadStatus.uploading,
		uploadPercent:0,
		width: 200,
		height: 200,
		cosFullPath: "",
		resourceFormat: file.type,
		resourceType: type,
		elementId: "",
		localUrl:''
	};

	if(type === 'pic') {
		fileData.localUrl = getLocalUrl(file).url
	}
	
	return fileData
}
export const beforeUpload = async ({
	file,
	type
}: {
	file: File;
	node: TreeNode;
	currentWorkspace: Workspace;
	type: keyof typeof uploadAccept;
}) => {

	// 检查是都有后缀 没有后缀需要提示不能上传
	const suffix = file.name.split(".").pop().toLocaleLowerCase()
	if (!suffix) {
		message.error("请上传正确的文件");
		return Promise.reject();
	}
	// uploadAccept
	// 检验文件类型
	// 去掉 uploadAccept[type] 里面的.
	const includeType = uploadAccept[type].replace(/\./g, "");
	// const fileType = file.type.split('/')[1];
	// 文件名后缀判断文件类型
	if(!includeType.includes(suffix)) {
		message.error(`请上传${uploadAccept[type]}类型文件`);
		return Promise.reject();
	}
	// 视频大小不能超过20M
	if (type === "video" && file.size > 20 * 1024 * 1024) {
		message.error("视频大小不能超过20M");
		return Promise.reject();
	}

	// 图片宽高不能大于1280*960
	if (type === "pic") {
		const { width, height } = await imageWH(file);
		if (width > 1280 || height > 960) {
			message.error("图片宽高不能大于1280*960");
			return Promise.reject();
		}
		// 不能超过512kb
		if (file.size > 512 * 1024) {
			message.error("图片大小不能超过512kb");
			return Promise.reject();
		}
	}

	return true;
}