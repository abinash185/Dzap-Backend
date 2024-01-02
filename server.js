const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/currencies', async (req, res) => {
  try {
    
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false");
    
    console.log("dataaa", response);

    const currencies = response.data.map((crypto) => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
    }));

    console.log(currencies);

    res.json(currencies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/api/convert', async (req, res) => {
  const { sourceCurrency , amount, targetCurrency } = req.body;

  try {
    
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: sourceCurrency,
        vs_currencies: targetCurrency,
      },
    });

    const exchangeRate = response.data[sourceCurrency][targetCurrency];
    const convertedAmount = amount * exchangeRate;

    res.json({ convertedAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
