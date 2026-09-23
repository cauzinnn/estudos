# Registro de Progresso — intelcomp: Algoritmos de Busca

Documento de acompanhamento contínuo da disciplina **intelcomp**, orientado ao aprendizado ativo e pelo erro para o domínio completo de algoritmos de busca clássicos e heurísticos.

---

## 🎯 Status da Disciplina
- **Módulo Atual:** Todos os Módulos Concluídos e Disponíveis!
- **Lições Disponíveis:** 10 de 10 (Trilha Completa)
- **Fichas de Referência Disponíveis:** 2 de 2 (Buscas Cegas + Buscas Heurísticas)
- **Metodologia:** Teoria concisa (< 5 min), exercícios diagnósticos imediatos, rastreamento de mesa e persistência de tropeços conceituais.

---

## 📚 Trilha Completa de Conteúdo

### Módulo 1: Buscas Não Informadas (Cegas)
1. **0001 - Busca em Largura (BFS)** (`lessons/0001-busca-em-largura-bfs.html`) — ✅ **Disponível**
   - *Conceitos:* Ondas concêntricas, Fila FIFO, teste de meta na geração, complexidades $O(b^d)$ tempo e espaço.
2. **0002 - Busca em Profundidade (DFS)** (`lessons/0002-busca-em-profundidade-dfs.html`) — ✅ **Disponível**
   - *Conceitos:* Pilha LIFO, mergulho vertical, memória linear $O(b \cdot m)$, armadilha do desempate alfabético invertido no empilhamento, incompletude em árvores com ciclos.
3. **0003 - Busca com Retrocesso (Backtracking Search)** (`lessons/0003-busca-com-retrocesso-backtracking.html`) — ✅ **Disponível**
   - *Conceitos:* Geração de 1 filho por vez sob demanda, consumo estrito de memória linear $O(m)$, detecção de becos sem saída e descarte no retorno.
4. **0004 - DLS com Limite de Profundidade 6 (Depth-Limited Search)** (`lessons/0004-busca-profundidade-limite-6-dls.html`) — ✅ **Disponível**
   - *Conceitos:* Corte em profundidade $L=6$, os 3 retornos (Solução, Falha Definitiva e Cutoff).
5. **0005 - Aprofundamento Iterativo com 4 Iterações (IDS)** (`lessons/0005-aprofundamento-iterativo-4-iteracoes-ids.html`) — ✅ **Disponível**
   - *Conceitos:* Execução em camadas incrementais ($L=0, 1, 2, 3$), unindo a otimalidade da BFS com o espaço da DFS.
6. **0006 - Busca de Custo Uniforme / Busca Ordenada (UCS)** (`lessons/0006-busca-custo-uniforme-ucs.html`) — ✅ **Disponível**
   - *Conceitos:* Fila de prioridades por $g(n)$, teste de meta na retirada, completude e otimalidade para custos arbitrários.

### Módulo 2: Buscas Informadas (Heurísticas)
7. **0007 - Busca Irrevogável (Hill Climbing / Irrevocable Search)** (`lessons/0007-busca-irrevogavel-hill-climbing.html`) — ✅ **Disponível**
   - *Conceitos:* Busca local míope, memória $O(1)$, máximos locais, platôs e cumes.
8. **0008 - Busca Gulosa (Greedy Best-First Search)** (`lessons/0008-busca-gulosa-greedy.html`) — ✅ **Disponível**
   - *Conceitos:* $f(n) = h(n)$, fila de prioridade heurística, riscos de caminhos subótimos longos.
9. **0009 - Algoritmo de Busca A\* (A-Star Search)** (`lessons/0009-busca-a-estrela-astar.html`) — ✅ **Disponível**
   - *Conceitos:* $f(n) = g(n) + h(n)$, admissibilidade em árvores, consistência em grafos, eficiência ótima.
