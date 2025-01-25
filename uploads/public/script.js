var socket = io.connect('http://localhost:3000');

// استقبال الرسائل عبر Socket.io
socket.on('message', function(data) {
    var messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    // إضافة اسم المرسل مع الرسالة
    messageElement.innerHTML = `<span class="username">${data.username}:</span> ${data.message}`;
    if (data.fileUrl) {
        messageElement.innerHTML += `<br><img src="${data.fileUrl}" style="max-width: 200px;">`;
    }

    document.getElementById('chat-box').appendChild(messageElement);
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
});

// إرسال الرسالة النصية
function sendMessage() {
    var username = document.getElementById('username').value || 'مجهول'; // إذا لم يتم إدخال اسم، سيتم استخدام "مجهول"
    var message = document.getElementById('message-input').value;

    if (message) {
        socket.emit('message', { username: username, message: message }); // إرسال الرسالة مع اسم المرسل
        document.getElementById('message-input').value = ''; // مسح الحقل
    }
}

// رفع الملفات
function uploadFile() {
    var username = document.getElementById('username').value || 'مجهول'; // نفس الاسم في حالة رفع الملف
    var fileInput = document.getElementById('file-input');
    var file = fileInput.files[0];

    if (file) {
        var formData = new FormData();
        formData.append('file', file);

        // إرسال الملف إلى الخادم
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                if (response.fileUrl) {
                    // إرسال رابط الصورة إلى الدردشة
                    socket.emit('message', { username: username, message: '', fileUrl: response.fileUrl });
                }
            }
        });
    }
}

