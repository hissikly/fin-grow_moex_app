let isTestPassed = false;
let currentTestAnswer = null;

let testQuestions = [
  {
    question: "Что из перечисленного НЕ является характеристикой фьючерса?",
    options: [
      { text: "Фиксированная цена", correct: false },
      { text: "Обязательство сторон", correct: false },
      { text: "Гарантированная прибыль", correct: true },
      { text: "Определённый срок", correct: false }
    ]
  }
  // Можно добавить больше вопросов
];

let currentQuestionIndex = 0;
let testCompleted = false;
let testScore = 0;

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.querySelector('.tab[onclick*="' + tabId + '"]').classList.add('active');
  
  if (tabId === 'game') {
    setTimeout(initLevelDoneHandlers, 0);
    
    if (testCompleted) {
      const level6 = document.querySelector('.game-level[data-level="6"]');
      if (level6) {
        level6.classList.remove('available', 'yellow-level');
        level6.classList.add('done');
        level6.querySelector('.level-num').style.color = '#388e3c';
      }
    }
  }
}

function withdraw() {
  alert('Финики выведены!');
}

let userBalance = 1000;

function updateBalanceDisplay() {
  document.getElementById('profile-balance-value').textContent = userBalance;
  document.getElementById('deposits-balance-value').textContent = userBalance;
  document.getElementById('game-balance-value').textContent = userBalance;
}

function resetTheory() {
  document.querySelectorAll('.theory-slide').forEach(slide => {
    slide.classList.remove('active');
  });
  document.querySelector('.theory-slide[data-slide="1"]').classList.add('active');
  updateCounter();
  document.querySelectorAll('.test-options input').forEach(input => {
    input.checked = false;
  });
  updateNavButtons(); // Добавьте эту строку
}

function updateCounter() {
  const currentSlide = document.querySelector('.theory-slide.active');
  if (!currentSlide) return;
  
  const currentSlideNum = currentSlide.dataset.slide;
  const totalSlides = document.querySelectorAll('.theory-slide').length;
  document.querySelector('.page-counter').textContent = `${currentSlideNum}/${totalSlides}`;
}


document.addEventListener('DOMContentLoaded', () => {
  updateBalanceDisplay();
	document.querySelector('.back-to-map-btn')?.addEventListener('click', confirmBackToMap);
  document.getElementById('invest-btn').addEventListener('click', startInvestmentFlow);
  document.getElementById('choose-instrument-btn').addEventListener('click', chooseAmount);
  document.getElementById('confirm-amount-btn').addEventListener('click', confirmChoice);
  document.getElementById('continue-story-btn').addEventListener('click', showMopsReaction);
  document.getElementById('close-mops-btn').addEventListener('click', () => closeModal('modal-mops'));

  // Инициализация обработчиков для уровней
  initLevelDoneHandlers();

  // Обработчик кнопки "Вперед"
  document.querySelector('.next-btn')?.addEventListener('click', () => {
    const current = document.querySelector('.theory-slide.active');
    
    if (current.dataset.slide === "3" && !testCompleted) {
      alert('Пожалуйста, завершите тест перед переходом дальше!');
      return;
    }
    
    const next = current.nextElementSibling;
    if (next && next.classList.contains('theory-slide')) {
      current.classList.remove('active');
      next.classList.add('active');
      updateCounter();
      updateNavButtons();
    } else if (!next) {
      if (testCompleted) {
        if (!isTestPassed) {
          userBalance += 50;
          updateBalanceDisplay();
          isTestPassed = true;
        }
        showTab('game');
      } else {
        alert('Пожалуйста, завершите тест!');
      }
    }
  });
});


function openTransferModal() {
  document.getElementById('modal-transfer').classList.add('show');
}

function closeTransferModal() {
  document.getElementById('modal-transfer').classList.remove('show');
  document.getElementById('transfer-amount-input').value = '';
}

