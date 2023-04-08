import { createStore } from "solid-js/store";
import { ISqlPagination } from "../models/SqlTable.model";
import {
  ColumnDef,
  createSolidTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";

export type SqlTableState = {
  pagination: ISqlPagination;
  data: unknown[];
  columns: ColumnDef<unknown, any>[];
};

export type SqlTableStateProps = {
  pagination: ISqlPagination;
};

export const createSqlTableState = (initialState: SqlTableStateProps) => {
  const [state, setState] = createStore<SqlTableState>({
    ...initialState,
    data: [],
    columns: [],
  });

  const table = createSolidTable({
    columnResizeMode: "onChange",
    get data() {
      return state.data;
    },
    get columns() {
      return state.columns;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  table.setPageSize(state.pagination.pageSize);

  function setPagination(pag: ISqlPagination) {
    setState("pagination", pag);
    
    table.setPageSize(pag.pageSize);
    table.setPageIndex(pag.pageIndex);
  }

  function setData(data: SqlTableState["data"]) {
    setState("data", data);
  }

  function setColumns(columns: SqlTableState["columns"]) {
    setState("columns", columns);
  }

  return {
    state,
    table,
    setPagination,
    setData,
    setColumns,
  };
};
