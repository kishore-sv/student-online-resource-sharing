import { db } from "./index";
import { user, resource } from "./schema";
import { eq } from "drizzle-orm";

const STUDY_HUB_USER_ID = "studyhub-admin";

const INITIAL_RESOURCES = [
  { id: "neet-prep", title: "NEET Prep", description: "Everything you need for NEET", category: "blog" as const },
  { id: "dsa-prep", title: "DSA Prep", description: "Master coding interviews", category: "blog" as const },
  { id: "dbms-prep", title: "DBMS Prep", description: "Master SQL and databases", category: "blog" as const },
  { id: "os-notes", title: "OS complete notes", description: "Review core OS concepts", category: "blog" as const },
  { id: "learn-react", title: "Learn React", description: "Build modern UIs", category: "blog" as const },
  { id: "expert-express", title: "Expert Express", description: "Master Node and Express", category: "blog" as const },
];

export async function seedInitialResources() {
  try {
    // 1. Ensure StudyHub user exists
    const studyHub = await db.query.user.findFirst({
      where: eq(user.id, STUDY_HUB_USER_ID),
    });

    if (!studyHub) {
      await db.insert(user).values({
        id: STUDY_HUB_USER_ID,
        name: "StudyHub",
        username: "studyhub",
        email: "admin@studyhub.com",
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        collegeName: "StudyHub Academy",
      });
    }

    // 2. Ensure initial resources exist
    for (const res of INITIAL_RESOURCES) {
      const existing = await db.query.resource.findFirst({
        where: eq(resource.id, res.id),
      });

      if (!existing) {
        await db.insert(resource).values({
          id: res.id,
          title: res.title,
          description: res.description,
          category: res.category,
          visibility: "public",
          authorId: STUDY_HUB_USER_ID,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Failed to seed initial resources:", error);
  }
}
