const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000; // Изменено на 8000

// Основное приложение
app.use('/', express.static(path.join(__dirname, 'fingrow_miniapp')));
app.use('/static', express.static(path.join(__dirname, 'fingrow_miniapp', 'static')));

// Фиксимулятор
app.use('/finsimulator', express.static(path.join(__dirname, 'finsimulator_web')));

// Обработка всех остальных запросов
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'fingrow_miniapp', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log(`Основное приложение: http://localhost:${PORT}/`);
  console.log(`Фиксимулятор: http://localhost:${PORT}/finsimulator`);
});
