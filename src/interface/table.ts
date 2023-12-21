export interface TableHeader {
	title?: string;
	sortKey?: string;
}

export interface IMenuItem {
	name: string;
	value: string;
}

export interface TableFilter {
	label: string;
	value: number;
}

export enum Order {
	ASC = "asc",
	DESC = "desc"
}

export interface PaginationGenericData<T> {
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	last: boolean;
	content: T[];
}
