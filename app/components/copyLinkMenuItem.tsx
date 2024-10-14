"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface ICopyLinkMenuItem {
	meetingUrl: string;
}

const CopyLinkMenuItem = ({ meetingUrl }: ICopyLinkMenuItem) => {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(meetingUrl);
			toast.success("URL has been copied");
		} catch (e) {
			toast.error("Could not copy url");
		}
	};
	return (
		<>
			<DropdownMenuItem onSelect={handleCopy}>
				<Link2 className="mr-2 size-4" />
				Copy
			</DropdownMenuItem>
		</>
	);
};

export default CopyLinkMenuItem;
