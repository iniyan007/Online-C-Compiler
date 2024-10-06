const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // To parse JSON requests

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to receive C code and compile it
app.post('/compile', (req, res) => {
    const cCode = req.body.code;

    // Save the code in a .c file
    const filePath = path.join(__dirname, 'temp_code.c');
    fs.writeFileSync(filePath, cCode);

    // Compile and execute the C code (for Windows)
    const executablePath = path.join(__dirname, 'temp_code.exe');
    exec(`gcc ${filePath} -o ${executablePath} && ${executablePath}`, (error, stdout, stderr) => {
        if (error) {
            // If there's an error during compilation or execution, send it back
            res.status(400).json({ error: stderr || error.message });
            return;
        }
        // Send back the program output
        res.json({ output: stdout });
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
