import Image from "next/image";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import NavBar from "./components/navbar";

export default async function Home() {
	const session = await auth();
	if (session?.user) redirect("/dashboard");
	return (
		<>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<NavBar />
			</div>
			<h1> hello world</h1>
		</>
	);
}
