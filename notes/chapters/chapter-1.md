# Capítulo 1 - What is Ethereum?

## 1. ¿Qué es Ethereum?

1. Ethereum desde una perspectiva computacional: una máquina de estados determinista pero prácticamente ilimitada, compuesta por un estado único accesible a nivel global y una máquina virtual que aplica cambios a dicho estado.
2. Ethereum desde una perspectiva práctica: una infraestructura descentralizada de código abierto que permite ejecutar programas llamados *smart contracts*. Utiliza una blockchain para sincronizar y almacenar los cambios de estado del sistema. Utiliza la criptomoneda Ether para medir y limitar los costes de los recursos de ejecución.

## 2. Ethereum vs Bitcoin

- Bitcoin nace con el propósito de crear una moneda descentralizada, se presenta como *electronic cash*. A diferencia de Ethereum, nace con el propósito de ser una plataforma global de computación descentralizada.
- Bitcoin cuenta con un lenguaje de programación limitado a sentencias de verdadero o falso. Ethereum es Turing-complete, lo que significa que dentro de su plataforma podemos desarrollar cualquier programa de computadora. Ethereum está concebido como una computadora.
- En 2022 la actualización *The Merge* genera otro cambio importante que lo diferencia aún más de Bitcoin: el paso del sistema proof of work a proof of stake.

## 3. Componentes de una blockchain y clientes de Ethereum

- Una red P2P que conecta a todos los participantes propagando las transacciones y nuevos bloques.
- Mensajes en forma de transacciones que representan un cambio en el estado.
- Un conjunto de reglas que gobierna qué es una transacción y cómo se realiza una transición de estado.
- Una máquina de estados que procesa transacciones de acuerdo a las reglas establecidas.
- Un algoritmo de consenso que descentraliza el control de la blockchain forzando a los participantes a cooperar.
- Un sistema de incentivos sano que asegura económicamente el estado de la red en un entorno abierto.
- Una o más implementaciones de código abierto de cada componente (clientes).

## 4. Permissioned and permissionless, public and private

El capítulo categoriza las blockchains respecto a los requisitos de participación y el acceso al público.

## 5. Birth of Ethereum

- Ethereum surge como respuesta a las limitaciones de Bitcoin para soportar aplicaciones más complejas directamente sobre la cadena. Construir sobre Bitcoin implicaba aceptar restricciones fuertes; crear una blockchain nueva implicaba rehacer toda la infraestructura.
- A fines de 2013 Vitalik Buterin propone una blockchain de propósito general y Turing-complete. Gavin Wood se suma temprano al proyecto y ayuda a convertir la idea en protocolo e implementación.
- El cambio conceptual clave fue pasar de una blockchain pensada solo para dinero programable a una plataforma general de computación descentralizada, capaz de servir de base para casos como DeFi, NFTs y DAOs.
- El bloque génesis de Ethereum se mina el 30 de julio de 2015.

## 6. Stages of Development

- El desarrollo de Ethereum se organizó en cuatro grandes etapas, cada una introduciendo hard forks y cambios no retrocompatibles.
  1. Frontier: lanzamiento inicial en 2015, pensado para mineros y desarrolladores. Permitió probar la red y las primeras dApps; también introdujo la *difficulty bomb* para incentivar la transición futura fuera de proof of work.
  2. Homestead: mejora la seguridad y estabilidad del protocolo mediante actualizaciones que hacen a Ethereum más seguro y amigable para desarrolladores, aunque aún en etapa beta.
  3. Metropolis: aumenta la funcionalidad de la red y facilita la creación de dApps. Incluye forks como Byzantium, Constantinople e Istanbul, con mejoras de seguridad, costos de gas y escalabilidad.
  4. Serenity: etapa asociada a Ethereum 2.0 y al paso de proof of work a proof of stake. Busca mayor sustentabilidad, eficiencia y capacidad de escalar.
- Serenity se divide además en varias subetapas: *The Merge*, *The Surge*, *The Scourge*, *The Verge*, *The Purge* y *The Splurge*.

## 7. A general-purpose blockchain

