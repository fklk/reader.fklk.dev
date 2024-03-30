import { Prisma, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    // Create Genres
    const genres = [
        "Action",
        "Adventure",
        "Comedy",
        "Fantasy",
        "Romance",
        "Slice of Life",
        "Supernatural",
    ];

    const presentGenres = await db.genre.findMany();

    await db.genre.createMany({
        data: genres
            .filter(genre => !presentGenres.map(g => g.name).includes(genre))
            .map(genre => ({
                name: genre,
            })),
    });

    const allGenres = await db.genre.findMany();

    // Create Users
    const userNames = ["valery", "donald", "ernest"];
    const hashedPassword =
        "$argon2id$v=19$m=19456,t=2,p=1$SmNYL9mM3H9bSXSRkD51ew$KdjirKews86hGciyBVxbVbRGXT7bxPugR2CBho2OPGE";

    const presentUsers = await db.user.findMany();

    await db.user.createMany({
        data: userNames
            .filter(
                userName => !presentUsers.map(u => u.handle).includes(userName)
            )
            .map(userName => ({
                id: `$demoUser-${userName}`,
                handle: userName,
                email: `${userName}@demo.demo`,
                role: "USER",
                hashedPassword: hashedPassword,
            })),
    });

    let adminUser = await db.user.findUnique({
        where: {
            handle: "admin",
        },
    });

    if (!adminUser) {
        adminUser = await db.user.create({
            data: {
                id: "$demoUser-admin",
                handle: "admin",
                email: `admin@demo.demo`,
                role: "ADMIN",
                hashedPassword: hashedPassword,
            },
        });
    }

    const allUsers = await db.user.findMany();

    // Create Novels
    const novelByGenre = {
        Action: [
            {
                name: "The Last Hero",
                description:
                    "In a world plagued by darkness, a lone hero emerges to restore peace and order. With unparalleled bravery and unwavering determination, the hero embarks on a perilous journey, facing formidable foes and overcoming daunting challenges along the way. As the fate of the world hangs in the balance, the hero's courage serves as a beacon of hope, inspiring others to join the fight against evil. Will the hero succeed in vanquishing the forces of darkness and bringing about a new era of peace?",
            },
            {
                name: "Shadow Strike",
                description:
                    "In the shadows of a corrupt society, an elite assassin known only as 'Shadow' operates with deadly precision. Tasked with eliminating high-profile targets and unraveling a web of deceit, Shadow embarks on a dangerous mission to uncover a sinister conspiracy that threatens to plunge the world into chaos. With every strike, Shadow edges closer to the truth, but enemies lurk in every shadow, ready to strike back. Will Shadow survive long enough to expose the dark secrets lurking in the shadows?",
            },
            {
                name: "Eternal Combat",
                description:
                    "For centuries, two ancient rivals have clashed in an endless battle for supremacy. Bound by destiny and fueled by hatred, they wage war across the ages, leaving devastation in their wake. As the world trembles in fear, heroes rise to challenge the forces of darkness, but victory remains elusive. With each confrontation, the stakes grow higher, and the line between good and evil blurs. In the heart of the eternal combat, a hero must rise to break the cycle of violence and forge a new path forward.",
            },
            {
                name: "Blade of Vengeance",
                description:
                    "Haunted by memories of loss and betrayal, a skilled warrior embarks on a quest for vengeance. Armed with a razor-sharp blade and fueled by righteous fury, the warrior journeys across vast landscapes, hunting down those responsible for the death of their loved ones. Along the way, they confront their inner demons and grapple with the morality of their quest. As the final showdown approaches, the warrior must choose between vengeance and redemption, knowing that their decisions will shape the fate of the world.",
            },
        ],
        Adventure: [
            {
                name: "The Lost Treasure",
                description:
                    "In the heart of the wilderness, a group of intrepid adventurers sets out on a daring quest to uncover a long-lost treasure. Guided by ancient maps and cryptic clues, they traverse treacherous jungles, scale towering mountains, and brave the perils of uncharted territories. Along the way, they encounter cunning adversaries, forge unlikely alliances, and unravel the mysteries of a forgotten civilization. But as they draw closer to their elusive prize, they must confront their own inner demons and make sacrifices for the greater good.",
            },
            {
                name: "Journey Across the World",
                description:
                    "Embark on an epic journey across vast continents and distant lands in search of adventure and discovery. Follow the footsteps of a young explorer as they traverse rugged landscapes, navigate treacherous seas, and brave the elements to uncover the secrets of the world. Along the way, they encounter exotic cultures, encounter strange creatures, and forge bonds that will last a lifetime. But as they delve deeper into the unknown, they must confront the dangers that lurk in the shadows and overcome obstacles that test their courage and resolve.",
            },
            {
                name: "Secrets of the Forbidden Temple",
                description:
                    "Hidden deep within the heart of a forbidden jungle lies a temple shrouded in mystery and danger. As rumors of untold riches and ancient artifacts spread, a brave few dare to venture into the temple's depths in search of fortune and glory. But the temple holds secrets that defy comprehension and challenges that test the limits of human endurance. As explorers delve deeper into its chambers, they uncover the dark history of the temple and the sinister forces that guard its secrets. Will they unlock the temple's mysteries, or will they become trapped in its cursed halls forever?",
            },
        ],
        Comedy: [
            {
                name: "Laugh Out Loud",
                description:
                    "Prepare to embark on a side-splitting journey into the world of comedy and humor. From laugh-out-loud anecdotes to riotous pranks, this collection of comedic tales is guaranteed to tickle your funny bone and leave you in stitches. Join a cast of colorful characters as they navigate the absurdities of everyday life, from workplace mishaps to family shenanigans. With witty dialogue, slapstick humor, and unexpected twists, 'Laugh Out Loud' is a comedic rollercoaster ride that will leave you gasping for breath.",
            },
            {
                name: "The Prankster's Guide",
                description:
                    "Enter the mischievous world of pranks and practical jokes with 'The Prankster's Guide.' Follow the escapades of a master prankster as they unleash a series of hilarious gags and hijinks on their unsuspecting victims. From classic tricks to elaborate schemes, this guide offers step-by-step instructions for pulling off the perfect prank. But as the pranks escalate and the stakes rise, the prankster must outwit their rivals and avoid getting caught in the act. With laugh-out-loud humor and unexpected twists, 'The Prankster's Guide' is a must-read for anyone who loves a good laugh.",
            },
            {
                name: "Humor in the Air",
                description:
                    "Experience a whirlwind of laughter and fun with 'Humor in the Air,' a collection of comedic tales that will leave you grinning from ear to ear. From witty banter to outrageous antics, these stories capture the absurdities of everyday life with charm and humor. Join a colorful cast of characters as they navigate the ups and downs of love, friendship, and family, with plenty of laughs along the way. With clever wordplay, zany situations, and heartwarming moments, 'Humor in the Air' is the perfect pick-me-up for anyone in need of a good laugh.",
            },
        ],
        Fantasy: [
            {
                name: "Realm of Dragons",
                description:
                    "Enter a world where dragons reign supreme and magic is at every turn. In the vast expanse of the 'Realm of Dragons,' ancient creatures soar through the skies, wizards wield arcane powers, and epic battles decide the fate of nations. But beneath the surface of this magical realm lies a darker threat, lurking in the shadows and waiting to unleash chaos upon the world. As heroes rise to confront the forces of darkness, they must embark on a quest of epic proportions, facing trials and tribulations that will test their courage, strength, and resolve.",
            },
            {
                name: "The Wizard's Apprentice",
                description:
                    "Join a young apprentice on a magical journey to unlock their true potential in 'The Wizard's Apprentice.' Set in a world where magic is real and wonders abound, this enchanting tale follows the adventures of a humble apprentice as they train under a wise and powerful wizard. Along the way, they must overcome obstacles, unravel mysteries, and master the arcane arts to fulfill their destiny. But dark forces gather on the horizon, threatening to plunge the world into darkness. With courage, determination, and a dash of magic, the apprentice must rise to the challenge and become the hero they were always meant to be.",
            },
            {
                name: "Echoes of Magic",
                description:
                    "Discover the echoes of a long-forgotten magic that still linger in the world. In 'Echoes of Magic,' ancient artifacts, enchanted forests, and mysterious ruins hold clues to a power long lost to the ages. As explorers and adventurers seek to unlock the secrets of the past, they uncover hidden truths and awaken forces beyond their understanding. But with great power comes great peril, and those who dare to tamper with the forces of magic risk unleashing chaos upon the world. With danger lurking around every corner, heroes must rise to confront the darkness and restore balance to the realm.",
            },
            {
                name: "The Crystal Kingdom",
                description:
                    "A kingdom on the brink of destruction seeks a hero to save it from impending doom in 'The Crystal Kingdom.' As dark forces gather and ancient prophecies foretell the end of days, a young hero emerges to challenge fate and defy destiny. Armed with courage, wit, and a hint of magic, they embark on a quest to uncover the secrets of the Crystal Kingdom and unlock the power to save their world. But the path ahead is fraught with danger, and allies may prove to be enemies in disguise. With time running out, the hero must race against the clock to thwart the forces of darkness and restore hope to the kingdom.",
            },
        ],
        Romance: [
            {
                name: "Love in Bloom",
                description:
                    "Experience the blossoming of love in 'Love in Bloom,' a heartwarming romance that will touch your heart and soul. Set against the backdrop of a picturesque countryside, this tale follows the journey of two souls as they find love in the most unexpected of places. With tender moments, passionate encounters, and heartfelt confessions, 'Love in Bloom' captures the magic of falling in love and the joy of finding your soulmate. But as obstacles arise and challenges test their bond, will their love withstand the trials of fate?",
            },
            {
                name: "Heartstrings",
                description:
                    "A tale of love, loss, and the ties that bind us together, 'Heartstrings' is a poignant romance that will tug at your heartstrings. In a world where love is fleeting and hearts are fragile, two souls find solace in each other's arms, defying the odds to be together. But as fate conspires to tear them apart, they must confront their deepest fears and insecurities to hold onto the love that binds them. With every beat of their hearts, they discover the true power of love and the strength to overcome any obstacle.",
            },
            {
                name: "Whispers of Affection",
                description:
                    "Listen closely and you'll hear the whispers of affection in the air in 'Whispers of Affection,' a tender romance that will warm your heart. In a world where words are scarce and actions speak louder than words, two hearts find solace in silent gestures and stolen glances. With each passing moment, their bond grows stronger, transcending time and space to unite them in a love that knows no bounds. But as whispers turn into promises and promises into forever, they must navigate the uncertainties of life and the challenges that test their love.",
            },
        ],
        "Slice of Life": [
            {
                name: "Everyday Adventures",
                description:
                    "Join a cast of quirky characters as they navigate the ups and downs of everyday life in 'Everyday Adventures.' From mundane moments to extraordinary experiences, this collection of heartwarming stories celebrates the beauty of the ordinary and the magic of the mundane. With humor, wit, and a touch of whimsy, these tales capture the essence of life's simple pleasures and the joy of being alive. Whether it's a chance encounter, a heartfelt conversation, or a quiet moment of reflection, every adventure is an opportunity to discover something new about ourselves and the world around us.",
            },
            {
                name: "A Day in the City",
                description:
                    "Experience the hustle and bustle of city life in 'A Day in the City,' a charming slice-of-life tale that will transport you to the heart of the urban jungle. Follow a diverse cast of characters as they navigate the crowded streets, bustling markets, and vibrant neighborhoods of the city. From chance encounters to unexpected friendships, each moment is a chance to explore the rich tapestry of life in the city and discover the hidden beauty that lies beneath its surface. With every step, the characters learn valuable lessons about love, friendship, and the power of community.",
            },
            {
                name: "Memoirs of Ordinary Moments",
                description:
                    "Find beauty in the ordinary with 'Memoirs of Ordinary Moments,' a collection of heartwarming stories that celebrate the simple joys of life. From quiet mornings to lazy afternoons, these tales capture the magic of everyday moments and the profound impact they can have on our lives. With warmth, humor, and a touch of nostalgia, each story invites readers to slow down, savor the moment, and appreciate the beauty that surrounds them. Whether it's a shared meal, a quiet walk, or a heartfelt conversation, every moment is a treasure waiting to be discovered.",
            },
        ],
        Supernatural: [
            {
                name: "Beyond the Veil",
                description:
                    "Step into the supernatural realm and explore the mysteries that lie beyond the veil in 'Beyond the Veil.' In a world where magic is real and spirits roam the earth, ordinary rules no longer apply. Follow a group of intrepid explorers as they journey into the unknown, uncovering ancient secrets and facing unimaginable horrors along the way. With each step, they draw closer to the truth, but darkness lurks in every shadow, waiting to consume the unwary. Will they unravel the mysteries of the supernatural world, or will they become lost in its depths forever?",
            },
            {
                name: "Ghosts Among Us",
                description:
                    "Unravel the secrets of the spirit world in 'Ghosts Among Us,' a chilling tale of ghosts and hauntings that will send shivers down your spine. In a haunted mansion shrouded in darkness, a group of unsuspecting victims find themselves trapped in a nightmare of their own making. As malevolent spirits roam the halls and ancient curses awaken, they must confront their deepest fears and darkest secrets to survive the night. With danger lurking around every corner, they must rely on their wits, courage, and faith to banish the ghosts that haunt them and escape the mansion alive.",
            },
            {
                name: "Whispers from the Shadows",
                description:
                    "Dark whispers echo through the night as shadows dance in the moonlight in 'Whispers from the Shadows,' a haunting tale of mystery and suspense. In a world where darkness reigns supreme, a lone detective sets out to unravel the secrets that lie hidden in the shadows. As they delve deeper into the darkness, they uncover a web of lies, deceit, and betrayal that threatens to consume them. With danger lurking around every corner, they must trust in their instincts and rely on their wits to uncover the truth before it's too late.",
            },
        ],
    };

    const presentNovels = await db.novel.findMany();
    const novelsToCreate: any[] = [];
    const demoCoverPaths = Array.from({ length: 7 }).map(
        (_, i) => `/cover/demo${i + 1}.jpeg`
    );

    Object.entries(novelByGenre).forEach(([genre, novels]) => {
        novels.forEach(({ name, description }) => {
            const novelExists = presentNovels.some(
                presentNovel => presentNovel.name === name
            );
            if (!novelExists) {
                novelsToCreate.push({
                    name,
                    description,
                    imgPath:
                        demoCoverPaths[
                            Math.floor(Math.random() * demoCoverPaths.length)
                        ],
                    isOnShowcase: true,
                    genreId: allGenres.find(g => g.name === genre)!.id,
                    authorId: allUsers
                        .filter(u => u.handle.toLowerCase() !== "admin")
                        .at(Math.floor(Math.random() * allUsers.length - 1))!
                        .id,
                    status: "ONGOING",
                });
            }
        });
    });

    await db.novel.createMany({
        data: novelsToCreate,
    });

    const allNovels = await db.novel.findMany();

    // Create Chapters
    const chaptersToCreate: any[] = [];

    const fetchChapterContent = async (
        novelId: string,
        descriptor: number,
        chapterTitle: string
    ) => {
        const res = await fetch("https://loripsum.net/api/8/long");
        const content = await res.text();
        chaptersToCreate.push({
            name: chapterTitle,
            descriptor: descriptor,
            content: content.replaceAll("<p>", "").replaceAll("</p>", "\n"),
            novelId: novelId,
        });
    };

    for (const novel of allNovels) {
        const numChapters = Math.floor(Math.random() * 8) + 3;

        const fetchPromises = [];
        for (let i = 1; i <= numChapters; i++) {
            const chapterTitle = `Chapter ${i - 1}`;
            fetchPromises.push(
                fetchChapterContent(novel.id, i - 1, chapterTitle)
            );
        }

        await Promise.all(fetchPromises);
    }

    await db.chapter.createMany({
        data: chaptersToCreate,
    });

    const allChapters = await db.chapter.findMany();

    // Create Insights
    allNovels.forEach(async novel => {
        const firstChapterId = allChapters.find(
            chapter => chapter.novelId === novel.id && chapter.descriptor === 0
        )!.id;
        try {
            await db.novelInsight.createMany({
                data: [
                    {
                        trigger: "Lorem",
                        content: "Just a placeholder",
                        chapterId: firstChapterId,
                        novelId: novel.id,
                    },
                    {
                        trigger: "in",
                        content: "Just a placeholder",
                        chapterId: firstChapterId,
                        novelId: novel.id,
                    },
                ],
            });
        } catch (e) {}
    });
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
