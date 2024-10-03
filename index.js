const express = require("express");
const bodyParser = require("body-parser");
const { r34_random, r34_search } = require("r34-module");

const app = express();
const PORT = 8080;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); 


app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="th">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="shortcut icon" type="image/x-icon" href="https:/p1519.xyz/index.png" />
            <meta charset="UTF-8">
            <title>ค้นหารูปภาพ</title>
            <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@200&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Prompt', sans-serif;
                    background-color: #252525;
                    color: #f0f0f0;
                    margin: 0;
                    padding: 20px;
                }
                h1 {
                    text-align: center;
                    color: #ffffff;
                }
                .form-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                input[type="text"] {
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    width: 300px;
                }
                .button-48 {
                    appearance: none;
                    background-color: #007BFF;
                    border: none;
                    border-radius: 5px;
                    color: #FFFFFF;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    transition: background-color 0.3s;
                }
                .button-48:hover {
                    background-color: #0056b3;
                }
                footer {
                    text-align: center;
                    margin-top: 40px;
                    font-size: 14px;
                    color: #dddddd;
                }
            </style>
        </head>
        <body>
            <h1>ค้นหารูปภาพ Rule34</h1>
            <div class="form-container">
                <form action="/search" method="POST">
                    <input type="text" name="search_tag" placeholder="Search Tag" required>
                    <button class="button-48" type="submit">ค้นหา</button>
                </form>
            </div>
            <footer>
                <p>สามารถกด F5 ในคอมเพื่อลองสุ่มรูปใหม่</p>
            </footer>
        </body>
        </html>
    `);
});


app.post("/search", async (req, res) => {
    const { search_tag } = req.body;
    console.log("Search Tag:", search_tag);

    if (!search_tag) {
        return res.status(400).send("<h1>Search tag is required!</h1><br><a href='/'>Back</a>");
    }

    try {
        let r34 = await r34_search({ search_tag });
        console.log("Retrieved images:", r34);

        if (!r34 || r34.length === 0) {
            return res.send(`<h1>No results found for "${search_tag}"</h1><br><a href="/">Back</a>`);
        }

        const imageLinks = r34.map(item => `<img src="${item}" alt="Image" style="width:200px; border-radius: 8px; margin: 10px;"/>`).join("");
        
        res.send(`
            <!DOCTYPE html>
            <html lang="th">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="shortcut icon" type="image/x-icon" href="https:/p1519.xyz/index.png" />
                <meta charset="UTF-8">
                <title>ผลการค้นหา</title>
                <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@200&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Prompt', sans-serif;
                        background-color: #252525;
                        color: #f0f0f0;
                        margin: 0;
                        padding: 20px;
                    }
                    h1 {
                        text-align: center;
                        color: #ffffff;
                    }
                    footer {
                        text-align: center;
                        margin-top: 40px;
                        font-size: 14px;
                        color: #dddddd;
                    }
                </style>
            </head>
            <body>
                <h1>ผลการค้นหา "${search_tag}"</h1>
                <div class="image-container" style="display: flex; flex-wrap: wrap; justify-content: center;">
                    ${imageLinks}
                </div>
                <footer>
                
                </footer>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.send("<h1>Error fetching images</h1><br><a href='/'>Back</a>");
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


app.post("/search", async (req, res) => {
    const { search_tag } = req.body;
    console.log("Search Tag:", search_tag);

    if (!search_tag) {
        return res.status(400).send("<h1>Search tag is required!</h1><br><a href='/'>Back</a>");
    }

    try {
        let r34 = await r34_search({ search_tag });
        console.log("Retrieved images:", r34);

        if (!r34 || r34.length === 0) {
            return res.send(`<h1>No results found for "${search_tag}"</h1><br><a href="/">Back</a>`);
        }

        const imageLinks = r34.map(item => `
            <img src="${item}" alt="Image" style="width:200px; height:200px; object-fit: cover; border-radius: 8px; margin: 10px;"/>
        `).join("");
        
        res.send(`
            <!DOCTYPE html>
            <html lang="th">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                 <link rel="shortcut icon" type="image/x-icon" href="https:/p1519.xyz/index.png" />
                <meta charset="UTF-8">
                <title>ผลการค้นหา</title>
                <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@200&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Prompt', sans-serif;
                        background-color: #252525;
                        color: #f0f0f0;
                        margin: 0;
                        padding: 20px;
                    }
                    h1 {
                        text-align: center;
                        color: #ffffff;
                    }
                    .image-container {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    img {
                        width: 200px; /* กำหนดความกว้าง */
                        height: 200px; /* กำหนดความสูง */
                        object-fit: cover; /* ปรับให้ภาพเต็มพื้นที่ */
                        border-radius: 8px; /* มุมโค้ง */
                        margin: 10px; /* ระยะห่างระหว่างภาพ */
                    }
                    footer {
                        text-align: center;
                        margin-top: 40px;
                        font-size: 14px;
                        color: #dddddd;
                    }
                </style>
            </head>
            <body>
                <h1>ผลการค้นหา "${search_tag}"</h1>
                <div class="image-container">
                    ${imageLinks}
                </div>
                <footer>
                    
                </footer>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.send("<h1>Error fetching images</h1><br><a href='/'>Back</a>");
    }
});

