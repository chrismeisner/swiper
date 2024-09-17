const express = require('express');
const path = require('path');
const Airtable = require('airtable');
const app = express();

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Airtable setup
const base = new Airtable({ apiKey: 'pat1kltAKY6uajlkp.d2c73a7558a3a55899fb56b610f8dce83c13778e786d84db3f333e95d7eaf298' }).base('appO6KsaPDcs1RcX4');

// Endpoint to fetch records from Airtable's "Props" table, "PHI" view
app.get('/api/props', async (req, res) => {
  try {
    const records = await base('Props').select({
      view: 'PHI', // Specify the view you want to pull data from
      fields: ['Proposition', 'Image'] // Specify the fields you want to retrieve
    }).all();

    const propositions = records.map(record => ({
      id: record.id,
      proposition: record.get('Proposition'),
      imageUrl: record.get('Image') // Include the Image field in the response
    }));

    res.json(propositions);
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    res.status(500).json({ error: 'Failed to fetch data from Airtable' });
  }
});

// Default route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server on port 4242
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
