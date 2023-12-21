import { toast } from "react-toastify";

export enum ToastType {
	ERROR,
	WARNING,
	SUCCESS
}

export default function callToast(status: ToastType, message: string) {
	switch (status) {
		case ToastType.ERROR: {
			toast.error(message, {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined
			});
			break;
		}
		case ToastType.WARNING: {
			toast.warn(message, {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined
			});
			break;
		}
		case ToastType.SUCCESS: {
			toast.success(message, {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined
			});
			break;
		}
	}
}
