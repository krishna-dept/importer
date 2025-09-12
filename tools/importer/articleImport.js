function test(document, WebImporter, main) {
  console.log(document.querySelector('[name="template"]')?.getAttribute('content') !== 'article-page-template');

  if (document.querySelector('[name="template"]')?.getAttribute('content') !== 'article-page-template') {
    return;
  }

  const heroITitle = document.querySelector('h1');
  const heroImg = document.querySelector('img');
  const heroCells = [
    ['Hero'],
    [heroImg],
    [heroITitle],
  ];

  const hero = WebImporter.DOMUtils.createTable(heroCells, document);

  //   const tabsCells = [
  //     ['Tabs'],
  //     ['Tab 1', 'Tab 2'],
  //   ];

  //   const tabs = WebImporter.DOMUtils.createTable(tabsCells, document);

  //   main.prepend(tabs);
  main.prepend(hero);
}

export default test;
