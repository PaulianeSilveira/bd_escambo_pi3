import prisma from '../database/client.js'

const controller = {}   // Objeto vazio

controller.create = async function(req, res) {
  try {

    // Conecta-se ao BD e envia uma instrução
    // de criação de um novo documento, com os
    // dados que estão dentro de req.body
    await prisma.usuario.create({data: req.body})

    // Envia uma resposta de sucesso ao front-end
    // HTTP 201: Created
    res.status(201).end()
  }
  catch(error) {
    // Deu errado: exibe o erro no console do back-end
    console.error(error)
    // Envia o erro ao front-end, com status 500
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.retrieveAll = async function(req, res) {

  // Por padrão, não inclui nenhum relacionamento
  const include = {}

  //Inclui a exibição não apenas dos dados da turma, mas também dos dados do professor e do curso
  if(req.query.produtoServico)   include.turmas = {include: {mensagens: true, trocas: true, avaliacoes: true}}

  try {
    // Manda buscar os dados no servidor
    const result = await prisma.usuario.findMany({
      include,
      orderBy: [
        { nome: 'asc' }  // Ordem ascendente
      ]
    })
    // HTTP 200: OK
    res.send(result)
  }
  catch(error) {
    // Deu errado: exibe o erro no console do back-end
    console.error(error)
    // Envia o erro ao front-end, com status 500
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.retrieveOne = async function(req, res) {
  try {
    const result = await prisma.usuario.findUnique({
      where: { id: req.params.id }
    })

    // Encontrou ~> retorna HTTP 200: OK
    if(result) res.send(result)
    // Não encontrou ~> retorna HTTP 404: Not found
    else res.status(404).end()
  }
  catch(error) {
    // Deu errado: exibe o erro no console do back-end
    console.error(error)
    // Envia o erro ao front-end, com status 500
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.update = async function(req, res) {

  try {
    const result = await prisma.usuario.update({
      where: { id: req.params.id },
      data: req.body
    })

    // Encontrou e atualizou ~> retorna HTTP 204: No content
    if(result) res.status(204).end()
    // Não encontrou (e não atualizou) ~> retorna HTTP 404: Not found
    else res.status(404).end()
  }
  catch(error) {
    // Deu errado: exibe o erro no console do back-end
    console.error(error)
    // Envia o erro ao front-end, com status 500
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.delete = async function(req, res) {
  try {
    const result = await prisma.usuario.delete({
      where: { id: req.params.id }
    })

    // Encontrou e excluiu ~> retorna HTTP 204: No content
    if(result) res.status(204).end()
    // Não encontrou (e não excluiu) ~> retorna HTTP 404: Not found
    else res.status(404).end()
  }
  catch(error) {
    // Deu errado: exibe o erro no console do back-end
    console.error(error)
    // Envia o erro ao front-end, com status 500
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.addTurma = async function(req, res) {
  try {
    
    // Busca o aluno para recuperar a lista de ids de turmas dele
    const aluno = await prisma.usuario.findUnique({
      where: { id: req.params.usuarioId }
    })

    // Se ele não tiver turmas ainda, criamos a lista vazia
    const produtoServicoIds = usuario.produtoServicoIds || []

    // Se o id de turma passado ainda não estiver na lista do
    // aluno, fazemos a respectiva inserção
    if(! produto_servicoIds.includes(req.params.produtoServicoId))
      produtoServicoIds.push(req.params.produtoServicoId)

    // Atualizamos o aluno com uma lista de ids de turma atualizada  
    const result = await prisma.usuario.update({
      where: { id: req.params.usuarioId },
      data: { produtoServicoIds }
    })

    // Encontrou e atualizou ~> retorna HTTP 204: No content
    if(result) res.status(204).end()
    // Não encontrou (e não atualizou) ~> retorna HTTP 404: Not found
    else res.status(404).end()

  }
  catch(error) {
    // Deu errado: exibe o erro no console do back-end
    console.error(error)
    // Envia o erro ao front-end, com status 500
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.removeProdutoServico = async function(req, res) {
  try {

    // Busca o aluno para recuperar a lista de ids de turmas dele
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.params.usuarioId }
    })

    // Não encontrou o aluno, ou o aluno não tem turmas
    // associadas a ele ~> HTTP 404: Not Found
    if(! usuario || ! usuario.produtoServicoIds) res.send(404).end()

    // Procura, na lista de ids de turma do aluno, se existe o id
    // de turma passado para remoção
    for(let i = 0; i < usuario.produtoServicoIds.length; i++) {
      // Encontrou
      if(usuario.produtoServicoIds[i] === req.params.produtoServicoId) {
        // Remove o id que foi passado da lista de ids de turma
        usuario.produtoServicoIds.splice(i, 1)

        // Faz a atualização no aluno, alterando o conteúdo de turmasId
        const result = await prisma.usuario.update({
          where: { id: req.params.usuarioId },
          data: { produtoServicoIds: usuario.produtoServicoIds }
        })

        // Encontrou e atualizou ~> retorna HTTP 204: No content
        if(result) return res.status(204).end()
        // Não encontrou (e não atualizou) ~> retorna HTTP 404: Not found
        else return res.status(404).end()
      
      }
    }

    // Se chegou até aqui, é porque não existe o id da turma passado
    // na lista de ids de turma do aluno ~> HTTP 404: Not found
    return res.status(404).end()    

  }
  catch(error) {
    // Deu errado: exibe o erro no console do back-end
    console.error(error)
    // Envia o erro ao front-end, com status 500
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

export default controller