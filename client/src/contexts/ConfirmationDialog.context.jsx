import { createContext, useState } from "react";

export const ConfirmationDialogContext = createContext();
export const ConfirmationDialogProvider = ({ children }) => {
    const [dialog, setDialog] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        title: "",
        message: "",
        cancelBtnText: "",
        submitBtnText: "",
        dialogId: null,
        rest: null,
    });
    const [linearProgressBar, setLinearProgressBar] = useState(false);
    async function openDialog(values) {
        await setDialogValue(values);
        await setDialog(true);
        document.querySelector("#focusPostBtn").focus();
    };
    function closeDialog() {
        setDialog(false);
        setLinearProgressBar(false)
    };

    const handleDialog = async () => {
        switch (dialogValue.dialogId) {
            case 1:
                setLinearProgressBar(true);
                const { navigate } = dialogValue.rest;
                navigate("/room");
                closeDialog();
                break;
            default:
                return null;
        }
    }

    return (
        <ConfirmationDialogContext.Provider value={{ dialog, dialogValue, openDialog, closeDialog, handleDialog, linearProgressBar, setLinearProgressBar }}>
            {children}
        </ConfirmationDialogContext.Provider>
    )
}