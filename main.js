
const lottoNumbersContainer = document.getElementById("lotto-numbers");
const generateBtn = document.getElementById("generate-btn");
const themeToggle = document.getElementById("theme-toggle");
const dessertToggle = document.getElementById("dessert-toggle");
const copyBtn = document.getElementById("copy-btn");
const characterWalker = document.getElementById("character-walker");
const characterImg = document.getElementById("character-img");
const root = document.documentElement;

const THEME_KEY = "theme";

const applyTheme = (theme) => {
    const isDark = theme === "dark";
    root.dataset.theme = theme;
    if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.textContent = isDark ? "라이트 모드" : "다크 모드";
    }
};

const getPreferredTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
        return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

applyTheme(getPreferredTheme());

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_KEY, nextTheme);
        applyTheme(nextTheme);
    });
}

const MAIN_MENUS = [
    "김치볶음밥",
    "비빔밥",
    "불고기 덮밥",
    "치킨마요",
    "카레라이스",
    "떡볶이",
    "제육볶음",
    "파스타",
    "샐러드",
    "쌀국수",
    "라멘",
    "샌드위치",
    "우동",
    "짜장면",
    "함박스테이크",
    "된장찌개",
    "순두부찌개",
    "돈가스",
];

const DESSERT_MENUS = [
    "아이스크림",
    "과일컵",
    "요거트",
    "마카롱",
    "찹쌀떡",
    "티라미수",
    "푸딩",
];

const pickUniqueItems = (source, count) => {
    const pool = [...source];
    const picks = [];
    while (pool.length && picks.length < count) {
        const index = Math.floor(Math.random() * pool.length);
        picks.push(pool.splice(index, 1)[0]);
    }
    return picks;
};

const generateMenu = (includeDessert) => {
    const mainMenu = pickUniqueItems(MAIN_MENUS, 1)[0];
    const dessert = includeDessert ? pickUniqueItems(DESSERT_MENUS, 1)[0] : null;
    return { mainMenu, dessert };
};

const renderMenu = (menu) => {
    lottoNumbersContainer.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "lotto-set";
    const label = document.createElement("span");
    label.className = "set-label";
    label.textContent = "추천 메뉴";
    wrapper.appendChild(label);

    const mainSpan = document.createElement("span");
    mainSpan.className = "menu-item";
    mainSpan.textContent = menu.mainMenu;
    wrapper.appendChild(mainSpan);

    if (menu.dessert !== null) {
        const bonusSpan = document.createElement("span");
        bonusSpan.className = "menu-item bonus";
        bonusSpan.textContent = menu.dessert;
        wrapper.appendChild(bonusSpan);
    }

    lottoNumbersContainer.appendChild(wrapper);
};

const formatMenuForCopy = (menu) => {
    if (menu.dessert !== null) {
        return `추천 메뉴: ${menu.mainMenu} + 디저트 ${menu.dessert}`;
    }
    return `추천 메뉴: ${menu.mainMenu}`;
};

let lastGeneratedMenu = null;

generateBtn.addEventListener("click", () => {
    const includeDessert = dessertToggle?.checked ?? false;
    lastGeneratedMenu = generateMenu(includeDessert);
    renderMenu(lastGeneratedMenu);
});

if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
        if (!lastGeneratedMenu) {
            return;
        }
        const text = formatMenuForCopy(lastGeneratedMenu);
        try {
            await navigator.clipboard.writeText(text);
            copyBtn.textContent = "복사됨!";
            setTimeout(() => {
                copyBtn.textContent = "추천 복사";
            }, 1500);
        } catch (error) {
            copyBtn.textContent = "복사 실패";
            setTimeout(() => {
                copyBtn.textContent = "추천 복사";
            }, 1500);
        }
    });
}

const WALKERS = [
    "img/animal-dog.svg",
    "img/animal-cat.svg",
    "img/animal-elephant.svg",
    "img/animal-rabbit.svg",
];

const pickRandomWalker = (previous) => {
    if (WALKERS.length <= 1) {
        return WALKERS[0];
    }
    let next = previous;
    while (next === previous) {
        next = WALKERS[Math.floor(Math.random() * WALKERS.length)];
    }
    return next;
};

if (characterWalker && characterImg) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let direction = "right";
    let currentWalker = WALKERS[0];

    const applyWalker = () => {
        characterImg.src = currentWalker;
        characterWalker.classList.toggle("is-left", direction === "left");
    };

    currentWalker = pickRandomWalker(null);
    applyWalker();

    if (!prefersReducedMotion) {
        characterWalker.addEventListener("animationiteration", () => {
            direction = direction === "right" ? "left" : "right";
            currentWalker = pickRandomWalker(currentWalker);
            applyWalker();
        });
    }
}

const commentForm = document.getElementById("comment-form");
const commentList = document.getElementById("comment-list");
const COMMENTS_KEY = "menu-comments";

const loadComments = () => {
    try {
        const stored = localStorage.getItem(COMMENTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        return [];
    }
};

const saveComments = (comments) => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
};

const renderComments = (comments) => {
    if (!commentList) {
        return;
    }
    commentList.innerHTML = "";
    if (!comments.length) {
        const empty = document.createElement("p");
        empty.className = "comment-meta";
        empty.textContent = "첫 댓글을 남겨주세요.";
        commentList.appendChild(empty);
        return;
    }

    comments.forEach((comment) => {
        const card = document.createElement("div");
        card.className = "comment-card";

        const meta = document.createElement("div");
        meta.className = "comment-meta";
        meta.textContent = `${comment.author} · ${comment.date}`;

        const text = document.createElement("p");
        text.className = "comment-text";
        text.textContent = comment.message;

        card.appendChild(meta);
        card.appendChild(text);
        commentList.appendChild(card);
    });
};

const comments = loadComments();
renderComments(comments);

if (commentForm) {
    commentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(commentForm);
        const author = formData.get("author")?.toString().trim() || "익명";
        const message = formData.get("message")?.toString().trim();
        if (!message) {
            return;
        }
        const newComment = {
            author,
            message,
            date: new Date().toLocaleDateString("ko-KR"),
        };
        comments.unshift(newComment);
        saveComments(comments);
        renderComments(comments);
        commentForm.reset();
    });
}
