document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme-select');
    const htmlElement = document.documentElement;
    const localStorageKey = 'theme';

    // Function to apply the selected theme
    function applyTheme(theme) {
        if (theme === 'system') {
            htmlElement.removeAttribute('data-theme');
            localStorage.removeItem(localStorageKey);
        } else {
            htmlElement.setAttribute('data-theme', theme);
            localStorage.setItem(localStorageKey, theme);
        }
    }

    // Load theme on page load
    const savedTheme = localStorage.getItem(localStorageKey);
    if (savedTheme) {
        applyTheme(savedTheme);
        themeSelect.value = savedTheme;
    } else {
        // If no preference saved, set 'system' as the default
        themeSelect.value = 'system';
    }

    // Listen for changes from the theme selector
    themeSelect.addEventListener('change', (event) => {
        applyTheme(event.target.value);
    });

    // Listen for system color scheme changes to update the selector
    // but only when the "System" option is active.
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
            if (!localStorage.getItem(localStorageKey)) {
                // If theme is not explicitly set (i.e., 'system' is active),
                // let the CSS media query handle the theme change.
                // We don't need to do anything here, but could update UI if needed.
                console.log(`System theme changed. New preference is: ${e.matches ? 'dark' : 'light'}`);
            }
        });
});
