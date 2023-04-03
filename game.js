let buttonX = document.querySelector(".X");
let buttonO = document.querySelector(".O");

let desk = document.querySelector(".container");
let row = document.querySelectorAll(".row");
let square = document.querySelectorAll(".square");
let buttons = document.querySelectorAll(".size");
function startGame() {
  document.querySelector(".content").classList.remove("hidden");
  document.querySelector(".content2").classList.add("hidden");
}
function chooseSize(event) {
  let size = Number(event.target.dataset.number);
  event.target.style.boxShadow = "2px 2px 2px #bfdbd9";
  createHTML(size);
  game.deskMoves = createArray(size);
  if ((game.deskMoves.length = size)) {
    document.querySelector(".startBtn").addEventListener("click", startGame);
  }
  buttons.forEach(function (el) {
    el.removeEventListener("click", chooseSize);
  });
}
buttons.forEach(function (el) {
  el.addEventListener("click", chooseSize);
});

let game = {
  userSign: "",
  computerSign: "",
  winner: "",
  // deskMoves: [
  //   ["", "", ""],
  //   ["", "", ""],
  //   ["", "", ""],
  // ],
  deskMoves: [],
  makeUserMove: function (target) {
    if (target.innerHTML == "") {
      target.innerHTML = this.userSign;
      target.style.color = "#06d4cd";
    }
  },
  addUserMove: function (x, y) {
    let arr2 = this.getEmptySquares();
    for (let i = 0; arr2.length > i; i++) {
      if (arr2[i][0] === x && arr2[i][1] === y) {
        this.deskMoves[x][y] = this.userSign;
      } else continue;
    }
  },
  getEmptySquares: function () {
    let arr = [];
    for (let x = 0; this.deskMoves.length > x; x++) {
      for (let y = 0; this.deskMoves[x].length > y; y++) {
        if (this.deskMoves[x][y] == "") {
          arr.push([x, y]);
        }
      }
    }

    return arr;
  },
  makeComputerMove: function () {
    let lines = this.getLines(this.deskMoves);
    let userSign = this.userSign;
    let computerSign = this.computerSign;

    let computerWin = function (lines, computerSign) {
      for (let i = 0; lines.length > i; i++) {
        let line = lines[i];
        let newComp = line.filter((el1) => el1.value === computerSign);

        if (newComp.length === 2) {
          for (let k = 0; line.length > k; k++) {
            if (line[k].value === "") {
              return line[k];
            }
          }
        }
      }

      return null;
    };

    let preventUserToWin = function (lines, userSign) {
      for (let i = 0; lines.length > i; i++) {
        let line = lines[i];
        let newAr = line.filter((el) => el.value === userSign);
        //Place sign to prevent user to win.
        if (newAr.length === 2) {
          for (let k = 0; line.length > k; k++) {
            if (line[k].value === "") {
              return line[k];
            }
          }
        }
      }

      return null;
    };

    let placeSignOnEmptySquare = function (lines) {
      for (let i = 0; lines.length > i; i++) {
        let line = lines[i];
        let filteredLine = line.filter((square) => square.value === "");

        if (filteredLine.length === line.length) {
          return filteredLine[0];
        }
      }

      return null;
    };

    let placeSignOnLineWithMultipleEmptySquares = function (lines) {
      for (let i = 0; lines.length > i; i++) {
        let line = lines[i];
        let filteredLine = line.filter((square) => square.value === "");

        if (filteredLine.length >= 1) {
          return filteredLine[0];
        }
      }

      return null;
    };

    let squareToMark = computerWin(lines, computerSign);

    if (!squareToMark) {
      squareToMark = preventUserToWin(lines, userSign);

      if (!squareToMark) {
        squareToMark = placeSignOnEmptySquare(lines);

        if (!squareToMark) {
          squareToMark = placeSignOnLineWithMultipleEmptySquares(lines);
        }
      }
    }

    this.deskMoves[squareToMark.x][squareToMark.y] = this.computerSign;
    desk.children[squareToMark.x].children[squareToMark.y].innerHTML =
      this.computerSign;
    desk.children[squareToMark.x].children[squareToMark.y].style.color =
      "white";
  },
  getLines: function (desk) {
    let newArr = [];

    for (let i = 0; i < desk.length; i++) {
      let vertical = [];
      for (let k = 0; k < desk[i].length; k++) {
        console.log(i, k, desk[i][k]);
        vertical.push({ value: desk[i][k], x: i, y: k });
      }
      console.log(vertical);
      newArr.push(vertical);
    }

    for (let y = 0; desk.length > y; y++) {
      var horisontal = [];

      for (let x = 0; desk.length > x; x++) {
        horisontal.push({ value: desk[x][y], x: x, y: y });
      }
      newArr.push(horisontal);
    }
    let diagonal1 = [];
    let diagonal2 = [];
    for (let x = 0; desk.length > x; x++) {
      let y = desk.length - (x + 1);
      diagonal1.push({ value: desk[x][x], x: x, y: x });
      diagonal2.push({ value: desk[x][y], x: x, y: y });
    }
    newArr.push(diagonal1);
    newArr.push(diagonal2);
    return newArr;
  },
  findWinner: function (sign, desk) {
    let arr = this.getLines(desk);
    let win = false;
    for (let i = 0; arr.length > i; i++) {
      let filtered = arr[i].filter(function (el) {
        return el.value === sign;
      });
      // console.log(filtered);
      if (arr[i].length === filtered.length) {
        win = true;

        if (sign === this.userSign) {
          this.winner = "user";
          for (let k = 0; filtered.length > k; k++) {
            let x = filtered[k].x;
            let y = filtered[k].y;
            document.querySelector(".container").children[x].children[
              y
            ].style.backgroundColor = "green";
          }
        }

        if (sign === this.computerSign) {
          this.winner = "computer";
          console.log(`You lost`);
          for (let k = 0; filtered.length > k; k++) {
            let x = filtered[k].x;
            let y = filtered[k].y;
            document.querySelector(".container").children[x].children[
              y
            ].style.backgroundColor = "red";
          }
        }

        document
          .querySelector(".container")
          .removeEventListener("click", addTarget);
        return win;
      }
    }

    return win;
  },
  checkDraw: function () {
    let arr = this.getEmptySquares();
    let draw = false;
    if (arr.length === 0 && this.winner === "") {
      draw = true;
    }
    return draw;
  },
};

