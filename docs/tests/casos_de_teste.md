# Documento de Casos de Teste - Velô Sprint (Configurador de Veículo Elétrico)

## Informações do Sistema
**Nome:** Velô Sprint - Configurador de Veículo Elétrico
**Perfís Testados:** Cliente (Usuário Comum)
**Foco:** Testes Funcionais Cobrindo Fluxos Positivos e Negativos.

---

## Módulo: Landing Page

---

### CT01 - Acessar o Configurador a partir da Landing Page

#### Objetivo
Validar se o usuário consegue acessar o módulo principal de configuração de veículo a partir da página de apresentação inicial do sistema (Landing Page).

#### Pré-Condições
- O sistema corporativo deve estar acessível (frontend via web browser).
- A API Backend/Supabase operando interações online.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar a URL principal da aplicação web (`/`). | A Landing Page é carregada corretamente com elementos visuais da vitrine. |
| 2  | Clicar no botão principal de ação do site (ex: "Configurar seu Velô", ou "Comprar Agóra"). | A aplicação SPA roteia imediatamente para a página do Configurador (`/configure`). |

#### Resultados Esperados
- O usuário deve ser redirecionado para a interface do Configurador com o visualizador 3D/stage de apresentação inicializado e painéis laterais prontos e com valores resetados (base).

#### Critérios de Aceitação
- O path do navegador deve mudar para a rota de configuração sem recarregamento ou erros da tela.

---

## Módulo: Configurador de Veículo

---

### CT02 - Verificação da Precificação do Modelo Base e Rodas Alternativas

#### Objetivo
Validar que a escolha de rodas influencia no valor de base de acordo com as regras de negócio de precificação definidas.

#### Pré-Condições
- O usuário deve estar na página de Configurador (`/configure`).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Observar o painel visualizando o carro com o pacote padrão selecionado. | O valor total exibido no sumário computa apenas o valor base exigido do automóvel de R$ 40.000,00. |
| 2  | Localizar o slider ou botões das Rodas (Wheel Type) e escolher a versão alternativa (Sport). | O sumário e painéis totalizam um aumento de R$ 2.000, calculando o Total em R$ 42.000,00. |
| 3  | Reativar/selecionar novamente o tipo da roda padrão ("Aero"). | O somatório recalcula em tempo real estornando o valor e demonstrando os R$ 40.000,00. |

#### Resultados Esperados
- A modificação entre tipo de rodas "Aero" e "Sport" insere uma readequação sistêmica do `totalPrice` no Store de React sem quebras contábeis.

#### Critérios de Aceitação
- As rodas tipo Sport adicionarão extamente R$ 2.000 ao preço do carro.

---

### CT03 - Adição Dinâmica de Suprimentos Premium e Submissão ao Checkout

#### Objetivo
Certificar que a adição unitária e sucessiva de pacotes opcionais refletem adequadamente no fechamento do carrinho indo ao painel do Pedido.

#### Pré-Condições
- O usuário deve estar na tela do Configurador.
- Rodas selecionadas na opção padrão por simplificação. (Preço provisório: R$ 40.000).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar a listinha de Adicionais e marcar o checkbox vinculado a "Precision Park". | O valor de R$ 5.500,00 é somatizado visualmente ao Subtotal (Total exibido: R$ 45.500,00). |
| 2  | Marcar adicionalmente o checkbox rotulado "Flux Capacitor". | Mais R$ 5.000,00 será adicionado ao Subtotal (Total visível: R$ 50.500,00). |
| 3  | Pressionar o botão de continuidade como "Avançar" ou "Finalizar Pedido" / "Continuar para Checkout". | O usuário avança as fases, conduzido fluidamente para o ambiente de faturamento (`/order`). |
| 4  | Validar o painel de "Resumo" da barra lateral do Checkout. | Os itens constam selecionados e ativados graficamente, atestando o Total Final de R$ 50.500,00 mantido via state da aplicação. |

#### Resultados Esperados
- Múltiplos Opcionais podem interagir sem substituição limitante, empilhando e somando os R$ 5.500 e R$ 5.000.

#### Critérios de Aceitação
- Componentes de opcionais selecionados alteram o valor e migram para o context provider a fim de estar coerente na listagem contábil de pagamento.

---

## Módulo: Checkout/Pedido

---

### CT04 - Validação de Preenchimentos Obrigatórios (Tentativa Inválidos/Incompletos)

#### Objetivo
Garantir que a regra de trava transacional previna a submissão ao backend de um pedido sem os campos mínimos qualificados.

