
const lottoNumbersContainer = document.getElementById("lotto-numbers");
const generateBtn = document.getElementById("generate-btn");
const themeToggle = document.getElementById("theme-toggle");

const THEME_KEY = "theme";

const applyTheme = (theme) => {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark", isDark);
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.textContent = isDark ? "Dark" : "Light";
};

const getPreferredTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
        return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

applyTheme(getPreferredTheme());

themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
});

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
