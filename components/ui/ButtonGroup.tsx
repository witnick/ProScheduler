"use client";
import React, { Children, cloneElement, ReactElement } from "react";
import { cn } from "@/lib/utils";
import { ButtonProps } from "./button";

interface IButtonGroup {
	className?: string;
	children: ReactElement<ButtonProps>[];
}
const ButtonGroup = ({ className, children }: IButtonGroup) => {
	const totalBtns = Children.count(children);
	return (
		<div className={cn("flex w-full", className)}>
			{children.map((child, index) => {
				const isFirstItem = index === 0;
				const isLastItem = index === totalBtns - 1;

				return cloneElement(child, {
					className: cn(
						{
							"rounded-l-none": !isFirstItem,
							"rounded-r-none": !isLastItem,
							"rounded-l-0": !isFirstItem,
						},
						child.props.className
					),
				});
			})}
		</div>
	);
};

export default ButtonGroup;
