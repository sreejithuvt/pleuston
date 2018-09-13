import React from 'react'
import ReactDOM from 'react-dom'

import Modal from './Modal'

it('Modal renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
        <Modal
            contentLabel="modal"
            title="I'm a modal"
            handleCloseModal={() => null}
        >
            Hello
        </Modal>,
        div
    )
    ReactDOM.unmountComponentAtNode(div)
})
