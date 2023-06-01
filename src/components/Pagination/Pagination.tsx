import { createMemo } from "solid-js";
import { Button, Input, Row, Select, Option } from "@solsy/ui";
import { ISqlPagination } from "../../models/SqlTable.model";
import "./Pagination.css";

export interface SqlPaginationProps {
  pagination: ISqlPagination;
  pageCount?: number;

  onPageSize?: (value: number) => void;
  onPageIndex?: (value: number) => void;
}

export const SqlPagination = (props: SqlPaginationProps) => {
  const isPrevDisabled = createMemo(() => {
    if (props.pageCount === 0) {
      return true;
    }
    return props.pagination.pageIndex === 0;
  });

  const isNextDisabled = createMemo(() => {
    if (props.pageCount === 0) {
      return true;
    }
    return props.pagination.pageIndex + 1 === props.pageCount;
  });

  function onPageSize(value: number) {
    props.onPageSize?.(value);
  }

  function onPageIndex(value: number) {
    props.onPageIndex?.(value);
  }

  function onPrev() {
    const count = props.pagination.pageIndex;
    onPageIndex(count - 1);
  }

  function onNext() {
    const count = props.pagination.pageIndex;
    onPageIndex(count + 1);
  }

  function onStart() {
    onPageIndex(0);
  }

  function onEnd() {
    onPageIndex((props.pageCount || 1) - 1);
  }

  function onInputChange(input: HTMLInputElement) {
    const value = Number(input.value);

    if (value > props.pageCount) {
      input.value = props.pageCount.toString();
    }

    if (value < 1) {
      input.value = "1";
    }

    onPageIndex(Number(input.value) - 1);
  }

  return (
    <Row class="gap-2" items="center">
      <Row>
        <Button size="xs" square onClick={onStart} disabled={isPrevDisabled()}>
          <svg
            class="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z" />
          </svg>
        </Button>
        <Button size="xs" square onClick={onPrev} disabled={isPrevDisabled()}>
          <svg
            class="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 320 512"
          >
            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
        </Button>
        <Button size="xs" square onClick={onNext} disabled={isNextDisabled()}>
          <svg
            class="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 320 512"
          >
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
          </svg>
        </Button>
        <Button size="xs" square onClick={onEnd} disabled={isNextDisabled()}>
          <svg
            class="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z" />
          </svg>
        </Button>
      </Row>

      <Row items="center" class="gap-2 p-1">
        Page{" "}
        <Input
          bordered
          class="w-[50px] placeholder:text-base input-without-arrows"
          size="xs"
          value={props.pagination.pageIndex + 1}
          type="number"
          onChange={(e) => onInputChange(e.currentTarget)}
        />{" "}
        of <b>{props.pageCount || 1}</b>
      </Row>

      <Select
        bordered
        size="xs"
        class="w-[70px]"
        value={props.pagination.pageSize}
        onInput={(e) => onPageSize(Number(e))}
      >
        <Option value={10}>10</Option>
        <Option value={50}>50</Option>
        <Option value={100}>100</Option>
      </Select>
    </Row>
  );
};
