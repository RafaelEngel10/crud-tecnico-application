import { useParams, useNavigate } from 'react-router-dom';
import { AlunosporPersonal } from '../components/read/AlunosporPersonal';
import { TreinosporAluno } from '../components/read/TreinosporAluno';

const list = {
    alunos: <AlunosporPersonal />,
    treinos: <TreinosporAluno />
}

export function Listar() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className='section-first-parent'> 
            <div className='section-parent'>
                <div className='form-section'>
                    <div className='new-child-div'>
                        <button className='form-button' onClick={() => navigate('/')}>←</button>
                    </div>
                    {list[id] || <p>Formulário não encontrado</p>}
                    <div className='new-child-div' />
                </div>
            </div>
        </div>
    );
}