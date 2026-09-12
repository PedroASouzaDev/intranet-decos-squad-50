import { Navigate, Route, Routes } from 'react-router-dom'
import PaginaCalendario from './features/calendario/components/PaginaCalendario'
import PaginaDocumentos from './features/documentos/components/PaginaDocumentos'
import PaginaDuvidas from './features/duvidas/components/PaginaDuvidas'
import PaginaLogs from './features/logs/components/PaginaLogs'
import PaginaMural from './features/murais/components/PaginaMural'
import PaginaSetores from './features/setores/components/PaginaSetores'
import PaginaUsuarios from './features/usuarios/components/PaginaUsuarios'
import PaginaLogin from './lib/auth/PaginaLogin'
import RotaProtegida from './lib/auth/RotaProtegida'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mural" replace />} />
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/nao-autorizado" element={<div>Acesso não autorizado</div>} />
      <Route
        path="/mural"
        element={
          <RotaProtegida>
            <PaginaMural />
          </RotaProtegida>
        }
      />
      <Route
        path="/calendario"
        element={
          <RotaProtegida>
            <PaginaCalendario />
          </RotaProtegida>
        }
      />
      <Route
        path="/documentos"
        element={
          <RotaProtegida>
            <PaginaDocumentos />
          </RotaProtegida>
        }
      />
      <Route
        path="/duvidas"
        element={
          <RotaProtegida>
            <PaginaDuvidas />
          </RotaProtegida>
        }
      />
      <Route
        path="/setores"
        element={
          <RotaProtegida>
            <PaginaSetores />
          </RotaProtegida>
        }
      />
      <Route
        path="/usuarios"
        element={
          <RotaProtegida papeisPermitidos={['superadmin']}>
            <PaginaUsuarios />
          </RotaProtegida>
        }
      />
      <Route
        path="/logs"
        element={
          <RotaProtegida papeisPermitidos={['superadmin']}>
            <PaginaLogs />
          </RotaProtegida>
        }
      />
    </Routes>
  )
}

export default App
