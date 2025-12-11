import React from 'react'

export default function Header(){
  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Controle Financeiro</h1>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 bg-green-500 text-white rounded">Adicionar</button>
          <button className="px-3 py-1 bg-gray-200 rounded">Relatório</button>
        </div>
      </div>
    </header>
  )
}
