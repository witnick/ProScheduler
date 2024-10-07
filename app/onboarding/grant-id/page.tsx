import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import React from "react";
import laughingDude from "@/public/work-is-almost-over-happy.gif";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar } from "lucide-react";

const OnboardingRouteTwo = () => {
	return (
		<div className="min-h-screen w-screen flex items-center justify-center">
			<Card>
				<CardHeader>
					<CardTitle> This is the card title</CardTitle>
					<CardDescription>
						{" "}
						connect calendar to account.
						<Image
							src={laughingDude}
							alt="laughing"
							className="w-full rounded-lg"
						/>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild className="w-full">
						<Link href="/api/auth">
							<Calendar className="size-4 mr-2" />
							Connect your calendar to your account
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default OnboardingRouteTwo;
