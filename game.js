// Audio Controls
const bgMusic = document.getElementById('bg-music');
const buttonSound = document.getElementById('button-sound');
const successSound = document.getElementById('success-sound');
const errorSound = document.getElementById('error-sound');
const musicToggle = document.getElementById('music-toggle');
const volumeSlider = document.getElementById('volume-slider');

// Set initial volume
bgMusic.volume = 0.3;

// Play music when page loads
window.addEventListener('load', function() {
    // Autoplay policy may prevent this from working without user interaction
    // So we'll start music on first user interaction
    document.addEventListener('click', startMusicOnce, { once: true });
});

function startMusicOnce() {
    bgMusic.play().catch(e => {
        console.log("Autoplay prevented:", e);
    });
}

function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = '🔊';
    } else {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
    }
}

function changeVolume(value) {
    bgMusic.volume = value / 100;
}

function playButtonSound() {
    buttonSound.currentTime = 0;
    buttonSound.play().catch(e => {
        console.log("Button sound error:", e);
    });
}

function playSuccessSound() {
    successSound.currentTime = 0;
    successSound.play().catch(e => {
        console.log("Success sound error:", e);
    });
}

function playErrorSound() {
    errorSound.currentTime = 0;
    errorSound.play().catch(e => {
        console.log("Error sound error:", e);
    });
}

// Fungsi navigasi antar halaman
function showPage(pageId) {
    // Mainkan suara tombol
    playButtonSound();
    
    // Sembunyikan semua halaman
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Tampilkan halaman yang dipilih
    document.getElementById(pageId).classList.add('active');
    
    // Reset game jika perlu
    if (pageId === 'scramble-page') {
        resetScrambleGame();
    } else if (pageId === 'competition-page') {
        resetCompetition();
    } else if (pageId === 'quiz-page') {
        resetQuiz();
    }
}

// Game Matching
function matchItem(item, targetId) {
    // Mainkan suara tombol
    playButtonSound();
    
    const target = document.getElementById(targetId);
    
    // Beri efek visual saat dicocokkan
    item.style.backgroundColor = '#2ecc71';
    item.style.color = 'white';
    target.style.backgroundColor = '#2ecc71';
    target.style.color = 'white';
    
    // Nonaktifkan klik setelah dicocokkan
    item.onclick = null;
    
    // Mainkan suara sukses
    playSuccessSound();
}

// Scramble Game
const scrambleWords = [
    { scrambled: "S L A A T", answer: "SALAT" },
    { scrambled: "K A T A Z", answer: "ZAKAT" },
    { scrambled: "A S A P U", answer: "PUASA" },
    { scrambled: "J A H I", answer: "HAJI" },
    { scrambled: "H A D A S A T Y", answer: "SYAHADAT" }
];

let currentScrambleIndex = 0;

function resetScrambleGame() {
    currentScrambleIndex = 0;
    document.getElementById('scramble-answer').value = '';
    document.getElementById('scramble-feedback').textContent = '';
    loadScrambleWord();
}

function loadScrambleWord() {
    if (currentScrambleIndex < scrambleWords.length) {
        document.getElementById('scrambled-word').textContent = scrambleWords[currentScrambleIndex].scrambled;
    } else {
        document.getElementById('scrambled-word').textContent = "SELESAI!";
        document.getElementById('scramble-feedback').textContent = "Kamu telah menyelesaikan semua soal!";
    }
}

function checkScramble() {
    // Mainkan suara tombol
    playButtonSound();
    
    const userAnswer = document.getElementById('scramble-answer').value.toUpperCase();
    const correctAnswer = scrambleWords[currentScrambleIndex].answer;
    const feedback = document.getElementById('scramble-feedback');
    
    if (userAnswer === correctAnswer) {
        feedback.textContent = "Benar! 🎉";
        feedback.style.color = "#2ecc71";
        
        // Mainkan suara sukses
        playSuccessSound();
        
        // Tunggu sebentar lalu lanjut ke kata berikutnya
        setTimeout(() => {
            currentScrambleIndex++;
            document.getElementById('scramble-answer').value = '';
            feedback.textContent = '';
            loadScrambleWord();
        }, 1500);
    } else {
        feedback.textContent = "Coba lagi! 💪";
        feedback.style.color = "#e74c3c";
        
        // Mainkan suara error
        playErrorSound();
    }
}

