// game.js


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, addDoc, getDocs, collection, serverTimestamp, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDYvAhAdcYVmjVSdxwwPekiMI52727EF50",
    authDomain: "anzuwelcome.firebaseapp.com",
    databaseURL: "https://anzuwelcome-default-rtdb.firebaseio.com",
    projectId: "anzuwelcome",
    storageBucket: "anzuwelcome.appspot.com",
    messagingSenderId: "20756709428",
    appId: "1:20756709428:web:f812a10294adaff4820a61",
    measurementId: "G-Z0Q55C7B6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//スコア送信テスト
// try {
//     const docRef = await addDoc(collection(db, "scores"), {
//         playerName: "test_random",
//         score: getRandomInt(51,55),
//         dateTime: serverTimestamp()
//     });
//     console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//     console.error("Error adding document: ", e);
// }


// try {
//     // rankingsコレクションを指定し、scoreで降順にソート、上位5件を取得するクエリを作成
//     const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(15));

//     // クエリを実行してドキュメントを取得
//     const querySnapshot = await getDocs(q);

//     // 結果をコンソールに出力
//     querySnapshot.forEach((doc) => {
//         console.log(doc.data().playerName,doc.data().score,doc.data().dateTime);
//     });
// } catch (error) {
//     console.error("Error getting documents: ", error);
// }







// 5から50の範囲でランダムな整数を生成する
function getRandomInt(min, max) {
    // Math.random() は0以上1未満の値を返す
    // 1を足す理由は、maxも結果に含めたいため
    // Math.floor() で小数点以下を切り捨てて整数にする
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  const randomInt = getRandomInt(5, 50);








// ゲームの要素を取得
const block = document.getElementById('block');
const redLine = document.getElementById('red-line');
const scoreDisplay = document.getElementById('score');

// 初期値の設定
let score = 0;
let isGameActive = false;
let acceleration = 0.03; // 加速度

// エンターキーの状態を追跡する変数
let isEnterPressed = false;

// ブロックの落下速度と上昇速度の定義
let blockFallingSpeed = 1; // 初期の落下速度
let blockRisingSpeed = 10; // ブロックが上昇する速度
let blockIsRising = false; // ブロックが上昇中かどうかを追跡する変数

//ゲーム開始時にランキングを表示する
updateRanking();

// キーボードのイベントリスナー
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && !isGameActive) {
        isGameActive = true;
        score = 0; //スコアリセット
        acceleration = 0.03;
        scoreDisplay.textContent = `Score: ${score}`; // スコア表示を更新
        blockFallingSpeed = 0.1; // 初期落下速度を設定
        blockIsRising = false; // ブロックが上昇していない状態にする
        document.getElementById('game-container').classList.add('active');
        gameLoop();
    } else if (event.key === 'b' && isGameActive && !isEnterPressed) {
        isEnterPressed = true;

        if (blockFallingSpeed > 0 && isOverlap(block, redLine)) {
            blockIsRising = true; // ブロックを上昇させる
            blockFallingSpeed = -(Math.random() * 5 + 5 + score * 0.1); // 5から10のランダムな値で上昇速度を設定
            score++; // スコアを増やす
            acceleration = 0.1 + score * 0.001;
            scoreDisplay.textContent = `Score: ${score}`; // スコア表示を更新
        }
    }
});

// キーが離されたときのイベントリスナー
document.addEventListener('keyup', (event) => {
    if (event.key === 'b') {
        isEnterPressed = false; // キーが離されたことを記録
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
function resetGame() {
    block.style.bottom = '550px'; // 赤い線よりも上に配置
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

// ゲーム終了時の処理を更新
async function endGame() {
    isGameActive = false;
    const registerScore = confirm(`Game Over! Your score: ${score}\nスコアをランキングに登録しますか？`);
    if (registerScore) {
        let playerName = "";
        while (!playerName || playerName.trim().length === 0 || playerName.trim().length > 10) {
            playerName = prompt(`Enter your name (10 characters max):`);
            if (!playerName) {
                // プレイヤーがキャンセルを選択した場合、再度ランキング登録を確認
                continue;
            }
            if (playerName.trim().length > 10) {
                alert("ユーザーネームは10文字以下で入力してください。");
            } else if (playerName.trim().length === 0) {
                alert("プレイヤーネームを入力してください。");
            }
        }
        let playerScore = score; // ゲームのスコアを取得

        // Firestoreにスコアを送信
        await addDoc(collection(db, "scores"), {
            playerName: playerName.trim(),
            score: playerScore,
            dateTime: serverTimestamp()
        });

        // プレイヤーのランキング位置を取得して、10位以内ならランキングを更新
        const playerRank = await showRanking(playerName.trim(), playerScore);
        if (playerRank <= 10) {
            updateRanking();
        }
        console.log("test")
    } else {
        console.log("スコアの登録がキャンセルされました。");
    }
    resetGame();
    console.log("test2")
}

async function showRanking(playerName, playerScore) {
    const scoresRef = collection(db, "scores");
    // スコアの降順、dateTimeの昇順でクエリを作成
    const q = query(scoresRef, orderBy("score", "desc"), orderBy("dateTime", "asc"));
    const querySnapshot = await getDocs(q);
    let rank = 1;
    let playerRank = 0;

    querySnapshot.forEach((doc) => {
        // プレイヤー名とスコアが一致するドキュメントを見つけたら、そのランクを記録
        if (doc.data().playerName === playerName && doc.data().score === playerScore) {
            playerRank = rank;
            // 一致したらその時点でループを終了
            return;
        }
        rank++;
    });

    alert(`あなたのランキングは${playerRank}位でした。`);
    return playerRank; // プレイヤーのランクを返す
}

async function updateRanking() {
    const rankingContainer = document.getElementById('ranking-data');
    const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    let rank = 1;

    querySnapshot.forEach((doc) => {
        // ランキングデータの存在する<p>タグを特定し、プレイヤー名とスコアで更新
        const rankingP = rankingContainer.querySelector(`p:nth-of-type(${rank})`);
        rankingP.textContent = `${rank}位　${doc.data().playerName} - ${doc.data().score}`;
        rank++;
    });

    // 10位以内にデータが足りない場合、残りを「データ未取得」で保持
    for (let i = rank; i <= 10; i++) {
        const rankingP = rankingContainer.querySelector(`p:nth-of-type(${i})`);
        rankingP.textContent = `${i}位　データ未取得`;
    }
}