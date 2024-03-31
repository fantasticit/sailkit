import { PMNode, Step, Transaction, Transform } from "@sailkit/core";

/**
 * Returns a new `Transform` based on all steps of the passed transactions.
 */
export function combineTransactionSteps(oldDoc: PMNode, transactions: Transaction[]): Transform {
  const transform = new Transform(oldDoc);

  transactions.forEach((transaction) => {
    transaction.steps.forEach((step) => {
      transform.step(step);
    });
  });

  return transform;
}

/**
 * Removes duplicated values within an array.
 * Supports numbers, strings and objects.
 */
export function removeDuplicates<T>(array: T[], by = JSON.stringify): T[] {
  const seen: Record<string, boolean> = {};

  return array.filter((item) => {
    const key = by(item);

    return Object.prototype.hasOwnProperty.call(seen, key) ? false : (seen[key] = true);
  });
}

/**
 * Returns a list of duplicated items within an array.
 */
export function findDuplicates<T>(items: T[]): T[] {
  const filtered = items.filter((el, index) => items.indexOf(el) !== index);
  const duplicates = removeDuplicates(filtered);

  return duplicates;
}

export type ChangedRange = {
  oldStart: number;
  oldEnd: number;
  newStart: number;
  newEnd: number;
};

/**
 * Removes duplicated ranges and ranges that are
 * fully captured by other ranges.
 */
function simplifyChangedRanges(changes: ChangedRange[]): ChangedRange[] {
  const uniqueChanges = removeDuplicates(changes);

  return uniqueChanges.length === 1
    ? uniqueChanges
    : uniqueChanges.filter((change, index) => {
        const rest = uniqueChanges.filter((_, i) => i !== index);

        return !rest.some((otherChange) => {
          return (
            change.oldStart >= otherChange.oldStart &&
            change.oldEnd <= otherChange.oldEnd &&
            change.newStart >= otherChange.newStart &&
            change.newEnd <= otherChange.newEnd
          );
        });
      });
}

/**
 * Returns a list of changed ranges
 * based on the first and last state of all steps.
 */
export function getChangedRanges(transform: Transform): ChangedRange[] {
  const { mapping, steps } = transform;
  const changes: ChangedRange[] = [];

  mapping.maps.forEach((stepMap, index) => {
    // This accounts for step changes where no range was actually altered
    // e.g. when setting a mark, node attribute, etc.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!stepMap?.ranges.length) {
      const step = steps[index] as Step & {
        from?: number;
        to?: number;
      };

      if (step.from === undefined || step.to === undefined) {
        return;
      }

      changes.push({
        oldStart: step.from,
        oldEnd: step.to,
        newStart: step.from,
        newEnd: step.to,
      });
    } else {
      stepMap.forEach((from, to) => {
        const newStart = mapping.slice(index).map(from, -1);
        const newEnd = mapping.slice(index).map(to);
        const oldStart = mapping.invert().map(newStart, -1);
        const oldEnd = mapping.invert().map(newEnd);

        changes.push({
          oldStart,
          oldEnd,
          newStart,
          newEnd,
        });
      });
    }
  });

  return simplifyChangedRanges(changes);
}

export interface ArrayDifference<T> {
  added: T[];
  removed: T[];
  common: T[];
}

/**
 * Checks for added, removed and common items between two arrays.
 */
export function arrayDifference<T>(array1: T[], array2: T[]): ArrayDifference<T> {
  const uniqueCombinedArray = removeDuplicates([...array1, ...array2]);
  const data: ArrayDifference<T> = {
    added: [],
    removed: [],
    common: [],
  };

  uniqueCombinedArray.forEach((item) => {
    if (!array1.includes(item) && array2.includes(item)) {
      data.added.push(item);
    }

    if (array1.includes(item) && !array2.includes(item)) {
      data.removed.push(item);
    }

    if (array1.includes(item) && array2.includes(item)) {
      data.common.push(item);
    }
  });

  return data;
}
