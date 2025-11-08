import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Seeding database...");

	// Helper: safely call deleteMany if the model exists on the Prisma client
	const safeDelete = async (modelName: string) => {
		try {
			const model = (prisma as any)[modelName];
			if (model && typeof model.deleteMany === "function") {
				await model.deleteMany();
				console.log(`🧹 Cleared ${modelName}`);
			}
		} catch (e: any) {
			console.warn(`Could not clear ${modelName}:`, e?.message ?? e);
		}
	};

	// Clean a small set of models (safe)
	await Promise.all([
		safeDelete("tag"),
		safeDelete("project"),
		safeDelete("blogPost"),
		safeDelete("resume"),
		safeDelete("mediaItem"),
		safeDelete("certification"),
		safeDelete("achievement"),
		safeDelete("research"),
	]);

	// Create a few basic records that match the MongoDB schema
	console.log("📌 Creating tags...");
	const tag = await prisma.tag.create({
		data: { name: "React", slug: "react", color: "#61DAFB" },
	});

	console.log("🚀 Creating a sample project...");
	const project = await prisma.project.create({
		data: {
			slug: "sample-project",
			title: "Sample Project",
			summary: "A short summary of the sample project",
			description: "This is a sample project created by the seed script.",
			stack: ["Next.js", "TypeScript"],
			repoUrl: "https://github.com/example/sample-project",
			liveUrl: "https://example.com/sample-project",
			coverImageUrl: "https://via.placeholder.com/800x400",
			metrics: { stars: 0, forks: 0, views: 0 },
			published: true,
			featured: false,
			displayOrder: 1,
			tagIds: [tag.id],
		},
	});

	console.log("📝 Creating a sample blog post...");
	const blogPost = await prisma.blogPost.create({
		data: {
			slug: "hello-world",
			title: "Hello World",
			excerpt: "This is the first blog post created by the seed script.",
			content: "# Hello World\n\nWelcome to the blog.",
			coverImageUrl: "https://via.placeholder.com/1200x630",
			published: true,
			featured: false,
			viewCount: 0,
			readTime: 2,
			tagIds: [tag.id],
		},
	});

	console.log("📄 Creating a sample resume...");
	await prisma.resume.create({
		data: {
			version: "2025-v1",
			fileUrl: "https://example.com/resume.pdf",
			fileName: "resume-2025.pdf",
			isActive: true,
			description: "Sample resume file",
		},
	});

	console.log("✅ Seeding completed successfully!");
}

main()
	.catch((e) => {
		console.error("❌ Seeding failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});


