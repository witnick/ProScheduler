import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const SuccessPage = () => {
	setTimeout(() => {
		redirect("/dashboard/meetings");
	}, 5000);
	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<Card className="max-w-[400px] h-fit w-full mx-auto">
				<CardContent className="p-5 flex flex-col w-full justify-center items-center gap-2">
					<div className="w-fit h-fit p-2 bg-green-500/20 rounded-full flex items-center justify-center">
						<Check />
						SUCCESS!
					</div>
					<h1 className="font-semibold">This event is scheduled</h1>
					<p className="text-center font-light text-muted-foreground">
						We emailed you a calendar invitation with all the
						details and the video call link!
					</p>
					<Link href="/" className="w-full">
						<Button variant={"outline"} className="w-full">
							Close this page
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
};

export default SuccessPage;
