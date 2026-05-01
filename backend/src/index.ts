import express from 'express';
import env from "./config/env";

const app = express();
const PORT = env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});