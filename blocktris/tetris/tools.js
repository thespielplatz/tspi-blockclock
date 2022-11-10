// https://medium.com/swlh/matrix-rotation-in-javascript-269cae14a124
const rotateMatrix90C = source => {
  // get the dimensions of the source matrix
  const M = source.length
  const N = source[0].length

  // create a new NxM destination array
  let destination = new Array(N)
  for (let i = 0; i < N; i++) {
    destination[i] = new Array(M)
  }

  // start copying from source into destination
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      destination[i][j] = source[M - j - 1][i]
    }
  }

  // return the destination matrix
  return destination
}

module.exports = {
  rotateMatrix90C
}
