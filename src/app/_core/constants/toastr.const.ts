import Swal from "sweetalert2";

export const ToasterMessages = {
    EXAMPLE: ["TOAST.EXAMPLE"],
}

export enum TOAST_TYPE {
    SUCCESS = "success",
    ERROR = "error",
    INFO = "info",
    WARNING = "warning",
}

export const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar:true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
