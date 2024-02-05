import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    // Create guest user
    const guestUser = await db.user.upsert({
        where: {
            email: "guest@fklk.dev",
        },
        update: {},
        create: {
            id: "$unique_id$",
            email: "guest@fklk.dev",
            handle: "guest",
            hashedPassword:
                "$argon2id$v=19$m=19456,t=2,p=1$9zaGjyUeI814aDsR6uw8MA$/c6KTvxE8dnAA00tXYCwjEkZwyq+cgbO/M6p9eH/wts",
        },
    });

    // Create genres
    const actionGenre = await db.genre.upsert({
        where: {
            name: "Action",
        },
        update: {},
        create: {
            name: "Action",
        },
    });

    const fantasyGenre = await db.genre.upsert({
        where: {
            name: "Fantasy",
        },
        update: {},
        create: {
            name: "Fantasy",
        },
    });

    const sciFiGenre = await db.genre.upsert({
        where: {
            name: "Sci-Fi",
        },
        update: {},
        create: {
            name: "Sci-Fi",
        },
    });

    // Create stories
    let greenhouseStory = (
        await db.story.findMany({ where: { name: "Greenhouse" } })
    ).at(0);
    if (!greenhouseStory) {
        greenhouseStory = await db.story.create({
            data: {
                name: "Greenhouse",
                author: {
                    connect: {
                        id: guestUser.id,
                    },
                },
                genre: {
                    connect: {
                        id: sciFiGenre.id,
                    },
                },
            },
        });
    }

    let epicFantasyStory = (
        await db.story.findMany({ where: { name: "Epic Fantasy" } })
    ).at(0);
    if (!epicFantasyStory) {
        epicFantasyStory = await db.story.create({
            data: {
                name: "Epic Fantasy",
                author: {
                    connect: {
                        id: guestUser.id,
                    },
                },
                genre: {
                    connect: {
                        id: fantasyGenre.id,
                    },
                },
            },
        });
    }

    let intoTheUnknownStory = (
        await db.story.findMany({ where: { name: "Into the Unknown" } })
    ).at(0);
    if (!intoTheUnknownStory) {
        intoTheUnknownStory = await db.story.create({
            data: {
                name: "Into the Unknown",
                author: {
                    connect: {
                        id: guestUser.id,
                    },
                },
                genre: {
                    connect: {
                        id: actionGenre.id,
                    },
                },
            },
        });
    }

    // Create chapters
    // TODO: Add longer placeholder text. Cannot import from file -> results in error
    const chapterPlaceholderText = "tbd";

    for (let story of [
        greenhouseStory,
        epicFantasyStory,
        intoTheUnknownStory,
    ]) {
        for (let i = 1; i < Math.floor(Math.random() * 10); i++) {
            await db.chapter.create({
                data: {
                    name: "Not Defined",
                    descriptor: `Chapter ${i}`,
                    content: chapterPlaceholderText,
                    story: {
                        connect: {
                            id: story.id,
                        },
                    },
                },
            });
        }
    }

    console.log(
        `Create a new account or log in using: \nEmail: ${guestUser.email}\nHandle: ${guestUser.handle}\nPassword: guest`
    );
}

main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });
