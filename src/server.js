const express = require('express');
const path = require('path');

const PORT = process.env.PORT||8080;

const app = express();

app.use(express.static(path.join(__dirname, '../public/static')));

app.listen(PORT, () => {
    console.log(`Kaboom server listening on port ${PORT}.`);
    console.log(`Server started on http://localhost:${PORT}`);
});
