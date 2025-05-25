module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({
    message: 'API is working',
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  }));
}; 