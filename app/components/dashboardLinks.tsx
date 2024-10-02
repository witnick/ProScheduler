"use client";
import { cn } from "@/lib/utils";
import { Calendar, HomeIcon, LucideProps, Settings, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
interface iAppProps {
	id: number;
	name: string;
	href: string;
	icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
}

export const dashboardLinks: iAppProps[] = [
	{
		id: 0,
		name: "Event Types",
		href: "/dashboard",
		icon: HomeIcon,
	},
	{
		id: 1,
		name: "Meetings",
		href: "/dashboard/meetings",
		icon: User2,
	},
	{
		id: 2,
		name: "Availabilities",
		href: "/dashboard/availability",
		icon: Calendar,
	},
	{
		id: 3,
		name: "Settings",
		href: "/dashboard/settings",
		icon: Settings,
	},
];

const DashboardLinks = () => {
	const pathname = usePathname();
	return (
		<>
			{dashboardLinks.map((link) => (
				<Link
					key={link.id}
					href={link.href}
					className={cn(
						pathname === link.href
							? "text-primary bg-primary/10"
							: 'text-muted-foreground hover:"text-foreground',
						" flex items-center gap-2 p-2 rounded-xl transition-all hover:text-primary"
					)}>
					<link.icon className="size-6" />
					{link.name}
				</Link>
			))}
		</>
	);
};

export default DashboardLinks;
