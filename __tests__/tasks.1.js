const puppeteer = require("puppeteer");
const path = require('path');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe("HTML structure", () => {
    it("Index file should contain appropriate meta tags", async () => {
        try {
            const metaTags = await page.$$('meta');
            expect(metaTags.length).toBeGreaterThan(1);
        } catch (err) {
            throw err;
        }
    });
    it("Index file Should contain a title tag that is not empty", async () => {
        try {
            const title = await page.$eval('title', el => el.innerHTML);
            expect(title).toMatch(/\S/);
        } catch (err) {
            throw err;
        }
    });
});
describe("Form Input fields", () => {
    it("Inputs should have corresponding label tags", async () => {
        try {
            const labels = await page.$$eval('input[type="text"], input[type="email"', els => els.filter(el => document.querySelector(`label[for="${el.id}"]`)))
            console.log(labels)
            expect(labels.length).toBeGreaterThanOrEqual(3)
        } catch (err) {
            throw err;
        }
    });
    it("'First Name' and 'Last Name' input fields should exist and be of type='text'", async () => {
        try {
            const nameInputs = await page.$$('input[type="text"]');
            expect(nameInputs.length).toBeGreaterThanOrEqual(2)
        } catch (err) {
            throw err;
        }
    });
    it("'Email' Input field should exist", async () => {
        try {
            const emailInput = await page.$('input[type="email"]');
            expect(emailInput).toBeTruthy();
        } catch (err) {
            throw err;
        }
    });
    it("Page should contain a 'Textarea' field", async () => {
        try {
            const textarea = await page.$('textarea');
            expect(textarea).toBeTruthy();
        } catch (err) {
            throw err;
        }
    });
});
describe("Form Styling", () => {
    it("Input fields with type='text' attribute Should have a hotpink color outline styling focus", async () => {
        try {
            const textInputs = await page.$$('input[type="text"]');
            const textInputsColor = await Promise.all(textInputs.map(async (input) => {
                await input.focus();
                return await page.evaluate(el => getComputedStyle(el).outlineColor, input);
            }));
            expect(textInputsColor).toContain('rgb(255, 105, 180)');
        } catch (err) {
            throw err;
        }
    });
    it("'Email' & 'textarea' Input fields should have blue color outline styling on focus", async () => {
        try {
            const input = await page.$('input[type="email"]');
            await input.focus();
            const inputColor = await page.$eval('input[type="email"]', el => getComputedStyle(el).outline);
            expect(inputColor).toMatch(/rgb\(0, 0, 255\)/); //blue
            const textarea = await page.$('textarea');
            await textarea.focus();
            const textareaColor = await page.$eval('textarea', el => getComputedStyle(el).outline);
            expect(textareaColor).toMatch(/rgb\(0, 0, 255\)/); //blue
        } catch (err) {
            throw err;
        }
    });
});
describe('Submit', () => {
    it("Input with the type='submit' Should exist and be disabled", async () => {
        try {
            const submit = await page.$('input[type="submit"]');
            expect(submit).toBeTruthy();
            const submitDisabled = await page.$eval('input[type="submit"]', el => el.disabled);
            expect(submitDisabled).toBeTruthy();
        } catch (err) {
            throw err;
        }
    });
});