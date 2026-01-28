import { PersonalForm } from '../components/create/PersonalForm';
import { AlunoForm } from '../components/create/AlunoForm';
import { TreinoForm } from '../components/create/TreinoForm';
import { useNavigate, useParams } from 'react-router-dom';

const forms = {
  personal: <PersonalForm />,
  aluno: <AlunoForm />,
  treino: <TreinoForm />
};

export default function Cadastrar() {
    const navigate = useNavigate();
    const { id } = useParams(); 

    return (
        <div className='section-first-parent'> 
            <div className='section-parent'>
                <div className='form-section'>
                    <div className='new-child-div'>
                        <button className='form-button' onClick={() => navigate('/')}>←</button>
                    </div>
                    {forms[id] || <p>Formulário não encontrado</p>}
                    <div className='new-child-div' />
                </div>
            </div>
        </div>
    );
}
