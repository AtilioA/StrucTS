// The custom selection is used for providing an interface that is capable of enforcing a cardinality constraint, as well as some other eventual  constraints.
// A collection can have a minimum number of items and a maximum number of items.

// The generic type (T) will be used to specify the type of item that can be added to the collection.
export class CustomCollection<T> {
  // The items in the collection are stored in an array.
  private readonly items: T[];

  // The constructor takes the minimum number of items and the maximum number of items as parameters.
  // The maxItems parameter is optional and can be null, meaning that there is no maximum number of items.
  constructor(
    private readonly minItems: number,
    private readonly maxItems: number | null,
  ) {
    // The items array is initialized to an empty array.
    this.items = [];
  }

  /**
   * Add an item to the collection.
   *
   * @param item The item to add
   * @return true if the item was added; false otherwise
   * @throws An error if the cardinality constraint is violated (i.e. the collection would have more than the maximum number of items)
   */
  add(item: T): boolean {
    // If the collection has no maximum number of items, or the number of items in the collection is less than the maxItems ('not full'),
    if (this.maxItems === null || this.items.length < this.maxItems) {
      // The item is added to the items array.
      this.items.push(item);
      // The method returns true to indicate that the item was added to the collection.
      return true;
      // If the maxItems is not null and the number of items in the collection is greater than or equal to the maxItems, the item cannot be added to the collection.
    } else {
      // An error is thrown to indicate that the item could not be added to the collection due to the cardinality constraint.
      // TODO: Use the type T name instead of 'item' in the error message.
      throw new Error(
        `Adding this item would violate the cardinality constraint: Collection cannot have more than ${this.maxItems} items.`,
      );
    }
  }

  /**
   * Remove an item from the collection.
   *
   * @param item The item to remove
   * @returns true if the item was removed; false otherwise
   * @throws An error if the cardinality constraint is violated (i.e. the collection would have less than the minimum number of items)
   */
  remove(item: T): boolean {
    // Search for the item in the items array.
    const index = this.items.indexOf(item);
    // If the index is not -1, the item was found in the collection.
    if (index === -1) {
      // An error is thrown to indicate that the item could not be removed from the collection.
      throw new Error(
        'The item to be removed does not exist in the collection, so it cannot be removed.',
      );
    } else {
      // The item is removed from this collection's items array.
      this.items.splice(index, 1);
      // If the number of items in the collection is less than the minItems, the item cannot be removed from the collection.
      if (this.items.length < this.minItems) {
        // An error is thrown to indicate that the item could not be removed from the collection, due to the cardinality constraint.
        // TODO: Use the defining
        throw new Error(
          `Removing this item would violate the cardinality constraint: Collection cannot have less than ${this.minItems} items.`,
        );
        // If the number of items in the collection is greater than or equal to the minItems, the item can be removed from the collection.
      } else {
        // The method returns true to indicate that the item was removed from the collection.
        return true;
      }
      // If the index is -1, the item was not even found in the collection.
    }
  }

  // This method returns the items in the collection.
  getItems(): T[] {
    return this.items;
  }
}
