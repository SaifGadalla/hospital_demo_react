import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ThemeContextProvider from './ThemeContext.tsx'
import Layout from './components/layout.tsx'
import Home from './pages/home.tsx'
import Dashboard from './pages/dashboard.tsx'
import './index.css'
import Patients from './pages/patients.tsx'
import Appointments from './pages/appointments.tsx'
import MedicalRecords from './pages/medical-record.tsx'
import Pharmacy from './pages/pharmacy.tsx'
import Laboratory from './pages/laboratory.tsx'
import Inpatient from './pages/inpatient.tsx'
import Emergency from './pages/emergency.tsx'
import OperatingRoom from './pages/operating-room.tsx'
import Insurance from './pages/insurance.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18next from './i18n.ts'

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'patients',
        element: <Patients />
      },
      {
        path: 'appointments',
        element: <Appointments />
      },
      {
        path: 'medical-records',
        element: <MedicalRecords />
      },
      {
        path: 'pharmacy',
        element: <Pharmacy />
      },
      {
        path: 'laboratory',
        element: <Laboratory />
      },
      {
        path: 'inpatient',
        element: <Inpatient />
      },
      {
        path: 'emergency',
        element: <Emergency />
      },
      {
        path: 'operating-room',
        element: <OperatingRoom />
      },
      {
        path: 'insurance',
        element: <Insurance />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeContextProvider>
      <StrictMode>
        <I18nextProvider i18n={i18next}>
          <RouterProvider router={router} />
        </I18nextProvider>
      </StrictMode>
    </ThemeContextProvider>
  </QueryClientProvider>
)
