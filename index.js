const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('You must provide a URL');
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        // Wait for the video to be ready and get the download link
        const downloadLink = await page.evaluate(() => {
            const videoElement = document.querySelector('video');
            return videoElement ? videoElement.src : null;
        });

        await browser.close();

        if (downloadLink) {
            res.redirect(downloadLink);
        } else {
            res.status(404).send('Video not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