#### Pré-Condições
- Acessar a rota de encerramento do Pedido (`/order`).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Não preencher nenhum dos inputs textuais previstos. Manter desmarcado todos os checkbox. | O formulário permenece intocado. |
| 2  | Clicar no botão primário da página "Confirmar Pedido". | O sistema trava a submissão e pinta de vermelho as respectivas linhas de inputs (ex: Nome, Sobrenome, E-Mail, Telefone, CPF e select da Loja), apresentando indícios em label de texto explicativo (ex: `Email inválido` ou obrigatoriedades). |
| 3  | Digitar no input de "Nome" o caractere parcial "A", preencher e-mail invalido ("user@.c") e CPF falho de estrutura ("000"). Clicar novamente no submit. | A trava persiste em todos os insumos mal-formatados ou incompletos (`Nome deve ter pelo menos 2 caracteres`, `Telefone inválido`, `Email inválido`, `Aceite os termos`, etc). |
| 4  | Aceitar os Termos e preencher todos os demais com tipagens validas, concluíndo o submit. | O pedido libera o submit passando do state-check. |

#### Resultados Esperados
- O pedido não é criado, nem sequer enviado em network payload, durante preenchimento deficiente.

#### Critérios de Aceitação
- As mensagens textuais de invalidades devem aparecer de forma imediata (e bloqueante). As proteções para CPF com mínima de 14 formatações embutidas e termos de aceites obrigatórios, todas operantes.

---

### CT05 - Submissão e Finalização na Modalidade À Vista (Fluxo Feliz)

#### Objetivo
Validação de operação limpa de juros e submissão pura de checkout à base de dados.

#### Pré-Condições
- Estar na página de Checkout (`/order`); O state do Order marca R$ 40.000 calculados sem opcionais de add-on.
- Todos dados pessoais já preenchidos.
- Sistema apto ao cadastro.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Encontrar a seleção de "Forma de Pagamento" e atestar o checkbox/botão card "À Vista". | O card "À Vista" ficará em destaque. Subtotal inalterado: R$ 40.000,00. |
| 2  | Pressionar "Confirmar Pedido". | Uma mensagem transitoria exibe Loader e o sistema encaminha a persistência do banco e aprova automativamente o registro. |
| 3  | Observar a tela posterior ao loader. | Interface confirma sucesso e projeta tela nativa de Sucesso/Confirmação (`/success`), com o status protocolado apontado. |

#### Resultados Esperados
- Operação realizada localmente sem requisições de Edge function ligada à Analise de Crédito (restrita de score).

#### Critérios de Aceitação
- A navegação chega à success sem juros agregados sob precificação e a fatura não reportará valores em financiamento. Status gravado é `APROVADO`.

---

## Módulo: Análise de Crédito Automática

---

### CT06 - Consulta de Cliente em Financiamento Direcionado - Score Aprovado (> 700)

#### Objetivo
Atestar processo integrador do cálculo de scoring validando o threshold de aprovação alto.

#### Pré-Condições
- Na página de Checkout preenchido integralmente.
- O botão seletor de Pagamento como "Financiamento".
- Preencher "Valor da Entrada" com quantia em Zero (`0,00`).
- Usar Mock da documentação/CPF que garanta score de tráfego superior a 701 (Ex: 850).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Visualizar demonstração parcelada. | Painel exibe 12x financiamento com custo juros 2% (taxados do montante a dividir). |
| 2  | Acionar "Confirmar Pedido". | Ocorrerá processamento backend à Edge Function `credit-analysis`. |
| 3  | Aguardar fluxo e verificação de rota. | A API devolve o `score` (850) onde, após avaliação, libera a bandeira de `APROVADO`, subindo a rotação de success page. |

#### Resultados Esperados
- O sistema submete o valor computado das faturas ao serviço base, e valida por aprovação devida o tráfego regular na compra de R$ 40k.

#### Critérios de Aceitação
- A regra de `> 700` deve obrigatoriamente render os valores completos do parcelamento junto as propriedades do carrinho na nova compra `APROVADA`.

---

### CT07 - Intermediação da Cota Analisada - Score Médio (501 a 700)

#### Objetivo
Encontrar o escoamento gerencial de análise estipulada para margens entre 501 a 700, mantendo resguardo transacional do pedido.

#### Pré-Condições
- Escolher Financiamento. Aportar entrada estipulada abaixo do cutoff (ex: Entrada 0).
- Dados do Mock/CPF alocados a devolver em trâmite na network o score ficticio correspondendo 600.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acionar "Confirmar Pedido". | Solicita credibilidade avalizada do individuo de CPF estipulado com API externa. |
| 2  | Validação Pós-Response. | O Order é salvo pela supabase para não perca, porém carimbado devidamente sob estado `EM_ANALISE`. Usuário verá esse status no resumo (`/success`). |

#### Resultados Esperados
- Nenhuma barragem de erro deve ocorrer ao final da requisição, porem o status de registro constata restrições transitórias à aquisição do carro.

