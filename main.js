// ==========================================================================================
// ==========================================================================================

//ゲーム画面の大きさの定義
const gameScreenSize = {
  x: 1366,
  y: 768
};

//ゲーム画面の原点座標の定義
const gameAnchorPoint = {
  x: 0,
  y: 0
};

const gameFPS = 60; //FPSの設定
let objects;  //オブジェクト（UIパーツ）の箱を作る


// ==========================================================================================
// ==========================================================================================

//ロード時の処理
window.onload = function () {

  defineObjects();  //オブジェクトのロード
  objects.forEach(object => {
    applyDefaultUISetteing(object);
  });
  setInterval(function () { update(gameFPS) }, 1000 / gameFPS); // ゲーム設定のFPSでゲームループを開始
}

//毎フレームの処理
function update(gameFPS) {
  let windowSize = getWindowSize();
  calcGameAnchorPoint(windowSize, gameScreenSize);
  // オブジェクトの表示更新
  objects.forEach(object => {
    autoAdjustUI(object);
  });
}




// ==========================================================================================
// ==========================================================================================

// オブジェクトの配列を定義する関数
function defineObjects() {
  objects = [
    {
      element: document.getElementById('mySquare1'), // オブジェクト1のHTML要素
      x: 0, // オブジェクト1のX座標
      y: 0, // オブジェクト1のY座標
      width: 1366, // 初期の幅を設定
      height: 768, // 初期の高さを設定
      position: "absolute",
      backgroundColor: "rgba(50, 127, 157, 0.729)",
      init: function() {
        this.element.style.backgroundColor = this.backgroundColor;
        this.element.addEventListener('mouseover', () => {
          this.element.style.backgroundColor = 'rgba(165, 42, 42, 0.16)';
        });
        this.element.addEventListener('mouseout', () => {
          this.element.style.backgroundColor = this.backgroundColor;
        });
      }
    },
    {
      element: document.getElementById('mySquare2'), // オブジェクト2のHTML要素
      x: 200, // オブジェクト2のX座標
      y: 300, // オブジェクト2のY座標
      width: 100, // 初期の幅を設定
      height: 100 // 初期の高さを設定
    },
    // 他のオブジェクトを追加
  ];

  objects.forEach(object => object.init ? object.init() : null);
}


// ==========================================================================================
// ==========================================================================================


function getWindowSize() {
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  // console.log("ウィンドウの幅: " + windowWidth + " ピクセル");
  // console.log("ウィンドウの高さ: " + windowHeight + " ピクセル");
  // ウィンドウの幅と高さを含むオブジェクトを返す
  return {
    width: windowWidth,
    height: windowHeight
  };
}

// ゲーム画面の左上原点座標の計算
function calcGameAnchorPoint(windowSize, gameScreenSize) {
  if (windowSize.width > gameScreenSize.x) {
    gameAnchorPoint.x = (windowSize.width - gameScreenSize.x) / 2;
  } else {
    gameAnchorPoint.x = 0;
  };
  if (windowSize.height > gameScreenSize.y) {
    gameAnchorPoint.y = (windowSize.height - gameScreenSize.y) / 2;
  } else {
    gameAnchorPoint.y = 0;
  };
  // console.log(gameAnchorPoint);
}


// オブジェクトの表示位置とサイズを調整する関数
function autoAdjustUI(object) {
  const element = object.element;
  element.style.left = gameAnchorPoint.x + object.x + 'px'; // X軸に沿って動かす
  element.style.top = gameAnchorPoint.y + object.y + 'px';  // Y軸に沿って動かす
  element.style.width = object.width + 'px'; // 幅を設定
  element.style.height = object.height + 'px'; // 高さを設定
}

//ロード時に座標設定、背景色など初期設定を行う
function applyDefaultUISetteing(object) {
  const element = object.element;
  element.style.position = object.position;
  element.style.backgroundColor = object.backgroundColor;
  console.log("適用完了");
}



