"use strict";
// import express, { Request, Response } from 'express';
// import bodyParser from 'body-parser';
// import * as fs from 'fs';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// const port = 3000;
// app.use(bodyParser.json());
// interface Submission {
//     name: string;
//     email: string;
//     phone: string;
//     github_link: string;
//     stopwatch_time: string;
// }
// interface Database {
//     submissions: Submission[];
// }
// const dbPath = './db.json';
// if (!fs.existsSync(dbPath)) {
//     fs.writeFileSync(dbPath, JSON.stringify({ submissions: [] }));
// }
// const readDatabase = (): Database => {
//     const data = fs.readFileSync(dbPath, 'utf8');
//     return JSON.parse(data);
// }
// const writeDatabase = (db: Database) => {
//     fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
// }
// app.get('/ping', (req: Request, res: Response) => {
//     res.json(true);
// });
// app.post('/submit', (req: Request, res: Response) => {
//     const newSubmission: Submission = req.body;
//     const db = readDatabase();
//     db.submissions.push(newSubmission);
//     writeDatabase(db);
//     res.status(201).send('Submission saved');
// });
// app.get('/read', (req: Request, res: Response) => {
//     const index = parseInt(req.query.index as string);
//     const db = readDatabase();
//     if (index >= 0 && index < db.submissions.length) {
//         res.json(db.submissions[index]);
//     } else {
//         res.status(404).send('Submission not found');
//     }
// });
// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
const dbFilePath = path_1.default.resolve(__dirname, 'db.json');
// Ensure db.json file exists
if (!fs_1.default.existsSync(dbFilePath)) {
    fs_1.default.writeFileSync(dbFilePath, JSON.stringify([]));
}
// Endpoint to check server status
app.get('/ping', (req, res) => {
    res.json({ success: true });
});
// Root endpoint
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Status</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
        }
        .container {
          text-align: center;
          padding: 20px;
          background: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Backend Server</h1>
        <p>is running smoothly.</p>
      </div>
    </body>
    </html>
  `);
});
// Endpoint to submit a form
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    let submissions = [];
    if (fs_1.default.existsSync(dbFilePath)) {
        const data = fs_1.default.readFileSync(dbFilePath, 'utf8');
        submissions = JSON.parse(data);
    }
    submissions.push(newSubmission);
    fs_1.default.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
    res.json({ success: true });
});
// Endpoint to read a form submission by index
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index, 10);
    if (isNaN(index) || index < 0) {
        return res.status(400).json({ error: 'Invalid index' });
    }
    if (!fs_1.default.existsSync(dbFilePath)) {
        return res.status(404).json({ error: 'No submissions found' });
    }
    const data = fs_1.default.readFileSync(dbFilePath, 'utf8');
    const submissions = JSON.parse(data);
    if (index >= submissions.length) {
        return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(submissions[index]);
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
