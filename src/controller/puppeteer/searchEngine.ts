import { Response } from "express";
import { IRequestUserDetails } from "../../middleware/auth";
import puppeteer from "puppeteer";

const searchEngine = async (req: IRequestUserDetails, res: Response): Promise<void> => {
    try {
        /** Launch Puppeteer browser */
        const browser = await puppeteer.launch({
            headless: false,  // Set to false to watch the browser
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        /** Open a new page in the browser */
        const page = await browser.newPage();

        /** Go to Google's homepage */
        await page.goto("https://www.google.com/", { waitUntil: "domcontentloaded" });

        /** Wait for the search textarea field to be present */
        await page.waitForSelector('textarea[aria-label="Search"]', { visible: true });

        /** Type the search query from request body into the search box */
        await page.type('textarea[aria-label="Search"]', req.body.search);

        /** Press "Enter" to start the search */
        await page.keyboard.press("Enter");

        /** Wait for the results to be displayed */
        await page.waitForSelector(".g"); // Wait until the search results load

        /** Extract search results */
        const list = await page.evaluate(() => {
            const data: Array<{ title: string, link: string }> = [];
            const searchResults = document.querySelectorAll(".g"); // Each result is inside a .g element

            searchResults.forEach((result) => {
                const titleElement = result.querySelector('h3');
                const linkElement = result.querySelector('a');

                if (titleElement && linkElement) {
                    data.push({
                        title: titleElement.innerText.trim().replace(/(\r\n|\n|\r)/gm, " "), // Clean up newlines
                        link: linkElement.href
                    });
                }
            });

            return data;
        });

        /** Close the browser after extracting the data */
        await browser.close();

        /** Send the result back as a JSON response */
        res.json({ results: list });
    } catch (err) {
        console.error('Error in searchEngine:', err);
        res.status(500).json({ error: "Failed to get search results", err });
    }
};

export default searchEngine;
