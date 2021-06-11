export type TagItem = {
  id: string;

  label: {
    zh_CN: string;
    en_US: string;
  };

  /** tag's  path */
  path: string;

  /** can be closed ? */
  closable: boolean;
};

export interface TagState {
  /** tagsView list */
  tags: TagItem[];
  initBury:string;
  /**current tagView id */
  activeTagId: TagItem['id'];
}
