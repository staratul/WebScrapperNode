const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Set to true for headless mode
        defaultViewport: null,
    });

    const page = await browser.newPage();

    // Set a custom User-Agent to mimic a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');

    // Navigate to the Kayak flight search page
    await page.goto('https://www.kayak.com/flight-routes/United-States-US0/Kochi-COK', {
        waitUntil: 'networkidle2',
        timeout: 60000
    });

    // Wait for the submit button and click it
    try {
        await page.waitForSelector('button[data-test="submit-button"], button[type="submit"]', { timeout: 30000 });
        await page.click('button[data-test="submit-button"], button[type="submit"]');
        console.log('Clicked the search button.');
    } catch (error) {
        console.error('Submit button not found:', error);
        await browser.close();
        return;
    }

    // Wait for the flight results section to load
    try {
        await page.waitForSelector('.OQa--left-column', { timeout: 60000 }); // Wait for the left column to appear
        console.log('Flight results loaded successfully.');

        // // Click on the first button with the text "Select"
        // try {
        //     const selectButtonSelector = 'button:contains("Select")'; // Select the button with "Select" text
        //     const selectButton = await page.$(selectButtonSelector);
        //     if (selectButton) {
        //         await selectButton.click();
        //         console.log('Clicked on the first "Select" button.');
        //     } else {
        //         console.error('No "Select" button found.');
        //     }
        // } catch (error) {
        //     console.error('Error clicking the "Select" button:', error);
        // }

        // // Wait for the navigation to finish and ensure we are on the correct booking page
        // await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
        // console.log('Navigated to the booking page.');

        // // Verify the URL after clicking the "Select" button
        // const currentUrl = page.url();
        // console.log('Current URL:', currentUrl);

        // // Check if the URL is as expected; if not, handle the error
        // if (currentUrl.includes("DEL-NYC")) {
        //     const resultDiv = await page.$('.OQa--left-column'); // Replace this with the correct selector if needed
        //     if (resultDiv) {
        //         const resultHtml = await page.evaluate(element => element.innerHTML, resultDiv);
        //         console.log('Result HTML:', resultHtml); // This logs the inner HTML of the found div
        //     } else {
        //         console.error('Div with class "OQa--left-column" not found.');
        //     }
        // } else {
        //     console.error('Unexpected URL after selecting flight:', currentUrl);
        // }

    } catch (error) {
        console.error('Error: Flight results section not found or no results available.', error);
    }

    // Close the browser
    // await browser.close();
})();
