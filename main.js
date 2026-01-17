
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

const generateMenuSet = (includeDessert) => {
    const mainMenus = pickUniqueItems(MAIN_MENUS, 3);
    const dessert = includeDessert ? pickUniqueItems(DESSERT_MENUS, 1)[0] : null;
    return { mainMenus, dessert };
};

const renderSets = (sets) => {
    lottoNumbersContainer.innerHTML = "";
    sets.forEach((set, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "lotto-set";
        const label = document.createElement("span");
        label.className = "set-label";
        label.textContent = `세트 ${index + 1}`;
        wrapper.appendChild(label);

        set.mainMenus.forEach((menu) => {
            const span = document.createElement("span");
            span.className = "menu-item";
            span.textContent = menu;
            wrapper.appendChild(span);
        });

        if (set.dessert !== null) {
            const bonusSpan = document.createElement("span");
            bonusSpan.className = "menu-item bonus";
            bonusSpan.textContent = set.dessert;
            wrapper.appendChild(bonusSpan);
        }

        lottoNumbersContainer.appendChild(wrapper);
    });
};

const formatSetsForCopy = (sets) => {
    return sets
        .map((set, index) => {
            const main = set.mainMenus.join(", ");
            if (set.dessert !== null) {
                return `세트 ${index + 1}: ${main} + 디저트 ${set.dessert}`;
            }
            return `세트 ${index + 1}: ${main}`;
        })
        .join("\n");
};

let lastGeneratedSets = [];

generateBtn.addEventListener("click", () => {
    const includeDessert = dessertToggle?.checked ?? false;
    lastGeneratedSets = Array.from({ length: 5 }, () => generateMenuSet(includeDessert));
    renderSets(lastGeneratedSets);
});

if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
        if (!lastGeneratedSets.length) {
            return;
        }
        const text = formatSetsForCopy(lastGeneratedSets);
        try {
            await navigator.clipboard.writeText(text);
            copyBtn.textContent = "복사됨!";
            setTimeout(() => {
                copyBtn.textContent = "메뉴 복사";
            }, 1500);
        } catch (error) {
            copyBtn.textContent = "복사 실패";
            setTimeout(() => {
                copyBtn.textContent = "메뉴 복사";
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
