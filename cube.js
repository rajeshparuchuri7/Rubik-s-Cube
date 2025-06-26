

function getCubeSvg(cubeStr) {
  const colorMap = {
    w: 'white',
    y: 'yellow',
    g: 'green',
    b: 'blue',
    o: 'orange',
    r: 'red'
  };

  if (cubeStr.length !== 54) {
    return '<p>Invalid Cube String</p>';
  }

  const square = (color, i, xOffset = 0, yOffset = 0) => {
    const size = 30;
    const x = (i % 3) * size + xOffset;
    const y = Math.floor(i / 3) * size + yOffset;
    return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${colorMap[color]}" stroke="#000" />`;
  };

  let svg = '<svg width="400" height="300">';
  const facePositions = {
    U: [90, 0],
    R: [180, 90],
    F: [90, 90],
    D: [90, 180],
    L: [0, 90],
    B: [270, 90]
  };

  const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];
  for (let f = 0; f < 6; f++) {
    const [xOff, yOff] = facePositions[faceOrder[f]];
    for (let i = 0; i < 9; i++) {
      const color = cubeStr[f * 9 + i];
      svg += square(color, i, xOff, yOff);
    }
  }

  svg += '</svg>';
  return svg;
}

class Cube {
  constructor() {
    this.reset();
  }

  reset() {
    this.faces = {
      U: Array(9).fill('w'),
      D: Array(9).fill('y'),
      F: Array(9).fill('g'),
      B: Array(9).fill('b'),
      L: Array(9).fill('o'),
      R: Array(9).fill('r')
    };
    this.stepCount = 0;
    this.stepLog = [];
    this.scrambleSteps = [];
    this.render();
    this.updateStepUI();
  }

  rotate(face, direction = 'CW') {
    this.stepCount++;
    this.stepLog.push(`Rotate ${face} ${direction}`);
    this.scrambleSteps.push({ face, direction });
    const f = this.faces;

    const rotateMap = {
      U: { face: 'U', sides: [['F', 0, 1, 2], ['R', 0, 1, 2], ['B', 0, 1, 2], ['L', 0, 1, 2]] },
      D: { face: 'D', sides: [['F', 6, 7, 8], ['L', 6, 7, 8], ['B', 6, 7, 8], ['R', 6, 7, 8]] },
      F: { face: 'F', sides: [['U', 6, 7, 8], ['R', 0, 3, 6], ['D', 2, 1, 0], ['L', 8, 5, 2]] },
      B: { face: 'B', sides: [['U', 2, 1, 0], ['L', 0, 3, 6], ['D', 6, 7, 8], ['R', 8, 5, 2]] },
      L: { face: 'L', sides: [['U', 0, 3, 6], ['F', 0, 3, 6], ['D', 0, 3, 6], ['B', 8, 5, 2]] },
      R: { face: 'R', sides: [['U', 8, 5, 2], ['B', 0, 3, 6], ['D', 8, 5, 2], ['F', 8, 5, 2]] }
    };

    const { face: centerFace, sides } = rotateMap[face];
    f[centerFace] = direction === 'CW' ? rotateFaceCW(f[centerFace]) : rotateFaceCCW(f[centerFace]);

    const temp = sides.map(([s, ...idx]) => idx.map(i => f[s][i]));

    for (let i = 0; i < 4; i++) {
      const [nextFace, ...nextIdx] = sides[(i + (direction === 'CW' ? 3 : 1)) % 4];
      nextIdx.forEach((idx, j) => {
        f[nextFace][idx] = temp[i][j];
      });
    }

    this.render();
    this.updateStepUI();
  }

  scramble() {
    this.scrambleSteps = [];
    const moves = ['U', 'D', 'F', 'B', 'L', 'R'];
    for (let i = 0; i < 10; i++) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      this.rotate(move);
    }
    this.stepLog.push('--- Scramble Complete ---');
    this.updateStepUI();
  }

  solve() {
    this.stepLog.push('Solving...');
    const reverseDir = dir => (dir === 'CW' ? 'CCW' : 'CW');
    const reverseSteps = [...this.scrambleSteps].reverse();
    reverseSteps.forEach(({ face, direction }) => {
      this.rotate(face, reverseDir(direction));
    });
    this.stepLog.push('--- Solved ---');
    this.updateStepUI();
  }

  getCubeString() {
    return (
      this.faces.U.join('') +
      this.faces.R.join('') +
      this.faces.F.join('') +
      this.faces.D.join('') +
      this.faces.L.join('') +
      this.faces.B.join('')
    );
  }

  render() {
    const svg = getCubeSvg(this.getCubeString());
    document.getElementById('cubeDisplay').innerHTML = svg;
  }

  updateStepUI() {
    document.getElementById('stepCount').textContent = `Steps to solve: ${this.stepCount}`;
    document.getElementById('stepsLog').innerHTML = this.stepLog.map(s => `<div>${s}</div>`).join('');
  }
}

function rotateFaceCW(face) {
  const [a, b, c, d, e, f, g, h, i] = face;
  return [g, d, a, h, e, b, i, f, c];
}

function rotateFaceCCW(face) {
  const [a, b, c, d, e, f, g, h, i] = face;
  return [c, f, i, b, e, h, a, d, g];
}

const cube = new Cube();

function rotateManual(face) {
  cube.rotate(face, 'CW');
}

document.getElementById('scrambleBtn').addEventListener('click', () => cube.scramble());
document.getElementById('solveBtn').addEventListener('click', () => cube.solve());
document.getElementById('resetBtn').addEventListener('click', () => cube.reset());