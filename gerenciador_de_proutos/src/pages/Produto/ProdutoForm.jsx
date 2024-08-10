import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaCheckCircle, FaQuestionCircle } from 'react-icons/fa'
import InputMask from 'react-input-mask'
import axios from '../../api'
import Modal from 'react-modal'

Modal.setAppElement('#root')

const ProdutoForm = () => {

  const [produto, setProduto] = useState({ nome: '', preco: '', descricao: '', quantidade: '' })
  const [tooltipAberto, setTooltipAberto] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id){
        // Se tiver id, busca os dados do produto para edição
      axios.get(`/produtos/${id}`).then(response => {
        setProduto(response.data)
      }).catch(error => console.error("Ocorreu um erro: ", error))
    }
  },[id])

  const toggleTooltip = () => {
    setTooltipAberto(!tooltipAberto)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (id) {
      // Se tiver id, então é edição
      axios.put(`/produtos/${id}`, produto).then(() => {
        setModalAberto(true)
      })
      .catch(error => console.error("Ocorreu um erro: ", error))
    } else {
      // Se não tem id, significa adicionar um novo produto
      axios.post(`/produtos`, produto).then(() => {
        setModalAberto(true)
      })
      .catch(error => console.error("Ocorreu um erro: ", error))
    }
  }

  const fecharModal = () => {
    setModalAberto(false)
    navigate("/listar-produtos")
  }

  const adicionarOutroProduto = () => {
    setModalAberto(false)
    setProduto({ nome: '', preco: '', descricao: '', quantidade: ''})
  }

  return (
    <div className="form-container" onSubmit={handleSubmit}> 
      <h2 style={{ position: 'relative' }}>
        {id ? 'Editar Produto' : 'Adicionar Produto'}
        {' '}
        <FaQuestionCircle 
          className="tooltip-icon"
          onClick={toggleTooltip}
        />
        {tooltipAberto && (
          <div className='tooltip'>
            {id ? 'Nesta tela, você pode editar as informações de um produto existente.' : 'Nesta tela, você pode adicionar um novo produto ao sistema.'}
          </div>
        )}
      </h2>

      <form className='produto-form'>
        <div className='form-group'>
          <label htmlFor='nome'>Nome do Produto</label>
          <input
            type='text'
            className='form-control'
            id='nome'
            value={produto.nome}
            onChange={e => setProduto({ ...produto, nome: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='preco'>Preço do Produto</label>
          <InputMask
            mask={"9999,99"}
            className='form-control'
            id='preco'
            name='preco'
            value={produto.preco}
            onChange={e => setProduto({ ...produto, preco: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='descricao'>Descrição do Produto</label>
          <input
            type='text'
            className='form-control'
            id='descricao'
            value={produto.descricao}
            onChange={e => setProduto({ ...produto, descricao: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='quantidade'>Quantidade em Estoque</label>
          <input
            type='number'
            className='form-control'
            id='quantidade'
            value={produto.quantidadeEstoque}
            onChange={e => setProduto({ ...produto, quantidadeEstoque: e.target.value })}
            required
          />
        </div>
        <button type='submit' className='btn-success'>
          {id ? 'Editar' : 'Adicionar'}
        </button>
      </form>

      <Modal
            isOpen={modalAberto}
            onRequestClose={fecharModal}
            className="modal"
            overlayClassName="overlay"
        >
        <div className="modalContent">
            <FaCheckCircle className="icon successIcon" />
            <h2>{id ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!'}</h2>

            <div className="modalButtons">
                <button onClick={fecharModal} className="btn-success">Fechar</button>
                {!id && <button onClick={adicionarOutroProduto} className="btn-secondary">Adicionar outro produto</button>}
            </div>
        </div>
        </Modal>
    </div>
  )
}

export default ProdutoForm
