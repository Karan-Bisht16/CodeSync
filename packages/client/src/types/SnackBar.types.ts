export type SnackBarData = {
    status: 'success' | 'info' | 'warning' | 'error',
    message: string,
};

export type SnackBarProps = {
    openSnackBar: boolean,
    handleClose: any,
    timeOut: number,
    snackBarData: SnackBarData,
    sx?: object,
};

export type SnackBarContextType = {
    snackBarState: boolean;
    snackBarData: SnackBarData;
    openSnackBar(data: SnackBarData): void,
    closeSnackBar(event: React.SyntheticEvent, reason: string): void,
};