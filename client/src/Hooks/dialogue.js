import { confirmDialog } from "primereact/confirmdialog";
import { useCallback } from "react";

export default function useDialogue() {
    const popDialogue = useCallback(function (message = '', header = '', icon = '', defaultFocus = 'reject', acceptClassName = 'p-button-danger') {
        return new Promise((resolve, reject) => {
            const accept = () => resolve(true);
            const rejection = () => resolve(false);
            confirmDialog({
                message,
                header,
                icon,
                defaultFocus,
                acceptClassName,
                accept,
                reject: rejection
            });
        });
    }, []);

    return { popDialogue };
};