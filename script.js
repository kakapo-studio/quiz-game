// ※ 問題のデータ（questions）は questions.js に書いてあります

// ===== 配列をシャッフルした「コピー」を返す =====
function shuffle(array) {
  const copy = [...array]; // 元の配列をコピー

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 0〜i のどれかをランダムに選ぶ
    [copy[i], copy[j]] = [copy[j], copy[i]];       // i番目とj番目を入れ替える
  }

  return copy;
}

// ===== ゲームの状態 =====
let current = 0;   // 今何問目か（0から数える）
let score = 0;     // 正解した数
let quizList = []; // 今回出題する問題（シャッフル済み）

// ===== 画面の部品 =====
// タイトル画面
const titleScreen = document.getElementById("title-screen");
const startButton = document.getElementById("start");
const totalText = document.getElementById("total");

// ゲーム画面：問題を解くエリア
const gameScreen = document.getElementById("game-screen");
const quizArea = document.getElementById("quiz-area");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question");
const choiceButtons = document.querySelectorAll("#choices button");
const result = document.getElementById("result");
const nextButton = document.getElementById("next");

// ゲーム画面：結果エリア
const summary = document.getElementById("summary");
const scoreText = document.getElementById("score-text");
const rateText = document.getElementById("rate-text");
const comment = document.getElementById("comment");
const retryButton = document.getElementById("retry");

// ===== ゲームを最初から始める =====
function startGame() {
  quizList = shuffle(questions); // 問題の順番をシャッフル
  current = 0;
  score = 0;
  quizArea.hidden = false; // 問題エリアを出す
  summary.hidden = true;   // 結果エリアを隠す
  showQuestion();
}

// ===== 問題を表示する =====
function showQuestion() {
  const q = quizList[current];
  const choices = shuffle(q.choices); // 選択肢をシャッフル

  // 進み具合（例：問題 3 / 10）とバーの長さ
  progressText.textContent = "問題 " + (current + 1) + " / " + quizList.length;
  progressFill.style.width = ((current + 1) / quizList.length) * 100 + "%";

  questionText.textContent = q.text;

  choiceButtons.forEach((button, i) => {
    button.textContent = choices[i];
    button.disabled = false;                     // 押せる状態に戻す
    button.classList.remove("correct", "wrong"); // 前の問題の色を消す
  });

  result.textContent = "";
  nextButton.classList.add("invisible"); // 「次へ」ボタンは見えなくしておく（場所は残す）
}

// ===== 正答率に応じたコメントを返す =====
function getComment(rate) {
  if (rate === 100) {
    return "全問正解！ 地理マスターです 🏆";
  } else if (rate >= 70) {
    return "すばらしい！ あと少しで満点です";
  } else if (rate >= 40) {
    return "なかなかの実力！ もう一度挑戦してみよう";
  } else {
    return "伸びしろたっぷり！ もう一度挑戦してみよう";
  }
}

// ===== 最終結果を表示する =====
function showResult() {
  const rate = Math.round((score / quizList.length) * 100); // 正答率（%）

  scoreText.textContent = score + " / " + quizList.length;
  rateText.textContent = "正答率 " + rate + "%";
  comment.textContent = getComment(rate);

  quizArea.hidden = true; // 問題エリアを隠す
  summary.hidden = false; // 結果エリアを出す
}

// ===== 選択肢が押されたとき =====
choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const q = quizList[current];

    if (button.textContent === q.answer) {
      score++;
      result.textContent = "正解！ 🎉";
    } else {
      result.textContent = "不正解… 正解は「" + q.answer + "」でした";
      button.classList.add("wrong"); // 押したボタンを赤に
    }

    // 全部のボタンを押せなくして、正解のボタンを緑に
    choiceButtons.forEach((b) => {
      b.disabled = true;
      if (b.textContent === q.answer) {
        b.classList.add("correct");
      }
    });

    // 最後の問題なら「結果を見る」、それ以外は「次の問題へ」
    if (current === quizList.length - 1) {
      nextButton.textContent = "結果を見る";
    } else {
      nextButton.textContent = "次の問題へ";
    }
    nextButton.classList.remove("invisible");
  });
});

// ===== 「次の問題へ」が押されたとき =====
nextButton.addEventListener("click", () => {
  current++;

  if (current < quizList.length) {
    showQuestion();
  } else {
    showResult();
  }
});

// ===== 「もう一度遊ぶ」が押されたとき =====
retryButton.addEventListener("click", () => {
  startGame();
});

// ===== 「スタート」が押されたとき =====
startButton.addEventListener("click", () => {
  titleScreen.hidden = true;  // タイトル画面を隠す
  gameScreen.hidden = false;  // ゲーム画面を出す
  startGame();
});

// ===== タイトル画面に問題数を表示 =====
totalText.textContent = questions.length;
