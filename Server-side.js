const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // Nơi chứa file HTML

// Đọc trạng thái từ tệp JSON
const readState = () => {
    const data = fs.readFileSync('state.json', 'utf-8');
    return JSON.parse(data);
};

// Ghi trạng thái vào tệp JSON
const writeState = (newState) => {
    fs.writeFileSync('state.json', JSON.stringify(newState, null, 2));
};

// Kiểm tra trạng thái quay
app.get('/checkSpin', (req, res) => {
    const state = readState();
    const today = new Date().toLocaleDateString();
    if (state.lastSpinDate === today && state.isSpun) {
        res.json({ canSpin: false, message: 'Bạn đã quay hôm nay rồi!' });
    } else {
        res.json({ canSpin: true });
    }
});

// Ghi trạng thái quay
app.post('/spin', (req, res) => {
    const state = readState();
    const today = new Date().toLocaleDateString();

    if (state.lastSpinDate === today && state.isSpun) {
        return res.status(403).json({ message: 'Bạn đã quay hôm nay rồi!' });
    }

    state.lastSpinDate = today;
    state.isSpun = true;
    writeState(state);

    res.json({ message: 'Quay thành công!', result: 'Kết quả của bạn là ...' });
});

// Reset quay cho ngày mới
app.post('/resetSpin', (req, res) => {
    const state = { lastSpinDate: '', isSpun: false };
    writeState(state);
    res.json({ message: 'Đã reset quay cho ngày mới!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
