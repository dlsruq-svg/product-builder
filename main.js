
const lottoNumbersContainer = document.getElementById("lotto-numbers");
const generateBtn = document.getElementById("generate-btn");
const themeToggle = document.getElementById("theme-toggle");
const bonusToggle = document.getElementById("bonus-toggle");
const copyBtn = document.getElementById("copy-btn");
const root = document.documentElement;

const THEME_KEY = "theme";

const applyTheme = (theme) => {
    const isDark = theme === "dark";
    root.dataset.theme = theme;
    if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
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

const generateNumbers = (includeBonus) => {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const mainNumbers = Array.from(numbers).sort((a, b) => a - b);
    let bonus = null;
    if (includeBonus) {
        do {
            bonus = Math.floor(Math.random() * 45) + 1;
        } while (numbers.has(bonus));
    }

    return { mainNumbers, bonus };
};

const renderSets = (sets) => {
    lottoNumbersContainer.innerHTML = "";
    sets.forEach((set, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "lotto-set";
        const label = document.createElement("span");
        label.className = "set-label";
        label.textContent = `Set ${index + 1}`;
        wrapper.appendChild(label);

        set.mainNumbers.forEach((number) => {
            const span = document.createElement("span");
            span.textContent = number;
            wrapper.appendChild(span);
        });

        if (set.bonus !== null) {
            const bonusSpan = document.createElement("span");
            bonusSpan.className = "bonus";
            bonusSpan.textContent = set.bonus;
            wrapper.appendChild(bonusSpan);
        }

        lottoNumbersContainer.appendChild(wrapper);
    });
};

const formatSetsForCopy = (sets) => {
    return sets
        .map((set, index) => {
            const main = set.mainNumbers.join(", ");
            if (set.bonus !== null) {
                return `Set ${index + 1}: ${main} + Bonus ${set.bonus}`;
            }
            return `Set ${index + 1}: ${main}`;
        })
        .join("\n");
};

let lastGeneratedSets = [];

generateBtn.addEventListener("click", () => {
    const includeBonus = bonusToggle?.checked ?? false;
    lastGeneratedSets = Array.from({ length: 5 }, () => generateNumbers(includeBonus));
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
            copyBtn.textContent = "Copied!";
            setTimeout(() => {
                copyBtn.textContent = "Copy Numbers";
            }, 1500);
        } catch (error) {
            copyBtn.textContent = "Copy failed";
            setTimeout(() => {
                copyBtn.textContent = "Copy Numbers";
            }, 1500);
        }
    });
}
