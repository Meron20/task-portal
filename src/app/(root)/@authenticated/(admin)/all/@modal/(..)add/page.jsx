import React from 'react'
import { Modal } from './_components/modal'
import {  AddTaskForm } from '../../../add/_components/add-task-form'


function AddFormModalPage () {

  return (
    
       <Modal>
         <AddTaskForm isModal/>
       </Modal>
  )
}

export default AddFormModalPage