// Kuis Kompetisi Dua Pemain
let player1Score = 0;
let player2Score = 0;
let flagPosition = 50; // Posisi bendera dalam persen (50% = tengah)
let currentQuestionIndex = 0;

// Pertanyaan untuk kompetisi
const competitionQuestions = [
    {
        question: "Rukun Islam ke-3 adalah ...",
        options: ["A. Syahadat", "B. Zakat", "C. Haji", "D. Puasa"],
        correct: "B"
    },
    {
        question: "Shalat adalah tiang agama, artinya ...",
        options: ["A. Paling penting", "B. Penopang agama", "C. Wajib hukumnya", "D. Dilakukan 5 kali"],
        correct: "B"
    },
    {
        question: "Zakat bertujuan untuk ...",
        options: ["A. Membersihkan harta", "B. Membantu fakir miskin", "C. Kedua jawaban benar", "D. Tidak ada yang benar"],
        correct: "C"
    },
    {
        question: "Puasa di bulan Ramadhan dilakukan dari ...",
        options: ["A. Pagi hingga sore", "B. Terbit fajar hingga terbenam matahari", "C. Subuh hingga maghrib", "D. Pukul 6 pagi hingga 6 sore"],
        correct: "B"
    },
    {
        question: "Ibadah haji wajib dilakukan ...",
        options: ["A. Setiap tahun", "B. Sekali seumur hidup", "C. Setiap 5 tahun", "D. Tidak ada kewajiban"],
        correct: "B"
    }
];

function resetCompetition() {
    player1Score = 0;
    player2Score = 0;
    flagPosition = 50;
    currentQuestionIndex = 0;
    document.getElementById('player1-score').textContent = "0";
    document.getElementById('player2-score').textContent = "0";
    updateFlagPosition();
    loadQuestion();
    hideNotification();
}

function loadQuestion() {
    if (currentQuestionIndex < competitionQuestions.length) {
        const question = competitionQuestions[currentQuestionIndex];
        document.getElementById('player1-question').textContent = question.question;
        document.getElementById('player2-question').textContent = question.question;
        
        // Update options untuk player 1
        const player1Options = document.querySelectorAll('.player1-area .option-btn');
        player1Options.forEach((btn, index) => {
            btn.textContent = question.options[index];
            btn.dataset.answer = btn.textContent.charAt(0);
        });
        
        // Update options untuk player 2
        const player2Options = document.querySelectorAll('.player2-area .option-btn');
        player2Options.forEach((btn, index) => {
            btn.textContent = question.options[index];
            btn.dataset.answer = btn.textContent.charAt(0);
        });
    } else {
        showNotification("Permainan Selesai! Player " + (player1Score > player2Score ? "1" : "2") + " Menang!", "success");
    }
}

function nextQuestion() {
    // Mainkan suara tombol
    playButtonSound();
    
    currentQuestionIndex++;
    loadQuestion();
    hideNotification();
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification show ' + type;
}

function hideNotification() {
    const notification = document.getElementById('notification');
    notification.className = 'notification';
}

