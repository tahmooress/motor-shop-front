
import {CModal, CModalHeader, CModalTitle, CModalBody, CButton, CModalFooter} from '@coreui/react';
import React, {useState} from "react";


// class Modal extends React.Component {
//     constructor(props){
//         super(props)
//         this.state = {
//             show : "true"
//         }
//     }
//     close = () => {
//         this.setState({
//             show : "false"
//         })
//     }
//     render() {
//         console.log(this.state)
//         return (
//             <>
//               <CModal visible= {this.state.show}>
//                 <CModalHeader >
//                   <CModalTitle>Modal title</CModalTitle>
//                 </CModalHeader>
//                 <CModalBody>
//                   I will not close if you click outside me. Don't even try to press
//                   escape key.
//                 </CModalBody>
//                 <CModalFooter>
//                   <CButton color="secondary" onClick={() => this.close()}>
//                     Close
//                   </CButton>
//                 </CModalFooter>
//               </CModal>
//             </>
//           )
//     }

//   }
const Modal = () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <CButton onClick={() => setVisible(!visible)}>
          Launch demo modal
        </CButton>
        <CModal visible={visible} onDismiss={() => setVisible(false)}>
          <CModalHeader onDismiss={() => setVisible(false)}>
            <CModalTitle>Modal title</CModalTitle>
          </CModalHeader>
          <CModalBody>Woohoo, you're reading this text in a modal!</CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary">Save changes</CButton>
          </CModalFooter>
        </CModal>
      </>
    )
  }
  export default Modal;