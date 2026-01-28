import { useState } from 'react'
import { PersonalForm } from './create/PersonalForm';
import { AlunoForm } from './create/AlunoForm';
import { TreinoForm } from './create/TreinoForm';

export function Cadastros() {
    const [count, setCount] = useState(0)

    function handleClick(id, newId) {
        const doc = document.getElementById(id);
        doc.style.display = `none`;

        const newDoc = document.getElementById(newId);
        newDoc.style.display = `flex`;
        return;
    }
    return (
        <>
            <div id='main-section'>
                <div className='child-div'>
                    <h2>Cadastros</h2>
                    <div>
                    <button type='button' onClick={() => handleClick('main-section', 'form-section-personal')}>Adicionar novo personal</button>  
                    <button type='button' onClick={() => handleClick('main-section', 'form-section-aluno')}>Adicionar novo aluno</button>  
                    <button type='button' onClick={() => handleClick('main-section', 'form-section-treino')}>Adicionar novo treino e exercícios</button>  
                    </div>  
                </div>
            </div>

            <div className='form-section' id='form-section-personal' style={{ display: 'none' }}>
                <div className='new-child-div'>
                    <div>
                        <button className='form-button' onClick={() => handleClick('form-section-personal', 'main-section')}>←</button>
                    </div>
                    <div />
                </div>
                <div>
                    <PersonalForm />
                </div>
            </div>

            <div className='form-section' id='form-section-aluno' style={{ display: 'none' }}>]
                <div className='new-child-div'>
                    <div>
                    <button className='form-button' onClick={() => handleClick('form-section-aluno', 'main-section')}>←</button>
                    </div>
                    <div />
                </div>
                <div>
                    <AlunoForm />
                </div>
            </div>

            <div className='form-section' id='form-section-treino' style={{ display: 'none' }}>
                <div className='new-child-div'>
                    <div>
                    <button className='form-button' onClick={() => handleClick('form-section-treino', 'main-section')}>←</button>
                    </div>
                    <div />
                </div>
                <div>
                    <TreinoForm />
                </div>
            </div>
        </>
    )
}