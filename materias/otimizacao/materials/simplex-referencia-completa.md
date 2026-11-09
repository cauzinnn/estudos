# Algoritmo Simplex: Fundamentos Teóricos, Algébricos e Computacionais

Este documento serve como referência técnica detalhada para a construção da lição completa e interativa sobre o **Algoritmo Simplex**, cobrindo desde a formulação em forma padrão até variantes avançadas (Duas Fases, Big-M, Degenerescência e Simplex Dual).

---

## 1. Origem e Interpretação Geométrica

Desenvolvido por **George Dantzig em 1947**, o Algoritmo Simplex resolve problemas de Programação Linear (PL):

$$\begin{aligned}
\min \quad & c^T x \\
\text{sujeito a} \quad & A x = b \\
& x \ge 0
\end{aligned}$$

onde $A \in \mathbb{R}^{m \times n}$ com posto completo $m < n$, $b \ge 0$, $c \in \mathbb{R}^n$, e $x \in \mathbb{R}^n$.

### 1.1 Vértices e Soluções Básicas Factíveis (SBF)
O Teorema Fundamental da Programação Linear estabelece:
1. Se existir uma solução viável e o valor ótimo for finito, então existe pelo menos um vértice (ponto extremo) do poliedro que é ótimo.
2. Cada vértice do poliedro $\{x \in \mathbb{R}^n \mid Ax = b, x \ge 0\}$ corresponde bijetivamente a uma **Solução Básica Factível (SBF)**.
3. O Simplex caminha de um vértice para um vértice adjacente através de arestas unidimensionais do poliedro, garantindo decréscimo estrito (ou não aumento) da função objetivo a cada passo.

---

## 2. Forma Padrão de Programação Linear

Para aplicar o tableau Simplex, todo modelo deve ser convertido para a forma padrão:
1. **Minimização**: $\max c^T x \iff -\min (-c^T x)$.
2. **Restrições de Desigualdade ($\le$)**: adiciona-se uma variável de folga $s_i \ge 0$:
   $$a_i^T x \le b_i \iff a_i^T x + s_i = b_i, \quad s_i \ge 0$$
3. **Restrições de Desigualdade ($\ge$)**: subtrai-se uma variável de excesso $e_i \ge 0$:
   $$a_i^T x \ge b_i \iff a_i^T x - e_i = b_i, \quad e_i \ge 0$$
4. **Lado Direito Não Negativo**: se $b_i < 0$, multiplica-se toda a equação por $-1$ antes de introduzir as folgas/excessos.
5. **Variáveis Livres ($x_j \in \mathbb{R}$)**: substitui-se por $x_j = x_j^+ - x_j^-$ com $x_j^+, x_j^- \ge 0$.

---

## 3. Álgebra Linear da Partição Básica

Dada a matriz $A = [B \mid N]$ e particionando o vetor de variáveis $x = [x_B^T, x_N^T]^T$:
- $B \in \mathbb{R}^{m \times m}$: matriz quadrada e invertível (colunas básicas).
- $N \in \mathbb{R}^{m \times (n-m)}$: colunas não básicas.
- $x_B \in \mathbb{R}^m$: variáveis básicas.
- $x_N \in \mathbb{R}^{n-m}$: variáveis não básicas, arbitrariamente fixadas em $0$.

O sistema de restrições torna-se:
$$B x_B + N x_N = b \implies x_B = B^{-1}b - B^{-1}N x_N$$

Fixando $x_N = 0$:
$$x_B = B^{-1}b$$

A solução é **básica factível** se $x_B \ge 0$ (isto é, $B^{-1}b \ge 0$).

### 3.1 Custos Reduzidos ($\bar{c}$)
Substituindo $x_B$ na função objetivo $z = c_B^T x_B + c_N^T x_N$:
$$z = c_B^T (B^{-1}b - B^{-1}N x_N) + c_N^T x_N = c_B^T B^{-1}b + (c_N^T - c_B^T B^{-1}N) x_N$$

Definimos o vetor de multiplicadores simplex (variáveis duais) como:
$$\pi^T = c_B^T B^{-1}$$

E os **custos reduzidos** das variáveis não básicas:
$$\bar{c}_N^T = c_N^T - c_B^T B^{-1}N = c_N^T - \pi^T N$$

- **Critério de Otimalidade (Minimização)**: Se $\bar{c}_j \ge 0$ para todo $j \in N$, a solução atual é ótima global.
- **Critério de Otimalidade (Maximização)**: Se expressarmos a linha do tableau como $z - \sum (c_j - z_j) x_j = c_B^T B^{-1}b$, a otimalidade ocorre quando todos os coeficientes na linha $z$ são $\ge 0$ (ou se $\bar{c}_j \le 0$ na definição de taxa de aumento).

---

## 4. O Teste da Razão Mínima (Min-Ratio Test)

Ao escolher uma variável não básica $x_k$ com custo reduzido favorável para entrar na base, aumentamos seu valor de $0$ para $\theta \ge 0$.
As variáveis básicas variam conforme:
$$x_B = B^{-1}b - (B^{-1}A_{\cdot k})\theta = \bar{b} - y_k \theta$$
onde $y_k = B^{-1}A_{\cdot k}$.

