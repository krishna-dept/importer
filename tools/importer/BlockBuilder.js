export default class BlockBuilder {
  constructor(config = {}) {
    this.name = config.name || 'Block';
    this.block = config.block;
    this.blockItem = config.blockItem || null;
    this.blockRows = Array.isArray(config.blockRows) ? config.blockRows : [];
    this.itemRows = Array.isArray(config.itemRows) ? config.itemRows : [];
    this.removeAfterInsert = !!config.removeAfterInsert;
    this.sectionMeta = config.sectionMeta || null; // <-- Added this
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
   * Create cells for each block, insert them as tables, and return the created tables.
   */
  cellMaker(main, document) {
    const matches = this.find(main);
    if (!matches.length) {
      return null;
    }

    const createdTables = [];

    matches.forEach(({ el, parent, isRootFallback }) => {
      const cells = [[this.name]];

      // --- Block-level rows ---
      if (this.blockRows.length) {
        this.blockRows.forEach((rowDef) => {
          if (Array.isArray(rowDef)) {
            const row = rowDef.map((def) => this.constructor.extractValue(el, def, document));
            if (row.some((v) => v && v !== '')) {
              cells.push(row);
            }
          } else {
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

      // Insert the main block table
      if (isRootFallback) {
        main.insertBefore(table, main.firstChild);
      } else if (parent) {
        parent.insertBefore(table, el);
      }

      // === NEW LOGIC FOR SECTION METADATA ===
      if (this.sectionMeta) {
        const hr = document.createElement('hr');
        table.after(hr); // Place hr after the main table

        const sectionMetaTable = WebImporter.DOMUtils.createTable(this.sectionMeta, document);
        hr.after(sectionMetaTable); // Place metadata table after the hr
      }
      // === END NEW LOGIC ===

      createdTables.push(table);

      if (this.removeAfterInsert) el.remove();
    });

    if (createdTables.length === 0) {
      return null;
    }
    if (createdTables.length === 1) {
      return createdTables[0];
    }
    return createdTables;
  }
}
