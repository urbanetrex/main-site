import { releases } from './releases.js';

const container = document.querySelector('.pages');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageInfo = document.getElementById('page-info');

const themes = ['fire', 'sun', 'forest', 'space'];
const releasesPerPage = 4;

const sortedVersions = Object.keys(releases).sort((a, b) =>
    new Date(releases[b]['time-tag']) - new Date(releases[a]['time-tag'])
);

const totalPages = Math.ceil(sortedVersions.length / releasesPerPage);
let currentPage = 0;

function updatePaginationButtons() {
    if (currentPage === 0) {
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.classList.remove('disabled');
    }

    if (currentPage >= totalPages - 1) {
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.classList.remove('disabled');
    }

    pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
}

function renderPage(page) {
    container.innerHTML = ''; // Clear container

    const start = page * releasesPerPage;
    const slice = sortedVersions.slice(start, start + releasesPerPage);

    for (let i = 0; i < slice.length; i++) {
        const version = slice[i];
        const entry = releases[version];

        const theme = themes[i % themes.length]; // Cycle theme per release

        const section = document.createElement('section');
        section.className = theme;

        const heading = document.createElement('h2');
        //Version latest add <mark>Current</mark> to the latest version
        if (version === sortedVersions[0]) {
            heading.innerHTML = `<mark>Current</mark> v${version} — ${entry['time-text']}`;
        } else {
            heading.innerHTML = `v${version} — ${entry['time-text']}`;
        }
        section.appendChild(heading);

        const list = document.createElement('ul');
        for (const feature of entry.features) {
            const li = document.createElement('li');
            li.textContent = feature;
            list.appendChild(li);
        }

        section.appendChild(list);
        container.appendChild(section);
    }
    
    updatePaginationButtons();
}

renderPage(currentPage);

function showHintMessage(msg) {
    const hint = document.createElement('div');
    hint.textContent = msg;
    hint.style.position = 'fixed';
    hint.style.bottom = '20px';
    hint.style.left = '50%';
    hint.style.transform = 'translateX(-50%)';
    hint.style.background = '#444';
    hint.style.color = 'white';
    hint.style.padding = '10px 20px';
    hint.style.borderRadius = '8px';
    hint.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    hint.style.zIndex = '1000';
    hint.style.opacity = '0';
    hint.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(hint);

    requestAnimationFrame(() => {
        hint.style.opacity = '1';
    });

    setTimeout(() => {
        hint.style.opacity = '0';
        setTimeout(() => document.body.removeChild(hint), 500);
    }, 2000);
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        renderPage(currentPage);
    } else {
        showHintMessage('This is the most recent page.');
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        currentPage++;
        renderPage(currentPage);
    } else {
        showHintMessage('You\'ve reached the oldest release.');
    }
});
