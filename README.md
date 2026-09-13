# Introdução

O uso de animais reais na medicina veterinária é um tema debatido entre os profissionais da área. Como forma preservar o bem-estar animal, normas e alternativas foram desenvolvidas com o objetivo de reduzir e substituir o uso de animais durante atividades pedagógicas e científicas, além de aprimorar os métodos já utilizados.

Nesse contexto, o uso de simuladores didáticos são eficazes no treinamento de habilidades clínicas, contribuindo para a redução da ansiedade e permitindo a repetição ilimitada das técnicas.

O projeto de um conjunto consiste no desenvolvimento de um simulador canino de baixo custo para o estudo de ausculta pulmonar e cardíaca, utilizando de componentes relacionados a Desenvolvimento Mobile, Web e Sistemas Embarcados com Internet das Coisas (IoT).  

# Tecnologias
* Typescript
* React
* Tailwind
* CSS
* HTML

# Como executar

1. Clone o repositório online do github em sua máquina.
```bash
git clone https://github.com/EnricoBertozzi/Echoes-Web.git

cd Echoes-Web
```

2. Baixe as dependências do projeto.
```bash
npm install
```

3. Execute o projeto em ambiente de desenvolvimento, build para produção ou via Docker.

**AMBIENTE de DESENVOLVIMENTO**
```bash
npm run dev
```

**BUILD PARA PRODUÇÃO**
```bash
npm run build
```

**DOCKER**
```bash
docker build -t echoes-web .

docker run -p 3000:3000 --name echoes-web echoes-web
```
