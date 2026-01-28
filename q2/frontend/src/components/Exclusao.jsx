import { useNavigate } from 'react-router-dom';

export function Exclusao() {
    const navigate = useNavigate();

    return (
        <>
            <div id='main-section'>
                <div className='child-div'>
                    <h2>Exclusões</h2>
                    <div style={{ gap: '10px' }}>
                        <button type='button' onClick={() => navigate('/excluir/aluno')}>Desligar aluno</button>  
                        <button type='button' onClick={() => navigate('/excluir/treino')}>Excluir treinos ou exercícios</button>   
                    </div>  
                </div>
            </div>
        </>
    );
}