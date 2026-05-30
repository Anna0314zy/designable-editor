// 获取当前页面的 视频流组件
import { CameraType } from "@ld/slide-editor";
export const getCamera = (currentPage) => {
	const children = currentPage.pageInfo.children || [];
	return children.reduce(
		(pre, cur) => {
			if (cur.componentName === "Camera") {
				if (cur.props.type === CameraType.teacher) pre.teacherCamera += 1;
				else if (cur.props.type === CameraType.student) pre.studentCamera += 1;
				return pre;
			}
			return pre;
		},
		{
			teacherCamera: 0,
			studentCamera: 0,
		}
	);
};
export const TEACHER_MAX = 1;
export const STUDENT_MAX = 5;