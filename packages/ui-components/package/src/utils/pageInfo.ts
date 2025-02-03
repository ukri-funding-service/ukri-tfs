export interface PageInfo {
    totalRecords: number;
    totalPages: number;
    page: number;
    pageSize: number;
    startRecord?: number;
    endRecord?: number;
}
