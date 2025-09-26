const mySection = [
  ['Section Metadata'],
  ['Style', ' three-col-table fees-charges-wrapper page-container mb-70 mob-mb-40 list-content-wrapper code-container'],
];

function sectionMaker(selector, main) {
  if (!main || !selector) return;

  const headings = main.querySelectorAll(selector);

  headings.forEach((element) => {
    const hr = document.createElement('hr');
    element.insertAdjacentElement('beforebegin', hr);

    const sectionTable = WebImporter.DOMUtils.createTable(mySection, document);
    element.before(sectionTable);
  });
}

export default sectionMaker;
