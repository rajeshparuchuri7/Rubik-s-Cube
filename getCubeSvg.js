

// function getColor(char) {
//   return {
//     r: 'red',
//     g: 'green',
//     b: 'blue',
//     y: 'yellow',
//     o: 'orange',
//     w: 'white'
//   }[char] || 'gray';
// }

// function getCubeSvg(stateStr) {
//   const size = 20;
//   let html = '<svg width="300" height="200">';
//   const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];
//   const faceOffsets = {
//     U: [3, 0], R: [6, 3], F: [3, 3],
//     D: [3, 6], L: [0, 3], B: [9, 3]
//   };

//   for (let f = 0; f < 6; f++) {
//     const face = faceOrder[f];
//     const [xOffset, yOffset] = faceOffsets[face];
//     const start = f * 9;

//     for (let i = 0; i < 9; i++) {
//       const color = getColor(stateStr[start + i]);
//       const x = (i % 3 + xOffset) * size;
//       const y = (Math.floor(i / 3) + yOffset) * size;
//       html += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${color}" stroke="black"/>`;
//     }
//   }

//   html += '</svg>';
//   return html;
// }


