import express from 'express';

const app = express();

// use the express-static middleware
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.end('<h1>Hello World</h1>');
});

app.get('/stock', (req, res) => {
  res.end('<h1>Stock page</h1>');
});

app.listen(process.env.PORT || 8080, () => {
  console.log('Server started');
});