document.querySelector(".buttons").addEventListener("click", addSign);
function addSign(event) {
  event.target.style.boxShadow = "5px 5px 5px #06d4cd";
  let sign = event.target.innerText;
  console.log(sign);
  if (sign == "X") {
    game.userSign = "X";
    game.computerSign = "O";
    desk.addEventListener("click", addTarget);
  } else {
    game.userSign = "O";
    game.computerSign = "X";
    desk.addEventListener("click", addTarget);
  }
  document.querySelector(".buttons").removeEventListener("click", addSign);
}

function addTarget(event) {
  let target = event.target;
  let parent = target.parentElement;
  let x = Number(parent.dataset.numberx);
  let y = Number(target.dataset.numbery);
  game.makeUserMove(target);
  game.addUserMove(x, y);
  if (game.findWinner(game.userSign, game.deskMoves)) {
    let text = setTimeout(function () {
      document.querySelector(".message").classList.remove("hidden");
      document.querySelector(".winner").innerText = "You WON";
    }, 2000);

    return;
  }

  if (game.checkDraw()) {
    document.querySelector(".container").style.backgroundColor = "blue";
    let text = setTimeout(function () {
      document.querySelector(".message").classList.remove("hidden");
      document.querySelector(".winner").innerText = "It is DRAW!!!!!";
    }, 2000);

    return;
  }

  game.makeComputerMove();
  if (game.findWinner(game.computerSign, game.deskMoves)) {
    let text = setTimeout(function () {
      document.querySelector(".message").classList.remove("hidden");
      document.querySelector(".winner").innerText = "Computer won, you LOST";
    }, 2000);
    return;
  }
  if (game.checkDraw()) {
    let text = setTimeout(function () {
      document.querySelector(".message").classList.remove("hidden");
      document.querySelector(".winner").innerText = "It is DRAW!!!!!";
    }, 2000);

    return;
  }
}
function createArray(number) {
  let ar = [];
  let total = number;
  let ar2 = [];
  for (let i = 0; i < total; i++) {
    ar2.push("");
  }
  for (let i = 0; i < total; i++) {
    ar.push([...ar2]);
  }
  return ar;
}
function createHTML(amount) {
  let ar = createArray(amount);
  for (let i = 0; ar.length > i; i++) {
    let column = document.createElement("div");
    column.classList.add("column");
    column.dataset.numberx = i;
    desk.appendChild(column);

    for (let k = 0; ar[i].length > k; k++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.dataset.numbery = k;
      column.appendChild(square);
    }
  }
}
function resetGame() {
  game.winner = "";
  game.computerSign = "";
  game.userSign = "";
  for (i = 0; game.deskMoves.length > i; i++) {
    for (k = 0; game.deskMoves[i].length > k; k++) {
      game.deskMoves[i][k] = "";
      desk.children[i].children[k].innerHTML = "";
      desk.children[i].children[k].style.backgroundColor = "#425453";
    }
  }
  document.querySelector(".message").classList.add("hidden");
  document.querySelector(".buttons").addEventListener("click", addSign);
  document.querySelectorAll(".choice").forEach(function (el) {
    el.style.boxShadow = "0px 0px grey";
  });
}
console.log(desk);
document.querySelector(".play").addEventListener("click", resetGame);
document.querySelector(".back").addEventListener("click", function () {
  resetGame();
  desk.innerText = "";
  game.deskMoves = [];
  document.querySelector(".content2").classList.remove("hidden");
  document.querySelector(".content").classList.add("hidden");
  document.querySelector(".startBtn").removeEventListener("click", startGame);
  buttons.forEach(function (el) {
    el.addEventListener("click", chooseSize);
  });
  buttons.forEach(function (el) {
    el.style.boxShadow = "0px 0px green";
  });
});