- Bitcoin puede entenderse como una máquina de estados distribuida que rastrea la propiedad de su moneda. Ethereum también es una máquina de estados distribuida, pero en lugar de limitarse a saldos, mantiene un almacenamiento general de datos tipo clave-valor.
- Ethereum puede almacenar código y datos en su estado y ejecutar ese código sobre la EVM. La blockchain registra cómo cambia esa “memoria” global a lo largo del tiempo.
- La idea central es que Ethereum responde a la pregunta: ¿qué pasa si podemos programar cualquier transición de estado arbitraria en una computadora mundial gobernada por consenso?

## 8. Ethereum components

- Red P2P: Ethereum opera sobre la red principal usando el protocolo ÐΞVp2p y el puerto TCP 30303.
- Reglas de consenso: originalmente Ethash (proof of work); desde *The Merge*, proof of stake.
- Transacciones: mensajes de red que incluyen remitente, destinatario, valor y un campo de datos.
- Máquina de estados: la Ethereum Virtual Machine (EVM), una máquina virtual basada en pila que ejecuta bytecode. Los *smart contracts* se escriben en lenguajes de alto nivel como Solidity y luego se compilan.
- Estructuras de datos: cada nodo guarda el estado y las transacciones en una base de datos local, normalmente LevelDB, organizada con estructuras hash como el Merkle-Patricia trie.
- Seguridad económica y consenso: en proof of stake los validadores bloquean capital para participar en la validación y asegurar la red.
- Clientes: Ethereum utiliza clientes interoperables de ejecución y consenso, como Geth o Nethermind para ejecución y Prysm o Lighthouse para consenso.

## 9. Turing completeness

- Un sistema Turing-complete puede simular cualquier máquina de Turing; es decir, puede ejecutar cualquier algoritmo computable, dado suficiente tiempo y memoria finita.
- Ethereum es Turing-complete porque la EVM puede ejecutar programas almacenados, leer y escribir memoria y producir transiciones de estado arbitrarias.
- Esta flexibilidad trae un problema: no puede saberse por adelantado si un programa va a terminar o cuánto recurso va a consumir. Ese es el problema del *halting problem*.
- Para limitar ese riesgo Ethereum usa *gas*: cada instrucción tiene un costo y toda transacción fija un máximo de gas. Si se agota, la ejecución se detiene. Así se habilita cómputo general sin permitir consumo infinito de recursos.

## 10. dApps

- Ethereum evoluciona rápidamente de ser una blockchain programable a ser una plataforma para construir aplicaciones descentralizadas o dApps.
- Una dApp incluye como mínimo un *smart contract* desplegado en blockchain y una interfaz web para el usuario.
- En una visión más completa también puede integrar almacenamiento P2P y mensajería descentralizada, aunque en la práctica muchas dApps actuales combinan contratos inteligentes con frontends web más tradicionales.

## 11. Web3

- Web3 representa la “tercera edad” de internet: una evolución desde aplicaciones web centralizadas hacia aplicaciones construidas sobre protocolos descentralizados.
- El concepto fue impulsado por Gavin Wood y propone que la lógica, los datos y la coordinación de las aplicaciones dependan menos de intermediarios centrales y más de redes abiertas y P2P.
- En ese marco, Ethereum se presenta como una pieza fundamental para aplicaciones web con propiedad, ejecución y reglas compartidas a nivel de protocolo.

## 12. Development culture

- La cultura de desarrollo de Bitcoin es conservadora: prioriza estabilidad, compatibilidad hacia atrás y cambios lentos. Ethereum, en cambio, privilegia la evolución rápida y la innovación, incluso si eso rompe compatibilidad.
- En Ethereum los cambios se coordinan públicamente y los desarrolladores deben asumir que la plataforma seguirá evolucionando. Eso obliga a construir con flexibilidad y estar listos para migrar contratos, usuarios y fondos.
- Existe una tensión importante entre desplegar software sobre una infraestructura “inmutable” y, al mismo tiempo, trabajar sobre una plataforma que todavía cambia de forma activa.
- La ventaja de esta cultura es que acelera la innovación; la desventaja es que exige más adaptación por parte de quienes desarrollan sobre Ethereum.

## Recursos de la sesión

- Slides: https://drive.google.com/file/d/1kZLWj9N8C96wh-Ow2iV1D-Q9G_IU_4CU/view?usp=drive_link
- Replay playlist: https://www.youtube.com/playlist?list=PLvTXryB-aecnlPmF9cyA8svSmezw7bTX_
