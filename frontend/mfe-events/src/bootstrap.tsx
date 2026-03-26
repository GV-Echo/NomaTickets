import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {StandaloneAuthProvider} from './providers/AuthProvider'
import EventsApp from './EventsApp'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <StandaloneAuthProvider>
                <EventsApp/>
            </StandaloneAuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
