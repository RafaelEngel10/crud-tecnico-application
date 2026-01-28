import { useNavigate, useParams } from 'react-router-dom';
import { ExcluirAluno } from '../components/delete/ExcluirAluno';
import { ExcluirTreinoExercicio } from '../components/delete/ExcluirTreinoOUExercicio';

const forms = {
  aluno: <ExcluirAluno />,
  treino: <ExcluirTreinoExercicio />
};

export default function Excluir() {
    const navigate = useNavigate();
    const { id } = useParams(); 

    return (
        <div className='section-first-parent'> 
            <div className='section-second-parent'>    
                <div className='section-parent form-parent'>
                    <div className='form-section'>
                        <div className='new-child-div'>
                            <button className='form-button' onClick={() => navigate('/')}>←</button>
                        </div>
                        {forms[id] || <p>Formulário não encontrado</p>}
                        <div className='new-child-div' />
                    </div>
                </div>
            </div>
        </div>
    );
}