import React from 'react'
import { Header } from '../../../../../components/header'
import { AllUsersTaskList } from './_components/all-users-tasl-list'

function AllTasksPage() {
  return (
    <>
      <Header />
      <div className='mt-10 flex gap-4 over-flow-x-auto pb-20'>
        <AllUsersTaskList/>
      </div>
    </>
  )
}

export default AllTasksPage