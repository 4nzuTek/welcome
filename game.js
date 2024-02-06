// game.js

// ゲームの要素を取得
const block = document.getElementById('block');
const redLine = document.getElementById('red-line');
const scoreDisplay = document.getElementById('score');

// 初期値の設定
let score = 0;
let isGameActive = false;
let acceleration = 0.1; // 加速度

// エンターキーの状態を追跡する変数
let isEnterPressed = false;

// ブロックの落下速度と上昇速度の定義
let blockFallingSpeed = 1; // 初期の落下速度
let blockRisingSpeed = 10; // ブロックが上昇する速度
let blockIsRising = false; // ブロックが上昇中かどうかを追跡する変数

// キーボードのイベントリスナー
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && !isGameActive) {
        isGameActive = true;
        block.style.bottom = '700px'; // ブロックの初期位置を設定
        score = 0; //スコアリセット
        scoreDisplay.textContent = `Score: ${score}`; // スコア表示を更新
        blockFallingSpeed = 0.1; // 初期落下速度を設定
        blockIsRising = false; // ブロックが上昇していない状態にする
        document.getElementById('game-container').classList.add('active');
        gameLoop();
    } else if (event.key === 'Enter' && isGameActive && !isEnterPressed) {
        isEnterPressed = true;

        if (blockFallingSpeed > 0 && isOverlap(block, redLine)) {
            blockIsRising = true; // ブロックを上昇させる
            blockFallingSpeed = -(Math.random() * 5 + 5); // 5から10のランダムな値で上昇速度を設定
            score++; // スコアを増やす
            scoreDisplay.textContent = `Score: ${score}`; // スコア表示を更新
        }
    }
});

// キーが離されたときのイベントリスナー
document.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        isEnterPressed = false; // エンターキーが離されたことを記録
    }
});

// ゲームループ
function gameLoop() {
    moveBlock();
    checkCollision();

    if (isGameActive) {
        requestAnimationFrame(gameLoop);
    }
}

// ブロックの動き
function moveBlock() {
    const blockBottom = parseInt(getComputedStyle(block).bottom);
    
    // ブロックが上昇または落下中の処理
    if (blockBottom > 0 || blockIsRising) { // 0はブロックが画面外（地面）に達した場合
        blockFallingSpeed += acceleration; // 加速度を適用
        block.style.bottom = `${blockBottom - blockFallingSpeed}px`;
        if (blockBottom >= 900) { // 最大高さに達した場合
            blockIsRising = false; // 上昇を止める
        }
    } else {
        console.log("end01")
        endGame();
    }
}

// 衝突の判定
function checkCollision() {
    const blockBottom = parseInt(getComputedStyle(block).bottom);

    if (blockBottom <= 0) {
        // ブロックが地面に達したときの処理
        console.log("end02");
        endGame();
    }
}

// ブロックの位置リセット
function resetBlockPosition() {
    block.style.bottom = '700px'; // 赤い線よりも上に配置
    blockFallingSpeed = 1; // 速度を初期値にリセット
}

// 2つの要素が重なっているか判定する関数
function isOverlap(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return (
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top &&
        rect1.left < rect2.right &&
        rect1.right > rect2.left
    );
}

// ゲーム終了
function endGame() {
    isGameActive = false;
    blockFallingSpeed = 1; // 速度を初期値にリセット
    alert(`Game Over! Your Score: ${score}`);
}