#### Critérios de Aceitação
- Status imposto no banco é o log stringificado de `"EM_ANALISE"`.

---

### CT08 - Reprovação por Scoring Negativo Constatado - Score Reprovado (<= 500)

#### Objetivo
Provar que o Score classificado em faixas restritas acarreta encerramento compulsório sem fechamento aprovado da operação veicular.

#### Pré-Condições
- Informações base válidas para simulação transacional de Financiamento. Total Entrada como nulo (ou pequena quantía).
- Utilizar Mock em Edge Function acionando score de valor como de `400` pontos.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Fechar Submissão. | API processa nota 400. |
| 2  | Conclusivo na aplicação do Check out. | O pedido salva status `REPROVADO`. O success confirmará a rejeição em texto e protocolo formatados. |

#### Resultados Esperados
- A plataforma não trava exceção, mas persiste e avisa ao portador por flag da indisponibilidade fínanceira à aquisição do objeto (a não-liberação das chaves sem o saldo/título à vista).

#### Critérios de Aceitação
- Pedido com flag explícita repassada. Score <= 500 barra operação de crédito.

---

### CT09 - Exceção Regulamentar em Análise com Score Baixo - Entrada >= 50% Especializada

#### Objetivo
Confirmar fluxo de aprovação por força de contrato perante entrada equivalente à maioria absoluta dos custos veículares que anulam o rigor de seu score.

#### Pré-Condições
- Sistema do order indicando modelo Base com parcelamento estipulado Total de exatos: `R$ 40.000` finais ao veículo da vez.
- Reger CPF emulando SCORE extremamente crítico, por volta de 450.
- Forma de "Financiamento" listado.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Inserir como Entrada na barra do valor text: `20000` (Quantia >= 50% dos parcos 40.000). | O form engoles as atualizações e deduz 50% nos painéis do summary financiado de 12x. |
| 2  | Submeter e iniciar API. | Network é interpelada. Score devolve "450". |
| 3  | Passagem de verificação sistemática. | A condição inicial `SE entrada% >= 0.5 && score < 700` reage de forma `TRUE` e sobrescreve o fluxo manual, permitindo e garantindo `status: APROVADO`. |

#### Resultados Esperados
- Pedidos do tipo com grande capital imediato passam para Aprovado direto como atalhos funcionais contornando o modelo restrito em pontuações Serasa normais.

#### Critérios de Aceitação
- Pedido processado sob bypass de score por taxa de porcentagem, status `APROVADO`.

---

## Módulo: Consulta de Pedidos

---

### CT10 - Consulta por Identificador Cadastrado (Fluxo de Recuperação e Restauro)

#### Objetivo
Garantir o reuso de histórico pela chave ID correta perante banco de verificação, garantindo acompanhamento do usuário sem barreiras sistêmicas nem falha em leitura.

#### Pré-Condições
- Acessar `/look-up` da aplicação respectiva "Consulta de Pedidos".
- Possuir um ID `order_number` devidamente salvo (ex: após realizar um workflow de Compra do CT05).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acionar Input "Número do Pedido" e entrar com o registro id (ex. `VLO-XXX`). | Preenchimento limpo e destrave do botão principal da submissão. |
| 2  | Acionar `Buscar Pedido`. | Aparece a confirmação "Buscando...". |
| 3  | Esperar repasse do Callback. | Visualização das cards referentes ao status obtido e detalhes da configuração e do usuário restauro à indexação do Order (Ex. Cor do carro, montantes de pagamentos fixos). |

#### Resultados Esperados
- O pedido renderiza de volta seus status, configurações exclusivas anexadas a suas propriedades do schema original sem vazar os dados abertos não solicitados de terceiros, limitados a exata requisição do `orderId`.

#### Critérios de Aceitação
- Renderização visual correta de cards e labels indicando dados e datas da operação protocolar. Status legível (Aprovado, Em analise ou reprovado).

---

### CT11 - Consulta Inexistente - Restrição Negative Path

#### Objetivo
Verificar mitigadores previstos contra pesquisas incorretas ou maliciózas no campo público.

#### Pré-Condições
- Estar na Consulta de Pedidos aberta.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Introduzir um número inventado no ID (ex: `ERRO-40410X`) | Botão destrava. |
| 2  | Acionar Submit. | Confecciona acesso negado e não restringe painéis globais sob encerramentos. |
| 3  | Verificar Display de retorno na UI. | Rejeita tela base revelando Card Destructive com informações "Pedido não encontrado" + "Verifique o número do pedido e tente novamente". |

#### Resultados Esperados
- UI previne colapso gráfico em requisições de Order não resolvidas (em queries Vazias na DB Supabase) mantendo a tela tolerante da busca isolada.

#### Critérios de Aceitação
- Indício visual de Falha no Tracking deve estar visível e em compliance se não houver registros.
