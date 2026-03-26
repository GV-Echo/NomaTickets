import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {StandaloneAuthProvider} from './providers/AuthProvider'
import AdminApp from './AdminApp'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <StandaloneAuthProvider>
                <AdminApp/>
            </StandaloneAuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
