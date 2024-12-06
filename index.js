const express = require("express");
const bodyParser = require("body-parser");
const { r34_search } = require("r34-module");
const path = require("path");

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/search", async (req, res) => {
    const { search_tag, limit } = req.body;
    console.log("Search Tag:", search_tag);

    if (!search_tag) {
        return res.status(400).send("<h1>Search tag is required!</h1><br><a href='/'>Back</a>");
    }

    try {
        let r34 = await r34_search({ search_tag });
        console.log("Retrieved media:", r34);

        if (!r34 || r34.length === 0) {
            return res.send(`<h1>No results found for "${search_tag}"</h1><br><a href="/">Back</a>`);
        }


        const limitedMedia = r34.slice(0, limit || 10);

        const mediaLinks = limitedMedia.map(item => {
            if (item.endsWith(".mp4") || item.endsWith(".webm")) {
                return `
                    <div class="media-item" onclick="openModal('${item}')">
                        <video src="${item}" style="width:200px; height:200px; object-fit: cover; border-radius: 8px; margin: 10px;" />
                    </div>
                `;
            } else {
                return `
                    <div class="media-item" onclick="openModal('${item}')">
                        <img src="${item}" alt="Media" style="width:200px; height:200px; object-fit: cover; border-radius: 8px; margin: 10px;">
                    </div>
                `;
            }
        }).join("");

        res.send(`
            <!DOCTYPE html>
            <html lang="th">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="shortcut icon" type="image/x-icon" href="https:/p1519.xyz/index.png" />
                <meta charset="UTF-8">
                <title>ผลการค้นหา "${search_tag}"</title>
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
                    .media-container {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    .media-item {
                        cursor: pointer;
                    }
                    img, video {
                        width: 200px;
                        height: 200px;
                        object-fit: cover;
                        border-radius: 8px;
                        margin: 10px;
                    }
                    footer {
                        text-align: center;
                        margin-top: 40px;
                        font-size: 14px;
                        color: #dddddd;
                    }
                    .button {
                        background-color: #007BFF;
                        color: white;
                        padding: 10px;
                        border-radius: 5px;
                        text-decoration: none;
                        display: inline-block;
                        margin: 10px;
                    }
                    .button:hover {
                        background-color: #0056b3;
                    }
                    .top-buttons {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    /* Modal styles */
                    .modal {
                        display: none;
                        position: fixed;
                        z-index: 1;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        overflow: auto;
                        background-color: rgba(0, 0, 0, 0.8);
                    }
                    .modal-content {
                        margin: auto;
                        display: block;
                        width: 80%;
                        height: auto;
                    }
                    .close {
                        position: absolute;
                        top: 15px;
                        right: 35px;
                        color: #f1f1f1;
                        font-size: 40px;
                        font-weight: bold;
                        cursor: pointer;
                    }
                    .close:hover,
                    .close:focus {
                        color: #bbb;
                        text-decoration: none;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <h1>ผลการค้นหา "${search_tag}"</h1>
                <div class="top-buttons">
                    <form action="/search" method="POST" style="display:inline;">
                        <input type="hidden" name="search_tag" value="${search_tag}">
                        <input type="hidden" name="limit" value="10">
                        <button class="button" type="submit">โหลดอีก 10 รูป</button>
                    </form>
                    <form action="/search" method="POST" style="display:inline;">
                        <input type="hidden" name="search_tag" value="${search_tag}">
                        <input type="hidden" name="limit" value="99">
                        <button class="button" type="submit">โหลด 99 รูป</button>
                    </form>
                </div>
                <div class="media-container">
                    ${mediaLinks}
                </div>

                <!-- Modal for Full Image/Video -->
                <div id="myModal" class="modal">
                    <span class="close" onclick="closeModal()">&times;</span>
                    <img class="modal-content" id="modalImage" />
                    <video class="modal-content" id="modalVideo" controls></video>
                </div>

                <footer>
                    <br><a class="button" href="/">กลับหน้าหลัก</a>
                </footer>

                <script>
                    // Function to open the modal
                    function openModal(src) {
                        var modal = document.getElementById("myModal");
                        var modalImage = document.getElementById("modalImage");
                        var modalVideo = document.getElementById("modalVideo");

                        // If the item is an image
                        if (src.endsWith(".mp4") || src.endsWith(".webm")) {
                            modalImage.style.display = "none";
                            modalVideo.style.display = "block";
                            modalVideo.src = src;
                        } else {
                            modalVideo.style.display = "none";
                            modalImage.style.display = "block";
                            modalImage.src = src;
                        }

                        modal.style.display = "block";
                    }

                    // Function to close the modal
                    function closeModal() {
                        var modal = document.getElementById("myModal");
                        var modalImage = document.getElementById("modalImage");
                        var modalVideo = document.getElementById("modalVideo");
                        modal.style.display = "none";
                        modalImage.src = "";
                        modalVideo.src = "";
                    }
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error fetching media:", error);
        res.status(500).send("<h1>Error fetching media</h1><br><a href='/'>Back</a>");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
