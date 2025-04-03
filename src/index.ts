import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
// import { registerSocketServer } from './socketServer';
import appRouter from './router/appRouter';
import { registerSocketServer } from './meetSocket';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiDocsPath = path.resolve('./api-docs.json');

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure this path is correct

// Configure CORS
const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',
};
app.use(cors(corsOptions));
app.use(express.json());

let apiDocs: Array<{ url: string; method: string; requestType: any }> = [];
if (!fs.existsSync(apiDocsPath)) {
    fs.writeFileSync(apiDocsPath, JSON.stringify({ description: 'Dynamically generated API documentation', apiEndpoints: [] }, null, 2));
} else {
    const savedDocs = fs.readFileSync(apiDocsPath, 'utf-8');
    apiDocs = JSON.parse(savedDocs).apiEndpoints || [];
}

// Endpoint to return the dynamic API documentation as HTML (rendered via EJS)
app.get('/api-docs', (req: Request, res: Response) => {
    if (fs.existsSync(apiDocsPath)) {
        const documentation = JSON.parse(fs.readFileSync(apiDocsPath, 'utf-8'));
        const { description, apiEndpoints } = documentation;
        // Render the API docs in HTML using EJS and pass description and apiEndpoints
        res.render('api-docs', { description, apiDocs: apiEndpoints });
    } else {
        res.status(404).send('API documentation not found');
    }
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Vercel with TypeScript and Express!');
});

appRouter(app);

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URL as string)
    .then(() => {
        console.log('Connected to MongoDB');
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        // const server = http.createServer(app);
        registerSocketServer(server)
    })
    .catch((error) => console.error('MongoDB connection error:', error));

// Export the app for Vercel
export default app;
