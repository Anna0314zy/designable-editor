/*
 * @Date: 2023-12-19 19:40:54
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-12-27 20:13:11
 * @FilePath: /slides-engine/packages/react/src/widgets/AddPageWidget/index.tsx
 */
import React from "react";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";

interface IAddPageProps {
	children?: React.ReactNode;
	onClick: (type: number) => void;
}

export enum PageType {
	normalPage = 1,
	gamePage = 2,
	videoPage = 3,
}

export const items: MenuProps["items"] = [
	{
		label: "课件页",
		key: PageType.normalPage,
	},
	{
		label: "游戏页",
		key: PageType.gamePage,
	},
	{
		label: "视频页",
		key: PageType.videoPage,
	},
];

export const AddPage: React.FC<IAddPageProps> = ({ onClick }) => {
	const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onClick(PageType.normalPage);
	};

	const handleMenuClick: MenuProps["onClick"] = (e) => {
		onClick(Number(e.key) as unknown as number);
	};


	const menuProps = {
		items,
		onClick: handleMenuClick,
	};
	return (
		<Dropdown.Button
			buttonsRender={([leftButton, rightButton]) => [
				React.cloneElement(leftButton as React.ReactElement, {
					style: { flex: 1 },
				}),
				React.cloneElement(rightButton as React.ReactElement),
			]}
			menu={menuProps}
			onClick={handleButtonClick}
		>
			新建页
		</Dropdown.Button>
	);
};
