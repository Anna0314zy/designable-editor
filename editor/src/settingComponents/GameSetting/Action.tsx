import React, { CheckOutlined,EditOutlined } from "@ant-design/icons";
import { FormButtonGroup, Submit } from "@slides/antd";
interface IProps {
	handleCreate: () => void;
	loading: boolean;
	btnEdit: boolean;
}
export const Action = ({ handleCreate, loading, btnEdit }: IProps) => {
	return (
		<FormButtonGroup>
			<Submit
				onClick={handleCreate}
				type="text"
				icon={!btnEdit ? <EditOutlined /> : <CheckOutlined />}
				loading={loading}
			>
				{!btnEdit ? "修改" : "完成"}
			</Submit>
		</FormButtonGroup>
	);
};
