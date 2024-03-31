import { Editor } from "@sailkit/core";

import { ITransferData } from "../types";
import { buildSingleEditorService } from "../utilities";

export class DataTransfer {
  private editor: Editor;
  private cache: ITransferData = {} as ITransferData;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  setItem<T extends keyof ITransferData>(key: T, value: ITransferData[T]) {
    this.cache[key] = value;
  }

  getItem<T extends keyof ITransferData>(key: T): ITransferData[T] {
    return this.cache![key];
  }

  removeItem<T extends keyof ITransferData>(key: T) {
    delete this.cache[key];
  }

  destroy() {
    this.cache = {} as ITransferData;
  }
}

export const getDataTransfer = buildSingleEditorService<DataTransfer>(DataTransfer);