function confirmTransfer() {
  const amountInput = document.getElementById('transfer-amount-input');
  const amount = parseInt(amountInput.value, 10);
  const MINIMUM_BALANCE = 50;

  if (isNaN(amount) || amount <= 0) {
    alert('Пожалуйста, введите корректное количество фиников.');
    return;
  }

  if (amount > userBalance) {
    alert('У вас недостаточно фиников для перевода.');
    return;
  }

  if (userBalance - amount < MINIMUM_BALANCE) {
    alert(`Перевод невозможен. На счете должно оставаться минимум ${MINIMUM_BALANCE} фиников.`);
    return;
  }

  userBalance -= amount;
  updateBalanceDisplay();
  closeTransferModal();
  alert(`Вы успешно перевели ${amount} Ф на ФинУслуги!`);
}

function showSecretCodeModal() {
  const code = document.getElementById('secret-code-source').textContent;
  document.getElementById('modal-secret-code-value').textContent = code;
  document.getElementById('modal-secret-code').classList.add('show');
}

function closeSecretCodeModal() {
  document.getElementById('modal-secret-code').classList.remove('show');
}

function continueGame() {
  alert('Продолжение игры!');
}

let selectedInstrument = null;
let investmentAmount = 0;

const mopsImages = [
    'static/imgs/mops_back_6.png',
    'static/imgs/mops_back_7.png',
    'static/imgs/mops_back_8.png',
    'static/imgs/mops_back_9.png'
];

const financialInstruments = [
    { id: 'vklad-mops', name: 'Вклад "Копилка Мопса"', type: 'deposit', details: { rate: '25%', term: '6 мес.' } },
    { id: 'vklad-finik', name: 'Вклад "Золотой Финик"', type: 'deposit', details: { rate: '22%', term: '12 мес.' } },
    { id: 'stocks-pugcorp', name: 'Акции "PugCorp"', type: 'stock', details: 'Высокий риск, высокая доходность' },
    { id: 'bonds-fingrow', name: 'Облигации "FinGrow Bonds"', type: 'bond', details: 'Низкий риск, стабильный доход' }
];

function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

function startInvestmentFlow() {
    const instrumentsList = document.getElementById('instruments-list');
    instrumentsList.innerHTML = ''; 
    financialInstruments.forEach(inst => {
        const instElement = document.createElement('div');
        instElement.className = 'instrument-option';
        instElement.dataset.id = inst.id;
        
        let detailsHTML = '';
        if (inst.type === 'deposit') {
            detailsHTML = `<div class="instrument-details">Процент: <b>${inst.details.rate}</b>, Срок: <b>${inst.details.term}</b></div>`;
        } else {
            detailsHTML = `<div class="instrument-details">${inst.details}</div>`;
        }

        instElement.innerHTML = `
            <div class="instrument-name">${inst.name}</div>
            ${detailsHTML}
        `;

        instElement.addEventListener('click', () => {
            document.querySelectorAll('.instrument-option').forEach(el => el.classList.remove('selected'));
            instElement.classList.add('selected');
            selectedInstrument = inst;
        });
        instrumentsList.appendChild(instElement);
    });
    showModal('modal-instruments');
}

function chooseAmount() {
    if (!selectedInstrument) {
        alert('Пожалуйста, выберите финансовый инструмент.');
        return;
    }
    closeModal('modal-instruments');
    showModal('modal-amount');
    document.getElementById('amount-input').focus();
}

function confirmChoice() {
    const amountInput = document.getElementById('amount-input');
    const amount = parseInt(amountInput.value, 10);
    const MINIMUM_BALANCE = 50;

    if (isNaN(amount) || amount <= 0) {
        alert('Пожалуйста, введите корректное количество фиников.');
        return;
    }
    if (amount > userBalance) {
        alert('У вас недостаточно фиников для инвестирования.');
        return;
    }
    if (userBalance - amount < MINIMUM_BALANCE) {
        alert(`Инвестиция невозможна. На счете должно оставаться минимум ${MINIMUM_BALANCE} фиников.`);
        return;
    }

    investmentAmount = amount;
    
    const confirmInfo = document.getElementById('confirm-info');
    confirmInfo.innerHTML = `
        <div class="confirm-line">Вы вкладываете: <span class="confirm-value">${investmentAmount} <span class="currency-unit">Ф</span></span></div>
        <div class="confirm-line">В инструмент: <span class="confirm-value">${selectedInstrument.name}</span></div>
    `;

    closeModal('modal-amount');
    showModal('modal-confirm');
}

