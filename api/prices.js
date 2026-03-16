// 미국주식 여러 티커 동시 조회
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { tickers } = req.query; // comma-separated
  if (!tickers) return res.status(400).json({ error: 'tickers required' });

  const list = tickers.split(',').map(t => t.trim()).filter(Boolean);
  const results = {};

  await Promise.all(list.map(async ticker => {
    try {
      const yt = ticker === 'BRK-B' ? 'BRK-B' : ticker;
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yt)}?interval=1d&range=1d`;
      const r = await fetch(url, { headers:{'User-Agent':'Mozilla/5.0','Accept':'application/json'} });
      const d = await r.json();
      const closes = d?.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.filter(v=>v!=null);
      results[ticker] = closes?.length ? closes[closes.length-1] : null;
    } catch { results[ticker] = null; }
  }));

  res.setHeader('Cache-Control','s-maxage=180');
  return res.status(200).json(results);
};
