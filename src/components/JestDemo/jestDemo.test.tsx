import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import JestDemo from '.'

let container: HTMLDivElement | null = null

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  if (container) {
    // cleanup on exiting
    unmountComponentAtNode(container)
    container.remove()
    container = null
  }
})

// it('renders correctly', () => {
//   act(() => {
//     render(<JestDemo />, container);
//   });

//   expect(container?.textContent).toBe('Hello World');
// });

it('renders user data', async () => {
  const fakeUser = {
    name: 'Joni Baez',
    age: '32',
  }

  const spiedFetch = jest.spyOn(global, 'fetch')

  spiedFetch.mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser),
    } as Response),
  )

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<JestDemo id="123" />, container)
  })

  console.log('container --', container?.innerHTML)

  expect(container?.querySelector('h1')?.textContent).toBe(fakeUser.name)
  expect(container?.querySelector('h2')?.textContent).toBe(fakeUser.age)

  // remove the mock to ensure tests are completely isolated
  spiedFetch.mockRestore()
})