function answerQuestion(player, answer) {
    // Mainkan suara tombol
    playButtonSound();
    
    const correctAnswer = competitionQuestions[currentQuestionIndex].correct;
    
    if (answer === correctAnswer) {
        if (player === 1) {
            player1Score += 10;
            flagPosition += 10;
            showNotification("Player 1 menjawab benar! +10 poin", "success");
            playSuccessSound();
        } else {
            player2Score += 10;
            flagPosition -= 10;
            showNotification("Player 2 menjawab benar! +10 poin", "success");
            playSuccessSound();
        }
    } else {
        if (player === 1) {
            player1Score -= 5;
            flagPosition -= 5;
            showNotification("Player 1 menjawab salah! -5 poin", "error");
            playErrorSound();
        } else {
            player2Score -= 5;
            flagPosition += 5;
            showNotification("Player 2 menjawab salah! -5 poin", "error");
            playErrorSound();
        }
        
        // Pastikan skor tidak negatif
        if (player1Score < 0) player1Score = 0;
        if (player2Score < 0) player2Score = 0;
    }
    
    // Update tampilan skor
    document.getElementById('player1-score').textContent = player1Score;
    document.getElementById('player2-score').textContent = player2Score;
    
    // Update posisi bendera
    updateFlagPosition();
    
    // Batasi posisi bendera antara 10% dan 90%
    if (flagPosition < 10) {
        flagPosition = 10;
        showNotification("Player 2 Menang!", "success");
        playSuccessSound();
    } else if (flagPosition > 90) {
        flagPosition = 90;
        showNotification("Player 1 Menang!", "success");
        playSuccessSound();
    }
}

function updateFlagPosition() {
    document.getElementById('flag').style.left = `${flagPosition}%`;
}

// Latihan Soal
let quizAnswers = [];

function resetQuiz() {
    quizAnswers = [];
    document.getElementById('score-result').textContent = '';
    
    // Reset tampilan opsi
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.style.backgroundColor = '';
        option.style.color = '';
    });
}

function selectAnswer(questionIndex, answer) {
    // Mainkan suara tombol
    playButtonSound();
    
    // Simpan jawaban
    quizAnswers[questionIndex] = answer;
    
    // Reset warna semua opsi di soal ini
    const options = document.querySelectorAll(`.quiz-option[data-question="${questionIndex}"]`);
    options.forEach(opt => {
        opt.style.backgroundColor = '';
        opt.style.color = '';
    });
    
    // Tandai opsi yang dipilih
    const selectedOption = document.querySelector(`.quiz-option[data-question="${questionIndex}"][data-answer="${answer}"]`);
    if (selectedOption) {
        selectedOption.style.backgroundColor = '#3498db';
        selectedOption.style.color = 'white';
    }
}

function calculateScore() {
    // Mainkan suara tombol
    playButtonSound();
    
    const correctAnswers = ['B', 'A', 'C', 'D', 'A'];
    let score = 0;
    
    for (let i = 0; i < correctAnswers.length; i++) {
        if (quizAnswers[i] === correctAnswers[i]) {
            score += 20; // Setiap soal bernilai 20 poin
        }
    }
    
    const resultElement = document.getElementById('score-result');
    resultElement.textContent = `Skor Kamu: ${score}/100`;
    
    if (score >= 80) {
        resultElement.innerHTML += `<br>Kamu Hebat! Sudah hafal Rukun Islam dengan baik. 🎉`;
        resultElement.style.color = '#2ecc71';
        playSuccessSound();
    } else if (score >= 60) {
        resultElement.innerHTML += `<br>Lumayan! Terus belajar ya. 💪`;
        resultElement.style.color = '#f39c12';
    } else {
        resultElement.innerHTML += `<br>Jangan menyerah! Pelajari lagi materinya. 📚`;
        resultElement.style.color = '#e74c3c';
        playErrorSound();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Music controls
    musicToggle.addEventListener('click', toggleMusic);
    volumeSlider.addEventListener('input', function() {
        changeVolume(this.value);
    });
    
    // Navigation buttons
    document.querySelectorAll('[data-page]').forEach(button => {
        button.addEventListener('click', function() {
            showPage(this.dataset.page);
        });
    });
    
    // Matching game
    document.querySelectorAll('.matching-item[data-target]').forEach(item => {
        item.addEventListener('click', function() {
            matchItem(this, this.dataset.target);
        });
    });
    
    // Scramble game
    document.getElementById('check-scramble').addEventListener('click', checkScramble);
    
    // Competition game
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', function() {
            answerQuestion(parseInt(this.dataset.player), this.dataset.answer);
        });
    });
    
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    
    // Quiz
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            selectAnswer(parseInt(this.dataset.question), this.dataset.answer);
        });
    });
    
    document.getElementById('calculate-score').addEventListener('click', calculateScore);
    
    // Initialize
    resetScrambleGame();
});