function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.querySelector('.tab[onclick*="' + tabId + '"]').classList.add('active');
}

function withdraw() {
  alert('Финики выведены!');
}
function exchange() {
  alert('Обмен успешно выполнен!');
}
function continueGame() {
  alert('Продолжение игры!');
}
function ignore() {
  alert('Новость проигнорирована.');
}
function invest() {
  alert('Вы инвестировали!');
}

fetch('https://8f41-31-129-22-66.ngrok-free.app/api/endpoint', {
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
})