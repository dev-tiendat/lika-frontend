import React from "react";
import ReactDOM from "react-dom";
import SvgIcon from "../SvgIcon";

interface ModalProps {
	isShowing: boolean;
	hide: () => void;
	children: React.ReactElement;
	title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isShowing, hide, children, title }) =>
	isShowing
		? ReactDOM.createPortal(
				<React.Fragment>
					<div className="modal-overlay" />
					<div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
						<div className="modal">
							<div className="flex flex-row justify-between items-center mb-2">
								<h3 className="text-lg font-medium">{title}</h3>
								<button className="flex justify-center items-center p-1" onClick={hide}>
									<SvgIcon name="x" size={22} />
								</button>
							</div>
							{children}
						</div>
					</div>
				</React.Fragment>,
				document.body
		  )
		: null;

export default Modal;
