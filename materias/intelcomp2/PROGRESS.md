# Registro de Progresso — intelcomp2: Algoritmos de Busca

Documento de acompanhamento contínuo da disciplina **intelcomp2**, orientado ao aprendizado ativo e pelo erro para o domínio completo de algoritmos de busca clássicos e heurísticos.

---

## 🎯 Status da Disciplina
- **Módulo Atual:** Módulo 1 — Buscas Não Informadas (Cegas)
- **Lições Disponíveis:** 1 de 10
- **Fichas de Referência Disponíveis:** 1 de 2
- **Metodologia:** Teoria concisa (< 5 min), exercícios diagnósticos imediatos, rastreamento de mesa e persistência de tropeços conceituais.

---

## 📚 Trilha Completa de Conteúdo

### Módulo 1: Buscas Não Informadas (Cegas)
1. **0001 - Busca em Largura (BFS)** (`lessons/0001-busca-em-largura-bfs.html`) — ✅ **Disponível**
   - *Conceitos:* Ondas concêntricas, Fila FIFO, teste de meta na geração, complexidades $O(b^d)$ tempo e espaço.
   - *Pegadinhas de prova:* Otimalidade da BFS falha se as arestas tiverem custos desiguais; consumo exponencial de RAM.
2. **0002 - Busca em Profundidade (DFS)** — ⏳ *Próxima*
   - *Conceitos:* Pilha LIFO, exploração em profundidade, memória linear $O(b \cdot m)$, desempate alfabético invertido no empilhamento.
3. **0003 - Busca com Retrocesso (Backtracking Search)** — ⏳ *Pendente*
   - *Conceitos:* Geração de 1 filho por vez, consumo estrito de memória $O(m)$, detecção de becos sem saída.
4. **0004 - DLS com Limite de Profundidade 6 (Depth-Limited Search)** — ⏳ *Pendente*
   - *Conceitos:* Corte em profundidade $L=6$, os 3 retornos (Solução, Falha Definitiva e Cutoff).
5. **0005 - Aprofundamento Iterativo com 4 Iterações (IDS)** — ⏳ *Pendente*
   - *Conceitos:* Execução em camadas incrementais ($L=0, 1, 2, 3$), combinando a otimalidade da BFS com o espaço da DFS.
6. **0006 - Busca de Custo Uniforme / Busca Ordenada (UCS)** — ⏳ *Pendente*
   - *Conceitos:* Fila de prioridades por $g(n)$, teste de meta na retirada, completude e otimalidade para custos arbitrários.

### Módulo 2: Buscas Informadas (Heurísticas)
7. **0007 - Busca Irrevogável (Hill Climbing / Irrevocable Search)** — ⏳ *Pendente*
   - *Conceitos:* Busca local míope, memória $O(1)$, máximos locais, platôs e cumes.
8. **0008 - Busca Gulosa (Greedy Best-First Search)** — ⏳ *Pendente*
   - *Conceitos:* $f(n) = h(n)$, fila de prioridade heurística, riscos de caminhos subótimos longos.
9. **0009 - Algoritmo de Busca A\* (A-Star Search)** — ⏳ *Pendente*
   - *Conceitos:* $f(n) = g(n) + h(n)$, admissibilidade em árvores, consistência em grafos, eficiência ótima.
10. **0010 - A\* com Aprofundamento Iterativo (IDA\*)** — ⏳ *Pendente*
    - *Conceitos:* Patamares de corte baseados em $f(n)$, atualização pelo menor valor podado, economia de RAM.

---

## 📑 Fichas de Consulta Rápida (Cheat Sheets)
1. **Tabela de Referência: Buscas Não Informadas** (`reference/0001-tabela-buscas-cegas.html`) — ✅ **Disponível**

---

## ⚠️ Pontos de Tropeço / Atenção Mapeados (Para Fixação)
- [ ] **BFS e Custos de Aresta:** Menor número de passos $\neq$ menor custo acumulado. BFS só é ótima com custos unitários ($c = 1$).
- [ ] **Gargalo Prático da BFS:** Limitação de memória $O(b^d)$ é muito mais crítica na prática do que o tempo de CPU.
- [ ] **Fila FIFO:** Filhos entram no final da fila (atrás dos nós do mesmo nível gerados anteriormente).
- [ ] **Momento do Teste de Meta:** BFS testa na geração; UCS testa na retirada da fila.
