import Image from "next/image";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
	const session = await auth();
	if (session?.user) redirect("/dashboard");
	return (
		<>
			<h1> hello world</h1>
		</>
	);
}
