const express = require('express');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// إعداد مجلد لتخزين الصور المرفوعة
const upload = multer({
  dest: 'uploads/', // الوجهة التي سيتم حفظ الملفات فيها
  limits: { fileSize: 5 * 1024 * 1024 } // تحديد الحد الأقصى لحجم الملف (5 ميجابايت)
});

// إعداد الواجهة الأمامية (HTML و JavaScript)
app.use(express.static('public'));

// إرسال HTML و JavaScript للعملاء عند زيارة الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// التعامل مع رفع الملفات
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.send({ fileUrl });
});

// إعداد Socket.io للتواصل الفوري
io.on('connection', (socket) => {
  console.log('a user connected');

  // استقبال الرسائل النصية من العميل
  socket.on('message', (data) => {
    io.emit('message', data); // إرسال الرسالة إلى جميع المتصلين
  });

  // قطع الاتصال
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// تشغيل الخادم على المنفذ 3000
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
