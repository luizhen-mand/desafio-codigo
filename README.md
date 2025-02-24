# 🚀 **Desafio - Código**
Desafio Fullstack

📝 Sobre
Trabalhei para trazer as tasks do banco para o frontend.

⚙️ Instalação
Para rodar o projeto localmente, siga os passos abaixo:

1. Clone o repositório
bash
Copiar
Editar
git clone git@github.com:luizhen-mand/desafio-codigo.git

3. Instale as dependências
Execute o comando abaixo para instalar as dependências do projeto:
bash
Copiar
Editar
npm install

3. Rode o backend no docker
`docker compose up -d --build`
Garanta que o backend esteja rodando no Docker para que a aplicação funcione corretamente.
`docker compose logs -f`

5. Rode o frontend
Execute o comando abaixo para iniciar o frontend:

bash
Copiar
Editar
npm run dev

OBS: caso der permissão negada, rode o comando `sudo chown -R $USER:$USER /home/luiz/Downloads/mandatask-challenge-main/webapp/.next`

🛠️ Melhorias Implementadas
Aqui estão as melhorias feitas para garantir que o sistema funcione corretamente:

1. Criação da .env
Copiei a .env-example da API para configurar corretamente as variáveis de ambiente.

2. Ajuste no mapeamento da porta
A porta do backend foi mapeada de 3003:3001 no Docker, mas o main.ts estava usando a porta 3000. Realizei o ajuste para a porta 3001.

3. Uso do useRouter para navegação
Em vez de usar window.location para redirecionar para a página de tasks após login, que fazia a página recarregar e apagava o token do localStorage, agora uso useRouter do Next.js para evitar o reload automático da página, preservando o token de acesso.

4. Problema de login corrigido
A lógica de validação da senha no backend estava incorreta, o que fazia com que um erro fosse gerado mesmo quando a senha estava correta. Ajustei a comparação da senha para garantir que o comportamento fosse correto.

6. Exclusão de importações desnecessárias
Removi importações do UseGuards e AuthGuard, que estavam bloqueando minhas requisições para as tasks. O middleware já estava realizando a verificação de autorização corretamente.

7. Adição do next() no middleware
Adicionei a chamada next() no middleware para garantir que o fluxo da requisição continuasse após a verificação de autenticação.

8. Cada usuário vê suas próprias tasks
Ajustei a função get para que ela busque apenas as tasks do usuário que está fazendo a requisição, evitando que os usuários visualizem tasks de outros.

9. Correção na edição de tarefas
Quando a edição de uma task era realizada, o frontend não estava atualizando a task correta, pois o id da task não era passado na requisição. Agora, a tarefa certa é atualizada e o statusCode é retornado corretamente após a atualização.

10. Correção no comportamento de criação de tarefas
Após criar uma tarefa, ela só aparecia na interface após atualizar a página. Agora, a função fetchTasks() é chamada imediatamente após a criação da nova tarefa, garantindo que ela seja exibida sem necessidade de atualizar a página.

11. Correção nas tasks "concluídas"
As tasks marcadas como "concluídas" estavam desaparecendo da interface sem que o usuário soubesse se estavam sendo salvas corretamente. Confirmei no banco, as tarefas concluídas estão sendo salvas sim, porém na tela elas não aparecem mais. Deixei como está, já que na minha visão não faz muito sentido ter várias tarefas concluídas na tela, apenas tomar cuidado pra limpar o banco sempre que possível já que se não fizer isso pode haver um número muito grande de tarefas concluídas nele

13. Validação ao criar tarefas
Foi implementada uma validação para garantir que os usuários não possam criar tarefas sem descrição ou data. Se algum campo estiver vazio, a requisição não é enviada e o usuário recebe um alerta.


