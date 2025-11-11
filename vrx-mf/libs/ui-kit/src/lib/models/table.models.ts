export interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'avatar' | 'badge' | 'date' | 'actions';
  sortable?: boolean;
  width?: string;
}

export interface TableAction {
  action: string;
  label: string;
  icon?: string;
  class?: string;
}

export interface TableActionEvent {
  action: string;
  item: unknown;
  index: number;
}

export interface TableRowClickEvent {
  item: unknown;
  index: number;
}
