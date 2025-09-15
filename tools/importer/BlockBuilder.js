export default class BlockBuilder {
  constructor(config = {}) {
    this.name = config.name || 'Block';
    this.block = config.block;
    this.blockItem = config.blockItem || null;
    this.blockRows = Array.isArray(config.blockRows) ? config.blockRows : [];
    this.itemRows = Array.isArray(config.itemRows) ? config.itemRows : [];
    this.removeAfterInsert = !!config.removeAfterInsert;
  }

  /**
   * Find all matching block elements under `main`.
   */
  find(main) {
    const root = main || (typeof document !== 'undefined' ? document.body : null);
    if (!root) return [];

    if (!this.block) {
      return [{
        el: root,
        parent: root,
        indexInParent: 0,
        isRootFallback: true,
      }];
    }

    const matches = [...root.querySelectorAll(this.block)];
    return matches.map((el) => {
      const parent = el.parentElement;
      const indexInParent = parent ? [...parent.children].indexOf(el) : -1;
      return {
        el, parent, indexInParent, isRootFallback: false,
      };
    });
  }

  /**
   * Extract value based on selector or function
   */
  static extractValue(context, rowDef, document) {
    if (!context) return '';
    if (typeof rowDef === 'string') {
      const found = context.querySelector(rowDef);
      return found || '';
    }
    if (typeof rowDef === 'function') {
      try {
        return rowDef(context, document) || '';
      } catch {
        return '';
      }
    }
    return '';
  }

  /**
   * Create cells for each block and insert before original element.
   */
  cellMaker(main, document) {
    const matches = this.find(main);
    if (!matches.length) return;

    matches.forEach(({ el, parent, isRootFallback }) => {
      const cells = [[this.name]];

      // --- Block-level rows ---
      if (this.blockRows.length) {
        this.blockRows.forEach((rowDef) => {
          if (Array.isArray(rowDef)) {
            // row with multiple columns
            const row = rowDef.map((def) => this.constructor.extractValue(el, def, document));
            if (row.some((v) => v && v !== '')) {
              cells.push(row);
            }
          } else {
            // single selector/function = one-column row
            const value = this.constructor.extractValue(el, rowDef, document);
            if (value) {
              cells.push([value]);
            }
          }
        });
      }

      // --- Item-level rows ---
      const items = this.blockItem ? [...el.querySelectorAll(this.blockItem)] : [];
      if (items.length && this.itemRows.length) {
        items.forEach((item) => {
          const row = this.itemRows.map((rowDef) => {
            if (Array.isArray(rowDef)) {
              // nested array → treat as multiple cols in one row
              return rowDef.map((def) => this.constructor.extractValue(item, def, document));
            }
            return this.constructor.extractValue(item, rowDef, document);
          }).flat();
          cells.push(row);
        });
      } else if (items.length && this.itemRows.length === 0) {
        items.forEach((item) => cells.push([item]));
      } else if (!items.length && this.blockRows.length === 0) {
        cells.push([el]);
      }

      if (cells.length < 2) return;

      const table = WebImporter.DOMUtils.createTable(cells, document);

      if (isRootFallback) {
        main.insertBefore(table, main.firstChild);
      } else if (parent) {
        parent.insertBefore(table, el);
      }

      if (this.removeAfterInsert) el.remove();
    });
  }
}
