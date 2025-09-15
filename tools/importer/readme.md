Example 1: Hero block with 1 row, 1 column (h1 only)
const hero = new BlockBuilder({
  name: 'Hero',
  block: '.hero',
  blockRows: ['h1'],
});


✅ Output cells:

[
  ['Hero'],
  [<h1>],
]


Table:

+------+
| Hero |
+------+
| h1   |
+------+

Example 2: Hero block with 1 row, 2 columns (h1 and img)
const hero = new BlockBuilder({
  name: 'Hero',
  block: '.hero',
  blockRows: ['h1', 'img'],
});


✅ Output cells:

[
  ['Hero'],
  [<h1>, <img>],
]


Table:

+-----------+
|   Hero    |
+-----------+
| h1 | img  |
+-----------+

Example 3: Hero block with 2 rows (h1 in first row, img in second)
const hero = new BlockBuilder({
  name: 'Hero',
  block: '.hero',
  blockRows: [
    ['h1'],   // row 1
    ['img'],  // row 2
  ],
});


✅ Output cells:

[
  ['Hero'],
  [<h1>],
  [<img>],
]


Table:

+------+
| Hero |
+------+
| h1   |
+------+
| img  |
+------+

Example 4: Cards block with a title and items
const cards = new BlockBuilder({
  name: 'Cards',
  block: '.cards',
  blockRows: ['.title'],         // block-level title
  blockItem: '.cards-item',      // repeatable items
  itemRows: ['img', '.ititle'],  // each item has img + title
});


✅ Suppose DOM looks like:

<div class="cards">
  <div class="title">Featured Cards</div>
  <div class="cards-item"><img/><div class="ititle">One</div></div>
  <div class="cards-item"><img/><div class="ititle">Two</div></div>
</div>


Cells will be:

[
  ['Cards'],
  [<.title>],
  [<img>, <.ititle>],
  [<img>, <.ititle>],
]


Table:

+--------+
| Cards  |
+--------+
| Title  |
+--------+
| img | ititle |
+-------------+
| img | ititle |
+-------------+


👉 So rule of thumb:

blockRows: ['h1'] → 1 row, 1 col.

blockRows: ['h1', 'img'] → 1 row, 2 cols.

blockRows: [['h1'], ['img']] → 2 rows.

Would you like me to tweak the class so 'h1' and ['h1'] behave the same, meaning you don’t need to wrap single selectors?