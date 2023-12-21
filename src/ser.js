const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { getJson } = require('serpapi');
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.get('/search.json', async (req, res) => {
  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({
      error: 'Internal Server Error',
    });
  }
});

app.get('/google-trends-search', async (req, res) => {
  try {
    const { q, data_types } = req.query;

    const dataTypesArray = Array.isArray(data_types) ? data_types : [data_types];

    const results = await Promise.all(
      dataTypesArray.map(async (dataType) => {
        try {
          const response = await getJson({
            engine: 'google_trends',
            q,
            data_type: dataType,
            api_key: 'd77f4eb2a8eb7e58f3a73c8e3ec36aeba6dca7151f4bff04a913a00868b15735',
          });
          return { dataType, data: response };
        } catch (error) {
          console.error(`Error fetching data for ${dataType}:`, error);
          return { dataType, error: 'Internal Server Error' };
        }
      })
    );

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({
      error: 'Internal Server Error',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
