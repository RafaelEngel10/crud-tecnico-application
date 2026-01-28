import { useState } from 'react'
import { Cadastros } from './components/Cadastro';
import { Overview } from './components/Overview';

export default function App() {
  return (
    <>
      <main>
        <section>
          <div className='section-parent'>
            <div className='div-parent'>
              <Cadastros />
            </div>
          </div>

          <div className='section-parent'>
            <div className='div-parent'>
              <Overview />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}