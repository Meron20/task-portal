import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import { TaskList } from '../task-list'

const mockTasks = [

    {
     id: '1',
     title:'Washing clothes',
     date: '2024-05-26',
    },

    {
     id: '2', 
     title: 'Go to gym ', 
     date: '2024-05-25',
     
    },

]

const mockHandleComplete = jest.fn()


describe('TaskList', () => {

    it ('should render "No tasks to show" when the array is empty', () => {
        render(<TaskList tasks={[]} accentColor='#f00' handleComplete={mockHandleComplete} />)
        const message = screen.getByText('No tasks to show')
        expect(message).toBeInTheDocument()

    })


    it('should render a list of tasks', async() => {
        render(<TaskList tasks={mockTasks} accentColor='#f00' handleComplete={mockHandleComplete }/>)


       const task1 = await screen.findByText('Washing clothes')
       const task2 = await screen.findByText('Go to gym')


        expect(task1).toBeInTheDocument()
        expect(task2).toBeInTheDocument()
    })
})