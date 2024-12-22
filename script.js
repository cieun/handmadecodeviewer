const sendButton = document.getElementById('sendButton');
const inputMessage = document.getElementById('inputMessage');
const outputMessage = document.getElementById('outputMessage')
const loading = document.getElementById('loading');

const loadMessages = () => {
    //사용자 메시지 복원
    const storedOutputMessages = JSON.parse(localStorage.getItem('outputMessages')) || [];
    storedOutputMessages.forEach(({ timestamp, message }) => {
        const containerElement = document.createElement('div');
        containerElement.classList.add('message-container');
        
        const timestampElement = document.createElement('span');
        timestampElement.classList.add('timestamp');
        timestampElement.textContent = `${timestamp} `;

        const messageElement = document.createElement('span');
        messageElement.classList.add('message');
        messageElement.textContent = `${message} `;

        containerElement.appendChild(timestampElement);
        containerElement.appendChild(messageElement);
        outputMessage.appendChild(containerElement);
    });

    // gpt 응답 복원
    const storedResponseOutput = localStorage.getItem('responseOutput');
    if (storedResponseOutput) {
        document.getElementById('responseOutput').textContent = storedResponseOutput;
    }
};

//사용자 메시지 저장
const saveMessage = (timestamp, message) => {
    const storedMessages = JSON.parse(localStorage.getItem('outputMessages')) || [];
    storedMessages.push({ timestamp, message });
    localStorage.setItem('outputMessages', JSON.stringify(storedMessages));
};

// gpt 응답 저장
const saveResponseOutput = (content) => {
    localStorage.setItem('responseOutput', content);
};

sendButton.addEventListener('click', () => {
    const message = inputMessage.value.trim();
    if (message) {
        const currentTime = new Date().toLocaleTimeString();

        // 메시지 표시
        const containerElement = document.createElement('div');
        containerElement.classList.add('message-container');
        
        const timestampElement = document.createElement('span');
        timestampElement.classList.add('timestamp');
        timestampElement.textContent = `${currentTime} `;

        const messageElement = document.createElement('span');
        messageElement.classList.add('message');
        messageElement.textContent = `${message} `;

        containerElement.appendChild(timestampElement);
        containerElement.appendChild(messageElement);

        outputMessage.appendChild(containerElement);

        // 메시지 저장
        saveMessage(currentTime, message);

        loading.style.display = 'block';
        askGPT(message);
        inputMessage.value = '';
    }
});

inputMessage.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

// 새로고침 시 메시지와 응답 복원
loadMessages();

// 줄 번호 업데이트
const lineNumber = document.getElementById('lineNumber');

const updateLineNumbers = () => {
    const lines = document.getElementById('responseOutput').innerText.split('\n').length + 3;
    lineNumber.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
};

const observer = new MutationObserver(updateLineNumbers);
observer.observe(document.getElementById('responseOutput'), { childList: true, subtree: true, characterData: true });

updateLineNumbers();
