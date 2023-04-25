import React from "react";
import { Modal } from "@mui/material";

export default function JoinChannelModal(props: any) {
  const { openModal, setOpenModal } = props;

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="modal">
          <p>You need to join this channel to view messages.</p>
          <button onClick={handleCloseModal}>Close</button>
        </div>
      </Modal>
    </>
  );
}

