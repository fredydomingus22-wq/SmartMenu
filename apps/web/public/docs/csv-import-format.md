# Guia de Formato de Ficheiro CSV para Importação de Produtos

Para garantir que os seus produtos são importados corretamente para o **SmartMenu**, o seu ficheiro CSV deve seguir a estrutura abaixo.

## Estrutura do Ficheiro

O ficheiro deve ser codificado em **UTF-8** e utilizar a **vírgula (,)** como separador de campos.

### Cabeçalhos Obrigatórios

- **name**: O nome do produto (ex: Picanha na Brasa).
- **price**: O preço unitário. Utilize ponto ou vírgula para decimais (ex: 5500.00 ou 5500,00).
- **category**: A categoria do produto (ex: Carnes, Bebidas). Se a categoria não existir, será criada automaticamente.

### Cabeçalhos Opcionais

- **description**: Uma breve descrição do produto.
- **image_url**: Link direto para a imagem do produto (deve começar com http:// ou https://).
- **is_available**: Define se o produto está visível no menu. Valores aceites: `true` (sim) ou `false` (não). Se omitido, assume-se `true`.

## Exemplo de Conteúdo

```csv
name,description,price,category,is_available
Pizza Margherita,Molho de tomate e mozzarella,12.50,Pizzas,true
Burguer Classic,Hambúrguer de 150g,8.50,Burguers,true
Sumo de Laranja,Natural e fresco,2.00,Bebidas,true
```

## Dicas para uma Importação de Sucesso

1. **Remova cabeçalhos extras**: Garanta que apenas as colunas suportadas estão presentes.
2. **Evite caracteres especiais em cabeçalhos**: Assegure-se de que os nomes das colunas estão escritos exatamente como mostrado acima (em minúsculas).
3. **Imagens**: Para melhores resultados, utilize URLs de imagens já hospedadas na web (ex: Dropbox, Google Drive - links diretos).
