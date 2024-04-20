const express = require('express');
const mongoose = require('mongoose');
const { Client } = require('typesense');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://hnanda005:zkQkhtDTGowGgLKO@cluster0.spn9flj.mongodb.net/search-typesense', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Define a schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
});

// Create a model
const Product = mongoose.model('Product', productSchema);

// Create a TypeSense client
const typeSenseClient = new Client({
  nodes: [
    {
      host: 'localhost',
      port: '8108',
      protocol: 'http',
      apiKey: 'sVDqW0kDlfgAf9xWD8cy9bwAE9tHLtsM',
    },
  ],
  connectionTimeoutSeconds: 2,
});

app.use(express.json());

// Endpoint to add a new product
app.post('/products', async (req, res) => {
  try {
    const { name, description } = req.body;
    const product = new Product({ name, description });
    await product.save();

    // Index product in TypeSense
    await typeSenseClient.collections('products').documents().create({
      id: product._id.toString(),
      name,
      description,
    });

    res.send('Product created successfully');
  } catch (err) {
    res.status(400).send(err);
  }
});

// Endpoint to search products using TypeSense
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q;

    // Search products in TypeSense
    const searchResults = await typeSenseClient
      .collections('products')
      .documents()
      .search({
        q: query,
        queryBy: 'name',
      });

    res.json(searchResults.hits);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
