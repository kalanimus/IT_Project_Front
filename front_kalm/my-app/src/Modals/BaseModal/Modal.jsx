import React, { useEffect, useRef } from "react";
import classes from "./Modal.module.css";

const Modal = ({ children, onClose, disableClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (disableClose) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, disableClose]);

  const handleOverlayClick = (e) => {
    if (disableClose) return;
    if (modalRef.current && e.target === modalRef.current) onClose();
  };

  return (
    <div
      className={classes.modalOverlay}
      ref={modalRef}
      onClick={handleOverlayClick}
    >
      <div className={classes.modalContent}>
        {!disableClose && (
          <button className={classes.closeButton} onClick={onClose}>×</button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;