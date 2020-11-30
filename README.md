# Aquaberry

O Aquaberry é um aparelho que possibilite à automação dos cuidados de um aquário marinho. Controlando as variáveis do ambiente através de atuadores, sensores e um micro controlador. Além disso possibilita o acesso das informações e controle do dispositivo remotamente via web.

![Foto do Protótipo](https://github.com/mpsalome/aquaberry/blob/master/protipo.jpeg?raw=true)

## Arquitetura

O Frontend do aquaberry foi desenvolvido utilizando VueJS e está hospedado no Heroku. O backend é um servidor Node.js utilizando o framework Express rodando a partir de um Raspberry Pi que além  do servidor controla todos os atuadores e monitora os sensores. Todas as informações são salvas num banco SQLite3.

![Arquitetura do Projeto](https://github.com/mpsalome/aquaberry/blob/master/arquitetura.png?raw=true)

## Circuito

![Circuito do Protótipo](https://github.com/mpsalome/aquaberry/blob/master/circuito.jpg?raw=true)