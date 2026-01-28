import Home from '../pages/Home.jsx';
import Cadastrar from '../pages/Cadastrar.jsx';
import { Listar } from '../pages/Listar.jsx';
import Atualizar from '../pages/Atualizar.jsx';
import Excluir from '../pages/Excluir.jsx';

export const PublicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/cadastrar/:id', element: <Cadastrar /> },
  { path: '/listar/:id', element: <Listar />},
  { path: '/atualizar/:id', element: <Atualizar /> },
  { path: '/excluir/:id', element: <Excluir /> }
];