function showMopsReaction() {
    // 1. Вычитаем вложенную сумму
    userBalance -= investmentAmount;

    const mopsImg = document.getElementById('mops-img');
    const mopsMessage = document.getElementById('mops-message');
    
    const randomMops = mopsImages[Math.floor(Math.random() * mopsImages.length)];
    mopsImg.src = randomMops;

    let message = '';
    const profitRateStock = 0.5;  // 50%
    const lossRateStock = 0.4;     // 40%
    const profitRateDeposit = 0.1; // 10%
    const profitRateBond = 0.05;   // 5%

    switch (selectedInstrument.type) {
        case 'deposit': {
            const profit = Math.round(investmentAmount * profitRateDeposit);
            userBalance += investmentAmount + profit; // Возвращаем вклад и начисляем проценты
            message = `Отличный выбор! ${selectedInstrument.name} принес тебе ${profit} фиников. Вложенные средства возвращены на счёт.`;
            break;
        }
        case 'bond': {
            const profit = Math.round(investmentAmount * profitRateBond);
            userBalance += investmentAmount + profit; // Возвращаем средства и начисляем доход
            message = `Надежно и стабильно! Облигации принесли тебе ${profit} фиников. Вложенные средства возвращены.`;
            break;
        }
        case 'stock': {
            if (Math.random() > 0.5) { // 50% chance of success
                const profit = Math.round(investmentAmount * profitRateStock);
                userBalance += investmentAmount + profit; // Возвращаем акции и начисляем прибыль
                message = `Риск оправдался! Акции "${selectedInstrument.name}" выросли, и ты заработал ${profit} фиников.`;
            } else {
                const loss = Math.round(investmentAmount * lossRateStock);
                userBalance += investmentAmount - loss; // Возвращаем акции по новой, более низкой цене
                message = `О нет! Акции "${selectedInstrument.name}" упали. Ты потерял ${loss} фиников. В следующий раз попробуй <a href="#" onclick="showTab('deposits'); closeModal('modal-mops'); return false;">вклады</a>.`;
            }
            break;
        }
    }
    
    // 2. Обновляем баланс на экране
    updateBalanceDisplay();
    mopsMessage.innerHTML = message;

    closeModal('modal-confirm');
    showModal('modal-mops');

    selectedInstrument = null;
    investmentAmount = 0;
    document.getElementById('amount-input').value = '';
}

function ignore() {
  alert('Новость проигнорирована.');
}
function invest() {
  startInvestmentFlow();
}

function filterDeposits() {
  const term = document.getElementById('filter-term').value;
  const minsum = parseInt(document.getElementById('filter-minsum').value, 10) || 0;
  document.querySelectorAll('.deposit-card').forEach(card => {
    const cardTerm = card.getAttribute('data-term');
    const cardMinSum = parseInt(card.getAttribute('data-minsum'), 10);
    let show = true;
    if (term !== 'all' && cardTerm !== term) show = false;
    if (minsum > 0 && cardMinSum < minsum) show = false;
    card.style.display = show ? '' : 'none';
  });
}
function resetDepositsFilter() {
  document.getElementById('filter-term').value = 'all';
  document.getElementById('filter-minsum').value = '';
  document.querySelectorAll('.deposit-card').forEach(card => {
    card.style.display = '';
  });
}

function toggleSecretCode() {
  const btnText = document.getElementById('profile-secret-toggle-text');
  const value = document.getElementById('profile-secret-value');
  if (value.style.display === 'none') {
    value.style.display = '';
    btnText.textContent = 'Скрыть код';
  } else {
    value.style.display = 'none';
    btnText.textContent = 'Показать код';
  }
}

function showTheoryPage() {
  document.querySelector('.game-levels-wrapper').style.display = 'none';
  document.getElementById('game-mode').style.display = 'none';
  document.getElementById('theory-page').style.display = 'block';
  resetTheory();
  updateCounter();
  
  // Инициализация теста
  currentQuestionIndex = 0;
  testCompleted = false;
  testScore = 0;
  
  // Показываем первый вопрос
  showQuestion(currentQuestionIndex);
}



