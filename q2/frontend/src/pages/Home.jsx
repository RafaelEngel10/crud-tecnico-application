import { Atualizacao } from '../components/Atualizacao';
import { Cadastros } from '../components/Cadastro';
import { Exclusao } from '../components/Exclusao';
import { Overview } from '../components/Overview';
import Excluir from './Excluir';

export default function Home() {
    return (
      <>
        <main>
          <section className='first-section'>
            <div>
              <h1>Body Building Academia</h1> <br />
            </div>
            <div className='main-section'> 
              <div className='section-parent' id='section-parent-1'>
                <div className='div-parent'>
                  <Overview />
                </div>
              </div>

              <div className='section-parent' id='section-parent-2'>
                <div className='div-parent'>
                  <Cadastros />
                </div>
              </div>

              <div className='section-parent' id='section-parent-3'>
                <div className='div-parent'>
                  <Atualizacao />
                </div>
              </div>

              <div className='section-parent' id='section-parent-4'>
                <div className='div-parent'>
                  <Exclusao />
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    )
}