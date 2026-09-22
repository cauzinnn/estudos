# Registro de Progresso — Inteligência Computacional: Algoritmos de Busca

Documento de acompanhamento contínuo da jornada de aprendizagem ativa para a prova de Inteligência Computacional.

## 🎯 Status Atual
- **Tópico Principal:** Algoritmos de Busca (Cegas e Heurísticas)
- **Total de Lições Concluídas e Disponíveis:** 10 lições interativas completas
- **Total de Fichas de Referência:** 2 cheat sheets detalhados
- **Interface e Recursos:** Dark mode nativo, KaTeX ($\LaTeX$), formulários interativos com feedback diagnóstico imediato e persistência local de tropeços.

---

## 📚 Trilha de Lições

### Módulo 1: Buscas Não Informadas (Cegas)
1. **0001 - Busca em Largura (BFS)** (`lessons/0001-busca-em-largura-bfs.html`)
   - *Conceitos:* Camadas concêntricas, Fila FIFO, teste de meta na geração vs retirada, complexidades $O(b^d)$ tempo e espaço.
   - *Pegadinha tratada:* Otimalidade da BFS falha se as arestas tiverem custos variáveis (menor número de passos $\neq$ menor custo).
2. **0002 - Busca em Profundidade (DFS)** (`lessons/0002-busca-em-profundidade-dfs.html`)
   - *Conceitos:* Pilha LIFO, mergulho em ramos profundos, memória linear $O(b \cdot m)$ vs tempo $O(b^m)$.
   - *Pegadinha tratada:* Ordem inversa de empilhamento para garantir desempate alfabético no topo da pilha.
3. **0003 - Busca com Retrocesso (Backtracking)** (`lessons/0003-busca-com-retrocesso-backtracking.html`)
   - *Conceitos:* Geração de apenas 1 filho por vez, retrocesso em dead-ends, verificação de ciclos no caminho de ancestrais.
   - *Pegadinha tratada:* Consumo de memória estritamente $O(m)$ (menor que o $O(b \cdot m)$ da DFS).
4. **0004 - Busca com Limite de Profundidade 6 (DLS L=6)** (`lessons/0004-busca-profundidade-limite-6-dls.html`)
   - *Conceitos:* Poda artificial em $depth = 6$, comportamento do nó na borda do limite.
   - *Pegadinha tratada:* Os 3 retornos do DLS (Solução, Falha Definitiva e Cutoff quando $d > 6$).
5. **0005 - Aprofundamento Iterativo com 4 Iterações (IDS)** (`lessons/0005-aprofundamento-iterativo-4-iteracoes-ids.html`)
   - *Conceitos:* Execução sequencial de DLS incrementando $L$ ($0, 1, 2, 3$). Otimalidade da BFS com espaço linear da DFS.
   - *Pegadinha tratada:* 4 iterações cobrem até $L = 3$ (e não 4!). Predominância do nível folha $b^d$ mitigando o overhead de regeneração.
6. **0006 - Busca de Custo Uniforme / Busca Ordenada (UCS)** (`lessons/0006-busca-custo-uniforme-ucs.html`)
   - *Conceitos:* $f(n) = g(n)$, Fila de Prioridades (Min-Heap), relaxação de custos na fronteira.
   - *Pegadinha tratada:* Teste de meta **obrigatoriamente na retirada** da fila; condição de custos $\ge \epsilon > 0$ para completude.

### Módulo 2: Buscas Informadas (Heurísticas)
7. **0007 - Busca Irrevogável (Hill Climbing)** (`lessons/0007-busca-irrevogavel-hill-climbing.html`)
   - *Conceitos:* Busca local míope, descarte definitivo de alternativas (sem memória de retrocesso), espaço $O(1)$.
   - *Pegadinha tratada:* Os 3 algozes de prova: Máximos Locais, Platôs/Ombros e Cumes.
8. **0008 - Busca Gulosa (Greedy Best-First)** (`lessons/0008-busca-gulosa-greedy.html`)
   - *Conceitos:* $f(n) = h(n)$, Fila de Prioridades pela menor estimativa, manutenção de fronteira para retrocesso.
   - *Pegadinha tratada:* Subotimalidade severa causada por negligenciar o custo acumulado $g(n)$ em prol de heurísticas tentadoras.
9. **0009 - Algoritmo de Busca A\* (A-Star)** (`lessons/0009-busca-a-estrela-astar.html`)
   - *Conceitos:* $f(n) = g(n) + h(n)$, fila ordenada por $f$, eficiência ótima.
   - *Pegadinha tratada:* Provas de admissibilidade ($0 \le h \le h^*$) em árvores, consistência ($h(n) \le c + h(n')$) em grafos, e o gargalo de memória $O(b^d)$.
10. **0010 - A\* com Aprofundamento Iterativo (IDA\*)** (`lessons/0010-a-estrela-aprofundamento-iterativo-ida.html`)
    - *Conceitos:* Cortes baseados em patamares de $f(n)$, execução com backtracking e memória linear $O(b \cdot d)$.
    - *Pegadinha tratada:* Novo limiar definido estritamente pelo **menor valor de $f(n)$ dentre os nós podados**, e não incremento de $+1$.

---

## 📑 Fichas de Referência Rápida (Cheat Sheets)
1. **Quadro Comparativo dos 10 Algoritmos** (`reference/0001-tabela-comparativa-algoritmos-busca.html`): Matriz comparativa completa de fronteira, teste de meta, completude, otimalidade, complexidades de tempo/espaço e armadilhas.
2. **Guia de Fórmulas e Heurísticas** (`reference/0002-formulas-e-heuristicas-guia-rapido.html`): Definições formais de Admissibilidade, Consistência/Monotonicidade, Dominância heurística (8-Puzzle) e regras de limiar do IDA*.

---

## ⚠️ Pontos de Tropeço / Atenção Acumulados (Para Revisão Ativa)
Estes são os tópicos mais cobrados em avaliações acadêmicas onde os estudantes costumam perder pontos:
- [ ] **Quando testar a meta na UCS e no A\*:** Nunca na geração! Sempre na retirada da fila de prioridade com menor custo/menor $f$.
- [ ] **Diferença de espaço entre DFS e Backtracking:** DFS guarda $O(b \cdot m)$ nós (irmãos na pilha); Backtracking guarda $O(m)$ (apenas o caminho atual).
- [ ] **Desempate alfabético na Pilha LIFO:** A ordem de empilhamento deve ser invertida para que o nó com prioridade alfabética fique no topo.
- [ ] **DLS com $L=6$ e meta além do limite:** O retorno é `Cutoff`, e não `Falha Definitiva`.
- [ ] **IDS com 4 iterações:** O índice inicia em $L=0$, logo a 4ª iteração atinge $L=3$.
- [ ] **Consistência $\implies$ Admissibilidade:** Toda heurística consistente é admissível, mas a recíproca nem sempre é verdadeira.
- [ ] **Atualização de patamar no IDA\*:** $\text{Threshold}_{\text{novo}} = \min \{ f(n) \mid f(n) > \text{Threshold}_{\text{antigo}} \}$.
- [ ] **Dominância no 8-Puzzle:** Distância Manhattan domina Peças Fora do Lugar ($h_2(n) \ge h_1(n)$) e expande menos nós.
