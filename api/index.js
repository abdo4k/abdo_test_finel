const express = require('express');
const app = express();

// إعداد الخادم مع Express
app.get('/', (req, res) => {
  res.send('مرحبًا من تطبيق Express في Vercel!');
});

// تصدير تطبيق Express ليعمل كـ serverless function
module.exports = (req, res) => app(req, res);
