import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to Barefoot Nomad API',
}));

app.listen(port, () => `Server is running on PORT ${port}`);

export default app;
