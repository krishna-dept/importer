/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

import BlockBuilder from './BlockBuilder.js';
import sectionMaker from './utils/sectionMaker.js';

export default {
  /**
         * Apply DOM operations to the provided document and return
         * the root element to be then transformed to Markdown.
         * @param {HTMLDocument} document The document
         * @param {string} url The url of the page imported
         * @param {string} html The raw html (the document is cleaned up during preprocessing)
         * @param {object} params Object containing some parameters given by the import process.
         * @returns {HTMLElement} The root element to be transformed
         */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // attempt to remove non-content elements
    WebImporter.DOMUtils.remove(main, [
      'header',
      '.header',
      'footer',
      '.footer',
      'iframe',
      'noscript',
      'blockquote',
    ]);

    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    WebImporter.rules.convertIcons(main, document);

    const breadcrumb = new BlockBuilder({
      name: 'Content',
      block: '.breadcrumb_wrapp',
      blockRows: ['nav'],
      sectionMeta: [
        ['Section Metadata'],
        ['style', 'default'],
      ],
    }).cellMaker(main, document);

    // const hero = new BlockBuilder({
    //   name: 'Hero',
    //   block: '.article_wraper',
    //   blockRows: [
    //     ['#articleCoverImage'],
    //     [
    //       (el) => {
    //         const herotext = el.querySelector('.article_caption ');
    //         if (herotext) {
    //           const desp = el.querySelector('div.d-md-flex');

    //           if (desp) {
    //             const ul = document.createElement('ul');

    //             Array.from(desp.children).forEach((child) => {
    //               const li = document.createElement('li');
    //               li.appendChild(child);
    //               ul.appendChild(li);
    //             });

    //             desp.replaceWith(ul);
    //           }
    //           return herotext;
    //         }
    //         return '';
    //       },
    //     ],
    //   ],
    // });

    // const blogCards = new BlockBuilder({
    //   name: 'Cards',
    //   block: 'body > div.wrapper > main > div:nth-child(3) > div > div',
    //   blockRows: ['.row .col', '.row a'],
    //   blockItem: '.col-sm-12.col-md-6.col-lg-4.mb-4',
    //   itemRows: [
    //     [
    //       (item, document) => {
    //         const imgAnchor = item.querySelector('.article_img a');
    //         if (!imgAnchor) return '';

    //         const img = imgAnchor.querySelector('img');
    //         if (!img) return '';

    //         // remove image from anchor and place anchor above image
    //         imgAnchor.replaceWith(img);
    //         item.querySelector('.article_img').prepend(imgAnchor);

    //         return img;
    //       },
    //     ],
    //     ['.tag'],
    //     [
    //       (el, document) => {
    //         // find the caption
    //         const caption = el.querySelector('.article_caption');
    //         if (!caption) return '';

    //         // find the bottom row inside caption
    //         const row = caption.querySelector('.row.align-items-end');
    //         if (row) {
    //           const ul = document.createElement('ul');

    //           // take each child div and wrap into <li>
    //           [...row.children].forEach((div) => {
    //             const li = document.createElement('li');
    //             li.innerHTML = div.innerHTML; // preserve inner content
    //             ul.appendChild(li);
    //           });

    //           // replace row with ul
    //           row.replaceWith(ul);
    //         }

    //         return caption;
    //       },
    //     ],
    //   ],
    // });

    // In your transformDOM:
    // [breadcrumb, hero, blogCards].forEach((block) => block.cellMaker(main, document));

    // const breadcrumbel = document.querySelector('.wrapper');
    // breadcrumbel.after(document.createElement('hr'));
    // const sectionMeta = [
    //   ['Section Metadata'],
    //   ['style', 'default'],
    // ];

    // const hr = document.querySelector('hr');

    // const sectionMetaTable = WebImporter.DOMUtils.createTable(sectionMeta, document);
    // hr.after(sectionMetaTable);

    // const mySection = [
    //   ['Section'],
    //   ['Style', 'default'],
    // ];
    // const sectionTable = WebImporter.DOMUtils.createTable(mySection, document);
    // hr.after(sectionTable);

    // console.log('main', main);
    sectionMaker('h2', main);
    return main;
  },

  /**
         * Return a path that describes the document being transformed (file name, nesting...).
         * The path is then used to create the corresponding Word document.
         * @param {HTMLDocument} document The document
         * @param {string} url The url of the page imported
         * @param {string} html The raw html (the document is cleaned up during preprocessing)
         * @param {object} params Object containing some parameters given by the import process.
         * @return {string} The path
         */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    let p = new URL(url).pathname;
    if (p.endsWith('/')) {
      p = `${p}index`;
    }
    return decodeURIComponent(p)
      .toLowerCase()
      .replace(/\.html$/, '')
      .replace(/[^a-z0-9/]/gm, '-');
  },
};
