function showNotification(message) {
		// Создаем уведомление
		const notification = document.createElement('div');
		notification.style.cssText = `
				position: fixed;
				top: 20px;
				right: 20px;
				background: linear-gradient(45deg, #4CAF50, #45a049);
				color: white;
				padding: 15px 20px;
				border-radius: 12px;
				font-weight: 600;
				z-index: 1000;
				box-shadow: 0 10px 30px rgba(0,0,0,0.3);
				transform: translateX(100%);
				transition: transform 0.3s ease;
		`;
		notification.textContent = message;
		document.body.appendChild(notification);
		
		// Анимация появления
		setTimeout(() => {
				notification.style.transform = 'translateX(0)';
		}, 100);
		
		// Удаление через 3 секунды
		setTimeout(() => {
				notification.style.transform = 'translateX(100%)';
				setTimeout(() => {
						document.body.removeChild(notification);
				}, 300);
		}, 3000);
}

function completeTask(element, message) {
		element.style.background = 'rgba(76, 175, 80, 0.2)';
		element.style.opacity = '0.7';
		element.style.transform = 'scale(0.98)';
		showNotification(message);
}

function switchSection(section) {
		// Убираем активный класс со всех элементов
		document.querySelectorAll('.sidebar-item').forEach(item => {
				item.classList.remove('active');
		});
		
		// Добавляем активный класс к выбранному элементу
		event.target.closest('.sidebar-item').classList.add('active');
		
		// Показываем уведомление о переключении
		const sectionNames = {
				'products': 'Мои продукты',
				'assets': 'Активы', 
				'showcase': 'Витрина',
				'notifications': 'Уведомления',
				'chat': 'Чат'
		};
		
		showNotification(`Переключено на: ${sectionNames[section]}`);
}

// Добавляем интерактивности для карточек
document.querySelectorAll('.product-card').forEach(card => {
		card.addEventListener('mouseenter', function() {
				this.style.transform = 'translateY(-5px) scale(1.02)';
		});
		
		card.addEventListener('mouseleave', function() {
				this.style.transform = 'translateY(0) scale(1)';
		});
});

// Анимация загрузки
window.addEventListener('load', function() {
		document.querySelectorAll('.product-card, .task-item, .action-btn').forEach((item, index) => {
				item.style.opacity = '0';
				item.style.transform = 'translateY(20px)';
				setTimeout(() => {
						item.style.transition = 'all 0.6s ease';
						item.style.opacity = '1';
						item.style.transform = 'translateY(0)';
				}, index * 100);
		});
});

// Функция для обновления баланса (если нужна)
function updateBalanceDisplay(newBalance) {
    const balanceElement = document.querySelector('.balance-value');
    if (balanceElement) {
        balanceElement.textContent = `${newBalance} 🌴`;
    }
}