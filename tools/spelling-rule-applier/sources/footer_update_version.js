import { releases } from '../releases/releases.js';
      
        document.addEventListener('DOMContentLoaded', () => {
          const versionElement = document.querySelector('.footer-mark-version');
          if (versionElement) {
            // Convert the object into an array of entries
            const entries = Object.entries(releases);
      
            // Sort entries by date descending
            const sorted = entries.sort((a, b) => 
              new Date(b[1]['time-tag']) - new Date(a[1]['time-tag'])
            );
      
            // Extract the latest version key
            const latestVersion = sorted[0][0]; // key = "1.3", etc.
      
            versionElement.textContent = `v${latestVersion}`;
            console.log(`Current version: ${latestVersion}`);
          }
        });