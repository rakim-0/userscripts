// ==UserScript==
// @name         Spotify2YTMusic
// @namespace    http://tampermonkey.net/
// @version      2024-05-25
// @description  Redirect from Spotify to YouTube Music search
// @author       You
// @match        https://open.spotify.com/track/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to wait for multiple elements
    function waitForElements(selectors, callback) {
        const elements = {};
        let remainingSelectors = selectors.length;

        function checkElements() {
            for (const selector of selectors) {
                if (!elements[selector]) {
                    const element = document.querySelector(selector);
                    if (element) {
                        elements[selector] = element;
                        remainingSelectors--;
                    }
                }
            }
            if (remainingSelectors === 0) {
                observer.disconnect();
                callback(elements);
            }
        }

        const observer = new MutationObserver(checkElements);
        observer.observe(document, {
            childList: true,
            subtree: true
        });
        checkElements();
    }

    // Function to extract track and artist information
    function extractTrackInfo(elements) {
        const trackTitleElement = elements['.encore-text-headline-large'];
        const artistElement = elements['a[data-testid="creator-link"]'];

        if (trackTitleElement && artistElement) {
            const trackTitle = trackTitleElement.textContent.trim();
            const artist = artistElement.textContent.trim();
            return { trackTitle, artist };
        }
        return null;
    }

    // Function to redirect to YouTube Music search
    function redirectToYTMusic({ trackTitle, artist }) {
        const query = encodeURIComponent(`${trackTitle} ${artist}`);
        const ytMusicUrl = `https://music.youtube.com/search?q=${query}`;
        window.location.href = ytMusicUrl;
    }

    // Wait for both track title and artist elements to be loaded in the DOM
    waitForElements(['.encore-text-headline-large', 'a[data-testid="creator-link"]'], (elements) => {
        const trackInfo = extractTrackInfo(elements);
        if (trackInfo) {
            redirectToYTMusic(trackInfo);
        }
    });
})();

