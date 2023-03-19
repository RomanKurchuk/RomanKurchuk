export const ROW_SIZE = 8;
export const COL_SIZE = 15;
export const DEFAULT_VALUE = -1;

const SHAPE = [
  [
    [
      [1, 1, 1, 1]
    ],
    [
      [1],
      [1],
      [1],
      [1],
    ]
  ],[
      [
	    [1, 1, 1],
	    [0, 1, 0]
      ],
	  [
	    [1, 0],
	    [1, 1],
	    [1, 0]
      ],[
        [0, 1, 0],
	    [1, 1, 1],
      ],[
        [0, 1],
	    [1, 1],
	    [0, 1],
      ]
  ],[
      [
	    [1, 1, 1],
		[1, 0, 0],
      ],[
	    [1, 0],
		[1, 0],
		[1, 1],
      ],[
	    [0, 0, 1],
		[1, 1, 1],
      ],[
	    [1, 1],
		[0, 1],
		[0, 1],
      ]
  ],[
      [
	    [1, 0, 0],
		[1, 1, 1],
	  ],[
	    [1, 1],
		[1, 0],
		[1, 0],
	  ],[
	    [1, 1, 1],
		[0, 0, 1],
	  ],[
	    [0, 1],
		[0, 1],
		[1, 1],
	  ]
  ],[
      [
	    [1, 1, 0],
		[0, 1, 1],
	  ],[
	    [0, 1],
		[1, 1],
		[1, 0],
	  ]
  ],[
      [
	    [0, 1, 1],
		[1, 1, 0],
	  ],[
	    [1, 0],
		[1, 1],
		[0, 1],
	  ]
  ],[
      [
	    [1, 1],
		[1, 1],
	  ]
  ]
]
 
export const emptyBoard = () => [...Array(ROW_SIZE * COL_SIZE)].map( _ => DEFAULT_VALUE)

export const getRandomShape = () => Math.round((SHAPE.length - 1) * Math.random());

export const getShape = ({shapePos, rotatePos, xPos, yPos}) => SHAPE[shapePos][rotatePos].map(
  (row, rowPos) => row.map(
    (col, colPos) => col? (xPos + colPos + ROW_SIZE * (rowPos + yPos)): DEFAULT_VALUE))
	
export const rotateShape = (isClockwise, {shapePos, rotatePos}) => isClockwise?
  (rotatePos === 0)? (SHAPE[shapePos].length - 1): (rotatePos - 1):
  (rotatePos === (SHAPE[shapePos].length - 1))? 0:(rotatePos + 1);
  
export const InitialState = () => {
	return {
		shapePos: getRandomShape(),
		rotatePos: 0,
		xPos: ROW_SIZE / 2,
		yPos: -3,
		board: emptyBoard(),
		speed: 500,
		isPause: false,
		score: 0,
	}
}