10. **0010 - A\* com Aprofundamento Iterativo (IDA\*)** (`lessons/0010-a-estrela-aprofundamento-iterativo-ida.html`) — ✅ **Disponível**
    - *Conceitos:* Patamares de corte baseados em $f(n)$, atualização pelo menor valor podado, economia de RAM.

### Módulo Especial: Prova Final
11. **0011 - Simulado Geral: Exame Completo de Busca** (`lessons/0011-simulado-geral-exame-completo.html`) — ✅ **Disponível**
    - *Conceitos:* 12 questões integradas de nível de prova universitária sobre um único grafo ponderado e heurístico com becos sem saída, armadilhas de custo e heurísticas inadmissíveis. Sem pistas no formato dos inputs.

---

## 📑 Fichas de Consulta Rápida (Cheat Sheets)
1. **Tabela de Referência: Buscas Não Informadas** (`reference/0001-tabela-buscas-cegas.html`) — ✅ **Disponível**
2. **Ficha de Referência: Buscas Informadas e Heurísticas** (`reference/0002-formulas-e-heuristicas-guia-rapido.html`) — ✅ **Disponível**

---

## ⚠️ Pontos de Tropeço / Atenção Mapeados (Para Fixação)
- [ ] **BFS e Custos de Aresta:** Menor número de passos $\neq$ menor custo acumulado. BFS só é ótima com custos unitários ($c = 1$).
- [ ] **Gargalo Prático da BFS:** Limitação de memória $O(b^d)$ é muito mais crítica na prática do que o tempo de CPU.
- [ ] **Fila FIFO:** Filhos entram no final da fila (atrás dos nós do mesmo nível gerados anteriormente).
- [ ] **Momento do Teste de Meta:** BFS testa na geração; UCS e A* testam na retirada da fila de prioridade.
- [ ] **Desempate Alfabético Invertido na Pilha (DFS):** Para visitar $A$ antes de $B$, empilha-se $B$ antes de $A$ (o topo sai primeiro na LIFO).
- [ ] **Memória da DFS ($O(b \cdot m)$):** Crescimento linear com a profundidade máxima, economizando gigabytes em relação à BFS.
- [ ] **Subotimalidade da DFS e Backtracking:** Podem encontrar um caminho profundo e custoso antes de avaliar opções rasas.
- [ ] **Incompletude em Árvore com Ciclos:** Sem registro de nós visitados (busca em grafo), DFS e Busca Gulosa entram em loop infinito.
- [ ] **Geração sob Demanda no Backtracking:** Filhos irmãos não são criados antecipadamente; apenas 1 filho é instanciado por vez (memória $O(m)$).
- [ ] **Os 3 Retornos do DLS:** Distinguir claramente Solução, Falha Definitiva (árvore inteira sem nós cortados) e Cutoff (nós podados no limite $L$).
- [ ] **Sobrecarga de Regeneração do IDS:** O nível folha é gerado apenas 1 vez; o overhead sobre a BFS é de apenas ~11% com memória $O(b \cdot d)$.
- [ ] **Exigência de Passos Positivos ($\epsilon > 0$) na UCS:** Evita sequências infinitas de passos com custo nulo ou decrescente.
- [ ] **Miopia do Hill Climbing:** Fica preso no primeiro máximo local porque sua regra irrevogável proíbe passos que piorem o valor atual.
- [ ] **Admissibilidade não Salva a Busca Gulosa:** Mesmo com $h$ admissível, a Busca Gulosa continua sendo subótima por ignorar o custo acumulado $g(n)$.
- [ ] **Admissibilidade (Árvores) vs Consistência (Grafos) no A\*:** Em busca em grafo com fechados, a heurística deve ser consistente ($h(n) \le c + h(n')$) para evitar fechar nós antes da melhor rota.
- [ ] **Avanço do Limite no IDA\*:** O novo limite não é $+1$, é dinamicamente o menor valor de $f(n)$ que foi podado na iteração anterior.
