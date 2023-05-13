import React from 'react';
import '../../style/ColorModal.css';

type props = {
	handelClose: any;
}



const Modal = (props: any) => {
  return (
    <div className='modalgame' >
      <div className='global-popup-refus' >
        <h3>Sorry, you can't play right now</h3>
            <footer className='actions'>  
                <button className="btnn" onClick={props.handleClose}>Close</button>
            </footer>
      </div>
    </div>
    // ) : null;)
  );
};

export default Modal;