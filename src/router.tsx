import { createBrowserRouter } from 'react-router-dom'
import { BootstrapRoute } from './features/bootstrap/BootstrapRoute'
import { OnboardingPage } from './features/onboarding/OnboardingPage'
import { AppLayout } from './features/layout/AppLayout'
import { Painel } from './features/painel/Painel'
import { Search } from './features/busca/Search'
import { BenefitDetail } from './features/detalhe/BenefitDetail'
import { Perfil } from './features/perfil/Perfil'

export const router = createBrowserRouter([
  { path: '/', element: <BootstrapRoute /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: '/painel', element: <Painel /> },
      { path: '/buscar', element: <Search /> },
      { path: '/perfil', element: <Perfil /> },
    ],
  },
  { path: '/beneficio/:id', element: <BenefitDetail /> },
])
