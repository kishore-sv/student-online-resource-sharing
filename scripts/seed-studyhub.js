import { db } from '../lib/db/index';
import { user } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
    const studyHub = await db.query.user.findFirst({
        where: eq(user.username, 'StudyHub')
    });

    if (!studyHub) {
        await db.insert(user).values({
            id: 'studyhub-id',
            name: 'StudyHub',
            username: 'StudyHub',
            email: 'support@studyhub.com',
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            collegeName: 'Official StudyHub'
        });
        console.log('StudyHub user created');
    } else {
        console.log('StudyHub user already exists');
    }
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
