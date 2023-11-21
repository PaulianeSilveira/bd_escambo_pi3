import prisma from '../database/client.js'

const controller = {}   // Objeto vazio

controller.create = async function(req, res) {
  try {
    // Conecta-se ao BD e envia uma instrução
    // de criação de um novo documento, com os
    // dados que estão dentro de req.body
    await prisma.produtoServico.create({data: req.body})

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
  try {

    // Por padrão, não inclui nenhum relacionamento
    const include = {}

    if(req.query.trocas)   include.trocas= true
    if(req.query.mensagens)       include.mensagens = true
    if(req.query.usuario)      include.usuario = true

    // Manda buscar os dados no servidor
    const result = await prisma.turma.findMany({
      // Traz as informações das coleções relacionadas
      include,
      orderBy: [
        { diaSemana: 'asc' },  // Ordem ascendente
        { horaInicial: 'asc' }  // Ordem ascendente
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
    const result = await prisma.produtoServico.findUnique({
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
    const result = await prisma.produtoServico.update({
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
    const result = await prisma.produtoServico.delete({
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

controller.addAluno = async function(req, res) {
  try {
    
    // Busca a turma para recuperar a lista de ids de alunos dele
    const turma = await prisma.produtoServico.findUnique({
      where: { id: req.params.produtoServicoId }
    })

    // Se ele não tiver alunos ainda, criamos a lista vazia
    const usuarioIds = turma.produtoServicoIds || []

    // Se o id de aluno passado ainda não estiver na lista da
    // turma, fazemos a respectiva inserção
    if(! usuarioIds.includes(req.params.usuarioId))
      usuarioIds.push(req.params.usuarioId)

    // Atualizamos a turma com uma lista de ids de aluno atualizada  
    const result = await prisma.produtoServico.update({
      where: { id: req.params.produtoServicoId },
      data: { usuarioIds }
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

controller.removeUsuario = async function(req, res) {
  try {

    // Busca a turma para recuperar a lista de ids de alunos dela
    const turma = await prisma.produtoServico.findUnique({
      where: { id: req.params.produtoServicoId }
    })

    // Não encontrou a turma, ou a turma não tem alunos
    // associados a ele ~> HTTP 404: Not Found
    if(! produtoServico || ! produtoServico.usuarioIds) res.send(404).end()

    // Procura, na lista de ids de aluno da turma, se existe o id
    // de aluno passado para remoção
    for(let i = 0; i < produtoServico.usuarioIds.length; i++) {
      // Encontrou
      if(produtoServico.usuarioIds[i] === req.params.usuarioId) {
        // Remove o id que foi passado da lista de ids de alunos
        turma.usuarioIds.splice(i, 1)

        // Faz a atualização na turma, alterando o conteúdo de alunoIds
        const result = await prisma.produtoServico.update({
          where: { id: req.params.produtoServicoId },
          data: { usuarioIds: produtoServico.usuarioIds }
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