# Git ve GitHub Akisi (Sadece Bu Klasor)

## Neden bu yontem?

Amac, bootcamp icindeki diger klasorleri hic etkilemeden sadece bu yeni projeyi GitHub'a gondermek.

## Adimlar

1. Terminalde proje klasorune gir:

```bash
cd '/Users/hnidakd/Downloads/FULL-STACK HW/product-stock-homework'
```

2. Git baslat:

```bash
git init
```

3. `.gitignore` olustur (asagidaki icerigi ekle):

```gitignore
# Node
node_modules/
dist/

# .NET
bin/
obj/

# Env
.env
.env.*

# OS
.DS_Store
```

4. Ilk ekleme ve commit:

```bash
git add .
git commit -m "chore: initialize product stock homework structure"
```

5. GitHub'da bos repo ac ve remote bagla:

```bash
git remote add origin <REPO_URL>
git branch -M main
git push -u origin main
```

## Commit Mesaji Kurali

- Emoji kullanma
- Kisa ve acik olsun
- Ornekler:
  - `feat(api): add products endpoints`
  - `feat(web): add product form and delete action`
  - `docs: add setup and usage guide`
