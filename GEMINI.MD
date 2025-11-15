# ✍️ Instruções para Gemini: Engenharia de Software

Este documento define as regras obrigatórias que a IA deve seguir ao ajudar neste projeto, especialmente ao modificar arquivos e sugerir mensagens de commit.

---

## 1. Regras Obrigatórias

Estas regras devem ser seguidas em **todas** as solicitações que envolvam modificação de código-fonte.

### Regra 1: Ao Modificar Qualquer Arquivo

Qualquer alteração em um arquivo existente exige **duas** atualizações:

1.  **Atualizar `CHANGELOG.md`:** Adicione uma nova entrada com a data e hora local. A descrição da mudança deve estar sempre em **Português**.
2.  **Atualizar o Header do Arquivo Modificado:** Insira ou atualize o bloco de comentários no topo do arquivo com as seguintes informações:

    ```
    * @modified YYYY-MM-DD HH:MM (Local)
    * @changes Descrição breve da alteração (em Português)
    * @version X.Y.Z (próxima versão ou versão atual)
    ```

### Regra 2: Após Concluir as Alterações

Após aplicar as modificações e atualizar os cabeçalhos e o CHANGELOG, sua tarefa final é:

1.  Sugerir **UM NOME** para o commit.
2.  O nome do commit **DEVE** seguir o formato: `[TIPO]: descrição concisa`.
3.  A descrição do commit deve ser sempre em **Inglês**.

---

## 2. Tipos de Commit Permitidos (Em Inglês)

Use **apenas** um dos seguintes tipos ao sugerir o nome do commit:

* `feat`: (New feature)
* `fix`: (Bug fix)
* `docs`: (Documentation changes)
* `style`: (Formatting, lint, etc. - no logic change)
* `refactor`: (Code refactoring)
* `test`: (Adding or fixing tests)
* `chore`: (Build maintenance, dependencies, etc.)

---

## 3. Exemplo de Fluxo de Trabalho

**Solicitação do Usuário:** "Adicione validação de email na função `login` em `utils.js`."

**Sua Resposta (esperada):**

1.  (Modifica o arquivo `utils.js` com a nova lógica.)
2.  (Atualiza o header do `utils.js`):
    ```
    * @modified 2025-11-15 16:05 (Local)
    * @changes Adiciona função de validação de email
    * @version 1.2.1
    ```
3.  (Atualiza o `CHANGELOG.md`):
    ```
    ### 2025-11-15 16:05
    - [feat] Adiciona função de validação de email em utils.js
    ```
    *(Nota: Descrição em Português)*

4.  (Sugere o commit no final da resposta):

    **Sugestão de commit:**
    `feat: adds email validation to utils.js`
    *(Nota: Descrição em Inglês)*
````
