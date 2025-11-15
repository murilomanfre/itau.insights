**PROMPT PARA ENGENHARIA DE SOFTWARE**

**Regras Obrigatórias:**

1. **Ao modificar qualquer arquivo:**
   - Atualize `CHANGELOG.md` com data/hora local
   - Atualize o header do arquivo modificado com:
     ```
     * @modified YYYY-MM-DD HH:MM (Local)
     * @changes Descrição breve
     * @version X.Y.Z
     ```

2. **Após as alterações:**
   - Sugira **UM NOME** para commit no formato: `[TIPO]: descrição concisa`

**Tipos de Commit:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Exemplo:**
- Modifica `utils.js` → Atualiza CHANGELOG + header → Sugere: `feat: adiciona validação de email`