Para manter $x_B \ge 0$:
$$\bar{b}_i - y_{ik} \theta \ge 0 \implies \theta \le \frac{\bar{b}_i}{y_{ik}} \quad \text{para todo } y_{ik} > 0$$

O passo máximo permitido é:
$$\theta^* = \min_{i: y_{ik} > 0} \left( \frac{\bar{b}_i}{y_{ik}} \right)$$

A linha $r$ que atinge o mínimo define a **variável básica que sai da base** (torna-se zero).

---

## 5. Eliminação de Gauss-Jordan (Pivoteamento)

Seja $y_{rk}$ o elemento pivô (interseção da linha de saída $r$ com a coluna de entrada $k$):
1. **Normalização da Linha Pivô**:
   $$\text{Linha}_r^{(novo)} = \frac{\text{Linha}_r}{y_{rk}}$$
2. **Atualização das Demais Linhas $i \ne r$**:
   $$\text{Linha}_i^{(novo)} = \text{Linha}_i - y_{ik} \cdot \text{Linha}_r^{(novo)}$$
3. **Atualização da Linha de Custo $z$**:
   $$\text{Linha}_z^{(novo)} = \text{Linha}_z - \bar{c}_k \cdot \text{Linha}_r^{(novo)}$$

---

## 6. Casos Especiais no Simplex

### 6.1 Múltiplas Soluções Ótimas
Ocorre quando o tableau atinge o critério de parada ótimo, mas existe uma variável não básica $x_j$ cujo custo reduzido $\bar{c}_j = 0$. Pivoteando nessa variável, encontramos outro vértice ótimo com o mesmo valor de $z^*$, e qualquer combinação convexa entre eles é igualmente ótima.

### 6.2 Solução Ilimitada (Unbounded)
Se uma variável $x_k$ é elegível para entrar na base, mas **todos** os elementos da coluna pivô são não positivos ($y_{ik} \le 0$ para todo $i$), não há limite superior para $\theta$ ($\theta^* \to \infty$). A função objetivo pode crescer/decrescer indefinidamente.

### 6.3 Degenerescência e Ciclagem
Uma SBF é degenerada se pelo menos uma variável básica possui valor zero ($\bar{b}_i = 0$). Isso pode resultar em $\theta^* = 0$, onde a base muda mas o vértice físico e o valor de $z$ permanecem idênticos.
- **Risco de Ciclagem**: o algoritmo pode visitar a mesma sequência de bases indefinidamente.
- **Regra de Bland**: Em caso de empate na variável entrante ou sainte, escolha sempre a variável de menor índice $j$. Garante terminação finita sem ciclagem.

---

## 7. Inicialização: Métodos de Duas Fases e Big-M

Quando a origem $x=0$ não é uma solução básica viável (ex: restrições $\ge$ ou $=$):

### 7.1 Método das Duas Fases
1. **Fase 1**: Adicionam-se variáveis artificiais $a_i \ge 0$ em cada restrição sem folga canônica. Resolve-se o problema auxiliar:
   $$\min W = \sum_{i} a_i$$
   - Se $W^* > 0$: o problema original é **INVIÁVEL** ($\mathcal{P} = \emptyset$).
   - Se $W^* = 0$: todas as variáveis artificiais saíram da base (ou são zero). Encontrou-se uma SBF inicial viável para o problema original.
2. **Fase 2**: Descartam-se as variáveis artificiais, restaura-se a função objetivo original $z$, calcula-se a linha de custos reduzidos e prossegue-se com o Simplex convencional.

### 7.2 Método do Grande M
Substitui a função objetivo original adicionando uma penalidade severa $M \gg 0$:
$$\min z = c^T x + M \sum a_i \quad \text{ou} \quad \max z = c^T x - M \sum a_i$$
Requer zerar os coeficientes de $a_i$ na linha $z$ do tableau inicial via operações elementares antes de iniciar o Simplex.

---

## 8. Algoritmo Simplex Dual

Usado quando o tableau possui **otimalidade dual** ($\bar{c}_j \ge 0$), mas **inviabilidade primal** (algum $\bar{b}_i < 0$). É essencial em análise de sensibilidade e algoritmos de Branch & Bound (onde novos cortes deixam a solução anterior inviável).

1. **Variável que Sai**: Escolhe-se a linha $r$ com o lado direito mais negativo:
   $$r = \arg\min_i \{\bar{b}_i \mid \bar{b}_i < 0\}$$
2. **Critério de Inviabilidade Dual**: Se $y_{rj} \ge 0$ para todas as variáveis $j$, o primal é infactível.
3. **Variável que Entra (Razão Mínima Dual)**:
   $$k = \arg\min_{j: y_{rj} < 0} \left\{ \frac{\bar{c}_j}{|y_{rj}|} \right\}$$
4. **Pivoteamento**: Executa-se a eliminação de Gauss-Jordan em $y_{rk}$.

---

## Referências
- Dantzig, G. B. (1963). *Linear Programming and Extensions*. Princeton University Press.
- Bertsimas, D., & Tsitsiklis, J. N. (1997). *Introduction to Linear Optimization*. Athena Scientific.
- Vanderbei, R. J. (2020). *Linear Programming: Foundations and Extensions*. Springer.
- Bazaraa, M. S., Jarvis, J. J., & Sherali, H. D. (2011). *Linear Programming and Network Flows*. Wiley.
