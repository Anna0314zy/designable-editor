export enum UploadStatus {
	uploading = "uploading",
	done = "done",
	error = "error",
	loading = 'loading',//上传完之后加载过程很慢长 
	loaded = 'loaded' //上传完之后加载过程很慢长
}
export type IUploadStatus = keyof typeof UploadStatus;