function backToMap(confirmed) {
  if (!confirmed && !testCompleted) {
    confirmBackToMap();
    return;
  }
  
  // Закрываем модальное окно, если оно открыто
  closeModal('modal-confirm-exit');
  
  document.getElementById('theory-page').style.display = 'none';
  document.querySelector('.game-levels-wrapper').style.display = '';
  
  if (testCompleted) {
    const level6 = document.querySelector('.game-level[data-level="6"]');
    if (level6) {
      level6.classList.remove('available', 'yellow-level');
      level6.classList.add('done');
      level6.querySelector('.level-num').style.color = '#388e3c';
    }
  }
}


function resetTheory() {
  document.querySelectorAll('.theory-slide').forEach(slide => {
    slide.classList.remove('active');
  });
  document.querySelector('.theory-slide[data-slide="1"]').classList.add('active');
  updateCounter();
  document.querySelectorAll('.test-options input').forEach(input => {
    input.checked = false;
  });
}

function initLevelDoneHandlers() {
  // Удаляем старые обработчики
  document.querySelectorAll('.game-level').forEach(level => {
    level.replaceWith(level.cloneNode(true));
  });

  // Обработчики для пройденных уровней
  document.querySelectorAll('.game-level.done').forEach(level => {
    level.addEventListener('click', function(e) {
      e.stopPropagation();
      showModal('modal-level-done');
    });
  });

  // Обработчики для доступных (желтых) уровней
  document.querySelectorAll('.game-level.available:not(.done)').forEach(level => {
    level.addEventListener('click', function(e) {
      e.stopPropagation();
      const levelNum = this.getAttribute('data-level');
      
      if (levelNum === '7') {
        alert('Здесь должна быть практика по открытию вкладов');
      } else if (levelNum === '6') {
        showTheoryPage();
      }
    });
  });

  // Обработчики для заблокированных уровней
  document.querySelectorAll('.game-level:not(.available):not(.done)').forEach(level => {
    level.addEventListener('click', function(e) {
      e.stopPropagation();
      alert('Сначала завершите предыдущие уровни!');
    });
  });
}


function checkTest() {
  const selected = document.querySelector('input[name="test"]:checked');
  if (!selected) {
    alert('Пожалуйста, выберите ответ!');
    return;
  }
  
  const isCorrect = selected.classList.contains('correct');
  
  if (isCorrect) {
    testScore++;
    
    if (currentQuestionIndex < testQuestions.length - 1) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
    } else {
      testCompleted = true;
      isTestPassed = true;
      userBalance += 50;
      updateBalanceDisplay();
      
      // Разблокируем следующий уровень (7-й)
      const nextLevel = document.querySelector('.game-level[data-level="7"]');
      if (nextLevel) {
        nextLevel.classList.remove('locked');
        nextLevel.classList.add('available', 'yellow-level');
        initLevelDoneHandlers();
      }
      
      // Разблокируем кнопку "Вперед"
      updateNavButtons();
      
      alert('🎉 Тест пройден! Уровень 7 теперь доступен.');
    }
  } else {
    alert('❌ Неверный ответ! Попробуйте еще раз.');
  }
}


document.querySelector('.next-btn')?.addEventListener('click', function() {
  const current = document.querySelector('.theory-slide.active');
  
  if (current.dataset.slide === "3" && !testCompleted) {
    alert('Пожалуйста, завершите тест перед переходом дальше!');
    return;
  }
  
  const next = current.nextElementSibling;
  
  if (next && next.classList.contains('theory-slide')) {
    current.classList.remove('active');
    next.classList.add('active');
    updateCounter();
    updateNavButtons();
  } else {
    // Это последний слайд - возвращаемся к карте уровней
    backToMap();
    
    // Отмечаем уровень 6 как пройденный
    const level6 = document.querySelector('.game-level[data-level="6"]');
    if (level6) {
      level6.classList.remove('available', 'yellow-level');
      level6.classList.add('done');
      level6.querySelector('.level-num').style.color = '#388e3c';
    }
  }
});


