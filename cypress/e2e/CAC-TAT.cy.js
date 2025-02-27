describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach (() => {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', () => {   
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')

  })
  it('Preenche os campos obrigatórios e envia o formulário', () => {
    cy.clock()
    
    const longtext = Cypress._.repeat('Obrigado! Aprendendo testes automatizados com cypress... Aprendendo testes automatizados com cypress... ', 5)
    cy.get('#firstName').type('Patty')
    cy.get('#lastName').type('Dias')
    cy.get('#email').type('teste@teste.com')
    cy.get('#open-text-area').type(longtext, {delay:0})
    //cy.get('button[type="submit"]').click()
    cy.contains('button','Enviar').click()

    cy.get('.success').should('be.visible')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')

  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()

    cy.get('#firstName').type('Patty')
    cy.get('#lastName').type('Dias')
    cy.get('#email').type('teste@teste,com')
    cy.get('#open-text-area').type('teste')
    //cy.get('button[type="submit"]').click()
    cy.contains('button','Enviar').click()

    cy.get('.error').should('be.visible') //elemento com a classe .error
    
    cy.tick(3000)

    cy.get('.error').should('not.be.visible')

  })
  it('campo telefone continua vazio quando prencchido com um valor não numérico', () => {
    cy.get('#phone')
      .type('abcde')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()
    
    cy.get('#firstName').type('Patty')
    cy.get('#lastName').type('Dias')
    cy.get('#email').type('teste@teste,com')
    cy.get('#open-text-area').type('teste')
    cy.get('#phone-checkbox').check()
    //cy.get('button[type="submit"]').click()
    cy.contains('button','Enviar').click()

    cy.get('.error').should('be.visible') //verificação de resultado esperado

    cy.tick(3000)

    cy.get('.error').should('not.be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Patty')
      .should('have.value', 'Patty')
      .clear() //limpa o campo
      .should('have.value', '') //verifica se o campo está vazio
    cy.get('#lastName')
      .type('Dias')
      .should('have.value', 'Dias')
      .clear() 
      .should('have.value', '') 
    cy.get('#email')
      .type('teste@teste,com')
      .should('have.value', 'teste@teste,com')
      .clear() 
      .should('have.value', '') 
    cy.get('#phone')
      .type('044984427050')
      .should('have.value', '044984427050')
      .clear()
      .should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock()
    
    //cy.get('button[type="submit"]').click()
    cy.contains('button','Enviar').click() // qdo não tem uma forma de identificar o elemento unicamente, a não ser pelo texto

    cy.get('.error').should('be.visible')

    cy.tick(3000)

    cy.get('.error').should('not.be.visible')

  })
  
  //it('envia o formuário com sucesso usando um comando customizado 1', () => {
  //  cy.fillMandatoryFieldsAndSubmit()
  //  cy.get('.success').should('be.visible')
  //})
  
 // it.only('envia o formuário com sucesso usando um comando customizado 2', () => {
 //  const data = { //objeto
 //   firstName: 'Patty', //comandos customizados
  //  lastName: 'Dias',
   // email: 'teste@teste.com',
  //  text: 'Teste formulario',
   // }
   // cy.fillMandatoryFieldsAndSubmit(data)
  // cy.get('.success').should('be.visible')
//  })

    
  it('envia o formuário com sucesso usando um comando customizado 3', () => {
  
    cy.clock()

    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')

  })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product') // identificando o elemento pelo ID
    .select('YouTube') // Seleção pelo texto YouTube
    .should('have.value','youtube') //valor da option
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
    .select('mentoria')
    .should('have.value','mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
    .select(1)
    .should('have.value','blog' )
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
    .check()
    .should('be.checked')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .each(typeOfService => { //each = cada um dos elementos. O each recebe como argumento uma função
        cy.wrap(typeOfService) //typeofservice argumento da função de callback. o wrap está empacotando cada um dos tipos de atendimentos
        .check()
        .should('be.checked')
      })
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
    .check()
    .should('be.checked')
    .last()
    .uncheck()
    .should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
    .selectFile('cypress/fixtures/example.json')
    .should (input => {
      //console.log(input)
      expect(input[0].files[0].name).to.equal('example.json')
      //console.log(input[0].files[0].name)
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
    .selectFile('cypress/fixtures/example.json',{action:'drag-drop'}) //primeiro argumento = arquivo , segundo argumento objeto com a propriedade action 'drag-drop'
    .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      
      })  
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('arquivo1')
    cy.get('#file-upload')
    .selectFile('@arquivo1')
    .should(input => {
      expect(input[0].files[0].name).to.equal('example.json')
      //.should('be.visible')
    })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.contains('a','Política de Privacidade')
      .should('have.attr','href','privacy.html')
      .and('have.attr','target','_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.contains('a','Política de Privacidade')
    .invoke('removeAttr', 'target') //remove o target para abrir a pagina na mesma aba - removeattr
    .click()

    cy.contains('h1','CAC TAT - Política de Privacidade').should('be.visible')
  })

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche o campo da área de texto usando o comando .invoke()', () => {
    cy.get('#open-text-area')
    .invoke('val', 'um texto qualquer')
    .should('have.value', 'um texto qualquer')
  })

  it('faz uma requiisção HTTP' , () => {
    cy.request('https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html')
      .as('getRequest')
      .its('status')
      .should('be.equal', 200)
    cy.get('@getRequest')
      .its('statusText')
      .should('be.equal', 'OK')
    cy.get("@getRequest")
      .its('body')
      .should('include', 'CAC TAT')
  })
it('mostrar o gato fofo ', () => {
  cy.get('#cat')
  .invoke('show')
  .should('be.visible')
  cy.get('#title')
  .invoke('text', 'CAT TAT')
  cy.get('#subtitle')
  .invoke('text', 'I love Cats!')

})


})



