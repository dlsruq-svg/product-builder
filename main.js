
const lottoNumbersContainer = document.getElementById("lotto-numbers");
const generateBtn = document.getElementById("generate-btn");
const themeToggle = document.getElementById("theme-toggle");
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

generateBtn.addEventListener("click", () => {
    lottoNumbersContainer.innerHTML = ""; // Clear previous numbers
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    for (const number of numbers) {
        const span = document.createElement("span");
        span.textContent = number;
        lottoNumbersContainer.appendChild(span);
    }
});