function updateNavButtons() {
  const currentSlide = document.querySelector('.theory-slide.active');
  if (!currentSlide) return;
  
  const currentSlideNum = parseInt(currentSlide.dataset.slide);
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  // Кнопка "Назад" всегда активна, кроме первого слайда
  prevBtn.disabled = currentSlideNum === 1;
  prevBtn.classList.toggle('locked', currentSlideNum === 1);
  
  // Кнопка "Вперед"
  if (currentSlideNum === 3) { // На слайде с тестом
    nextBtn.disabled = !testCompleted;
    nextBtn.classList.toggle('locked', !testCompleted);
  } else {
    // На других слайдах
    const hasNextSlide = currentSlide.nextElementSibling && 
                        currentSlide.nextElementSibling.classList.contains('theory-slide');
    nextBtn.disabled = !hasNextSlide;
    nextBtn.classList.toggle('locked', !hasNextSlide);
  }
}


document.querySelector('.prev-btn')?.addEventListener('click', () => {
  const current = document.querySelector('.theory-slide.active');
  const prev = current.previousElementSibling;
  
  if (prev && prev.classList.contains('theory-slide')) {
    current.classList.remove('active');
    prev.classList.add('active');
    updateCounter();
    updateNavButtons();
  }
});


document.querySelector('.next-btn')?.addEventListener('click', function() {
  const current = document.querySelector('.theory-slide.active');
  
  if (current.dataset.slide === "3" && !testCompleted) {
    alert('Пожалуйста, завершите тест перед переходом дальше!');
    return;
  }
  
  const next = current.nextElementSibling;
  
  if (next && next.classList.contains('theory-slide')) {
    current.classList.remove('active');
    next.classList.add('active');
    updateCounter();
    updateNavButtons();
  } else {
    // Это последний слайд - возвращаемся к карте уровней
    backToMap();
    
    // Отмечаем уровень 6 как пройденный
    const level6 = document.querySelector('.game-level[data-level="6"]');
    if (level6) {
      level6.classList.remove('available', 'yellow-level');
      level6.classList.add('done');
      level6.querySelector('.level-num').style.color = '#388e3c';
    }
  }
});

function showQuestion(index) {
  const question = testQuestions[index];
  const slide = document.querySelector('.theory-slide[data-slide="3"]');
  
  let optionsHTML = '';
  question.options.forEach((option, i) => {
    optionsHTML += `
      <div class="test-option">
        <input type="radio" name="test" id="option-${i}" value="${i}" ${option.correct ? 'class="correct"' : ''}>
        <label for="option-${i}" class="test-option-label">
          <span class="test-option-text">${option.text}</span>
        </label>
      </div>
    `;
  });
  
  slide.innerHTML = `
    <div class="test-header">
      <h2>📝 Тест по фьючерсам</h2>
      <div class="test-progress">Вопрос ${index + 1} из ${testQuestions.length}</div>
    </div>
    <div class="theory-content">
      <div class="test-question">${question.question}</div>
      <div class="test-options">
        ${optionsHTML}
      </div>
      <button class="main-btn check-test-btn">Проверить ответ</button>
    </div>
  `;

  document.querySelector('.check-test-btn').addEventListener('click', checkTest);
  updateNavButtons(); // Важно обновить состояние кнопок после загрузки вопроса
}



function closeModalAndExit() {
  closeModal('modal-confirm-exit');
  backToMap(true); // Передаем true для подтверждения выхода
}

function confirmBackToMap() {
  if (!testCompleted) {
    const modalContent = document.getElementById('modal-confirm-exit').querySelector('.modal-content');
    modalContent.innerHTML = `
      <span class="modal-close" onclick="closeModal('modal-confirm-exit')">&times;</span>
      <h3>Подтверждение выхода</h3>
      <p>Вы уверены, что хотите покинуть уровень? Прогресс не будет сохранен!</p>
      <div class="modal-buttons">
        <button class="main-btn" onclick="closeModalAndExit()">Да, выйти</button>
        <button class="main-btn reset" onclick="closeModal('modal-confirm-exit')">Отмена</button>
      </div>
    `;
    showModal('modal-confirm-exit');
  } else {
    backToMap(false);
  }
}


