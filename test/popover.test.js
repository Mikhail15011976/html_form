const puppeteer = require('puppeteer');

describe('Popover Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
        await page.goto('http://localhost:9000');
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Popover should be visible after button click', async () => {
        await page.waitForSelector('button');
        await page.click('button');

        const popoverVisible = await page.evaluate(() => {
            const popover = document.querySelector('.popover');
            return popover && !popover.classList.contains('hidden');
        });

        expect(popoverVisible).toBe(true);
    });

    test('Popover should be positioned correctly', async () => {
        await page.waitForSelector('button');
        await page.click('button');

        const popoverPosition = await page.evaluate(() => {
            const popover = document.querySelector('.popover');
            const button = document.querySelector('.btn');
            const popoverRect = popover.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();
            return {
                popoverTop: popoverRect.top,
                buttonBottom: buttonRect.bottom,
                buttonLeft: buttonRect.left,
                buttonWidth: buttonRect.width,
                popoverLeft: popoverRect.left
            };
        });

        const isAboveButton = popoverPosition.popoverTop < popoverPosition.buttonBottom;
        const isCentered = Math.abs(popoverPosition.popoverLeft - (popoverPosition.buttonLeft + (popoverPosition.buttonWidth / 2))) < 5;

        expect(isAboveButton).toBe(true);
        expect(isCentered).toBe(true);
    });
});