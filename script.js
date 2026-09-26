// ===== 問題のデータ =====
const questions = [
  {
    text: "日本で一番高い山は？",
    choices: ["富士山", "北岳", "奥穂高岳", "槍ヶ岳"],
    answer: "富士山",
  },
  {
    text: "日本で一番長い川は？",
    choices: ["利根川", "信濃川", "石狩川", "北上川"],
    answer: "信濃川",
  },
  {
    text: "日本で一番大きい湖は？",
    choices: ["霞ヶ浦", "猪苗代湖", "琵琶湖", "サロマ湖"],
    answer: "琵琶湖",
  },
  {
    text: "日本で一番大きい都道府県は？",
    choices: ["東京都", "大阪府", "北海道", "千葉県"],
    answer: "北海道",
  },
];

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
const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");
const startButton = document.getElementById("start");
const totalText = document.getElementById("total");
const questionText = document.getElementById("question");
const choicesBox = document.getElementById("choices");
const choiceButtons = document.querySelectorAll("#choices button");
const result = document.getElementById("result");
const nextButton = document.getElementById("next");
const retryButton = document.getElementById("retry");

// ===== ゲームを最初から始める =====
function startGame() {
  quizList = shuffle(questions); // 問題の順番をシャッフル
  current = 0;
  score = 0;
  choicesBox.hidden = false;     // 選択肢を表示し直す
  retryButton.hidden = true;     // 「もう一度遊ぶ」を隠す
  showQuestion();
}

// ===== 問題を表示する =====
function showQuestion() {
  const q = quizList[current];
  const choices = shuffle(q.choices); // 選択肢をシャッフル

  questionText.textContent = (current + 1) + "問目：" + q.text;

  choiceButtons.forEach((button, i) => {
    button.textContent = choices[i];
    button.disabled = false;                     // 押せる状態に戻す
    button.classList.remove("correct", "wrong"); // 前の問題の色を消す
  });

  result.textContent = "";
  nextButton.hidden = true; // 「次へ」ボタンは隠しておく
}

// ===== 最終結果を表示する =====
function showResult() {
  questionText.textContent = "終了！ " + quizList.length + "問中 " + score + "問正解でした";
  choicesBox.hidden = true;
  result.textContent = "";
  nextButton.hidden = true;
  retryButton.hidden = false;
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

    nextButton.hidden = false;
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
